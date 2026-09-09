import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export interface OfferServiceItem {
  description: string;
  price: number;
}

export interface OfferData {
  id: string;
  offerNumber?: string;
  title: string;
  description?: string;
  projectName: string;
  developerName: string;
  developerEmail: string;
  developerPhone: string;
  
  agreementTypes?: string[];
  services?: OfferServiceItem[];
  subtotal?: number;
  vat?: number;
  total?: number;

  financialAmount?: string | number;
  technicalDetails?: string;
  status: "creating" | "pending" | "viewed" | "accepted" | "rejected";
  paymentStatus?: "unpaid" | "received";
  paymentId?: string;
  paymentReceivedAt?: number;
  secretCode?: string;
  createdAt?: any;
  viewedAt?: any;
  respondedAt?: any;
}

export function offerAmount(offer: Pick<OfferData, "total" | "financialAmount">) {
  const value = Number(offer.total || offer.financialAmount || 0);
  return Number.isFinite(value) ? value : 0;
}

class OffersService {
  private readonly collectionName = "offers";

  async getOffers(): Promise<OfferData[]> {
    const offersRef = collection(db, this.collectionName);
    const q = query(offersRef, orderBy("createdAt", "desc"));
    
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OfferData[];
    } catch (error) {
      console.error("Error fetching offers with orderBy:", error);
      // Fallback without orderBy in case index is missing
      const snapshot = await getDocs(offersRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OfferData[];
    }
  }

  async getOfferById(id: string): Promise<OfferData | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as OfferData;
    }
    return null;
  }

  async getNextOfferNumber(): Promise<string> {
    const offersRef = collection(db, this.collectionName);
    const q = query(offersRef, orderBy("createdAt", "desc"), limit(1));
    try {
      const snap = await getDocs(q);
      if (snap.empty) {
        return "M-1001";
      }
      const lastDoc = snap.docs[0].data();
      const lastNumStr = lastDoc.offerNumber;
      if (lastNumStr && lastNumStr.startsWith("M-")) {
        const lastNum = parseInt(lastNumStr.replace("M-", ""), 10);
        if (!isNaN(lastNum)) {
          return `M-${lastNum + 1}`;
        }
      }
      // If the last document doesn't have a valid number, we could potentially scan,
      // but for now we'll just generate a timestamp-based fallback or M-1001 if really needed.
      return "M-1001";
    } catch (error) {
      console.error("Error getting next offer number:", error);
      // Fallback
      return `M-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  async deleteOffer(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }

  async updateOffer(
    id: string,
    data: {
      title: string;
      description?: string;
      projectName: string;
      developerName: string;
      developerEmail: string;
      developerPhone: string;
      agreementTypes: string[];
      services: OfferServiceItem[];
      subtotal: number;
      vat: number;
      total: number;
    }
  ): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, { ...data });
  }

  async setPaymentReceived(offer: OfferData): Promise<void> {
    if (offer.paymentStatus === "received") return;
    if (offer.status !== "accepted") {
      throw new Error("Payment can only be marked received after the offer is accepted");
    }
    const docRef = doc(db, this.collectionName, offer.id);
    await updateDoc(docRef, {
      paymentStatus: "received",
      paymentReceivedAt: Date.now(),
    });
  }

  async setPaymentUnpaid(offer: OfferData): Promise<void> {
    if (offer.paymentStatus !== "received") return;
    if (offer.status !== "accepted") {
      throw new Error("Payment can only be changed after the offer is accepted");
    }
    const docRef = doc(db, this.collectionName, offer.id);
    await updateDoc(docRef, {
      paymentStatus: "unpaid",
      paymentId: deleteField(),
      paymentReceivedAt: deleteField(),
    });
  }
}

export const offersService = new OffersService();
