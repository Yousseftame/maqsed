import { OFFER_EMAIL_LOGO_CID } from "./offer-email";

export const INTEREST_PAYMENT_LABELS: Record<string, string> = {
  cash: "كاش",
  finance: "تمويل",
};

export type InterestEmailPayload = {
  fullName: string;
  email: string;
  phone?: string;
  unitNumber: string;
  projectName: string;
  paymentTypes: Array<"cash" | "finance">;
};

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

function formatIssueDate() {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export function buildInterestEmail(payload: InterestEmailPayload) {
  const greetingName = payload.fullName.trim() || "العميل";
  const unitNumber = payload.unitNumber.trim() || "—";
  const projectNameRaw = payload.projectName.trim();
  const projectName = !projectNameRaw || projectNameRaw === "-" || projectNameRaw === "—" ? "مستقل" : projectNameRaw;
  const paymentLabels = payload.paymentTypes
    .map((type) => INTEREST_PAYMENT_LABELS[type] || type)
    .filter(Boolean);
  const subject = `شكراً لاهتمامك — الوحدة ${unitNumber}`;
  const issueDate = formatIssueDate();

  const paymentHtml = paymentLabels.length
    ? paymentLabels
        .map(
          (label) =>
            `<span style="display:inline-block;margin:0 0 8px 8px;padding:6px 12px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb;color:${TEAL};font-size:12px;font-weight:700;">${escapeHtml(label)}</span>`
        )
        .join("")
    : `<span style="color:${MUTED};font-size:14px;">—</span>`;

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
                    <p style="margin:0 0 10px;color:${LABEL};font-size:11px;font-weight:700;">طلب اهتمام</p>
                    <p style="margin:0 0 12px;color:${INK};font-size:14px;font-weight:800;">${escapeHtml(unitNumber)}</p>
                    <p style="margin:0 0 4px;color:${LABEL};font-size:11px;font-weight:700;">التاريخ</p>
                    <p style="margin:0;color:${INK};font-size:13px;font-weight:700;">${escapeHtml(issueDate)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h1 style="margin:0 0 10px;color:${INK};font-size:22px;line-height:1.45;font-weight:800;">شكراً لاهتمامك</h1>
              <p style="margin:0;color:${MUTED};font-size:14px;line-height:1.8;">مرحباً <span style="color:${INK};font-weight:700;">${escapeHtml(greetingName)}</span>، نشكرك على تسجيل اهتمامك. استلمنا طلبك وسيسعد فريق المبيعات بالتواصل معك في أقرب وقت.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 8px;">
              <div style="height:1px;background:${LINE};font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 32px 8px;">
              <p style="margin:0 0 8px;color:${LABEL};font-size:11px;font-weight:700;">بيانات التواصل</p>
              <p style="margin:0 0 4px;color:${INK};font-size:15px;font-weight:800;">${escapeHtml(payload.fullName || "—")}</p>
              <p style="margin:0 0 2px;color:${MUTED};font-size:13px;direction:ltr;text-align:right;">${escapeHtml(payload.email)}</p>
              ${
                payload.phone
                  ? `<p style="margin:0;color:${MUTED};font-size:13px;direction:ltr;text-align:right;">${escapeHtml(payload.phone)}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid ${LINE};border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid ${LINE};">
                    <p style="margin:0 0 4px;color:${LABEL};font-size:11px;font-weight:700;">رقم الوحدة</p>
                    <p style="margin:0;color:${INK};font-size:15px;font-weight:800;">${escapeHtml(unitNumber)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid ${LINE};">
                    <p style="margin:0 0 4px;color:${LABEL};font-size:11px;font-weight:700;">المشروع</p>
                    <p style="margin:0;color:${INK};font-size:15px;font-weight:800;">${escapeHtml(projectName)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;color:${LABEL};font-size:11px;font-weight:700;">طريقة الدفع</p>
                    ${paymentHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 28px;text-align:center;">
              <p style="margin:0;color:${MUTED};font-size:14px;line-height:1.8;">نسعد بخدمتكم، ونتطلع للتواصل معكم قريباً.</p>
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
    "شكراً لاهتمامك. استلمنا طلبك وسيتواصل معك فريق المبيعات في أقرب وقت.",
    "",
    `رقم الوحدة: ${unitNumber}`,
    `المشروع: ${projectName}`,
    paymentLabels.length ? `طريقة الدفع: ${paymentLabels.join("، ")}` : "",
    payload.phone ? `الهاتف: ${payload.phone}` : "",
    "",
    "نسعد بخدمتكم.",
    "مقصد — ننمو معاً",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject, html, text };
}
