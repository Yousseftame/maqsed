export type Named = { en: string; ar: string };

export type Neighborhood = {
  id: string;
  name: Named;
};

export type City = {
  id: string;
  name: Named;
  neighborhoods: Neighborhood[];
  createdAt?: any;
  updatedAt?: any;
};

export const CITIES: City[] = [
  {
    id: "riyadh",
    name: { en: "Riyadh", ar: "الرياض" },
    neighborhoods: [
      { id: "malqa", name: { en: "Al Malqa", ar: "الملقا" } },
      { id: "narjis", name: { en: "Al Narjis", ar: "النرجس" } },
      { id: "hittin", name: { en: "Hittin", ar: "حطين" } },
    ],
  },
  {
    id: "jeddah",
    name: { en: "Jeddah", ar: "جدة" },
    neighborhoods: [
      { id: "hamra", name: { en: "Al Hamra", ar: "الحمراء" } },
      { id: "shati", name: { en: "Al Shati", ar: "الشاطئ" } },
    ],
  },
  {
    id: "dammam",
    name: { en: "Dammam", ar: "الدمام" },
    neighborhoods: [{ id: "aziziyah", name: { en: "Al Aziziyah", ar: "العزيزية" } }],
  },
  {
    id: "mecca",
    name: { en: "Mecca", ar: "مكة المكرمة" },
    neighborhoods: [{ id: "awali", name: { en: "Al Awali", ar: "العوالي" } }],
  },
  {
    id: "diriyah",
    name: { en: "Diriyah", ar: "الدرعية" },
    neighborhoods: [
      { id: "jax", name: { en: "JAX", ar: "جاكس" } },
      { id: "asimah", name: { en: "Al Asimah", ar: "العاصمة" } },
    ],
  },
  {
    id: "neom",
    name: { en: "Neom", ar: "نيوم" },
    neighborhoods: [],
  },
];
