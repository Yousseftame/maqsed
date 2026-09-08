export type MenuScope = "project" | "unit";

export type MenuCategoryKey =
  | "projectFeatures"
  | "services"
  | "guarantees"
  | "specialOffers"
  | "nearbyLocations"
  | "unitComponents"
  | "unitFeatures"
  | "unitFacade";

export type MenuOption = {
  id: string;
  scope: MenuScope;
  category: MenuCategoryKey;
  value: string;
  labelAr: string;
  labelEn: string;
  order: number;
};

export type MenuOptionInput = {
  labelAr: string;
  labelEn: string;
};

export const PROJECT_CATEGORIES: MenuCategoryKey[] = [
  "projectFeatures",
  "services",
  "guarantees",
  "specialOffers",
  "nearbyLocations",
];

export const UNIT_CATEGORIES: MenuCategoryKey[] = [
  "unitComponents",
  "unitFeatures",
  "unitFacade",
];

export function categoriesForScope(scope: MenuScope): MenuCategoryKey[] {
  return scope === "project" ? PROJECT_CATEGORIES : UNIT_CATEGORIES;
}

export const DEFAULT_MENU_OPTIONS: Omit<MenuOption, "order">[] = [
  { id: "compound", scope: "project", category: "projectFeatures", value: "compound", labelAr: "كمباوند", labelEn: "Compound" },

  { id: "cleaning", scope: "project", category: "services", value: "cleaning", labelAr: "نظافة", labelEn: "Cleaning" },
  { id: "cameras", scope: "project", category: "services", value: "cameras", labelAr: "كاميرات مراقبة", labelEn: "Surveillance Cameras" },

  { id: "structure", scope: "project", category: "guarantees", value: "structure", labelAr: "الهيكل 10 سنوات", labelEn: "Structure 10 years" },
  { id: "electric", scope: "project", category: "guarantees", value: "electric", labelAr: "الكهرباء 10 سنوات", labelEn: "Electricity 10 years" },
  { id: "plumbing", scope: "project", category: "guarantees", value: "plumbing", labelAr: "السباكة", labelEn: "Plumbing" },

  { id: "ac", scope: "project", category: "specialOffers", value: "ac", labelAr: "مكيفات مجانية", labelEn: "Free Air Conditioners" },

  { id: "loc-school", scope: "project", category: "nearbyLocations", value: "مدرسة", labelAr: "مدرسة", labelEn: "School" },
  { id: "loc-hospital", scope: "project", category: "nearbyLocations", value: "مستشفى", labelAr: "مستشفى", labelEn: "Hospital" },
  { id: "loc-mosque", scope: "project", category: "nearbyLocations", value: "مسجد", labelAr: "مسجد", labelEn: "Mosque" },
  { id: "loc-mall", scope: "project", category: "nearbyLocations", value: "مول تجاري", labelAr: "مول تجاري", labelEn: "Shopping Mall" },
  { id: "loc-metro", scope: "project", category: "nearbyLocations", value: "محطة مترو", labelAr: "محطة مترو", labelEn: "Metro Station" },
  { id: "loc-grocery", scope: "project", category: "nearbyLocations", value: "بقالة", labelAr: "بقالة", labelEn: "Grocery" },

  { id: "unit-kitchen", scope: "unit", category: "unitComponents", value: "مطبخ", labelAr: "مطبخ", labelEn: "Kitchen" },
  { id: "unit-majlis", scope: "unit", category: "unitComponents", value: "مجلس", labelAr: "مجلس", labelEn: "Majlis" },
  { id: "unit-living", scope: "unit", category: "unitComponents", value: "صالة واسعة", labelAr: "صالة واسعة", labelEn: "Large Living Room" },
  { id: "unit-storage", scope: "unit", category: "unitComponents", value: "مستودع", labelAr: "مستودع", labelEn: "Storage" },
  { id: "unit-laundry", scope: "unit", category: "unitComponents", value: "غرفة غسيل", labelAr: "غرفة غسيل", labelEn: "Laundry Room" },
  { id: "unit-driver", scope: "unit", category: "unitComponents", value: "غرفة سائق", labelAr: "غرفة سائق", labelEn: "Driver's Room" },

  { id: "unit-balcony", scope: "unit", category: "unitFeatures", value: "بلكونة", labelAr: "بلكونة", labelEn: "Balcony" },
  { id: "unit-central-ac", scope: "unit", category: "unitFeatures", value: "تكييف مركزي", labelAr: "تكييف مركزي", labelEn: "Central AC" },
  { id: "unit-split-ac", scope: "unit", category: "unitFeatures", value: "مكيف راكب", labelAr: "مكيف راكب", labelEn: "Installed AC" },
  { id: "unit-smart-entry", scope: "unit", category: "unitFeatures", value: "دخول ذكي", labelAr: "دخول ذكي", labelEn: "Smart Entry" },
  { id: "unit-private-parking", scope: "unit", category: "unitFeatures", value: "موقف خاص", labelAr: "موقف خاص", labelEn: "Private Parking" },
  { id: "unit-indoor-parking", scope: "unit", category: "unitFeatures", value: "موقف داخلي", labelAr: "موقف داخلي", labelEn: "Indoor Parking" },
  { id: "unit-outdoor-parking", scope: "unit", category: "unitFeatures", value: "موقف خارجي", labelAr: "موقف خارجي", labelEn: "Outdoor Parking" },

  { id: "facade-front", scope: "unit", category: "unitFacade", value: "أمامية", labelAr: "أمامية", labelEn: "Front" },
  { id: "facade-side", scope: "unit", category: "unitFacade", value: "جانبية", labelAr: "جانبية", labelEn: "Side" },
  { id: "facade-back", scope: "unit", category: "unitFacade", value: "خلفية", labelAr: "خلفية", labelEn: "Back" },
];
