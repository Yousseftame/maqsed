import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { storage } from "@/lib/firebase/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
  blueprintImage: string;
};

export type Property = {
  id: string;
  name: string;
  cityId: string;
  neighborhoodId: string;
  mapsLink: string;
  projectType: string;
  commissionOption: string;
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

  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
};

const PROPERTIES_COLLECTION = "properties";

export const propertiesService = {
  generateId(): string {
    return doc(collection(db, PROPERTIES_COLLECTION)).id;
  },

  async getProperties(): Promise<Property[]> {
    const q = query(collection(db, PROPERTIES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[];
  },

  async addProperty(property: Omit<Property, "createdAt" | "updatedAt">): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, property.id);
    await setDoc(docRef, {
      ...property,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async updateProperty(propertyId: string, data: Partial<Property>): Promise<void> {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
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
      models: arrayUnion(model),
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
    const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
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
