"use client";

import { useMenuOptions } from "./useMenuOptions";
import { cn } from "@/lib/utils";

export function MenuValuePills({
  values,
  emptyLabel = "لا يوجد",
  size = "md",
}: {
  values?: unknown;
  emptyLabel?: string;
  size?: "sm" | "md";
}) {
  const { labels } = useMenuOptions();
  const list = labels(values);

  if (list.length === 0) {
    return <span className="text-sm font-medium text-[#8c8c8c]">{emptyLabel}</span>;
  }

  return (
    <div className={cn("flex flex-wrap", size === "sm" ? "gap-1" : "gap-2")}>
      {list.map((value) => (
        <span
          key={value}
          className={
            size === "sm"
              ? "rounded-full border border-[#0a0f1d]/10 bg-white px-2 py-0.5 text-[10px]"
              : "rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-bold text-[#0a0f1d]"
          }
        >
          {value}
        </span>
      ))}
    </div>
  );
}
