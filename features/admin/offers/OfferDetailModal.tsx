"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  X,
  FileSignature,
  User,
  Building2,
  Mail,
  Phone,
  Hash,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { OfferData } from "./offers.service";
import { downloadOfferPDF } from "./offer-pdf";
import { formatServiceValue } from "./offer-services";

const AGREEMENT_LABELS: Record<string, string> = {
  exclusive: "حصري",
  marketing: "تسويقي",
  services: "تقديم خدمات",
};

type Props = {
  offer: OfferData | null;
  onClose: () => void;
  onAssignToDashboard?: (offer: OfferData) => void;
};

function StatusBadge({ status }: { status: OfferData["status"] }) {
  if (status === "accepted")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
        <CheckCircle className="h-3.5 w-3.5" /> مقبول
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">
        <XCircle className="h-3.5 w-3.5" /> مرفوض
      </span>
    );
  if (status === "viewed")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
        <CheckCircle className="h-3.5 w-3.5" /> تمت المشاهدة
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
      <Clock className="h-3.5 w-3.5" /> لم يُشاهَد
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#F4F4F4] last:border-0">
      <div className="h-8 w-8 rounded-[8px] bg-[#F4F4F4] flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-[#0a0f1d]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#8c8c8c] leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-[#0a0f1d] truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-black text-[#0a0f1d] mb-2.5 flex items-center gap-2 before:content-[''] before:block before:h-3.5 before:w-0.5 before:bg-[#0a0f1d] before:rounded-full">
      {children}
    </h3>
  );
}

export function OfferDetailModal({ offer, onClose, onAssignToDashboard }: Props) {
  const { t, isRtl } = useLocale();

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <AnimatePresence>
      {offer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="relative z-10 w-full max-w-3xl rounded-[24px] bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0a0f1d] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[10px] bg-white/10 flex items-center justify-center shrink-0">
                  <FileSignature className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">{offer.title || "—"}</h2>
                  <p className="text-xs text-white/50 mt-0.5">{offer.offerNumber ? `#${offer.offerNumber}` : "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={offer.status} />
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[calc(90vh-160px)] overflow-y-auto">
              {(offer.description || "").trim() ? (
                <div>
                  <SectionTitle>{isRtl ? "وصف العرض" : "Description"}</SectionTitle>
                  <div className="rounded-[14px] border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 max-h-36 overflow-y-auto">
                    <p className="text-sm font-medium text-[#0a0f1d] whitespace-pre-wrap leading-relaxed">
                      {(offer.description || "").trim()}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-5">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* Developer Info */}
                <div>
                  <SectionTitle>{isRtl ? "بيانات المطور" : "Developer Info"}</SectionTitle>
                  <div className="rounded-[14px] border border-[#F0F0F0] bg-white px-3">
                    <InfoRow icon={User} label={isRtl ? "اسم المطور" : "Developer"} value={offer.developerName} />
                    {offer.assignedDeveloperUid ? (
                      <InfoRow
                        icon={User}
                        label={isRtl ? "لوحة المطور" : "Dashboard"}
                        value={offer.assignedDeveloperName}
                      />
                    ) : null}
                    {(offer.projectName || "").trim() ? (
                      <InfoRow icon={Building2} label={isRtl ? "المشروع" : "Project"} value={offer.projectName} />
                    ) : null}
                    {(offer.unitNumber || "").trim() ? (
                      <InfoRow icon={Hash} label={isRtl ? "الوحدة" : "Unit"} value={offer.unitNumber} />
                    ) : null}
                    <InfoRow icon={Mail} label={isRtl ? "البريد الإلكتروني" : "Email"} value={offer.developerEmail} />
                    <InfoRow icon={Phone} label={isRtl ? "الجوال" : "Phone"} value={offer.developerPhone} />
                  </div>
                </div>

                {/* Offer Meta */}
                <div>
                  <SectionTitle>{isRtl ? "تفاصيل العرض" : "Offer Details"}</SectionTitle>
                  <div className="rounded-[14px] border border-[#F0F0F0] bg-white px-3">
                    <InfoRow icon={Hash} label={isRtl ? "رقم العرض" : "Offer #"} value={offer.offerNumber ? `#${offer.offerNumber}` : "—"} />
                    <InfoRow icon={Lock} label={isRtl ? "الرمز السري (OTP)" : "OTP"} value={offer.secretCode} />
                    <InfoRow icon={Clock} label={isRtl ? "تاريخ الإصدار" : "Issued"} value={formatDate(offer.createdAt)} />
                    {offer.viewedAt && (
                      <InfoRow icon={CheckCircle} label={isRtl ? "تاريخ المشاهدة" : "Viewed"} value={formatDate(offer.viewedAt)} />
                    )}
                    <InfoRow
                      icon={offer.paymentStatus === "received" ? CheckCircle : Clock}
                      label={t("admin.offers.payment")}
                      value={
                        offer.paymentStatus === "received"
                          ? t("admin.offers.paymentReceived")
                          : t("admin.offers.paymentUnpaid")
                      }
                    />
                  </div>
                </div>

                {/* Agreement Types */}
                {offer.agreementTypes && offer.agreementTypes.length > 0 && (
                  <div>
                    <SectionTitle>{isRtl ? "نوع الاتفاقية" : "Agreement Types"}</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                      {offer.agreementTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-full bg-[#0a0f1d] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                          {AGREEMENT_LABELS[type] || type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* Services Table */}
                {offer.services && offer.services.length > 0 && (
                  <div>
                    <SectionTitle>{isRtl ? "نطاق الخدمات" : "Services"}</SectionTitle>
                    <div className="rounded-[14px] border border-[#F0F0F0] overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F4F4F4]">
                            <th className="px-3 py-2 text-right text-[10px] font-bold text-[#8c8c8c]">
                              {isRtl ? "الخدمة" : "Service"}
                            </th>
                            <th className="px-3 py-2 text-left text-[10px] font-bold text-[#8c8c8c] whitespace-nowrap">
                              {isRtl ? "القيمة" : "Value"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {offer.services.map((svc, i) => (
                            <tr key={i} className="border-t border-[#F4F4F4]">
                              <td className="px-3 py-2 text-xs text-[#0a0f1d] font-medium whitespace-pre-wrap">{svc.description || "—"}</td>
                              <td className="px-3 py-2 text-xs font-bold text-[#0a0f1d] tabular-nums text-left whitespace-nowrap">
                                {formatServiceValue(svc, isRtl)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Financial Summary */}
                <div>
                  <SectionTitle>{isRtl ? "الملخص المالي" : "Financial Summary"}</SectionTitle>
                  <div className="rounded-[14px] bg-[#0a0f1d] p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-white/60 text-xs font-medium">
                      <span>{isRtl ? "قبل الضريبة" : "Subtotal"}</span>
                      <span className="font-mono text-white font-bold">
                        {Number(offer.subtotal || 0).toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-white/60 text-xs font-medium border-b border-white/10 pb-2.5">
                      <span>{isRtl ? "الضريبة (15%)" : "VAT (15%)"}</span>
                      <span className="font-mono text-white font-bold">
                        {Number(offer.vat || 0).toLocaleString()} SAR
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-white text-base font-black">
                      <span>{isRtl ? "الإجمالي" : "Total"}</span>
                      <span className="font-mono">
                        {Number(offer.total || offer.financialAmount || 0).toLocaleString()} SAR
                      </span>
                    </div>
                    <p className="pt-1 text-[11px] font-medium leading-relaxed text-white/45">
                      {isRtl
                        ? "النسب والخدمات بدون تكلفة تظهر في النطاق ولا تُضاف إلى الإجمالي أو الضريبة."
                        : "Percent and no-cost services appear in the scope and are not added to the total or VAT."}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-5 py-4 border-t border-[#F4F4F4]">
              <button
                onClick={onClose}
                className="h-10 rounded-[12px] bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors"
              >
                {isRtl ? "إغلاق" : "Close"}
              </button>
              <div className="flex gap-2">
                {offer.status === "accepted" && onAssignToDashboard ? (
                  <button
                    type="button"
                    onClick={() => onAssignToDashboard(offer)}
                    className="flex h-10 items-center gap-2 rounded-[12px] bg-[#0a0f1d] px-5 text-sm font-bold text-white hover:bg-[#161c2d] transition-colors"
                  >
                    {offer.assignedDeveloperUid
                      ? (isRtl ? "عرض الإضافة للوحة" : "Dashboard assignment")
                      : (isRtl ? "إضافة للوحة" : "Add to dashboard")}
                  </button>
                ) : null}
                <button
                  onClick={() => downloadOfferPDF(offer)}
                  className="flex h-10 items-center gap-2 rounded-[12px] bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {isRtl ? "تحميل PDF" : "Download PDF"}
                </button>
                <a
                  href={`/offer/${offer.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center gap-2 rounded-[12px] bg-[#0a0f1d] px-5 text-sm font-bold text-white hover:bg-[#161c2d] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isRtl ? "رابط العرض" : "Public Link"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
