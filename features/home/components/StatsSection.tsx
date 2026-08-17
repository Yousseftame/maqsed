"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useInView } from "motion/react";
import Image from "next/image";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Building2, BadgePercent, UserRoundCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
  icon: Icon,
  value,
  suffix,
  text,
  active,
  delay,
}: {
  icon: any;
  value: number;
  suffix: string;
  text: string;
  active: boolean;
  delay: number;
}) {
  const display = useCountUp(value, active);

  return (
    <div 
      className="relative flex flex-col items-center text-center gap-5 px-4 transition-all duration-1000"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`
      }}
    >
      <Icon className="h-14 w-14 text-white stroke-[1.25]" />
      
      <div className="flex flex-col gap-2">
        <span className="text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {display}
          {suffix}
        </span>
        <p className="mx-auto max-w-[260px] text-sm leading-relaxed font-medium text-gray-300 sm:text-base">
          {text}
        </p>
      </div>
    </div>
  );
}

export function StatsSection() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });

  const stats = useMemo(
    () => [
      {
        icon: Building2,
        value: parseInt(t("stats.items.sold.value"), 10),
        suffix: t("stats.items.sold.suffix"),
        text: t("stats.items.sold.text"),
      },
      {
        icon: BadgePercent,
        value: parseInt(t("stats.items.loan.value"), 10),
        suffix: t("stats.items.loan.suffix"),
        text: t("stats.items.loan.text"),
      },
      {
        icon: UserRoundCheck,
        value: parseInt(t("stats.items.clients.value"), 10),
        suffix: t("stats.items.clients.suffix"),
        text: t("stats.items.clients.text"),
      },
    ],
    [t]
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full overflow-hidden bg-[#0a0f1d] px-6 py-16 md:px-12 lg:py-20"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/counter-bg-1.jpg"
          alt="Background pattern"
          fill
          className="object-cover opacity-50"
          quality={100}
        />
      </div>

      {/* Decorative Stars */}
      <Image
        src="/star.svg"
        alt="Star decoration"
        width={100}
        height={100}
        className="absolute top-20 start-10 z-10 opacity-50"
        style={{ animation: "spin 20s linear infinite" }}
      />
      <Image
        src="/star.svg"
        alt="Star decoration"
        width={120}
        height={120}
        className="absolute bottom-16 end-10 z-10 opacity-40"
        style={{ animation: "spin 25s linear infinite reverse" }}
      />

      <div className="relative z-20 mx-auto max-w-[1200px]">
        {/* Title */}
        <div className="mb-12 flex justify-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <DiaTextReveal
              key={`stats-title-${locale}`}
              text={t("stats.title")}
              textColor="#ffffff"
              colors={["#ffffff"]}
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {stats.map((stat, i) => (
            <StatItem
              key={i}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              text={stat.text}
              active={isInView}
              delay={i * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
