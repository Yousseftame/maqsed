import type { Metadata } from "next";
import { UnitDetail } from "@/features/units/components/UnitDetail";
import { JsonLd } from "@/lib/seo/json-ld";
import { breadcrumbJsonLd, firstMedia, getCachedUnit, unitJsonLd } from "@/lib/seo/public-content";
import { pageMetadata, SITE_DESCRIPTION_AR } from "@/lib/seo/site";
import { unitPublicPath } from "@/features/admin/units/units.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const unit = await getCachedUnit(id);
  if (!unit) {
    return pageMetadata({
      title: "الوحدة",
      description: SITE_DESCRIPTION_AR,
      path: `/units/${encodeURIComponent(id)}`,
      noIndex: true,
    });
  }

  const name = String(unit.unitNumber || "").trim() || "وحدة";
  const description = [unit.unitType, unit.roomsCount ? `${unit.roomsCount} غرف` : "", unit.totalArea ? `${unit.totalArea} م²` : ""]
    .filter(Boolean)
    .join(" · ") || SITE_DESCRIPTION_AR;

  return pageMetadata({
    title: name,
    description,
    path: unitPublicPath(unit),
    image: firstMedia(unit.images),
  });
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const unit = await getCachedUnit(id);

  return (
    <div className="flex w-full flex-col bg-white">
      {unit ? (
        <JsonLd
          data={[
            unitJsonLd(unit),
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "/" },
              { name: "الوحدات", path: "/units" },
              { name: String(unit.unitNumber || "").trim() || "وحدة", path: unitPublicPath(unit) },
            ]),
          ]}
        />
      ) : null}
      <UnitDetail unitId={id} />
    </div>
  );
}
