"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@getyourboat/shared";
import type { MessageDTO } from "@getyourboat/shared";
import { getAccessToken } from "../auth/token-store";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface MessagingSocketApi {
  socket: Socket | null;
  connected: boolean;
  joinConversation: (conversationId: string) => Promise<boolean>;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, body: string) => Promise<MessageDTO>;
  markRead: (conversationId: string, messageId: string) => void;
  onNewMessage: (handler: (message: MessageDTO) => void) => () => void;
}

export function useMessagingSocket(enabled = true): MessagingSocketApi {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const token = getAccessToken();
    if (!token) return;

    const socket = io(BASE, {
      auth: { token },
      transports: ["websocket"],
      path: "/socket.io",
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [enabled]);

  const joinConversation = useCallback((conversationId: string) => {
    const socket = socketRef.current;
    if (!socket) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      socket.emit(
        SOCKET_EVENTS.JOIN_CONVERSATION,
        { conversationId },
        (ack?: { ok?: boolean }) => resolve(!!ack?.ok)
      );
    });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, { conversationId });
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, body: string) => {
      const socket = socketRef.current;
      if (!socket) return Promise.reject(new Error("Socket bağlı değil"));
      return new Promise<MessageDTO>((resolve, reject) => {
        socket.emit(
          SOCKET_EVENTS.SEND_MESSAGE,
          { conversationId, body },
          (ack?: { ok?: boolean; message?: MessageDTO }) => {
            if (ack?.ok && ack.message) resolve(ack.message);
            else reject(new Error("Mesaj gönderilemedi"));
          }
        );
      });
    },
    []
  );

  const markRead = useCallback((conversationId: string, messageId: string) => {
    socketRef.current?.emit(SOCKET_EVENTS.MARK_READ, { conversationId, messageId });
  }, []);

  const onNewMessage = useCallback((handler: (message: MessageDTO) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    const listener = (payload: { message: MessageDTO }) => handler(payload.message);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, listener);
    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, listener);
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage,
    markRead,
    onNewMessage,
  };
}
