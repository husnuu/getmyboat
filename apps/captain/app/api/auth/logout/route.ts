import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const REFRESH_COOKIE = "gyb_refresh";

export async function POST() {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await fetch(`${API}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
