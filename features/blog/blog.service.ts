import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";

const COLLECTION = "blog";

export type BlogPost = {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  coverImage: string;
  storagePath?: string;
  published: boolean;
  publishedAt: number | null;
  createdAt: number;
  updatedAt: number;
  order: number;
  authorAr: string;
  authorEn: string;
  categoryAr: string;
  categoryEn: string;
};

export type BlogPostInput = {
  titleAr: string;
  titleEn: string;
  slug: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  coverImage: string;
  storagePath?: string;
  published: boolean;
  authorAr: string;
  authorEn: string;
  categoryAr: string;
  categoryEn: string;
};

export type ResolvedBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  publishedAt: number | null;
  createdAt: number;
  author: string;
  category: string;
};

function toMillis(value: unknown): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === "object" && value !== null && "toMillis" in value) {
    return (value as Timestamp).toMillis();
  }
  return null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\u0600-\u06FF-]/g, "_");
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

function mapPost(id: string, data: Record<string, unknown>): BlogPost {
  const createdAt = toMillis(data.createdAt) || Date.now();
  return {
    id,
    titleAr: String(data.titleAr || "").trim(),
    titleEn: String(data.titleEn || "").trim(),
    slug: String(data.slug || "").trim(),
    excerptAr: String(data.excerptAr || "").trim(),
    excerptEn: String(data.excerptEn || "").trim(),
    contentAr: String(data.contentAr || "").trim(),
    contentEn: String(data.contentEn || "").trim(),
    coverImage: String(data.coverImage || "").trim(),
    storagePath: String(data.storagePath || "").trim() || undefined,
    published: Boolean(data.published),
    publishedAt: toMillis(data.publishedAt),
    createdAt,
    updatedAt: toMillis(data.updatedAt) || createdAt,
    order: typeof data.order === "number" ? data.order : -createdAt,
    authorAr: String(data.authorAr || "").trim(),
    authorEn: String(data.authorEn || "").trim(),
    categoryAr: String(data.categoryAr || "").trim(),
    categoryEn: String(data.categoryEn || "").trim(),
  };
}

function pick(value: string, fallback: string): string {
  return value.trim() || fallback;
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => a.order - b.order || (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt));
}

export function resolveBlogPost(post: BlogPost, locale: Locale): ResolvedBlogPost {
  const isAr = locale === "ar";
  return {
    id: post.id,
    slug: post.slug,
    title: pick(isAr ? post.titleAr : post.titleEn, isAr ? post.titleEn : post.titleAr),
    excerpt: pick(isAr ? post.excerptAr : post.excerptEn, isAr ? post.excerptEn : post.excerptAr),
    content: pick(isAr ? post.contentAr : post.contentEn, isAr ? post.contentEn : post.contentAr),
    coverImage: post.coverImage,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: pick(isAr ? post.authorAr : post.authorEn, isAr ? post.authorEn : post.authorAr),
    category: pick(isAr ? post.categoryAr : post.categoryEn, isAr ? post.categoryEn : post.categoryAr),
  };
}

export function estimateReadMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export const blogService = {
  async getPosts(): Promise<BlogPost[]> {
    const snap = await getDocs(collection(db, COLLECTION));
    return sortPosts(snap.docs.map((item) => mapPost(item.id, item.data() as Record<string, unknown>)));
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("published", "==", true)));
    return sortPosts(snap.docs.map((item) => mapPost(item.id, item.data() as Record<string, unknown>)));
  },

  async getPost(id: string): Promise<BlogPost | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return mapPost(snap.id, snap.data() as Record<string, unknown>);
  },

  async getPublishedBySlug(slug: string): Promise<BlogPost | null> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("slug", "==", slug)));
    const post = snap.docs[0];
    if (!post) return null;
    const mapped = mapPost(post.id, post.data() as Record<string, unknown>);
    return mapped.published ? mapped : null;
  },

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const snap = await getDocs(query(collection(db, COLLECTION), where("slug", "==", slug)));
    return snap.docs.some((item) => item.id !== excludeId);
  },

  async uploadCover(file: File): Promise<{ url: string; storagePath: string }> {
    const storagePath = `blog/covers/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${sanitizeFileName(file.name)}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    return { url: await getDownloadURL(storageRef), storagePath };
  },

  async createPost(input: BlogPostInput): Promise<string> {
    const posts = await this.getPosts();
    const assigned = posts.map((post) => post.order).filter((value) => value >= 0);
    const nextOrder = assigned.length === 0 ? 0 : Math.max(...assigned) + 1;
    const payload = {
      ...input,
      order: nextOrder,
      publishedAt: input.published ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, COLLECTION), payload);
    return docRef.id;
  },

  async updatePost(id: string, input: BlogPostInput, previous: BlogPost): Promise<void> {
    const payload: Record<string, unknown> = {
      ...input,
      updatedAt: serverTimestamp(),
    };
    if (input.published && !previous.publishedAt) {
      payload.publishedAt = serverTimestamp();
    }
    if (!input.published) {
      payload.publishedAt = null;
    }
    await updateDoc(doc(db, COLLECTION, id), payload);
  },

  async deletePost(post: BlogPost): Promise<void> {
    if (post.storagePath) {
      try {
        await deleteObject(ref(storage, post.storagePath));
      } catch {
        // Keep deleting the document even if the file is already gone.
      }
    }
    await deleteDoc(doc(db, COLLECTION, post.id));
  },

  async reorderPosts(posts: BlogPost[]): Promise<void> {
    const batch = writeBatch(db);
    posts.forEach((post, index) => {
      batch.update(doc(db, COLLECTION, post.id), {
        order: index,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
  },
};
