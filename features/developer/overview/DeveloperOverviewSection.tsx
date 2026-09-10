"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StatGrid, StatCard } from "@/features/admin/ui/StatCard";
import { Panel } from "@/features/admin/ui/Panel";
import { 
  Banknote, 
  Percent, 
  ShoppingCart, 
  Handshake, 
  Building2,
  Users
} from "lucide-react";

export function DeveloperOverviewSection() {
  const [activeTab, setActiveTab] = useState<"all" | "project1" | "project2">("all");

  const actionToggle = (
    <div className="flex flex-wrap items-center gap-1 rounded-[20px] sm:rounded-full bg-white p-1 shadow-sm ring-1 ring-[#0a0f1d]/10 w-full lg:w-auto">
      <button
        onClick={() => setActiveTab("project2")}
        className={cn(
          "flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all",
          activeTab === "project2"
            ? "bg-[#0a0f1d] text-white shadow-md"
            : "text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
        )}
      >
        راس الحكمه
      </button>
      <button
        onClick={() => setActiveTab("project1")}
        className={cn(
          "flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all",
          activeTab === "project1"
            ? "bg-[#0a0f1d] text-white shadow-md"
            : "text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
        )}
      >
        إشراقة 20
      </button>
      <button
        onClick={() => setActiveTab("all")}
        className={cn(
          "flex-1 sm:flex-none rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all",
          activeTab === "all"
            ? "bg-[#0a0f1d] text-white shadow-md"
            : "text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
        )}
      >
        كل المشاريع
      </button>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <Panel title="بوابة المطور" action={actionToggle}>
        <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5 mt-2">
          {/* Top Grid: 2 Large Cards */}
          <StatGrid className="xl:grid-cols-2">
            <StatCard
              label="قيمة المبيعات"
              value="3,248,000"
              icon={Banknote}
            />

            <StatCard
              label="نسبة المبيعات"
              value="3.70%"
              icon={Percent}
            />
          </StatGrid>
        </div>
      </Panel>

      {/* Bottom Grid: 4 Secondary Cards */}
      <StatGrid>
        <StatCard
          label="عدد المبيعات"
          value="3"
          icon={ShoppingCart}
        />

        <StatCard
          label="عدد التفاوضات"
          value="1"
          icon={Handshake}
        />

        <StatCard
          label="الوحدات المتاحة"
          value="73"
          icon={Building2}
        />

        <StatCard
          label="الموظفين"
          value="12"
          icon={Users}
        />
      </StatGrid>

      {/* Results Analysis Funnel */}
      <Panel 
        title="تحليل النتائج" 
      >
        <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5 mt-2 flex flex-col gap-4">
          <StatGrid className="xl:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
            <FunnelStatCard
              label="المشاهدات"
              value="2,166,997"
            />
            
            <FunnelStatCard
              label="القوالب المرسلة"
              value="33,843"
            />

            <FunnelStatCard
              label="العملاء المحتملون"
              value="908"
            />

            <FunnelStatCard
              label="المبيعات"
              value="3"
            />
          </StatGrid>
        </div>
      </Panel>
    </div>
  );
}

function FunnelStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="flex min-h-[140px] flex-col justify-between rounded-[24px] bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/5">
      <span className="text-sm font-semibold text-[#0a0f1d]">{label}</span>
      <p className="mt-4 text-[2rem] leading-none font-bold tracking-tight text-[#0a0f1d] sm:text-[2.35rem]">
        {value}
      </p>
    </article>
  );
}
