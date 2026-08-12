"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

const inputClass =
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#0a0f1d] outline-none transition-colors duration-300 placeholder:text-[#0a0f1d]/30 focus:border-[#0a0f1d]";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Reset link sent",
        description: `Check ${email} for instructions to reset your password.`,
      });
      setEmail("");
    }, 1200);
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-10">
        <Link
          href="/login"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-[#8c8c8c] transition-colors duration-200 hover:text-[#0a0f1d]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to sign in
        </Link>
        <h1 className="mb-4 text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[#0a0f1d]">
          Forgot your
          <br />
          password?
        </h1>
        <p className="text-base font-semibold leading-snug text-[#8c8c8c]">
          Enter your email address below and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <label className="flex flex-col gap-3">
          <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
            Email address
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={loading || !email}
          className="group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#0a0f1d] px-7 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#161c2d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending link…
            </>
          ) : (
            <>
              Send reset link
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
