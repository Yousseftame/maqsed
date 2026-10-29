"use client";

import { useMemo, useState } from "react";
import { Building2, CircleCheck, Eye, Key, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { unitsService } from "@/features/admin/units/units.service";
import { propertiesService } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { ViewUnitModal } from "@/features/admin/units/ViewUnitModal";
import { unitSellingPrice } from "@/features/units/unit-discount";
import { INDEPENDENT_PROJECT_ID } from "@/features/admin/offers/offer-affiliation";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

const UNIT_STATUS_LABELS: Record<string, string> = {
  available: "متاحة",
  unavailable: "مباعة",
};

export function DeveloperUnitsSection() {
  const { locale, t, isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [queryStr, setQueryStr] = useState("");
  const [viewUnitId, setViewUnitId] = useState<string | null>(null);

  const { data: units = [], refetch, isRefetching } = useQuery({
    queryKey: ["units", "developer", ownerUid],
    queryFn: () => unitsService.getUnitsByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties", "developer", ownerUid],
    queryFn: () => propertiesService.getPropertiesByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const localized = useMemo(() => {
    return units.map((unit) => {
      let projectLabel = isRtl ? "وحدة مستقلة" : "Independent unit";
      let locationLabel = "-";
      let displayUnitNumber = unit.unitNumber || (isRtl ? "بدون رقم" : "No number");

      if (unit.projectId === INDEPENDENT_PROJECT_ID || !unit.projectId) {
        const city = cities.find((item) => item.id === unit.cityId);
        const neighborhood = city?.neighborhoods.find((item) => item.id === unit.neighborhoodId);
        if (city && neighborhood) {
          locationLabel = `${city.name[locale]} - ${neighborhood.name[locale]}`;
        }
      } else {
        const project = properties.find((item) => item.id === unit.projectId);
        if (project) {
          projectLabel = project.name;
          const building = project.buildings?.find((item) => item.id === unit.buildingId);
          if (building) {
            locationLabel = isRtl ? `مبنى ${building.code}` : `Building ${building.code}`;
            if (unit.unitNumber) {
              displayUnitNumber = `${building.code}${unit.unitNumber}`;
            }
          }
        }
      }

      return {
        ...unit,
        typeLabel: unit.unitType,
        projectLabel,
        locationLabel,
        displayUnitNumber,
      };
    });
  }, [units, properties, cities, locale, isRtl]);

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (row) =>
        (row.displayUnitNumber || "").toLowerCase().includes(q) ||
        (row.unitNumber || "").toLowerCase().includes(q) ||
        (row.typeLabel || "").toLowerCase().includes(q) ||
        (row.projectLabel || "").toLowerCase().includes(q) ||
        (row.locationLabel || "").toLowerCase().includes(q)
    );
  }, [localized, queryStr]);

  const viewUnit = localized.find((item) => item.id === viewUnitId) || null;
  const availableCount = units.filter((row) => row.status === "available").length;
  const independentCount = units.filter(
    (row) => !row.projectId || row.projectId === INDEPENDENT_PROJECT_ID
  ).length;
  const totalViews = units.reduce((sum, row) => sum + (row.views || 0), 0);

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "numberType",
      header: t("admin.units.numberType") || (isRtl ? "الوحدة" : "Unit"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.images && row.images.length > 0 ? (
              <img src={row.images[0]} alt={row.unitNumber} className="h-full w-full object-cover" />
            ) : (
              row.unitNumber ? row.unitNumber.slice(0, 1) : "-"
            )}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold">{row.displayUnitNumber}</span>
            <span className="text-xs text-[#6B7280]">{row.typeLabel}</span>
          </div>
        </div>
      ),
    },
    {
      id: "project",
      header: t("admin.units.project") || (isRtl ? "المشروع التابع" : "Project"),
      cell: (row) => <span className="font-medium text-[#0a0f1d]">{row.projectLabel}</span>,
    },
    {
      id: "location",
      header: t("admin.units.locationBuilding") || (isRtl ? "الموقع / المبنى" : "Location"),
      cell: (row) => <span className="text-[#6B7280]">{row.locationLabel}</span>,
    },
    {
      id: "price",
      header: t("admin.units.price") || (isRtl ? "السعر" : "Price"),
      cell: (row) => (
        <span className="tabular-nums font-semibold">{unitSellingPrice(row).toLocaleString()} ر.س</span>
      ),
    },
    {
      id: "views",
      header: isRtl ? "المشاهدات" : "Views",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[#6B7280]">
          <Eye className="h-4 w-4" />
          <span className="tabular-nums">{row.views?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.units.status") || (isRtl ? "الحالة" : "Status"),
      cell: (row) => (
        <StatusBadge tone={row.status === "available" ? "success" : "muted"}>
          {UNIT_STATUS_LABELS[row.status] || row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard icon={Key} label={isRtl ? "إجمالي الوحدات" : "Total units"} value={units.length} />
        <StatCard icon={CircleCheck} label={isRtl ? "الوحدات المتاحة" : "Available units"} value={availableCount} />
        <StatCard icon={Building2} label={isRtl ? "وحدات مستقلة" : "Independent units"} value={independentCount} />
        <StatCard icon={Eye} label={isRtl ? "المشاهدات" : "Views"} value={totalViews} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={isRtl ? "لا توجد وحدات مضافة بعد." : "No units have been added yet."}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={isRtl ? "البحث في الوحدات..." : "Search units..."}
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
            onClick={() => setViewUnitId(row.id)}
          />
        )}
      />

      <ViewUnitModal isOpen={Boolean(viewUnit)} onClose={() => setViewUnitId(null)} unit={viewUnit} />
    </div>
  );
}
