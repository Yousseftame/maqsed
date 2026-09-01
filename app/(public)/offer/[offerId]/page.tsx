import { PublicOfferSection } from "@/features/developer/offers/PublicOfferSection";

export default async function OfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;
  return <PublicOfferSection offerId={offerId} />;
}
