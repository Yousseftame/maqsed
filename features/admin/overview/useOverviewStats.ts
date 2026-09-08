"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import {
  requestsService,
  type ContactRequest,
  type SellRequest,
  type SalesRequest,
  type RequestStatus,
} from "@/features/admin/customers/requests.service";
import { usersService } from "@/features/auth/users.service";
import { offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { paymentsFromOffers } from "@/features/admin/payments/payments.service";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import type { UserData } from "@/types/user";

export type InquiryRange = 7 | 30 | 90;

export type OverviewInquiry = {
  id: string;
  name: string;
  detail: string;
  status: "new" | "pending" | "closed";
  createdAt: Date;
};

const PROJECT_STATUS_META = [
  { id: "active", match: ["active"], color: "#0a0f1d", labelKey: "admin.projects.statuses.active" },
  { id: "upcoming", match: ["soon", "upcoming"], color: "#6B7280", labelKey: "admin.projects.statuses.upcoming" },
  { id: "draft", match: ["draft"], color: "#C5C7CC", labelKey: "admin.projects.statuses.draft" },
  { id: "soldOut", match: ["soldOut"], color: "#83BF6E", labelKey: "admin.projects.statuses.soldOut" },
] as const;

const TEAM_META = [
  { id: "admins", match: ["admin", "superAdmin"], color: "#0a0f1d", labelKey: "admin.analytics.admins" },
  { id: "developers", match: ["developer"], color: "#17C3B3", labelKey: "admin.analytics.developers" },
] as const;

const REQUEST_TYPE_META = [
  { id: "contact", color: "#0a0f1d", labelKey: "admin.analytics.contactRequests" },
  { id: "sell", color: "#17C3B3", labelKey: "admin.analytics.sellRequests" },
  { id: "sales", color: "#83BF6E", labelKey: "admin.analytics.salesRequests" },
] as const;

const UNIT_TYPES = [
  { id: "apartment", icon: "apartment", value: "شقة سكنية" },
  { id: "villa", icon: "villa", value: "فيلا" },
  { id: "building", icon: "building", value: "عمارة" },
  { id: "duplex", icon: "duplex", value: "دوبلكس" },
  { id: "townhouse", icon: "townhouse", value: "منزل متعدد الطوابق TownHouse" },
] as const;

const UNIT_TYPE_MATCH_ORDER = [
  { id: "townhouse", tokens: ["townhouse", "تاون", "متعدد الطوابق"] },
  { id: "duplex", tokens: ["دوبلكس", "مزدوجة", "duplex"] },
  { id: "villa", tokens: ["فيلا"] },
  { id: "building", tokens: ["عمارة"] },
  { id: "apartment", tokens: ["شقة", "بنتهاوس", "بنت هاوس", "penthouse"] },
] as const;

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(value as string | number);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function mapRequestStatus(status: RequestStatus): OverviewInquiry["status"] {
  if (status === "new") return "new";
  if (status === "contacted") return "pending";
  return "closed";
}

function classifyUnitType(unitType: string): string {
  const value = unitType.trim();
  if (!value) return "other";
  const exact = UNIT_TYPES.find((type) => type.value === value);
  if (exact) return exact.id;
  const lower = value.toLowerCase();
  for (const type of UNIT_TYPE_MATCH_ORDER) {
    if (type.tokens.some((token) => lower.includes(token.toLowerCase()))) return type.id;
  }
  return "other";
}

function unitPrice(unit: Unit) {
  const value = Number(unit.price);
  return Number.isFinite(value) ? value : 0;
}

function isIndependentUnit(unit: Unit) {
  return !unit.projectId || unit.projectId === "independent";
}

function unitLocation(unit: Unit, propertiesById: Map<string, Property>) {
  if (unit.projectId && unit.projectId !== "independent") {
    const property = propertiesById.get(unit.projectId);
    return {
      cityId: property?.cityId || "",
      neighborhoodId: property?.neighborhoodId || "",
    };
  }
  return {
    cityId: unit.cityId || "",
    neighborhoodId: unit.neighborhoodId || "",
  };
}

function named(city: City | undefined, locale: Locale, fallback: string) {
  if (!city) return fallback;
  return locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar;
}

function neighborhoodName(city: City | undefined, neighborhoodId: string, locale: Locale) {
  const neighborhood = city?.neighborhoods?.find((item) => item.id === neighborhoodId);
  if (!neighborhood) return neighborhoodId;
  return locale === "ar" ? neighborhood.name.ar || neighborhood.name.en : neighborhood.name.en || neighborhood.name.ar;
}

function formatRelativeTime(date: Date, locale: Locale) {
  const mins = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (mins < 1) return locale === "ar" ? "الآن" : "Just now";
  if (mins < 60) return locale === "ar" ? `قبل ${mins} دقيقة` : `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return locale === "ar" ? `قبل ${hours} ساعة` : `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return locale === "ar" ? "أمس" : "Yesterday";
  return locale === "ar" ? `قبل ${days} أيام` : `${days} days ago`;
}

function formatBucketLabel(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function collectInquiryDates(
  contact: ContactRequest[],
  sell: SellRequest[],
  sales: SalesRequest[]
): Date[] {
  return [...contact, ...sell, ...sales]
    .map((item) => toDate(item.createdAt))
    .filter((item): item is Date => Boolean(item));
}

function buildInquirySeries(
  dates: Date[],
  range: InquiryRange,
  locale: Locale,
  weekdayLabel: (key: (typeof WEEKDAY_KEYS)[number]) => string
) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - (range - 1));
  start.setHours(0, 0, 0, 0);

  if (range === 7) {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = WEEKDAY_KEYS[day.getDay()];
      const value = dates.filter((date) => {
        return date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth() && date.getDate() === day.getDate();
      }).length;
      return { label: weekdayLabel(key), value };
    });
  }

  const bucketCount = 6;
  const span = end.getTime() - start.getTime();
  const size = span / bucketCount;

  return Array.from({ length: bucketCount }, (_, index) => {
    const from = new Date(start.getTime() + index * size);
    const to = new Date(index === bucketCount - 1 ? end.getTime() + 1 : start.getTime() + (index + 1) * size);
    const value = dates.filter((date) => date >= from && date < to).length;
    return { label: formatBucketLabel(from, locale), value };
  });
}

function collectRecentInquiries(
  contact: ContactRequest[],
  sell: SellRequest[],
  sales: SalesRequest[]
): OverviewInquiry[] {
  const rows: OverviewInquiry[] = [
    ...contact.map((item) => ({
      id: `contact-${item.id}`,
      name: item.fullName || "",
      detail: item.subject || item.email || "",
      status: mapRequestStatus(item.status),
      createdAt: toDate(item.createdAt) || new Date(0),
    })),
    ...sell.map((item) => ({
      id: `sell-${item.id}`,
      name: item.fullNameAlt || "",
      detail: [item.city, item.unitLocation].filter(Boolean).join(" · "),
      status: mapRequestStatus(item.status),
      createdAt: toDate(item.createdAt) || new Date(0),
    })),
    ...sales.map((item) => ({
      id: `sales-${item.id}`,
      name: item.fullName || "",
      detail: item.projectName || item.unitNumber || "",
      status: mapRequestStatus(item.status),
      createdAt: toDate(item.createdAt) || new Date(0),
    })),
  ];

  return rows
    .filter((item) => item.name.trim())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
}

export function useOverviewStats(inquiryRange: InquiryRange) {
  const { locale, t } = useLocale();

  const results = useQueries({
    queries: [
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["units"], queryFn: () => unitsService.getUnits() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
      { queryKey: ["contactRequests"], queryFn: () => requestsService.getContactRequests() },
      { queryKey: ["sellRequests"], queryFn: () => requestsService.getSellRequests() },
      { queryKey: ["salesRequests"], queryFn: () => requestsService.getSalesRequests() },
      {
        queryKey: ["users", "overview-team"],
        queryFn: () => usersService.getUsersByRoles(["admin", "superAdmin", "developer"]),
      },
      { queryKey: ["offers"], queryFn: () => offersService.getOffers() },
    ],
  });

  const [properties, units, cities, contactRequests, sellRequests, salesRequests, teamUsers, offers] = [
    (results[0].data || []) as Property[],
    (results[1].data || []) as Unit[],
    (results[2].data || []) as City[],
    (results[3].data || []) as ContactRequest[],
    (results[4].data || []) as SellRequest[],
    (results[5].data || []) as SalesRequest[],
    (results[6].data || []) as UserData[],
    (results[7].data || []) as OfferData[],
  ];

  const payments = paymentsFromOffers(offers);

  const isPending = results.some((item) => item.isPending);
  const isRefetching = results.some((item) => item.isRefetching);

  const refetch = () => Promise.all(results.map((item) => item.refetch()));

  const stats = useMemo(() => {
    const propertiesById = new Map(properties.map((item) => [item.id, item]));
    const citiesById = new Map(cities.map((item) => [item.id, item]));

    const availableUnits = units.filter((unit) => unit.status === "available");
    const availableCount = availableUnits.length;
    const soldOrRented = units.filter((unit) => unit.status && unit.status !== "available").length;
    const marketValue = availableUnits.reduce((sum, unit) => sum + unitPrice(unit), 0);
    const requestsCount = contactRequests.length + sellRequests.length + salesRequests.length;

    const typeCounts = new Map<string, number>();
    for (const unit of units) {
      const key = classifyUnitType(unit.unitType || "");
      typeCounts.set(key, (typeCounts.get(key) || 0) + 1);
    }

    const distribution = UNIT_TYPES.map((type) => ({
      id: type.id,
      label: t(`admin.analytics.unitTypes.${type.id}`),
      value: typeCounts.get(type.id) || 0,
      icon: type.icon,
    }));

    const cityCounts = new Map<string, number>();
    const neighborhoodCounts = new Map<string, { name: string; value: number }>();

    for (const unit of units) {
      const place = unitLocation(unit, propertiesById);
      if (place.cityId) {
        cityCounts.set(place.cityId, (cityCounts.get(place.cityId) || 0) + 1);
      }
      if (place.neighborhoodId) {
        const key = `${place.cityId}:${place.neighborhoodId}`;
        const city = citiesById.get(place.cityId);
        const name = neighborhoodName(city, place.neighborhoodId, locale) || place.neighborhoodId;
        const current = neighborhoodCounts.get(key);
        neighborhoodCounts.set(key, { name, value: (current?.value || 0) + 1 });
      }
    }

    const byCity = [...cityCounts.entries()]
      .map(([id, value]) => ({
        id,
        name: named(citiesById.get(id), locale, id),
        value,
      }))
      .sort((a, b) => b.value - a.value);

    const byNeighborhood = [...neighborhoodCounts.entries()]
      .map(([id, item]) => ({ id, name: item.name, value: item.value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const projectStatus = PROJECT_STATUS_META.map((item) => ({
      id: item.id,
      color: item.color,
      label: t(item.labelKey),
      value: properties.filter((property) => (item.match as readonly string[]).includes(property.status)).length,
    }));

    const team = TEAM_META.map((item) => ({
      id: item.id,
      color: item.color,
      label: t(item.labelKey),
      value: teamUsers.filter((user) => (item.match as readonly string[]).includes(user.role)).length,
    }));

    const requestCounts = {
      contact: contactRequests.length,
      sell: sellRequests.length,
      sales: salesRequests.length,
    };

    const requestTypes = REQUEST_TYPE_META.map((item) => ({
      id: item.id,
      color: item.color,
      label: t(item.labelKey),
      value: requestCounts[item.id],
    }));

    const independentUnits = units.filter(isIndependentUnit).length;
    const projectUnits = units.length - independentUnits;
    const unitAffiliation = [
      {
        id: "independent",
        color: "#0a0f1d",
        label: t("admin.analytics.independentUnits"),
        value: independentUnits,
      },
      {
        id: "project",
        color: "#17C3B3",
        label: t("admin.analytics.projectUnits"),
        value: projectUnits,
      },
    ];

    const inquiryDates = collectInquiryDates(contactRequests, sellRequests, salesRequests);
    const traffic = buildInquirySeries(inquiryDates, inquiryRange, locale, (key) =>
      t(`admin.analytics.days.${key}`)
    );

    const recent = collectRecentInquiries(contactRequests, sellRequests, salesRequests).map((item) => ({
      ...item,
      time: formatRelativeTime(item.createdAt, locale),
    }));

    const recentPayments = payments.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title || item.offerNumber || "",
      offerNumber: item.offerNumber || "",
      developerName: item.developerName || "",
      projectName: item.projectName || "",
      amount: Number(item.amount) || 0,
      time: formatRelativeTime(toDate(item.createdAt) || new Date(0), locale),
    }));

    const salesTotal = payments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const projectViews = properties.reduce((sum, item) => sum + (Number(item.views) || 0), 0);
    const unitViews = units.reduce((sum, item) => sum + (Number(item.views) || 0), 0);

    const independentLabel = t("admin.analytics.independentUnit");
    const unnamedUnit = t("admin.analytics.noUnitNumber");

    const topUnits = [...units]
      .sort((a, b) => unitPrice(b) - unitPrice(a))
      .slice(0, 5)
      .map((unit) => {
        const independent = isIndependentUnit(unit);
        const property = independent ? undefined : propertiesById.get(unit.projectId);
        return {
          id: unit.id,
          name: unit.unitNumber?.trim() || unnamedUnit,
          type: unit.unitType || "",
          project: independent ? independentLabel : property?.name || unit.projectId,
          price: unitPrice(unit),
        };
      });

    return {
      projects: properties.length,
      units: units.length,
      requests: requestsCount,
      available: availableCount,
      soldOrRented,
      marketValue,
      distribution,
      citiesCount: cities.length,
      neighborhoodsCount: cities.reduce((sum, city) => sum + (city.neighborhoods?.length || 0), 0),
      byCity,
      byNeighborhood,
      projectStatus,
      statusTotal: properties.length,
      team,
      teamTotal: teamUsers.length,
      requestTypes,
      independentUnits,
      projectUnits,
      unitAffiliation,
      traffic,
      recent,
      salesTotal,
      recentPayments,
      topUnits,
      projectViews,
      unitViews,
      visits: projectViews + unitViews,
    };
  }, [
    properties,
    units,
    cities,
    contactRequests,
    sellRequests,
    salesRequests,
    teamUsers,
    offers,
    inquiryRange,
    locale,
    t,
  ]);

  return { ...stats, isPending, isRefetching, refetch };
}
