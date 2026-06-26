/** Socket.IO event names — single source of truth for api + clients. */
export const SOCKET_EVENTS = {
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  SEND_MESSAGE: "send_message",
  NEW_MESSAGE: "new_message",
  MESSAGE_ERROR: "message_error",
  TYPING: "typing",
  USER_TYPING: "user_typing",
  MARK_READ: "mark_read",
  MESSAGES_READ: "messages_read",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}
