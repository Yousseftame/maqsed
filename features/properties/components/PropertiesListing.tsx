"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Map } from "lucide-react";
import { allProperties } from "@/features/properties/data/listings";

export function PropertiesListing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    const section = sectionRef.current;
    if (section) section.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (section) section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full overflow-hidden bg-white px-6 pb-24 md:px-12 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-0 left-0 z-[100] hidden h-[105px] w-[105px] items-center justify-center rounded-full bg-[#0a0f1d] text-center text-white shadow-xl lg:flex"
        style={{
          opacity: isHoveringCard ? 1 : 0,
          transform: `translate(${mousePos.x - 52.5}px, ${mousePos.y - 52.5}px) scale(${isHoveringCard ? 1 : 0})`,
          transition: "transform 0.15s ease-out, opacity 0.3s ease",
        }}
      >
        <div className="flex flex-col items-center justify-center text-[19px] leading-none font-black tracking-tight">
          <span>View</span>
          <span className="tracking-normal">Details</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-center justify-between gap-10 md:flex-row md:items-center">
          <div className="pointer-events-none select-none mix-blend-multiply" aria-hidden>
            <Image
              src="/bgicon.png"
              alt=""
              width={220}
              height={220}
              className="h-[160px] w-[160px] object-contain opacity-35 md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]"
            />
          </div>

          <div className="flex max-w-xl flex-col items-center text-center md:items-end md:text-right">
            <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
              <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
              <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
                Popular Family House
              </span>
            </div>

            <h2 className="mb-4 text-4xl leading-tight font-bold tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-[3.25rem]">
              Our Most Popular
              <br />
              Family House
            </h2>

            <p className="max-w-md text-base font-semibold leading-snug tracking-normal text-[#8c8c8c] sm:text-lg">
              Explore our top-rated family houses, chosen for their prime
              locations, spacious layouts, and modern amenities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allProperties.map((prop) => (
            <Link
              key={prop.id}
              href={`/properties/${prop.id}`}
              className="group flex cursor-pointer flex-col"
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              <div className="relative mb-6 aspect-[15/16] w-full overflow-hidden rounded-2xl">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover transition-transform duration-700"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-5 left-5 z-10 flex items-center justify-center rounded-full bg-[#0a0f1d] px-3 py-2 text-[17px] leading-none font-bold tracking-tight text-white">
                  {prop.tag}
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
                    <span className="text-[1rem] font-bold">{prop.beds} bed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bath className="h-6 w-6 stroke-[2]" />
                    <span className="text-[1rem] font-bold">{prop.baths} bath</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Map className="h-6 w-6 stroke-[2]" />
                    <span className="text-[1rem] font-bold">{prop.sqft} sq ft</span>
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
