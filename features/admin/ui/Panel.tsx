import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex h-full flex-col rounded-[24px] bg-white p-5 sm:p-7", className)}>
      {title || action ? (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title ? (
            <h2 className="min-w-0 truncate text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
