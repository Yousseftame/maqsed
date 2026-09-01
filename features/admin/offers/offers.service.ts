import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export interface OfferData {
  id: string;
  title: string;
  projectName: string;
  developerName: string;
  developerEmail: string;
  developerPhone: string;
  financialAmount: string | number;
  technicalDetails: string;
  status: "creating" | "pending" | "viewed" | "accepted" | "rejected";
  secretCode?: string;
  createdAt?: any;
  viewedAt?: any;
  respondedAt?: any;
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
}

export const offersService = new OffersService();
