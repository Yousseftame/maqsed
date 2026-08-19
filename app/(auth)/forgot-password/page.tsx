"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#3E1854] outline-none transition-colors duration-300 placeholder:text-[#3E1854]/30 focus:border-[#17C3B3]";

const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = "maqsed-reset-cooldown";

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function readStoredEndsAt() {
  if (typeof window === "undefined") return null;
  const stored = Number(window.sessionStorage.getItem(COOLDOWN_KEY) || 0);
  return stored > Date.now() ? stored : null;
}

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { locale, t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setEndsAt(readStoredEndsAt());
  }, []);

  useEffect(() => {
    if (!endsAt) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt) {
        setEndsAt(null);
        window.sessionStorage.removeItem(COOLDOWN_KEY);
      }
    };

    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const remainingMs = endsAt ? Math.max(0, endsAt - now) : 0;
  const remainingSec = Math.ceil(remainingMs / 1000);
  const coolingDown = remainingMs > 0;
  const progress = coolingDown ? remainingMs / COOLDOWN_MS : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coolingDown) return;

    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      const nextEndsAt = Date.now() + COOLDOWN_MS;
      window.sessionStorage.setItem(COOLDOWN_KEY, String(nextEndsAt));
      setNow(Date.now());
      setEndsAt(nextEndsAt);
      toast.success(t("auth.resetSent"), { id: "reset-success" });
    } catch (err) {
      setError(
        t(
          err instanceof Error ? err.message : "auth.errors.resetFailed",
          t("auth.errors.resetFailed")
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-10">
        <Link
          href="/login"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-[#8c8c8c] transition-colors duration-200 hover:text-[#3E1854]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          {t("auth.backToSignIn")}
        </Link>
        <h1
          className={cn(
            "mb-4 font-bold tracking-tight text-[#3E1854]",
            locale === "ar"
              ? "text-[2.35rem] leading-[1.25]"
              : "text-[2.6rem] leading-[1.1]"
          )}
        >
          {t("auth.forgotTitle1")}
          <br />
          {t("auth.forgotTitle2")}
        </h1>
        <p className="text-base font-semibold leading-snug text-[#8c8c8c]">
          {t("auth.forgotDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <label className="flex flex-col gap-3">
          <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
            {t("auth.email")}
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            className={cn(inputClass, locale === "ar" && "text-right")}
            dir="ltr"
          />
        </label>

        {error ? (
          <p className="text-sm font-semibold text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={loading || coolingDown || !email}
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#3E1854] px-7 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#2b1039] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("auth.sendingLink")}
              </>
            ) : coolingDown ? (
              <>
                {t("auth.resendIn")} {formatCountdown(remainingSec)}
              </>
            ) : (
              <>
                {t("auth.sendReset")}
                <ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300", locale === "ar" ? "rotate-[-90deg] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
              </>
            )}
          </button>

          {coolingDown ? (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
                  {t("auth.waitResend")}
                </span>
                <span className="text-sm font-semibold tabular-nums text-[#3E1854]">
                  {formatCountdown(remainingSec)}
                </span>
              </div>
              <div className="h-[3px] w-full overflow-hidden bg-[#3E1854]/10">
                <div
                  className="h-full bg-[#3E1854] origin-start"
                  style={{
                    width: `${progress * 100}%`,
                    transition: "width 100ms linear",
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
