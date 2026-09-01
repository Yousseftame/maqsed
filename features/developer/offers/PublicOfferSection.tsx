"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Lock, CheckCircle, XCircle, FileSignature, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PublicOfferSectionProps {
  offerId: string;
}

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

      // If valid, show the offer data
      setOfferData({
        id: offerSnap.id,
        ...data,
      });

      // Mark as viewed
      if (data.status === "pending") {
        await updateDoc(offerRef, {
          status: "viewed",
          viewedAt: serverTimestamp(),
        });
      } else if (!data.viewedAt) {
        await updateDoc(offerRef, {
          viewedAt: serverTimestamp(),
        });
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
      await updateDoc(offerRef, {
        status: status,
        respondedAt: serverTimestamp(),
      });
      setResponseStatus(status);
    } catch (err) {
      console.error("Error updating response:", err);
      alert(t("offerPage.failedSubmit") || "Failed to submit your response. Please try again.");
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4 sm:p-6 lg:p-8" dir={isRtl ? "rtl" : "ltr"}>
      <AnimatePresence mode="wait">
        {!offerData ? (
          /* ---------------- OTP Verification Step ---------------- */
          <motion.div
            key="verification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-white border border-[#E5E5E5] shadow-sm rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-[#0a0f1d] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Lock className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0a0f1d] mb-2">{t("offerPage.secureAccess") || "Secure Offer Access"}</h2>
              <p className="text-[#8c8c8c] text-sm">
                {t("offerPage.enterCode") || "Please enter the 6-digit secure code sent to you via Email or WhatsApp."}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div>
                <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={otpValues[index]}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const newOtp = [...otpValues];
                        newOtp[index] = val;
                        setOtpValues(newOtp);
                        
                        if (val && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
                          const prev = document.getElementById(`otp-${index - 1}`);
                          prev?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").substring(0, 6);
                        if (pasted) {
                          const newOtp = [...otpValues];
                          for (let i = 0; i < 6; i++) {
                            newOtp[i] = pasted[i] || "";
                          }
                          setOtpValues(newOtp);
                          document.getElementById(`otp-${Math.min(5, pasted.length)}`)?.focus();
                        }
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-[#F4F4F4] border border-[#E5E5E5] rounded-xl text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-2 focus:ring-[#0a0f1d] focus:border-transparent transition-all shadow-sm"
                    />
                  ))}
                </div>
                {error && <p className="text-red-600 text-sm mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-[#0a0f1d] hover:bg-[#0a0f1d]/90 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? <Loader2 className="animate-spin" /> : (t("offerPage.verifyBtn") || "Verify & View Offer")}
              </button>
            </form>
          </motion.div>
        ) : (
          /* ---------------- Offer Details Step ---------------- */
          <motion.div
            key="offer-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl bg-white border border-[#E5E5E5] shadow-sm rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            {responseStatus || (offerData.status === "accepted" || offerData.status === "rejected") ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                {(responseStatus || offerData.status) === "accepted" ? (
                  <>
                    <div className="mx-auto w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0a0f1d] mb-4">{t("offerPage.offerAccepted") || "Offer Accepted!"}</h2>
                    <p className="text-[#8c8c8c] text-lg max-w-md mx-auto">
                      {t("offerPage.offerAcceptedDesc") || "Thank you. We are preparing the official contract for this project."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                      <XCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0a0f1d] mb-4">{t("offerPage.offerDeclined") || "Offer Declined"}</h2>
                    <p className="text-[#8c8c8c] text-lg max-w-md mx-auto">
                      {t("offerPage.offerDeclinedDesc") || "We have notified the administration. Thank you for your time."}
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E5] pb-6 mb-8 gap-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#0a0f1d]">
                      {offerData.title}
                    </h1>
                    <p className="text-[#8c8c8c] mt-2 font-medium">{t("offerPage.project") || "Project:"} <span className="text-[#0a0f1d]">{offerData.projectName}</span></p>
                  </div>
                  <div className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-2xl px-8 py-5 text-center min-w-[200px]">
                    <p className="text-[#8c8c8c] text-sm font-semibold uppercase tracking-wider mb-1">{t("offerPage.financialAmount") || "Financial Amount"}</p>
                    <p className="text-3xl font-bold text-[#0a0f1d] tabular-nums" dir="ltr">${Number(offerData.financialAmount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xl font-semibold text-[#0a0f1d] mb-4 flex items-center gap-2">
                    <FileSignature className="text-[#0a0f1d] w-6 h-6" />
                    {t("offerPage.techScope") || "Technical Scope & Requirements"}
                  </h3>
                  <div className="bg-[#F4F4F4] rounded-2xl p-8 border border-[#E5E5E5]">
                    <p className="text-[#4b5563] whitespace-pre-wrap leading-relaxed text-[15px]">
                      {offerData.technicalDetails}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#E5E5E5]">
                  <button
                    onClick={() => handleResponse("accepted")}
                    disabled={isResponding}
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-4 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    {t("offerPage.acceptOffer") || "Accept Offer"}
                  </button>
                  <button
                    onClick={() => handleResponse("rejected")}
                    disabled={isResponding}
                    className="flex-1 bg-white hover:bg-red-50 border-2 border-red-200 text-red-600 hover:text-red-700 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
                  >
                    {t("offerPage.declineOffer") || "Decline Offer"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
