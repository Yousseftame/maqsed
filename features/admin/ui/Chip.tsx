import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Chip({
  children,
  onRemove,
  removeLabel,
  className,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 ps-3.5 pe-1.5 text-sm font-semibold text-[#0a0f1d]",
        className
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#8c8c8c] transition-colors duration-200 hover:bg-[#F4F4F4] hover:text-[#FF6A55]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      ) : null}
    </span>
  );
}
