import { cn } from "@/lib/utils";

export const fieldClass =
  "h-12 w-full rounded-full bg-[#F4F4F4] px-5 text-sm font-medium text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EFEFEF]";

export function AdminButton({
  children,
  tone = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "danger";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        tone === "danger"
          ? "bg-[#FFE8E4] text-[#FF6A55] hover:bg-[#ffd7d1]"
          : "bg-[#0a0f1d] text-white hover:bg-[#161c2d]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
