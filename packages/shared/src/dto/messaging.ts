import type { MessageSenderType } from "../enums";

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  body: string;
  attachmentUrl: string | null;
  readAt: string | Date | null;
  createdAt: string | Date;
}

export interface ConversationDTO {
  id: string;
  reservationId: string;
  customerId: string;
  captainId: string;
  customerName: string;
  boatTitle: string | null;
  lastMessage: MessageDTO | null;
  unreadCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ConversationDetailDTO extends ConversationDTO {
  messages: MessageDTO[];
}

export interface MessagePageDTO {
  items: MessageDTO[];
  nextCursor: string | null;
}
