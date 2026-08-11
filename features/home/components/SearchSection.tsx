"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div className="flex-1 flex flex-col pb-3 border-b border-gray-300 min-w-[200px]">
    <label className="text-base text-gray-500 font-medium mb-6 tracking-wide whitespace-nowrap">
      {label}
    </label>
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none text-[#0a0f1d] font-semibold text-lg sm:text-xl bg-transparent pl-3 pr-10 cursor-pointer focus:outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {/* Chevron pinned to the right edge with some spacing */}
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a0f1d] pointer-events-none flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export function SearchSection() {
  const [lookingFor, setLookingFor] = useState("Buy");
  const [location, setLocation] = useState("Riyadh");
  const [bedrooms, setBedrooms] = useState("Single");
  const [budget, setBudget] = useState("SAR 1,000,000");

  return (
    <section className="relative z-30 w-full bg-white py-24 px-6 flex flex-col items-center">

      {/* Label Pill */}
      <div className="group inline-flex items-center gap-2.5 border border-gray-200 rounded-full px-5 py-2.5 mb-8 cursor-default hover:bg-[#0a0f1d] transition-colors duration-300">
        <div className="w-[6px] h-[6px] rounded-full bg-[#0a0f1d] group-hover:bg-white transition-colors duration-300 flex-shrink-0" />
        <span className="text-sm font-medium text-[#0a0f1d] tracking-wide group-hover:text-white transition-colors duration-300">
          Search Properties
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-[clamp(36px,6vw,72px)] font-bold text-[#0a0f1d] text-center leading-tight tracking-tight mb-4">
        Find Your Dream Home
      </h2>

      {/* Subtitle */}
      <p className="text-base text-gray-400 text-center max-w-sm leading-relaxed mb-16">
        We offer modern properties with the best quality that meet all your needs.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-[1150px] flex flex-col sm:flex-row items-end gap-4 sm:gap-5 mt-4">

        <SelectField
          label="Looking for"
          value={lookingFor}
          onChange={setLookingFor}
          options={["Buy", "Rent", "Invest"]}
        />

        <SelectField
          label="Locations"
          value={location}
          onChange={setLocation}
          options={["Riyadh", "Jeddah", "NEOM", "Dammam", "Al Khobar", "Mecca"]}
        />

        <SelectField
          label="Bedrooms"
          value={bedrooms}
          onChange={setBedrooms}
          options={["Single", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"]}
        />

        <SelectField
          label="Budget"
          value={budget}
          onChange={setBudget}
          options={[
            "SAR 500,000",
            "SAR 1,000,000",
            "SAR 2,000,000",
            "SAR 5,000,000",
            "SAR 10,000,000",
            "SAR 10,000,000+",
          ]}
        />

        {/* Search Button */}
        <div className="flex items-end pb-1 flex-shrink-0 mt-6 sm:mt-0 sm:ml-6">
          <button
            className="group w-14 h-14 rounded-full bg-[#0a0f1d] text-white flex items-center justify-center hover:bg-[#161c2d] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(10,15,29,0.3)] active:scale-95 active:translate-y-0 transition-all duration-300"
            aria-label="Search"
          >
            <Search className="w-7 h-7 transform group-hover:-rotate-12 transition-transform duration-300 ease-out" strokeWidth={2} />
          </button>
        </div>

      </div>
    </section>
  );
}
