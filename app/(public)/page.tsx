import { HeroSection } from "@/features/home/components/HeroSection";
import { SearchSection } from "@/features/home/components/SearchSection";
import { AboutSection } from "@/features/home/components/AboutSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { AgentsSection } from "@/features/home/components/AgentsSection";
import { PartnersSection } from "@/features/home/components/PartnersSection";
import { FAQSection } from "@/features/home/components/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <HeroSection />
      <SearchSection />
      {/* <AboutSection /> */}
      
      <PropertiesSection />
      <AgentsSection />
      <FAQSection />
      <StatsSection />
      <PartnersSection />
    </div>
  );
}
