import type { Metadata } from "next";
import { PropertiesHero } from "@/features/properties/components/PropertiesHero";
import { PropertiesListing } from "@/features/properties/components/PropertiesListing";

export const metadata: Metadata = {
  title: "Properties | MAQSED",
  description:
    "Explore perfect family homes and premium properties with MAQSED.",
};

export default function PropertiesPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <PropertiesHero />
      <PropertiesListing />
    </div>
  );
}
