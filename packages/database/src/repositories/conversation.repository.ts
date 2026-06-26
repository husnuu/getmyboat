import type {
  ConversationDTO,
  ConversationDetailDTO,
  MessageDTO,
  MessagePageDTO,
} from "@getyourboat/shared";
import type { MessageSenderType } from "@getyourboat/shared";

export interface CreateMessageInput {
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  body: string;
  attachmentUrl?: string | null;
}

export interface ConversationRepository {
  listForCaptain(captainId: string): Promise<ConversationDTO[]>;
  findByIdForCaptain(id: string, captainId: string): Promise<ConversationDetailDTO | null>;
  findByReservationForCaptain(
    reservationId: string,
    captainId: string
  ): Promise<ConversationDTO | null>;
  getOrCreateForReservation(
    reservationId: string,
    captainId: string
  ): Promise<ConversationDTO>;
  getMessages(
    conversationId: string,
    captainId: string,
    cursor?: string,
    limit?: number
  ): Promise<MessagePageDTO>;
  createMessage(input: CreateMessageInput): Promise<MessageDTO>;
  markMessagesRead(
    conversationId: string,
    captainId: string,
    upToMessageId: string
  ): Promise<number>;
  isCaptainOfConversation(conversationId: string, captainId: string): Promise<boolean>;
}

export function toMessageDTO(row: {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  body: string;
  attachmentUrl: string | null;
  readAt: Date | null;
  createdAt: Date;
}): MessageDTO {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    senderType: row.senderType,
    body: row.body,
    attachmentUrl: row.attachmentUrl,
    readAt: row.readAt,
    createdAt: row.createdAt,
  };
}

function mapConversationRow(row: {
  id: string;
  reservationId: string;
  customerId: string;
  captainId: string;
  createdAt: Date;
  updatedAt: Date;
  customer: { name: string };
  reservation: { boat: { title: string | null } | null };
  messages: Array<{
    id: string;
    conversationId: string;
    senderId: string;
    senderType: MessageSenderType;
    body: string;
    attachmentUrl: string | null;
    readAt: Date | null;
    createdAt: Date;
  }>;
  _count: { messages: number };
}): ConversationDTO {
  const last = row.messages[0];
  return {
    id: row.id,
    reservationId: row.reservationId,
    customerId: row.customerId,
    captainId: row.captainId,
    customerName: row.customer.name,
    boatTitle: row.reservation.boat?.title ?? null,
    lastMessage: last ? toMessageDTO(last) : null,
    unreadCount: row._count.messages,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export { mapConversationRow };
