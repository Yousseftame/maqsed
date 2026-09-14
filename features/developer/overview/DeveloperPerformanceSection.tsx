"use client";

import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Panel } from "@/features/admin/ui/Panel";
import type { DeveloperDashboardStats } from "./useDeveloperDashboard";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatMoney(value: number) {
  return `${(Math.round(value * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} ر.س`;
}

function formatCount(value: number) {
  return value.toLocaleString();
}

function ChartTooltip({
  active,
  payload,
  label,
  money,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
  money?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value || 0);
  return (
    <div className="rounded-[16px] border border-[#0a0f1d]/8 bg-white px-3 py-2 text-sm font-semibold text-[#0a0f1d] shadow-[0_8px_24px_rgba(10,15,29,0.08)]">
      {label ? <p className="mb-0.5 text-xs font-medium text-[#8c8c8c]">{label}</p> : null}
      {money ? formatMoney(value) : formatCount(value)}
    </div>
  );
}

type DonutSlice = {
  id: string;
  color: string;
  label: string;
  value: number;
};

function DonutPanel({
  title,
  slices,
  total,
  totalLabel,
  formatValue = formatCount,
  compactTotal,
}: {
  title: string;
  slices: DonutSlice[];
  total: number;
  totalLabel: string;
  formatValue?: (value: number) => string;
  compactTotal?: boolean;
}) {
  const visible = slices.filter((item) => item.value > 0);
  const chartData = visible.length > 0 ? visible : [{ id: "empty", color: "#F4F4F4", label: "", value: 1 }];

  return (
    <Panel title={title}>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-5 lg:flex-row lg:items-center lg:justify-evenly lg:gap-8">
          <div className="relative h-40 w-40 shrink-0 sm:h-52 sm:w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius="60%"
                  outerRadius="84%"
                  paddingAngle={visible.length > 1 ? 3 : 0}
                  stroke="none"
                  animationDuration={800}
                >
                  {chartData.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-[18%] flex flex-col items-center justify-center px-1 text-center">
              <span
                className={
                  compactTotal
                    ? "text-[11px] leading-tight font-bold tracking-tight text-[#0a0f1d] sm:text-[13px]"
                    : "text-2xl font-bold tracking-tight text-[#0a0f1d] sm:text-3xl"
                }
              >
                {formatValue(total)}
              </span>
              <span className="text-[10px] font-medium text-[#8c8c8c] sm:text-[11px]">{totalLabel}</span>
            </div>
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-2.5 sm:max-w-xs lg:max-w-[14rem]">
            {slices.map((item) => (
              <li key={item.id} className="flex min-w-0 items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#0a0f1d]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#0a0f1d]">{formatValue(item.value)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F4F4F4]">
          {total > 0
            ? slices.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="h-full first:rounded-s-full last:rounded-e-full"
                  initial={{ flexGrow: 0 }}
                  animate={{ flexGrow: item.value }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: EASE }}
                  style={{ background: item.color }}
                />
              ))
            : null}
        </div>
      </div>
    </Panel>
  );
}

function DistributionBarChart({
  data,
  emptyLabel,
  money,
}: {
  data: { name: string; value: number }[];
  emptyLabel: string;
  money?: boolean;
}) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm font-medium text-[#8c8c8c]">
        {emptyLabel}
      </p>
    );
  }

  const height = Math.max(256, data.length * 48);
  const formatLabel = money ? formatMoney : formatCount;

  return (
    <div className="w-full" style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: money ? 120 : 28, left: 8, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={96}
            interval={0}
            tick={{ fill: "#0a0f1d", fontSize: 13, fontWeight: 600 }}
          />
          <Tooltip content={<ChartTooltip money={money} />} cursor={{ fill: "rgba(10,15,29,0.04)" }} />
          <Bar
            dataKey="value"
            fill="#0a0f1d"
            radius={[999, 999, 999, 999]}
            barSize={14}
            animationDuration={900}
          >
            <LabelList
              dataKey="value"
              position="right"
              fill="#0a0f1d"
              fontSize={12}
              fontWeight={700}
              offset={8}
              formatter={(value) => formatLabel(Number(value ?? 0))}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeveloperPerformanceSection({
  isRtl,
  stats,
}: {
  isRtl: boolean;
  stats: DeveloperDashboardStats;
}) {
  const emptyLabel = isRtl ? "لا توجد بيانات بعد" : "No data yet";
  const invoiceData = stats.invoicesByOffer.filter((item) => item.value > 0);
  const showOfferChart = invoiceData.length > 1;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid min-w-0 items-stretch gap-3 sm:grid-cols-2">
        <DonutPanel
          title={isRtl ? "حالة الدفع" : "Payment status"}
          slices={stats.paymentStatus}
          total={stats.offerCount}
          totalLabel={isRtl ? "عرض" : "offers"}
        />
        <DonutPanel
          title={isRtl ? "حالة الفواتير" : "Invoices status"}
          slices={stats.invoiceStatus}
          total={stats.invoiceTotal}
          totalLabel={isRtl ? "الإجمالي" : "total"}
          formatValue={formatMoney}
          compactTotal
        />
      </div>
      {showOfferChart ? (
        <Panel title={isRtl ? "الفواتير حسب رقم العرض" : "Invoices by offer number"} className="shadow-sm ring-1 ring-[#0a0f1d]/5">
          <DistributionBarChart data={invoiceData} emptyLabel={emptyLabel} money />
        </Panel>
      ) : null}
    </div>
  );
}
