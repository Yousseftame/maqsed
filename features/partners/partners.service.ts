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
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";

const COLLECTION = "partners";

export type Partner = {
  id: string;
  name: string;
  logo: string;
  storagePath?: string;
  order: number;
};

export const DEFAULT_PARTNERS: Partner[] = [
  { id: "default-1", name: "Partner 1", logo: "/1779208393076_P25.svg", order: 0 },
  { id: "default-2", name: "Masakn", logo: "/masakn.svg", order: 1 },
  { id: "default-3", name: "Lbab", logo: "/lbab.svg", order: 2 },
  { id: "default-4", name: "Partner 4", logo: "/1779208393076_P25.svg", order: 3 },
  { id: "default-5", name: "Masakn", logo: "/masakn.svg", order: 4 },
  { id: "default-6", name: "Lbab", logo: "/lbab.svg", order: 5 },
];

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\u0600-\u06FF-]/g, "_");
}

function sortPartners(partners: Partner[]): Partner[] {
  return [...partners].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function resolvePartners(partners: Partner[] | null | undefined): Partner[] {
  if (!partners || partners.length === 0) return DEFAULT_PARTNERS;
  return sortPartners(partners.filter((partner) => Boolean(partner.logo)));
}

export const partnersService = {
  async getPartners(): Promise<Partner[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return sortPartners(
      snap.docs.map((item, index) => {
        const data = item.data();
        return {
          id: item.id,
          name: (data.name || "").trim(),
          logo: (data.logo || "").trim(),
          storagePath: (data.storagePath || "").trim() || undefined,
          order: typeof data.order === "number" ? data.order : index,
        };
      })
    );
  },

  async uploadLogo(file: File): Promise<{ url: string; storagePath: string }> {
    const storagePath = `partners/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${sanitizeFileName(file.name)}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    return { url: await getDownloadURL(storageRef), storagePath };
  },

  async addPartner(input: { name: string; file: File; order: number }): Promise<Partner> {
    const uploaded = await this.uploadLogo(input.file);
    const docRef = await addDoc(collection(db, COLLECTION), {
      name: input.name.trim(),
      logo: uploaded.url,
      storagePath: uploaded.storagePath,
      order: input.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      id: docRef.id,
      name: input.name.trim(),
      logo: uploaded.url,
      storagePath: uploaded.storagePath,
      order: input.order,
    };
  },

  async updatePartner(id: string, data: Partial<Pick<Partner, "name" | "order">>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePartner(partner: Partner): Promise<void> {
    if (partner.storagePath) {
      try {
        await deleteObject(ref(storage, partner.storagePath));
      } catch {
        // Keep deleting the document even if the file is already gone.
      }
    }
    await deleteDoc(doc(db, COLLECTION, partner.id));
  },

  async reorderPartners(partners: Partner[]): Promise<void> {
    const batch = writeBatch(db);
    partners.forEach((partner, index) => {
      batch.update(doc(db, COLLECTION, partner.id), {
        order: index,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  },
};
