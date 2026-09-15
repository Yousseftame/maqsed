import { AboutHeader } from "@/components/shared/AboutHeader";
import { AboutSection } from "@/features/home/components/AboutSection";
import { VisionMissionSection } from "@/features/home/components/VisionMissionSection";
import { PartnersSection } from "@/features/home/components/PartnersSection";
import { JsonLd } from "@/lib/seo/json-ld";
import { aboutPageJsonLd } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "عن مقصد",
  description:
    "تعرف على مقصد، رؤيتنا، رسالتنا، وقيمنا كمنصة عقارية سعودية تجمع المشاريع والوحدات في مكان واحد.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <JsonLd data={aboutPageJsonLd()} />
      <AboutHeader />
      <AboutSection />
      <VisionMissionSection />
      {/* <CTASection /> */}

      {/* <StatsSection /> */}
      <PartnersSection />
    </div>
  );
}
