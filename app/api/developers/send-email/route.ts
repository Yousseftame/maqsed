import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { isSmtpConfigError, sendDeveloperEmail } from "@/lib/email/gmail";
import type { DeveloperEmailPayload } from "@/lib/email/developer-email";

export const runtime = "nodejs";
export const maxDuration = 30;

const LOGIN_NEXT = "/developer/dashboard";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function loginUrlFromOrigin(origin: string) {
  const base = origin.replace(/\/+$/, "");
  return `${base}/login?next=${encodeURIComponent(LOGIN_NEXT)}`;
}

function parsePayload(body: unknown, origin: string): DeveloperEmailPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const loginEmail = asString(data.email, 120).toLowerCase();
  const to = asString(data.to, 120).toLowerCase() || loginEmail;
  const password = typeof data.password === "string" ? data.password.slice(0, 128) : "";
  const firstName = asString(data.firstName, 80);
  const lastName = asString(data.lastName, 80);

  if (!firstName || !isEmail(loginEmail) || !isEmail(to)) return null;
  if (password.length < 6 || password.length > 128) return null;
  if (/\r|\n/.test(password)) return null;

  return {
    firstName,
    lastName,
    to,
    email: loginEmail,
    password,
    phone: asString(data.phone, 40),
    company: asString(data.company, 200),
    loginUrl: loginUrlFromOrigin(origin),
  };
}

function sendErrorCode(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("username and password") || lower.includes("eauth")) {
    return "auth_failed" as const;
  }
  return "send_failed" as const;
}

export async function POST(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE)?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const payload = parsePayload(body, request.nextUrl.origin);
  if (!payload) {
    return NextResponse.json({ error: "Invalid developer email payload", code: "invalid" }, { status: 400 });
  }

  try {
    await sendDeveloperEmail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isSmtpConfigError(error)) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 503 });
    }

    console.error("Developer email send failed", sendErrorCode(error));
    const code = sendErrorCode(error);
    const message =
      code === "auth_failed"
        ? "The mail server rejected the login for this mailbox. Check SMTP_USER and SMTP_PASS, then restart the server."
        : "Failed to send the developer account email.";
    return NextResponse.json({ error: message, code }, { status: 502 });
  }
}
