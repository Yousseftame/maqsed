import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";

const COLLECTION = "blogCategories";
const POSTS_COLLECTION = "blog";

export type BlogCategory = {
  id: string;
  labelAr: string;
  labelEn: string;
  order: number;
};

export type BlogCategoryInput = {
  labelAr: string;
  labelEn: string;
};

function pick(value: string, fallback: string): string {
  return value.trim() || fallback.trim();
}

function sortItems(items: BlogCategory[]): BlogCategory[] {
  return [...items].sort((a, b) => a.order - b.order || a.labelAr.localeCompare(b.labelAr, "ar"));
}

function mapItem(id: string, data: Record<string, unknown>, fallbackOrder: number): BlogCategory {
  return {
    id,
    labelAr: String(data.labelAr || "").trim(),
    labelEn: String(data.labelEn || "").trim(),
    order: typeof data.order === "number" ? data.order : fallbackOrder,
  };
}

export function resolveBlogCategoryLabel(item: BlogCategory, locale: Locale): string {
  const isAr = locale === "ar";
  return pick(isAr ? item.labelAr : item.labelEn, isAr ? item.labelEn : item.labelAr);
}

export const blogCategoriesService = {
  async getItems(): Promise<BlogCategory[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return sortItems(
      snap.docs.map((item, index) => mapItem(item.id, item.data() as Record<string, unknown>, index))
    );
  },

  async addItem(order: number, input: BlogCategoryInput): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      labelAr: input.labelAr.trim(),
      labelEn: input.labelEn.trim(),
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateItem(id: string, input: BlogCategoryInput): Promise<void> {
    const labelAr = input.labelAr.trim();
    const labelEn = input.labelEn.trim();
    await updateDoc(doc(db, COLLECTION, id), {
      labelAr,
      labelEn,
      updatedAt: serverTimestamp(),
    });

    const postsSnap = await getDocs(query(collection(db, POSTS_COLLECTION), where("categoryId", "==", id)));
    if (postsSnap.empty) return;

    const batch = writeBatch(db);
    postsSnap.docs.forEach((item) => {
      batch.update(item.ref, { categoryAr: labelAr, categoryEn: labelEn, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  },

  async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
