"use client";

import { useState, useRef, useEffect } from "react";
import { Key } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function UserAvatarDropdown() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "M").toUpperCase();
  const name = user?.displayName || t("admin.ui.user") || "User";
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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0f1d] text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
        title={email}
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-64 overflow-hidden rounded-[24px] border border-[#0a0f1d]/10 bg-white p-2 shadow-2xl z-50">
          <div className="flex flex-col border-b border-[#0a0f1d]/5 px-4 py-3">
            <span className="font-bold text-[#0a0f1d] truncate">{name}</span>
            <span className="text-xs text-[#8c8c8c] truncate">{email}</span>
          </div>
          
          <div className="flex flex-col gap-1 p-2">
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
