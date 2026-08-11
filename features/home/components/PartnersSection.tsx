"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const partners = [
  { id: 1, logo: "/1779208393076_P25.svg" },
  { id: 2, logo: "/1779208393076_P25.svg" },
  { id: 3, logo: "/1779208393076_P25.svg" },
  { id: 4, logo: "/1779208393076_P25.svg" },
  { id: 5, logo: "/1779208393076_P25.svg" },
  { id: 6, logo: "/1779208393076_P25.svg" },
  { id: 7, logo: "/1779208393076_P25.svg" },
  { id: 8, logo: "/1779208393076_P25.svg" },
  { id: 9, logo: "/1779208393076_P25.svg" },
  { id: 10, logo: "/1779208393076_P25.svg" },
];

export function PartnersSection() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        speed: 1.5,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    ]
  );

  return (
    <section className="relative z-30 w-full bg-white py-28 overflow-hidden">
      
      {/* Immersive Glowing Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-[120px] rounded-[100%] pointer-events-none" />
      
      {/* Subtle Top & Bottom Borders to frame the section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-14 text-center relative z-10">
        <div className="inline-flex items-center gap-3 border border-gray-200 rounded-full px-5 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#0a0f1d] animate-pulse" />
          <span className="text-sm font-semibold text-[#0a0f1d]">
            Trusted by Industry Leaders
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0a0f1d] tracking-tight">
          Our Global Partners
        </h2>
      </div>

      {/* Edge Fade Masks for the immersive marquee effect */}
      <div 
        className="relative z-10 w-full max-w-[1800px] mx-auto"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-20 items-center py-4">
            {partners.map((partner, index) => (
              <div 
                key={`${partner.id}-${index}`} 
                className="flex-[0_0_auto] min-w-0 pl-20"
              >
                <div className="w-[160px] h-[60px] relative grayscale opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer">
                  <Image
                    src={partner.logo}
                    alt="Partner Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
