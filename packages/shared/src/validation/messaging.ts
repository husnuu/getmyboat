import { z } from "zod";
import { MessageSenderType } from "../enums";

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(4000),
  attachmentUrl: z.string().url().max(500).nullable().optional(),
});

export const joinConversationSchema = z.object({
  conversationId: z.string().min(1),
});

export const markReadSchema = z.object({
  conversationId: z.string().min(1),
  messageId: z.string().min(1),
});

export const restSendMessageSchema = z.object({
  body: z.string().min(1).max(4000),
  attachmentUrl: z.string().url().max(500).nullable().optional(),
});

export const messageCursorSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const messageSenderTypeSchema = z.nativeEnum(MessageSenderType);
