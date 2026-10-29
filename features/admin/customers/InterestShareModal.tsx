"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { SalesRequest } from "./requests.service";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "كاش",
  finance: "تمويل",
};

type Props = {
  request: SalesRequest | null;
  onClose: () => void;
};

function paymentLabels(request: SalesRequest) {
  return (request.paymentTypes ?? [])
    .map((type) => PAYMENT_LABELS[type] || type)
    .filter(Boolean);
}

function buildInterestMessage(request: SalesRequest) {
  const name = (request.fullName || "").trim() || "العميل";
  const unitNumber = (request.unitNumber || "").trim() || "—";
  const projectRaw = (request.projectName || "").trim();
  const project = !projectRaw || projectRaw === "-" || projectRaw === "—" ? "مستقل" : projectRaw;
  const payments = paymentLabels(request);

  const lines = [
    "*مقصد*",
    "",
    `مرحباً *${name}*،`,
    "",
    "شكراً لاهتمامك، ويسعدنا تواصلك معنا.",
    "",
    "*طلب اهتمام*",
    `رقم الوحدة: *${unitNumber}*`,
    `المشروع: *${project}*`,
  ];

  if (payments.length) {
    lines.push(`طريقة الدفع: *${payments.join("، ")}*`);
  }

  lines.push("", "سيتواصل معك فريق المبيعات في أقرب وقت.", "", "نسعد بخدمتكم.", "مقصد — ننمو معاً");

  return lines.join("\n");
}

/**
 * Digits only for WhatsApp. Country code is required.
 * Local numbers like 01201411024 (Egypt) or 05xxxxxxxx (Saudi) are normalized.
 */
function toWhatsAppPhone(phone: string) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("20") && /^201[0125]\d{8}/.test(digits)) {
    return digits.slice(0, 12);
  }
  if (digits.startsWith("966") && /^9665\d{8}/.test(digits)) {
    return digits.slice(0, 12);
  }

  if (!digits.startsWith("0")) return digits;

  if (/^01[0125]/.test(digits)) {
    const eleven = digits.slice(0, 11);
    if (/^01[0125]\d{8}$/.test(eleven)) {
      return `20${eleven.slice(1)}`;
    }
  }

  if (/^05/.test(digits)) {
    const ten = digits.slice(0, 10);
    if (/^05\d{8}$/.test(ten)) {
      return `966${ten.slice(1)}`;
    }
  }

  const local = digits.slice(1);

  if (/^1[0125]\d{8}$/.test(local)) {
    return `20${local}`;
  }

  if (/^5\d{8}$/.test(local)) {
    return `966${local}`;
  }

  if (local.length === 10 && local.startsWith("1")) return `20${local}`;
  if (local.length === 9 && local.startsWith("5")) return `966${local}`;

  return digits;
}

function openWhatsAppAppChat(phone: string, message: string) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function InterestShareModal({ request, onClose }: Props) {
  const { isRtl } = useLocale();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    setEmailSent(false);
    setIsSendingEmail(false);
  }, [request?.id]);

  if (!request) return null;

  const destinationPhone = String(request.phone || "").trim();
  const whatsappPhone = toWhatsAppPhone(destinationPhone);

  const handleWhatsApp = () => {
    const phone = toWhatsAppPhone(destinationPhone);
    if (!phone) {
      toast.error(isRtl ? "لا يوجد رقم جوال لهذا الطلب." : "This request has no phone number.");
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      toast.error(
        isRtl
          ? "رقم الجوال غير صالح. استخدم رمز الدولة (مثال: 9665… أو 2010…)."
          : "Invalid phone number. Include country code (e.g. 9665… or 2010…)."
      );
      return;
    }

    const message = buildInterestMessage(request);
    void navigator.clipboard.writeText(message).catch(() => undefined);
    openWhatsAppAppChat(phone, message);
    toast.success(isRtl ? `فتح واتساب على +${phone}` : `Opening WhatsApp for +${phone}`);
  };

  const handleSendEmail = async () => {
    if (isSendingEmail) return;
    const email = (request.email || "").trim();
    if (!email) {
      toast.error(isRtl ? "لا يوجد بريد إلكتروني لهذا الطلب." : "This request has no email address.");
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/interest/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: request.fullName,
          email,
          phone: request.phone,
          unitNumber: request.unitNumber,
          projectName: request.projectName || "",
          paymentTypes: request.paymentTypes || [],
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
      toast.success(isRtl ? "تم إرسال رسالة الاهتمام بالبريد بنجاح." : "Interest email sent successfully.");
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

  const payments = paymentLabels(request);

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
                {isRtl ? "إرسال طلب الاهتمام" : "Send Interest Request"}
              </h3>
              <p className="text-sm font-medium text-[#65676B]">
                {isRtl ? `رقم الوحدة: ${request.unitNumber}` : `Unit: ${request.unitNumber}`}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-[12px] bg-[#F0F2F5] p-4">
            <p className="mb-1 text-sm font-bold text-[#1c1e21]">{request.fullName || "—"}</p>
            {request.projectName ? (
              <p className="mb-1 text-xs font-medium text-[#65676B]">{request.projectName}</p>
            ) : null}
            {payments.length ? (
              <p className="text-xs font-medium text-[#65676B]">{payments.join(" · ")}</p>
            ) : null}
          </div>

          {whatsappPhone ? (
            <p className="mb-2 text-center text-xs font-semibold text-[#65676B]" dir="ltr">
              {isRtl ? "سيتم الفتح على:" : "Will open chat with:"}{" "}
              <span className="font-bold text-[#1c1e21]">+{whatsappPhone}</span>
              {destinationPhone && toWhatsAppPhone(destinationPhone) !== destinationPhone.replace(/\D/g, "") ? (
                <span className="font-medium text-[#8c8c8c]"> ({destinationPhone})</span>
              ) : null}
            </p>
          ) : null}

          <div className="mb-6 flex gap-3">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#25D366] text-sm font-bold text-white transition-colors hover:bg-[#1ebd58]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              {isRtl ? "واتساب" : "WhatsApp"}
            </button>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#F0F2F5] text-sm font-bold text-[#1c1e21] transition-colors hover:bg-[#E4E6E9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingEmail ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <img src={BRAND_ASSETS.gmail} alt="Email" className="h-5 w-5 object-contain" />
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
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-sm font-semibold text-[#65676B] transition-colors hover:text-[#1c1e21]"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
