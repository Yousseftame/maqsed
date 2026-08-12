import type { Metadata } from "next";
import { SellPage } from "@/features/sell/components/SellPage";

export const metadata: Metadata = {
  title: "Sell Your Unit | MAQSED",
  description:
    "Submit a property marketing and sale request with MAQSED. Professional listing support for your unit.",
};

export default function SellYourUnitPage() {
  return <SellPage />;
}
