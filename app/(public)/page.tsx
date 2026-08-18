import { HeroSection } from "@/features/home/components/HeroSection";
import { SearchSection } from "@/features/home/components/SearchSection";
import { CurrentPropertiesSection } from "@/features/home/components/CurrentPropertiesSection";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { AgentsSection } from "@/features/home/components/AgentsSection";
import { FAQSection } from "@/features/home/components/FAQSection";
import { CTASection } from "@/features/home/components/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <HeroSection />
      <SearchSection />
      <CurrentPropertiesSection />
      {/* <AboutSection /> */}

      <PropertiesSection />
      <AgentsSection />
      <CTASection />

      <FAQSection />
    </div>
  );
}
