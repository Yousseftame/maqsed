import { formatServiceValue, type OfferServiceItem } from "@/features/admin/offers/offer-services";

export const AGREEMENT_LABELS: Record<string, string> = {
  exclusive: "حصري",
  marketing: "تسويقي",
  services: "تقديم خدمات",
};

export type OfferEmailService = OfferServiceItem;

export type OfferEmailPayload = {
  offerId: string;
  offerNumber: string;
  title: string;
  description?: string;
  projectName?: string;
  unitNumber?: string;
  developerName: string;
  developerEmail: string;
  developerPhone?: string;
  agreementTypes: string[];
  services: OfferEmailService[];
  subtotal: number;
  vat: number;
  total: number;
  otp: string;
  offerUrl: string;
};

export const OFFER_EMAIL_LOGO_CID = "maqsed-logo";

const TEAL = "#0d9488";
const INK = "#111827";
const MUTED = "#6b7280";
const LABEL = "#9ca3af";
const LINE = "#f3f4f6";
const PAGE = "#f3f4f6";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAmount(value: number) {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatSar(value: number) {
  return `SAR ${formatAmount(value)}`;
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");
}

function formatIssueDate() {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function buildOfferEmail(payload: OfferEmailPayload) {
  const greetingName = payload.developerName.trim() || "العميل";
  const description = payload.description?.trim() || "";
  const agreementLabels = payload.agreementTypes
    .map((type) => AGREEMENT_LABELS[type] || type)
    .filter(Boolean);
  const subject = `عرض فني — ${payload.title} (${payload.offerNumber})`;
  const offerNumber = payload.offerNumber.startsWith("#")
    ? payload.offerNumber
    : `#${payload.offerNumber}`;
  const issueDate = formatIssueDate();

  const agreementHtml = agreementLabels.length
    ? agreementLabels
        .map(
          (label) =>
            `<span style="display:inline-block;margin:0 0 8px 8px;padding:6px 12px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:${TEAL};font-size:12px;font-weight:700;">${escapeHtml(label)}</span>`
        )
        .join("")
    : `<span style="color:${MUTED};font-size:14px;">—</span>`;

  const servicesHtml = payload.services.length
    ? payload.services
        .map(
          (service) => `
            <tr>
              <td style="padding:12px 16px;border-bottom:1px solid ${LINE};font-size:14px;color:${INK};font-weight:500;white-space:pre-wrap;">${nl2br(service.description || "—")}</td>
              <td style="padding:12px 16px;border-bottom:1px solid ${LINE};font-size:14px;color:${INK};font-weight:800;text-align:left;white-space:nowrap;">${escapeHtml(formatServiceValue(service, true))}</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="2" style="padding:12px 16px;color:${MUTED};font-size:14px;">لا توجد بنود خدمات</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE};font-family:Tahoma,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" dir="rtl" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

          <tr>
            <td style="padding:28px 32px 22px;border-bottom:1px solid ${LINE};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="text-align:right;">
                    <img src="cid:${OFFER_EMAIL_LOGO_CID}" alt="مقصد MAQSED" height="36" style="height:36px;width:auto;max-width:160px;display:inline-block;border:0;">
                  </td>
                  <td valign="middle" style="text-align:left;width:46%;">
                    <p style="margin:0 0 10px;color:${LABEL};font-size:11px;font-weight:700;">رقم العرض</p>
                    <p style="margin:0 0 12px;color:${INK};font-size:14px;font-weight:800;direction:ltr;">${escapeHtml(offerNumber)}</p>
                    <p style="margin:0 0 4px;color:${LABEL};font-size:11px;font-weight:700;">تاريخ الإصدار</p>
                    <p style="margin:0;color:${INK};font-size:13px;font-weight:700;">${escapeHtml(issueDate)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h1 style="margin:0 0 8px;color:${INK};font-size:22px;line-height:1.45;font-weight:800;">${escapeHtml(payload.title)}</h1>
              ${
                payload.projectName?.trim()
                  ? `<p style="margin:0;color:${MUTED};font-size:14px;">المشروع: <span style="color:${INK};font-weight:700;">${escapeHtml(payload.projectName.trim())}</span></p>`
                  : ""
              }
              ${
                payload.unitNumber?.trim()
                  ? `<p style="margin:6px 0 0;color:${MUTED};font-size:14px;">الوحدة: <span style="color:${INK};font-weight:700;">${escapeHtml(payload.unitNumber.trim())}</span></p>`
                  : ""
              }
            </td>
          </tr>

          ${
            description
              ? `<tr>
            <td style="padding:18px 32px 8px;">
              <p style="margin:0 0 8px;color:${LABEL};font-size:11px;font-weight:700;">وصف العرض</p>
              <p style="margin:0;color:${INK};font-size:14px;line-height:1.8;">${nl2br(description)}</p>
            </td>
          </tr>`
              : ""
          }

          <tr>
            <td style="padding:18px 32px 8px;">
              <div style="height:1px;background:${LINE};font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 32px 8px;">
              <p style="margin:0 0 8px;color:${LABEL};font-size:11px;font-weight:700;">إلى</p>
              <p style="margin:0 0 4px;color:${INK};font-size:15px;font-weight:800;">${escapeHtml(payload.developerName || "—")}</p>
              <p style="margin:0 0 2px;color:${MUTED};font-size:13px;direction:ltr;text-align:right;">${escapeHtml(payload.developerEmail)}</p>
              ${
                payload.developerPhone
                  ? `<p style="margin:0;color:${MUTED};font-size:13px;direction:ltr;text-align:right;">${escapeHtml(payload.developerPhone)}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 8px;">
              <p style="margin:0 0 10px;color:${LABEL};font-size:11px;font-weight:700;">نوع الاتفاقية</p>
              ${agreementHtml}
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 8px;">
              <p style="margin:0 0 12px;color:${LABEL};font-size:11px;font-weight:700;">نطاق الخدمات المقدمة</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:8px;overflow:hidden;">
                <tr style="background:#f9fafb;">
                  <th style="padding:10px 16px;text-align:right;font-size:12px;font-weight:700;color:${MUTED};">الخدمة</th>
                  <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:700;color:${MUTED};white-space:nowrap;">القيمة</th>
                </tr>
                ${servicesHtml}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE};">
                <tr>
                  <td style="padding:14px 0 8px;color:${MUTED};font-size:14px;">المجموع قبل الضريبة</td>
                  <td style="padding:14px 0 8px;color:${INK};font-size:14px;font-weight:600;text-align:left;direction:ltr;">${formatSar(payload.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;color:${MUTED};font-size:14px;">ضريبة القيمة المضافة (15%)</td>
                  <td style="padding:0 0 12px;color:${INK};font-size:14px;font-weight:600;text-align:left;direction:ltr;">${formatSar(payload.vat)}</td>
                </tr>
                <tr>
                  <td style="padding:14px 0 0;border-top:1px solid #e5e7eb;color:${INK};font-size:16px;font-weight:800;">الإجمالي</td>
                  <td style="padding:14px 0 0;border-top:1px solid #e5e7eb;color:${INK};font-size:16px;font-weight:800;text-align:left;direction:ltr;">${formatSar(payload.total)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:12px 0 0;color:${LABEL};font-size:12px;line-height:1.8;">النسب والخدمات بدون تكلفة تظهر في النطاق ولا تُضاف إلى الإجمالي أو الضريبة.</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid ${LINE};border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;text-align:center;">
                    <p style="margin:0 0 8px;color:${LABEL};font-size:11px;font-weight:700;">رمز الوصول الآمن (OTP)</p>
                    <p style="margin:0;color:${INK};font-size:26px;letter-spacing:8px;font-weight:800;font-family:Consolas,Courier,monospace;">${escapeHtml(payload.otp)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 28px;text-align:center;">
              <a href="${escapeHtml(payload.offerUrl)}" style="display:inline-block;background:${TEAL};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:12px;font-size:14px;font-weight:800;">فتح العرض</a>
              <p style="margin:14px 0 0;color:${LABEL};font-size:12px;line-height:1.7;">أو انسخ الرابط:<br><a href="${escapeHtml(payload.offerUrl)}" style="color:${TEAL};word-break:break-all;">${escapeHtml(payload.offerUrl)}</a></p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px;text-align:center;border-top:1px solid ${LINE};background:#fafafa;">
              <p style="margin:0;color:${LABEL};font-size:12px;">مقصد — ننمو معاً</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `مرحباً ${greetingName}،`,
    "",
    `نرفق لكم العرض الفني رقم ${payload.offerNumber}${payload.projectName?.trim() ? ` لمشروع ${payload.projectName.trim()}` : ""}${payload.unitNumber?.trim() ? ` — الوحدة ${payload.unitNumber.trim()}` : ""}.`,
    `العنوان: ${payload.title}`,
    agreementLabels.length ? `نوع الاتفاقية: ${agreementLabels.join("، ")}` : "",
    description ? `الوصف:\n${description}` : "",
    payload.developerPhone ? `الهاتف: ${payload.developerPhone}` : "",
    "",
    ...payload.services.map(
      (service) => `- ${service.description || "—"}: ${formatServiceValue(service, true)}`
    ),
    "",
    `المجموع قبل الضريبة: ${formatSar(payload.subtotal)}`,
    `ضريبة القيمة المضافة (15%): ${formatSar(payload.vat)}`,
    `الإجمالي: ${formatSar(payload.total)}`,
    "النسب والخدمات بدون تكلفة تظهر في النطاق ولا تُضاف إلى الإجمالي أو الضريبة.",
    "",
    `رمز الوصول الآمن: ${payload.otp}`,
    `رابط العرض: ${payload.offerUrl}`,
    "",
    "نسعد بخدمتكم.",
    "مقصد",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject, html, text };
}
