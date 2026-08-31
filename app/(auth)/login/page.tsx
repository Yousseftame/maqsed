"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowUpRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getSafeNextPath, getDefaultRedirectPath } from "@/lib/auth/constants";
import { createSessionCookie } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#3E1854] outline-none transition-colors duration-300 placeholder:text-[#3E1854]/30 focus:border-[#17C3B3]";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginPageFallback() {
  return (
    <div className="flex w-full max-w-[440px] items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3E1854]/20 border-t-[#3E1854]" />
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userData, loading: authLoading, signIn } = useAuth();
  const { locale, t } = useLocale();
  const nextPath = getSafeNextPath(searchParams.get("next"), userData?.role);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirectingRef = useRef(false);
  const submittingRef = useRef(false);
  const [restoreFailed, setRestoreFailed] = useState(false);

  const goToApp = () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    router.replace(nextPath || getDefaultRedirectPath(userData?.role));
  };

  useEffect(() => {
    // We wait until both user and userData are loaded to redirect correctly
    if (authLoading || !user || !userData || redirectingRef.current || restoreFailed) {
      return;
    }

    void (async () => {
      try {
        await createSessionCookie(await user.getIdToken());
        toast.success(t("auth.welcomeBack"), { id: "login-success" });
        goToApp();
      } catch {
        setRestoreFailed(true);
        setError(t("auth.restoreFailed"));
      }
    })();
  }, [authLoading, restoreFailed, t, user, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    submittingRef.current = true;

    try {
      await signIn(email, password);
      // Success is handled by the useEffect once user and userData are loaded
    } catch (err) {
      submittingRef.current = false;
      redirectingRef.current = false;
      setError(
        t(err instanceof Error ? err.message : "auth.errors.generic", t("auth.signInFailed"))
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (user && !restoreFailed)) {
    return <LoginPageFallback />;
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium tracking-wide text-[#8c8c8c]">
          {t("auth.welcomeBack")}
        </p>
        <h1
          className={cn(
            "font-bold tracking-tight text-[#3E1854]",
            locale === "ar"
              ? "text-[2.35rem] leading-[1.25]"
              : "text-[2.6rem] leading-[1.1]"
          )}
        >
          {t("auth.signInTitle1")}
          <br />
          {t("auth.signInTitle2")}
        </h1>
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

        <label className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
              {t("auth.password")}
            </span>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#3E1854] underline-offset-2 hover:underline"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(inputClass, locale === "ar" ? "text-right pl-10" : "pr-10")}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute top-0 bottom-3 z-10 flex items-center text-[#8c8c8c] transition-colors duration-200 hover:text-[#3E1854]",
                locale === "ar" ? "left-0" : "right-0"
              )}
              tabIndex={-1}
              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </label>

        {error ? (
          <p className="text-sm font-semibold text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#3E1854] px-7 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#2b1039] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("auth.signingIn")}
            </>
          ) : (
            <>
              {t("auth.signIn")}
              <ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300", locale === "ar" ? "rotate-[-90deg] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5")} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
