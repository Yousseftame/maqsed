"use client";

import { useState } from "react";
import Image from "next/image";
import { Bed, Bath, Map } from "lucide-react";

const filters = ["All Properties", "Family House", "Modern Vila", "Luxury Apartment"];

const properties = [
  {
    id: 1,
    image: "/herosectionimg.avif",
    tag: "FOR SALE",
    price: "$1,750,000",
    title: "Amberwood Homestead",
    address: "150 Maple Road,\nVancouver, BC V6E1B6, Canada",
    beds: 4,
    baths: 4,
    sqft: "2,000",
  },
  {
    id: 2,
    image: "/herosectionimg.avif",
    tag: "FOR SALE",
    price: "$5,500,000",
    title: "Aurora Tower",
    address: "19 Crescent Bay Street,\nDubai, 00000, UAE",
    beds: 2,
    baths: 2,
    sqft: "700",
  },
  {
    id: 3,
    image: "/herosectionimg.avif",
    tag: "FOR SALE",
    price: "$2,600,000",
    title: "Azure Bay Villa",
    address: "Seaside Avenue,\nSantorini, 84700, Greece",
    beds: 5,
    baths: 5,
    sqft: "850",
  },
  {
    id: 4,
    image: "/herosectionimg.avif",
    tag: "FOR RENT",
    price: "$8,500 / mo",
    title: "Urban Skyline Penthouse",
    address: "101 Skyline Blvd,\nNew York, NY 10001, USA",
    beds: 3,
    baths: 3,
    sqft: "1,200",
  },
  {
    id: 5,
    image: "/herosectionimg.avif",
    tag: "FOR SALE",
    price: "$3,100,000",
    title: "Golden Horizon Estate",
    address: "88 Golden Way,\nLos Angeles, CA 90210, USA",
    beds: 6,
    baths: 5,
    sqft: "3,500",
  },
  {
    id: 6,
    image: "/herosectionimg.avif",
    tag: "FOR SALE",
    price: "$1,250,000",
    title: "Minimalist Zen Retreat",
    address: "42 Serenity Lane,\nKyoto, 604-8091, Japan",
    beds: 2,
    baths: 2,
    sqft: "950",
  },
];

export function PropertiesSection() {
  const [activeFilter, setActiveFilter] = useState("All Properties");

  return (
    <section className="relative z-30 w-full bg-white py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-16">
          {/* Left Side */}
          <div className="max-w-xl">
            <div className="group inline-flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 mb-6 transition-colors duration-300 hover:bg-[#0a0f1d] cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-[#0a0f1d] group-hover:bg-white transition-colors duration-300" />
              <span className="text-sm font-medium text-[#0a0f1d] group-hover:text-white transition-colors duration-300">
                Featured Properties
              </span>
            </div>
            <h2 className="text-5xl lg:text-[4rem] font-bold text-[#0a0f1d] leading-[1.1] tracking-tight">
              Discover Urbanouse
              <br />
              Properties
            </h2>
          </div>

          {/* Right Side */}
          <div className="max-w-lg lg:pt-20">
            <p className="text-[#6b7280] text-[1.1rem] leading-relaxed">
              Explore an exclusive selection of premium properties, meticulously curated to provide you with the best in luxury living and prime real estate investment options, tailored to your needs
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeFilter === filter
                  ? "bg-[#0a0f1d] text-white border border-[#0a0f1d]"
                  : "bg-white text-[#0a0f1d] border border-gray-200 hover:border-[#0a0f1d]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div key={prop.id} className="flex flex-col group cursor-pointer">
              {/* Image Container */}
              <div className="relative w-full aspect-[15/16] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Tag */}
                <div className="absolute top-5 left-5 bg-[#0a0f1d] text-white text-xs font-semibold px-4 py-2 rounded-full tracking-wider">
                  {prop.tag}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col px-2">
                <h3 className="text-[2rem] font-semibold text-[#0a0f1d] leading-tight mb-1">
                  {prop.price}
                </h3>
                <h4 className="text-xl font-medium text-[#0a0f1d] mb-4">
                  {prop.title}
                </h4>
                
                <p className="text-[#8c8c8c] text-base leading-relaxed mb-6 whitespace-pre-line">
                  {prop.address}
                </p>

                {/* Amenities */}
                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bed className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-sm font-medium">{prop.beds} bed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bath className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-sm font-medium">{prop.baths} bath</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Map className="w-5 h-5 stroke-[1.5]" />
                    <span className="text-sm font-medium">{prop.sqft} sq ft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
