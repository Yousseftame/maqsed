"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Building2, CircleCheck, Folder, Map, Plus, Search, ChevronDown, RefreshCw } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { PROJECTS, PROJECT_STATUS_TONE, type Project } from "@/features/admin/projects/data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AddProjectModal } from "./AddProjectModal";
import { EditProjectModal } from "./EditProjectModal";
import { ViewProjectModal } from "./ViewProjectModal";
import { ManageBuildingsModal } from "./ManageBuildingsModal";
import { ManageModelsModal } from "./ManageModelsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService } from "@/features/admin/units/units.service";
import toast from "react-hot-toast";

export function ProjectsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  
  const [query, setQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewPropertyId, setViewPropertyId] = useState<string | null>(null);
  const [editPropertyId, setEditPropertyId] = useState<string | null>(null);
  const [manageBuildingsPropertyId, setManageBuildingsPropertyId] = useState<string | null>(null);
  const [manageModelsPropertyId, setManageModelsPropertyId] = useState<string | null>(null);

  const { data: properties = [], refetch, isRefetching } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertiesService.getProperties(),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const { data: units = [] } = useQuery({
    queryKey: ["units"],
    queryFn: () => unitsService.getUnits(),
  });

  const viewProperty = properties.find(p => p.id === viewPropertyId) || null;
  const editProperty = properties.find(p => p.id === editPropertyId) || null;
  const manageBuildingsProperty = properties.find(p => p.id === manageBuildingsPropertyId) || null;
  const manageModelsProperty = properties.find(p => p.id === manageModelsPropertyId) || null;

  const deleteMutation = useMutation({
    mutationFn: async (row: any) => {
      if (row.images && row.images.length > 0) {
        await Promise.all(row.images.map((url: string) => propertiesService.deleteImage(url)));
      }
      return propertiesService.deleteProperty(row.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(t("admin.ui.success") || "Deleted successfully");
    },
    onError: () => {
      toast.error(t("admin.ui.error") || "Error deleting");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => {
      return propertiesService.updateProperty(data.id, { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const localized = useMemo(() => {
    return properties.map((prop) => {
      const city = cities.find((c) => c.id === prop.cityId);
      const cityName = city?.name[locale] || prop.cityId;
      
      const date = prop.updatedAt?.toDate ? prop.updatedAt.toDate() : new Date();
      const updatedLabel = new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);

      const realUnitsCount = units.filter((u) => u.projectId === prop.id).length;

      return {
        ...prop,
        nameLabel: prop.name,
        cityLabel: cityName,
        updatedLabel,
        computedUnitsCount: realUnitsCount,
      };
    });
  }, [properties, cities, units, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localized;
    return localized.filter(
      (row) =>
        row.nameLabel.toLowerCase().includes(q) ||
        row.cityLabel.toLowerCase().includes(q)
    );
  }, [localized, query]);

  const totalUnits = localized.reduce((sum, row) => sum + row.computedUnitsCount, 0);
  const activeCount = properties.filter((row) => row.status === "active").length;
  const cityCount = new Set(properties.map((row) => row.cityId)).size;

  async function handleDelete(row: any) {
    const ok = await confirm({
      title: t("admin.projects.deleteTitle"),
      description: t("admin.projects.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    deleteMutation.mutate(row);
  }

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "name",
      header: t("admin.projects.name"),
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
      header: t("admin.projects.city"),
      cell: (row) => <span className="text-[#6B7280]">{row.cityLabel}</span>,
    },
    {
      id: "units",
      header: t("admin.projects.unitsCol"),
      cell: (row) => <span className="tabular-nums font-semibold">{row.computedUnitsCount}</span>,
    },
    {
      id: "status",
      header: t("admin.projects.status"),
      cell: (row) => {
        // Fallback tone mapping since it's dynamic
        const toneMap: Record<string, "success" | "warning" | "neutral" | "danger"> = {
          active: "success",
          soon: "warning",
          draft: "neutral",
          soldOut: "danger",
        };
        const tone = toneMap[row.status] || "neutral";
        
        const labels: Record<string, string> = {
          active: "نشط",
          soon: "قريباً",
          draft: "مسودة",
          soldOut: "مباع بالكامل",
        };
        
        return (
          <CustomStatusDropdown
            row={row}
            tone={tone}
            labels={labels}
            updateStatusMutation={updateStatusMutation}
          />
        );
      },
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
          value={properties.length}
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
                {t("admin.projects.add")}
              </button>
            </div>
          </div>
        }
        actions={(row) => (
          <>
            <TableAction label="المباني" onClick={() => setManageBuildingsPropertyId(row.id)} />
            <TableAction label="النماذج" onClick={() => setManageModelsPropertyId(row.id)} />
            <TableAction label={t("admin.ui.view")} onClick={() => setViewPropertyId(row.id)} />
            <TableAction label={t("admin.ui.edit")} onClick={() => setEditPropertyId(row.id)} />
            <TableAction
              label={t("admin.ui.delete")}
              tone="danger"
              onClick={() => handleDelete(row)}
            />
          </>
        )}
      />
      
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditProjectModal
        isOpen={!!editPropertyId}
        onClose={() => setEditPropertyId(null)}
        property={editProperty}
      />
      <ViewProjectModal
        isOpen={!!viewPropertyId}
        onClose={() => setViewPropertyId(null)}
        property={viewProperty}
        cities={cities}
      />
      <ManageBuildingsModal
        isOpen={!!manageBuildingsPropertyId}
        onClose={() => setManageBuildingsPropertyId(null)}
        property={manageBuildingsProperty}
      />
      <ManageModelsModal
        isOpen={!!manageModelsPropertyId}
        onClose={() => setManageModelsPropertyId(null)}
        property={manageModelsProperty}
      />
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
        // Since we are floating to the right, we anchor right side to the right side of the button
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
