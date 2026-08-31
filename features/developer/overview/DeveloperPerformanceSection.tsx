"use client";

import { Panel } from "@/features/admin/ui/Panel";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const visitsData = [
  { month: "نوفمبر 25", visits: 50 },
  { month: "ديسمبر 25", visits: 1350 },
  { month: "يناير 26", visits: 1050 },
  { month: "فبراير 26", visits: 1400 },
  { month: "مارس 26", visits: 950 },
  { month: "أبريل 26", visits: 2500 },
  { month: "مايو 26", visits: 1300 },
  { month: "يونيو 26", visits: 2400 },
  { month: "يوليو 26", visits: 750 },
  { month: "أغسطس 26", visits: 50 },
];

const salesData = [
  { project: "راس الحكمه", sales: 1500000 },
  { project: "إشراقة 20", sales: 3200000 },
];

const formatYAxisVisits = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return value.toString();
};

const formatXAxisSales = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-black/5 bg-white p-3 shadow-lg">
        <p className="mb-1 text-xs font-semibold text-[#8c8c8c]">{label}</p>
        <p className="text-sm font-bold text-[#0a0f1d]">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function DeveloperPerformanceSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Outer Panel — matches "بوابة المطور" above */}
      <Panel
        title="الأداء والإحصائيات"
        action={
          <span className="text-sm font-medium text-[#8c8c8c]">
            بيانات مشاريع الشركة
          </span>
        }
      >
        {/* Gray inner container — matches the StatCards section */}
        <div className="rounded-[24px] bg-[#F4F4F4] p-4 sm:p-5 mt-2">
          <div className="grid items-stretch gap-4 lg:grid-cols-2">

            {/* Chart 1: زيارات الروابط */}
            <div className="flex flex-col rounded-[20px] bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/[0.04]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-[#0a0f1d]">
                  زيارات الروابط
                </h3>
                <span className="text-xs font-medium text-[#8c8c8c] text-left">
                  عدد الزيارات الشهرية خلال آخر 12 شهر
                </span>
              </div>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visitsData}
                    margin={{ top: 10, right: 4, left: -16, bottom: 28 }}
                  >
                    <CartesianGrid vertical={false} stroke="rgba(10,15,29,0.06)" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8c8c8c", fontSize: 10, fontWeight: 500 }}
                      angle={-40}
                      textAnchor="end"
                      dy={6}
                      interval={0}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#8c8c8c", fontSize: 12, fontWeight: 600 }}
                      tickFormatter={formatYAxisVisits}
                      domain={[0, 3000]}
                      ticks={[0, 500, 1000, 1500, 2000, 2500]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(10,15,29,0.04)" }} />
                    <ReferenceLine y={1000} stroke="#aaa" strokeDasharray="5 4" />
                    <Bar
                      dataKey="visits"
                      fill="#0a0f1d"
                      radius={[6, 6, 4, 4]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: المبيعات حسب المشروع */}
            <div className="flex flex-col rounded-[20px] bg-white p-5 sm:p-6 shadow-sm ring-1 ring-black/[0.04]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-[#0a0f1d]">
                  المبيعات حسب المشروع
                </h3>
                <span className="text-xs font-medium text-[#8c8c8c] text-left">
                  إجمالي قيمة المبيعات لكل مشروع
                </span>
              </div>
              <div className="flex flex-1 items-center">
                <div className="h-40 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      layout="vertical"
                      margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                    >
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#8c8c8c", fontSize: 12, fontWeight: 600 }}
                        tickFormatter={formatXAxisSales}
                        domain={[0, 4000000]}
                        ticks={[0, 1000000, 2000000, 3000000, 4000000]}
                      />
                      <YAxis
                        type="category"
                        dataKey="project"
                        axisLine={false}
                        tickLine={false}
                        width={90}
                        tick={{ fill: "#0a0f1d", fontSize: 13, fontWeight: 700 }}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(10,15,29,0.04)" }} />
                      <Bar
                        dataKey="sales"
                        fill="#0a0f1d"
                        radius={[4, 4, 4, 4]}
                        barSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Panel>
    </div>
  );
}
