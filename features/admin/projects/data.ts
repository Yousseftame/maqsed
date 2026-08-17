import type { StatusTone } from "@/features/admin/ui/StatusBadge";

export type ProjectStatus = "active" | "draft" | "soldOut" | "upcoming";

export type Project = {
  id: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  units: number;
  status: ProjectStatus;
  updated: { en: string; ar: string };
};

export const PROJECT_STATUS_TONE: Record<ProjectStatus, StatusTone> = {
  active: "success",
  draft: "muted",
  soldOut: "danger",
  upcoming: "accent",
};

export const PROJECTS: Project[] = [
  {
    id: "1",
    name: { en: "Silverstone Residence", ar: "سكن سيلفرستون" },
    city: { en: "Riyadh", ar: "الرياض" },
    units: 124,
    status: "active",
    updated: { en: "12 Aug 2026", ar: "١٢ أغسطس ٢٠٢٦" },
  },
  {
    id: "2",
    name: { en: "Neom Gate Towers", ar: "أبراج بوابة نيوم" },
    city: { en: "Neom", ar: "نيوم" },
    units: 86,
    status: "upcoming",
    updated: { en: "4 Aug 2026", ar: "٤ أغسطس ٢٠٢٦" },
  },
  {
    id: "3",
    name: { en: "Jeddah Waterfront Villas", ar: "فلل كورنيش جدة" },
    city: { en: "Jeddah", ar: "جدة" },
    units: 42,
    status: "active",
    updated: { en: "28 Jul 2026", ar: "٢٨ يوليو ٢٠٢٦" },
  },
  {
    id: "4",
    name: { en: "Khobar Business Park", ar: "مجمع الخبر للأعمال" },
    city: { en: "Khobar", ar: "الخبر" },
    units: 210,
    status: "draft",
    updated: { en: "19 Jul 2026", ar: "١٩ يوليو ٢٠٢٦" },
  },
  {
    id: "5",
    name: { en: "Diriyah Heritage Homes", ar: "منازل الدرعية التراثية" },
    city: { en: "Riyadh", ar: "الرياض" },
    units: 58,
    status: "soldOut",
    updated: { en: "9 Jul 2026", ar: "٩ يوليو ٢٠٢٦" },
  },
  {
    id: "6",
    name: { en: "Mecca Skyline", ar: "أفق مكة" },
    city: { en: "Mecca", ar: "مكة" },
    units: 176,
    status: "active",
    updated: { en: "2 Jul 2026", ar: "٢ يوليو ٢٠٢٦" },
  },
];
