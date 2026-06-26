import type { FastifyInstance } from "fastify";
import {
  adminBoatBrandRoutes,
  captainBoatBrandRoutes,
} from "./controllers/boat-brands.controller.js";

export async function boatBrandsModule(app: FastifyInstance) {
  await app.register(captainBoatBrandRoutes);
  await app.register(adminBoatBrandRoutes);
}
