"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export type DeveloperShareAccount = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
};

type Props = {
  account: DeveloperShareAccount | null;
  onClose: () => void;
};

function accountName(account: Pick<DeveloperShareAccount, "firstName" | "lastName" | "email">) {
  const name = `${account.firstName || ""} ${account.lastName || ""}`.trim();
  return name || account.email || "العميل";
}

const LOGIN_NEXT = "/developer/dashboard";

function loginUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/login?next=${encodeURIComponent(LOGIN_NEXT)}`;
}

function createdDeveloperEmail(account: DeveloperShareAccount) {
  return (account.email || "").trim();
}

function buildDeveloperMessage(account: DeveloperShareAccount, url: string) {
  const name = accountName(account);
  const company = (account.company || "").trim();
  const phone = (account.phone || "").trim();
  const email = createdDeveloperEmail(account);

  const lines = [
    "*مقصد*",
    "",
    `مرحباً *${name}*،`,
    "",
    "يسعدنا إبلاغكم بأنه تم إنشاء حسابكم في منصة مقصد للدخول إلى لوحة المطور.",
  ];

  if (company) {
    lines.push("", `الشركة: *${company}*`);
  }

  lines.push("", "*بيانات الدخول*", "البريد الإلكتروني:", email, "", "كلمة المرور:", account.password);

  if (phone) {
    lines.push("", `الجوال: ${phone}`);
  }

  lines.push(
    "",
    "رابط تسجيل الدخول:",
    url,
    "",
    "بعد تسجيل الدخول ستنتقل مباشرة إلى لوحة المطور.",
    "",
    "يُرجى الاحتفاظ بهذه البيانات وعدم مشاركتها. ننصح بتغيير كلمة المرور بعد أول دخول.",
    "",
    "نسعد بخدمتكم.",
    "مقصد — ننمو معاً"
  );

  return lines.join("\n");
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function DeveloperAccountSharePanel({
  account,
  showEmail = false,
  sendToEmail,
}: {
  account: DeveloperShareAccount;
  showEmail?: boolean;
  sendToEmail?: string;
}) {
  const { isRtl } = useLocale();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const loginEmail = createdDeveloperEmail(account);
  const recipientEmail = (sendToEmail || "").trim();

  useEffect(() => {
    setEmailSent(false);
    setIsSendingEmail(false);
  }, [account.email, account.password, recipientEmail]);

  const handleCopy = async (value: string, okAr: string, okEn: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(isRtl ? okAr : okEn);
    } catch {
      toast.error(isRtl ? "تعذر النسخ." : "Could not copy.");
    }
  };

  const handleWhatsApp = () => {
    if (!loginEmail || !account.password) {
      toast.error(isRtl ? "بيانات الدخول غير مكتملة." : "Login details are incomplete.");
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(buildDeveloperMessage(account, loginUrl()))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSendEmail = async () => {
    if (isSendingEmail) return;
    if (!recipientEmail) {
      toast.error(isRtl ? "لا يوجد بريد إلكتروني في تفاصيل العرض." : "The offer has no email address.");
      return;
    }
    if (!loginEmail || !account.password) {
      toast.error(isRtl ? "بيانات الدخول غير مكتملة." : "Login details are incomplete.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/developers/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: account.firstName,
          lastName: account.lastName || "",
          to: recipientEmail,
          email: loginEmail,
          password: account.password,
          phone: account.phone || "",
          company: account.company || "",
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const code = data?.code as string | undefined;
        if (code === "not_configured") {
          throw new Error(
            isRtl
              ? "البريد غير مُعد بعد. أضف SMTP_USER و SMTP_PASS في ملف .env.local ثم أعد تشغيل السيرفر."
              : "Email is not configured. Add SMTP_USER and SMTP_PASS to .env.local, then restart the server."
          );
        }
        if (code === "auth_failed") {
          throw new Error(
            isRtl
              ? "سيرفر البريد رفض تسجيل الدخول. تأكد من بريد des@cbrand.sa وكلمة المرور في .env.local ثم أعد تشغيل السيرفر."
              : "The mail server rejected the login. Check des@cbrand.sa and its password in .env.local, then restart the server."
          );
        }
        throw new Error(
          data?.error ||
            (isRtl ? "تعذر إرسال البريد. حاول مرة أخرى." : "Failed to send the email. Please try again.")
        );
      }
      setEmailSent(true);
      toast.success(
        isRtl ? `تم إرسال بيانات الدخول إلى ${recipientEmail}` : `Login details sent to ${recipientEmail}`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isRtl
            ? "تعذر إرسال البريد. حاول مرة أخرى."
            : "Failed to send the email. Please try again."
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F0F2F5] p-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#65676B]">{isRtl ? "بريد حساب المطور" : "Developer account email"}</p>
            <p dir="ltr" className="truncate text-sm font-bold text-[#1c1e21]">
              {loginEmail || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(loginEmail, "تم نسخ البريد.", "Email copied.")}
            title={isRtl ? "نسخ" : "Copy"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#1c1e21] shadow-sm transition-colors hover:bg-gray-50"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[#F0F2F5] p-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#65676B]">{isRtl ? "كلمة المرور" : "Password"}</p>
            <p dir="ltr" className="break-all font-mono text-sm font-bold text-[#1c1e21]">
              {account.password}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(account.password, "تم نسخ كلمة المرور.", "Password copied.")}
            title={isRtl ? "نسخ" : "Copy"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white text-[#1c1e21] shadow-sm transition-colors hover:bg-gray-50"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#25D366] text-sm font-bold text-white transition-colors hover:bg-[#1ebd58]"
        >
          <WhatsAppIcon />
          {isRtl ? "واتساب" : "WhatsApp"}
        </button>
        {showEmail ? (
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#F0F2F5] text-sm font-bold text-[#1c1e21] transition-colors hover:bg-[#E4E6E9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingEmail ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <img src="/google_mail_gmail_logo_icon_159346.webp" alt="Email" className="h-5 w-5 object-contain" />
            )}
            {isSendingEmail
              ? isRtl
                ? "جاري الإرسال..."
                : "Sending..."
              : emailSent
                ? isRtl
                  ? "إعادة الإرسال"
                  : "Resend"
                : isRtl
                  ? "ايميل"
                  : "Email"}
          </button>
        ) : null}
      </div>
      {showEmail && recipientEmail ? (
        <p className="mt-3 text-xs font-medium text-[#8c8c8c]">
          {isRtl ? "سيتم إرسال الإيميل إلى بريد العرض: " : "Email will be sent to the offer address: "}
          <span dir="ltr">{recipientEmail}</span>
        </p>
      ) : null}
    </div>
  );
}

export function DeveloperShareModal({ account, onClose }: Props) {
  const { isRtl } = useLocale();

  if (!account) return null;

  const name = accountName(account);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="relative z-10 w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center gap-4 border-b border-[#E5E5E5] pb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold text-[#1c1e21]">
                {isRtl ? "تم إنشاء حساب المطور" : "Developer account created"}
              </h3>
              <p className="text-sm font-medium text-[#65676B]">{name}</p>
            </div>
          </div>

          <DeveloperAccountSharePanel account={account} showEmail={false} />

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full text-center text-sm font-semibold text-[#65676B] transition-colors hover:text-[#1c1e21]"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function toDeveloperShareAccount(data: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}): DeveloperShareAccount {
  return {
    firstName: data.firstName.trim(),
    lastName: (data.lastName || "").trim() || undefined,
    email: data.email.trim(),
    password: data.password,
    phone: (data.phone || "").trim() || undefined,
    company: (data.company || "").trim() || undefined,
  };
}

const OFFER_SHARE_STORAGE_KEY = "maqsed.developerShareByOfferId";

function parseStoredAccount(value: unknown): DeveloperShareAccount | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const email = typeof row.email === "string" ? row.email.trim() : "";
  const password = typeof row.password === "string" ? row.password : "";
  const firstName = typeof row.firstName === "string" ? row.firstName.trim() : "";
  if (!email || !password || password.length < 6) return null;
  return {
    firstName: firstName || email,
    lastName: typeof row.lastName === "string" ? row.lastName.trim() || undefined : undefined,
    email,
    password,
    phone: typeof row.phone === "string" ? row.phone.trim() || undefined : undefined,
    company: typeof row.company === "string" ? row.company.trim() || undefined : undefined,
  };
}

export function loadDeveloperShareByOfferId(): Record<string, DeveloperShareAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OFFER_SHARE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<string, DeveloperShareAccount> = {};
    for (const [offerId, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!offerId) continue;
      const account = parseStoredAccount(value);
      if (account) result[offerId] = account;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveDeveloperShareForOffer(offerId: string, account: DeveloperShareAccount) {
  if (typeof window === "undefined" || !offerId) return;
  const next = { ...loadDeveloperShareByOfferId(), [offerId]: account };
  try {
    window.localStorage.setItem(OFFER_SHARE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures; in-memory state still works for this session.
  }
}
