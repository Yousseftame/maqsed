import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { isSmtpConfigError, sendOfferEmail } from "@/lib/email/gmail";
import type { OfferEmailPayload, OfferEmailService } from "@/lib/email/offer-email";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_AGREEMENT_TYPES = new Set(["exclusive", "marketing", "services"]);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseServices(value: unknown): OfferEmailService[] | null {
  if (!Array.isArray(value) || value.length > 50) return null;
  return value.map((item) => ({
    description: asString((item as { description?: unknown })?.description, 200),
    price: asNumber((item as { price?: unknown })?.price),
  }));
}

function parsePayload(body: unknown, origin: string): OfferEmailPayload | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const offerId = asString(data.offerId, 128);
  const otp = asString(data.otp, 12);
  const developerEmail = asString(data.developerEmail, 120).toLowerCase();
  const agreementTypes = Array.isArray(data.agreementTypes)
    ? data.agreementTypes
        .filter((type): type is string => typeof type === "string" && ALLOWED_AGREEMENT_TYPES.has(type))
        .slice(0, 3)
    : [];
  const services = parseServices(data.services);

  if (!offerId || !/^[A-Za-z0-9_-]+$/.test(offerId)) return null;
  if (!/^\d{6}$/.test(otp)) return null;
  if (!isEmail(developerEmail)) return null;
  if (!services) return null;

  const title = asString(data.title, 200);
  const projectName = asString(data.projectName, 200);
  const offerNumber = asString(data.offerNumber, 32);
  if (!title || !projectName || !offerNumber) return null;

  return {
    offerId,
    offerNumber,
    title,
    description: asString(data.description, 4000),
    projectName,
    developerName: asString(data.developerName, 120),
    developerEmail,
    developerPhone: asString(data.developerPhone, 40),
    agreementTypes,
    services,
    subtotal: asNumber(data.subtotal),
    vat: asNumber(data.vat),
    total: asNumber(data.total),
    otp,
    offerUrl: `${origin}/offer/${offerId}`,
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
    return NextResponse.json({ error: "Invalid offer email payload", code: "invalid" }, { status: 400 });
  }

  try {
    await sendOfferEmail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isSmtpConfigError(error)) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 503 });
    }

    console.error("Offer email send failed", sendErrorCode(error));
    const code = sendErrorCode(error);
    const message =
      code === "auth_failed"
        ? "The mail server rejected the login for this mailbox. Check SMTP_USER and SMTP_PASS, then restart the server."
        : "Failed to send the offer email.";
    return NextResponse.json({ error: message, code }, { status: 502 });
  }
}
