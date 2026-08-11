"use client";

import { useState } from "react";
import Image from "next/image";

const categories = [
  {
    id: 1,
    title: "Luxury Villa",
    description:
      "Experience unparalleled luxury in sprawling private estates with stunning architecture and world-class amenities.",
    count: "320+ Properties",
    image: "/herosectionimg.avif",
  },
  {
    id: 2,
    title: "Modern Family Home",
    description:
      "Thoughtfully designed spaces for families who value comfort, style, and community in premium neighborhoods.",
    count: "540+ Properties",
    image: "/herosectionimg.avif",
  },
  {
    id: 3,
    title: "Luxury Apartment",
    description:
      "Indulge in high-end city living with sophisticated interiors, premium facilities, and exclusive services tailored for ultimate convenience.",
    count: "850+ Properties",
    image: "/herosectionimg.avif",
  },
  {
    id: 4,
    title: "Premium Office Space",
    description:
      "Elevate your business with prestigious commercial spaces in prime locations across Saudi Arabia's key cities.",
    count: "140+ Properties",
    image: "/herosectionimg.avif",
  },
];

export function AboutSection() {
  const [activeId, setActiveId] = useState<number>(3);
  const [isPillActive, setIsPillActive] = useState<boolean>(false);

  return (
    <section 
      className={`relative z-30 w-full py-20 px-6 md:px-12 lg:px-20 transition-colors duration-700 ${
        isPillActive ? "bg-[#0a0f1d]" : "bg-white"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
          {/* Left */}
          <div className="max-w-xl">
            <button
              onClick={() => setIsPillActive(!isPillActive)}
              className={`inline-flex items-center gap-3 border rounded-full px-5 py-2.5 mb-8 transition-colors duration-500 ${
                isPillActive 
                  ? "bg-[#0a0f1d] border-gray-700 hover:bg-gray-800" 
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-[8px] h-[8px] rounded-full transition-colors duration-500 ${
                  isPillActive ? "bg-white" : "bg-[#0a0f1d]"
                }`}
              />
              <span
                className={`text-sm font-semibold tracking-wide transition-colors duration-500 ${
                  isPillActive ? "text-white" : "text-[#0a0f1d]"
                }`}
              >
                {isPillActive ? "About MAQSED" : "Click on me  "}
              </span>
            </button>
            <h2 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight transition-colors duration-700 ${
                isPillActive ? "text-white" : "text-[#0a0f1d]"
              }`}
            >
              Your Dream Home,{" "}
              <br />
              Our Expertise.
            </h2>
          </div>

          {/* Right */}
          <div className="max-w-md lg:pt-16">
            <p 
              className={`text-base leading-relaxed transition-colors duration-700 ${
                isPillActive ? "text-gray-300" : "text-gray-400"
              }`}
            >
              At MAQSED, we are committed to helping individuals and families find
              their perfect homes and smart investment properties. Our approach blends
              personalized service, expert insights, and a dedication to excellence,
              ensuring your real estate journey is seamless, rewarding, and tailored
              to your unique needs.
            </p>
          </div>
        </div>

        {/* Accordion Image Cards */}
        <div className="flex gap-3 h-[420px] sm:h-[460px]">
          {categories.map((cat) => {
            const isActive = activeId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveId(cat.id)}
                className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ flex: isActive ? "3.5" : "1" }}
              >
                {/* Image */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Gradient overlay — always visible at bottom */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  }}
                />

                {/* Text content — only visible when active */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(12px)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 whitespace-nowrap">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3 max-w-xs">
                    {cat.description}
                  </p>
                  <span className="text-sm font-semibold text-white/80">
                    {cat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
