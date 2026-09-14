import type { PeriodStatement, StatementInvoice } from "./build-statement";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSarNumber(value: number) {
  const cents = Math.round((Number(value) || 0) * 100);
  return (cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatSar(value: number, isRtl: boolean) {
  const n = formatSarNumber(value);
  return isRtl ? `${n} ر.س` : `${n} SAR`;
}

function formatSignedSar(value: number, isRtl: boolean) {
  const formatted = formatSar(value, isRtl);
  return value > 0 ? `+${formatted}` : formatted;
}

function formatPct(value: number | null, isRtl: boolean) {
  if (value == null) return isRtl ? "جديد" : "New";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatCount(value: number) {
  return value.toLocaleString();
}

type Copy = {
  title: string;
  subtitle: string;
  current: string;
  previous: string;
  generated: string;
  pl: string;
  invoiced: string;
  vat: string;
  gross: string;
  collected: string;
  uncollected: string;
  netRevenue: string;
  cashProfit: string;
  opening: string;
  closing: string;
  change: string;
  compare: string;
  metric: string;
  delta: string;
  pct: string;
  invoices: string;
  offerNo: string;
  invoiceTitle: string;
  issued: string;
  paidOn: string;
  status: string;
  subtotal: string;
  total: string;
  services: string;
  paid: string;
  unpaid: string;
  paidLater: string;
  priorCollections: string;
  undated: string;
  empty: string;
  note: string;
  company: string;
};

function copy(isRtl: boolean): Copy {
  if (isRtl) {
    return {
      title: "التقرير الشهري",
      subtitle: "تقرير الأرباح والخسائر ومقارنة الشهر السابق",
      current: "الشهر المختار",
      previous: "الشهر السابق",
      generated: "تاريخ الإصدار",
      pl: "قائمة الدخل",
      invoiced: "الفواتير المصدرة",
      vat: "ضريبة القيمة المضافة (15%)",
      gross: "الإجمالي شامل الضريبة",
      collected: "التحصيل خلال الفترة",
      uncollected: "غير المحصل من فواتير الفترة",
      netRevenue: "صافي الإيراد (قبل الضريبة)",
      cashProfit: "الربح المحصل (قبل الضريبة)",
      opening: "المستحقات أول الفترة",
      closing: "المستحقات آخر الفترة",
      change: "التغير في المستحقات",
      compare: "المقارنة مع الشهر السابق",
      metric: "البند",
      delta: "الفرق",
      pct: "التغير %",
      invoices: "تفاصيل الفواتير",
      offerNo: "رقم العرض",
      invoiceTitle: "العنوان",
      issued: "تاريخ الإصدار",
      paidOn: "تاريخ التحصيل",
      status: "الحالة",
      subtotal: "قبل الضريبة",
      total: "الإجمالي",
      services: "نطاق الخدمات",
      paid: "محصل خلال الفترة",
      unpaid: "غير مدفوع",
      paidLater: "حُصّل لاحقاً",
      priorCollections: "تحصيل من فترات سابقة",
      undated: "فواتير بدون تاريخ",
      empty: "لا توجد فواتير في هذه الفترة",
      note: "الأرقام محسوبة من الفواتير المضافة للوحة فقط. الضريبة ليست ربحاً. النسب والخدمات بدون تكلفة لا تُضاف إلى الإجمالي.",
      company: "مقصد للعقارات",
    };
  }
  return {
    title: "Monthly statement",
    subtitle: "Profit & loss compared with the previous month",
    current: "Selected month",
    previous: "Previous month",
    generated: "Generated",
    pl: "Profit & loss",
    invoiced: "Invoices issued",
    vat: "VAT (15%)",
    gross: "Gross including VAT",
    collected: "Collected in period",
    uncollected: "Uncollected from period invoices",
    netRevenue: "Net revenue (ex-VAT)",
    cashProfit: "Collected profit (ex-VAT)",
    opening: "Opening receivables",
    closing: "Closing receivables",
    change: "Change in receivables",
    compare: "Comparison vs previous month",
    metric: "Line",
    delta: "Difference",
    pct: "Change %",
    invoices: "Invoice details",
    offerNo: "Offer no.",
    invoiceTitle: "Title",
    issued: "Issued",
    paidOn: "Collected",
    status: "Status",
    subtotal: "Before tax",
    total: "Total",
    services: "Services",
    paid: "Collected in period",
    unpaid: "Unpaid",
    paidLater: "Collected later",
    priorCollections: "Collections from earlier invoices",
    undated: "Invoices without a date",
    empty: "No invoices in this period",
    note: "Figures are taken only from offers assigned to the dashboard. VAT is not profit. Percent and no-cost services are not added to totals.",
    company: "Maqsed Real Estate",
  };
}

function metricLabel(key: string, isRtl: boolean) {
  const ar: Record<string, string> = {
    issuedCount: "عدد الفواتير",
    issuedSubtotal: "قبل الضريبة",
    issuedVat: "الضريبة (15%)",
    issuedTotal: "إجمالي الفواتير",
    netRevenue: "صافي الإيراد",
    issuedPaidCount: "فواتير محصلة (من الفترة)",
    issuedPaidTotal: "مبلغ محصل (من الفترة)",
    issuedUnpaidCount: "فواتير غير محصلة (من الفترة)",
    issuedUnpaidTotal: "مبلغ غير محصل (من الفترة)",
    periodLoss: "غير محصل من فواتير الفترة",
    collectedCount: "عمليات التحصيل",
    collectedTotal: "إجمالي التحصيل النقدي",
    collectedProfit: "الربح المحصل",
    collectionRate: "نسبة التحصيل",
    averageInvoice: "متوسط الفاتورة",
    openingTotal: "مستحقات أول الفترة",
    closingTotal: "مستحقات آخر الفترة",
    outstandingChange: "صافي تغير المستحقات",
  };
  const en: Record<string, string> = {
    issuedCount: "Invoice count",
    issuedSubtotal: "Before tax",
    issuedVat: "VAT (15%)",
    issuedTotal: "Invoice total",
    netRevenue: "Net revenue",
    issuedPaidCount: "Collected invoices (period)",
    issuedPaidTotal: "Collected amount (period)",
    issuedUnpaidCount: "Uncollected invoices (period)",
    issuedUnpaidTotal: "Uncollected amount (period)",
    periodLoss: "Uncollected from period invoices",
    collectedCount: "Collection transactions",
    collectedTotal: "Cash collected",
    collectedProfit: "Collected profit",
    collectionRate: "Collection rate",
    averageInvoice: "Average invoice",
    openingTotal: "Opening receivables",
    closingTotal: "Closing receivables",
    outstandingChange: "Net change in receivables",
  };
  return (isRtl ? ar : en)[key] || key;
}

function isCountKey(key: string) {
  return key.endsWith("Count");
}

function isRateKey(key: string) {
  return key === "collectionRate";
}

function formatMetric(key: string, value: number, isRtl: boolean) {
  if (isRateKey(key)) return `${value.toFixed(1)}%`;
  if (isCountKey(key)) return formatCount(value);
  return formatSar(value, isRtl);
}

function shortStatus(row: StatementInvoice, isRtl: boolean) {
  if (row.paidInPeriod) return isRtl ? "مدفوع" : "Paid";
  if (row.paidAfterPeriod) return isRtl ? "لاحقاً" : "Later";
  return isRtl ? "غير مدفوع" : "Unpaid";
}

function moneyCell(value: string) {
  return `<span style="direction:ltr;unicode-bidi:isolate;white-space:nowrap;">${value}</span>`;
}

function pdfDay(ms: number | null) {
  if (!ms) return "—";
  const d = new Date(ms);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

const TH = "padding:7px 5px;color:#ffffff;font-size:10px;font-weight:700;white-space:nowrap;";
const TD = "padding:7px 5px;border-bottom:1px solid #ececec;font-size:10px;vertical-align:top;";

function invoiceColgroup() {
  return `
    <colgroup>
      <col style="width:11%;" />
      <col style="width:16%;" />
      <col style="width:11%;" />
      <col style="width:11%;" />
      <col style="width:11%;" />
      <col style="width:13%;" />
      <col style="width:13%;" />
      <col style="width:14%;" />
    </colgroup>
  `;
}

function invoiceThead(c: Copy, isRtl: boolean) {
  const a = isRtl ? "right" : "left";
  return `
    <thead>
      <tr style="background:#0a0f1d;">
        <th style="${TH}text-align:${a};">${c.offerNo}</th>
        <th style="${TH}text-align:${a};">${c.invoiceTitle}</th>
        <th style="${TH}text-align:${a};">${c.issued}</th>
        <th style="${TH}text-align:${a};">${c.paidOn}</th>
        <th style="${TH}text-align:${a};">${c.status}</th>
        <th style="${TH}text-align:left;">${c.subtotal}</th>
        <th style="${TH}text-align:left;">VAT</th>
        <th style="${TH}text-align:left;">${c.total}</th>
      </tr>
    </thead>
  `;
}

function invoiceRow(row: StatementInvoice, isRtl: boolean, c: Copy) {
  const a = isRtl ? "right" : "left";
  const services =
    row.services.length > 0
      ? row.services.map((item) => `${escapeHtml(item.description)} (${escapeHtml(item.value)})`).join(" · ")
      : "—";

  return `
    <tr>
      <td style="${TD}font-weight:800;color:#0a0f1d;text-align:${a};white-space:nowrap;">${escapeHtml(row.offerNumber)}</td>
      <td style="${TD}font-weight:700;color:#0a0f1d;text-align:${a};word-wrap:break-word;">${escapeHtml(row.title || "—")}</td>
      <td style="${TD}color:#374151;text-align:${a};white-space:nowrap;direction:ltr;">${pdfDay(row.issuedAt)}</td>
      <td style="${TD}color:#374151;text-align:${a};white-space:nowrap;direction:ltr;">${pdfDay(row.actualPaidAt)}</td>
      <td style="${TD}font-weight:700;color:#0a0f1d;text-align:${a};">${shortStatus(row, isRtl)}</td>
      <td style="${TD}text-align:left;">${moneyCell(formatSarNumber(row.subtotal))}</td>
      <td style="${TD}text-align:left;color:#6b7280;">${moneyCell(formatSarNumber(row.vat))}</td>
      <td style="${TD}text-align:left;font-weight:800;">${moneyCell(formatSarNumber(row.total))}</td>
    </tr>
    <tr>
      <td colspan="8" style="padding:3px 5px 8px;border-bottom:1px solid #e5e7eb;font-size:9px;line-height:1.45;color:#6b7280;text-align:${a};">
        <span style="font-weight:700;color:#0d9488;">${c.services}:</span> ${services}
      </td>
    </tr>
  `;
}

function invoiceTable(rows: StatementInvoice[], isRtl: boolean, c: Copy, emptyText: string) {
  if (rows.length === 0) {
    return `<div style="padding:16px;text-align:center;color:#8c8c8c;font-size:12px;font-weight:600;border:1px solid #ececec;">${emptyText}</div>`;
  }
  return `
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      ${invoiceColgroup()}
      ${invoiceThead(c, isRtl)}
      <tbody>${rows.map((row) => invoiceRow(row, isRtl, c)).join("")}</tbody>
    </table>
  `;
}

function plRow(label: string, value: string, strong = false, teal = false) {
  return `
    <div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <span style="font-size:12px;font-weight:${strong ? 800 : 600};color:${teal ? "#0d9488" : "#0a0f1d"};">${label}</span>
      <span style="font-size:12px;font-weight:${strong ? 800 : 700};color:${teal ? "#0d9488" : "#0a0f1d"};">${moneyCell(value)}</span>
    </div>
  `;
}

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_BAR = 6;
const PAGE_PAD_X = 28;
const PAGE_PAD_Y = 26;
const INNER_WIDTH = PAGE_WIDTH - PAGE_PAD_X * 2;
const INNER_HEIGHT = PAGE_HEIGHT - PAGE_BAR - PAGE_PAD_Y * 2 - 16;
const SECTION_GAP = 26;

function pageShell(inner: string, isRtl: boolean) {
  const dir = isRtl ? "rtl" : "ltr";
  return `
    <div style="background:#ffffff;width:${PAGE_WIDTH}px;min-height:${PAGE_HEIGHT}px;box-sizing:border-box;font-family:Tahoma,Arial,sans-serif;direction:${dir};unicode-bidi:embed;color:#0a0f1d;">
      <div style="height:${PAGE_BAR}px;background:#0d9488;width:100%;"></div>
      <div style="padding:${PAGE_PAD_Y}px ${PAGE_PAD_X}px;box-sizing:border-box;">${inner}</div>
    </div>
  `;
}

function sectionTitle(text: string) {
  return `<div style="font-size:14px;font-weight:800;color:#0a0f1d;padding-bottom:8px;border-bottom:2px solid #0d9488;">${text}</div>`;
}

function sectionBlock(title: string, body: string) {
  return `${sectionTitle(title)}<div style="margin-top:12px;">${body}</div>`;
}

function headerBlock(
  c: Copy,
  isRtl: boolean,
  currentLabel: string,
  previousLabel: string,
  companyName: string,
  generatedAt: number
) {
  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:2px solid #0d9488;margin-bottom:14px;">
      <div>
        <div style="font-size:20px;font-weight:900;color:#0a0f1d;">مقصد</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;direction:ltr;">Maqsed Real Estate</div>
        ${companyName ? `<div style="font-size:12px;font-weight:700;color:#0a0f1d;margin-top:6px;">${escapeHtml(companyName)}</div>` : ""}
      </div>
      <div style="text-align:${isRtl ? "right" : "left"};">
        <div style="font-size:15px;font-weight:800;color:#0a0f1d;">${c.title}</div>
        <div style="font-size:11px;color:#0d9488;margin-top:3px;font-weight:700;">${c.subtitle}</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;">
      <div style="flex:1;background:#f0fdfa;border-${isRtl ? "right" : "left"}:3px solid #0d9488;padding:10px 12px;">
        <div style="font-size:10px;color:#0d9488;font-weight:700;">${c.current}</div>
        <div style="font-size:13px;font-weight:800;margin-top:3px;">${escapeHtml(currentLabel)}</div>
      </div>
      <div style="flex:1;background:#F4F4F4;padding:10px 12px;">
        <div style="font-size:10px;color:#8c8c8c;font-weight:700;">${c.previous}</div>
        <div style="font-size:13px;font-weight:800;margin-top:3px;">${escapeHtml(previousLabel)}</div>
      </div>
      <div style="flex:1;background:#F4F4F4;padding:10px 12px;">
        <div style="font-size:10px;color:#8c8c8c;font-weight:700;">${c.generated}</div>
        <div style="font-size:13px;font-weight:800;margin-top:3px;">${pdfDay(generatedAt)}</div>
      </div>
    </div>
  `;
}

type PdfBlock = {
  html: string;
  gapBefore: number;
};

function measureHtml(html: string, isRtl: boolean) {
  const holder = document.createElement("div");
  holder.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${INNER_WIDTH}px;direction:${isRtl ? "rtl" : "ltr"};font-family:Tahoma,Arial,sans-serif;`;
  holder.innerHTML = html;
  document.body.appendChild(holder);
  const height = Math.ceil(holder.getBoundingClientRect().height);
  document.body.removeChild(holder);
  return Math.max(height, 1);
}

function packPages(blocks: PdfBlock[], isRtl: boolean) {
  const pages: string[][] = [[]];
  let used = 0;

  for (const block of blocks) {
    const height = measureHtml(block.html, isRtl);
    const gap = pages[pages.length - 1].length === 0 ? 0 : block.gapBefore;
    if (pages[pages.length - 1].length > 0 && used + gap + height > INNER_HEIGHT) {
      pages.push([]);
      used = 0;
    }
    const currentGap = pages[pages.length - 1].length === 0 ? 0 : block.gapBefore;
    pages[pages.length - 1].push(
      currentGap > 0 ? `<div style="height:${currentGap}px;"></div>${block.html}` : block.html
    );
    used += currentGap + height;
  }

  return pages;
}

function splitInvoiceSection(
  title: string,
  rows: StatementInvoice[],
  isRtl: boolean,
  c: Copy,
  emptyText: string
): PdfBlock[] {
  if (rows.length === 0) {
    return [{ html: sectionBlock(title, invoiceTable([], isRtl, c, emptyText)), gapBefore: SECTION_GAP }];
  }

  const chunks: StatementInvoice[][] = [];
  let current: StatementInvoice[] = [];

  for (const row of rows) {
    const trial = [...current, row];
    const heading = chunks.length === 0 ? title : `${title} (${isRtl ? "تتمة" : "cont."})`;
    const html = sectionBlock(heading, invoiceTable(trial, isRtl, c, emptyText));
    if (current.length > 0 && measureHtml(html, isRtl) > INNER_HEIGHT) {
      chunks.push(current);
      current = [row];
    } else {
      current = trial;
    }
  }
  if (current.length) chunks.push(current);

  return chunks.map((chunk, index) => ({
    html: sectionBlock(
      index === 0 ? title : `${title} (${isRtl ? "تتمة" : "cont."})`,
      invoiceTable(chunk, isRtl, c, emptyText)
    ),
    gapBefore: SECTION_GAP,
  }));
}

async function renderPagesToPdf(
  html2canvas: typeof import("html2canvas").default,
  pdf: InstanceType<typeof import("jspdf").default>,
  pages: string[][],
  isRtl: boolean
) {
  for (let i = 0; i < pages.length; i++) {
    const html = pageShell(pages[i].join(""), isRtl);
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:794px;background:#ffffff;";
    container.innerHTML = html;
    document.body.appendChild(container);
    try {
      const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (_clonedDoc: Document, element: HTMLElement) => {
          const clonedOwnerDoc = element.ownerDocument;
          clonedOwnerDoc.querySelectorAll("link[rel='stylesheet'], style").forEach((el) => el.remove());
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
    } finally {
      document.body.removeChild(container);
    }
  }
}

export async function downloadStatementPdf({
  statement,
  currentLabel,
  previousLabel,
  companyName,
  fileName,
  isRtl,
}: {
  statement: PeriodStatement;
  currentLabel: string;
  previousLabel: string;
  companyName: string;
  fileName: string;
  isRtl: boolean;
}) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const c = copy(isRtl);
  const cur = statement.current;
  const prev = statement.previous;
  const generatedAt = Date.now();
  const align = isRtl ? "right" : "left";

  const compareRows = statement.metrics
    .filter((item) => item.key !== "periodLoss")
    .map((item) => {
      const up = item.delta > 0;
      const down = item.delta < 0;
      const good = item.invert ? down : up;
      const color = item.delta === 0 ? "#6b7280" : good ? "#2f9e44" : "#c2410c";
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:700;text-align:${align};word-wrap:break-word;">${metricLabel(item.key, isRtl)}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:800;text-align:center;">${moneyCell(formatMetric(item.key, item.current, isRtl))}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:11px;color:#6b7280;text-align:center;">${moneyCell(formatMetric(item.key, item.previous, isRtl))}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:800;text-align:center;color:${color};">${moneyCell(`${item.delta > 0 ? "+" : ""}${formatMetric(item.key, item.delta, isRtl)}`)}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:11px;font-weight:800;text-align:center;color:${color};">${formatPct(item.pct, isRtl)}</td>
        </tr>
      `;
    })
    .join("");

  const compareTable = `
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      <colgroup>
        <col style="width:28%;" />
        <col style="width:18%;" />
        <col style="width:18%;" />
        <col style="width:18%;" />
        <col style="width:18%;" />
      </colgroup>
      <thead>
        <tr style="background:#0a0f1d;">
          <th style="padding:10px 8px;color:#fff;font-size:11px;text-align:${align};">${c.metric}</th>
          <th style="padding:10px 8px;color:#fff;font-size:11px;text-align:center;">${c.current}</th>
          <th style="padding:10px 8px;color:#fff;font-size:11px;text-align:center;">${c.previous}</th>
          <th style="padding:10px 8px;color:#fff;font-size:11px;text-align:center;">${c.delta}</th>
          <th style="padding:10px 8px;color:#fff;font-size:11px;text-align:center;">${c.pct}</th>
        </tr>
      </thead>
      <tbody>${compareRows}</tbody>
    </table>
  `;

  const plBlock = `
    <div style="display:flex;gap:16px;">
      <div style="flex:1;min-width:0;border:1px solid #e5e7eb;padding:12px 14px;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:800;color:#0d9488;margin-bottom:8px;">${c.current}</div>
        ${plRow(c.invoiced, `${formatCount(cur.issuedCount)} · ${formatSar(cur.issuedTotal, isRtl)}`)}
        ${plRow(c.netRevenue, formatSar(cur.netRevenue, isRtl))}
        ${plRow(c.vat, formatSar(cur.issuedVat, isRtl))}
        ${plRow(c.gross, formatSar(cur.issuedTotal, isRtl), true)}
        ${plRow(c.collected, formatSar(cur.collectedTotal, isRtl), false, true)}
        ${plRow(c.uncollected, formatSar(cur.periodLoss, isRtl))}
        ${plRow(c.cashProfit, formatSar(cur.collectedProfit, isRtl), true, true)}
        ${plRow(c.opening, formatSar(cur.openingTotal, isRtl))}
        ${plRow(c.closing, formatSar(cur.closingTotal, isRtl))}
        ${plRow(c.change, formatSignedSar(cur.outstandingChange, isRtl), true)}
      </div>
      <div style="flex:1;min-width:0;border:1px solid #e5e7eb;padding:12px 14px;box-sizing:border-box;">
        <div style="font-size:11px;font-weight:800;color:#8c8c8c;margin-bottom:8px;">${c.previous}</div>
        ${plRow(c.invoiced, `${formatCount(prev.issuedCount)} · ${formatSar(prev.issuedTotal, isRtl)}`)}
        ${plRow(c.netRevenue, formatSar(prev.netRevenue, isRtl))}
        ${plRow(c.vat, formatSar(prev.issuedVat, isRtl))}
        ${plRow(c.gross, formatSar(prev.issuedTotal, isRtl), true)}
        ${plRow(c.collected, formatSar(prev.collectedTotal, isRtl), false, true)}
        ${plRow(c.uncollected, formatSar(prev.periodLoss, isRtl))}
        ${plRow(c.cashProfit, formatSar(prev.collectedProfit, isRtl), true, true)}
        ${plRow(c.opening, formatSar(prev.openingTotal, isRtl))}
        ${plRow(c.closing, formatSar(prev.closingTotal, isRtl))}
        ${plRow(c.change, formatSignedSar(prev.outstandingChange, isRtl), true)}
      </div>
    </div>
  `;

  const blocks: PdfBlock[] = [
    { html: headerBlock(c, isRtl, currentLabel, previousLabel, companyName, generatedAt), gapBefore: 0 },
    { html: sectionBlock(c.pl, plBlock), gapBefore: SECTION_GAP },
    { html: sectionBlock(c.compare, compareTable), gapBefore: SECTION_GAP },
    ...splitInvoiceSection(`${c.invoices} — ${c.current}`, cur.issued, isRtl, c, c.empty),
  ];

  if (cur.priorCollections.length) {
    blocks.push(...splitInvoiceSection(c.priorCollections, cur.priorCollections, isRtl, c, c.empty));
  }
  if (cur.closingOutstanding.length) {
    blocks.push(...splitInvoiceSection(c.closing, cur.closingOutstanding, isRtl, c, c.empty));
  }
  blocks.push(...splitInvoiceSection(`${c.invoices} — ${c.previous}`, prev.issued, isRtl, c, c.empty));
  if (statement.undated.length) {
    blocks.push(...splitInvoiceSection(c.undated, statement.undated, isRtl, c, c.empty));
  }

  blocks.push({
    html: `<div style="font-size:11px;color:#6b7280;line-height:1.7;padding-top:4px;">${c.note}</div>
           <div style="margin-top:10px;border-top:1px solid #e5e7eb;padding-top:10px;font-size:12px;font-weight:700;color:#0d9488;">${c.company}</div>`,
    gapBefore: SECTION_GAP,
  });

  const pages = packPages(blocks, isRtl);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  await renderPagesToPdf(html2canvas, pdf, pages, isRtl);
  pdf.save(fileName);
}
