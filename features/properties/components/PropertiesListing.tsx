"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Map } from "lucide-react";
import { allProperties } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";

export function PropertiesListing() {
  const { t } = useLocale();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleScroll = () => {
      isScrollingRef.current = true;
      setIsHoveringCard(false);
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    section.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20"
    >
      <div
        className="pointer-events-none absolute top-0 left-0 z-[100] hidden h-[105px] w-[105px] items-center justify-center rounded-full bg-[#0a0f1d] text-center text-white shadow-xl lg:flex"
        style={{
          opacity: isHoveringCard ? 1 : 0,
          transform: `translate(${mousePos.x - 52.5}px, ${mousePos.y - 52.5}px) scale(${isHoveringCard ? 1 : 0})`,
          transition: isHoveringCard
            ? "transform 0.15s ease-out, opacity 0.3s ease"
            : "opacity 0.15s ease",
        }}
      >
        <div className="flex flex-col items-center justify-center text-[19px] leading-none font-black tracking-tight">
          <span>{t("properties.view")}</span>
          <span className="tracking-normal">{t("properties.details")}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allProperties.map((prop) => (
            <Link
              key={prop.id}
              href={`/properties/${prop.id}`}
              className="group flex cursor-pointer flex-col"
              onMouseEnter={() => {
                if (!isScrollingRef.current) setIsHoveringCard(true);
              }}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              <div className="relative mb-6 aspect-[15/16] w-full overflow-hidden rounded-2xl bg-[#ececec]">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-5 left-5 z-10 flex items-center justify-center rounded-full bg-[#0a0f1d] px-3 py-2 text-[17px] leading-none font-bold tracking-tight text-white">
                  {prop.tag === "FOR RENT"
                    ? t("properties.forRent")
                    : t("properties.forSale")}
                </div>
              </div>

              <div className="flex flex-col px-2">
                <h3 className="mb-1 text-[2rem] leading-tight font-semibold text-[#0a0f1d]">
                  {prop.price}
                </h3>
                <h4 className="mb-4 text-2xl font-bold text-[#0a0f1d]">{prop.title}</h4>
                <p className="mb-6 text-[1.05rem] leading-relaxed font-semibold whitespace-pre-line text-[#8c8c8c]">
                  {prop.address}
                </p>

                <div className="mt-auto flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bed className="h-6 w-6 stroke-[2]" />
                    <span className="text-[1rem] font-bold">
                      {prop.beds} {t("properties.bed")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bath className="h-6 w-6 stroke-[2]" />
                    <span className="text-[1rem] font-bold">
                      {prop.baths} {t("properties.bath")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Map className="h-6 w-6 stroke-[2]" />
                    <span className="text-[1rem] font-bold">
                      {prop.sqft} {t("properties.sqft")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
