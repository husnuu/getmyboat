import type { FastifyInstance } from "fastify";
import {
  messageCursorSchema,
  restSendMessageSchema,
} from "@getyourboat/shared";
import { parseDetailed } from "../../../lib/validate.js";
import * as service from "../services/messaging.service.js";

export async function messagingRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.requireAuth);

  app.get("/conversations", async (req) => {
    return service.listConversations(req.authUser!.id);
  });

  app.get("/conversations/by-reservation/:reservationId", async (req) => {
    const { reservationId } = req.params as { reservationId: string };
    return service.getByReservation(req.authUser!.id, reservationId);
  });

  app.get("/conversations/:id", async (req) => {
    const { id } = req.params as { id: string };
    return service.getConversation(req.authUser!.id, id);
  });

  app.get("/conversations/:id/messages", async (req) => {
    const { id } = req.params as { id: string };
    const { cursor, limit } = parseDetailed(messageCursorSchema, req.query);
    return service.getMessages(req.authUser!.id, id, cursor, limit);
  });

  app.post("/conversations/:id/messages", async (req) => {
    const { id } = req.params as { id: string };
    const body = parseDetailed(restSendMessageSchema, req.body);
    const message = await service.sendMessage(
      req.authUser!.id,
      id,
      body.body,
      body.attachmentUrl
    );
    return { message };
  });
}
