"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  ChevronDown,
  Folder,
  Users,
  Eye,
  CheckCircle2,
  Ban,
  Home,
  Building,
  MapPin,
  PieChart as PieChartIcon,
  DollarSign,
  Layers,
  RefreshCw,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { Panel } from "@/features/admin/ui/Panel";
import { StatusBadge, type StatusTone } from "@/features/admin/ui/StatusBadge";
import { useOverviewStats, type InquiryRange } from "@/features/admin/overview/useOverviewStats";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const INQUIRY_TONE: Record<"new" | "pending" | "closed", StatusTone> = {
  new: "navy",
  pending: "muted",
  closed: "success",
};

const DISTRIBUTION_ICONS = {
  apartment: Building2,
  villa: Home,
  building: Building,
  duplex: Building2,
  townhouse: Home,
} as const;

function FadeIn({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[16px] border border-[#0a0f1d]/8 bg-white px-3 py-2 text-sm font-semibold text-[#0a0f1d] shadow-[0_8px_24px_rgba(10,15,29,0.08)]">
      {label ? <p className="mb-0.5 text-xs font-medium text-[#8c8c8c]">{label}</p> : null}
      {payload[0]?.value}
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
  action,
  slices,
  total,
  totalLabel,
  formatCount,
}: {
  title?: string;
  action?: React.ReactNode;
  slices: DonutSlice[];
  total: number;
  totalLabel: string;
  formatCount: (value: number) => string;
}) {
  const visible = slices.filter((item) => item.value > 0);
  const chartData = visible.length > 0 ? visible : [{ id: "empty", color: "#F4F4F4", label: "", value: 1 }];

  return (
    <Panel title={title} action={action}>
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
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
              <span className="text-2xl font-bold tracking-tight text-[#0a0f1d] sm:text-3xl">
                {formatCount(total)}
              </span>
              <span className="text-[11px] font-medium text-[#8c8c8c] sm:text-xs">{totalLabel}</span>
            </div>
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-2.5 sm:max-w-xs lg:max-w-[14rem]">
            {slices.map((item) => (
              <li key={item.id} className="flex min-w-0 items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#0a0f1d]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-[#0a0f1d]">{item.value}</span>
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
}: {
  data: { id: string; name: string; value: number }[];
  emptyLabel: string;
}) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm font-medium text-[#8c8c8c]">
        {emptyLabel}
      </p>
    );
  }

  const height = Math.max(256, data.length * 48);

  return (
    <div className="w-full" style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={88}
            interval={0}
            tick={{ fill: "#0a0f1d", fontSize: 13, fontWeight: 600 }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(10,15,29,0.04)" }} />
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
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function InquiryRangeFilter({
  value,
  onChange,
}: {
  value: InquiryRange;
  onChange: (value: InquiryRange) => void;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: InquiryRange; key: string }[] = [
    { value: 7, key: "admin.analytics.last7Days" },
    { value: 30, key: "admin.analytics.last30Days" },
    { value: 90, key: "admin.analytics.last90Days" },
  ];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const current = options.find((item) => item.value === value)?.key || options[0].key;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#0a0f1d]/8 bg-white px-4 py-2 text-sm font-semibold text-[#0a0f1d]"
      >
        {t(current)}
        <ChevronDown className="h-4 w-4 text-[#8c8c8c]" />
      </button>
      {open ? (
        <div className="absolute end-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-[#0a0f1d]/8 bg-white py-1 shadow-lg">
          {options.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#F4F4F4]",
                value === item.value ? "text-[#0a0f1d]" : "text-[#8c8c8c]"
              )}
            >
              {t(item.key)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function OverviewSection() {
  const { t } = useLocale();
  const [inquiryRange, setInquiryRange] = useState<InquiryRange>(7);
  const stats = useOverviewStats(inquiryRange);

  const formatCount = (value: number) => value.toLocaleString();
  const formatMoney = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <FadeIn>
        <section className="rounded-[24px] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
              {t("admin.overview")}
            </h2>
            <button
              type="button"
              onClick={() => stats.refetch()}
              disabled={stats.isRefetching}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
              title={t("admin.ui.refresh")}
            >
              <RefreshCw className={`h-5 w-5 ${stats.isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-[20px] bg-[#F4F4F4] p-3 sm:p-4 lg:grid-cols-2">
            <HeroPaper
              icon={DollarSign}
              label={t("admin.analytics.sales")}
              value={formatCount(stats.salesTotal)}
              hint={t("admin.analytics.inventory.marketValueHint")}
              className="bg-white shadow-[0_8px_24px_rgba(10,15,29,0.04)]"
            />
            <HeroPaper
              icon={Eye}
              label={t("admin.analytics.visits")}
              value={formatCount(stats.visits)}
              details={[
                { label: t("admin.analytics.projectViews"), value: formatCount(stats.projectViews) },
                { label: t("admin.analytics.unitViews"), value: formatCount(stats.unitViews) },
              ]}
            />
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.05}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#8c8c8c]" />
              <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.payments")}</h3>
            </div>
            <Link
              href="/admin/payments"
              className="text-sm font-bold text-[#0a0f1d] underline-offset-2 hover:underline"
            >
              {t("admin.analytics.viewAll")}
            </Link>
          </div>
          <Panel className="p-4 sm:p-5">
            {stats.recentPayments.length > 0 ? (
              <ul className="min-w-0">
                {stats.recentPayments.map((item) => {
                  const offerRef = item.offerNumber ? `#${item.offerNumber}` : item.title;
                  const subtitle = item.offerNumber && item.title && item.title !== item.offerNumber ? item.title : "";
                  const meta = [subtitle, item.developerName, item.projectName, item.time].filter(Boolean);
                  return (
                    <li
                      key={item.id}
                      className="flex min-w-0 items-center gap-3 border-b border-[#0a0f1d]/8 py-2.5 last:border-b-0 sm:py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a0f1d] text-white">
                        <DollarSign className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-[15px] font-bold leading-tight text-[#0a0f1d]">{offerRef}</p>
                        {meta.length > 0 ? (
                          <p className="mt-0.5 truncate text-xs font-medium leading-tight text-[#8c8c8c]">
                            {meta.join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-lg font-bold tabular-nums leading-none text-[#0a0f1d]">
                        {formatMoney(item.amount)}{" "}
                        <span className="text-sm font-bold text-[#0a0f1d]/70">
                          {t("admin.analytics.inventory.marketValueHint")}
                        </span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm font-medium text-[#8c8c8c]">{t("admin.ui.empty")}</p>
            )}
          </Panel>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <StatGrid className="lg:grid-cols-3 xl:grid-cols-5">
          <StatCard icon={Folder} label={t("admin.analytics.projects")} value={formatCount(stats.projects)} />
          <StatCard icon={Building2} label={t("admin.analytics.units")} value={formatCount(stats.units)} />
          <StatCard icon={Users} label={t("admin.analytics.requests")} value={formatCount(stats.requests)} />
          <StatCard icon={MapPin} label={t("admin.projects.cities")} value={formatCount(stats.citiesCount)} />
          <StatCard icon={Layers} label={t("admin.cities.neighborhoods")} value={formatCount(stats.neighborhoodsCount)} />
        </StatGrid>
      </FadeIn>

      <FadeIn delay={0.07}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <Building className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.inventory.title")}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col justify-center gap-2 rounded-[20px] bg-[#0a0f1d] p-6 text-white sm:col-span-1 shadow-[0_8px_24px_rgba(10,15,29,0.12)]">
              <span className="text-sm font-medium text-white/70">{t("admin.analytics.inventory.marketValue")}</span>
              <div className="flex min-w-0 flex-wrap items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                  {formatCount(stats.marketValue)}
                </span>
                <span className="text-sm font-semibold text-white/70">{t("admin.analytics.inventory.marketValueHint")}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-[#0a0f1d]/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.analytics.inventory.available")}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F8EF] text-[#83BF6E]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-[#0a0f1d]">{formatCount(stats.available)}</span>
            </div>

            <div className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-[#0a0f1d]/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.analytics.inventory.soldOrRented")}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#8c8c8c]">
                  <Ban className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-[#0a0f1d]">{formatCount(stats.soldOrRented)}</span>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.072}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#8c8c8c]" />
              <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.topUnits")}</h3>
            </div>
            <Link
              href="/admin/units"
              className="text-sm font-bold text-[#0a0f1d] underline-offset-2 hover:underline"
            >
              {t("admin.analytics.viewAll")}
            </Link>
          </div>
          <Panel className="p-4 sm:p-5">
            {stats.topUnits.length > 0 ? (
              <ul className="min-w-0">
                {stats.topUnits.map((item, index) => {
                  const maxPrice = stats.topUnits[0]?.price || 1;
                  const width = maxPrice > 0 ? Math.max(4, (item.price / maxPrice) * 100) : 0;
                  return (
                    <li
                      key={item.id}
                      className="flex min-w-0 flex-col gap-1.5 border-b border-[#0a0f1d]/8 py-2 last:border-b-0 sm:py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0a0f1d] text-[11px] font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="truncate text-sm font-bold leading-tight text-[#0a0f1d]">{item.name}</p>
                          <p className="truncate text-[11px] font-medium leading-tight text-[#8c8c8c]">
                            {[item.type, item.project].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold tabular-nums text-[#0a0f1d] sm:text-sm">
                          {formatCount(item.price)} {t("admin.analytics.inventory.marketValueHint")}
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[#F4F4F4]">
                        <div className="h-full rounded-full bg-[#0a0f1d]" style={{ width: `${width}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm font-medium text-[#8c8c8c]">{t("admin.ui.empty")}</p>
            )}
          </Panel>
        </section>
      </FadeIn>

      <FadeIn delay={0.075}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <PieChartIcon className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.unitDistribution")}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {stats.distribution.map((item) => {
              const Icon = DISTRIBUTION_ICONS[item.icon as keyof typeof DISTRIBUTION_ICONS] || Building2;
              return (
                <div key={item.id} className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white p-5 text-center shadow-sm ring-1 ring-[#0a0f1d]/5">
                  <Icon className="h-6 w-6 text-[#8c8c8c]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold text-[#0a0f1d]">{formatCount(item.value)}</span>
                    <span className="text-xs font-semibold text-[#8c8c8c]">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.078}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#8c8c8c]" />
              <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.affiliation")}</h3>
            </div>
            <Link
              href="/admin/units"
              className="text-sm font-bold text-[#0a0f1d] underline-offset-2 hover:underline"
            >
              {t("admin.analytics.viewAll")}
            </Link>
          </div>
          <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex h-full flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-[#0a0f1d]/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.analytics.independentUnits")}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d]">
                    <Home className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#0a0f1d]">{formatCount(stats.independentUnits)}</span>
              </div>
              <div className="flex h-full flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-[#0a0f1d]/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.analytics.projectUnits")}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d]">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#0a0f1d]">{formatCount(stats.projectUnits)}</span>
              </div>
            </div>
            <DonutPanel
              slices={stats.unitAffiliation}
              total={stats.units}
              totalLabel={t("admin.analytics.units")}
              formatCount={formatCount}
            />
          </div>
        </section>
      </FadeIn>

      <div className="flex min-w-0 flex-col gap-3">
        <FadeIn delay={0.08} className="min-h-0 w-full">
          <Panel
            title={t("admin.analytics.traffic")}
            action={<InquiryRangeFilter value={inquiryRange} onChange={setInquiryRange} />}
          >
            <div className="h-72 w-full sm:h-80" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.traffic} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="maqsedArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a0f1d" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#0a0f1d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(10,15,29,0.06)" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c8c8c", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{ fill: "#8c8c8c", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0a0f1d"
                    strokeWidth={2.5}
                    fill="url(#maqsedArea)"
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </FadeIn>

        <div className="grid min-w-0 items-stretch gap-3 sm:grid-cols-2">
          <FadeIn delay={0.14} className="min-h-0 h-full">
            <DonutPanel
              title={t("admin.analytics.status")}
              slices={stats.projectStatus}
              total={stats.statusTotal}
              totalLabel={t("admin.analytics.projects")}
              formatCount={formatCount}
            />
          </FadeIn>

          <FadeIn delay={0.16} className="min-h-0 h-full">
            <DonutPanel
              title={t("admin.analytics.team")}
              slices={stats.team}
              total={stats.teamTotal}
              totalLabel={t("admin.analytics.members")}
              formatCount={formatCount}
            />
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.18}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <MapPin className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.geographic")}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Panel title={t("admin.analytics.byNeighborhood")} className="shadow-sm ring-1 ring-[#0a0f1d]/5">
              <DistributionBarChart data={stats.byNeighborhood} emptyLabel={t("admin.ui.empty")} />
            </Panel>
            <Panel title={t("admin.analytics.byCity")} className="shadow-sm ring-1 ring-[#0a0f1d]/5">
              <DistributionBarChart data={stats.byCity} emptyLabel={t("admin.ui.empty")} />
            </Panel>
          </div>
        </section>
      </FadeIn>

      <div className="grid min-w-0 items-stretch gap-3 lg:grid-cols-2">
        <FadeIn delay={0.2} className="min-h-0 min-w-0 h-full">
          <DonutPanel
            title={t("admin.analytics.requestTypes")}
            action={
              <Link
                href="/admin/customers"
                className="text-sm font-bold text-[#0a0f1d] underline-offset-2 hover:underline"
              >
                {t("admin.analytics.viewAll")}
              </Link>
            }
            slices={stats.requestTypes}
            total={stats.requests}
            totalLabel={t("admin.analytics.requests")}
            formatCount={formatCount}
          />
        </FadeIn>

        <FadeIn delay={0.22} className="min-h-0 min-w-0 h-full">
          <Panel
            title={t("admin.analytics.recent")}
            action={
              <Link
                href="/admin/customers"
                className="text-sm font-bold text-[#0a0f1d] underline-offset-2 hover:underline"
              >
                {t("admin.analytics.viewAll")}
              </Link>
            }
          >
            {stats.recent.length > 0 ? (
              <ul className="min-w-0">
                {stats.recent.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 items-start justify-between gap-3 border-b border-[#0a0f1d]/8 py-3 last:border-b-0 sm:items-center sm:py-4"
                  >
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="truncate text-sm font-bold text-[#0a0f1d]">{item.name}</p>
                      <p className="truncate text-xs font-medium text-[#8c8c8c]">
                        {[item.detail, item.time].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <StatusBadge className="shrink-0 whitespace-nowrap" tone={INQUIRY_TONE[item.status]}>
                      {t(`admin.analytics.${item.status}`)}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex flex-1 items-center justify-center py-10 text-center text-sm font-medium text-[#8c8c8c]">
                {t("admin.ui.empty")}
              </p>
            )}
          </Panel>
        </FadeIn>
      </div>
    </div>
  );
}

function HeroPaper({
  icon: Icon,
  label,
  value,
  hint,
  details,
  className,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  hint?: string;
  details?: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <article className={cn("rounded-[20px] p-5 sm:p-6", className)}>
      <div className="mb-8 flex items-center gap-2 text-[#0a0f1d]">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div
        className={cn(
          "flex min-w-0",
          details?.length ? "items-end justify-between gap-4" : "flex-wrap items-baseline gap-2"
        )}
      >
        <p
          dir="ltr"
          className="text-[2.5rem] leading-none font-bold tracking-tight text-[#0a0f1d] sm:text-6xl"
        >
          {value}
        </p>
        {details?.length ? (
          <div className="mb-0.5 flex min-w-0 shrink-0 flex-col gap-1.5 text-end">
            {details.map((item) => (
              <span key={item.label} className="text-xs font-semibold leading-none text-[#8c8c8c] sm:text-sm">
                {item.label}{" "}
                <span dir="ltr" className="tabular-nums text-[#0a0f1d]">
                  {item.value}
                </span>
              </span>
            ))}
          </div>
        ) : hint ? (
          <span className="text-sm font-semibold text-[#8c8c8c]">{hint}</span>
        ) : null}
      </div>
    </article>
  );
}
