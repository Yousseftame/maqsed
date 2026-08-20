"use client";

import { useMemo, useState } from "react";
import { Building2, CircleCheck, Eye, Key, Plus, Search } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { UNITS, UNIT_STATUS_TONE, type Unit } from "@/features/admin/units/data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";

export function UnitsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(UNITS);

  const localized = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        typeLabel: row.type[locale],
        projectLabel: row.project[locale],
        locationLabel: row.locationBuilding[locale],
      })),
    [locale, rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (row) =>
        row.number.toLowerCase().includes(q) ||
        row.typeLabel.toLowerCase().includes(q) ||
        row.projectLabel.toLowerCase().includes(q) ||
        row.locationLabel.toLowerCase().includes(q)
    );
  }, [localized, query]);

  const totalViews = rows.reduce((sum, row) => sum + row.views, 0);
  const activeCount = rows.filter((row) => row.status === "active").length;
  const projectsCount = new Set(rows.map((row) => row.project.en)).size;

  async function handleDelete(row: Unit) {
    const ok = await confirm({
      title: t("admin.units.deleteTitle"),
      description: t("admin.units.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "numberType",
      header: t("admin.units.numberType"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.number.slice(0, 1)}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold">{row.number}</span>
            <span className="text-xs text-[#6B7280]">{row.typeLabel}</span>
          </div>
        </div>
      ),
    },
    {
      id: "project",
      header: t("admin.units.project"),
      cell: (row) => <span className="font-medium text-[#0a0f1d]">{row.projectLabel}</span>,
    },
    {
      id: "location",
      header: t("admin.units.locationBuilding"),
      cell: (row) => <span className="text-[#6B7280]">{row.locationLabel}</span>,
    },
    {
      id: "price",
      header: t("admin.units.price"),
      cell: (row) => <span className="tabular-nums font-semibold">{row.price}</span>,
    },
    {
      id: "status",
      header: t("admin.units.status"),
      cell: (row) => (
        <StatusBadge tone={UNIT_STATUS_TONE[row.status]}>
          {t(`admin.units.statuses.${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      id: "views",
      header: t("admin.units.viewsCol"),
      cell: (row) => <span className="tabular-nums text-[#6B7280]">{row.views}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard
          icon={Key}
          label={t("admin.units.total")}
          value={rows.length}
        />
        <StatCard
          icon={CircleCheck}
          label={t("admin.units.active")}
          value={activeCount}
        />
        <StatCard
          icon={Building2}
          label={t("admin.projects.total")} // Reused translation for total projects
          value={projectsCount}
        />
        <StatCard
          icon={Eye}
          label={t("admin.units.views")}
          value={totalViews}
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
                placeholder={t("admin.units.search")}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              {t("admin.units.add")}
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
