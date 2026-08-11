"use client";

const stats = [
  { label: "Home for Rent", value: "980+" },
  { label: "Home to Buy", value: "800+" },
  { label: "Cities Covered", value: "100+" },
  { label: "Total Properties", value: "2000+" },
];

export function StatsSection() {
  return (
    <section className="relative w-full bg-[#090C1B] overflow-hidden py-24 px-6 md:px-16 lg:px-24">

      {/* === Background: subtle dot grid spanning the whole section === */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* === Organic glow 1 — large, top-right, warm blue === */}
      <div className="absolute -top-20 right-[15%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(58,84,178,0.18) 0%, transparent 70%)" }} />

      {/* === Organic glow 2 — medium, bottom-left, cooler === */}
      <div className="absolute -bottom-10 left-[8%] w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(30,55,130,0.22) 0%, transparent 70%)" }} />

      {/* === Organic glow 3 — small accent, mid-section off-center === */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[58%] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(80,100,200,0.10) 0%, transparent 70%)" }} />

      <div className="relative max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-14 lg:gap-0 lg:justify-items-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-start gap-3"
            >
              <span className="text-sm font-medium text-gray-400 tracking-wide">
                {stat.label}
              </span>
              <span className="text-6xl sm:text-7xl font-bold text-white tracking-tight leading-none">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
