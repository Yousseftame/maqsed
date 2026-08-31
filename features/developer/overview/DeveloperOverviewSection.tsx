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
  Building 
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
              trend={{ value: "15.3%", direction: "up" }}
              hint="مقابل الشهر الماضي"
            />

            <StatCard
              label="نسبة المبيعات"
              value="3.70%"
              icon={Percent}
              trend={{ value: "12%", direction: "up" }}
              hint="مقابل الشهر الماضي"
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
          trend={{ value: "8.4%", direction: "up" }}
          hint="مقابل الشهر الماضي"
        />

        <StatCard
          label="عدد التفاوضات"
          value="1"
          icon={Handshake}
          trend={{ value: "5%", direction: "up" }}
          hint="مقابل الشهر الماضي"
        />

        <StatCard
          label="الوحدات المتاحة"
          value="73"
          icon={Building2}
          trend={{ value: "12%", direction: "up" }}
          hint="مقابل الشهر الماضي"
        />

        <StatCard
          label="الوحدات المحجوزة"
          value="8"
          icon={Building}
          trend={{ value: "5.2%", direction: "up" }}
          hint="مقابل الشهر الماضي"
        />
      </StatGrid>

      {/* Results Analysis Funnel */}
      <Panel 
        title="تحليل النتائج" 
        action={<span className="text-sm font-medium text-[#8c8c8c]">مسار التحويل من الوصول حتى إتمام المبيعات</span>}
      >
        <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5 mt-2 flex flex-col gap-4">
          
          {/* Top Row: 3 Cards */}
          <StatGrid className="xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-3">
            <FunnelStatCard
              label="المشاهدات"
              value="2,166,997"
              trend="نقطة البداية"
              hint="المرحلة 1"
            />
            
            <FunnelStatCard
              label="التفاعلات"
              value="12,276"
              trend="0.6% من السابقة"
              hint="المرحلة 2"
            />
            
            <FunnelStatCard
              label="القوالب المرسلة"
              value="33,843"
              trend="275.7% من السابقة"
              hint="المرحلة 3"
            />
          </StatGrid>

          {/* Bottom Row: 4 Cards */}
          <StatGrid className="xl:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
            <FunnelStatCard
              label="الاهتمامات"
              value="6,225"
              trend="18.4% من السابقة"
              hint="المرحلة 4"
            />
            
            <FunnelStatCard
              label="العملاء المحتملون"
              value="908"
              trend="14.6% من السابقة"
              hint="المرحلة 5"
            />

            <FunnelStatCard
              label="الزيارات الميدانية"
              value="70"
              trend="7.7% من السابقة"
              hint="المرحلة 6"
            />

            <FunnelStatCard
              label="المبيعات"
              value="3"
              trend="4.3% من السابقة"
              hint="المرحلة 7"
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
  trend,
  hint,
}: {
  label: string;
  value: string;
  trend: string;
  hint: string;
}) {
  return (
    <article className="flex min-h-[140px] flex-col justify-between rounded-[24px] bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/5">
      {/* Top Row: Label on right, Chip on left */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-[#0a0f1d]">{label}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8EF] px-2.5 py-1 text-xs font-bold text-[#83BF6E] whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 rtl:-scale-x-100"
          >
            <path d="m7 7 10 10" />
            <path d="M17 7v10H7" />
          </svg>
          {trend}
        </span>
      </div>

      {/* Bottom Row: Value on right, Hint on left */}
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-[2rem] leading-none font-bold tracking-tight text-[#0a0f1d] sm:text-[2.35rem]">
          {value}
        </p>
        <span className="mb-1 text-xs font-medium text-[#8c8c8c] whitespace-nowrap">{hint}</span>
      </div>
    </article>
  );
}
