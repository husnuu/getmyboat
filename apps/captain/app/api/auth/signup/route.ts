import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const REFRESH_COOKIE = "gyb_refresh";
const MAX_AGE = 30 * 24 * 60 * 60;

async function proxyAuth(
  path: string,
  req: Request,
  options?: { forwardBody?: boolean }
) {
  const res = await fetch(`${API}/api/v1/auth/${path}`, {
    method: "POST",
    headers: options?.forwardBody ? { "Content-Type": "application/json" } : undefined,
    body: options?.forwardBody ? await req.text() : undefined,
  });
  const data = await res.json().catch(() => ({ message: "Sunucu hatası" }));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json({
    accessToken: data.accessToken,
    user: data.user,
  });

  if (data.refreshToken) {
    response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: MAX_AGE,
    });
  }

  return response;
}

export async function POST(req: Request) {
  return proxyAuth("signup", req, { forwardBody: true });
}
