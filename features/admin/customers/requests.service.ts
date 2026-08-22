import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

export type RequestStatus = "new" | "contacted" | "completed" | "cancelled";

export interface ContactRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
  status: RequestStatus;
  createdAt: any;
  updatedAt: any;
}

export interface SellRequest {
  id: string;
  role: string;
  unitLocation: string;
  city: string;
  neighborhood: string;
  googleMapsLink: string;
  roomsCount: string;
  bathroomsCount: string;
  propertyAge: string;
  additionalFeatures: string;
  fullNameAlt: string;
  mobileNumber: string;
  status: RequestStatus;
  createdAt: any;
  updatedAt: any;
}

const CONTACT_COLLECTION = "contact_requests";
const SELL_COLLECTION = "sell_requests";

export const requestsService = {
  // Contact Requests
  async getContactRequests(): Promise<ContactRequest[]> {
    const q = query(collection(db, CONTACT_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactRequest));
  },

  async addContactRequest(data: Omit<ContactRequest, "id" | "createdAt" | "updatedAt" | "status">): Promise<void> {
    const docRef = doc(collection(db, CONTACT_COLLECTION));
    const now = serverTimestamp();
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    await setDoc(docRef, {
      ...cleanData,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateContactRequestStatus(id: string, status: RequestStatus): Promise<void> {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteContactRequest(id: string): Promise<void> {
    const docRef = doc(db, CONTACT_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Sell Requests
  async getSellRequests(): Promise<SellRequest[]> {
    const q = query(collection(db, SELL_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SellRequest));
  },

  async addSellRequest(data: Omit<SellRequest, "id" | "createdAt" | "updatedAt" | "status">): Promise<void> {
    const docRef = doc(collection(db, SELL_COLLECTION));
    const now = serverTimestamp();
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    await setDoc(docRef, {
      ...cleanData,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
  },

  async updateSellRequestStatus(id: string, status: RequestStatus): Promise<void> {
    const docRef = doc(db, SELL_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteSellRequest(id: string): Promise<void> {
    const docRef = doc(db, SELL_COLLECTION, id);
    await deleteDoc(docRef);
  },
};
