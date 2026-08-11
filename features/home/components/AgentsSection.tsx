"use client";

import { useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Star, MapPin, Key } from "lucide-react";

const agents = [
  {
    id: 1,
    name: "Sarah Michelle",
    rating: "4.9",
    role: "Luxury Property Specialist",
    location: "New York",
    sold: "412 Properties Sold",
    image: "/herosectionimg.avif",
  },
  {
    id: 2,
    name: "Michael Lawson",
    rating: "4.9",
    role: "Senior Real Estate Advisor",
    location: "Los Angeles",
    sold: "389 Properties Sold",
    image: "/herosectionimg.avif",
  },
  {
    id: 3,
    name: "Bambang Widjaja",
    rating: "4.8",
    role: "Senior Real Estate Advisor",
    location: "Jakarta",
    sold: "346 Properties Sold",
    image: "/herosectionimg.avif",
  },
  {
    id: 4,
    name: "Miyoshi Nakano",
    rating: "4.8",
    role: "Commercial Real Estate Agent",
    location: "Tokyo",
    sold: "340 Properties Sold",
    image: "/herosectionimg.avif",
  },
  {
    id: 5,
    name: "David Harrison",
    rating: "4.8",
    role: "First-Time Home Buyer Specialist",
    location: "Barcelona",
    sold: "284 Properties Sold",
    image: "/herosectionimg.avif",
  },
  {
    id: 6,
    name: "Isabella Clarke",
    rating: "4.7",
    role: "Real Estate Negotiation Expert",
    location: "London",
    sold: "365 Properties Sold",
    image: "/herosectionimg.avif",
  },
];

export function AgentsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        speed: 1, // Slow continuous scroll
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <section className="relative z-30 w-full bg-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
          {/* Left Side */}
          <div className="max-w-2xl">
            <div className="group inline-flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 mb-6 transition-colors duration-300 hover:bg-[#0a0f1d] cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-[#0a0f1d] group-hover:bg-white transition-colors duration-300" />
              <span className="text-sm font-medium text-[#0a0f1d] group-hover:text-white transition-colors duration-300">
                Top Rated Agents
              </span>
            </div>
            <h2 className="text-5xl lg:text-[4rem] font-bold text-[#0a0f1d] leading-[1.1] tracking-tight">
              Meet One of Our Top
              <br />
              Performing Agents.
            </h2>
          </div>

          {/* Right Side */}
          <div className="max-w-md lg:pt-20">
            <p className="text-[#6b7280] text-[1.1rem] leading-relaxed">
              A special feature showcasing an exceptional agent who has consistently exceeded expectations and delivered outstanding service.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Fix Embla Gap with -ml-6 and pl-6 */}
          <div className="flex -ml-6">
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-6"
              >
                {/* Wrap the card in a group for the hover effect */}
                <div className="flex flex-col group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Info Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-2xl font-bold text-[#0a0f1d]">{agent.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-6 h-6 fill-[#FFB800] text-[#FFB800]" />
                      <span className="text-lg font-bold text-[#0a0f1d]">{agent.rating}</span>
                    </div>
                  </div>

                  {/* Role */}
                  <p className="text-[#8c8c8c] text-base font-medium mb-5">
                    {agent.role}
                  </p>

                  {/* Details */}
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3 text-[#0a0f1d]">
                      <MapPin className="w-6 h-6 stroke-[2.5]" />
                      <span className="text-base font-semibold">{agent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#0a0f1d]">
                      <Key className="w-6 h-6 stroke-[2.5]" />
                      <span className="text-base font-semibold">{agent.sold}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full py-4 rounded-xl border border-gray-300 text-[#0a0f1d] font-extrabold text-lg transition-colors duration-300 group-hover:bg-[#0a0f1d] group-hover:text-white group-hover:border-[#0a0f1d]">
                    Contact Agent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
