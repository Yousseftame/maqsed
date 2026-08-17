export const OVERVIEW_KPIS = [
  { id: "customers", value: "1,293", change: "36.8%", trend: "down" as const },
  { id: "balance", value: "256k", change: "36.8%", trend: "up" as const },
  { id: "projects", value: "24", change: "12%", trend: "up" as const },
  { id: "units", value: "896", change: "8.4%", trend: "up" as const },
];

export const WEEKLY_INQUIRIES = [
  { day: "sat", value: 32 },
  { day: "sun", value: 48 },
  { day: "mon", value: 41 },
  { day: "tue", value: 64 },
  { day: "wed", value: 58 },
  { day: "thu", value: 72 },
  { day: "fri", value: 39 },
];

export const CITY_PERFORMANCE = [
  { id: "riyadh", name: { en: "Riyadh", ar: "الرياض" }, value: 128 },
  { id: "jeddah", name: { en: "Jeddah", ar: "جدة" }, value: 86 },
  { id: "dammam", name: { en: "Dammam", ar: "الدمام" }, value: 54 },
  { id: "neom", name: { en: "Neom", ar: "نيوم" }, value: 41 },
  { id: "mecca", name: { en: "Mecca", ar: "مكة" }, value: 29 },
];

export const PROJECT_STATUS = [
  { id: "active", value: 14, color: "#0a0f1d" },
  { id: "upcoming", value: 5, color: "#6B7280" },
  { id: "draft", value: 3, color: "#C5C7CC" },
  { id: "soldOut", value: 2, color: "#83BF6E" },
];

export const RECENT_INQUIRIES = [
  {
    id: "1",
    name: { en: "Sara Al Harbi", ar: "سارة الحربي" },
    project: { en: "Silverstone Residence", ar: "سكن سيلفرستون" },
    status: "new" as const,
    time: { en: "12 min ago", ar: "قبل ١٢ دقيقة" },
  },
  {
    id: "2",
    name: { en: "Omar Al Qahtani", ar: "عمر القحطاني" },
    project: { en: "Neom Gate Towers", ar: "أبراج بوابة نيوم" },
    status: "pending" as const,
    time: { en: "1 hr ago", ar: "قبل ساعة" },
  },
  {
    id: "3",
    name: { en: "Lina Fahad", ar: "لينا فهد" },
    project: { en: "Jeddah Waterfront Villas", ar: "فلل كورنيش جدة" },
    status: "closed" as const,
    time: { en: "3 hr ago", ar: "قبل ٣ ساعات" },
  },
  {
    id: "4",
    name: { en: "Majed Alotaibi", ar: "ماجد العتيبي" },
    project: { en: "Diriyah Heritage Homes", ar: "منازل الدرعية" },
    status: "new" as const,
    time: { en: "Yesterday", ar: "أمس" },
  },
];
