import { cn } from "@/lib/utils";

const TONES = {
  success: "bg-[#E8F8EF] text-[#83BF6E]",
  danger: "bg-[#FFE8E4] text-[#FF6A55]",
  warning: "bg-[#FFF4E5] text-[#FF9F43]",
  muted: "bg-[#F4F4F4] text-[#6B7280]",
  accent: "bg-[#EDE9FE] text-[#6D5BD0]",
  navy: "bg-[#0a0f1d] text-white",
  default: "bg-[#F4F4F4] text-[#0a0f1d]",
} as const;

export type StatusTone = keyof typeof TONES;

export function StatusBadge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
