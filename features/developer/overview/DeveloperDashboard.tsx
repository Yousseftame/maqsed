"use client";

import { DeveloperOverviewSection } from "./DeveloperOverviewSection";
import { DeveloperPerformanceSection } from "./DeveloperPerformanceSection";
import { useDeveloperDashboard } from "./useDeveloperDashboard";

export function DeveloperDashboard() {
  const { filter, setFilter, filters, isDeveloper, isRtl, stats, isRefetching, refetch, ownerUid } =
    useDeveloperDashboard();

  return (
    <div className="flex flex-col gap-8 pb-12">
      <DeveloperOverviewSection
        filter={filter}
        filters={filters}
        onFilter={setFilter}
        isDeveloper={isDeveloper}
        isRtl={isRtl}
        stats={stats}
        isRefetching={isRefetching}
        onRefresh={refetch}
        canRefresh={Boolean(ownerUid)}
      />
      <DeveloperPerformanceSection isRtl={isRtl} stats={stats} />
    </div>
  );
}
