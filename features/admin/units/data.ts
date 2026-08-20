import type { StatusTone } from "@/features/admin/ui/StatusBadge";

export type UnitStatus = "active" | "soldOut" | "available";

export type Unit = {
  id: string;
  number: string;
  type: { en: string; ar: string };
  project: { en: string; ar: string };
  locationBuilding: { en: string; ar: string };
  price: string;
  status: UnitStatus;
  views: number;
};

export const UNIT_STATUS_TONE: Record<UnitStatus, StatusTone> = {
  active: "success",
  available: "accent",
  soldOut: "danger",
};

export const UNITS: Unit[] = [
  {
    id: "1",
    number: "A-101",
    type: { en: "Apartment", ar: "شقة" },
    project: { en: "Silverstone Residence", ar: "سكن سيلفرستون" },
    locationBuilding: { en: "Building A", ar: "مبنى أ" },
    price: "1,200,000 SAR",
    status: "active",
    views: 245,
  },
  {
    id: "2",
    number: "V-22",
    type: { en: "Villa", ar: "فيلا" },
    project: { en: "Neom Gate Towers", ar: "أبراج بوابة نيوم" },
    locationBuilding: { en: "Zone 1", ar: "المنطقة 1" },
    price: "4,500,000 SAR",
    status: "available",
    views: 120,
  },
  {
    id: "3",
    number: "B-305",
    type: { en: "Apartment", ar: "شقة" },
    project: { en: "Jeddah Waterfront", ar: "كورنيش جدة" },
    locationBuilding: { en: "Building B", ar: "مبنى ب" },
    price: "950,000 SAR",
    status: "soldOut",
    views: 890,
  },
  {
    id: "4",
    number: "C-12",
    type: { en: "Office", ar: "مكتب" },
    project: { en: "Khobar Business Park", ar: "مجمع الخبر للأعمال" },
    locationBuilding: { en: "Tower C", ar: "برج ج" },
    price: "2,100,000 SAR",
    status: "available",
    views: 56,
  },
  {
    id: "5",
    number: "D-401",
    type: { en: "Penthouse", ar: "بنتهاوس" },
    project: { en: "Diriyah Heritage Homes", ar: "منازل الدرعية التراثية" },
    locationBuilding: { en: "Building D", ar: "مبنى د" },
    price: "8,750,000 SAR",
    status: "active",
    views: 1045,
  },
  {
    id: "6",
    number: "A-01",
    type: { en: "Retail", ar: "محل تجاري" },
    project: { en: "Mecca Skyline", ar: "أفق مكة" },
    locationBuilding: { en: "Ground Floor", ar: "الدور الأرضي" },
    price: "12,000,000 SAR",
    status: "soldOut",
    views: 3200,
  },
];
