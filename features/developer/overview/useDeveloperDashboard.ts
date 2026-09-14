"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import { offerFinancials, offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

export const ALL_OFFERS_FILTER = "__all__";

export type DeveloperDashboardFilter = {
  id: string;
  label: string;
  paid?: boolean;
};

function offerNumberLabel(offer: OfferData) {
  const number = String(offer.offerNumber || "").replace(/^#/, "").trim();
  if (number) return `#${number}`;
  const title = String(offer.title || "").trim();
  if (title) return title.length > 18 ? `${title.slice(0, 16)}…` : title;
  return `#${offer.id.slice(0, 6)}`;
}

export function useDeveloperDashboard() {
  const { isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const isDeveloper = userData?.role === "developer";
  const [filter, setFilter] = useState(ALL_OFFERS_FILTER);

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

  const offers = offersQuery.data || [];
  const employees = employeesQuery.data || [];
  const queries = [offersQuery, employeesQuery];
  const isRefetching = queries.some((item) => item.isRefetching);
  const refetch = () => Promise.all(queries.map((item) => item.refetch()));

  const filters = useMemo<DeveloperDashboardFilter[]>(() => {
    const items: DeveloperDashboardFilter[] = [
      { id: ALL_OFFERS_FILTER, label: isRtl ? "كل العروض" : "All offers" },
    ];
    for (const offer of offers) {
      items.push({
        id: offer.id,
        label: offerNumberLabel(offer),
        paid: offer.paymentStatus === "received",
      });
    }
    return items;
  }, [offers, isRtl]);

  useEffect(() => {
    if (!filters.some((item) => item.id === filter)) {
      setFilter(ALL_OFFERS_FILTER);
    }
  }, [filter, filters]);

  const scopedOffers = useMemo(
    () => (filter === ALL_OFFERS_FILTER ? offers : offers.filter((offer) => offer.id === filter)),
    [offers, filter]
  );

  const stats = useMemo((): DeveloperDashboardStats => {
    const scoped = buildDashboardStats({ offers: scopedOffers, isRtl });
    return {
      ...scoped,
      pageOfferCount: offers.length,
      pageInvoiceCount: offers.length,
      pageFileCount: offers.length,
      userCount: employees.length,
    };
  }, [scopedOffers, offers.length, employees.length, isRtl]);

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

function uniqueOfferLabel(label: string, seen: Map<string, number>) {
  const count = (seen.get(label) || 0) + 1;
  seen.set(label, count);
  return count > 1 ? `${label} (${count})` : label;
}

function buildDashboardStats({
  offers,
  isRtl,
}: {
  offers: OfferData[];
  isRtl: boolean;
}) {
  let invoiceTotal = 0;
  let invoiceSubtotal = 0;
  let invoiceVat = 0;
  let paidTotal = 0;
  let unpaidTotal = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  const seenLabels = new Map<string, number>();
  const invoicesByOffer: { name: string; value: number }[] = [];

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
    invoicesByOffer.push({
      name: uniqueOfferLabel(offerNumberLabel(offer), seenLabels),
      value: total,
    });
  }

  invoicesByOffer.sort((a, b) => b.value - a.value);

  const collectionRate = invoiceTotal > 0 ? (paidTotal / invoiceTotal) * 100 : 0;

  return {
    offerCount: offers.length,
    invoiceCount: offers.length,
    invoiceSubtotal,
    invoiceVat,
    invoiceTotal,
    paidTotal,
    unpaidTotal,
    paidCount,
    unpaidCount,
    collectionRate,
    invoicesByOffer: invoicesByOffer.slice(0, 12),
    paymentStatus: [
      { id: "paid", label: isRtl ? "مدفوع" : "Paid", value: paidCount, color: "#0a0f1d" },
      { id: "unpaid", label: isRtl ? "غير مدفوع" : "Unpaid", value: unpaidCount, color: "#17C3B3" },
    ],
    invoiceStatus: [
      { id: "paid", label: isRtl ? "مدفوع" : "Paid", value: paidTotal, color: "#0a0f1d" },
      { id: "unpaid", label: isRtl ? "غير مدفوع" : "Unpaid", value: unpaidTotal, color: "#17C3B3" },
    ],
  };
}

export type DeveloperDashboardStats = ReturnType<typeof buildDashboardStats> & {
  pageOfferCount: number;
  pageInvoiceCount: number;
  pageFileCount: number;
  userCount: number;
};
