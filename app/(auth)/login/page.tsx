"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowUpRight, Loader2 } from "lucide-react";

const inputClass =
  "w-full bg-transparent border-b-2 border-[#8c8c8c]/40 pb-3 text-lg font-semibold text-[#0a0f1d] outline-none transition-colors duration-300 placeholder:text-[#0a0f1d]/30 focus:border-[#0a0f1d]";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium tracking-wide text-[#8c8c8c]">
          Welcome back
        </p>
        <h1 className="text-[2.6rem] font-bold leading-[1.1] tracking-tight text-[#0a0f1d]">
          Sign In to
          <br />
          your account.
        </h1>
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

        <label className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
              Password
            </span>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#0a0f1d] underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8c8c8c] transition-colors duration-200 hover:text-[#0a0f1d]"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#0a0f1d] px-7 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#161c2d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
