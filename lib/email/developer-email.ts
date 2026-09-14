import { OFFER_EMAIL_LOGO_CID } from "./offer-email";

export type DeveloperEmailPayload = {
  firstName: string;
  lastName?: string;
  to: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
  loginUrl: string;
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

export function developerDisplayName(payload: Pick<DeveloperEmailPayload, "firstName" | "lastName" | "email">) {
  const name = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
  return name || payload.email || "العميل";
}

export function buildDeveloperEmail(payload: DeveloperEmailPayload) {
  const greetingName = developerDisplayName(payload);
  const company = payload.company?.trim() || "";
  const subject = "بيانات الدخول إلى لوحة المطور — مقصد";
  const issueDate = formatIssueDate();

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
                    <p style="margin:0 0 10px;color:${LABEL};font-size:11px;font-weight:700;">حساب المطور</p>
                    <p style="margin:0 0 12px;color:${INK};font-size:14px;font-weight:800;">لوحة المطور</p>
                    <p style="margin:0 0 4px;color:${LABEL};font-size:11px;font-weight:700;">تاريخ الإنشاء</p>
                    <p style="margin:0;color:${INK};font-size:13px;font-weight:700;">${escapeHtml(issueDate)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 8px;">
              <h1 style="margin:0 0 10px;color:${INK};font-size:22px;line-height:1.45;font-weight:800;">تم إنشاء حسابكم بنجاح</h1>
              <p style="margin:0;color:${MUTED};font-size:14px;line-height:1.8;">مرحباً <span style="color:${INK};font-weight:700;">${escapeHtml(greetingName)}</span>، يسعدنا انضمامكم إلى مقصد. استخدموا البيانات أدناه لتسجيل الدخول إلى لوحة المطور.</p>
              ${
                company
                  ? `<p style="margin:10px 0 0;color:${MUTED};font-size:14px;">الشركة: <span style="color:${INK};font-weight:700;">${escapeHtml(company)}</span></p>`
                  : ""
              }
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
              <p style="margin:0 0 4px;color:${INK};font-size:15px;font-weight:800;">${escapeHtml(greetingName)}</p>
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
                    <p style="margin:0 0 6px;color:${LABEL};font-size:11px;font-weight:700;">البريد الإلكتروني</p>
                    <p style="margin:0;color:${INK};font-size:16px;font-weight:800;direction:ltr;text-align:right;font-family:Consolas,Courier,monospace;">${escapeHtml(payload.email)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;color:${LABEL};font-size:11px;font-weight:700;">كلمة المرور</p>
                    <p style="margin:0;color:${INK};font-size:16px;font-weight:800;direction:ltr;text-align:right;font-family:Consolas,Courier,monospace;">${escapeHtml(payload.password)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px;text-align:center;">
              <a href="${escapeHtml(payload.loginUrl)}" style="display:inline-block;background:${TEAL};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:12px;font-size:14px;font-weight:800;">تسجيل الدخول إلى لوحة المطور</a>
              <p style="margin:14px 0 0;color:${LABEL};font-size:12px;line-height:1.7;">أو انسخ الرابط:<br><a href="${escapeHtml(payload.loginUrl)}" style="color:${TEAL};word-break:break-all;">${escapeHtml(payload.loginUrl)}</a></p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px;">
              <p style="margin:0;color:${MUTED};font-size:13px;line-height:1.8;">يُرجى الاحتفاظ بهذه البيانات وعدم مشاركتها مع أي طرف آخر. ننصح بتغيير كلمة المرور بعد أول تسجيل دخول.</p>
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
    "يسعدنا إبلاغكم بأنه تم إنشاء حسابكم في منصة مقصد. يمكنكم الدخول إلى لوحة المطور باستخدام البيانات أدناه.",
    company ? `الشركة: ${company}` : "",
    "",
    `البريد الإلكتروني: ${payload.email}`,
    `كلمة المرور: ${payload.password}`,
    payload.phone ? `الهاتف: ${payload.phone}` : "",
    "",
    `رابط تسجيل الدخول: ${payload.loginUrl}`,
    "",
    "يُرجى الاحتفاظ بهذه البيانات وعدم مشاركتها. ننصح بتغيير كلمة المرور بعد أول تسجيل دخول.",
    "",
    "نسعد بخدمتكم.",
    "مقصد — ننمو معاً",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject, html, text };
}
