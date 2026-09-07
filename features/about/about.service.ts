import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase/firebase";
import type { Locale } from "@/lib/i18n/types";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";

const COLLECTION = "about";
const DOC_ID = "main";

export const DEFAULT_ABOUT_IMAGE = "/properites/1.webp";
export const DEFAULT_VISION_MISSION_IMAGE = "/visionmission.webp";
export const DEFAULT_ABOUT_PDF = "/بروفايل مقصد V2.pdf";

export type AboutFeature = {
  textAr?: string;
  textEn?: string;
};

export type AboutPageData = {
  headerTitleAr?: string;
  headerTitleEn?: string;
  aboutImage?: string;
  badgeAr?: string;
  badgeEn?: string;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  features?: AboutFeature[];
  buttonTextAr?: string;
  buttonTextEn?: string;
  profilePdf?: string;
  visionMissionImage?: string;
  missionTitleAr?: string;
  missionTitleEn?: string;
  missionSubtitleAr?: string;
  missionSubtitleEn?: string;
  visionTitleAr?: string;
  visionTitleEn?: string;
  visionSubtitleAr?: string;
  visionSubtitleEn?: string;
};

export const DEFAULT_ABOUT_FEATURES: AboutFeature[] = [
  { textAr: "خدمات عقارية احترافية", textEn: "Professional Real Estate Services" },
  { textAr: "جودة التشييد والتنفيذ", textEn: "Quality Construction & Execution" },
  { textAr: "مواكبة رؤية 2030", textEn: "Aligned with Vision 2030" },
  { textAr: "تلبية متطلبات العصر", textEn: "Meeting Modern Needs" },
];

export const ABOUT_DEFAULTS = {
  headerTitleAr: ar.nav.about,
  headerTitleEn: en.nav.about,
  badgeAr: "من نحن",
  badgeEn: "About Us",
  titleAr: "مقصد العقارية",
  titleEn: "MAQSED Real Estate",
  subtitleAr: "رؤية واعدة للمستقبل",
  subtitleEn: "A Promising Vision for the Future",
  descriptionAr:
    "تأسست شركة مقصد لتكون الخيار الأول في عالم التطوير العقاري، حيث نهدف إلى بناء مجتمعات سكنية عصرية تدمج بين الابتكار في التصميم وأعلى معايير الجودة. نحن نلتزم بتطوير وجهات عمرانية تلهم الأجيال القادمة وتحقق أعلى درجات الاستدامة والرفاهية لعملائنا، تماشياً مع الطموحات المستقبلية للمملكة.",
  descriptionEn:
    "MAQSED was established to be the premier choice in real estate development, aiming to build modern residential communities that blend innovative design with the highest quality standards. We are committed to developing urban destinations that inspire future generations and achieve maximum sustainability and luxury for our clients, in line with the Kingdom's future aspirations.",
  buttonTextAr: "تحميل بروفايل الشركة",
  buttonTextEn: "Download Company Profile",
  missionTitleAr: ar.visionMission.mission.title,
  missionTitleEn: en.visionMission.mission.title,
  missionSubtitleAr: ar.visionMission.mission.description,
  missionSubtitleEn: en.visionMission.mission.description,
  visionTitleAr: ar.visionMission.vision.title,
  visionTitleEn: en.visionMission.vision.title,
  visionSubtitleAr: ar.visionMission.vision.description,
  visionSubtitleEn: en.visionMission.vision.description,
  aboutImage: DEFAULT_ABOUT_IMAGE,
  visionMissionImage: DEFAULT_VISION_MISSION_IMAGE,
  profilePdf: DEFAULT_ABOUT_PDF,
  features: DEFAULT_ABOUT_FEATURES,
};

function pick(value: string | undefined, fallback: string): string {
  return (value || "").trim() || fallback;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\u0600-\u06FF-]/g, "_");
}

export type ResolvedAboutContent = {
  headerTitle: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonText: string;
  aboutImage: string;
  profilePdf: string;
  visionMissionImage: string;
  missionTitle: string;
  missionSubtitle: string;
  visionTitle: string;
  visionSubtitle: string;
};

export function resolveAboutContent(
  data: AboutPageData | null | undefined,
  locale: Locale
): ResolvedAboutContent {
  const isAr = locale === "ar";

  const featuresSource =
    Array.isArray(data?.features) && data.features.length > 0
      ? data.features
      : DEFAULT_ABOUT_FEATURES;

  return {
    headerTitle: pick(
      isAr ? data?.headerTitleAr : data?.headerTitleEn,
      isAr ? ABOUT_DEFAULTS.headerTitleAr : ABOUT_DEFAULTS.headerTitleEn
    ),
    badge: pick(isAr ? data?.badgeAr : data?.badgeEn, isAr ? ABOUT_DEFAULTS.badgeAr : ABOUT_DEFAULTS.badgeEn),
    title: pick(isAr ? data?.titleAr : data?.titleEn, isAr ? ABOUT_DEFAULTS.titleAr : ABOUT_DEFAULTS.titleEn),
    subtitle: pick(
      isAr ? data?.subtitleAr : data?.subtitleEn,
      isAr ? ABOUT_DEFAULTS.subtitleAr : ABOUT_DEFAULTS.subtitleEn
    ),
    description: pick(
      isAr ? data?.descriptionAr : data?.descriptionEn,
      isAr ? ABOUT_DEFAULTS.descriptionAr : ABOUT_DEFAULTS.descriptionEn
    ),
    features: featuresSource
      .map((feature) =>
        pick(
          isAr ? feature.textAr : feature.textEn,
          isAr ? feature.textEn || "" : feature.textAr || ""
        )
      )
      .filter(Boolean),
    buttonText: pick(
      isAr ? data?.buttonTextAr : data?.buttonTextEn,
      isAr ? ABOUT_DEFAULTS.buttonTextAr : ABOUT_DEFAULTS.buttonTextEn
    ),
    aboutImage: pick(data?.aboutImage, DEFAULT_ABOUT_IMAGE),
    profilePdf: pick(data?.profilePdf, DEFAULT_ABOUT_PDF),
    visionMissionImage: pick(data?.visionMissionImage, DEFAULT_VISION_MISSION_IMAGE),
    missionTitle: pick(
      isAr ? data?.missionTitleAr : data?.missionTitleEn,
      isAr ? ABOUT_DEFAULTS.missionTitleAr : ABOUT_DEFAULTS.missionTitleEn
    ),
    missionSubtitle: pick(
      isAr ? data?.missionSubtitleAr : data?.missionSubtitleEn,
      isAr ? ABOUT_DEFAULTS.missionSubtitleAr : ABOUT_DEFAULTS.missionSubtitleEn
    ),
    visionTitle: pick(
      isAr ? data?.visionTitleAr : data?.visionTitleEn,
      isAr ? ABOUT_DEFAULTS.visionTitleAr : ABOUT_DEFAULTS.visionTitleEn
    ),
    visionSubtitle: pick(
      isAr ? data?.visionSubtitleAr : data?.visionSubtitleEn,
      isAr ? ABOUT_DEFAULTS.visionSubtitleAr : ABOUT_DEFAULTS.visionSubtitleEn
    ),
  };
}

async function uploadFile(folder: string, file: File): Promise<string> {
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export const aboutService = {
  async getAbout(): Promise<AboutPageData | null> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (!snap.exists()) return null;
    return snap.data() as AboutPageData;
  },

  async saveAbout(data: AboutPageData): Promise<void> {
    await setDoc(
      doc(db, COLLECTION, DOC_ID),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  uploadImage(file: File): Promise<string> {
    return uploadFile("about/images", file);
  },

  uploadPdf(file: File): Promise<string> {
    return uploadFile("about/pdfs", file);
  },
};
