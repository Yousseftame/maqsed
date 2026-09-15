import type { Metadata } from "next";
import { PropertyDetail } from "@/features/properties/components/PropertyDetail";
import { JsonLd } from "@/lib/seo/json-ld";
import {
  breadcrumbJsonLd,
  firstMedia,
  getCachedProperty,
  isPublicProperty,
  propertyJsonLd,
} from "@/lib/seo/public-content";
import { pageMetadata, SITE_DESCRIPTION_AR } from "@/lib/seo/site";
import { propertyPublicPath } from "@/features/admin/projects/properties.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getCachedProperty(id);
  if (!property || !isPublicProperty(property)) {
    return pageMetadata({
      title: "المشروع",
      description: SITE_DESCRIPTION_AR,
      path: `/properties/${encodeURIComponent(id)}`,
      noIndex: true,
    });
  }

  const name = property.name?.trim() || "مشروع";
  const description = String(property.description || "").trim() || `تفاصيل مشروع ${name} على منصة مقصد.`;
  return pageMetadata({
    title: name,
    description,
    path: propertyPublicPath(property),
    image: firstMedia(property.images),
  });
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getCachedProperty(id);
  const publicProperty = property && isPublicProperty(property) ? property : null;

  return (
    <div className="flex w-full flex-col bg-white">
      {publicProperty ? (
        <JsonLd
          data={[
            propertyJsonLd(publicProperty),
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "/" },
              { name: "المشاريع", path: "/properties" },
              { name: publicProperty.name?.trim() || "مشروع", path: propertyPublicPath(publicProperty) },
            ]),
          ]}
        />
      ) : null}
      <PropertyDetail propertyId={id} />
    </div>
  );
}
