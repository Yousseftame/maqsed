import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { isSmtpConfigError, sendInterestEmail } from "@/lib/email/gmail";
import type { InterestEmailPayload } from "@/lib/email/interest-email";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_PAYMENT_TYPES = new Set(["cash", "finance"]);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parsePayload(body: unknown): InterestEmailPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const email = asString(data.email, 120).toLowerCase();
  const fullName = asString(data.fullName, 120);
  const unitNumber = asString(data.unitNumber, 80);
  const paymentTypes = Array.isArray(data.paymentTypes)
    ? data.paymentTypes
        .filter((type): type is "cash" | "finance" => typeof type === "string" && ALLOWED_PAYMENT_TYPES.has(type))
        .slice(0, 2)
    : [];

  if (!fullName || !unitNumber || !isEmail(email)) return null;

  return {
    fullName,
    email,
    phone: asString(data.phone, 40),
    unitNumber,
    projectName: asString(data.projectName, 200),
    paymentTypes,
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
  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Invalid interest email payload", code: "invalid" }, { status: 400 });
  }

  try {
    await sendInterestEmail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isSmtpConfigError(error)) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 503 });
    }

    console.error("Interest email send failed", sendErrorCode(error));
    const code = sendErrorCode(error);
    const message =
      code === "auth_failed"
        ? "The mail server rejected the login for this mailbox. Check SMTP_USER and SMTP_PASS, then restart the server."
        : "Failed to send the interest email.";
    return NextResponse.json({ error: message, code }, { status: 502 });
  }
}
