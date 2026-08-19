"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  const { t, isRtl } = useLocale();

  return (
    <div className="flex flex-1 min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-6xl font-black text-[#17C3B3]">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#3E1854] sm:text-5xl">
          {t("notFound.title")}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {t("notFound.subtitle")}
        </p>
        <p className="mt-2 text-sm leading-7 text-gray-500 max-w-md mx-auto">
          {t("notFound.description")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="group rounded-xl bg-[#3E1854] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#6A2B92] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E1854] transition-all flex items-center gap-2"
          >
            {isRtl ? (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            ) : (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            )}
            {t("notFound.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
