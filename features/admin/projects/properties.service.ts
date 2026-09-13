import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { storage } from "@/lib/firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { asStringArray } from "@/features/admin/menus/menu-options.service";

export type Building = {
  id: string;
  code: string;
  floorsCount: number;
  expectedUnitsCount: number;
};

export type PropertyModel = {
  id: string;
  name: string;
  propertyType: string;
  roomsCount: number;
  bathroomsCount: number;
  defaultPrice: number;
  internalArea?: number;
  externalArea?: number;
  totalArea?: number;
  additionalComponents?: string[];
  features?: string[];
  facade?: string[];
  blueprintImage: string;
};

export type NearbyPlace = {
  name: string;
  minutes: number;
};

export type Property = {
  id: string;
  name: string;
  slug?: string;
  cityId: string;
  neighborhoodId: string;
  mapsLink: string;
  brochureLink?: string;
  description?: string;
  projectType: string;
  commissionOption?: string;
  category: "luxury" | "medium" | "economic" | string;
  status: "active" | "soon" | "draft" | "soldOut" | string;
  
  buildingsCount: number;
  modelsCount: number;
  totalUnitsCount?: number;
  floorsCount?: number;

  buildings: Building[];
  models: PropertyModel[];

  features: string[];
  services: string[];
  guarantees: string[];
  offers: string[];
  locations: string[];

  images: string[];
  nearbyPlaces?: NearbyPlace[];
  partnerLogos?: string[];
  developerName?: string;
  developerLogo?: string;
  contractorName?: string;
  contractorLogo?: string;

  views?: number;
  developerUid?: string;

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
};

const PROPERTIES_COLLECTION = "properties";

function normalizeModel(model: PropertyModel): PropertyModel {
  return {
    ...model,
    additionalComponents: asStringArray(model.additionalComponents),
    features: asStringArray(model.features),
    facade: asStringArray(model.facade),
  };
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function propertyPublicPath(property: { id: string; slug?: string }): string {
  const slug = String(property.slug || "").trim();
  return `/properties/${encodeURIComponent(slug || property.id)}`;
}

function normalizeProperty(raw: Record<string, unknown> & { id: string }): Property {
  return {
    ...(raw as Property),
    id: raw.id,
    slug: String(raw.slug || "").trim(),
    features: asStringArray(raw.features),
    services: asStringArray(raw.services),
    guarantees: asStringArray(raw.guarantees),
    offers: asStringArray(raw.offers),
    locations: asStringArray(raw.locations),
    models: Array.isArray(raw.models) ? (raw.models as PropertyModel[]).map(normalizeModel) : [],
    buildings: Array.isArray(raw.buildings) ? (raw.buildings as Building[]) : [],
  };
}

export const propertiesService = {
  generateId(): string {
    return doc(collection(db, PROPERTIES_COLLECTION)).id;
  },

  async getProperties(): Promise<Property[]> {
    const q = query(collection(db, PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((item) =>
      normalizeProperty({ id: item.id, ...item.data() })
    );
  },

  async getPropertyById(id: string): Promise<Property | null> {
    if (!id) return null;
    const snap = await getDoc(doc(db, PROPERTIES_COLLECTION, id));
    if (!snap.exists()) return null;
    return normalizeProperty({ id: snap.id, ...snap.data() });
  },

  async getPropertiesByDeveloper(developerUid: string): Promise<Property[]> {
    const uid = String(developerUid || "").trim();
    if (!uid) return [];
    const snap = await getDocs(query(collection(db, PROPERTIES_COLLECTION), where("developerUid", "==", uid)));
    return snap.docs
      .map((item) => normalizeProperty({ id: item.id, ...item.data() }))
      .sort((a, b) => {
        const aTime = typeof a.createdAt?.toMillis === "function" ? a.createdAt.toMillis() : Number(a.createdAt) || 0;
        const bTime = typeof b.createdAt?.toMillis === "function" ? b.createdAt.toMillis() : Number(b.createdAt) || 0;
        return bTime - aTime;
      });
  },

  async getPropertyBySlugOrId(key: string): Promise<Property | null> {
    const value = decodeURIComponent(String(key || "").trim());
    if (!value) return null;

    const byId = await this.getPropertyById(value);
    if (byId) return byId;

    const snap = await getDocs(query(collection(db, PROPERTIES_COLLECTION), where("slug", "==", value)));
    const docSnap = snap.docs[0];
    if (!docSnap) return null;
    return normalizeProperty({ id: docSnap.id, ...docSnap.data() });
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const value = slugify(slug);
    if (!value) return false;
    const snap = await getDocs(query(collection(db, PROPERTIES_COLLECTION), where("slug", "==", value)));
    return snap.docs.some((item) => item.id !== excludeId);
  },

  async addProperty(property: Omit<Property, "createdAt" | "updatedAt">): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, property.id);
    const normalized = normalizeProperty({ ...property, id: property.id });
    await setDoc(docRef, {
      ...normalized,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateProperty(propertyId: string, data: Partial<Property>): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    const { views: _views, ...rest } = data;
    await setDoc(
      docRef,
      {
        ...rest,
        ...(data.features !== undefined ? { features: asStringArray(data.features) } : {}),
        ...(data.services !== undefined ? { services: asStringArray(data.services) } : {}),
        ...(data.guarantees !== undefined ? { guarantees: asStringArray(data.guarantees) } : {}),
        ...(data.offers !== undefined ? { offers: asStringArray(data.offers) } : {}),
        ...(data.locations !== undefined ? { locations: asStringArray(data.locations) } : {}),
        ...(data.models !== undefined
          ? { models: data.models.map((model) => normalizeModel(model)) }
          : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  async incrementViews(propertyId: string): Promise<void> {
    const id = String(propertyId || "").trim();
    if (!id) return;
    await updateDoc(doc(db, PROPERTIES_COLLECTION, id), {
      views: increment(1),
    });
  },

  async addBuilding(propertyId: string, building: Building): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      buildings: arrayUnion(building),
      updatedAt: serverTimestamp(),
    });
  },

  async removeBuilding(propertyId: string, building: Building): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      buildings: arrayRemove(building),
      updatedAt: serverTimestamp(),
    });
  },

  async addModel(propertyId: string, model: PropertyModel): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      models: arrayUnion(normalizeModel(model)),
      updatedAt: serverTimestamp(),
    });
  },

  async removeModel(propertyId: string, model: PropertyModel): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      models: arrayRemove(model),
      updatedAt: serverTimestamp(),
    });
  },

  async deleteProperty(propertyId: string): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await deleteDoc(docRef);
  },

  async uploadImage(file: File, folder: string = "properties"): Promise<string> {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storageRef = ref(storage, `${folder}/${uniqueName}`);
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
