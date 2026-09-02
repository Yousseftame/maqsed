"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reset]);

  const onSubmit = async (data: ChangePasswordForm) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error(t("admin.ui.error") || "User not found or email missing");
      return;
    }

    setIsSubmitting(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);
      
      toast.success(t("admin.ui.success") || "Password changed successfully!");
      onClose();
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        toast.error(t("admin.ui.incorrectCurrentPassword") || "Current password is incorrect");
      } else {
        toast.error(error.message || t("admin.ui.error") || "Failed to change password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "mb-2.5 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:bg-[#EAEAEA] placeholder:text-[#8c8c8c] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed";

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
            className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d]">
                {t("admin.ui.changePassword") || "Change Password"}
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 sm:px-8">
              <form id="change-password-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                
                <div>
                  <label className={labelClass}>
                    {t("admin.ui.currentPassword") || "Current Password"}
                  </label>
                  <div className="relative" dir="ltr">
                    <input 
                      type={showCurrent ? "text" : "password"}
                      {...register("currentPassword")} 
                      className={`${inputClass} text-left pr-12 ${errors.currentPassword ? 'border border-red-500/50' : ''}`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d] transition-colors"
                    >
                      {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="text-xs text-red-500 mt-1 block text-right">{errors.currentPassword.message}</span>}
                </div>

                <div>
                  <label className={labelClass}>
                    {t("admin.ui.newPassword") || "New Password"}
                  </label>
                  <div className="relative" dir="ltr">
                    <input 
                      type={showNew ? "text" : "password"}
                      {...register("newPassword")} 
                      className={`${inputClass} text-left pr-12 ${errors.newPassword ? 'border border-red-500/50' : ''}`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d] transition-colors"
                    >
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && <span className="text-xs text-red-500 mt-1 block text-right">{errors.newPassword.message}</span>}
                </div>

                <div>
                  <label className={labelClass}>
                    {t("admin.ui.confirmNewPassword") || "Confirm New Password"}
                  </label>
                  <div className="relative" dir="ltr">
                    <input 
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword")} 
                      className={`${inputClass} text-left pr-12 ${errors.confirmPassword ? 'border border-red-500/50' : ''}`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block text-right">{errors.confirmPassword.message}</span>}
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 bg-[#FAF9F6] px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-[#0a0f1d] hover:bg-[#F4F4F4]"
              >
                {t("admin.cancel") || "إلغاء"}
              </button>
              <button
                form="change-password-form"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("admin.ui.save") || "حفظ التغييرات"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
