import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";
import { ar } from "@/lib/i18n/dictionaries/ar";

const COLLECTION = "herosection";
const DOC_ID = "main";
export const DEFAULT_HERO_IMAGE = "/9.avif";

function collapseText(value: string): string {
  return value.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
}

export function withArabicHeroTitleBreak(title: string): string {
  const defaultTitle = ar.hero.title;
  if (collapseText(title) === collapseText(defaultTitle)) {
    return defaultTitle;
  }
  return title;
}

export type HeroSectionData = {
  title?: string;
  subtitle?: string;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  backgroundImage?: string;
  backgroundImages?: string[];
};

export function resolveHeroImages(data: HeroSectionData | null | undefined): string[] {
  const gallery = (data?.backgroundImages || []).map((url) => url.trim()).filter(Boolean);
  if (gallery.length > 0) return gallery;
  const single = (data?.backgroundImage || "").trim();
  if (single) return [single];
  return [DEFAULT_HERO_IMAGE];
}

export function resolveHeroCopy(
  data: HeroSectionData | null | undefined,
  locale: Locale,
  fallbacks: { title: string; subtitle: string }
): { title: string; subtitle: string } {
  const isAr = locale === "ar";
  const localizedTitle = isAr ? data?.titleAr : data?.titleEn;
  const localizedSubtitle = isAr ? data?.subtitleAr : data?.subtitleEn;
  const title =
    (localizedTitle || (isAr ? data?.title : "") || fallbacks.title).trim() || fallbacks.title;
  const subtitle =
    (localizedSubtitle || (isAr ? data?.subtitle : "") || fallbacks.subtitle).trim() ||
    fallbacks.subtitle;
  return {
    title: isAr ? withArabicHeroTitleBreak(title) : title,
    subtitle,
  };
}

export const heroService = {
  async getHero(): Promise<HeroSectionData | null> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    return snap.data() as HeroSectionData;
  },

  async saveHero(data: HeroSectionData): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  async uploadBackground(file: File): Promise<string> {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const storageRef = ref(storage, `herosection/${uniqueName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
};
