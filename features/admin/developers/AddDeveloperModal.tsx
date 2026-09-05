"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { usersService } from "@/features/auth/users.service";

type AddDeveloperModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddDeveloperModal({ isOpen, onClose }: AddDeveloperModalProps) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic schema for i18n messages
  const createDeveloperSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().refine((val) => !val || /^\+?[0-9\s]+$/.test(val), {
      message: "Phone number can only contain numbers",
    }).optional(),
    company: z.string().optional(),
    usersPerDeveloper: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  type CreateDeveloperForm = z.infer<typeof createDeveloperSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDeveloperForm>({
    resolver: zodResolver(createDeveloperSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      usersPerDeveloper: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      reset();
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateDeveloperForm) => {
    setIsSubmitting(true);
    try {
      const functions = getFunctions(getApp());
      const createDeveloperAccount = httpsCallable(functions, "createDeveloperAccount");
      
      const result = await createDeveloperAccount({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        password: data.password,
        usersPerDeveloper: Number(data.usersPerDeveloper) || 0,
      });
      
      if ((result.data as any).success) {
        const uid = (result.data as any).uid;
        if (uid) {
          await usersService.updateUserData(uid, {
            usersPerDeveloper: Number(data.usersPerDeveloper) || 0,
          });
        }
        queryClient.invalidateQueries({ queryKey: ["developers"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(t("admin.developers.createForm.success") || "Developer account created successfully!");
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to create developer:", error);
      toast.error(error.message || "Failed to create developer account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSectionClass = "mb-8";
  const sectionTitleClass = "mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]";
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
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                {t("admin.developers.createForm.title") || "Create Developer Account"}
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
              <form id="add-developer-form" onSubmit={handleSubmit(onSubmit)}>
                
                {/* Personal Information */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>
                    {t("admin.developers.createForm.personalInfo") || "Personal Information"}
                  </h3>
                  
                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.firstName") || "First Name"}
                      </label>
                      <input 
                        {...register("firstName")} 
                        className={`${inputClass} ${errors.firstName ? 'border border-red-500/50' : ''}`}
                      />
                      {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.lastName") || "Last Name"}
                      </label>
                      <input 
                        {...register("lastName")} 
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.email") || "Email Address"}
                      </label>
                      <input 
                        {...register("email")} 
                        dir="ltr"
                        className={`${inputClass} text-left ${errors.email ? 'border border-red-500/50' : ''}`} 
                      />
                      {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.phone") || "Phone Number"}
                      </label>
                      <input 
                        {...register("phone")} 
                        dir="ltr"
                        className={`${inputClass} text-left`} 
                      />
                    </div>
                  </div>

                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.company") || "Company Name (Optional)"}
                      </label>
                      <input 
                        {...register("company")} 
                        className={inputClass} 
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.usersPerDeveloper") || "عدد المستخدمين لكل مطور"}
                      </label>
                      <input 
                        type="number"
                        min="0"
                        {...register("usersPerDeveloper")} 
                        className={inputClass} 
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* Account & Security */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>
                    {t("admin.developers.createForm.accountInfo") || "Account & Security"}
                  </h3>
                  
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.password") || "Password"}
                      </label>
                      <div className="relative" dir="ltr">
                        <input 
                          type={showPassword ? "text" : "password"}
                          {...register("password")} 
                          className={`${inputClass} text-left pr-12 ${errors.password ? 'border border-red-500/50' : ''}`} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d] transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
                    </div>

                    <div>
                      <label className={labelClass}>
                        {t("admin.developers.createForm.confirmPassword") || "Confirm Password"}
                      </label>
                      <div className="relative" dir="ltr">
                        <input 
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")} 
                          className={`${inputClass} text-left pr-12 ${errors.confirmPassword ? 'border border-red-500/50' : ''}`} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword.message}</span>}
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F4F4] px-6 text-sm font-bold text-[#0a0f1d] hover:bg-[#EAEAEA]"
              >
                {t("admin.cancel") || "إلغاء"}
              </button>
              <button
                form="add-developer-form"
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("admin.developers.createForm.submit") || "Create Account"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
