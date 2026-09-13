"use client";

import { useMemo, useState } from "react";
import { Building2, CircleCheck, Eye, Folder, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { propertiesService } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService } from "@/features/admin/units/units.service";
import { ViewProjectModal } from "@/features/admin/projects/ViewProjectModal";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

const STATUS_TONE: Record<string, "success" | "warning" | "muted" | "danger"> = {
  active: "success",
  soon: "warning",
  draft: "muted",
  soldOut: "danger",
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  soon: "قريباً",
  draft: "مسودة",
  soldOut: "مباع بالكامل",
};

export function DeveloperProjectsSection() {
  const { locale, t, isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [queryStr, setQueryStr] = useState("");
  const [viewPropertyId, setViewPropertyId] = useState<string | null>(null);

  const { data: properties = [], refetch, isRefetching } = useQuery({
    queryKey: ["properties", "developer", ownerUid],
    queryFn: () => propertiesService.getPropertiesByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const { data: units = [] } = useQuery({
    queryKey: ["units", "developer", ownerUid],
    queryFn: () => unitsService.getUnitsByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const localized = useMemo(() => {
    return properties.map((prop) => {
      const city = cities.find((item) => item.id === prop.cityId);
      const cityName = city?.name[locale] || prop.cityId;
      const computedUnitsCount = units.filter((unit) => unit.projectId === prop.id).length;
      return {
        ...prop,
        nameLabel: prop.name,
        cityLabel: cityName,
        computedUnitsCount,
      };
    });
  }, [properties, cities, units, locale]);

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (row) =>
        row.nameLabel.toLowerCase().includes(q) ||
        row.cityLabel.toLowerCase().includes(q)
    );
  }, [localized, queryStr]);

  const viewProperty = properties.find((item) => item.id === viewPropertyId) || null;
  const viewUnitsCount = viewProperty
    ? units.filter((unit) => unit.projectId === viewProperty.id).length
    : 0;
  const activeCount = properties.filter((row) => row.status === "active").length;
  const totalViews = properties.reduce((sum, row) => sum + (Number(row.views) || 0), 0);

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "name",
      header: t("admin.projects.name") || (isRtl ? "المشروع" : "Project"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.images && row.images.length > 0 ? (
              <img src={row.images[0]} alt={row.nameLabel} className="h-full w-full object-cover" />
            ) : (
              row.nameLabel.slice(0, 1)
            )}
          </span>
          <span className="font-semibold">{row.nameLabel}</span>
        </div>
      ),
    },
    {
      id: "city",
      header: t("admin.projects.city") || (isRtl ? "المدينة" : "City"),
      cell: (row) => <span className="text-[#6B7280]">{row.cityLabel}</span>,
    },
    {
      id: "units",
      header: t("admin.projects.unitsCol") || (isRtl ? "الوحدات" : "Units"),
      cell: (row) => <span className="tabular-nums font-semibold">{row.computedUnitsCount}</span>,
    },
    {
      id: "views",
      header: t("admin.projects.viewsCol") || (isRtl ? "المشاهدات" : "Views"),
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[#6B7280]">
          <Eye className="h-4 w-4" />
          <span className="tabular-nums">{row.views?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.projects.status") || (isRtl ? "الحالة" : "Status"),
      cell: (row) => (
        <StatusBadge tone={STATUS_TONE[row.status] || "muted"}>
          {STATUS_LABELS[row.status] || row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard icon={Folder} label={isRtl ? "إجمالي المشاريع" : "Total projects"} value={properties.length} />
        <StatCard icon={CircleCheck} label={isRtl ? "المشاريع النشطة" : "Active projects"} value={activeCount} />
        <StatCard icon={Building2} label={isRtl ? "الوحدات" : "Units"} value={units.filter((unit) => unit.projectId && unit.projectId !== "independent").length} />
        <StatCard icon={Eye} label={isRtl ? "المشاهدات" : "Views"} value={totalViews} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={isRtl ? "لا توجد مشاريع مضافة بعد." : "No projects have been added yet."}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={isRtl ? "البحث في المشاريع..." : "Search projects..."}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching || !ownerUid}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
              title={isRtl ? "تحديث" : "Refresh"}
            >
              <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
        actions={(row) => (
          <TableAction
            label={t("admin.ui.view") || (isRtl ? "عرض" : "View")}
            onClick={() => setViewPropertyId(row.id)}
          />
        )}
      />

      <ViewProjectModal
        isOpen={Boolean(viewProperty)}
        onClose={() => setViewPropertyId(null)}
        property={viewProperty}
        cities={cities}
        unitsCount={viewUnitsCount}
      />
    </div>
  );
}
