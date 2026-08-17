import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function isJwt(value: unknown): value is string {
  return typeof value === "string" && value.split(".").length === 3;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!isJwt(body?.idToken)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "1", {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
