"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, Plus, Trash2, Save } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQueryClient } from "@tanstack/react-query";
import { offersService, type OfferData } from "./offers.service";
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
    developerName: "",
    projectName: "",
    developerEmail: "",
    developerPhone: "",
  });
  const [agreementTypes, setAgreementTypes] = useState<string[]>([]);
  const [services, setServices] = useState([{ description: "", price: 0 }]);

  // Populate form when offer changes
  useEffect(() => {
    if (!offer) return;
    setFormData({
      title: offer.title || "",
      developerName: offer.developerName || "",
      projectName: offer.projectName || "",
      developerEmail: offer.developerEmail || "",
      developerPhone: offer.developerPhone || "",
    });
    setAgreementTypes(offer.agreementTypes || []);
    setServices(
      offer.services && offer.services.length > 0
        ? offer.services.map((s) => ({ description: s.description, price: Number(s.price) || 0 }))
        : [{ description: "", price: 0 }]
    );
  }, [offer]);

  const subtotal = services.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAgreementType = (id: string) => {
    setAgreementTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const addService = () => setServices([...services, { description: "", price: 0 }]);

  const removeService = (index: number) => {
    if (services.length > 1) setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: "description" | "price", value: string | number) => {
    const updated = [...services];
    if (field === "price") updated[index].price = Number(value) || 0;
    else updated[index].description = value as string;
    setServices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    if (agreementTypes.length === 0) {
      toast.error(isRtl ? "الرجاء اختيار نوع اتفاقية واحد على الأقل." : "Please select at least one agreement type.");
      return;
    }

    setIsSubmitting(true);
    try {
      await offersService.updateOffer(offer.id, {
        ...formData,
        agreementTypes,
        services,
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
                    <div>
                      <label className={labelClass}>{isRtl ? "عنوان العرض" : "Offer Title"}</label>
                      <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder={isRtl ? "عنوان العرض..." : "Offer title..."} />
                    </div>
                    <div>
                      <label className={labelClass}>{isRtl ? "اسم المشروع" : "Project Name"}</label>
                      <input name="projectName" value={formData.projectName} onChange={handleChange} required className={inputClass} placeholder={isRtl ? "اسم المشروع..." : "Project name..."} />
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
                      {isRtl ? "الخدمات والأسعار" : "Services & Prices"}
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
                  {/* Column headers */}
                  <div className="grid gap-2 px-1" style={{ gridTemplateColumns: "1fr 120px 40px" }}>
                    <span className="text-xs font-bold text-[#8c8c8c]">{isRtl ? "وصف الخدمة" : "Service"}</span>
                    <span className="text-xs font-bold text-[#8c8c8c] text-center">{isRtl ? "السعر (ريال)" : "Price (SAR)"}</span>
                    <span />
                  </div>
                  <div className="space-y-2">
                    {services.map((svc, i) => (
                      <div key={i} className="grid gap-2 items-center" style={{ gridTemplateColumns: "1fr 120px 40px" }}>
                        <input
                          value={svc.description}
                          onChange={(e) => updateService(i, "description", e.target.value)}
                          placeholder={isRtl ? "وصف الخدمة..." : "Service description..."}
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={svc.price || ""}
                          onChange={(e) => updateService(i, "price", e.target.value)}
                          placeholder="0"
                          className={`${inputClass} text-center`}
                          dir="ltr"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => removeService(i)}
                          disabled={services.length === 1}
                          className="flex h-10 w-10 items-center justify-center rounded-[10px] text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

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
