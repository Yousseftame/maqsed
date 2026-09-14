"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CircleCheck,
  Clock,
  Download,
  FileChartColumn,
  Loader2,
  Percent,
  ReceiptText,
  RefreshCw,
  Scale,
  Wallet,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DataTable, type Column } from "@/features/admin/ui/DataTable";
import { Panel } from "@/features/admin/ui/Panel";
import { StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService } from "@/features/admin/offers/offers.service";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";
import { cn } from "@/lib/utils";
import {
  buildPeriodStatement,
  type ComparedMetric,
  type PeriodSnapshot,
  type StatementInvoice,
  type StatementMetricKey,
} from "./build-statement";
import {
  formatMonthTitle,
  monthRange,
  monthValueFromDate,
  parseMonthValue,
  previousMonthRange,
  formatDay,
} from "./report-dates";
import { downloadStatementPdf } from "./report-pdf";

function moneyAmount(value: number) {
  const cents = Math.round((Number(value) || 0) * 100);
  return (cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatSar(value: number) {
  return `${moneyAmount(value)} ر.س`;
}

function formatSarParts(value: number) {
  return moneyAmount(value);
}

function formatSignedSarParts(value: number) {
  const amount = moneyAmount(value);
  if (value > 0) return `+${amount}`;
  return amount;
}

function metricLabel(key: StatementMetricKey, isRtl: boolean) {
  const labels: Record<StatementMetricKey, { ar: string; en: string }> = {
    issuedCount: { ar: "عدد الفواتير", en: "Invoice count" },
    issuedSubtotal: { ar: "قبل الضريبة", en: "Before tax" },
    issuedVat: { ar: "الضريبة (15%)", en: "VAT (15%)" },
    issuedTotal: { ar: "إجمالي الفواتير", en: "Invoice total" },
    netRevenue: { ar: "صافي الإيراد", en: "Net revenue" },
    issuedPaidCount: { ar: "فواتير محصلة (من الفترة)", en: "Collected invoices (period)" },
    issuedPaidTotal: { ar: "مبلغ محصل (من الفترة)", en: "Collected amount (period)" },
    issuedUnpaidCount: { ar: "فواتير غير محصلة (من الفترة)", en: "Uncollected invoices (period)" },
    issuedUnpaidTotal: { ar: "مبلغ غير محصل (من الفترة)", en: "Uncollected amount (period)" },
    periodLoss: { ar: "غير محصل من فواتير الفترة", en: "Uncollected from period invoices" },
    collectedCount: { ar: "عمليات التحصيل", en: "Collection transactions" },
    collectedTotal: { ar: "إجمالي التحصيل النقدي", en: "Cash collected" },
    collectedProfit: { ar: "الربح المحصل", en: "Collected profit" },
    collectionRate: { ar: "نسبة التحصيل", en: "Collection rate" },
    averageInvoice: { ar: "متوسط الفاتورة", en: "Average invoice" },
    openingTotal: { ar: "مستحقات أول الفترة", en: "Opening receivables" },
    closingTotal: { ar: "مستحقات آخر الفترة", en: "Closing receivables" },
    outstandingChange: { ar: "صافي تغير المستحقات", en: "Net change in receivables" },
  };
  return isRtl ? labels[key].ar : labels[key].en;
}

function formatMetric(key: StatementMetricKey, value: number) {
  if (key === "collectionRate") return `${value.toFixed(1)}%`;
  if (key.endsWith("Count")) return value.toLocaleString();
  return formatSar(value);
}

function formatPct(value: number | null, isRtl: boolean) {
  if (value == null) return isRtl ? "جديد" : "New";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function invoiceStatus(row: StatementInvoice, isRtl: boolean) {
  if (row.paidInPeriod) {
    return { tone: "success" as const, label: isRtl ? "محصل خلال الفترة" : "Collected in period" };
  }
  if (row.paidAfterPeriod) {
    return { tone: "accent" as const, label: isRtl ? "حُصّل لاحقاً" : "Collected later" };
  }
  return { tone: "warning" as const, label: isRtl ? "غير مدفوع" : "Unpaid" };
}

function InvoiceTable({
  rows,
  isRtl,
  empty,
}: {
  rows: StatementInvoice[];
  isRtl: boolean;
  empty: string;
}) {
  const columns: Column<StatementInvoice>[] = [
    {
      id: "offerNumber",
      header: isRtl ? "رقم العرض" : "Offer number",
      cell: (row) => <span className="font-bold text-[#0a0f1d]">{row.offerNumber || "—"}</span>,
    },
    {
      id: "title",
      header: isRtl ? "العنوان" : "Title",
      cell: (row) => <span className="font-semibold text-[#0a0f1d]">{row.title || "—"}</span>,
    },
    {
      id: "issued",
      header: isRtl ? "تاريخ الإصدار" : "Issued",
      cell: (row) => (
        <span className="text-sm text-[#6B7280]">{row.issuedAt ? formatDay(row.issuedAt, isRtl) : "—"}</span>
      ),
    },
    {
      id: "paid",
      header: isRtl ? "تاريخ التحصيل" : "Collected",
      cell: (row) => (
        <span className="text-sm text-[#6B7280]">{row.actualPaidAt ? formatDay(row.actualPaidAt, isRtl) : "—"}</span>
      ),
    },
    {
      id: "status",
      header: isRtl ? "الحالة" : "Status",
      cell: (row) => {
        const status = invoiceStatus(row, isRtl);
        return <StatusBadge tone={status.tone}>{status.label}</StatusBadge>;
      },
    },
    {
      id: "subtotal",
      header: isRtl ? "قبل الضريبة" : "Before tax",
      cell: (row) => <span className="tabular-nums font-semibold text-[#0a0f1d]">{formatSar(row.subtotal)}</span>,
    },
    {
      id: "vat",
      header: "VAT 15%",
      cell: (row) => <span className="tabular-nums text-[#6B7280]">{formatSar(row.vat)}</span>,
    },
    {
      id: "total",
      header: isRtl ? "الإجمالي" : "Total",
      cell: (row) => <span className="tabular-nums font-bold text-[#0a0f1d]">{formatSar(row.total)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      empty={empty}
      className="p-0 sm:p-0 shadow-none"
      renderExpandedRow={
        rows.some((row) => row.services.length > 0)
          ? (row) =>
              row.services.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-[#8c8c8c]">{isRtl ? "نطاق الخدمات" : "Services"}</p>
                  {row.services.map((item, index) => (
                    <div key={`${row.id}-${index}`} className="flex items-start justify-between gap-4 text-sm">
                      <span className="whitespace-pre-wrap font-medium text-[#0a0f1d]">{item.description}</span>
                      <span className="shrink-0 font-bold tabular-nums text-[#0a0f1d]">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#8c8c8c]">{isRtl ? "لا توجد خدمات مسجلة." : "No services listed."}</p>
              )
          : undefined
      }
    />
  );
}

function CompareValue({ item }: { item: ComparedMetric }) {
  const up = item.delta > 0;
  const down = item.delta < 0;
  const good = item.invert ? down : up;
  const color = item.delta === 0 ? "text-[#8c8c8c]" : good ? "text-[#2f9e44]" : "text-[#c2410c]";
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={cn("inline-flex items-center justify-center gap-1 font-bold tabular-nums", color)}>
      {item.delta !== 0 ? <Icon className="h-3.5 w-3.5 rtl:-scale-x-100" /> : null}
      {item.delta > 0 ? "+" : ""}
      {formatMetric(item.key, item.delta)}
    </span>
  );
}

function ReportKpiCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  money,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: string; direction: "up" | "down" };
  money?: boolean;
}) {
  const isDown = trend?.direction === "down";

  return (
    <article className="rounded-[24px] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[#0a0f1d]">
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        {trend ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
              isDown ? "bg-[#FFE8E4] text-[#FF6A55]" : "bg-[#E8F8EF] text-[#83BF6E]"
            )}
          >
            {isDown ? (
              <ArrowDownRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2.4} />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>
      <p
        dir={money ? "ltr" : undefined}
        className={cn(
          "font-bold tracking-tight text-[#0a0f1d]",
          money
            ? "whitespace-nowrap tabular-nums text-[1.45rem] leading-none sm:text-[1.7rem]"
            : "text-[2rem] leading-none sm:text-[2.35rem]"
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs font-medium text-[#8c8c8c]">{hint}</p> : null}
    </article>
  );
}

function PlLine({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#0a0f1d]/6 py-2.5 last:border-b-0">
      <span className={cn("text-sm font-semibold", muted ? "text-[#8c8c8c]" : "text-[#0a0f1d]")}>{label}</span>
      <span className={cn("tabular-nums text-sm", strong ? "font-black text-[#0a0f1d]" : "font-bold text-[#0a0f1d]")}>
        {value}
      </span>
    </div>
  );
}

function PlCard({ title, snapshot, isRtl }: { title: string; snapshot: PeriodSnapshot; isRtl: boolean }) {
  return (
    <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5">
      <p className="mb-3 text-sm font-bold text-[#0a0f1d]">{title}</p>
      <PlLine label={isRtl ? "عدد الفواتير" : "Invoices"} value={snapshot.issuedCount.toLocaleString()} />
      <PlLine label={isRtl ? "صافي الإيراد (قبل الضريبة)" : "Net revenue (ex-VAT)"} value={formatSar(snapshot.netRevenue)} />
      <PlLine label={isRtl ? "الضريبة (15%)" : "VAT (15%)"} value={formatSar(snapshot.issuedVat)} muted />
      <PlLine label={isRtl ? "الإجمالي شامل الضريبة" : "Gross including VAT"} value={formatSar(snapshot.issuedTotal)} strong />
      <PlLine label={isRtl ? "التحصيل النقدي" : "Cash collected"} value={formatSar(snapshot.collectedTotal)} />
      <PlLine label={isRtl ? "الربح المحصل (قبل الضريبة)" : "Collected profit (ex-VAT)"} value={formatSar(snapshot.collectedProfit)} strong />
      <PlLine label={isRtl ? "غير المحصل من فواتير الفترة" : "Uncollected from period invoices"} value={formatSar(snapshot.periodLoss)} />
      <PlLine label={isRtl ? "مستحقات أول الفترة" : "Opening receivables"} value={formatSar(snapshot.openingTotal)} muted />
      <PlLine label={isRtl ? "مستحقات آخر الفترة" : "Closing receivables"} value={formatSar(snapshot.closingTotal)} muted />
      <PlLine
        label={isRtl ? "تغير المستحقات (آخر الفترة − أول الفترة)" : "Receivables change (closing − opening)"}
        value={`${formatSignedSarParts(snapshot.outstandingChange)} ر.س`}
        strong
      />
      <PlLine label={isRtl ? "نسبة التحصيل" : "Collection rate"} value={`${snapshot.collectionRate.toFixed(1)}%`} />
      <PlLine label={isRtl ? "متوسط الفاتورة" : "Average invoice"} value={formatSar(snapshot.averageInvoice)} />
    </div>
  );
}

export function DeveloperReportsSection() {
  const { isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [monthValue, setMonthValue] = useState(monthValueFromDate);
  const [downloading, setDownloading] = useState(false);

  const { data: offers = [], refetch, isRefetching, isError, isLoading } = useQuery({
    queryKey: ["offers", "developer", ownerUid],
    queryFn: () => offersService.getOffersByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const period = useMemo(() => {
    const parsed = parseMonthValue(monthValue);
    if (!parsed) return { error: "invalid" as const };
    const current = monthRange(parsed.year, parsed.monthIndex);
    const previous = previousMonthRange(parsed.year, parsed.monthIndex);
    const previousYear = parsed.monthIndex === 0 ? parsed.year - 1 : parsed.year;
    const previousMonthIndex = parsed.monthIndex === 0 ? 11 : parsed.monthIndex - 1;
    return {
      current,
      previous,
      currentLabel: formatMonthTitle(parsed.year, parsed.monthIndex, isRtl),
      previousLabel: formatMonthTitle(previousYear, previousMonthIndex, isRtl),
      fileStamp: monthValue,
    };
  }, [monthValue, isRtl]);

  const statement = useMemo(() => {
    if ("error" in period) return null;
    return buildPeriodStatement(offers, period.current, period.previous, isRtl);
  }, [offers, period, isRtl]);

  const companyName = [userData?.companyName, userData?.displayName, userData?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  async function handleDownload() {
    if (!statement || "error" in period || downloading) return;
    setDownloading(true);
    try {
      await downloadStatementPdf({
        statement,
        currentLabel: period.currentLabel,
        previousLabel: period.previousLabel,
        companyName,
        isRtl,
        fileName: isRtl ? `كشف-حساب-${period.fileStamp}.pdf` : `statement-${period.fileStamp}.pdf`,
      });
    } catch (error) {
      console.error("Failed to download statement PDF", error);
      toast.error(isRtl ? "تعذر تحميل التقرير." : "Could not download the report.");
    } finally {
      setDownloading(false);
    }
  }

  const errorMessage =
    "error" in period ? (isRtl ? "شهر غير صالح." : "Invalid month.") : null;

  const highlight = statement?.metrics.filter((item) =>
    ["issuedCount", "issuedTotal", "collectedTotal", "issuedUnpaidTotal", "collectionRate", "outstandingChange"].includes(item.key)
  );

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Panel
        title={isRtl ? "التقرير الشهري" : "Monthly statement"}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching || !ownerUid}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
              title={isRtl ? "تحديث" : "Refresh"}
            >
              <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!statement || downloading || !ownerUid}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#0a0f1d] px-5 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isRtl ? "تحميل PDF" : "Download PDF"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-[#8c8c8c]">
            {isRtl
              ? "اختر شهراً لعرض أرباحه وخسائره ومقارنته بالشهر السابق."
              : "Pick a month to see its profit and loss compared with the previous month."}
          </p>

          <label className="flex max-w-xs flex-col gap-2">
            <span className="text-xs font-bold text-[#8c8c8c]">{isRtl ? "الشهر" : "Month"}</span>
            <input
              type="month"
              dir="ltr"
              value={monthValue}
              onChange={(event) => setMonthValue(event.target.value)}
              className="h-12 rounded-full bg-[#F4F4F4] px-4 text-sm font-bold text-[#0a0f1d] outline-none"
            />
          </label>

          {"error" in period || !statement ? null : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[#f0fdfa] px-4 py-3">
                <p className="text-[11px] font-bold text-[#0d9488]">{isRtl ? "الشهر المختار" : "Selected month"}</p>
                <p className="mt-1 text-sm font-bold text-[#0a0f1d]">{period.currentLabel}</p>
              </div>
              <div className="rounded-[20px] bg-[#F4F4F4] px-4 py-3">
                <p className="text-[11px] font-bold text-[#8c8c8c]">{isRtl ? "الشهر السابق" : "Previous month"}</p>
                <p className="mt-1 text-sm font-bold text-[#0a0f1d]">{period.previousLabel}</p>
              </div>
            </div>
          )}

          {errorMessage ? <p className="text-sm font-semibold text-[#c2410c]">{errorMessage}</p> : null}
        </div>
      </Panel>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center rounded-[24px] bg-white text-sm font-medium text-[#8c8c8c]">
          {isRtl ? "جاري تحميل التقرير..." : "Loading report..."}
        </div>
      ) : isError ? (
        <div className="flex min-h-40 items-center justify-center rounded-[24px] bg-white text-sm font-medium text-[#8c8c8c]">
          {isRtl ? "تعذر تحميل الفواتير." : "Could not load invoices."}
        </div>
      ) : statement && !("error" in period) ? (
        <>
          <StatGrid>
            <ReportKpiCard
              icon={ReceiptText}
              label={isRtl ? "فواتير الفترة" : "Period invoices"}
              value={statement.current.issuedCount}
              hint={formatSar(statement.current.issuedTotal)}
              trend={trendFrom(statement.metrics.find((item) => item.key === "issuedCount"))}
            />
            <ReportKpiCard
              icon={Banknote}
              label={isRtl ? "إجمالي الفترة" : "Period total"}
              value={`${formatSarParts(statement.current.issuedTotal)} ر.س`}
              money
              trend={trendFrom(statement.metrics.find((item) => item.key === "issuedTotal"))}
            />
            <ReportKpiCard
              icon={Wallet}
              label={isRtl ? "التحصيل النقدي" : "Cash collected"}
              value={`${formatSarParts(statement.current.collectedTotal)} ر.س`}
              money
              trend={trendFrom(statement.metrics.find((item) => item.key === "collectedTotal"))}
            />
            <ReportKpiCard
              icon={Percent}
              label={isRtl ? "نسبة التحصيل" : "Collection rate"}
              value={`${statement.current.collectionRate.toFixed(1)}%`}
              trend={trendFrom(statement.metrics.find((item) => item.key === "collectionRate"))}
            />
          </StatGrid>
          <StatGrid>
            <ReportKpiCard
              icon={CircleCheck}
              label={isRtl ? "الربح المحصل" : "Collected profit"}
              value={`${formatSarParts(statement.current.collectedProfit)} ر.س`}
              money
              hint={isRtl ? "قبل الضريبة" : "Ex-VAT"}
              trend={trendFrom(statement.metrics.find((item) => item.key === "collectedProfit"))}
            />
            <ReportKpiCard
              icon={Clock}
              label={isRtl ? "غير محصل من الفترة" : "Uncollected this period"}
              value={`${formatSarParts(statement.current.periodLoss)} ر.س`}
              money
              hint={
                isRtl
                  ? `${statement.current.issuedUnpaidCount.toLocaleString()} فواتير صدرت هذه الفترة وما زالت غير محصلة`
                  : `${statement.current.issuedUnpaidCount.toLocaleString()} invoices issued this period and still unpaid`
              }
              trend={trendFrom(statement.metrics.find((item) => item.key === "periodLoss"))}
            />
            <ReportKpiCard
              icon={Scale}
              label={isRtl ? "صافي تغير المستحقات" : "Net receivables change"}
              value={`${formatSignedSarParts(statement.current.outstandingChange)} ر.س`}
              money
              hint={
                isRtl
                  ? `آخر الفترة ${formatSarParts(statement.current.closingTotal)} − أول الفترة ${formatSarParts(statement.current.openingTotal)} = ${formatSignedSarParts(statement.current.outstandingChange)}`
                  : `Closing ${formatSarParts(statement.current.closingTotal)} − opening ${formatSarParts(statement.current.openingTotal)} = ${formatSignedSarParts(statement.current.outstandingChange)}`
              }
              trend={trendFrom(statement.metrics.find((item) => item.key === "outstandingChange"))}
            />
            <ReportKpiCard
              icon={FileChartColumn}
              label={isRtl ? "متوسط الفاتورة" : "Average invoice"}
              value={`${formatSarParts(statement.current.averageInvoice)} ر.س`}
              money
              trend={trendFrom(statement.metrics.find((item) => item.key === "averageInvoice"))}
            />
          </StatGrid>

          <Panel title={isRtl ? "قائمة الدخل" : "Profit & loss"}>
            <div className="grid gap-3 lg:grid-cols-2">
              <PlCard title={period.currentLabel} snapshot={statement.current} isRtl={isRtl} />
              <PlCard title={period.previousLabel} snapshot={statement.previous} isRtl={isRtl} />
            </div>
            {statement.current.reconciling || statement.previous.reconciling ? (
              <p className="mt-4 text-sm font-semibold text-[#c2410c]">
                {isRtl
                  ? "تعذر مطابقة المستحقات تماماً لبعض السجلات. راجع تواريخ الإصدار والتحصيل."
                  : "Receivables did not fully reconcile for some records. Check issued and collection dates."}
              </p>
            ) : (
              <p className="mt-4 text-xs font-medium leading-relaxed text-[#8c8c8c]">
                {isRtl
                  ? "المستحقات أول الفترة + فواتير الفترة − التحصيل خلال الفترة = المستحقات آخر الفترة. الضريبة ليست ربحاً. النسب والخدمات بدون تكلفة تظهر في التفاصيل ولا تُضاف إلى الإجمالي."
                  : "Opening receivables + period invoices − collections in period = closing receivables. VAT is not profit. Percent and no-cost services appear in the details and are not added to totals."}
              </p>
            )}
          </Panel>

          <Panel title={isRtl ? "المقارنة مع الشهر السابق" : "Comparison vs previous month"}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] table-fixed border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="border-b border-[#0a0f1d]/8 px-3 py-3 text-start text-[13px] font-semibold text-[#8c8c8c]">
                      {isRtl ? "البند" : "Line"}
                    </th>
                    <th className="border-b border-[#0a0f1d]/8 px-3 py-3 text-center text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]">
                      {isRtl ? "الفترة الحالية" : "Current"}
                    </th>
                    <th className="border-b border-[#0a0f1d]/8 px-3 py-3 text-center text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]">
                      {isRtl ? "الشهر السابق" : "Previous"}
                    </th>
                    <th className="border-b border-[#0a0f1d]/8 px-3 py-3 text-center text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]">
                      {isRtl ? "الفرق" : "Difference"}
                    </th>
                    <th className="border-b border-[#0a0f1d]/8 px-3 py-3 text-center text-[13px] font-semibold whitespace-nowrap text-[#8c8c8c]">
                      {isRtl ? "التغير %" : "Change %"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statement.metrics
                    .filter((item) => item.key !== "periodLoss")
                    .map((item) => (
                    <tr key={item.key} className={highlight?.some((row) => row.key === item.key) ? "bg-[#f8fafc]" : undefined}>
                      <td className="border-b border-[#0a0f1d]/6 px-3 py-3 text-start text-sm font-bold text-[#0a0f1d]">
                        {metricLabel(item.key, isRtl)}
                      </td>
                      <td className="border-b border-[#0a0f1d]/6 px-3 py-3 text-center text-sm font-bold tabular-nums text-[#0a0f1d]">
                        <span dir="ltr" className="inline-block whitespace-nowrap">
                          {formatMetric(item.key, item.current)}
                        </span>
                      </td>
                      <td className="border-b border-[#0a0f1d]/6 px-3 py-3 text-center text-sm tabular-nums text-[#6B7280]">
                        <span dir="ltr" className="inline-block whitespace-nowrap">
                          {formatMetric(item.key, item.previous)}
                        </span>
                      </td>
                      <td className="border-b border-[#0a0f1d]/6 px-3 py-3 text-center text-sm">
                        <CompareValue item={item} />
                      </td>
                      <td className="border-b border-[#0a0f1d]/6 px-3 py-3 text-center text-sm font-bold tabular-nums text-[#0a0f1d]">
                        {formatPct(item.pct, isRtl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title={`${isRtl ? "فواتير الفترة الحالية" : "Current period invoices"} · ${period.currentLabel}`}>
            <InvoiceTable
              rows={statement.current.issued}
              isRtl={isRtl}
              empty={isRtl ? "لا توجد فواتير في هذه الفترة." : "No invoices in this period."}
            />
            {statement.current.issuedCount > 0 ? (
              <p className="mt-4 text-sm font-semibold text-[#0a0f1d]">
                {isRtl
                  ? `غير المحصل من هذه الفواتير ${formatSar(statement.current.periodLoss)} · المحصل منها ${formatSar(statement.current.issuedPaidTotal)}`
                  : `Uncollected from these invoices ${formatSar(statement.current.periodLoss)} · collected ${formatSar(statement.current.issuedPaidTotal)}`}
              </p>
            ) : null}
          </Panel>

          {statement.current.priorCollections.length > 0 ? (
            <Panel title={isRtl ? "تحصيل من فواتير فترات سابقة" : "Collections from earlier invoices"}>
              <InvoiceTable
                rows={statement.current.priorCollections}
                isRtl={isRtl}
                empty={isRtl ? "لا يوجد تحصيل من فترات سابقة." : "No collections from earlier invoices."}
              />
            </Panel>
          ) : null}

          {statement.current.closingOutstanding.length > 0 ? (
            <Panel title={isRtl ? "المستحقات آخر الفترة" : "Closing receivables"}>
              <InvoiceTable
                rows={statement.current.closingOutstanding}
                isRtl={isRtl}
                empty={isRtl ? "لا توجد مستحقات." : "No outstanding invoices."}
              />
              <p className="mt-4 text-sm font-semibold text-[#0a0f1d]">
                {isRtl
                  ? `مجموع المستحقات آخر الفترة ${formatSar(statement.current.closingTotal)}`
                  : `Closing receivables total ${formatSar(statement.current.closingTotal)}`}
              </p>
            </Panel>
          ) : null}

          <Panel title={`${isRtl ? "فواتير الشهر السابق" : "Previous month invoices"} · ${period.previousLabel}`}>
            <InvoiceTable
              rows={statement.previous.issued}
              isRtl={isRtl}
              empty={isRtl ? "لا توجد فواتير في الشهر السابق." : "No invoices in the previous month."}
            />
          </Panel>

          {statement.undated.length > 0 ? (
            <Panel title={isRtl ? "فواتير بدون تاريخ" : "Invoices without a date"}>
              <p className="mb-4 text-sm font-medium text-[#c2410c]">
                {isRtl
                  ? "هذه الفواتير موجودة على اللوحة لكن بدون تاريخ صالح، لذلك لم تدخل في المقارنة."
                  : "These invoices are on the dashboard but have no valid date, so they were excluded from the comparison."}
              </p>
              <InvoiceTable rows={statement.undated} isRtl={isRtl} empty="" />
            </Panel>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function trendFrom(item?: ComparedMetric) {
  if (!item || item.delta === 0) return undefined;
  const direction = (item.delta > 0 ? "up" : "down") as "up" | "down";
  const sign = item.delta > 0 ? "+" : "";

  if (item.pct != null) {
    const pctSign = item.pct > 0 ? "+" : "";
    return { value: `${pctSign}${item.pct.toFixed(1)}%`, direction };
  }

  if (item.key === "collectionRate") {
    return { value: `${sign}${Math.abs(item.delta).toFixed(1)}%`, direction };
  }
  if (item.key.endsWith("Count")) {
    return { value: `${sign}${Math.abs(item.delta).toLocaleString()}`, direction };
  }
  return { value: `${sign}${formatSarParts(Math.abs(item.delta))}`, direction };
}
