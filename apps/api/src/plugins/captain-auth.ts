import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import { authRepository } from "@getyourboat/database";
import type { ProfileRole } from "@getyourboat/shared";

export interface AuthUser {
  id: string;
  email: string | null;
  role: ProfileRole;
}

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

function extractBearer(req: FastifyRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

async function resolveUser(req: FastifyRequest): Promise<AuthUser | null> {
  const token = extractBearer(req);
  if (!token) return null;

  try {
    const payload = await req.server.jwt.verify<{ sub: string; role: ProfileRole }>(token);
    if (!payload.sub) return null;
    const profile = await authRepository.findById(payload.sub);
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
    };
  } catch {
    return null;
  }
}

/** Verifies captain-issued JWT access tokens and attaches the profile to the request. */
export const captainAuthPlugin = fp(async (app) => {
  app.decorate(
    "requireAuth",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = await resolveUser(req);
      if (!user) {
        return reply.code(401).send({ message: "Unauthorized" });
      }
      req.authUser = user;
    }
  );

  app.decorate(
    "requireAdmin",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = await resolveUser(req);
      if (!user) {
        return reply.code(401).send({ message: "Unauthorized" });
      }
      if (user.role !== "ADMIN") {
        return reply.code(403).send({ message: "Forbidden: admin only" });
      }
      req.authUser = user;
    }
  );
});
