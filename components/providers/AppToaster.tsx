"use client";

import { Toaster } from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export function AppToaster() {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3200,
        className: isAr ? "maqsed-toast" : "font-sans",
        style: {
          background: "#ffffff",
          color: "#0a0f1d",
          borderRadius: "10px",
          border: "1px solid rgba(10, 15, 29, 0.08)",
          boxShadow: "0 10px 30px rgba(10, 15, 29, 0.12)",
          padding: isAr ? "12px 18px" : "10px 14px",
          fontSize: isAr ? "15px" : "14px",
          fontWeight: isAr ? 400 : 500,
          letterSpacing: isAr ? "0" : "0.02em",
          lineHeight: isAr ? 1.7 : 1.4,
          maxWidth: isAr ? "24rem" : "22rem",
          direction: isAr ? "rtl" : "ltr",
          fontFamily: isAr
            ? "var(--font-noto-kufi), var(--font-cairo), sans-serif"
            : undefined,
        },
        success: {
          iconTheme: {
            primary: "#61d345",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff4b4b",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
