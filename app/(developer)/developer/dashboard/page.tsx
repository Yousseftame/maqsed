import { DeveloperOverviewSection } from "@/features/developer/overview/DeveloperOverviewSection";
import { DeveloperPerformanceSection } from "@/features/developer/overview/DeveloperPerformanceSection";

export default function DeveloperDashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <DeveloperOverviewSection />
      <DeveloperPerformanceSection />
    </div>
  );
}
