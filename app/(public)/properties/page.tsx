import { PropertiesHero } from "@/features/properties/components/PropertiesHero";
import { PropertiesListing } from "@/features/properties/components/PropertiesListing";
import { JsonLd } from "@/lib/seo/json-ld";
import { collectionPageJsonLd } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

const TITLE = "المشاريع";
const DESCRIPTION =
  "استكشف مشاريع مقصد السكنية في الرياض: مشاريع قائمة، قادمة، ومكتملة بمواصفات واضحة ووحدات متنوعة.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/properties",
});

export default function PropertiesPage() {
  return (
    <div className="flex w-full flex-col bg-white">
      <JsonLd data={collectionPageJsonLd(TITLE, "/properties", DESCRIPTION)} />
      <PropertiesHero />
      <PropertiesListing />
    </div>
  );
}
