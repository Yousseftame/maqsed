import { cn } from "@/lib/utils";
import { fieldClass } from "@/features/admin/ui/AdminButton";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="text-sm font-semibold text-[#8c8c8c]">{label}</span>
      {children}
    </label>
  );
}

export const textareaClass =
  "min-h-[180px] w-full resize-y rounded-[20px] bg-[#F4F4F4] px-5 py-4 text-sm font-medium leading-relaxed text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EFEFEF]";

export { fieldClass };
