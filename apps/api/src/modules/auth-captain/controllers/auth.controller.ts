import type { FastifyInstance } from "fastify";
import { captainLoginSchema, logoutSchema, captainSignupSchema } from "@getyourboat/shared";
import { parseDetailed } from "../../../lib/validate.js";
import { env } from "../../../config/env.js";
import * as service from "../services/auth.service.js";

function setRefreshCookie(reply: import("fastify").FastifyReply, token: string, maxAgeDays = 30) {
  reply.setCookie(service.REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60,
  });
}

function clearRefreshCookie(reply: import("fastify").FastifyReply) {
  reply.clearCookie(service.REFRESH_COOKIE, { path: "/" });
}

function sessionResponse(
  reply: import("fastify").FastifyReply,
  session: Awaited<ReturnType<typeof service.signup>>,
  rememberMe?: boolean
) {
  setRefreshCookie(reply, session.refreshToken, rememberMe ? 30 : 30);
  return {
    accessToken: session.accessToken,
    user: session.user,
    refreshToken: session.refreshToken,
  };
}

export async function captainAuthRoutes(app: FastifyInstance) {
  app.post("/auth/signup", async (req, reply) => {
    const body = parseDetailed(captainSignupSchema, req.body);
    const session = await service.signup(app, body);
    return reply.code(201).send(sessionResponse(reply, session));
  });

  app.post("/auth/login", async (req, reply) => {
    const body = parseDetailed(captainLoginSchema, req.body);
    const session = await service.login(app, body);
    return sessionResponse(reply, session, body.rememberMe);
  });

  app.post("/auth/refresh", async (req, reply) => {
    const fromCookie = req.cookies?.[service.REFRESH_COOKIE];
    const fromBody = (req.body as { refreshToken?: string } | undefined)?.refreshToken;
    const token = fromCookie ?? fromBody;
    if (!token) {
      return reply.code(401).send({ message: "Oturum süresi doldu" });
    }
    const session = await service.refresh(app, token);
    return sessionResponse(reply, session);
  });

  app.post("/auth/logout", async (req, reply) => {
    const fromCookie = req.cookies?.[service.REFRESH_COOKIE];
    const body = req.body ? parseDetailed(logoutSchema, req.body) : null;
    const token = fromCookie ?? body?.refreshToken;
    if (token) await service.logout(token);
    clearRefreshCookie(reply);
    return { ok: true };
  });

  app.get("/auth/me", { onRequest: [app.requireAuth] }, async (req) => {
    return service.me(req.authUser!.id);
  });
}
