import type { FastifyInstance } from "fastify";
import { photoUploadUrlSchema, profileSetupSchema } from "@getyourboat/shared";
import { parseDetailed } from "../../../lib/validate.js";
import * as service from "../services/profile.service.js";

export async function profileRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.requireAuth);

  app.get("/profile/me", async (req) => {
    const profile = await service.getProfile(req.authUser!.id);
    return { profile };
  });

  app.patch("/profile/me", async (req) => {
    const body = parseDetailed(profileSetupSchema, req.body);
    const profile = await service.updateProfile(req.authUser!.id, body);
    return { profile };
  });

  app.post("/profile/me/avatar/upload-url", async (req) => {
    const { fileName } = parseDetailed(photoUploadUrlSchema, req.body);
    return service.createAvatarUploadUrl(req.authUser!.id, fileName);
  });
}
