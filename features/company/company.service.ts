import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";
import { COMPANY_DEFAULTS, DEFAULT_COMPANY_LOGO } from "@/features/admin/company/data";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const COLLECTION = "company";
const DOC_ID = "main";

export type CompanyLicense = {
  id: string;
  titleAr: string;
  titleEn: string;
  value?: string;
};

export type SocialNetwork = "facebook" | "instagram" | "twitter" | "linkedin" | "snapchat" | "tiktok";

export type SocialEnabledMap = Partial<Record<SocialNetwork, boolean>>;

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
  snapchat?: string;
  tiktok?: string;
  socialEnabled?: SocialEnabledMap;
  ownerAr?: string;
  ownerEn?: string;
  commercial?: string;
  fal?: string;
  complaints?: string;
  licenses?: CompanyLicense[];
};

export type ResolvedCompanyLicense = {
  id: string;
  title: string;
  value: string;
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
  snapchat: string;
  tiktok: string;
  owner: string;
  commercial: string;
  fal: string;
  complaints: string;
  licenses: ResolvedCompanyLicense[];
};

function pick(value: string | undefined, fallback: string): string {
  return (value || "").trim() || fallback;
}

export function isSocialEnabled(flags: SocialEnabledMap | undefined, network: SocialNetwork): boolean {
  if (!flags || typeof flags[network] !== "boolean") return true;
  return flags[network] === true;
}

function visibleSocialUrl(data: CompanyPageData | null | undefined, network: SocialNetwork): string {
  if (!isSocialEnabled(data?.socialEnabled, network)) return "";
  return String(data?.[network] || "").trim();
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\u0600-\u06FF-]/g, "_");
}

export function normalizeLicenses(raw: unknown): CompanyLicense[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const titleAr = String(record.titleAr || "").trim();
    const titleEn = String(record.titleEn || "").trim();
    const value = String(record.value || record.url || "").trim();
    const id = String(record.id || "").trim() || `license-${index}`;
    return [{ id, titleAr, titleEn, value }];
  });
}

function resolveLicenses(licenses: CompanyLicense[] | undefined, isAr: boolean): ResolvedCompanyLicense[] {
  return normalizeLicenses(licenses)
    .map((item) => {
      const title = isAr ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;
      return title ? { id: item.id, title, value: item.value || "" } : null;
    })
    .filter((item): item is ResolvedCompanyLicense => Boolean(item));
}

export function resolveCompanyContent(
  data: CompanyPageData | null | undefined,
  locale: Locale
): ResolvedCompanyContent {
  const isAr = locale === "ar";
  return {
    logo: pick(data?.logo, BRAND_ASSETS.logoSvg || DEFAULT_COMPANY_LOGO),
    phone: pick(data?.phone, COMPANY_DEFAULTS.phone),
    email: pick(data?.email, COMPANY_DEFAULTS.email),
    location: pick(
      isAr ? data?.locationAr : data?.locationEn,
      isAr ? COMPANY_DEFAULTS.locationAr : COMPANY_DEFAULTS.locationEn
    ),
    facebook: visibleSocialUrl(data, "facebook"),
    instagram: visibleSocialUrl(data, "instagram"),
    twitter: visibleSocialUrl(data, "twitter"),
    linkedin: visibleSocialUrl(data, "linkedin"),
    snapchat: visibleSocialUrl(data, "snapchat"),
    tiktok: visibleSocialUrl(data, "tiktok"),
    owner: pick(
      isAr ? data?.ownerAr : data?.ownerEn,
      isAr ? COMPANY_DEFAULTS.ownerAr : COMPANY_DEFAULTS.ownerEn
    ),
    commercial: pick(data?.commercial, COMPANY_DEFAULTS.commercial),
    fal: pick(data?.fal, COMPANY_DEFAULTS.fal),
    complaints: pick(data?.complaints, COMPANY_DEFAULTS.complaints),
    licenses: resolveLicenses(data?.licenses, isAr),
  };
}

export const companyService = {
  async getCompany(): Promise<CompanyPageData | null> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    const data = snap.data() as CompanyPageData;
    return {
      ...data,
      licenses: normalizeLicenses(data.licenses),
    };
  },

  async saveCompany(data: CompanyPageData): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      {
        ...data,
        licenses: normalizeLicenses(data.licenses),
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
