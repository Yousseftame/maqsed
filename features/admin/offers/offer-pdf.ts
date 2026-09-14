import type { OfferData } from "@/features/admin/offers/offers.service";
import { formatServiceValue } from "@/features/admin/offers/offer-services";

const AGREEMENT_LABELS: Record<string, string> = {
  exclusive: "حصري",
  marketing: "تسويقي",
  services: "تقديم خدمات",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function downloadOfferPDF(offer: OfferData) {
  // Dynamically import to avoid SSR issues
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  // Build the HTML content for the PDF
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 794px;
    background: white;
    font-family: 'Segoe UI', Arial, sans-serif;
    direction: rtl;
  `;
  const AR = `direction: rtl; unicode-bidi: embed;`;

  const services = offer.services || [];
  const agreementTypes = offer.agreementTypes || [];

  const servicesRows = services
    .map(
      (svc) => `
      <tr style="border-bottom: 1px solid #f3f4f6;">
        <td style="padding: 12px 18px; font-size: 15px; color: #1f2937; white-space: pre-wrap; ${AR}">${escapeHtml(svc.description || "—")}</td>
        <td style="padding: 12px 18px; font-size: 15px; font-weight: 700; color: #111827; text-align: left; white-space: nowrap; ${AR}">${escapeHtml(formatServiceValue(svc, true))}</td>
      </tr>
    `
    )
    .join("");

  const agreementList = agreementTypes
    .map(
      (type, i) => {
        const dotColor = i % 2 === 0 ? "#0f766e" : "#7c3aed";
        const label = AGREEMENT_LABELS[type] || type;
        return `<div style="display:block; margin-bottom:6px; direction:rtl; unicode-bidi:embed;"><span style="color:${dotColor}; font-size:18px; font-weight:900; vertical-align:middle; margin-left:8px;">•</span><span style="font-size:15px; font-weight:600; color:#111827; direction:rtl; unicode-bidi:embed;">${label}</span></div>`;
      }
    )
    .join("");

  container.innerHTML = `
    <div style="background: white; width: 794px; min-height: 1122px; padding: 0; font-family: Tahoma, Arial, sans-serif; direction: rtl; unicode-bidi: embed;">

      <!-- Teal top accent bar -->
      <div style="height: 6px; background: #0d9488; width: 100%;"></div>

      <div style="padding: 40px 56px 28px;">

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 22px; border-bottom: 2px solid #0d9488; margin-bottom: 32px;">
          <div>
            <div style="font-size: 22px; font-weight: 900; color: #0a0f1d; ${AR}">مقصد</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 3px; direction: ltr;">Maqsed Real Estate</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 800; color: #0a0f1d; ${AR}">عرض فني</div>
            <div style="font-size: 13px; color: #0d9488; margin-top: 5px; font-weight: 700; direction: ltr;">${offer.offerNumber ? `#${offer.offerNumber}` : "—"}</div>
          </div>
        </div>

        <!-- Meta row: title + date -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px;">
          <div>
            <div style="font-size: 19px; font-weight: 700; color: #0a0f1d; ${AR}">${offer.title || "—"}</div>
            ${
              (offer.projectName || "").trim()
                ? `<div style="font-size: 14px; color: #6b7280; margin-top: 5px; ${AR}">المشروع: <span style="color: #0a0f1d; font-weight: 600;">${escapeHtml(offer.projectName!.trim())}</span></div>`
                : ""
            }
            ${
              (offer.unitNumber || "").trim()
                ? `<div style="font-size: 14px; color: #6b7280; margin-top: 4px; ${AR}">الوحدة: <span style="color: #0a0f1d; font-weight: 600;">${escapeHtml(offer.unitNumber!.trim())}</span></div>`
                : ""
            }
          </div>
          <div style="text-align: right; min-width: 170px; background: #f0fdfa; border-right: 3px solid #0d9488; padding: 12px 16px 14px; border-radius: 4px;">
            <div style="font-size: 11px; color: #0d9488; font-weight: 700; line-height: 2; ${AR}">تاريخ الإصدار</div>
            <div style="font-size: 14px; font-weight: 700; color: #0a0f1d; line-height: 2; ${AR}">${formatDate(offer.createdAt)}</div>
          </div>
        </div>

        ${
          (offer.description || "").trim()
            ? `
          <div style="margin-bottom: 28px; background: #f8fafc; border-right: 3px solid #0d9488; padding: 14px 18px; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #0d9488; margin-bottom: 8px; ${AR}">وصف العرض</div>
            <div style="font-size: 14px; color: #374151; line-height: 1.8; white-space: pre-wrap; ${AR}">${escapeHtml(offer.description!.trim()).replace(/\n/g, "<br/>")}</div>
          </div>
        `
            : ""
        }

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 28px;" />

        <!-- Client Info -->
        <div style="margin-bottom: 28px;">
          <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px;"><span style="color: #7c3aed; direction: ltr; display: inline;">● </span><span style="color: #7c3aed; direction: rtl; unicode-bidi: embed; display: inline;">إلى</span></div>
          <div style="font-size: 16px; font-weight: 700; color: #0a0f1d; ${AR}">${offer.developerName || "—"}</div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 3px; direction: ltr;">${offer.developerEmail || "—"}</div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 3px; direction: ltr;">${offer.developerPhone || "—"}</div>
        </div>

        <!-- Agreement Types -->
        ${
          agreementTypes.length > 0
            ? `
          <div style="margin-bottom: 28px;">
            <div style="font-size: 11px; font-weight: 700; margin-bottom: 8px;"><span style="color: #7c3aed; direction: ltr; display: inline;">● </span><span style="color: #7c3aed; direction: rtl; unicode-bidi: embed; display: inline;">نوع الاتفاقية</span></div>
            ${agreementList}
          </div>
        `
            : ""
        }

        <!-- Services Table -->
        ${
          services.length > 0
            ? `
          <div style="margin-bottom: 28px;">
            <div style="font-size: 11px; font-weight: 700; margin-bottom: 12px;"><span style="color: #7c3aed; direction: ltr; display: inline;">● </span><span style="color: #7c3aed; direction: rtl; unicode-bidi: embed; display: inline;">نطاق الخدمات المقدمة</span></div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #0d9488;">
                  <th style="padding: 12px 18px; text-align: right; font-size: 13px; font-weight: 700; color: #ffffff; border-bottom: 1px solid #0d9488; ${AR}">الخدمة</th>
                  <th style="padding: 12px 18px; text-align: left; font-size: 13px; font-weight: 700; color: #ffffff; border-bottom: 1px solid #0d9488; white-space: nowrap; direction: rtl; unicode-bidi: embed;">القيمة</th>
                </tr>
              </thead>
              <tbody>
                ${servicesRows}
              </tbody>
            </table>
          </div>
        `
            : ""
        }

        <!-- Totals + footer kept together so they never orphan onto a second page -->
        <div style="border-top: 2px solid #e5e7eb; padding-top: 18px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-size: 15px; color: #6b7280; ${AR}">المجموع قبل الضريبة</span>
            <span style="font-size: 15px; color: #374151; font-weight: 600; direction: ltr;">${Number(offer.subtotal || 0).toLocaleString()} SAR</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #e5e7eb;">
            <span style="font-size: 15px; color: #6b7280; ${AR}">ضريبة القيمة المضافة (15%)</span>
            <span style="font-size: 15px; color: #374151; font-weight: 600; direction: ltr;">${Number(offer.vat || 0).toLocaleString()} SAR</span>
          </div>
          <div style="display: flex; justify-content: space-between; background: #0d9488; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px;">
            <span style="font-size: 17px; font-weight: 800; color: #ffffff; ${AR}">الإجمالي شامل الضريبة</span>
            <span style="font-size: 17px; font-weight: 800; color: #ffffff; direction: ltr;">${Number(offer.total || offer.financialAmount || 0).toLocaleString()} SAR</span>
          </div>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.8; margin-bottom: 18px; ${AR}">النسب والخدمات بدون تكلفة تظهر في النطاق ولا تُضاف إلى الإجمالي أو الضريبة.</div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 14px; text-align: left;">
            <div style="font-size: 12px; font-weight: 700; color: #0d9488; direction: rtl; unicode-bidi: embed;">مقصد للعقارات</div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (_clonedDoc: Document, element: HTMLElement) => {
        // Remove all external CSS stylesheets from the cloned document.
        // html2canvas cannot parse modern CSS color functions like lab() or oklch()
        // used by Tailwind CSS. Since our PDF template uses only inline styles this is safe.
        const clonedOwnerDoc = element.ownerDocument;
        clonedOwnerDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => el.remove());
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let drawWidth = pdfWidth;
    let drawHeight = (canvas.height * pdfWidth) / canvas.width;

    // Always keep the offer on a single A4 page. If content is a few pixels over,
    // scale it down instead of creating a nearly empty second page.
    if (drawHeight > pdfHeight) {
      const fit = pdfHeight / drawHeight;
      drawWidth = pdfWidth * fit;
      drawHeight = pdfHeight;
    }

    const x = (pdfWidth - drawWidth) / 2;
    pdf.addImage(imgData, "PNG", x, 0, drawWidth, drawHeight);

    const fileName = `عرض-${offer.offerNumber || offer.id}-${offer.developerName || "offer"}.pdf`;
    pdf.save(fileName);
  } finally {
    document.body.removeChild(container);
  }
}
