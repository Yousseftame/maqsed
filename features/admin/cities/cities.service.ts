import { db } from "@/lib/firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { City, Neighborhood } from "./data";

const CITIES_COLLECTION = "cities";

export const citiesService = {
  generateId(): string {
    return doc(collection(db, CITIES_COLLECTION)).id;
  },

  async getCities(): Promise<City[]> {
    const q = query(collection(db, CITIES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as City[];
  },

  async addCity(city: Omit<City, "createdAt" | "updatedAt">): Promise<void> {
    const docRef = doc(db, CITIES_COLLECTION, city.id);
    await setDoc(docRef, {
      ...city,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async deleteCity(cityId: string): Promise<void> {
    const docRef = doc(db, CITIES_COLLECTION, cityId);
    await deleteDoc(docRef);
  },

  async addNeighborhood(cityId: string, neighborhood: Neighborhood): Promise<void> {
    const docRef = doc(db, CITIES_COLLECTION, cityId);
    await updateDoc(docRef, {
      neighborhoods: arrayUnion(neighborhood),
      updatedAt: serverTimestamp(),
    });
  },

  async removeNeighborhood(cityId: string, neighborhood: Neighborhood): Promise<void> {
    const docRef = doc(db, CITIES_COLLECTION, cityId);
    await updateDoc(docRef, {
      neighborhoods: arrayRemove(neighborhood),
      updatedAt: serverTimestamp(),
    });
  },
};
