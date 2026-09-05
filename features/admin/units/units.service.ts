import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  updateDoc,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { storage } from "@/lib/firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export type Unit = {
  id: string;
  
  // Section 1: Affiliation (التبعية والموقع)
  projectId: string; // ID of the property OR "independent"
  
  // If Independent
  cityId?: string;
  neighborhoodId?: string;
  
  // If tied to a project
  modelId?: string;
  buildingId?: string;
  floor?: string;

  // Section 2: Basic Data (البيانات الأساسية)
  status: "available" | "unavailable" | string; // متاحة | غير متاحة
  unitNumber: string;
  unitType: string; // e.g., شقة سكنية
  operationType: string; // e.g., للبيع
  price: number;
  roomsCount: number;
  bathroomsCount: number;
  totalArea: number;
  internalArea?: number;
  externalArea?: number;

  // Section 3: Offers & Discounts (العروض والخصومات المؤقتة)
  discountActive: boolean;
  discountPercentage?: number;
  discountDays?: number;

  // Section 4: Technical Details (التفاصيل الفنية)
  additionalComponents: string[]; // e.g., ['kitchen', 'maid_room']
  features: string[]; // e.g., ['balcony', 'ac']
  facade: string[]; // e.g., ['front', 'side']

  // Section 5: Independent Unit Data (بيانات الوحدة المستقلة)
  condition?: string; // e.g., جديدة, مجددة
  age?: number;
  commissionOption?: string; // e.g., بدون سعي, سعي 2.5%

  // Section 6: Analytics
  views?: number;

  // Section 7: Images
  images: string[];

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
};

export const unitsService = {
  getUnits: async (): Promise<Unit[]> => {
    const q = query(collection(db, "units"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Unit);
  },

  addUnit: async (unit: Unit) => {
    await setDoc(doc(db, "units", unit.id), {
      ...unit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  updateUnit: async (id: string, data: Partial<Unit>) => {
    await updateDoc(doc(db, "units", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  deleteUnit: async (id: string) => {
    await deleteDoc(doc(db, "units", id));
  },

  generateId: () => {
    return doc(collection(db, "units")).id;
  },

  uploadImage: async (file: File, path: string) => {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  deleteImage: async (url: string) => {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (e) {
      console.error("Error deleting image from storage:", e);
    }
  },
};
