import type { Metadata } from "next";
import { UnitsHero } from "@/features/units/components/UnitsHero";
import { UnitsListing } from "@/features/units/components/UnitsListing";

export const metadata: Metadata = {
  title: "Units | MAQSED",
  description: "Explore our available units and prime real estate.",
};

export default function UnitsPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <UnitsHero />
      <UnitsListing />
    </div>
  );
}
