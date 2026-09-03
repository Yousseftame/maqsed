"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import { cn } from "@/lib/utils";
import type { UserData } from "@/types/user";

export function SettingsSection() {
  const { user, userData, refreshUser } = useAuth();
  const { t, locale } = useLocale();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: userData?.displayName || "",
    lastName: userData?.lastName || "",
    phoneNumber: userData?.phoneNumber || "",
    companyName: userData?.companyName || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.uid) return;

    setSaving(true);
    try {
      const updatePayload: Partial<UserData> = {
        displayName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
      };

      await usersService.updateUserData(userData.uid, updatePayload);
      await refreshUser(); // Fetch new data globally without page reload
      toast.success(t("admin.ui.saved") || "Changes saved");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(t("admin.ui.error") || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: userData?.displayName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phoneNumber || "",
      companyName: userData?.companyName || "",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !userData?.uid) return;
    
    const file = e.target.files[0];
    // basic validation
    if (!file.type.startsWith("image/")) {
      toast.error(t("admin.ui.error") || "Invalid file type");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await usersService.uploadAvatar(userData.uid, file);
      await refreshUser(); // Update avatar globally instantly
      toast.success(t("admin.ui.saved") || "Avatar updated");
    } catch (error: any) {
      toast.error(t("admin.ui.error") || "Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const roleDisplay = userData?.role === "admin" 
    ? (t("admin.ui.admin") || "Admin") 
    : userData?.role === "developer" 
    ? (t("admin.ui.developer") || "Developer") 
    : (t("admin.ui.user") || "User");

  const isAr = locale === "ar";

  const cardClass = "bg-white rounded-[20px] border border-[#e5e7eb] shadow-sm";
  const labelClass = "block text-[14px] font-bold text-[#4b4f56] mb-2";
  const valueBoxClass = "w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3.5 text-[15px] font-semibold text-[#1c1e21]";
  const inputClass = "w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#1c1e21] outline-none focus:border-[#3E1854] focus:ring-4 focus:ring-[#3E1854]/10 transition-all";

  return (
    <div className="w-full pb-12 pt-6">
      
      {/* Header */}
      <div className="mb-6 px-1">
        <h1 className="text-[28px] font-bold text-[#1c1e21] tracking-tight">
          {t("admin.accountSettings.title") || "Account Settings"}
        </h1>
        <p className="mt-1 text-[15px] text-[#65676b]">
          {t("admin.accountSettings.description") || "Manage your account details and personal information"}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[350px_1fr]">
        
        {/* Left Side: Avatar & Quick Info */}
        <div className="flex flex-col h-full">
          <div className={cn(cardClass, "p-8 flex flex-col items-center justify-center text-center h-full")}>
            <div 
              className="relative group cursor-pointer mb-5"
              onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#f0f2f5] text-[#1c1e21] border border-[#e5e7eb] overflow-hidden relative">
                {userData?.photoURL ? (
                  <Image 
                    src={userData.photoURL} 
                    alt="Avatar" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <span className="text-4xl font-extrabold">
                    {(userData?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </span>
                )}
                
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-[#3E1854]" />
                  </div>
                )}
              </div>
              
              {!isUploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            <h2 className="text-[22px] font-bold text-[#1c1e21] mb-1">
              {userData?.displayName 
                ? `${userData.displayName} ${userData.lastName || ""}`
                : (t("admin.ui.user") || "User")}
            </h2>
            <div className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#17C3B3]/10 px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-[#17C3B3]" />
              <span className="text-[13px] font-bold text-[#17C3B3]">{roleDisplay}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Details */}
        <div className={cardClass}>
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-8 py-6">
            <h3 className="text-[18px] font-bold text-[#1c1e21]">{t("admin.accountSettings.profileDetails") || "Profile details"}</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[14px] font-bold text-[#17C3B3] hover:text-[#12A093] hover:underline"
              >
                {t("admin.ui.edit") || "Edit"}
              </button>
            )}
          </div>

          <div className="p-8">
            {!isEditing ? (
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div>
                  <span className={labelClass}>{t("admin.accountSettings.firstName") || "First Name"}</span>
                  <div className={cn(valueBoxClass, isAr && "text-right")} dir={isAr ? "rtl" : "ltr"}>
                    {userData?.displayName || "-"}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>{t("admin.accountSettings.lastName") || "Last Name"}</span>
                  <div className={cn(valueBoxClass, isAr && "text-right")} dir={isAr ? "rtl" : "ltr"}>
                    {userData?.lastName || "-"}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>{t("admin.accountSettings.phoneNumber") || "Phone Number"}</span>
                  <div className={cn(valueBoxClass, isAr && "text-right")} dir="ltr">
                    {userData?.phoneNumber || "-"}
                  </div>
                </div>
                <div>
                  <span className={labelClass}>{t("admin.accountSettings.companyName") || "Company Name"}</span>
                  <div className={cn(valueBoxClass, isAr && "text-right")} dir={isAr ? "rtl" : "ltr"}>
                    {userData?.companyName || "-"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <span className={labelClass}>{t("admin.accountSettings.email") || "Email Address"}</span>
                  <div className={cn(valueBoxClass, isAr && "text-right")} dir="ltr">
                    {user?.email || "-"}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>{t("admin.accountSettings.firstName") || "First Name"}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={cn(inputClass, isAr && "text-right")}
                      dir={isAr ? "rtl" : "ltr"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("admin.accountSettings.lastName") || "Last Name"}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={cn(inputClass, isAr && "text-right")}
                      dir={isAr ? "rtl" : "ltr"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("admin.accountSettings.phoneNumber") || "Phone Number"}</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={cn(inputClass, isAr && "text-right")}
                      dir={isAr ? "rtl" : "ltr"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("admin.accountSettings.companyName") || "Company Name"}</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={cn(inputClass, isAr && "text-right")}
                      dir={isAr ? "rtl" : "ltr"}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>{t("admin.accountSettings.email") || "Email Address"}</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className={cn(inputClass, "opacity-50 bg-[#f9fafb] cursor-not-allowed")}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-[#e5e7eb]">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-[#4b4f56] hover:bg-[#f0f2f5] transition-colors disabled:opacity-50"
                  >
                    {t("admin.cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center min-w-[120px] h-11 rounded-xl bg-[#17C3B3] px-6 text-[14px] font-bold text-white hover:bg-[#12A093] hover:shadow-lg hover:shadow-[#17C3B3]/20 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {saving ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      (t("admin.ui.save") || "Save changes")
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
