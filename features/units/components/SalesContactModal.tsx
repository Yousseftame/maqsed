"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, Building, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "@/components/providers/LocaleProvider";
import { requestsService } from "@/features/admin/customers/requests.service";
import { cn } from "@/lib/utils";

type SalesContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  projectName?: string;
};

export function SalesContactModal({ isOpen, onClose, unitId, projectName }: SalesContactModalProps) {
  const { isRtl } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const salesContactSchema = z.object({
    fullName: z.string().min(2, isRtl ? "الاسم مطلوب" : "Name is required"),
    email: z.string().email(isRtl ? "بريد إلكتروني غير صالح" : "Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(8, isRtl ? "رقم الهاتف مطلوب" : "Phone number is required"),
  });

  type SalesContactForm = z.infer<typeof salesContactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SalesContactForm>({
    resolver: zodResolver(salesContactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: SalesContactForm) => {
    setIsSubmitting(true);
    try {
      await requestsService.addSalesRequest({
        fullName: data.fullName,
        email: data.email || "",
        phone: data.phone,
        unitNumber: unitId,
        projectName: projectName,
      });

      toast.success(isRtl ? "تم إرسال طلبك بنجاح!" : "Request sent successfully!");
      reset();
      onClose();
    } catch (error: any) {
      console.error("Failed to submit sales request:", error);
      toast.error(isRtl ? "حدث خطأ أثناء الإرسال" : "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#6A2B92] focus:bg-white focus:ring-4 focus:ring-[#6A2B92]/10 placeholder:text-gray-400";
  const labelClass = "mb-2 block text-sm font-bold text-gray-700";

  return (
    <AnimatePresence>
      {isOpen && (
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#6A2B92] to-[#451862] px-8 py-6">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <button
                onClick={onClose}
                className="absolute top-6 end-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative z-10">
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">
                  {isRtl ? "تواصل مع المبيعات" : "Contact Sales"}
                </h2>
                <p className="text-white/80 font-medium leading-relaxed">
                  {isRtl ? "سجل اهتمامك وسيقوم فريق المبيعات بالتواصل معك في أقرب وقت." : "Register your interest and our sales team will contact you shortly."}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar">
              
              {/* Unit Info Context */}
              <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-[#6A2B92]">
                    <Hash className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium">{isRtl ? "رقم الوحدة" : "Unit Number"}</span>
                    <span>{unitId}</span>
                  </div>
                </div>
                {projectName && (
                  <>
                    <div className="h-px w-full bg-gray-200"></div>
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-[#6A2B92]">
                        <Building className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">{isRtl ? "المشروع" : "Project"}</span>
                        <span>{projectName}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <form id="sales-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <div>
                  <label className={labelClass}>
                    {isRtl ? "الاسم الكامل" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    {...register("fullName")}
                    className={inputClass}
                    placeholder={isRtl ? "أدخل اسمك الكامل" : "Enter your full name"}
                  />
                  {errors.fullName && <p className="mt-2 text-xs font-semibold text-red-500">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    {isRtl ? "رقم الجوال" : "Phone Number"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    disabled={isSubmitting}
                    {...register("phone")}
                    className={cn(inputClass, "text-start")}
                    dir="ltr"
                    placeholder="+966 5X XXX XXXX"
                  />
                  {errors.phone && <p className="mt-2 text-xs font-semibold text-red-500">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    {isRtl ? "البريد الإلكتروني" : "Email Address"} <span className="text-gray-400 font-normal text-xs mx-1">({isRtl ? "اختياري" : "Optional"})</span>
                  </label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    {...register("email")}
                    className={cn(inputClass, "text-start")}
                    dir="ltr"
                    placeholder="example@domain.com"
                  />
                  {errors.email && <p className="mt-2 text-xs font-semibold text-red-500">{errors.email.message}</p>}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-gray-700 shadow-sm border border-gray-200 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="submit"
                form="sales-form"
                disabled={isSubmitting}
                className="flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl bg-[#6A2B92] px-8 text-sm font-bold text-white transition-all hover:bg-[#522070] active:scale-95 disabled:pointer-events-none disabled:opacity-70 shadow-md shadow-[#6A2B92]/20"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  isRtl ? "إرسال الطلب" : "Submit Request"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
