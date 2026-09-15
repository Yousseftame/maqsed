import { HeroSection } from "@/features/home/components/HeroSection";
import { SearchSection } from "@/features/home/components/SearchSection";
import { PropertiesSection } from "@/features/home/components/PropertiesSection";
import { AgentsSection } from "@/features/home/components/AgentsSection";
import { HeroLcpPreload } from "@/components/media/HeroLcpPreload";
import { heroService, resolveHeroImages, toSerializableHero } from "@/features/home/hero.service";
import { pageMetadata, SITE_NAME } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description:
    "مقصد منصتك العقارية لاستكشاف المشاريع والوحدات السكنية في الرياض والمملكة العربية السعودية. اعثر على منزلك القادم مع مقصد.",
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const initialHero = toSerializableHero(await heroService.getHero().catch(() => undefined));

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <HeroLcpPreload src={initialHero !== undefined ? resolveHeroImages(initialHero)[0] : undefined} />
      <HeroSection initialHero={initialHero} />
      <SearchSection />
      {/* <AboutSection /> */}

      <PropertiesSection />
      <AgentsSection />
      {/* <CTASection /> */}
    </div>
  );
}
