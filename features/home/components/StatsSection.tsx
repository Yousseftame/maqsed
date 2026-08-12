"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatItem({
  label,
  value,
  suffix,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  active: boolean;
}) {
  const display = useCountUp(value, active);

  return (
    <div className="relative flex flex-col items-start gap-3 px-0 sm:px-2 lg:px-8">
      <span className="text-sm font-medium tracking-wide text-[#8c8c8c]">
        {label}
      </span>
      <span className="text-5xl leading-none font-bold tracking-tight text-white tabular-nums sm:text-6xl lg:text-7xl">
        {display}
        {suffix}
      </span>
    </div>
  );
}

export function StatsSection() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });

  const stats = useMemo(
    () => [
      { label: t("stats.homesForRent"), value: 980, suffix: "+" },
      { label: t("stats.homesToBuy"), value: 800, suffix: "+" },
      { label: t("stats.citiesCovered"), value: 100, suffix: "+" },
      { label: t("stats.totalProperties"), value: 2000, suffix: "+" },
    ],
    [t]
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full overflow-hidden bg-[#0a0f1d] px-6 py-24 md:px-12 lg:px-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(6rem,18vw,16rem)] leading-none font-bold tracking-tighter text-white/[0.03]"
      >
        MAQSED
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <h2 className="mb-14 flex justify-center text-center text-4xl font-bold tracking-tight text-white sm:mb-16 sm:text-5xl lg:text-6xl">
          <DiaTextReveal
            key={`stats-${locale}`}
            text={t("stats.title")}
            textColor="#ffffff"
            colors={["#ffffff"]}
          />
        </h2>

        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              active={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
