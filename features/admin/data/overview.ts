export type OverviewStat = {
  id: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export { OVERVIEW_KPIS as OVERVIEW_STATS } from "@/features/admin/overview/data";
