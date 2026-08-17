"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const SelectField = ({
  label,
  value,
  onChange,
  options,
  tone = "light",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  tone?: "light" | "dark";
}) => (
  <div
    className={cn(
      "flex min-w-[200px] flex-1 flex-col border-b-2 pb-3",
      tone === "dark" ? "border-white/25" : "border-[#8c8c8c]"
    )}
  >
    <label
      className={cn(
        "mb-6 text-base font-medium tracking-wide whitespace-nowrap",
        tone === "dark" ? "text-white/45" : "text-gray-500"
      )}
    >
      {label}
    </label>
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full cursor-pointer appearance-none bg-transparent ps-3 pe-10 text-lg font-semibold focus:outline-none sm:text-xl",
          tone === "dark" ? "text-white" : "text-[#0a0f1d]"
        )}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg
        className={cn(
          "pointer-events-none absolute top-1/2 end-3 h-4 w-4 flex-shrink-0 -translate-y-1/2",
          tone === "dark" ? "text-white" : "text-[#0a0f1d]"
        )}
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

export function PropertySearchBar({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const { t } = useLocale();
  const lookingOptions = [
    t("search.options.apt"),
    t("search.options.villa"),
    t("search.options.floor"),
    t("search.options.commercial"),
  ];
  const bedroomOptions = [
    t("search.options.ground"),
    t("search.options.first"),
    t("search.options.second"),
    t("search.options.third"),
    t("search.options.upper"),
  ];
  const locationOptions = [
    t("search.cities.riyadh"),
    t("search.cities.jeddah"),
    t("search.cities.neom"),
    t("search.cities.dammam"),
    t("search.cities.khobar"),
    t("search.cities.mecca"),
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
      className="mt-4 flex w-full max-w-[1150px] flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:gap-5"
      data-aos="fade-up"
    >
      <SelectField
        label={t("search.lookingFor")}
        value={lookingOptions.includes(lookingFor) ? lookingFor : lookingOptions[0]}
        onChange={setLookingFor}
        options={lookingOptions}
        tone={tone}
      />

      <SelectField
        label={t("search.locations")}
        value={locationOptions.includes(location) ? location : locationOptions[0]}
        onChange={setLocation}
        options={locationOptions}
        tone={tone}
      />

      <SelectField
        label={t("search.bedrooms")}
        value={bedroomOptions.includes(bedrooms) ? bedrooms : bedroomOptions[0]}
        onChange={setBedrooms}
        options={bedroomOptions}
        tone={tone}
      />

      <SelectField
        label={t("search.budget")}
        value={budget}
        onChange={setBudget}
        options={budgetOptions}
        tone={tone}
      />

      <div className="mt-6 flex w-full flex-shrink-0 pb-1 sm:mt-0 sm:w-auto sm:items-end sm:ms-6">
        <button
          type="button"
          className={cn(
            "group flex h-14 w-full items-center justify-center rounded-full px-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:px-5 active:scale-[0.98] sm:w-auto",
            tone === "dark"
              ? "bg-white text-[#0a0f1d] hover:bg-white"
              : "bg-[#0a0f1d] text-white hover:bg-[#0a0f1d]"
          )}
          aria-label={t("search.search")}
        >
          <span className="me-2.5 overflow-hidden text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:me-0 sm:max-w-0 sm:opacity-0 sm:group-hover:me-2.5 sm:group-hover:max-w-[4.5rem] sm:group-hover:opacity-100">
            {t("search.search")}
          </span>
          <Search className="h-6 w-6 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
