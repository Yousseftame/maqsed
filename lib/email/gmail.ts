import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { OFFER_EMAIL_LOGO_CID, buildOfferEmail, type OfferEmailPayload } from "./offer-email";
import { buildInterestEmail, type InterestEmailPayload } from "./interest-email";
import { buildDeveloperEmail, type DeveloperEmailPayload } from "./developer-email";

export class SmtpConfigError extends Error {
  readonly code = "not_configured" as const;

  constructor() {
    super("Email is not configured. Add SMTP_USER and SMTP_PASS to .env.local");
    this.name = "SmtpConfigError";
  }
}

function cleanEnv(value?: string) {
  return value?.trim().replace(/^["']|["']$/g, "") ?? "";
}

const DEFAULT_FROM_EMAIL = "info@maqsad.sa";

function getSmtpCredentials() {
  const user = cleanEnv(process.env.SMTP_USER || process.env.GMAIL_USER);
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "")
    .replace(/\s/g, "")
    .replace(/^["']|["']$/g, "");
  if (!user || !pass) {
    throw new SmtpConfigError();
  }

  const host = cleanEnv(process.env.SMTP_HOST) || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const from = cleanEnv(process.env.SMTP_FROM) || DEFAULT_FROM_EMAIL;

  return { user, pass, host, port, from, secure: port === 465 };
}

function getLogoAttachment() {
  const logoPath = path.join(process.cwd(), "public", "logoadminpanel.png");
  if (!fs.existsSync(logoPath)) return [];
  return [
    {
      filename: "maqsed-logo.png",
      path: logoPath,
      cid: OFFER_EMAIL_LOGO_CID,
      contentDisposition: "inline" as const,
    },
  ];
}

export function isSmtpConfigError(error: unknown): error is SmtpConfigError {
  return error instanceof SmtpConfigError;
}

/** @deprecated Use isSmtpConfigError */
export const isGmailConfigError = isSmtpConfigError;

async function sendHtmlEmail(options: { to: string; subject: string; html: string; text: string; logLabel: string }) {
  const { user, pass, host, port, from, secure } = getSmtpCredentials();
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Maqsed" <${from}>`,
      replyTo: from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: getLogoAttachment(),
    });
  } catch (error) {
    const details = error as { code?: string; response?: string; responseCode?: number; command?: string };
    console.error(`${options.logLabel} SMTP error`, {
      code: details.code,
      command: details.command,
      responseCode: details.responseCode,
      response: typeof details.response === "string" ? details.response.slice(0, 200) : undefined,
      user,
      host,
      port,
      passLength: pass.length,
    });
    throw error;
  }
}

export async function sendOfferEmail(payload: OfferEmailPayload) {
  const { subject, html, text } = buildOfferEmail(payload);
  await sendHtmlEmail({
    to: payload.developerEmail,
    subject,
    html,
    text,
    logLabel: "Offer email",
  });
}

export async function sendInterestEmail(payload: InterestEmailPayload) {
  const { subject, html, text } = buildInterestEmail(payload);
  await sendHtmlEmail({
    to: payload.email,
    subject,
    html,
    text,
    logLabel: "Interest email",
  });
}

export async function sendDeveloperEmail(payload: DeveloperEmailPayload) {
  const { subject, html, text } = buildDeveloperEmail(payload);
  await sendHtmlEmail({
    to: payload.to,
    subject,
    html,
    text,
    logLabel: "Developer account email",
  });
}
