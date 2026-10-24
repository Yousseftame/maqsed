"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, Plus, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService } from "./offers.service";
import {
  applyOfferServicePatch,
  emptyOfferService,
  normalizeOfferService,
  offerServiceTotals,
  type OfferServiceItem,
} from "./offer-services";
import { OfferServicesFields } from "./OfferServicesFields";
import toast from "react-hot-toast";
import { OfferShareModal } from "./OfferShareModal";

const AGREEMENT_OPTIONS = [
  { id: "exclusive", label: "حصري" },
  { id: "marketing", label: "تسويقي" },
  { id: "services", label: "تقديم خدمات" }
];

export function CreateOfferSection() {
  const router = useRouter();
  const { t, isRtl } = useLocale();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    otp: string;
    offerNumber: string;
    offerId: string;
    developerPhone: string;
    developerName: string;
    developerEmail: string;
    title: string;
    description: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    developerName: "",
    developerEmail: "",
    developerPhone: "",
  });

  const [agreementTypes, setAgreementTypes] = useState<string[]>([]);
  const [services, setServices] = useState<OfferServiceItem[]>([emptyOfferService()]);

  const { subtotal, vat, total } = offerServiceTotals(services);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgreementType = (id: string) => {
    setAgreementTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const addService = () => setServices((prev) => [...prev, emptyOfferService()]);

  const removeService = (index: number) => {
    setServices((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const updateService = (index: number, patch: Partial<OfferServiceItem>) => {
    setServices((prev) => prev.map((item, i) => (i === index ? applyOfferServicePatch(item, patch) : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agreementTypes.length === 0) {
      toast.error(isRtl ? "الرجاء اختيار نوع اتفاقية واحد على الأقل." : "Please select at least one agreement type.");
      return;
    }

    const normalizedServices = services.map(normalizeOfferService);
    if (normalizedServices.some((item) => !item.description)) {
      toast.error(isRtl ? "الرجاء كتابة كل خدمة كما ستظهر." : "Please write each service as it should appear.");
      return;
    }

    setIsSubmitting(true);

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const nextNumber = await offersService.getNextOfferNumber();
      
      const docRef = await addDoc(collection(db, "offers"), {
        ...formData,
        description: formData.description.trim(),
        offerNumber: nextNumber,
        agreementTypes,
        services: normalizedServices,
        subtotal,
        vat,
        total,
        createdAt: serverTimestamp(),
        status: "pending", 
        secretCode: otp,
      });

      // Freeze recipient details at submit time so WhatsApp always uses this offer's phone.
      setSuccessData({
        otp,
        offerNumber: nextNumber,
        offerId: docRef.id,
        developerPhone: formData.developerPhone.trim(),
        developerName: formData.developerName.trim(),
        developerEmail: formData.developerEmail.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(t("admin.ui.error") || "An error occurred while creating the offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "mb-2 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-14 w-full rounded-[16px] border border-[#0a0f1d]/10 bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]";
  const sectionTitleClass = "mb-6 text-xl font-black text-[#0a0f1d] flex items-center gap-2 before:content-[''] before:block before:h-6 before:w-1.5 before:bg-[#0a0f1d] before:rounded-full";
  const formSectionClass = "mb-8 rounded-[24px] border border-[#0a0f1d]/5 bg-white p-6 sm:p-8 shadow-sm";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0a0f1d] mb-3">
          {t("admin.offers.create") || "Create Technical & Financial Offer"}
        </h1>
        <p className="text-[#8c8c8c] font-medium text-lg">
          {isRtl ? "قم بتعبئة النموذج لإصدار عرض فني برقم تسلسلي تلقائي." : "Fill out the form to generate a technical offer with an auto-sequential number."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* Basic Information */}
        <div className={formSectionClass}>
          <h3 className={sectionTitleClass}>{isRtl ? "البيانات الأساسية" : "Basic Information"}</h3>
          
          <div className="mb-5">
            <label className={labelClass}>{isRtl ? "العنوان" : "Title"}</label>
            <input
              required
              type="text"
              name="title"
              dir="auto"
              value={formData.title}
              onChange={handleChange}
              placeholder={isRtl ? "عنوان العرض (مثال: عرض إدارة الأملاك)" : "Offer Title"}
              className={inputClass}
            />
          </div>

          <div className="mb-5">
            <label className={labelClass}>{isRtl ? "وصف العرض" : "Description"}</label>
            <textarea
              name="description"
              dir="auto"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={isRtl ? "أضف وصفاً للعرض (اختياري)..." : "Add an offer description (optional)..."}
              className="w-full resize-none rounded-[16px] border border-[#0a0f1d]/10 bg-[#F4F4F4] px-5 py-4 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]"
            />
          </div>

          <div className="mb-5">
            <label className={labelClass}>{isRtl ? "اسم المطور" : "Developer Name"}</label>
            <input
              required
              type="text"
              name="developerName"
              dir="auto"
              value={formData.developerName}
              onChange={handleChange}
              placeholder={isRtl ? "اسم المطور" : "Developer Name"}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 mb-5">
            <div>
              <label className={labelClass}>{isRtl ? "البريد الإلكتروني" : "Email Address"}</label>
              <input
                required
                type="email"
                name="developerEmail"
                dir="ltr"
                value={formData.developerEmail}
                onChange={handleChange}
                placeholder="example@domain.com"
                className={`${inputClass} text-start`}
              />
            </div>
            <div>
              <label className={labelClass}>{isRtl ? "الجوال" : "Phone Number"}</label>
              <input
                required
                type="tel"
                name="developerPhone"
                dir="ltr"
                value={formData.developerPhone}
                onChange={handleChange}
                placeholder="+966 5X XXX XXXX"
                className={`${inputClass} text-start`}
              />
            </div>
          </div>
        </div>

        {/* Agreement Types */}
        <div className={formSectionClass}>
          <h3 className={sectionTitleClass}>{isRtl ? "نوع الاتفاقية" : "Agreement Type"}</h3>
          <p className="text-sm font-medium text-[#8c8c8c] mb-4">
            {isRtl ? "(يمكنك اختيار أكثر من نوع)" : "(You can select multiple options)"}
          </p>
          <div className="flex flex-wrap gap-3">
            {AGREEMENT_OPTIONS.map((opt) => {
              const isSelected = agreementTypes.includes(opt.id);
              return (
                <label 
                  key={opt.id} 
                  className={`flex cursor-pointer items-center gap-3 rounded-[16px] px-6 py-4 transition-all border ${
                    isSelected 
                      ? "bg-[#0a0f1d] border-[#0a0f1d]" 
                      : "bg-[#F4F4F4] border-transparent hover:bg-[#EAEAEA]"
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => toggleAgreementType(opt.id)}
                    className="h-5 w-5 accent-white rounded shrink-0 hidden" 
                  />
                  <div className={`flex h-5 w-5 items-center justify-center rounded-[6px] border shrink-0 transition-colors ${
                    isSelected ? "bg-white border-white" : "bg-white border-[#0a0f1d]/20"
                  }`}>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#0a0f1d]" />}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-[#0a0f1d]"}`}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Services & Financials */}
        <div className={formSectionClass}>
          <h3 className={sectionTitleClass}>{isRtl ? "نطاق الخدمات والتسعير" : "Scope of Services & Pricing"}</h3>
          <p className="mb-5 text-sm font-medium text-[#8c8c8c]">
            {isRtl
              ? "اكتب الخدمة كما ستظهر. يمكن أن تكون بمبلغ يُحتسب في الإجمالي، أو بنسبة لا تُضاف للإجمالي، أو بدون تكلفة."
              : "Write each service as it should appear. It can be an amount that counts toward the total, a percentage that is not billed, or no cost."}
          </p>

          <div className="mb-6">
            <OfferServicesFields
              services={services}
              isRtl={isRtl}
              onUpdate={updateService}
              onRemove={removeService}
              onAdd={addService}
            />
          </div>

          <button
            type="button"
            onClick={addService}
            className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-[#F4F4F4] px-6 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA] border border-[#0a0f1d]/5"
          >
            <Plus className="w-4 h-4" />
            {isRtl ? "إضافة خدمة جديدة" : "Add New Service"}
          </button>

          <hr className="my-8 border-[#0a0f1d]/10" />

          {/* Financial Summary */}
          <div className="bg-[#0a0f1d] rounded-[24px] p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex justify-between items-center text-white/70 font-medium">
              <span>{isRtl ? "المجموع (قبل الضريبة)" : "Subtotal"}</span>
              <span className="font-mono text-lg text-white">{subtotal.toLocaleString()} SAR</span>
            </div>
            <div className="flex justify-between items-center text-white/70 font-medium border-b border-white/10 pb-4">
              <span>{isRtl ? "القيمة المضافة (15%)" : "VAT (15%)"}</span>
              <span className="font-mono text-lg text-white">{vat.toLocaleString()} SAR</span>
            </div>
            <div className="flex justify-between items-center text-white font-black text-2xl pt-2">
              <span>{isRtl ? "الإجمالي مع الضريبة" : "Total (incl. VAT)"}</span>
              <span className="font-mono">{total.toLocaleString()} SAR</span>
            </div>
            <p className="text-xs font-medium text-white/45 pt-1">
              {isRtl
                ? "النسب والخدمات بدون تكلفة تظهر في النطاق ولا تُضاف إلى الإجمالي أو الضريبة."
                : "Percent and no-cost services appear in the scope and are not added to the total or VAT."}
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-12">
          <button
            type="button"
            onClick={() => router.push("/admin/offers")}
            className="flex h-14 items-center justify-center rounded-[16px] bg-[#F4F4F4] px-8 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA]"
          >
            {t("admin.cancel") || "Cancel"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-14 items-center justify-center gap-2 rounded-[16px] bg-[#0a0f1d] px-10 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                {isRtl ? "إصدار العرض الفني" : "Create Technical Offer"}
                <Send className={`w-4 h-4 ${isRtl ? "scale-x-[-1]" : ""} -mt-0.5`} />
              </>
            )}
          </button>
        </div>
      </form>

      <OfferShareModal
        key={successData?.offerId || "offer-share"}
        created
        offer={
          successData
            ? {
                id: successData.offerId,
                offerNumber: successData.offerNumber,
                title: successData.title,
                description: successData.description,
                developerName: successData.developerName,
                developerEmail: successData.developerEmail,
                developerPhone: successData.developerPhone,
                agreementTypes,
                services: services.map(normalizeOfferService),
                subtotal,
                vat,
                total,
                secretCode: successData.otp,
                status: "pending",
                createdAt: new Date(),
              }
            : null
        }
        onClose={() => router.push("/admin/offers")}
      />
    </div>
  );
}
