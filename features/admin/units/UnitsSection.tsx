"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Building2, CircleCheck, Eye, Key, Plus, Search, ChevronDown, RefreshCw, Copy } from "lucide-react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { propertiesService } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { AddUnitModal } from "./AddUnitModal";
import { EditUnitModal } from "./EditUnitModal";
import { ViewUnitModal } from "./ViewUnitModal";
import toast from "react-hot-toast";

const UNIT_STATUS_LABELS: Record<string, string> = {
  available: "متاحة",
  unavailable: "مباعة/مؤجرة",
};

const UNIT_STATUS_TONE: Record<string, "success" | "neutral" | "warning" | "danger" | "primary"> = {
  available: "success",
  unavailable: "neutral",
};

export function UnitsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [queryStr, setQueryStr] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copyUnitData, setCopyUnitData] = useState<any | null>(null);
  const [viewUnitId, setViewUnitId] = useState<string | null>(null);
  const [editUnitId, setEditUnitId] = useState<string | null>(null);

  const handleCopyUnit = (row: any) => {
    setCopyUnitData(row);
    setIsAddModalOpen(true);
  };

  const { data: units = [], refetch, isRefetching } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsService.getUnits(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertiesService.getProperties(),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const localized = useMemo(() => {
    return units.map((unit) => {
      let projectLabel = "وحدة مستقلة";
      let locationLabel = "-";
      let displayUnitNumber = unit.unitNumber || "بدون رقم";

      if (unit.projectId === "independent") {
        const city = cities.find(c => c.id === unit.cityId);
        const neighborhood = city?.neighborhoods.find(n => n.id === unit.neighborhoodId);
        if (city && neighborhood) {
          locationLabel = `${city.name[locale]} - ${neighborhood.name[locale]}`;
        }
      } else {
        const project = properties.find(p => p.id === unit.projectId);
        if (project) {
          projectLabel = project.name;
          const building = project.buildings?.find(b => b.id === unit.buildingId);
          if (building) {
            locationLabel = `مبنى ${building.code}`;
            if (unit.unitNumber) {
              displayUnitNumber = `${building.code}${unit.unitNumber}`;
            }
          }
        }
      }

      let modelInternalArea: number | null = null;
      let modelExternalArea: number | null = null;

      if (unit.projectId !== "independent" && unit.modelId) {
        const project = properties.find(p => p.id === unit.projectId);
        const model = project?.models?.find((m: any) => m.id === unit.modelId);
        if (model) {
          if (model.internalArea) modelInternalArea = model.internalArea;
          if (model.externalArea) modelExternalArea = model.externalArea;
        }
      }

      return {
        ...unit,
        typeLabel: unit.unitType,
        projectLabel,
        locationLabel,
        displayUnitNumber,
        modelInternalArea,
        modelExternalArea,
      };
    });
  }, [units, properties, cities, locale]);

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

  const totalViews = units.reduce((sum, row) => sum + (row.views || 0), 0);
  const activeCount = units.filter((row) => row.status === "available").length;
  const independentCount = units.filter((row) => row.projectId === "independent").length;

  const deleteMutation = useMutation({
    mutationFn: async (row: Unit) => {
      if (row.images && row.images.length > 0) {
        await Promise.all(row.images.map(url => unitsService.deleteImage(url)));
      }
      return unitsService.deleteUnit(row.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success(t("admin.ui.success") || "تم حذف الوحدة بنجاح");
    },
    onError: () => toast.error(t("admin.ui.error") || "حدث خطأ أثناء الحذف"),
  });

  async function handleDelete(row: Unit) {
    const ok = await confirm({
      title: t("admin.units.deleteTitle") || "حذف الوحدة",
      description: t("admin.units.deleteDescription") || "هل أنت متأكد من حذف هذه الوحدة؟ لا يمكن التراجع عن هذا الإجراء.",
      confirmLabel: t("admin.ui.delete") || "حذف",
      cancelLabel: t("admin.cancel") || "إلغاء",
      tone: "danger",
    });
    if (!ok) return;
    deleteMutation.mutate(row);
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => unitsService.updateUnit(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["units"] }),
    onError: () => toast.error(t("admin.ui.error") || "حدث خطأ أثناء التحديث"),
  });

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "numberType",
      header: t("admin.units.numberType") || "الوحدة",
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
      header: t("admin.units.project") || "المشروع التابع",
      cell: (row) => <span className="font-medium text-[#0a0f1d]">{row.projectLabel}</span>,
    },
    {
      id: "location",
      header: t("admin.units.locationBuilding") || "الموقع / المبنى",
      cell: (row) => <span className="text-[#6B7280]">{row.locationLabel}</span>,
    },
    {
      id: "price",
      header: t("admin.units.price") || "السعر",
      cell: (row) => <span className="tabular-nums font-semibold">{row.price.toLocaleString()} ر.س</span>,
    },
    {
      id: "views",
      header: "المشاهدات",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-[#6B7280]">
          <Eye className="h-4 w-4" />
          <span className="tabular-nums">{row.views?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.units.status") || "الحالة",
      cell: (row) => {
        const tone = UNIT_STATUS_TONE[row.status] || "neutral";
        return (
          <CustomStatusDropdown
            row={row}
            tone={tone}
            labels={UNIT_STATUS_LABELS}
            updateStatusMutation={updateStatusMutation}
          />
        );
      },
    },
  ];

  const viewUnit = localized.find((u) => u.id === viewUnitId) || null;
  const editUnit = units.find((u) => u.id === editUnitId) || null;

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard icon={Key} label={t("admin.units.total") || "إجمالي الوحدات"} value={units.length} />
        <StatCard icon={CircleCheck} label={t("admin.units.active") || "الوحدات المتاحة"} value={activeCount} />
        <StatCard icon={Building2} label={"وحدات مستقلة"} value={independentCount} />
        <StatCard icon={Eye} label={"المشاهدات"} value={totalViews} />
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
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={t("admin.units.search") || "البحث في الوحدات..."}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                {t("admin.units.add") || "إضافة وحدة"}
              </button>
            </div>
          </div>
        }
        actions={(row) => (
          <>
            <TableAction label={t("admin.ui.view")} onClick={() => setViewUnitId(row.id)} />
            <TableAction label={t("admin.ui.edit")} onClick={() => setEditUnitId(row.id)} />
            <TableAction label="نسخ" onClick={() => handleCopyUnit(row)} />
            <TableAction
              label={t("admin.ui.delete")}
              tone="danger"
              onClick={() => handleDelete(row)}
            />
          </>
        )}
      />

      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCopyUnitData(null);
        }}
        copyUnit={copyUnitData}
      />
      <EditUnitModal isOpen={!!editUnitId} onClose={() => setEditUnitId(null)} unit={editUnit} />
      <ViewUnitModal isOpen={!!viewUnitId} onClose={() => setViewUnitId(null)} unit={viewUnit} />
    </div>
  );
}

function CustomStatusDropdown({ row, tone, labels, updateStatusMutation }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY + 8,
          left: rect.right + window.scrollX,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={updateStatusMutation.isPending}
        className="flex items-center gap-1 transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        <StatusBadge tone={tone}>{labels[row.status] || row.status}</StatusBadge>
        <ChevronDown className="h-4 w-4 text-[#8c8c8c]" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div 
          ref={dropdownRef} 
          style={{ position: 'absolute', top: coords.top, left: coords.left, transform: 'translateX(-100%)' }}
          className="z-50 w-32 overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white shadow-xl"
        >
          <div className="flex flex-col py-1">
            {Object.entries(labels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  updateStatusMutation.mutate({ id: row.id, status: key });
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-right text-sm font-bold transition-colors hover:bg-[#F4F4F4] ${row.status === key ? "text-[#0a0f1d] bg-[#F4F4F4]" : "text-[#8c8c8c]"}`}
              >
                {label as React.ReactNode}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
