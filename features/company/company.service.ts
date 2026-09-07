import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";
import { COMPANY_DEFAULTS, DEFAULT_COMPANY_LOGO } from "@/features/admin/company/data";

const COLLECTION = "company";
const DOC_ID = "main";

export type CompanyPageData = {
  logo?: string;
  phone?: string;
  email?: string;
  locationAr?: string;
  locationEn?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  ownerAr?: string;
  ownerEn?: string;
  commercial?: string;
  fal?: string;
  complaints?: string;
};

export type ResolvedCompanyContent = {
  logo: string;
  phone: string;
  email: string;
  location: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  owner: string;
  commercial: string;
  fal: string;
  complaints: string;
};

function pick(value: string | undefined, fallback: string): string {
  return (value || "").trim() || fallback;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\u0600-\u06FF-]/g, "_");
}

export function resolveCompanyContent(
  data: CompanyPageData | null | undefined,
  locale: Locale
): ResolvedCompanyContent {
  const isAr = locale === "ar";
  return {
    logo: pick(data?.logo, DEFAULT_COMPANY_LOGO),
    phone: pick(data?.phone, COMPANY_DEFAULTS.phone),
    email: pick(data?.email, COMPANY_DEFAULTS.email),
    location: pick(
      isAr ? data?.locationAr : data?.locationEn,
      isAr ? COMPANY_DEFAULTS.locationAr : COMPANY_DEFAULTS.locationEn
    ),
    facebook: (data?.facebook || "").trim(),
    instagram: (data?.instagram || "").trim(),
    twitter: (data?.twitter || "").trim(),
    linkedin: (data?.linkedin || "").trim(),
    owner: pick(
      isAr ? data?.ownerAr : data?.ownerEn,
      isAr ? COMPANY_DEFAULTS.ownerAr : COMPANY_DEFAULTS.ownerEn
    ),
    commercial: pick(data?.commercial, COMPANY_DEFAULTS.commercial),
    fal: pick(data?.fal, COMPANY_DEFAULTS.fal),
    complaints: pick(data?.complaints, COMPANY_DEFAULTS.complaints),
  };
}

export const companyService = {
  async getCompany(): Promise<CompanyPageData | null> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    return snap.data() as CompanyPageData;
  },

  async saveCompany(data: CompanyPageData): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  async uploadLogo(file: File): Promise<string> {
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${sanitizeFileName(file.name)}`;
    const storageRef = ref(storage, `company/logo/${uniqueName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },
};
