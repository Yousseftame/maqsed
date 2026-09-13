"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { INDEPENDENT_PROJECT_ID, independentProjectLabel } from "@/features/admin/offers/offer-affiliation";
import { offerFinancials, offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

export const ALL_PROJECTS_FILTER = "all";
const UNIT_FILTER_PREFIX = "unit:";

function isIndependentProject(projectId?: string) {
  return !projectId || projectId === INDEPENDENT_PROJECT_ID;
}

function unitFilterId(unitId: string) {
  return `${UNIT_FILTER_PREFIX}${unitId}`;
}

function selectedUnitId(filter: string) {
  return filter.startsWith(UNIT_FILTER_PREFIX) ? filter.slice(UNIT_FILTER_PREFIX.length) : "";
}

function independentUnitLabel(unit: Unit, isRtl: boolean) {
  const number = String(unit.unitNumber || "").trim();
  if (number) return isRtl ? `وحدة مستقلة ${number}` : `Independent unit ${number}`;
  return unit.unitType || (isRtl ? "وحدة مستقلة" : "Independent unit");
}

function matchesUnitFilter(unit: Unit, filter: string) {
  if (filter === ALL_PROJECTS_FILTER) return true;
  const unitId = selectedUnitId(filter);
  if (unitId) return unit.id === unitId;
  if (filter === INDEPENDENT_PROJECT_ID) return isIndependentProject(unit.projectId);
  return unit.projectId === filter;
}

function matchesOfferFilter(offer: OfferData, filter: string) {
  if (filter === ALL_PROJECTS_FILTER) return true;
  const unitId = selectedUnitId(filter);
  if (unitId) return String(offer.unitId || "") === unitId;
  if (filter === INDEPENDENT_PROJECT_ID) return isIndependentProject(offer.projectId);
  return offer.projectId === filter;
}

export function useDeveloperDashboard() {
  const { isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const isDeveloper = userData?.role === "developer";
  const independentLabel = independentProjectLabel(isRtl);
  const [filter, setFilter] = useState(ALL_PROJECTS_FILTER);

  const propertiesQuery = useQuery({
    queryKey: ["properties", "developer", ownerUid],
    queryFn: () => propertiesService.getPropertiesByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const unitsQuery = useQuery({
    queryKey: ["units", "developer", ownerUid],
    queryFn: () => unitsService.getUnitsByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const offersQuery = useQuery({
    queryKey: ["offers", "developer", ownerUid],
    queryFn: () => offersService.getOffersByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const employeesQuery = useQuery({
    queryKey: ["employees", ownerUid],
    queryFn: () => usersService.getEmployeesByDeveloper(ownerUid),
    enabled: Boolean(ownerUid) && isDeveloper,
  });

  const properties = propertiesQuery.data || [];
  const units = unitsQuery.data || [];
  const offers = offersQuery.data || [];
  const employees = employeesQuery.data || [];
  const queries = [propertiesQuery, unitsQuery, offersQuery, employeesQuery];
  const isRefetching = queries.some((item) => item.isRefetching);
  const refetch = () => Promise.all(queries.map((item) => item.refetch()));

  const independentUnits = useMemo(
    () =>
      units
        .filter((unit) => isIndependentProject(unit.projectId))
        .sort((a, b) =>
          String(a.unitNumber || "").localeCompare(String(b.unitNumber || ""), "ar", { numeric: true })
        ),
    [units]
  );

  const filters = useMemo(() => {
    const items = [
      { id: ALL_PROJECTS_FILTER, label: isRtl ? "كل المشاريع" : "All projects" },
      ...properties.map((property) => ({ id: property.id, label: property.name })),
    ];
    if (independentUnits.length > 0) {
      items.push({ id: INDEPENDENT_PROJECT_ID, label: isRtl ? "وحدات مستقلة" : "Independent units" });
      for (const unit of independentUnits) {
        items.push({ id: unitFilterId(unit.id), label: independentUnitLabel(unit, isRtl) });
      }
    }
    return items;
  }, [properties, independentUnits, isRtl]);

  useEffect(() => {
    if (!filters.some((item) => item.id === filter)) {
      setFilter(ALL_PROJECTS_FILTER);
    }
  }, [filter, filters]);

  const scopedProperties = useMemo(
    () => (filter === ALL_PROJECTS_FILTER ? properties : properties.filter((property) => property.id === filter)),
    [properties, filter]
  );

  const scopedUnits = useMemo(
    () => units.filter((unit) => matchesUnitFilter(unit, filter)),
    [units, filter]
  );

  const scopedOffers = useMemo(
    () => offers.filter((offer) => matchesOfferFilter(offer, filter)),
    [offers, filter]
  );

  const stats = useMemo(
    () =>
      buildDashboardStats({
        properties: scopedProperties,
        allProperties: properties,
        units: scopedUnits,
        offers: scopedOffers,
        employeeCount: employees.length,
        independentLabel:
          selectedUnitId(filter) && scopedUnits[0]
            ? independentUnitLabel(scopedUnits[0], isRtl)
            : independentLabel,
        isRtl,
      }),
    [scopedProperties, properties, scopedUnits, scopedOffers, employees.length, independentLabel, isRtl, filter]
  );

  return {
    filter,
    setFilter,
    filters,
    isDeveloper,
    isRtl,
    stats,
    isRefetching,
    refetch,
    ownerUid,
  };
}

function projectName(
  projectId: string | undefined,
  properties: Property[],
  fallback: string,
  independentLabel: string
) {
  if (isIndependentProject(projectId)) return independentLabel;
  return properties.find((property) => property.id === projectId)?.name || fallback || independentLabel;
}

function buildDashboardStats({
  properties,
  allProperties,
  units,
  offers,
  employeeCount,
  independentLabel,
  isRtl,
}: {
  properties: Property[];
  allProperties: Property[];
  units: Unit[];
  offers: OfferData[];
  employeeCount: number;
  independentLabel: string;
  isRtl: boolean;
}) {
  const availableUnits = units.filter((unit) => unit.status === "available").length;
  const unavailableUnits = units.length - availableUnits;

  let invoiceTotal = 0;
  let invoiceSubtotal = 0;
  let invoiceVat = 0;
  let paidTotal = 0;
  let unpaidTotal = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  const invoicesByProject = new Map<string, { name: string; value: number }>();
  for (const offer of offers) {
    const { subtotal, vat, total } = offerFinancials(offer);
    invoiceSubtotal += subtotal;
    invoiceVat += vat;
    invoiceTotal += total;
    if (offer.paymentStatus === "received") {
      paidTotal += total;
      paidCount += 1;
    } else {
      unpaidTotal += total;
      unpaidCount += 1;
    }
    const key = isIndependentProject(offer.projectId) ? INDEPENDENT_PROJECT_ID : String(offer.projectId || INDEPENDENT_PROJECT_ID);
    const current = invoicesByProject.get(key) || {
      name: projectName(offer.projectId, allProperties, offer.projectName, independentLabel),
      value: 0,
    };
    current.value += total;
    invoicesByProject.set(key, current);
  }

  const viewsByProject = new Map<string, { name: string; value: number }>();
  for (const property of properties) {
    viewsByProject.set(property.id, {
      name: property.name,
      value: Number(property.views) || 0,
    });
  }
  for (const unit of units) {
    const key = isIndependentProject(unit.projectId) ? INDEPENDENT_PROJECT_ID : String(unit.projectId);
    const current = viewsByProject.get(key) || {
      name: projectName(unit.projectId, allProperties, "", independentLabel),
      value: 0,
    };
    current.value += Number(unit.views) || 0;
    viewsByProject.set(key, current);
  }

  const collectionRate = invoiceTotal > 0 ? (paidTotal / invoiceTotal) * 100 : 0;

  return {
    projectCount: properties.length,
    unitCount: units.length,
    availableUnits,
    unavailableUnits,
    invoiceCount: offers.length,
    fileCount: offers.length,
    userCount: employeeCount,
    invoiceSubtotal,
    invoiceVat,
    invoiceTotal,
    paidTotal,
    unpaidTotal,
    paidCount,
    unpaidCount,
    collectionRate,
    viewsTotal: [...viewsByProject.values()].reduce((sum, item) => sum + item.value, 0),
    viewsByProject: [...viewsByProject.values()].sort((a, b) => b.value - a.value).slice(0, 8),
    invoicesByProject: [...invoicesByProject.values()].sort((a, b) => b.value - a.value).slice(0, 8),
    unitStatus: [
      { id: "available", label: isRtl ? "متاحة" : "Available", value: availableUnits, color: "#0a0f1d" },
      { id: "unavailable", label: isRtl ? "غير متاحة" : "Unavailable", value: unavailableUnits, color: "#17C3B3" },
    ],
    invoiceStatus: [
      { id: "paid", label: isRtl ? "مدفوع" : "Paid", value: paidTotal, color: "#0a0f1d" },
      { id: "unpaid", label: isRtl ? "غير مدفوع" : "Unpaid", value: unpaidTotal, color: "#17C3B3" },
    ],
  };
}

export type DeveloperDashboardStats = ReturnType<typeof buildDashboardStats>;
