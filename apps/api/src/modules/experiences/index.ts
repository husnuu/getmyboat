import type { FastifyInstance } from "fastify";
import { experienceRoutes } from "./controllers/experiences.controller.js";

export async function experiencesModule(app: FastifyInstance) {
  await app.register(experienceRoutes);
}
