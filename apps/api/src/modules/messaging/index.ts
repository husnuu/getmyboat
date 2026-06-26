import type { FastifyInstance } from "fastify";
import { messagingRoutes } from "./controllers/messaging.controller.js";

export async function messagingModule(app: FastifyInstance) {
  await app.register(messagingRoutes);
}
