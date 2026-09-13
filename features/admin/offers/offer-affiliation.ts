import type { Property } from "@/features/admin/projects/properties.service";
import type { Unit } from "@/features/admin/units/units.service";
import type { OfferData } from "@/features/admin/offers/offers.service";

export const INDEPENDENT_PROJECT_ID = "independent";

export function independentProjectLabel(isRtl: boolean) {
  return isRtl ? "مشروع مستقل" : "Independent project";
}

export function unitDisplayNumber(unit: Unit, properties: Property[]): string {
  if (unit.projectId && unit.projectId !== INDEPENDENT_PROJECT_ID) {
    const project = properties.find((item) => item.id === unit.projectId);
    const building = project?.buildings?.find((item) => item.id === unit.buildingId);
    if (building?.code && unit.unitNumber) {
      return `${building.code}${unit.unitNumber}`;
    }
  }
  return unit.unitNumber?.trim() || unit.id;
}

export function unitsForProject(units: Unit[], projectId: string): Unit[] {
  if (!projectId) return [];
  const filtered =
    projectId === INDEPENDENT_PROJECT_ID
      ? units.filter((unit) => !unit.projectId || unit.projectId === INDEPENDENT_PROJECT_ID)
      : units.filter((unit) => unit.projectId === projectId);

  return [...filtered].sort((a, b) =>
    String(a.unitNumber || "").localeCompare(String(b.unitNumber || ""), "ar", { numeric: true })
  );
}

export function resolveProjectId(
  offer: Pick<OfferData, "projectId" | "projectName">,
  properties: Property[],
  isRtl: boolean
): string {
  if (offer.projectId) return offer.projectId;
  const name = (offer.projectName || "").trim();
  if (!name) return "";
  if (name === independentProjectLabel(true) || name === independentProjectLabel(false)) {
    return INDEPENDENT_PROJECT_ID;
  }
  return properties.find((item) => item.name === name)?.id || "";
}

export function resolveUnitId(
  offer: Pick<OfferData, "unitId" | "unitNumber" | "projectId" | "projectName">,
  units: Unit[],
  properties: Property[],
  isRtl: boolean
): string {
  if (offer.unitId) return offer.unitId;
  const label = (offer.unitNumber || "").trim();
  if (!label) return "";
  const projectId = resolveProjectId(offer, properties, isRtl);
  return (
    unitsForProject(units, projectId).find(
      (unit) => unitDisplayNumber(unit, properties) === label || unit.unitNumber === label
    )?.id || ""
  );
}

export function projectNameFromId(projectId: string, properties: Property[], _isRtl?: boolean): string {
  if (!projectId) return "";
  if (projectId === INDEPENDENT_PROJECT_ID) return independentProjectLabel(true);
  return properties.find((item) => item.id === projectId)?.name || "";
}
