"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function CreateOfferSection() {
  const router = useRouter();
  const { t, isRtl } = useLocale();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    projectName: "",
    technicalDetails: "",
    financialAmount: "",
    developerName: "",
    developerEmail: "",
    developerPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      await addDoc(collection(db, "offers"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "pending", 
        secretCode: otp,
      });

      setGeneratedOtp(otp);
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      
      // Simulating Email/WhatsApp
      console.log(`
      ====================================================================
      🔔 [SIMULATED EMAIL/WHATSAPP]
      To: ${formData.developerEmail} / ${formData.developerPhone}
      Message: 
      Hello ${formData.developerName},
      You have received a new Technical/Financial Offer!
      Your secure One-Time Password (OTP) to access the offer is: [ ${otp} ]
      ====================================================================
      `);

    } catch (error) {
      console.error("Error creating offer:", error);
      alert(t("admin.ui.error") || "An error occurred while creating the offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-[#E5E5E5] p-12 text-center shadow-sm">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h3 className="text-3xl font-bold text-[#0a0f1d] mb-4">
          {t("admin.ui.success") || "Offer Created Successfully!"}
        </h3>
        <p className="text-gray-500 mb-8 max-w-md">
          {t("admin.offers.shareCode") || "Please share this secure code with the developer via WhatsApp or Email:"}
        </p>
        
        <div className="bg-[#F4F4F4] rounded-2xl p-8 mb-8 border border-[#E5E5E5]">
          <span className="text-5xl font-mono tracking-[0.3em] font-bold text-[#0a0f1d]">
            {generatedOtp}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 mb-8 max-w-sm">
          {t("admin.offers.simulated") || "(The system has simulated sending this via Email/WhatsApp)"}
        </p>

        <button
          onClick={() => router.push("/admin/offers")}
          className="bg-[#0a0f1d] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0a0f1d]/90 transition-colors"
        >
          {t("admin.offers.backToOffers") || "Back to Offers"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 md:p-12 shadow-sm">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0a0f1d] mb-2">
          {t("admin.offers.create") || "Create Technical & Financial Offer"}
        </h1>
        <p className="text-[#8c8c8c]">
          {t("admin.offers.techDescPlaceholder") || "Fill in the details below to generate and send a secure offer to the developer."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Offer Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a0f1d] border-b border-[#E5E5E5] pb-2">
              {t("admin.offers.offerDetails") || "Offer Details"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.offers.title") || "Offer Title"}</label>
              <input
                required
                type="text"
                name="title"
                dir="auto"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Website Revamp 2026"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.offers.project") || "Project Name"}</label>
              <input
                required
                type="text"
                name="projectName"
                dir="auto"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. ActiveLink Redesign"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.offers.amount") || "Financial Amount ($)"}</label>
              <input
                required
                type="number"
                name="financialAmount"
                dir="ltr"
                value={formData.financialAmount}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>
          </div>

          {/* Developer Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#0a0f1d] border-b border-[#E5E5E5] pb-2">
              {t("admin.offers.developerDetails") || "Developer Details"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.developers.name") || "Developer Name"}</label>
              <input
                required
                type="text"
                name="developerName"
                dir="auto"
                value={formData.developerName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.offers.email") || "Email Address"}</label>
              <input
                required
                type="email"
                name="developerEmail"
                dir="ltr"
                value={formData.developerEmail}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.developers.phone") || "WhatsApp Phone"}</label>
              <input
                required
                type="tel"
                name="developerPhone"
                dir="ltr"
                value={formData.developerPhone}
                onChange={handleChange}
                placeholder="e.g. +1234567890"
                className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium text-[#0a0f1d]">{t("admin.offers.techScope") || "Technical Details & Scope"}</label>
          <textarea
            required
            name="technicalDetails"
            dir="auto"
            value={formData.technicalDetails}
            onChange={handleChange}
            rows={5}
            placeholder={t("admin.offers.techDescPlaceholder") || "Describe the technical requirements, scope of work, timeline..."}
            className="w-full bg-[#F4F4F4] border-transparent focus:border-[#0a0f1d] focus:bg-white rounded-xl px-4 py-3 text-[#0a0f1d] placeholder:text-[#8c8c8c] focus:outline-none focus:ring-1 focus:ring-[#0a0f1d] transition-all resize-none"
          />
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-[#E5E5E5] mt-8">
          <button
            type="button"
            onClick={() => router.push("/admin/offers")}
            className="px-6 py-3 rounded-full font-semibold text-[#0a0f1d] bg-[#F4F4F4] hover:bg-[#E5E5E5] transition-colors"
          >
            {t("admin.cancel") || "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#0a0f1d] hover:bg-[#0a0f1d]/90 text-white px-8 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                {t("admin.ui.save") || "Saving..."}
              </>
            ) : (
              <>
                {t("admin.ui.save") || "Create & Send"}
                <Send className={`w-4 h-4 ${isRtl ? "scale-x-[-1]" : ""} -mt-0.5`} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
