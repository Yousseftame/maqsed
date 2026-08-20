export type MenuCategory = 
  | "unitFeatures"
  | "unitComponents"
  | "projectFeatures"
  | "services"
  | "guarantees"
  | "specialOffers"
  | "nearbyLocations";

export type MenuItem = {
  id: string;
  name: { en: string; ar: string };
  category: MenuCategory;
};

export const MENU_ITEMS: MenuItem[] = [
  // Unit Features
  { id: "1", category: "unitFeatures", name: { en: "Balcony", ar: "بلكونة" } },
  { id: "2", category: "unitFeatures", name: { en: "Laundry Room", ar: "غرفة غسيل" } },
  { id: "3", category: "unitFeatures", name: { en: "Installed AC", ar: "مكيف راكب" } },
  { id: "4", category: "unitFeatures", name: { en: "Smart Home System", ar: "نظام منزل ذكي" } },
  
  // Project Features
  { id: "5", category: "projectFeatures", name: { en: "Gym", ar: "صالة رياضية" } },
  { id: "6", category: "projectFeatures", name: { en: "Swimming Pool", ar: "مسبح" } },
  { id: "7", category: "projectFeatures", name: { en: "Kids Area", ar: "منطقة أطفال" } },

  // Services
  { id: "8", category: "services", name: { en: "Cleaning", ar: "نظافة" } },
  { id: "9", category: "services", name: { en: "Maintenance", ar: "صيانة دورية" } },

  // Nearby Locations
  { id: "10", category: "nearbyLocations", name: { en: "Hospital", ar: "مستشفى" } },
  { id: "11", category: "nearbyLocations", name: { en: "School", ar: "مدرسة" } },
  { id: "12", category: "nearbyLocations", name: { en: "Supermarket", ar: "سوبر ماركت" } },
];
