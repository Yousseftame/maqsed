"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
  className,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}) {
  const isDown = trend?.direction === "down";

  return (
    <article className={cn("rounded-[24px] bg-white p-5 sm:p-6", className)}>
      <div className="mb-6 flex items-center gap-2 text-[#0a0f1d]">
        {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} /> : null}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="text-[2rem] leading-none font-bold tracking-tight text-[#0a0f1d] sm:text-[2.35rem]">
          {value}
        </p>

        {trend || hint ? (
          <div className="mb-0.5 flex flex-col items-end gap-1">
            {trend ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
                  isDown ? "bg-[#FFE8E4] text-[#FF6A55]" : "bg-[#E8F8EF] text-[#83BF6E]"
                )}
              >
                {isDown ? (
                  <ArrowDownRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
                )}
                {trend.value}
              </span>
            ) : null}
            {hint ? (
              <span className="text-xs font-medium text-[#8c8c8c]">{hint}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
