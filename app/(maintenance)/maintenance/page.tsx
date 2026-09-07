import type { Metadata } from "next";
import { MaintenancePageScreen } from "@/features/maintenance/MaintenanceView";

export const metadata: Metadata = {
  title: "Maintenance | MAQSED",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <MaintenancePageScreen />;
}
