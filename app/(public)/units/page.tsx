import { UnitsHero } from "@/features/units/components/UnitsHero";
import { UnitsListing } from "@/features/units/components/UnitsListing";
import { JsonLd } from "@/lib/seo/json-ld";
import { collectionPageJsonLd } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

const TITLE = "الوحدات";
const DESCRIPTION = "تصفح الوحدات المتاحة للبيع مع مقصد: شقق وفلل ووحدات مستقلة بمساحات وأسعار واضحة.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/units",
});

export default function UnitsPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <JsonLd data={collectionPageJsonLd(TITLE, "/units", DESCRIPTION)} />
      <UnitsHero />
      <UnitsListing />
    </div>
  );
}
