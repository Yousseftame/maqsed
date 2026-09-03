"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Key, LogOut, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAdminSignOut } from "@/features/admin/hooks/useAdminSignOut";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function UserAvatarDropdown() {
  const { user, userData } = useAuth();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleSignOut = useAdminSignOut();
  
  const initial = (userData?.displayName?.[0] ?? user?.displayName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();
  
  let defaultRoleName = t("admin.ui.user");
  if (userData?.role === "admin") {
    defaultRoleName = t("admin.ui.admin");
  } else if (userData?.role === "developer") {
    defaultRoleName = t("admin.ui.developer");
  }
  
  const fullName = userData?.displayName 
    ? `${userData.displayName} ${userData.lastName || ""}`.trim()
    : user?.displayName || defaultRoleName || "User";

  const name = fullName;
  const email = user?.email || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0f1d] text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 overflow-hidden relative"
        title={email}
      >
        {userData?.photoURL ? (
          <Image src={userData.photoURL} alt="User Avatar" fill className="object-cover" />
        ) : (
          initial
        )}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-64 overflow-hidden rounded-[24px] border border-[#0a0f1d]/10 bg-white p-2 shadow-2xl z-50">
          <div className="flex flex-col border-b border-[#0a0f1d]/5 px-4 py-3">
            <span className="font-bold text-[#0a0f1d] truncate">{name}</span>
            <span className="text-xs text-[#8c8c8c] truncate">{email}</span>
          </div>
          
          <div className="flex flex-col gap-1 p-2">
            <Link
              href={userData?.role === "admin" ? "/admin/settings" : "/developer/settings"}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4]"
            >
              <Settings className="h-4 w-4 text-[#8c8c8c]" />
              {t("admin.ui.settings") || "Settings"}
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsChangePasswordOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4]"
            >
              <Key className="h-4 w-4 text-[#8c8c8c]" />
              {t("admin.ui.changePassword") || "Change Password"}
            </button>

            <div className="my-1 h-px w-full bg-[#0a0f1d]/5" />

            <button
              onClick={() => {
                setIsOpen(false);
                handleSignOut();
              }}
              className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-semibold text-[#FF6A55] transition-colors hover:bg-[#FFE8E4]"
            >
              <LogOut className="h-4 w-4" />
              {t("admin.signOut") || "Sign Out"}
            </button>
          </div>
        </div>
      )}

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </div>
  );
}
