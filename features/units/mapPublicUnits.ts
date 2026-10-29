import type { Property } from "@/features/admin/projects/properties.service";
import type { Unit } from "@/features/admin/units/units.service";
import type { City } from "@/features/admin/cities/data";
import type { UnitListing } from "@/features/units/data/units";
import type { Locale } from "@/lib/i18n/types";

export type MappedPublicUnit = {
  listing: UnitListing;
  projectName: string;
  cityId: string;
  neighborhoodId: string;
  unitType: string;
};

function named(city: City | undefined, locale: Locale) {
  if (!city) return "";
  return locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar;
}

function neighborhoodLabel(city: City | undefined, neighborhoodId: string | undefined, locale: Locale) {
  if (!city || !neighborhoodId) return "";
  const neighborhood = city.neighborhoods?.find((item) => item.id === neighborhoodId);
  if (!neighborhood) return "";
  return locale === "ar" ? neighborhood.name.ar || neighborhood.name.en : neighborhood.name.en || neighborhood.name.ar;
}

export function isPublicProject(status: string | undefined) {
  const value = String(status || "").toLowerCase().replace(/\s+/g, "");
  return value === "active" || value === "soon" || value === "upcoming" || value === "soldout";
}

function displayUnitNumber(unit: Unit, property: Property | undefined) {
  const local = String(unit.unitNumber || "").trim();
  if (!local) return unit.id;
  const building = property?.buildings?.find((item) => item.id === unit.buildingId);
  const code = String(building?.code || "").trim();
  if (!code) return local;
  if (local.toUpperCase().startsWith(code.toUpperCase())) return local;
  return `${code}${local}`;
}

function unitImage(unit: Unit) {
  const images = unit.images as unknown;
  if (!Array.isArray(images)) return "";
  for (const item of images) {
    if (typeof item === "string" && item.trim() && !item.startsWith("blob:")) return item.trim();
    if (item && typeof item === "object") {
      const record = item as { url?: string; preview?: string; src?: string };
      const url = record.url || record.preview || record.src || "";
      if (url.trim() && !url.startsWith("blob:")) return url.trim();
    }
  }
  return "";
}

export function mapPublicUnits(
  units: Unit[],
  properties: Property[],
  cities: City[],
  locale: Locale,
  isRtl: boolean,
  label: (value: string) => string
): MappedPublicUnit[] {
  const propertiesById = new Map(properties.map((property) => [property.id, property]));
  const citiesById = new Map(cities.map((city) => [city.id, city]));

  return units.flatMap((unit) => {
    const independent = unit.projectId === "independent";
    const property = independent ? undefined : propertiesById.get(unit.projectId);
    if (!independent && (!property || !isPublicProject(property.status))) return [];

    const cityId = independent ? unit.cityId || "" : property?.cityId || "";
    const neighborhoodId = independent ? unit.neighborhoodId || "" : property?.neighborhoodId || "";
    const city = citiesById.get(cityId);
    const area = neighborhoodLabel(city, neighborhoodId, locale);
    const cityName = named(city, locale);
    const location = [area, cityName].filter(Boolean).join(isRtl ? "، " : ", ");
    const available = unit.status === "available";
    const typeLabel = label(unit.unitType) || unit.unitType?.trim() || "";
    const number = displayUnitNumber(unit, property);
    const image = unitImage(unit);
    const originalPrice = Number(unit.price) || 0;
    const price = originalPrice > 0 ? originalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "";
    const model = unit.modelId ? property?.models?.find((item) => item.id === unit.modelId) : undefined;
    const internalArea = Number(unit.internalArea ?? model?.internalArea) || 0;
    const externalArea = Number(unit.externalArea ?? model?.externalArea) || 0;
    const totalArea = Number(unit.totalArea) || Number(model?.totalArea) || (internalArea + externalArea) || 0;
    const projectName = property?.name?.trim() || "";

    const listing: UnitListing = {
      id: number,
      pathId: unit.id,
      slug: unit.slug,
      typeAr: typeLabel,
      typeEn: typeLabel,
      beds: Number(unit.roomsCount) || 0,
      baths: Number(unit.bathroomsCount) || 0,
      sqft: totalArea,
      internalArea,
      externalArea,
      price,
      statusAr: available ? "متاح" : "مباع",
      statusEn: available ? "Available" : "Sold",
      gallery: image ? [image] : [],
      descriptionAr: "",
      descriptionEn: "",
      locationEn: location,
      locationAr: location,
      relation: independent ? "Standalone" : "Property",
      affiliationAr: independent ? "وحدة مستقلة" : projectName ? `تابعة لمشروع ${projectName}` : "",
      affiliationEn: independent ? "Independent unit" : projectName ? `Part of ${projectName}` : "",
      views: Number(unit.views) || 0,
      priceValue: originalPrice,
      discountActive: Boolean(unit.discountActive),
      discountPercentage: Number(unit.discountPercentage) || 0,
      discountDays: Number(unit.discountDays) || 0,
      discountStartedAt: unit.discountStartedAt,
      featured: Boolean(unit.featured),
    };

    return [{ listing, projectName, cityId, neighborhoodId, unitType: unit.unitType?.trim() || typeLabel }];
  });
}
