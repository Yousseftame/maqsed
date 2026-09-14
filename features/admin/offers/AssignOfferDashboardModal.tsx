"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, Eye, EyeOff, Building2, Hash, User, CheckCircle2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import { cn } from "@/lib/utils";
import { offerAmount, offersService, type OfferData } from "./offers.service";
import type { UserData } from "@/types/user";
import { toDeveloperShareAccount, DeveloperAccountSharePanel, type DeveloperShareAccount } from "@/features/admin/developers/DeveloperShareModal";

type AssignOfferDashboardModalProps = {
  offer: OfferData | null;
  createdAccount?: DeveloperShareAccount | null;
  onDeveloperCreated?: (offerId: string, account: DeveloperShareAccount) => void;
  onClose: () => void;
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function developerLabel(user: UserData) {
  const name = `${user.displayName || ""} ${user.lastName || ""}`.trim();
  return name || user.email;
}

function assignErrorMessage(code: string, isRtl: boolean) {
  const map: Record<string, [string, string]> = {
    OFFER_NOT_ACCEPTED: ["يمكن إضافة العروض المقبولة فقط.", "Only accepted offers can be added."],
    OFFER_NOT_FOUND: ["لم يتم العثور على العرض.", "The offer was not found."],
    ALREADY_ASSIGNED: ["تمت إضافة هذا العرض للوحة مسبقاً.", "This offer is already added to the dashboard."],
    UNIT_MISSING: ["هذا العرض غير مرتبط بوحدة.", "This offer is not linked to a unit."],
    UNIT_NOT_FOUND: ["لم يتم العثور على الوحدة.", "The unit was not found."],
    UNIT_ASSIGNED_OTHER: ["هذه الوحدة مضافة لمطور آخر.", "This unit is already assigned to another developer."],
    PROJECT_NOT_FOUND: ["لم يتم العثور على المشروع.", "The project was not found."],
    PROJECT_ASSIGNED_OTHER: ["هذا المشروع مضاف لمطور آخر.", "This project is already assigned to another developer."],
    DEVELOPER_MISSING: ["يرجى اختيار مطور.", "Please select a developer."],
    DEVELOPER_INVALID: ["المطور المحدد غير صالح.", "The selected developer is invalid."],
    DEVELOPER_DISABLED: ["حساب المطور المحدد معطّل.", "The selected developer account is disabled."],
    EMAIL_IN_USE: ["البريد الإلكتروني مستخدم بالفعل.", "The email address is already in use."],
    CREATE_FAILED: ["تعذر إنشاء حساب المطور.", "Failed to create the developer account."],
    CREATE_DENIED: ["ليست لديك صلاحية إنشاء حساب مطور.", "You do not have permission to create a developer account."],
  };
  const pair = map[code];
  if (!pair) return isRtl ? "تعذر إضافة العرض للوحة." : "Failed to add the offer to the dashboard.";
  return isRtl ? pair[0] : pair[1];
}

function extractAssignError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code?: string }).code || "");
    if (code === "functions/already-exists") return "EMAIL_IN_USE";
    if (code === "functions/permission-denied" || code === "functions/unauthenticated") return "CREATE_DENIED";
    if (code === "functions/invalid-argument") return "CREATE_FAILED";
  }
  if (error instanceof Error && error.message) return error.message;
  return "";
}

export function AssignOfferDashboardModal({
  offer,
  createdAccount = null,
  onDeveloperCreated,
  onClose,
}: AssignOfferDashboardModalProps) {
  const { t, isRtl } = useLocale();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"existing" | "create">("existing");
  const [selectedDeveloperUid, setSelectedDeveloperUid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const { data: developers = [], isLoading: loadingDevelopers } = useQuery({
    queryKey: ["users", "developer"],
    queryFn: () => usersService.getUsersByRole("developer"),
    enabled: Boolean(offer),
  });

  const activeDevelopers = useMemo(
    () =>
      developers
        .filter((user) => Boolean(user.uid) && user.status !== "disabled")
        .sort((a, b) => developerLabel(a).localeCompare(developerLabel(b), "ar")),
    [developers]
  );

  useEffect(() => {
    if (!offer) {
      document.body.style.overflow = "unset";
      setMode("existing");
      setSelectedDeveloperUid("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        usersPerDeveloper: "",
        password: "",
        confirmPassword: "",
      });
      return;
    }

    document.body.style.overflow = "hidden";
    const names = splitName(offer.developerName || "");
    reset({
      firstName: names.firstName,
      lastName: names.lastName,
      email: "",
      phone: "",
      company: "",
      usersPerDeveloper: "",
      password: "",
      confirmPassword: "",
    });
    setMode("existing");
    setSelectedDeveloperUid("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [offer?.id, reset]);

  const assignToDeveloper = async (uid: string, name: string, close = true) => {
    if (!offer) return;
    await offersService.assignOfferToDashboard(offer, { uid, name });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["offers"] }),
      queryClient.invalidateQueries({ queryKey: ["users"] }),
      queryClient.invalidateQueries({ queryKey: ["developers"] }),
      queryClient.invalidateQueries({ queryKey: ["units"] }),
      queryClient.invalidateQueries({ queryKey: ["properties"] }),
    ]);
    toast.success(isRtl ? "تمت إضافة العرض للوحة المطور بنجاح." : "Offer added to the developer dashboard.");
    if (close) onClose();
  };

  const onCreateAndAssign = async (data: CreateDeveloperForm) => {
    if (!offer) return;
    setIsSubmitting(true);
    let createdUid = "";
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

      const payload = result.data as { success?: boolean; uid?: string };
      if (!payload?.success || !payload.uid) {
        throw new Error("CREATE_FAILED");
      }

      createdUid = payload.uid;
      try {
        await usersService.updateUserData(payload.uid, {
          usersPerDeveloper: Number(data.usersPerDeveloper) || 0,
          password: data.password,
        });
      } catch {
        // Account already has this field from createDeveloperAccount.
      }

      const shareAccount = toDeveloperShareAccount({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        company: data.company,
      });
      onDeveloperCreated?.(offer.id, shareAccount);
      const name = `${data.firstName} ${data.lastName || ""}`.trim() || data.email;
      try {
        await assignToDeveloper(payload.uid, name, false);
      } catch (assignError) {
        setMode("existing");
        setSelectedDeveloperUid(createdUid);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        throw assignError;
      }
    } catch (error: unknown) {
      if (createdUid) {
        setMode("existing");
        setSelectedDeveloperUid(createdUid);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      toast.error(assignErrorMessage(extractAssignError(error), isRtl));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAssignExisting = async () => {
    if (!offer) return;
    const selected = activeDevelopers.find((user) => user.uid === selectedDeveloperUid);
    if (!selected) {
      toast.error(isRtl ? "يرجى اختيار مطور." : "Please select a developer.");
      return;
    }
    setIsSubmitting(true);
    try {
      await assignToDeveloper(selected.uid, developerLabel(selected));
    } catch (error: unknown) {
      toast.error(assignErrorMessage(extractAssignError(error), isRtl));
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "mb-2.5 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:bg-[#EAEAEA] placeholder:text-[#8c8c8c] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed";

  const alreadyAssigned = Boolean(offer?.assignedDeveloperUid);

  return (
    <AnimatePresence>
      {offer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" dir={isRtl ? "rtl" : "ltr"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={isSubmitting ? undefined : onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                  {isRtl ? "إضافة للوحة المطور" : "Add to developer dashboard"}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#8c8c8c]">
                  {offer.offerNumber ? `#${offer.offerNumber}` : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              <div className="mb-8 rounded-[20px] border border-[#0a0f1d]/8 bg-[#F8F8F8] p-5">
                <h3 className="mb-4 text-lg font-bold tracking-tight text-[#0a0f1d]">
                  {isRtl ? "تفاصيل العرض" : "Offer details"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem icon={Hash} label={isRtl ? "العنوان" : "Title"} value={offer.title} />
                  {(offer.projectName || "").trim() ? (
                    <DetailItem icon={Building2} label={isRtl ? "المشروع" : "Project"} value={offer.projectName} />
                  ) : null}
                  {(offer.unitNumber || "").trim() ? (
                    <DetailItem icon={Hash} label={isRtl ? "الوحدة" : "Unit"} value={offer.unitNumber} />
                  ) : null}
                  <DetailItem icon={User} label={isRtl ? "المطور" : "Developer"} value={offer.developerName} />
                  <DetailItem label={isRtl ? "البريد" : "Email"} value={offer.developerEmail} />
                  <DetailItem label={isRtl ? "الجوال" : "Phone"} value={offer.developerPhone} />
                  <DetailItem
                    label={isRtl ? "الإجمالي" : "Total"}
                    value={`${offerAmount(offer).toLocaleString()} SAR`}
                  />
                </div>
              </div>

              {createdAccount ? (
                <div className="space-y-4">
                  {alreadyAssigned ? (
                    <div className="rounded-[16px] bg-[#E8F8EF] px-5 py-4 text-sm font-bold text-[#2f9e44]">
                      {isRtl
                        ? `تمت الإضافة مسبقاً إلى: ${offer.assignedDeveloperName || createdAccount.firstName || "—"}`
                        : `Already added to: ${offer.assignedDeveloperName || createdAccount.firstName || "—"}`}
                    </div>
                  ) : null}
                  <div className="rounded-[20px] border border-[#0a0f1d]/8 bg-white p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0a0f1d]">
                          {isRtl ? "بيانات دخول المطور الجديد" : "New developer login details"}
                        </p>
                        <p dir="ltr" className="text-xs font-medium text-[#8c8c8c]">
                          {createdAccount.email}
                        </p>
                      </div>
                    </div>
                    <DeveloperAccountSharePanel
                      account={createdAccount}
                      showEmail
                      sendToEmail={offer.developerEmail}
                    />
                  </div>
                </div>
              ) : alreadyAssigned ? (
                <div className="rounded-[16px] bg-[#E8F8EF] px-5 py-4 text-sm font-bold text-[#2f9e44]">
                  {isRtl
                    ? `تمت الإضافة مسبقاً إلى: ${offer.assignedDeveloperName || "—"}`
                    : `Already added to: ${offer.assignedDeveloperName || "—"}`}
                </div>
              ) : (
                <>
                  <div className="mb-6 flex flex-wrap gap-2 rounded-[16px] bg-[#F4F4F4] p-1">
                    <button
                      type="button"
                      onClick={() => setMode("existing")}
                      disabled={isSubmitting}
                      className={cn(
                        "flex-1 rounded-[12px] px-4 py-3 text-sm font-bold transition-colors disabled:opacity-60",
                        mode === "existing" ? "bg-white text-[#0a0f1d] shadow-sm" : "text-[#8c8c8c]"
                      )}
                    >
                      {isRtl ? "إضافة لمطور موجود" : "Add to existing developer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("create")}
                      disabled={isSubmitting}
                      className={cn(
                        "flex-1 rounded-[12px] px-4 py-3 text-sm font-bold transition-colors disabled:opacity-60",
                        mode === "create" ? "bg-white text-[#0a0f1d] shadow-sm" : "text-[#8c8c8c]"
                      )}
                    >
                      {isRtl ? "إنشاء مطور جديد" : "Create new developer"}
                    </button>
                  </div>

                  {mode === "existing" ? (
                    <div>
                      <label className={labelClass}>{isRtl ? "المطور" : "Developer"}</label>
                      <select
                        value={selectedDeveloperUid}
                        onChange={(event) => setSelectedDeveloperUid(event.target.value)}
                        disabled={loadingDevelopers || isSubmitting}
                        className={`${inputClass} appearance-none`}
                      >
                        <option value="">
                          {loadingDevelopers
                            ? (isRtl ? "جاري التحميل..." : "Loading...")
                            : (isRtl ? "اختر المطور" : "Select developer")}
                        </option>
                        {activeDevelopers.map((user) => (
                          <option key={user.uid} value={user.uid}>
                            {developerLabel(user)} {user.email ? `— ${user.email}` : ""}
                          </option>
                        ))}
                      </select>
                      {!loadingDevelopers && activeDevelopers.length === 0 ? (
                        <p className="mt-2 text-xs font-medium text-[#8c8c8c]">
                          {isRtl ? "لا يوجد مطورون حالياً. يمكنك إنشاء مطور جديد." : "No developers yet. You can create a new one."}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <form id="assign-offer-create-developer" onSubmit={handleSubmit(onCreateAndAssign)}>
                      <fieldset disabled={isSubmitting} className="min-w-0 border-0 p-0">
                      <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">
                        {t("admin.developers.createForm.personalInfo") || "Personal Information"}
                      </h3>
                      <div className="mb-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.firstName") || "First Name"}</label>
                          <input {...register("firstName")} className={inputClass} />
                          {errors.firstName && <span className="mt-1 block text-xs text-red-500">{errors.firstName.message}</span>}
                        </div>
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.lastName") || "Last Name"}</label>
                          <input {...register("lastName")} className={inputClass} />
                        </div>
                      </div>
                      <div className="mb-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.email") || "Email Address"}</label>
                          <input
                            {...register("email")}
                            dir="ltr"
                            autoComplete="off"
                            placeholder="developer@email.com"
                            className={`${inputClass} text-left`}
                          />
                          <p className="mt-1.5 text-xs font-medium text-[#8c8c8c]">
                            {isRtl
                              ? "بريد حساب المطور الجديد. ليس بريد العرض أعلاه."
                              : "New developer login email. Not the offer email above."}
                          </p>
                          {errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email.message}</span>}
                        </div>
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.phone") || "Phone Number"}</label>
                          <input {...register("phone")} dir="ltr" className={`${inputClass} text-left`} />
                        </div>
                      </div>
                      <div className="mb-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.company") || "Company Name (Optional)"}</label>
                          <input {...register("company")} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.usersPerDeveloper")}</label>
                          <input type="number" min="0" {...register("usersPerDeveloper")} className={inputClass} />
                        </div>
                      </div>
                      <hr className="my-8 border-[#0a0f1d]/10" />
                      <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">
                        {t("admin.developers.createForm.accountInfo") || "Account & Security"}
                      </h3>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.password") || "Password"}</label>
                          <div className="relative" dir="ltr">
                            <input
                              type={showPassword ? "text" : "password"}
                              {...register("password")}
                              className={`${inputClass} pr-12 text-left`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((value) => !value)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d]"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {errors.password && <span className="mt-1 block text-xs text-red-500">{errors.password.message}</span>}
                        </div>
                        <div>
                          <label className={labelClass}>{t("admin.developers.createForm.confirmPassword") || "Confirm Password"}</label>
                          <div className="relative" dir="ltr">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              {...register("confirmPassword")}
                              className={`${inputClass} pr-12 text-left`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((value) => !value)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#0a0f1d]"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <span className="mt-1 block text-xs text-red-500">{errors.confirmPassword.message}</span>}
                        </div>
                      </div>
                      </fieldset>
                    </form>
                  )}
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F4F4] px-6 text-sm font-bold text-[#0a0f1d] hover:bg-[#EAEAEA] disabled:opacity-50"
              >
                {t("admin.cancel") || (isRtl ? "إلغاء" : "Cancel")}
              </button>
              {!alreadyAssigned && !createdAccount ? (
                <button
                  type={mode === "create" ? "submit" : "button"}
                  form={mode === "create" ? "assign-offer-create-developer" : undefined}
                  onClick={mode === "existing" ? onAssignExisting : undefined}
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isRtl ? "إضافة للوحة" : "Add to dashboard"}
                </button>
              ) : !alreadyAssigned && createdAccount ? (
                <button
                  type="button"
                  onClick={onAssignExisting}
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isRtl ? "إضافة للوحة" : "Add to dashboard"}
                </button>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Hash;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#8c8c8c]">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-[#0a0f1d]">{value?.trim() || "—"}</p>
    </div>
  );
}
