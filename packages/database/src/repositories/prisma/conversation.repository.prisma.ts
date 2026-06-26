import type { MessageSenderType } from "@getyourboat/shared";
import { prisma } from "../../client.js";
import type {
  ConversationRepository,
  CreateMessageInput,
} from "../conversation.repository.js";
import { mapConversationRow, toMessageDTO } from "../conversation.repository.js";

const conversationInclude = {
  customer: { select: { name: true } },
  reservation: { include: { boat: { select: { title: true } } } },
  messages: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
  _count: {
    select: {
      messages: {
        where: { senderType: "CUSTOMER" as MessageSenderType, readAt: null },
      },
    },
  },
};

export class PrismaConversationRepository implements ConversationRepository {
  async listForCaptain(captainId: string) {
    const rows = await prisma.conversation.findMany({
      where: { captainId },
      include: conversationInclude,
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(mapConversationRow);
  }

  async findByIdForCaptain(id: string, captainId: string) {
    const row = await prisma.conversation.findFirst({
      where: { id, captainId },
      include: {
        customer: { select: { name: true } },
        reservation: { include: { boat: { select: { title: true } } } },
        messages: { orderBy: { createdAt: "asc" }, take: 50 },
        _count: {
          select: {
            messages: {
              where: { senderType: "CUSTOMER" as MessageSenderType, readAt: null },
            },
          },
        },
      },
    });
    if (!row) return null;
    const { messages, ...rest } = row;
    const base = mapConversationRow({
      ...rest,
      messages: messages.length > 0 ? [messages[messages.length - 1]!] : [],
    });
    return {
      ...base,
      messages: messages.map(toMessageDTO),
    };
  }

  async findByReservationForCaptain(reservationId: string, captainId: string) {
    const row = await prisma.conversation.findFirst({
      where: { reservationId, captainId },
      include: conversationInclude,
    });
    return row ? mapConversationRow(row) : null;
  }

  async getOrCreateForReservation(reservationId: string, captainId: string) {
    const existing = await this.findByReservationForCaptain(reservationId, captainId);
    if (existing) return existing;

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: reservationId,
        boat: { ownerId: captainId },
      },
      select: { id: true, customerId: true },
    });
    if (!reservation) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    const row = await prisma.conversation.create({
      data: {
        reservationId: reservation.id,
        customerId: reservation.customerId,
        captainId,
      },
      include: conversationInclude,
    });
    return mapConversationRow(row);
  }

  async getMessages(
    conversationId: string,
    captainId: string,
    cursor?: string,
    limit = 50
  ) {
    const access = await this.isCaptainOfConversation(conversationId, captainId);
    if (!access) {
      throw new Error("FORBIDDEN");
    }

    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.reverse().map(toMessageDTO);

    return {
      items,
      nextCursor: hasMore ? page[0]?.id ?? null : null,
    };
  }

  async createMessage(input: CreateMessageInput) {
    const row = await prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: input.senderId,
          senderType: input.senderType,
          body: input.body,
          attachmentUrl: input.attachmentUrl ?? null,
        },
      });
      await tx.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date() },
      });
      return message;
    });
    return toMessageDTO(row);
  }

  async markMessagesRead(conversationId: string, captainId: string, upToMessageId: string) {
    const access = await this.isCaptainOfConversation(conversationId, captainId);
    if (!access) {
      throw new Error("FORBIDDEN");
    }

    const anchor = await prisma.message.findFirst({
      where: { id: upToMessageId, conversationId },
      select: { createdAt: true },
    });
    if (!anchor) return 0;

    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        senderType: "CUSTOMER",
        readAt: null,
        createdAt: { lte: anchor.createdAt },
      },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async isCaptainOfConversation(conversationId: string, captainId: string) {
    const row = await prisma.conversation.findFirst({
      where: { id: conversationId, captainId },
      select: { id: true },
    });
    return !!row;
  }
}
