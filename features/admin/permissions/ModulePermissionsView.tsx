"use client";

import { Check, ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { AdminPermissions, PermissionAction, PermissionModule, UserData } from "@/types/user";
import {
  MODULE_AVAILABLE_ACTIONS,
  MODULE_ICONS,
  MODULE_NAV_KEYS,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
} from "./constants";
import { getEditorPermissions, getPermissionsSummary } from "./utils";

export function AccountPermissionsSection({ user }: { user: UserData }) {
  if (user.role === "developer") return null;

  if (user.role === "superAdmin") {
    return <SuperAdminPermissionsNote />;
  }

  if (user.role !== "admin") return null;

  return <AdminPermissionsView value={getEditorPermissions(user)} />;
}

function SuperAdminPermissionsNote() {
  const { t } = useLocale();

  return (
    <div className="mt-8 pt-8 border-t border-[#0a0f1d]/10">
      <h3 className="mb-4 sm:mb-6 text-xl font-bold tracking-tight text-[#0a0f1d] text-center sm:text-start">
        {t("admin.permissions.title")}
      </h3>
      <div className="flex items-start gap-3 rounded-[16px] bg-[#F4F4F4] p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0a0f1d]">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <p className="pt-2 text-sm font-semibold leading-relaxed text-[#0a0f1d]">
          {t("admin.permissions.superAdminFullAccess")}
        </p>
      </div>
    </div>
  );
}

function AdminPermissionsView({ value }: { value: AdminPermissions }) {
  const { t, locale } = useLocale();
  const summary = getPermissionsSummary(value);

  const summaryLabel =
    summary === "full"
      ? t("admin.permissions.statusFull")
      : summary === "partial"
        ? t("admin.permissions.statusPartial")
        : t("admin.permissions.statusNone");

  return (
    <div className="mt-8 pt-8 border-t border-[#0a0f1d]/10">
      <div className="mb-5 flex min-w-0 items-center gap-3 justify-center sm:justify-start">
        <h3 className="text-xl font-bold tracking-tight text-[#0a0f1d]">
          {t("admin.permissions.title")}
        </h3>
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full px-3 text-[11px] font-bold",
            summary === "full" && "bg-[#0a0f1d] text-white",
            summary === "partial" && "bg-[#0a0f1d]/10 text-[#0a0f1d]",
            summary === "none" && "bg-[#F4F4F4] text-[#8c8c8c]"
          )}
        >
          {summaryLabel}
        </span>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-[#F4F4F4]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  className={cn(
                    "px-5 py-3.5 text-start text-[11px] font-bold text-[#8c8c8c]",
                    locale === "ar" ? "tracking-normal" : "tracking-[0.16em] uppercase"
                  )}
                >
                  {t("admin.permissions.module")}
                </th>
                {PERMISSION_ACTIONS.map((action) => (
                  <th
                    key={action}
                    className="min-w-[72px] px-3 py-3.5 text-center text-[12px] font-bold text-[#0a0f1d]"
                  >
                    {t(`admin.permissions.${action}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MODULES.map((module) => (
                <tr key={module}>
                  <td className="border-t border-[#0a0f1d]/8 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0a0f1d]">
                        {(() => {
                          const Icon = MODULE_ICONS[module];
                          return <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />;
                        })()}
                      </span>
                      <span className="text-[15px] font-bold tracking-tight text-[#0a0f1d]">
                        {t(MODULE_NAV_KEYS[module])}
                      </span>
                    </div>
                  </td>
                  {PERMISSION_ACTIONS.map((action) => (
                    <td key={action} className="border-t border-[#0a0f1d]/8 px-2 py-4 text-center">
                      <div className="flex justify-center">
                        <PermissionMark
                          module={module}
                          action={action}
                          checked={Boolean(value[module]?.[action])}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PermissionMark({
  module,
  action,
  checked,
}: {
  module: PermissionModule;
  action: PermissionAction;
  checked: boolean;
}) {
  const available = MODULE_AVAILABLE_ACTIONS[module].includes(action);

  if (!available) {
    return <span className="text-sm font-bold text-[#c5c9d1]">—</span>;
  }

  return (
    <span
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-[6px] border-2",
        checked ? "border-[#0a0f1d] bg-[#0a0f1d]" : "border-[#c5c9d1] bg-white"
      )}
    >
      {checked ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
    </span>
  );
}
