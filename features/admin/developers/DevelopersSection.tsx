"use client";

import { useMemo, useState } from "react";
import { Users, Search, Terminal, Plus, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";

export function DevelopersSection() {
  const { t } = useLocale();
  const router = useRouter();
  const [queryStr, setQueryStr] = useState("");

  const { data: developers = [], isLoading } = useQuery({
    queryKey: ["developers"],
    queryFn: () => usersService.getUsersByRole("developer"),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return developers;
    return developers.filter(
      (row) =>
        (row.displayName || "").toLowerCase().includes(q) ||
        (row.email || "").toLowerCase().includes(q) ||
        (row.companyName || "").toLowerCase().includes(q) ||
        (row.phoneNumber || "").toLowerCase().includes(q)
    );
  }, [developers, queryStr]);

  const columns: Column<UserData>[] = [
    {
      id: "developer",
      header: t("admin.developers.name") || "Developer",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.displayName ? row.displayName.charAt(0).toUpperCase() : (row.email ? row.email.charAt(0).toUpperCase() : "-")}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-[#0a0f1d]">{row.displayName || "No Name"}</span>
            <span className="text-xs text-[#6B7280]">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      header: t("admin.developers.company") || "Company",
      cell: (row) => <span className="text-[#0a0f1d] font-medium">{row.companyName || "-"}</span>,
    },
    {
      id: "phone",
      header: t("admin.developers.phone") || "Phone",
      cell: (row) => <span className="text-[#6B7280] tabular-nums">{row.phoneNumber || "-"}</span>,
    },
    {
      id: "joined",
      header: t("admin.developers.joined") || "Joined Date",
      cell: (row) => (
        <span className="text-[#6B7280]">
          {row.createdAt ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(row.createdAt)) : "-"}
        </span>
      ),
    },
  ];



  return (
    <div className="flex flex-col gap-3">
      <StatGrid className="xl:grid-cols-2">
        <StatCard icon={Terminal} label={t("admin.developers.total") || "Total Developers"} value={developers.length} />
        <StatCard icon={Users} label={t("admin.developers.active") || "Active Accounts"} value={developers.length} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.uid}
        empty={t("admin.ui.empty") || "No developers found"}
        actionsHeader={t("admin.ui.actions") || "Actions"}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={t("admin.developers.search") || "Search developers..."}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
              <button
                disabled
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                {t("admin.developers.create") || "Create Account"}
              </button>
            </div>
        }
        actions={(row) => (
          <></>
        )}
      />
    </div>
  );
}
