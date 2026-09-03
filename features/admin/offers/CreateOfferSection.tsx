"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Send, Loader2, CheckCircle2, Plus, Trash2, Mail, Copy, Download } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService } from "./offers.service";
import { AnimatePresence, motion } from "motion/react";
import toast from "react-hot-toast";
import { downloadOfferPDF } from "./offer-pdf";

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
  const [successData, setSuccessData] = useState<{ otp: string; offerNumber: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    developerName: "",
    projectName: "",
    developerEmail: "",
    developerPhone: "",
  });

  const [agreementTypes, setAgreementTypes] = useState<string[]>([]);
  const [services, setServices] = useState([{ description: "", price: 0 }]);

  const subtotal = services.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgreementType = (id: string) => {
    setAgreementTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const addService = () => setServices([...services, { description: "", price: 0 }]);
  
  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: "description" | "price", value: string | number) => {
    const newServices = [...services];
    if (field === "price") {
      newServices[index].price = Number(value) || 0;
    } else {
      newServices[index].description = value as string;
    }
    setServices(newServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agreementTypes.length === 0) {
      toast.error(isRtl ? "الرجاء اختيار نوع اتفاقية واحد على الأقل." : "Please select at least one agreement type.");
      return;
    }

    setIsSubmitting(true);

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const nextNumber = await offersService.getNextOfferNumber();
      
      await addDoc(collection(db, "offers"), {
        ...formData,
        offerNumber: nextNumber,
        agreementTypes,
        services,
        subtotal,
        vat,
        total,
        createdAt: serverTimestamp(),
        status: "pending", 
        secretCode: otp,
      });

      setSuccessData({ otp, offerNumber: nextNumber });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error(t("admin.ui.error") || "An error occurred while creating the offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (successData?.otp) {
      navigator.clipboard.writeText(successData.otp);
      toast.success(isRtl ? "تم النسخ بنجاح!" : "Copied successfully!");
    }
  };

  const labelClass = "mb-2 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-14 w-full rounded-[16px] border border-[#0a0f1d]/10 bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]";
  const sectionTitleClass = "mb-6 text-xl font-black text-[#0a0f1d] flex items-center gap-2 before:content-[''] before:block before:h-6 before:w-1.5 before:bg-[#0a0f1d] before:rounded-full";
  const formSectionClass = "mb-8 rounded-[24px] border border-[#0a0f1d]/5 bg-white p-6 sm:p-8 shadow-sm";

  const whatsappMessage = successData ? encodeURIComponent(
    `مرحباً ${formData.developerName}،\n\nنرفق لكم العرض الفني/المالي رقم ${successData.offerNumber} لمشروع ${formData.projectName}.\n\nقيمة العرض الإجمالية (شامل الضريبة): ${total.toLocaleString()} ريال.\n\nرمز الوصول الآمن الخاص بك هو: ${successData.otp}\n\nنسعد بخدمتكم.`
  ) : "";
  const whatsappUrl = `https://wa.me/${formData.developerPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;
  
  const emailSubject = successData ? encodeURIComponent(`عرض فني ومالي - ${formData.projectName} (${successData.offerNumber})`) : "";
  const emailBody = successData ? encodeURIComponent(
    `مرحباً ${formData.developerName}،\n\nنرفق لكم العرض الفني/المالي رقم ${successData.offerNumber} لمشروع ${formData.projectName}.\n\nقيمة العرض الإجمالية (شامل الضريبة): ${total.toLocaleString()} ريال.\n\nرمز الوصول الآمن الخاص بك هو: ${successData.otp}\n\nنسعد بخدمتكم.`
  ) : "";
  const emailUrl = `mailto:${formData.developerEmail}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0a0f1d] mb-3">
          {t("admin.offers.create") || "Create Technical & Financial Offer"}
        </h1>
        <p className="text-[#8c8c8c] font-medium text-lg">
          {isRtl ? "قم بتعبئة النموذج لإصدار عرض فني ومالي برقم تسلسلي تلقائي." : "Fill out the form to generate a technical & financial offer with an auto-sequential number."}
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

          <div className="grid gap-5 sm:grid-cols-2 mb-5">
            <div>
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
            <div>
              <label className={labelClass}>{isRtl ? "المشروع" : "Project Name"}</label>
              <input
                required
                type="text"
                name="projectName"
                dir="auto"
                value={formData.projectName}
                onChange={handleChange}
                placeholder={isRtl ? "اسم المشروع" : "Project Name"}
                className={inputClass}
              />
            </div>
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
          
          <div className="space-y-4 mb-6">
            {services.map((service, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start bg-[#F4F4F4] p-4 rounded-[16px] border border-[#0a0f1d]/5">
                <div className="flex-1 w-full">
                  <label className="mb-1 block text-xs font-bold text-[#8c8c8c]">{isRtl ? "وصف الخدمة" : "Description"}</label>
                  <input
                    required
                    type="text"
                    value={service.description}
                    onChange={(e) => updateService(idx, "description", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addService();
                      }
                    }}
                    placeholder={isRtl ? "مثال: تسويق حصري لمدة شهرين..." : "Service description"}
                    className="h-12 w-full rounded-[12px] border border-[#0a0f1d]/10 bg-white px-4 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d]"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="mb-1 block text-xs font-bold text-[#8c8c8c]">{isRtl ? "السعر (ريال)" : "Price (SAR)"}</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={service.price || ""}
                    onChange={(e) => updateService(idx, "price", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addService();
                      }
                    }}
                    placeholder="0"
                    className="h-12 w-full rounded-[12px] border border-[#0a0f1d]/10 bg-white px-4 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d]"
                  />
                </div>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(idx)}
                    className="mt-5 p-3 text-red-500 bg-white hover:bg-red-50 rounded-[12px] transition-colors border border-red-100 shrink-0 self-end"
                    title={isRtl ? "إزالة" : "Remove"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
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

      {/* SUCCESS MODAL OVERLAY */}
      <AnimatePresence>
        {successData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
              onClick={() => router.push("/admin/offers")}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              className="relative w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl z-10"
            >
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E5E5]">
                 <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                   <CheckCircle2 className="w-6 h-6 text-green-500" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-[#1c1e21] mb-1">
                     {isRtl ? "تم إصدار العرض بنجاح" : "Offer Created Successfully"}
                   </h3>
                   <p className="text-sm font-medium text-[#65676B]">
                     {isRtl ? `رقم العرض: ${successData.offerNumber}` : `Offer Number: ${successData.offerNumber}`}
                   </p>
                 </div>
               </div>

               <div className="bg-[#F0F2F5] rounded-[12px] p-4 mb-6 flex justify-between items-center group transition-colors hover:bg-[#E4E6E9]">
                 <div>
                   <p className="text-xs text-[#65676B] font-bold">
                     {isRtl ? "رمز الوصول الآمن (OTP)" : "Secure Access Code (OTP)"}
                   </p>
                   <span className="text-2xl font-mono tracking-widest font-bold text-[#1c1e21]">
                     {successData.otp}
                   </span>
                 </div>
                 <button 
                   onClick={handleCopyCode}
                   title={isRtl ? "نسخ" : "Copy"}
                   className="h-10 w-10 flex items-center justify-center rounded-[8px] bg-white border border-[#E5E5E5] text-[#1c1e21] hover:bg-gray-50 transition-colors shadow-sm shrink-0"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
               </div>

               <div className="flex gap-3 mb-6">
                 <a
                   href={whatsappUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white h-10 rounded-[8px] text-sm font-bold hover:bg-[#1ebd58] transition-colors"
                 >
                   <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                   </svg>
                   {isRtl ? "واتساب" : "WhatsApp"}
                 </a>
                 <a
                   href={emailUrl}
                   className="flex-1 flex items-center justify-center gap-2 bg-[#F0F2F5] text-[#1c1e21] h-10 rounded-[8px] text-sm font-bold hover:bg-[#E4E6E9] transition-colors"
                 >
                   <img src="/google_mail_gmail_logo_icon_159346.webp" alt="Email" className="w-5 h-5 object-contain" />
                   {isRtl ? "ايميل" : "Email"}
                 </a>
               </div>

               <button
                  onClick={() => downloadOfferPDF({
                    id: "",
                    offerNumber: successData.offerNumber,
                    title: formData.title,
                    projectName: formData.projectName,
                    developerName: formData.developerName,
                    developerEmail: formData.developerEmail,
                    developerPhone: formData.developerPhone,
                    agreementTypes,
                    services,
                    subtotal,
                    vat,
                    total,
                    secretCode: successData.otp,
                    status: "pending",
                    createdAt: new Date(),
                  })}
                  className="w-full flex items-center justify-center gap-2 bg-[#F0F2F5] text-[#1c1e21] h-10 rounded-[8px] text-sm font-bold hover:bg-[#E4E6E9] transition-colors mb-4"
                >
                  <Download className="w-4 h-4" />
                  {isRtl ? "تحميل العرض PDF" : "Download PDF"}
                </button>

                <button
                  onClick={() => router.push("/admin/offers")}
                  className="w-full text-center text-[#65676B] text-sm font-semibold hover:text-[#1c1e21] transition-colors"
                >
                  {t("admin.offers.backToOffers") || "Back to Offers"}
                </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
