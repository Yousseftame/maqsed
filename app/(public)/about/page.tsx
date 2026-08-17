import type { Metadata } from "next";
import { AboutSection } from "@/features/home/components/AboutSection";
import { VisionMissionSection } from "@/features/home/components/VisionMissionSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { PartnersSection } from "@/features/home/components/PartnersSection";
import { CTASection } from "@/features/home/components/CTASection";

export const metadata: Metadata = {
  title: "About Us | MAQSED",
  description: "Learn more about MAQSED, our mission, and our values.",
};

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <AboutSection />
      <VisionMissionSection />
      <StatsSection />
      <PartnersSection />
      <CTASection />
    </div>
  );
}
