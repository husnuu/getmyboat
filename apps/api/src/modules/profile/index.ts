import type { FastifyInstance } from "fastify";
import { profileRoutes } from "./controllers/profile.controller.js";

export async function profileModule(app: FastifyInstance) {
  await app.register(profileRoutes);
}
