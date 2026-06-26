import { conversationRepository } from "@getyourboat/database";
import { MessageSenderType } from "@getyourboat/shared";
import { forbidden, notFound, badRequest } from "../../../lib/errors.js";
import { assertSendRateLimit } from "../../../lib/rate-limit.js";
import { sanitizeMessageBody } from "../../../lib/sanitize.js";

function mapRepoError(err: unknown): never {
  const msg = err instanceof Error ? err.message : "";
  if (msg === "FORBIDDEN") throw forbidden();
  if (msg === "RESERVATION_NOT_FOUND") throw notFound("Rezervasyon bulunamadı");
  throw err;
}

export async function listConversations(captainId: string) {
  const items = await conversationRepository.listForCaptain(captainId);
  return { items };
}

export async function getConversation(captainId: string, id: string) {
  const conversation = await conversationRepository.findByIdForCaptain(id, captainId);
  if (!conversation) throw notFound("Sohbet bulunamadı");
  return { conversation };
}

export async function getByReservation(captainId: string, reservationId: string) {
  try {
    const conversation = await conversationRepository.getOrCreateForReservation(
      reservationId,
      captainId
    );
    return { conversation };
  } catch (err) {
    mapRepoError(err);
  }
}

export async function getMessages(
  captainId: string,
  conversationId: string,
  cursor?: string,
  limit?: number
) {
  try {
    return await conversationRepository.getMessages(
      conversationId,
      captainId,
      cursor,
      limit
    );
  } catch (err) {
    mapRepoError(err);
  }
}

export async function sendMessage(
  captainId: string,
  conversationId: string,
  body: string,
  attachmentUrl?: string | null
) {
  assertSendRateLimit(captainId);
  const clean = sanitizeMessageBody(body);
  if (!clean) throw badRequest("Mesaj boş olamaz");

  const allowed = await conversationRepository.isCaptainOfConversation(
    conversationId,
    captainId
  );
  if (!allowed) throw forbidden();

  return conversationRepository.createMessage({
    conversationId,
    senderId: captainId,
    senderType: MessageSenderType.CAPTAIN,
    body: clean,
    attachmentUrl,
  });
}

export async function markRead(
  captainId: string,
  conversationId: string,
  messageId: string
) {
  try {
    const count = await conversationRepository.markMessagesRead(
      conversationId,
      captainId,
      messageId
    );
    return { count };
  } catch (err) {
    mapRepoError(err);
  }
}

export async function assertConversationAccess(captainId: string, conversationId: string) {
  const ok = await conversationRepository.isCaptainOfConversation(conversationId, captainId);
  if (!ok) throw forbidden();
}
