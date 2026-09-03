"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PublicOfferSectionProps {
  offerId: string;
}

const AGREEMENT_LABELS: Record<string, string> = {
  exclusive: "حصري",
  marketing: "تسويقي",
  services: "تقديم خدمات",
};

export function PublicOfferSection({ offerId }: PublicOfferSectionProps) {
  const { t, isRtl } = useLocale();
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otp = otpValues.join("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerData, setOfferData] = useState<any>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [responseStatus, setResponseStatus] = useState<"accepted" | "rejected" | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError(t("offerPage.invalidCodeLength") || "Please enter a valid 6-digit code.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const offerRef = doc(db, "offers", offerId);
      const offerSnap = await getDoc(offerRef);
      if (!offerSnap.exists()) {
        setError(t("offerPage.offerNotFound") || "Offer not found or no longer available.");
        setIsVerifying(false);
        return;
      }
      const data = offerSnap.data();
      if (data.secretCode !== otp) {
        setError(t("offerPage.invalidCode") || "Invalid secure code. Please try again.");
        setIsVerifying(false);
        return;
      }
      setOfferData({ id: offerSnap.id, ...data });
      if (data.status === "pending") {
        await updateDoc(offerRef, { status: "viewed", viewedAt: serverTimestamp() });
      } else if (!data.viewedAt) {
        await updateDoc(offerRef, { viewedAt: serverTimestamp() });
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(t("offerPage.failedVerify") || "Failed to verify the secure code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResponse = async (status: "accepted" | "rejected") => {
    setIsResponding(true);
    try {
      const offerRef = doc(db, "offers", offerId);
      await updateDoc(offerRef, { status, respondedAt: serverTimestamp() });
      setResponseStatus(status);
    } catch (err) {
      console.error("Error updating response:", err);
    } finally {
      setIsResponding(false);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8" dir={isRtl ? "rtl" : "ltr"}>
      <AnimatePresence mode="wait">

        {/* ── OTP Step ── */}
        {!offerData && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-5">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {t("offerPage.secureAccess") || "الوصول الآمن للعرض"}
              </h2>
              <p className="text-sm text-gray-500">
                {t("offerPage.enterCode") || "أدخل الرمز السري المكون من 6 أرقام"}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-2" dir="ltr">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpValues[index]}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const newOtp = [...otpValues];
                      newOtp[index] = val;
                      setOtpValues(newOtp);
                      if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otpValues[index] && index > 0) {
                        document.getElementById(`otp-${index - 1}`)?.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").substring(0, 6);
                      if (pasted) {
                        const newOtp = [...otpValues];
                        for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || "";
                        setOtpValues(newOtp);
                        document.getElementById(`otp-${Math.min(5, pasted.length)}`)?.focus();
                      }
                    }}
                    className="w-11 h-13 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? <Loader2 className="animate-spin w-4 h-4" /> : (t("offerPage.verifyBtn") || "عرض العرض")}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Offer Document ── */}
        {offerData && (
          <motion.div
            key="offer-details"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl"
          >
            {/* Response confirmation screen */}
            {responseStatus || offerData.status === "accepted" || offerData.status === "rejected" ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                {(responseStatus || offerData.status) === "accepted" ? (
                  <>
                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t("offerPage.offerAccepted") || "تم قبول العرض"}
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      {t("offerPage.offerAcceptedDesc") || "شكراً لك. سيتم التواصل معك لإتمام الإجراءات اللازمة."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5">
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {t("offerPage.offerDeclined") || "تم رفض العرض"}
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      {t("offerPage.offerDeclinedDesc") || "تم إبلاغ الإدارة. شكراً لوقتك."}
                    </p>
                  </>
                )}
              </div>
            ) : (
              /* ── Quotation Document ── */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Company Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <img src="/logoadminpanel.png" alt="مقصد" className="h-9 object-contain" />
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium">
                      {isRtl ? "رقم العرض" : "Offer No."}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {offerData.offerNumber ? `#${offerData.offerNumber}` : "—"}
                    </p>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-7">

                  {/* Title + Date row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 mb-1">{offerData.title}</h1>
                      <p className="text-sm text-gray-500">
                        {isRtl ? "المشروع:" : "Project:"}{" "}
                        <span className="text-gray-800 font-medium">{offerData.projectName}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        {isRtl ? "تاريخ الإصدار" : "Issue Date"}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(offerData.createdAt)}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-100" />

                  {/* Client Info */}
                  <div className="text-sm">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                      {isRtl ? "إلى" : "To"}
                    </p>
                    <p className="font-bold text-gray-900">{offerData.developerName}</p>
                    <p className="text-gray-500">{offerData.developerEmail}</p>
                    <p className="text-gray-500">{offerData.developerPhone}</p>
                  </div>

                  {/* Agreement Types */}
                  {offerData.agreementTypes && offerData.agreementTypes.length > 0 && (
                    <div className="text-sm">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
                        {isRtl ? "نوع الاتفاقية" : "Agreement Type"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {offerData.agreementTypes.map((type: string) => (
                          <span key={type} className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200">
                            {AGREEMENT_LABELS[type] || type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Table */}
                  {offerData.services && offerData.services.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
                        {isRtl ? "نطاق الخدمات المقدمة" : "Scope of Services"}
                      </p>
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-y border-gray-100 bg-gray-50">
                            <th className="py-2.5 px-4 text-right font-semibold text-gray-500 text-xs">
                              {isRtl ? "الخدمة" : "Service"}
                            </th>
                            <th className="py-2.5 px-4 text-left font-semibold text-gray-500 text-xs whitespace-nowrap">
                              {isRtl ? "السعر (ريال)" : "Price (SAR)"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {offerData.services.map((svc: any, i: number) => (
                            <tr key={i} className="border-b border-gray-50">
                              <td className="py-3 px-4 text-gray-800 font-medium">{svc.description || "—"}</td>
                              <td className="py-3 px-4 font-bold text-gray-900 tabular-nums text-left">
                                {Number(svc.price).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{isRtl ? "المجموع قبل الضريبة" : "Subtotal"}</span>
                      <span className="tabular-nums">{Number(offerData.subtotal || 0).toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{isRtl ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
                      <span className="tabular-nums">{Number(offerData.vat || 0).toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mt-2">
                      <span>{isRtl ? "الإجمالي شامل الضريبة" : "Total (incl. VAT)"}</span>
                      <span className="tabular-nums">
                        {Number(offerData.total || offerData.financialAmount || 0).toLocaleString()} SAR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleResponse("accepted")}
                    disabled={isResponding}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {t("offerPage.acceptOffer") || "قبول العرض"}
                  </button>
                  <button
                    onClick={() => handleResponse("rejected")}
                    disabled={isResponding}
                    className="flex-1 bg-white hover:bg-red-50 border border-red-200 text-red-600 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {t("offerPage.declineOffer") || "رفض العرض"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
