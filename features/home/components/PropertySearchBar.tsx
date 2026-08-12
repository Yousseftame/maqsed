"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  <div className="flex min-w-[200px] flex-1 flex-col border-b-2 border-[#8c8c8c] pb-3">
    <label className="mb-6 text-base font-medium tracking-wide whitespace-nowrap text-gray-500">
      {label}
    </label>
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-transparent ps-3 pe-10 text-lg font-semibold text-[#0a0f1d] focus:outline-none sm:text-xl"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 end-3 h-4 w-4 flex-shrink-0 -translate-y-1/2 text-[#0a0f1d]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
);

export function PropertySearchBar() {
  const { t } = useLocale();
  const lookingOptions = [
    t("search.options.buy"),
    t("search.options.rent"),
    t("search.options.invest"),
  ];
  const bedroomOptions = [
    t("search.options.single"),
    t("search.options.bed1"),
    t("search.options.bed2"),
    t("search.options.bed3"),
    t("search.options.bed4"),
  ];
  const locationOptions = [
    "Riyadh",
    "Jeddah",
    "NEOM",
    "Dammam",
    "Al Khobar",
    "Mecca",
  ];
  const budgetOptions = [
    "SAR 500,000",
    "SAR 1,000,000",
    "SAR 2,000,000",
    "SAR 5,000,000",
    "SAR 10,000,000",
    "SAR 10,000,000+",
  ];

  const [lookingFor, setLookingFor] = useState(lookingOptions[0]);
  const [location, setLocation] = useState(locationOptions[0]);
  const [bedrooms, setBedrooms] = useState(bedroomOptions[0]);
  const [budget, setBudget] = useState(budgetOptions[1]);

  return (
    <div
      className="mt-4 flex w-full max-w-[1150px] flex-col items-end gap-4 sm:flex-row sm:gap-5"
      data-aos="fade-up"
    >
      <SelectField
        label={t("search.lookingFor")}
        value={lookingOptions.includes(lookingFor) ? lookingFor : lookingOptions[0]}
        onChange={setLookingFor}
        options={lookingOptions}
      />

      <SelectField
        label={t("search.locations")}
        value={location}
        onChange={setLocation}
        options={locationOptions}
      />

      <SelectField
        label={t("search.bedrooms")}
        value={bedroomOptions.includes(bedrooms) ? bedrooms : bedroomOptions[0]}
        onChange={setBedrooms}
        options={bedroomOptions}
      />

      <SelectField
        label={t("search.budget")}
        value={budget}
        onChange={setBudget}
        options={budgetOptions}
      />

      <div className="mt-6 flex flex-shrink-0 items-end pb-1 sm:mt-0 sm:ms-6">
        <button
          type="button"
          className="group flex h-14 items-center justify-center rounded-full bg-[#0a0f1d] px-4 text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#0a0f1d] hover:px-5 active:scale-[0.98]"
          aria-label={t("search.search")}
        >
          <span className="max-w-0 overflow-hidden text-sm font-medium tracking-wide whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:me-2.5 group-hover:max-w-[4.5rem] group-hover:opacity-100">
            {t("search.search")}
          </span>
          <Search className="h-6 w-6 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
