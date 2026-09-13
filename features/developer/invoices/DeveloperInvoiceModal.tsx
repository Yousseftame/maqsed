"use client";

import { AnimatePresence, motion } from "motion/react";
import { Building2, Hash, ReceiptText, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offerFinancials, type OfferData } from "@/features/admin/offers/offers.service";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";

type Props = {
  offer: OfferData | null;
  onClose: () => void;
};

function formatSar(value: number) {
  return `${value.toLocaleString()} ر.س`;
}

export function DeveloperInvoiceModal({ offer, onClose }: Props) {
  const { isRtl } = useLocale();
  const financials = offer ? offerFinancials(offer) : null;
  const received = offer?.paymentStatus === "received";

  return (
    <AnimatePresence>
      {offer && financials ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir={isRtl ? "rtl" : "ltr"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                  {isRtl ? "الفاتورة" : "Invoice"}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#8c8c8c]">
                  {offer.offerNumber ? `#${offer.offerNumber}` : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-[#0a0f1d]">{offer.title || "—"}</p>
                  <p className="mt-1 text-sm font-medium text-[#8c8c8c]">
                    {offer.projectName || "—"}
                    {offer.unitNumber ? ` · ${isRtl ? "الوحدة" : "Unit"} ${offer.unitNumber}` : ""}
                  </p>
                </div>
                <StatusBadge tone={received ? "success" : "warning"}>
                  {received
                    ? (isRtl ? "تم استلام المبلغ" : "Payment received")
                    : (isRtl ? "غير مدفوع" : "Unpaid")}
                </StatusBadge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem icon={Hash} label={isRtl ? "رقم العرض" : "Offer number"} value={offer.offerNumber ? `#${offer.offerNumber}` : "—"} />
                <DetailItem icon={Building2} label={isRtl ? "المشروع" : "Project"} value={offer.projectName} />
                <DetailItem icon={ReceiptText} label={isRtl ? "الوحدة" : "Unit"} value={offer.unitNumber} />
              </div>

              {offer.services && offer.services.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-[#0a0f1d]">{isRtl ? "نطاق الخدمات" : "Services"}</h3>
                  <div className="overflow-hidden rounded-[16px] border border-[#0a0f1d]/8">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F4F4F4]">
                          <th className="px-4 py-2.5 text-start text-[11px] font-bold text-[#8c8c8c]">
                            {isRtl ? "الخدمة" : "Service"}
                          </th>
                          <th className="px-4 py-2.5 text-end text-[11px] font-bold text-[#8c8c8c] whitespace-nowrap">
                            ر.س
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {offer.services.map((service, index) => (
                          <tr key={`${service.description}-${index}`} className="border-t border-[#F4F4F4]">
                            <td className="px-4 py-2.5 text-sm font-medium text-[#0a0f1d]">
                              {service.description || "—"}
                            </td>
                            <td className="px-4 py-2.5 text-end text-sm font-bold tabular-nums text-[#0a0f1d]">
                              {Number(service.price || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#0a0f1d]">{isRtl ? "الملخص المالي" : "Financial Summary"}</h3>
                <div className="space-y-2.5 rounded-[16px] bg-[#0a0f1d] p-5">
                  <div className="flex items-center justify-between text-xs font-medium text-white/60">
                    <span>{isRtl ? "قبل الضريبة" : "Subtotal"}</span>
                    <span className="font-mono font-bold text-white">{formatSar(financials.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs font-medium text-white/60">
                    <span>{isRtl ? "الضريبة (15%)" : "VAT (15%)"}</span>
                    <span className="font-mono font-bold text-white">{formatSar(financials.vat)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-white">
                    <span>{isRtl ? "الإجمالي" : "Total"}</span>
                    <span className="font-mono">{formatSar(financials.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F4F4] px-6 text-sm font-bold text-[#0a0f1d] hover:bg-[#EAEAEA]"
              >
                {isRtl ? "إغلاق" : "Close"}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 rounded-[16px] bg-[#F8F8F8] px-4 py-3">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#8c8c8c]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-[#0a0f1d]">{value?.trim() || "—"}</p>
    </div>
  );
}
