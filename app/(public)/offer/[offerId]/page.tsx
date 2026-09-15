import { PublicOfferSection } from "@/features/developer/offers/PublicOfferSection";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "عرض",
  description: "تفاصيل عرض مقصد.",
  path: "/offer",
  noIndex: true,
});

export default async function OfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  return <PublicOfferSection offerId={offerId} />;
}
