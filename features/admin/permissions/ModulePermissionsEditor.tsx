"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import type { AdminPermissions, PermissionAction, PermissionModule } from "@/types/user";
import {
  MODULE_AVAILABLE_ACTIONS,
  MODULE_ICONS,
  MODULE_NAV_KEYS,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
} from "./constants";
import {
  getPermissionsSummary,
  isModuleFullyGranted,
  setAllPermissions,
  setModuleAction,
  setModuleAll,
} from "./utils";

type ModulePermissionsEditorProps = {
  value: AdminPermissions;
  onChange: (next: AdminPermissions) => void;
  disabled?: boolean;
};

export function ModulePermissionsEditor({
  value,
  onChange,
  disabled = false,
}: ModulePermissionsEditorProps) {
  const { t, locale } = useLocale();
  const summary = getPermissionsSummary(value);

  const summaryLabel =
    summary === "full"
      ? t("admin.permissions.statusFull")
      : summary === "partial"
        ? t("admin.permissions.statusPartial")
        : t("admin.permissions.statusNone");

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <h3 className="text-lg font-bold tracking-tight text-[#0a0f1d]">
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
          <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-[#8c8c8c]">
            {t("admin.permissions.description")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(setAllPermissions(true))}
            className="inline-flex h-10 items-center rounded-full bg-[#0a0f1d] px-5 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-50"
          >
            {t("admin.permissions.grantAll")}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(setAllPermissions(false))}
            className="inline-flex h-10 items-center rounded-full bg-[#FFE8E4] px-5 text-sm font-bold text-[#FF6A55] transition-colors hover:bg-[#ffd7d1] disabled:opacity-50"
          >
            {t("admin.permissions.revokeAll")}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-[#F4F4F4]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-0">
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
                <th
                  className={cn(
                    "px-4 py-3.5 text-end text-[11px] font-bold text-[#8c8c8c]",
                    locale === "ar" ? "tracking-normal" : "tracking-[0.16em] uppercase"
                  )}
                >
                  {t("admin.permissions.all")}
                </th>
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MODULES.map((module) => (
                <PermissionRow
                  key={module}
                  module={module}
                  value={value}
                  disabled={disabled}
                  onChange={onChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PermissionRow({
  module,
  value,
  disabled,
  onChange,
}: {
  module: PermissionModule;
  value: AdminPermissions;
  disabled: boolean;
  onChange: (next: AdminPermissions) => void;
}) {
  const { t } = useLocale();
  const Icon = MODULE_ICONS[module];
  const fullyGranted = isModuleFullyGranted(value, module);

  return (
    <tr>
      <td className="border-t border-[#0a0f1d]/8 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0a0f1d]">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-[#0a0f1d]">
            {t(MODULE_NAV_KEYS[module])}
          </span>
        </div>
      </td>
      {PERMISSION_ACTIONS.map((action) => (
        <td key={action} className="border-t border-[#0a0f1d]/8 px-2 py-4 text-center">
          <div className="flex justify-center">
            <PermissionCheckbox
              module={module}
              action={action}
              checked={Boolean(value[module]?.[action])}
              disabled={disabled}
              value={value}
              onChange={onChange}
            />
          </div>
        </td>
      ))}
      <td className="border-t border-[#0a0f1d]/8 px-4 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(setModuleAll(value, module, !fullyGranted))}
            className={cn(
              "inline-flex h-8 items-center rounded-full px-3.5 text-[11px] font-bold transition-colors disabled:opacity-50",
              fullyGranted
                ? "bg-[#FFE8E4] text-[#FF6A55] hover:bg-[#ffd7d1]"
                : "bg-white text-[#0a0f1d] hover:bg-[#EAEAEA]"
            )}
          >
            {fullyGranted ? t("admin.permissions.revokeRow") : t("admin.permissions.grantRow")}
          </button>
        </div>
      </td>
    </tr>
  );
}

function PermissionCheckbox({
  module,
  action,
  checked,
  disabled,
  value,
  onChange,
}: {
  module: PermissionModule;
  action: PermissionAction;
  checked: boolean;
  disabled: boolean;
  value: AdminPermissions;
  onChange: (next: AdminPermissions) => void;
}) {
  const { t } = useLocale();
  const available = MODULE_AVAILABLE_ACTIONS[module].includes(action);

  if (!available) {
    return <span className="text-sm font-bold text-[#c5c9d1]">—</span>;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={checked}
      aria-label={`${t(MODULE_NAV_KEYS[module])} ${t(`admin.permissions.${action}`)}`}
      onClick={() => onChange(setModuleAction(value, module, action, !checked))}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-[6px] border-2 transition-colors disabled:opacity-50",
        checked
          ? "border-[#0a0f1d] bg-[#0a0f1d]"
          : "border-[#c5c9d1] bg-white hover:border-[#0a0f1d]"
      )}
    >
      {checked ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : null}
    </button>
  );
}
