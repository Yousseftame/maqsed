"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";

type EditDeveloperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  developer: UserData | null;
};

export function EditDeveloperModal({ isOpen, onClose, developer }: EditDeveloperModalProps) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editDeveloperSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    phone: z.string().refine((val) => !val || /^\+?[0-9\s]+$/.test(val), {
      message: "Phone number can only contain numbers",
    }).optional(),
    company: z.string().optional(),
  });

  type EditDeveloperForm = z.infer<typeof editDeveloperSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditDeveloperForm>({
    resolver: zodResolver(editDeveloperSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      company: "",
    },
  });

  useEffect(() => {
    if (isOpen && developer) {
      document.body.style.overflow = "hidden";
      reset({
        firstName: developer.displayName || "",
        lastName: developer.lastName || "",
        phone: developer.phoneNumber || "",
        company: developer.companyName || "",
      });
    } else {
      document.body.style.overflow = "unset";
      reset();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, developer, reset]);

  const onSubmit = async (data: EditDeveloperForm) => {
    if (!developer) return;
    
    setIsSubmitting(true);
    const toastId = toast.loading(t("admin.ui.save") || "Saving...");
    try {
      await usersService.updateUserData(developer.uid, {
        displayName: data.firstName,
        lastName: data.lastName || "",
        phoneNumber: data.phone || "",
        companyName: data.company || "",
      });
      
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      toast.success(t("admin.ui.success") || "Profile updated successfully!", { id: toastId });
      onClose();
    } catch (error: any) {
      console.error("Failed to update developer:", error);
      toast.error(error.message || t("admin.ui.error") || "Failed to update profile", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSectionClass = "mb-8";
  const labelClass = "mb-2.5 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:bg-[#EAEAEA] placeholder:text-[#8c8c8c] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (!developer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                {t("admin.developers.edit") || "Edit Developer"}
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              <form id="edit-developer-form" onSubmit={handleSubmit(onSubmit)}>
                
                {/* Personal Information */}
                <div className={formSectionClass}>
                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.firstName") || "First Name"}
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        {...register("firstName")}
                        className={inputClass}
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-xs font-semibold text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.lastName") || "Last Name"}
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        {...register("lastName")}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.phone") || "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        disabled={isSubmitting}
                        {...register("phone")}
                        className={inputClass}
                        dir="ltr"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-xs font-semibold text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.company") || "Company Name"}
                      </label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        {...register("company")}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex h-12 items-center justify-center rounded-[16px] bg-[#F4F4F4] px-6 text-sm font-semibold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA] disabled:opacity-50"
              >
                {t("admin.cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                form="edit-developer-form"
                disabled={isSubmitting}
                className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-[16px] bg-[#0a0f1d] px-8 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  t("admin.ui.save") || "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
