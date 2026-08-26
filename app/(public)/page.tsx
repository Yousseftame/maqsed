import { HeroSection } from "@/features/home/components/HeroSection";
import { SearchSection } from "@/features/home/components/SearchSection";
import { CurrentPropertiesSection } from "@/features/home/components/CurrentPropertiesSection";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { AgentsSection } from "@/features/home/components/AgentsSection";
import { CTASection } from "@/features/home/components/CTASection";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <HeroSection />
      <SearchSection />
      <CurrentPropertiesSection />
      {/* <AboutSection /> */}

      <PropertiesSection />
      <AgentsSection />
      {/* <CTASection /> */}
    </div>
  );
}
