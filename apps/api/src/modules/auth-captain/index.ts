import type { FastifyInstance } from "fastify";
import { captainAuthRoutes } from "./controllers/auth.controller.js";

export async function captainAuthModule(app: FastifyInstance) {
  await app.register(captainAuthRoutes);
}
