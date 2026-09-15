import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  updateDoc,
  increment,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { storage } from "@/lib/firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { slugify } from "@/features/admin/projects/properties.service";
import { normalizeAdInfo } from "@/features/admin/shared/ad-info";

export type Unit = {
  id: string;
  
  // Section 1: Affiliation (التبعية والموقع)
  projectId: string; // ID of the property OR "independent"
  slug?: string;
  
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
  discountStartedAt?: Timestamp | any;

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

  adInfo?: string[];

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
  developerUid?: string;
};

function normalizeUnit(raw: Record<string, unknown> & { id?: string }): Unit {
  return {
    ...(raw as Unit),
    slug: String(raw.slug || "").trim(),
    additionalComponents: asStringArray(raw.additionalComponents),
    features: asStringArray(raw.features),
    facade: asStringArray(raw.facade),
    adInfo: normalizeAdInfo(raw.adInfo),
  };
}

export function unitPublicPath(unit: { id: string; slug?: string }): string {
  const slug = String(unit.slug || "").trim();
  return `/units/${encodeURIComponent(slug || unit.id)}`;
}

export const unitsService = {
  getUnits: async (): Promise<Unit[]> => {
    const q = query(collection(db, "units"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => normalizeUnit({ id: item.id, ...item.data() }));
  },

  getUnitById: async (id: string): Promise<Unit | null> => {
    const value = String(id || "").trim();
    if (!value) return null;
    const snap = await getDoc(doc(db, "units", value));
    if (!snap.exists()) return null;
    return normalizeUnit({ id: snap.id, ...snap.data() });
  },

  getUnitsByDeveloper: async (developerUid: string): Promise<Unit[]> => {
    const uid = String(developerUid || "").trim();
    if (!uid) return [];
    const q = query(collection(db, "units"), where("developerUid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((item) => normalizeUnit({ id: item.id, ...item.data() }))
      .sort((a, b) => {
        const aTime = typeof a.createdAt?.toMillis === "function" ? a.createdAt.toMillis() : Number(a.createdAt) || 0;
        const bTime = typeof b.createdAt?.toMillis === "function" ? b.createdAt.toMillis() : Number(b.createdAt) || 0;
        return bTime - aTime;
      });
  },

  addUnit: async (unit: Unit) => {
    await setDoc(doc(db, "units", unit.id), {
      ...normalizeUnit(unit),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  updateUnit: async (id: string, data: Partial<Unit>) => {
    const { views: _views, ...rest } = data;
    await updateDoc(doc(db, "units", id), {
      ...rest,
      ...(data.additionalComponents !== undefined
        ? { additionalComponents: asStringArray(data.additionalComponents) }
        : {}),
      ...(data.features !== undefined ? { features: asStringArray(data.features) } : {}),
      ...(data.facade !== undefined ? { facade: asStringArray(data.facade) } : {}),
      ...(data.adInfo !== undefined ? { adInfo: normalizeAdInfo(data.adInfo) } : {}),
      updatedAt: serverTimestamp(),
    });
  },

  incrementViews: async (unitId: string) => {
    const id = String(unitId || "").trim();
    if (!id) return;
    await updateDoc(doc(db, "units", id), {
      views: increment(1),
    });
  },

  deleteUnit: async (id: string) => {
    await deleteDoc(doc(db, "units", id));
  },

  generateId: () => {
    return doc(collection(db, "units")).id;
  },

  async getUnitBySlugOrId(key: string): Promise<Unit | null> {
    const value = decodeURIComponent(String(key || "").trim());
    if (!value) return null;
    const byId = await this.getUnitById(value);
    if (byId) return byId;
    const snap = await getDocs(query(collection(db, "units"), where("slug", "==", value)));
    const docSnap = snap.docs[0];
    if (!docSnap) return null;
    return normalizeUnit({ id: docSnap.id, ...docSnap.data() });
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const value = slugify(slug);
    if (!value) return false;
    const snap = await getDocs(query(collection(db, "units"), where("slug", "==", value)));
    return snap.docs.some((item) => item.id !== excludeId);
  },

  uploadImage: async (file: File, path: string) => {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storageRef = ref(storage, `${path}/${uniqueName}`);
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
