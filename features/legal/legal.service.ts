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

const COLLECTION = "legal";

export type LegalPageId = "privacy" | "terms";

export type LegalItem = {
  id: string;
  page: LegalPageId;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
};

export type LegalItemInput = {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
};

export type ResolvedLegalItem = {
  id: string;
  question: string;
  answer: string;
};

function pick(value: string, fallback: string): string {
  return value.trim() || fallback.trim();
}

function sortItems(items: LegalItem[]): LegalItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function mapItem(id: string, data: Record<string, unknown>, fallbackOrder: number): LegalItem {
  const page = data.page === "terms" ? "terms" : "privacy";
  return {
    id,
    page,
    questionAr: String(data.questionAr || "").trim(),
    questionEn: String(data.questionEn || "").trim(),
    answerAr: String(data.answerAr || "").trim(),
    answerEn: String(data.answerEn || "").trim(),
    order: typeof data.order === "number" ? data.order : fallbackOrder,
  };
}

export function resolveLegalItem(item: LegalItem, locale: Locale): ResolvedLegalItem {
  const isAr = locale === "ar";
  return {
    id: item.id,
    question: pick(isAr ? item.questionAr : item.questionEn, isAr ? item.questionEn : item.questionAr),
    answer: pick(isAr ? item.answerAr : item.answerEn, isAr ? item.answerEn : item.answerAr),
  };
}

export const legalService = {
  async getItems(page: LegalPageId): Promise<LegalItem[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("page", "==", page)));
    return sortItems(
      snap.docs.map((item, index) => mapItem(item.id, item.data() as Record<string, unknown>, index))
    );
  },

  async addItem(page: LegalPageId, order: number, input: LegalItemInput): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
      page,
      questionAr: input.questionAr.trim(),
      questionEn: input.questionEn.trim(),
      answerAr: input.answerAr.trim(),
      answerEn: input.answerEn.trim(),
      order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateItem(id: string, data: Partial<LegalItemInput>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },

  async reorderItems(items: LegalItem[]): Promise<void> {
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
