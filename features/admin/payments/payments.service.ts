import { offerAmount, type OfferData } from "@/features/admin/offers/offers.service";

export type PaymentRecord = {
  id: string;
  offerId: string;
  offerNumber: string;
  title: string;
  projectName: string;
  unitNumber?: string;
  developerName: string;
  amount: number;
  createdAt: number;
};

export function paymentsFromOffers(offers: OfferData[]): PaymentRecord[] {
  return offers
    .filter((offer) => offer.paymentStatus === "received")
    .map((offer) => ({
      id: offer.id,
      offerId: offer.id,
      offerNumber: offer.offerNumber || "",
      title: offer.title || "",
      projectName: offer.projectName || "",
      unitNumber: offer.unitNumber || "",
      developerName: offer.developerName || "",
      amount: offerAmount(offer),
      createdAt: Number(offer.paymentReceivedAt) || 0,
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}
