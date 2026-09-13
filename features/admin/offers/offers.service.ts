import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { INDEPENDENT_PROJECT_ID } from "./offer-affiliation";

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
  projectId?: string;
  unitId?: string;
  unitNumber?: string;
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
  assignedDeveloperUid?: string;
  assignedDeveloperName?: string;
  dashboardAssignedAt?: number;
}

export function offerAmount(offer: Pick<OfferData, "total" | "financialAmount">) {
  const value = Number(offer.total || offer.financialAmount || 0);
  return Number.isFinite(value) ? value : 0;
}

export function offerFinancials(
  offer: Pick<OfferData, "subtotal" | "vat" | "total" | "financialAmount" | "services">
) {
  const servicesTotal = Array.isArray(offer.services)
    ? offer.services.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    : 0;

  let subtotal = Number(offer.subtotal);
  if (!Number.isFinite(subtotal) || subtotal <= 0) subtotal = servicesTotal;

  let vat = Number(offer.vat);
  if (!Number.isFinite(vat) || vat < 0) {
    vat = Math.round(subtotal * 0.15 * 100) / 100;
  }

  let total = Number(offer.total || offer.financialAmount || 0);
  if (!Number.isFinite(total) || total <= 0) {
    total = Math.round((subtotal + vat) * 100) / 100;
  }

  if (subtotal <= 0 && vat <= 0 && total > 0) {
    subtotal = Math.round((total / 1.15) * 100) / 100;
    vat = Math.round((total - subtotal) * 100) / 100;
  }

  return { subtotal, vat, total };
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

  async getOffersByDeveloper(developerUid: string): Promise<OfferData[]> {
    const uid = String(developerUid || "").trim();
    if (!uid) return [];
    const offersRef = collection(db, this.collectionName);
    const snapshot = await getDocs(query(offersRef, where("assignedDeveloperUid", "==", uid)));
    return snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }) as OfferData)
      .sort((a, b) => {
        const aTime = Number(a.dashboardAssignedAt || a.respondedAt || 0);
        const bTime = Number(b.dashboardAssignedAt || b.respondedAt || 0);
        return bTime - aTime;
      });
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
      projectId: string;
      unitId: string;
      unitNumber: string;
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

  async assignOfferToDashboard(
    offer: OfferData,
    developer: { uid: string; name: string }
  ): Promise<void> {
    const latest = await this.getOfferById(offer.id);
    if (!latest) {
      throw new Error("OFFER_NOT_FOUND");
    }
    if (latest.status !== "accepted") {
      throw new Error("OFFER_NOT_ACCEPTED");
    }
    if (latest.assignedDeveloperUid) {
      throw new Error("ALREADY_ASSIGNED");
    }

    const unitId = String(latest.unitId || "").trim();
    if (!unitId) {
      throw new Error("UNIT_MISSING");
    }

    const developerUid = String(developer.uid || "").trim();
    if (!developerUid) {
      throw new Error("DEVELOPER_MISSING");
    }

    const developerRef = doc(db, "users", developerUid);
    const developerSnap = await getDoc(developerRef);
    if (!developerSnap.exists() || developerSnap.data()?.role !== "developer") {
      throw new Error("DEVELOPER_INVALID");
    }
    if (developerSnap.data()?.status === "disabled") {
      throw new Error("DEVELOPER_DISABLED");
    }

    const unitRef = doc(db, "units", unitId);
    const unitSnap = await getDoc(unitRef);
    if (!unitSnap.exists()) {
      throw new Error("UNIT_NOT_FOUND");
    }

    const unitData = unitSnap.data() as { developerUid?: string; projectId?: string };
    const unitOwner = String(unitData.developerUid || "").trim();
    if (unitOwner && unitOwner !== developerUid) {
      throw new Error("UNIT_ASSIGNED_OTHER");
    }

    const projectId = String(latest.projectId || unitData.projectId || "").trim();
    const isIndependent = !projectId || projectId === INDEPENDENT_PROJECT_ID;
    let shouldCountProject = false;
    let propertyRef: ReturnType<typeof doc> | null = null;

    if (!isIndependent) {
      propertyRef = doc(db, "properties", projectId);
      const propertySnap = await getDoc(propertyRef);
      if (!propertySnap.exists()) {
        throw new Error("PROJECT_NOT_FOUND");
      }
      const existingProjectOwner = String(propertySnap.data()?.developerUid || "").trim();
      if (existingProjectOwner && existingProjectOwner !== developerUid) {
        throw new Error("PROJECT_ASSIGNED_OTHER");
      }
      shouldCountProject = !existingProjectOwner;
    }

    const unitAlreadyOwned = unitOwner === developerUid;
    const batch = writeBatch(db);

    if (propertyRef && shouldCountProject) {
      batch.update(propertyRef, {
        developerUid,
        updatedAt: serverTimestamp(),
      });
    }
    if (!unitAlreadyOwned) {
      batch.update(unitRef, {
        developerUid,
        updatedAt: serverTimestamp(),
      });
    }

    const statsUpdate: Record<string, ReturnType<typeof increment>> = {};
    if (!unitAlreadyOwned) {
      statsUpdate["developerStats.unitsCount"] = increment(1);
    }
    if (shouldCountProject) {
      statsUpdate["developerStats.projectsCount"] = increment(1);
    }
    if (Object.keys(statsUpdate).length > 0) {
      batch.update(developerRef, statsUpdate);
    }

    batch.update(doc(db, this.collectionName, latest.id), {
      assignedDeveloperUid: developerUid,
      assignedDeveloperName: developer.name,
      dashboardAssignedAt: Date.now(),
    });

    await batch.commit();
  }
}

export const offersService = new OffersService();
