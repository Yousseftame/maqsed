"use client";

import { cn } from "@/lib/utils";

export type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  toolbar,
  empty,
  actions,
  actionsHeader,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  actionsHeader?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[24px] bg-white p-5 sm:p-7", className)}>
      {toolbar ? <div className="mb-5">{toolbar}</div> : null}

      {rows.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-[20px] bg-[#F4F4F4] px-4 py-10 text-sm font-medium text-[#8c8c8c]">
          {empty}
        </div>
      ) : (
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[860px] border-separate border-spacing-0">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "border-b border-[#0a0f1d]/8 px-4 py-3 text-start text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]",
                      column.headerClassName
                    )}
                  >
                    {column.header}
                  </th>
                ))}
                {actions ? (
                  <th className="border-b border-[#0a0f1d]/8 px-4 py-3 text-end text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]">
                    {actionsHeader}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={rowKey(row)} className="group">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "border-b border-[#0a0f1d]/6 px-4 py-4 text-sm font-medium whitespace-nowrap text-[#0a0f1d] group-hover:bg-[#F4F4F4]/80 group-last:border-b-0",
                        column.className
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="border-b border-[#0a0f1d]/6 px-4 py-4 group-hover:bg-[#F4F4F4]/80 group-last:border-b-0">
                      <div className="flex items-center justify-end">
                        <div className="inline-flex items-center rounded-full bg-[#F4F4F4] p-1">
                          {actions(row)}
                        </div>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function TableAction({
  label,
  onClick,
  tone = "default",
}: {
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger" | "primary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 text-xs font-bold transition-colors duration-200",
        tone === "danger"
          ? "text-[#FF6A55] hover:bg-[#FFE8E4]"
          : tone === "primary"
          ? "bg-[#0a0f1d] text-white hover:bg-[#161c2d]"
          : "text-[#0a0f1d] hover:bg-white"
      )}
    >
      {label}
    </button>
  );
}
