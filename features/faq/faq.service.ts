import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";

const COLLECTION = "faqs";
export const FAQ_FEATURED_LIMIT = 10;

export type FaqItem = {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  featured: boolean;
  order: number;
};

export type FaqItemInput = {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
};

export type ResolvedFaqItem = {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
};

function pick(value: string, fallback: string): string {
  return value.trim() || fallback.trim();
}

function sortItems(items: FaqItem[]): FaqItem[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });
}

function mapItem(id: string, data: Record<string, unknown>, fallbackOrder: number): FaqItem {
  return {
    id,
    questionAr: String(data.questionAr || "").trim(),
    questionEn: String(data.questionEn || "").trim(),
    answerAr: String(data.answerAr || "").trim(),
    answerEn: String(data.answerEn || "").trim(),
    featured: data.featured === true,
    order: typeof data.order === "number" ? data.order : fallbackOrder,
  };
}

export function resolveFaqItem(item: FaqItem, locale: Locale): ResolvedFaqItem {
  const isAr = locale === "ar";
  return {
    id: item.id,
    question: pick(isAr ? item.questionAr : item.questionEn, isAr ? item.questionEn : item.questionAr),
    answer: pick(isAr ? item.answerAr : item.answerEn, isAr ? item.answerEn : item.answerAr),
    featured: item.featured,
  };
}

export const faqService = {
  async getItems(): Promise<FaqItem[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return sortItems(
      snap.docs.map((item, index) => mapItem(item.id, item.data() as Record<string, unknown>, index))
    );
  },

  async addItem(order: number, input: FaqItemInput): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      questionAr: input.questionAr.trim(),
      questionEn: input.questionEn.trim(),
      answerAr: input.answerAr.trim(),
      answerEn: input.answerEn.trim(),
      featured: false,
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateItem(id: string, data: Partial<FaqItemInput> & { featured?: boolean }): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async reorderItems(items: FaqItem[]): Promise<void> {
    const batch = writeBatch(db);
    items.forEach((item, index) => {
      batch.update(doc(db, COLLECTION, item.id), {
        order: index,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  },
};
