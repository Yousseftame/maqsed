"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

type ShareButtonProps = {
  title: string;
  variant?: "property" | "unit";
  className?: string;
};

function getPageUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

function buildWhatsAppMessage(title: string, url: string, isRtl: boolean, variant: "property" | "unit") {
  if (isRtl) {
    const intro =
      variant === "unit"
        ? "يسرّنا مشاركتكم إحدى وحداتنا العقارية المميزة:"
        : "يسرّنا مشاركتكم أحد مشاريعنا العقارية المميزة:";
    return [
      "*مقصد*",
      "",
      intro,
      `*${title}*`,
      "",
      "للاطلاع على التفاصيل يرجى زيارة الرابط:",
      url,
      "",
      "مقصد — ننمو معاً",
    ].join("\n");
  }

  const intro =
    variant === "unit"
      ? "We are pleased to share one of our distinguished residential units:"
      : "We are pleased to share one of our distinguished real estate projects:";
  return [
    "*Maqsed*",
    "",
    intro,
    `*${title}*`,
    "",
    "View the full details via the following link:",
    url,
    "",
    "Maqsed — We grow together",
  ].join("\n");
}

export function ShareButton({ title, variant = "property", className }: ShareButtonProps) {
  const { isRtl } = useLocale();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function copyLink() {
    const url = getPageUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    toast.success(isRtl ? "تم نسخ الرابط" : "Link copied");
    window.setTimeout(() => setCopied(false), 1600);
    setOpen(false);
  }

  function shareWhatsApp() {
    const url = getPageUrl();
    const message = buildWhatsAppMessage(title, url, isRtl, variant);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]",
          className
        )}
      >
        <Share2 className="h-4 w-4" />
        {isRtl ? "مشاركة" : "Share"}
      </button>

      {open ? (
        <div className="absolute top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg end-0">
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {isRtl ? "نسخ الرابط" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            {isRtl ? "مشاركة عبر واتساب" : "Share on WhatsApp"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
