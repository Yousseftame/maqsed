"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, Plus, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService, type OfferData } from "./offers.service";
import {
  applyOfferServicePatch,
  emptyOfferService,
  normalizeOfferService,
  offerServiceTotals,
  type OfferServiceItem,
} from "./offer-services";
import { OfferServicesFields } from "./OfferServicesFields";
import toast from "react-hot-toast";

const AGREEMENT_OPTIONS = [
  { id: "exclusive", label: "حصري" },
  { id: "marketing", label: "تسويقي" },
  { id: "services", label: "تقديم خدمات" },
];

interface EditOfferModalProps {
  offer: OfferData | null;
  onClose: () => void;
}

export function EditOfferModal({ offer, onClose }: EditOfferModalProps) {
  const { isRtl } = useLocale();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    developerName: "",
    developerEmail: "",
    developerPhone: "",
  });
  const [agreementTypes, setAgreementTypes] = useState<string[]>([]);
  const [services, setServices] = useState<OfferServiceItem[]>([emptyOfferService()]);

  useEffect(() => {
    if (!offer) return;
    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      developerName: offer.developerName || "",
      developerEmail: offer.developerEmail || "",
      developerPhone: offer.developerPhone || "",
    });
    setAgreementTypes(offer.agreementTypes || []);
    setServices(
      offer.services && offer.services.length > 0
        ? offer.services.map(normalizeOfferService)
        : [emptyOfferService()]
    );
  }, [offer]);

  const { subtotal, vat, total } = offerServiceTotals(services);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgreementType = (id: string) => {
    setAgreementTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
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
    if (!offer) return;

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
      await offersService.updateOffer(offer.id, {
        ...formData,
        description: formData.description.trim(),
        agreementTypes,
        services: normalizedServices,
        subtotal,
        vat,
        total,
      });
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success(isRtl ? "تم تحديث العرض بنجاح!" : "Offer updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating offer:", err);
      toast.error(isRtl ? "حدث خطأ أثناء التحديث." : "Failed to update the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "mb-2 block text-sm font-bold text-[#0a0f1d]";
  const inputClass =
    "h-12 w-full rounded-[14px] border border-[#0a0f1d]/10 bg-[#F4F4F4] px-4 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]";

  return (
    <AnimatePresence>
      {offer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-[24px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F4] shrink-0">
              <div>
                <h2 className="text-lg font-black text-[#0a0f1d]">
                  {isRtl ? "تعديل العرض" : "Edit Offer"}
                </h2>
                <p className="text-xs text-[#8c8c8c] mt-0.5 font-medium">
                  {isRtl ? `رقم العرض: #${offer.offerNumber || "—"}` : `Offer #${offer.offerNumber || "—"}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-6">

                {/* Basic Info */}
                <div className="rounded-[18px] border border-[#0a0f1d]/5 bg-[#FAFAFA] p-5 space-y-4">
                  <h3 className="text-sm font-black text-[#0a0f1d]">
                    {isRtl ? "المعلومات الأساسية" : "Basic Information"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{isRtl ? "عنوان العرض" : "Offer Title"}</label>
                      <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder={isRtl ? "عنوان العرض..." : "Offer title..."} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{isRtl ? "وصف العرض" : "Description"}</label>
                      <textarea
                        name="description"
                        dir="auto"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={isRtl ? "أضف وصفاً للعرض (اختياري)..." : "Add an offer description (optional)..."}
                        className="w-full resize-none rounded-[14px] border border-[#0a0f1d]/10 bg-[#F4F4F4] px-4 py-3 text-sm font-bold text-[#0a0f1d] outline-none transition-colors focus:border-[#0a0f1d] focus:bg-white placeholder:font-medium placeholder:text-[#8c8c8c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="rounded-[18px] border border-[#0a0f1d]/5 bg-[#FAFAFA] p-5 space-y-4">
                  <h3 className="text-sm font-black text-[#0a0f1d]">
                    {isRtl ? "بيانات المطور" : "Developer Info"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{isRtl ? "اسم المطور" : "Developer Name"}</label>
                      <input name="developerName" value={formData.developerName} onChange={handleChange} required className={inputClass} placeholder={isRtl ? "الاسم..." : "Name..."} />
                    </div>
                    <div>
                      <label className={labelClass}>{isRtl ? "رقم الجوال" : "Phone"}</label>
                      <input name="developerPhone" value={formData.developerPhone} onChange={handleChange} className={inputClass} placeholder="+966..." dir="ltr" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{isRtl ? "البريد الإلكتروني" : "Email"}</label>
                      <input name="developerEmail" type="email" value={formData.developerEmail} onChange={handleChange} className={inputClass} placeholder="email@example.com" dir="ltr" />
                    </div>
                  </div>
                </div>

                {/* Agreement Types */}
                <div className="rounded-[18px] border border-[#0a0f1d]/5 bg-[#FAFAFA] p-5 space-y-3">
                  <h3 className="text-sm font-black text-[#0a0f1d]">
                    {isRtl ? "نوع الاتفاقية" : "Agreement Type"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {AGREEMENT_OPTIONS.map((opt) => {
                      const active = agreementTypes.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleAgreementType(opt.id)}
                          className={`h-9 rounded-full px-4 text-sm font-bold transition-all ${
                            active
                              ? "bg-[#0a0f1d] text-white"
                              : "bg-[#F4F4F4] text-[#0a0f1d] hover:bg-[#E5E5E5]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Services */}
                <div className="rounded-[18px] border border-[#0a0f1d]/5 bg-[#FAFAFA] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#0a0f1d]">
                      {isRtl ? "نطاق الخدمات والتسعير" : "Scope of Services & Pricing"}
                    </h3>
                    <button
                      type="button"
                      onClick={addService}
                      className="flex h-7 items-center gap-1 rounded-full bg-[#0a0f1d] px-3 text-xs font-bold text-white hover:opacity-80 transition-opacity"
                    >
                      <Plus className="h-3 w-3" />
                      {isRtl ? "إضافة" : "Add"}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-[#8c8c8c]">
                    {isRtl
                      ? "اكتب الخدمة كما ستظهر. المبلغ يُحتسب في الإجمالي، والنسبة وبدون تكلفة لا يُضافان."
                      : "Write each service as it should appear. Amounts count toward the total; percent and no-cost do not."}
                  </p>
                  <OfferServicesFields
                    services={services}
                    isRtl={isRtl}
                    onUpdate={updateService}
                    onRemove={removeService}
                    onAdd={addService}
                  />

                  {/* Totals */}
                  <div className="mt-4 rounded-[12px] bg-[#F4F4F4] p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#6b7280]">
                      <span>{isRtl ? "المجموع قبل الضريبة" : "Subtotal"}</span>
                      <span className="font-semibold tabular-nums">{subtotal.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between text-[#6b7280]">
                      <span>{isRtl ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
                      <span className="font-semibold tabular-nums">{vat.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between font-black text-[#0a0f1d] text-base pt-1 border-t border-[#E5E5E5]">
                      <span>{isRtl ? "الإجمالي" : "Total"}</span>
                      <span className="tabular-nums">{total.toLocaleString()} SAR</span>
                    </div>
                    <p className="pt-1 text-[11px] font-medium text-[#8c8c8c]">
                      {isRtl
                        ? "النسب والخدمات بدون تكلفة لا تُضاف إلى الإجمالي أو الضريبة."
                        : "Percent and no-cost services are not added to the total or VAT."}
                    </p>
                  </div>
                </div>

              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#F4F4F4] shrink-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-[12px] bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex h-10 items-center gap-2 rounded-[12px] bg-[#0a0f1d] px-6 text-sm font-bold text-white hover:bg-[#161c2d] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isRtl ? "حفظ التعديلات" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
