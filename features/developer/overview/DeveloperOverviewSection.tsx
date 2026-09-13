"use client";

import { useRef } from "react";
import Link from "next/link";
import { Banknote, Building2, CircleCheck, Clock, FileText, Folder, Percent, ReceiptText, RefreshCw, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatGrid, StatCard } from "@/features/admin/ui/StatCard";
import { Panel } from "@/features/admin/ui/Panel";
import type { DeveloperDashboardStats } from "./useDeveloperDashboard";

function formatMoney(value: number) {
  return `${(Math.round(value * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} ر.س`;
}

const moneyValueClass = "[&_p]:whitespace-nowrap [&_p]:tabular-nums [&_p]:text-[1.65rem] sm:[&_p]:text-[1.9rem]";

function FilterScroller({
  filters,
  filter,
  onFilter,
}: {
  filters: { id: string; label: string }[];
  filter: string;
  onFilter: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    pointerId: 0,
  });

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      pointerId: event.pointerId,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!el || !drag.active || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!drag.dragging) {
      if (Math.abs(dx) < 10) return;
      drag.dragging = true;
      el.setPointerCapture(event.pointerId);
    }
    el.scrollLeft = drag.scrollLeft - dx;
  }

  function stopDrag(event: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    if (el && drag.dragging) {
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        // already released
      }
    }
    drag.active = false;
    if (drag.dragging) {
      requestAnimationFrame(() => {
        drag.dragging = false;
      });
    }
  }

  return (
    <div
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      className="w-full min-w-0 cursor-grab select-none overflow-x-auto no-scrollbar active:cursor-grabbing"
      style={{ touchAction: "pan-x" }}
    >
      <div className="flex w-max min-w-full items-center gap-1 rounded-full bg-[#F4F4F4] p-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (dragRef.current.dragging) return;
              onFilter(item.id);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors sm:px-5 sm:text-sm",
              filter === item.id
                ? "bg-[#0a0f1d] text-white shadow-md"
                : "text-[#8c8c8c] hover:bg-white hover:text-[#0a0f1d]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DeveloperOverviewSection({
  filter,
  filters,
  onFilter,
  isDeveloper,
  isRtl,
  stats,
  isRefetching,
  onRefresh,
  canRefresh,
}: {
  filter: string;
  filters: { id: string; label: string }[];
  onFilter: (id: string) => void;
  isDeveloper: boolean;
  isRtl: boolean;
  stats: DeveloperDashboardStats;
  isRefetching: boolean;
  onRefresh: () => void;
  canRefresh: boolean;
}) {
  const pageCards = [
    {
      href: "/developer/projects",
      icon: Folder,
      label: isRtl ? "المشاريع" : "Projects",
      value: stats.projectCount,
    },
    {
      href: "/developer/units",
      icon: Building2,
      label: isRtl ? "الوحدات" : "Units",
      value: stats.unitCount,
      hint: isRtl ? `${stats.availableUnits} متاحة` : `${stats.availableUnits} available`,
    },
    {
      href: "/developer/invoices",
      icon: ReceiptText,
      label: isRtl ? "الفواتير" : "Invoices",
      value: stats.invoiceCount,
    },
    {
      href: "/developer/files",
      icon: FileText,
      label: isRtl ? "الملفات" : "Files",
      value: stats.fileCount,
    },
    ...(isDeveloper
      ? [
          {
            href: "/developer/users",
            icon: Users,
            label: isRtl ? "المستخدمين" : "Users",
            value: stats.userCount,
          },
        ]
      : []),
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <Panel
        title={isRtl ? "بوابة المطور" : "Developer portal"}
        action={
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefetching || !canRefresh}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
            title={isRtl ? "تحديث" : "Refresh"}
          >
            <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <FilterScroller filters={filters} filter={filter} onFilter={onFilter} />
          <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5">
            <StatGrid className="sm:grid-cols-2 xl:grid-cols-2">
              <StatCard
                label={isRtl ? "إجمالي الفواتير" : "Invoice total"}
                value={formatMoney(stats.invoiceTotal)}
                icon={Banknote}
              />
              <StatCard
                label={isRtl ? "نسبة التحصيل" : "Collection rate"}
                value={`${stats.collectionRate.toFixed(1)}%`}
                icon={Percent}
                hint={isRtl ? `${formatMoney(stats.paidTotal)} مدفوع` : `${formatMoney(stats.paidTotal)} paid`}
              />
            </StatGrid>
          </div>
        </div>
      </Panel>

      <Panel title={isRtl ? "ملخص الفواتير" : "Invoice summary"}>
        <div className="flex flex-col gap-3 rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5">
          <StatGrid className="sm:grid-cols-3 xl:grid-cols-3">
            <StatCard icon={ReceiptText} label={isRtl ? "عدد الفواتير" : "Invoices"} value={stats.invoiceCount} />
            <StatCard
              icon={Banknote}
              label={isRtl ? "قبل الضريبة" : "Before tax"}
              value={formatMoney(stats.invoiceSubtotal)}
              className={moneyValueClass}
            />
            <StatCard
              icon={Banknote}
              label={isRtl ? "الضريبة (15%)" : "VAT (15%)"}
              value={formatMoney(stats.invoiceVat)}
              className={moneyValueClass}
            />
          </StatGrid>
          <StatGrid>
            <StatCard icon={CircleCheck} label={isRtl ? "الفواتير المدفوعة" : "Paid invoices"} value={stats.paidCount} />
            <StatCard
              icon={Wallet}
              label={isRtl ? "إجمالي المدفوع" : "Paid amount"}
              value={formatMoney(stats.paidTotal)}
              className={moneyValueClass}
            />
            <StatCard icon={Clock} label={isRtl ? "الفواتير غير المدفوعة" : "Unpaid invoices"} value={stats.unpaidCount} />
            <StatCard
              icon={Banknote}
              label={isRtl ? "إجمالي غير المدفوع" : "Unpaid amount"}
              value={formatMoney(stats.unpaidTotal)}
              className={moneyValueClass}
            />
          </StatGrid>
        </div>
      </Panel>

      <StatGrid className={pageCards.length > 4 ? "xl:grid-cols-5" : undefined}>
        {pageCards.map((card) => (
          <Link key={card.href} href={card.href} className="block transition-transform hover:-translate-y-0.5">
            <StatCard icon={card.icon} label={card.label} value={card.value} hint={card.hint} />
          </Link>
        ))}
      </StatGrid>
    </div>
  );
}
