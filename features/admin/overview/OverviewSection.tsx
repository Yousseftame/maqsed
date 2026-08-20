"use client";

import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Briefcase, Building2, ChevronDown, Folder, Users, ArrowDownRight, ArrowUpRight, Eye, CheckCircle2, Ban, Home, Building, Store, MapPin, Map, PieChart as PieChartIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { Panel } from "@/features/admin/ui/Panel";
import { StatusBadge, type StatusTone } from "@/features/admin/ui/StatusBadge";
import {
  CITY_PERFORMANCE,
  NEIGHBORHOOD_PERFORMANCE,
  HERO_KPIS,
  OVERVIEW_KPIS,
  PROJECT_STATUS,
  RECENT_INQUIRIES,
  WEEKLY_INQUIRIES,
  REAL_ESTATE_INVENTORY,
  INVENTORY_DISTRIBUTION,
} from "@/features/admin/overview/data";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const KPI_META = {
  customers: { icon: Users, labelKey: "admin.analytics.customers" },
  projects: { icon: Folder, labelKey: "admin.analytics.projects" },
  units: { icon: Building2, labelKey: "admin.analytics.units" },
  requests: { icon: Users, labelKey: "admin.analytics.requests" },
  views: { icon: Eye, labelKey: "admin.analytics.views" },
  sales: { icon: DollarSign, labelKey: "admin.analytics.sales" },
  visits: { icon: Eye, labelKey: "admin.analytics.visits" },
} as const;

const INQUIRY_TONE: Record<(typeof RECENT_INQUIRIES)[number]["status"], StatusTone> = {
  new: "navy",
  pending: "muted",
  closed: "success",
};

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

export function OverviewSection() {
  const { locale, t } = useLocale();

  const traffic = WEEKLY_INQUIRIES.map((item) => ({
    ...item,
    label: t(`admin.analytics.days.${item.day}`),
  }));

  const cities = CITY_PERFORMANCE.map((item) => ({
    ...item,
    name: item.name[locale],
  }));

  const statusTotal = PROJECT_STATUS.reduce((sum, item) => sum + item.value, 0);

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
              className="inline-flex items-center gap-2 rounded-full border border-[#0a0f1d]/8 bg-white px-4 py-2 text-sm font-semibold text-[#0a0f1d]"
            >
              {t("admin.analytics.last7Days")}
              <ChevronDown className="h-4 w-4 text-[#8c8c8c]" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-[20px] bg-[#F4F4F4] p-3 sm:p-4 lg:grid-cols-2">
            <HeroPaper
              icon={DollarSign}
              label={t("admin.analytics.sales")}
              value={HERO_KPIS[0].value}
              change={HERO_KPIS[0].change}
              trend={HERO_KPIS[0].trend}
              vs={t("admin.analytics.vsLastMonth")}
              className="bg-white shadow-[0_8px_24px_rgba(10,15,29,0.04)]"
            />
            <HeroPaper
              icon={Eye}
              label={t("admin.analytics.visits")}
              value={HERO_KPIS[1].value}
              change={HERO_KPIS[1].change}
              trend={HERO_KPIS[1].trend}
              vs={t("admin.analytics.vsLastMonth")}
            />
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <StatGrid>
          {OVERVIEW_KPIS.map((kpi) => {
            const meta = KPI_META[kpi.id as keyof typeof KPI_META];
            return (
              <StatCard
                key={kpi.id}
                icon={meta.icon}
                label={t(meta.labelKey as any)}
                value={kpi.value}
                hint={t("admin.analytics.vsLastMonth")}
                trend={{ value: kpi.change, direction: kpi.trend }}
              />
            );
          })}
        </StatGrid>
      </FadeIn>

      {/* Real Estate Inventory */}
      <FadeIn delay={0.07}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <Building className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.inventory.title")}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col justify-center gap-2 rounded-[20px] bg-[#0a0f1d] p-6 text-white sm:col-span-1 shadow-[0_8px_24px_rgba(10,15,29,0.12)]">
              <span className="text-sm font-medium text-white/70">{t("admin.analytics.inventory.marketValue")}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{REAL_ESTATE_INVENTORY.marketValue}</span>
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
              <span className="text-2xl font-bold text-[#0a0f1d]">{REAL_ESTATE_INVENTORY.available}</span>
            </div>
            
            <div className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-[#0a0f1d]/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.analytics.inventory.soldOrRented")}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#8c8c8c]">
                  <Ban className="h-4 w-4" />
                </div>
              </div>
              <span className="text-2xl font-bold text-[#0a0f1d]">{REAL_ESTATE_INVENTORY.soldOrRented}</span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Inventory Distribution */}
      <FadeIn delay={0.075}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <PieChartIcon className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.inventory.distribution")}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INVENTORY_DISTRIBUTION.map((item, index) => {
              const icons = [Building2, Home, Building, Store];
              const Icon = icons[index];
              return (
                <div key={item.id} className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white p-5 text-center shadow-sm ring-1 ring-[#0a0f1d]/5">
                  <Icon className="h-6 w-6 text-[#8c8c8c]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold text-[#0a0f1d]">{item.value}</span>
                    <span className="text-xs font-semibold text-[#8c8c8c]">{t(`admin.analytics.inventory.${item.id}` as any)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* Geographic Distribution */}
      <FadeIn delay={0.08}>
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <MapPin className="h-5 w-5 text-[#8c8c8c]" />
            <h3 className="text-lg font-bold text-[#0a0f1d]">{t("admin.analytics.geographic")}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Panel title={t("admin.analytics.byNeighborhood")} className="shadow-sm ring-1 ring-[#0a0f1d]/5">
              <div className="flex flex-col gap-3">
                {NEIGHBORHOOD_PERFORMANCE.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#F4F4F4] p-3">
                    <span className="text-sm font-bold text-[#0a0f1d]">{item.name[locale as 'en' | 'ar']}</span>
                    <span className="rounded-full bg-[#EDE9FE] px-2.5 py-1 text-xs font-bold text-[#6D5BD0]">
                      {item.value} {t("admin.analytics.units")}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title={t("admin.analytics.byCity")} className="shadow-sm ring-1 ring-[#0a0f1d]/5">
              <div className="flex flex-col gap-3">
                {CITY_PERFORMANCE.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#F4F4F4] p-3">
                    <span className="text-sm font-bold text-[#0a0f1d]">{item.name[locale as 'en' | 'ar']}</span>
                    <span className="rounded-full bg-[#E8F8EF] px-2.5 py-1 text-xs font-bold text-[#83BF6E]">
                      {item.value} {t("admin.analytics.units")}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
      </FadeIn>

      <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <FadeIn delay={0.08} className="min-h-0 h-full">
          <Panel
            title={t("admin.analytics.traffic")}
            action={
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#0a0f1d]/8 bg-white px-4 py-2 text-sm font-semibold text-[#0a0f1d]"
              >
                {t("admin.last7Days")}
                <ChevronDown className="h-4 w-4 text-[#8c8c8c]" />
              </button>
            }
          >
            <div className="min-h-[16rem] flex-1 sm:min-h-[18rem]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={traffic} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
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

        <FadeIn delay={0.14} className="min-h-0 h-full">
          <Panel title={t("admin.analytics.status")}>
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:items-center">
                <div className="relative h-48 w-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PROJECT_STATUS}
                        dataKey="value"
                        innerRadius={58}
                        outerRadius={80}
                        paddingAngle={3}
                        stroke="none"
                        animationDuration={800}
                      >
                        {PROJECT_STATUS.map((item) => (
                          <Cell key={item.id} fill={item.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tracking-tight text-[#0a0f1d]">
                      {statusTotal}
                    </span>
                    <span className="text-xs font-medium text-[#8c8c8c]">
                      {t("admin.analytics.projects")}
                    </span>
                  </div>
                </div>
                <ul className="flex w-full flex-col gap-3">
                  {PROJECT_STATUS.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#0a0f1d]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: item.color }}
                        />
                        {t(`admin.projects.statuses.${item.id}`)}
                      </span>
                      <span className="text-sm font-bold tabular-nums text-[#0a0f1d]">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F4F4F4]">
                {PROJECT_STATUS.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="h-full first:rounded-s-full last:rounded-e-full"
                    initial={{ flexGrow: 0 }}
                    animate={{ flexGrow: item.value }}
                    transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: EASE }}
                    style={{ background: item.color }}
                  />
                ))}
              </div>
            </div>
          </Panel>
        </FadeIn>
      </div>

      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        <FadeIn delay={0.18} className="h-full">
          <Panel title={t("admin.analytics.byCity")}>
            <div className="h-64" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cities}
                  layout="vertical"
                  margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={88}
                    tick={{ fill: "#0a0f1d", fontSize: 13, fontWeight: 600 }}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(10,15,29,0.04)" }} />
                  <Bar
                    dataKey="value"
                    fill="#0a0f1d"
                    radius={[999, 999, 999, 999]}
                    barSize={14}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </FadeIn>

        <FadeIn delay={0.22} className="h-full">
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
            <ul>
              {RECENT_INQUIRIES.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 border-b border-[#0a0f1d]/8 py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#0a0f1d]">
                      {item.name[locale]}
                    </p>
                    <p className="truncate text-xs font-medium text-[#8c8c8c]">
                      {item.project[locale]} · {item.time[locale]}
                    </p>
                  </div>
                  <StatusBadge tone={INQUIRY_TONE[item.status]}>
                    {t(`admin.analytics.${item.status}`)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
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
  change,
  trend,
  vs,
  className,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  vs: string;
  className?: string;
}) {
  const isDown = trend === "down";

  return (
    <article className={cn("rounded-[20px] p-5 sm:p-6", className)}>
      <div className="mb-8 flex items-center gap-2 text-[#0a0f1d]">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="text-[2.75rem] leading-none font-bold tracking-tight text-[#0a0f1d] sm:text-6xl">
          {value}
        </p>
        <div className="mb-1 flex flex-col items-end gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
              isDown ? "bg-[#FFE8E4] text-[#FF6A55]" : "bg-[#E8F8EF] text-[#83BF6E]"
            )}
          >
            {isDown ? (
              <ArrowDownRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
            )}
            {change}
          </span>
          <span className="text-xs font-medium text-[#8c8c8c]">{vs}</span>
        </div>
      </div>
    </article>
  );
}
