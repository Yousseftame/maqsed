"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  renderExpandedRow,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  toolbar?: React.ReactNode;
  empty?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  actionsHeader?: React.ReactNode;
  className?: string;
  renderExpandedRow?: (row: T) => React.ReactNode;
}) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

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
                {renderExpandedRow && (
                  <th className="border-b border-[#0a0f1d]/8 px-4 py-3 w-10"></th>
                )}
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
              {rows.map((row) => {
                const key = rowKey(row);
                const isExpanded = expandedRows.has(key);

                return (
                  <React.Fragment key={key}>
                    <tr 
                      className={cn(
                        "group transition-colors",
                        renderExpandedRow ? "cursor-pointer hover:bg-[#F4F4F4]/80" : ""
                      )}
                      onClick={() => renderExpandedRow && toggleRow(key)}
                    >
                      {renderExpandedRow && (
                        <td className="border-b border-[#0a0f1d]/6 px-4 py-4 text-[#8c8c8c] group-hover:bg-[#F4F4F4]/80 group-last:border-b-0 w-10">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </td>
                      )}
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
                        <div className="inline-flex items-center rounded-full bg-[#F4F4F4] p-1" onClick={(e) => e.stopPropagation()}>
                          {actions(row)}
                        </div>
                      </div>
                    </td>
                  ) : null}
                </tr>
                {renderExpandedRow && (
                  <AnimatePresence>
                    {isExpanded && (
                      <tr>
                        <td colSpan={columns.length + (actions ? 1 : 0) + 1} className="p-0 border-b border-[#0a0f1d]/6 group-last:border-b-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-[#F8F9FA]"
                          >
                            <div className="p-6 border-s-4 border-[#0a0f1d] my-4 mx-4 bg-white rounded-lg shadow-sm">
                              {renderExpandedRow(row)}
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                )}
              </React.Fragment>
            );
          })}
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
