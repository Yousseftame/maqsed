"use client";

import { useMemo, useState } from "react";
import { Building2, CircleCheck, Folder, Map, Plus, Search } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { PROJECTS, PROJECT_STATUS_TONE, type Project } from "@/features/admin/projects/data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";

export function ProjectsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(PROJECTS);

  const localized = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        nameLabel: row.name[locale],
        cityLabel: row.city[locale],
        updatedLabel: row.updated[locale],
      })),
    [locale, rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (row) =>
        row.nameLabel.toLowerCase().includes(q) ||
        row.cityLabel.toLowerCase().includes(q)
    );
  }, [localized, query]);

  const totalUnits = rows.reduce((sum, row) => sum + row.units, 0);
  const activeCount = rows.filter((row) => row.status === "active").length;
  const cityCount = new Set(rows.map((row) => row.city.en)).size;

  async function handleDelete(row: Project) {
    const ok = await confirm({
      title: t("admin.projects.deleteTitle"),
      description: t("admin.projects.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "name",
      header: t("admin.projects.name"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.nameLabel.slice(0, 1)}
          </span>
          <span className="font-semibold">{row.nameLabel}</span>
        </div>
      ),
    },
    {
      id: "city",
      header: t("admin.projects.city"),
      cell: (row) => <span className="text-[#6B7280]">{row.cityLabel}</span>,
    },
    {
      id: "units",
      header: t("admin.projects.unitsCol"),
      cell: (row) => <span className="tabular-nums">{row.units}</span>,
    },
    {
      id: "status",
      header: t("admin.projects.status"),
      cell: (row) => (
        <StatusBadge tone={PROJECT_STATUS_TONE[row.status]}>
          {t(`admin.projects.statuses.${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      id: "updated",
      header: t("admin.projects.updated"),
      cell: (row) => <span className="text-[#6B7280]">{row.updatedLabel}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard
          icon={Folder}
          label={t("admin.projects.total")}
          value={rows.length}
        />
        <StatCard
          icon={CircleCheck}
          label={t("admin.projects.active")}
          value={activeCount}
        />
        <StatCard
          icon={Building2}
          label={t("admin.projects.units")}
          value={totalUnits}
        />
        <StatCard
          icon={Map}
          label={t("admin.projects.cities")}
          value={cityCount}
        />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={t("admin.ui.empty")}
        actionsHeader={t("admin.ui.actions")}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("admin.projects.search")}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              {t("admin.projects.add")}
            </button>
          </div>
        }
        actions={(row) => (
          <>
            <TableAction label={t("admin.ui.view")} />
            <TableAction label={t("admin.ui.edit")} />
            <TableAction
              label={t("admin.ui.delete")}
              tone="danger"
              onClick={() => handleDelete(row)}
            />
          </>
        )}
      />
    </div>
  );
}
