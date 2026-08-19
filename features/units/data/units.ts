export type UnitListing = {
  id: string;
  typeAr: string;
  typeEn: string;
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  statusAr: string;
  statusEn: "Available" | "Sold" | "Reserved";
  gallery: string[];
  descriptionAr: string;
  descriptionEn: string;
  propertyId?: number; // Optional reference to a property in listings.ts
  locationEn: string; // Used for standalone properties
  locationAr: string;
  relation: "Property" | "Standalone"; // Used for filters
  buyerEn?: string;
  buyerAr?: string;
};

export const allUnits: UnitListing[] = [
  // Linked to Property 1 (Al Qirawan Estate)
  {
    id: "A-101",
    typeAr: "شقة فاخرة",
    typeEn: "Luxury Apartment",
    beds: 3,
    baths: 3,
    sqft: 180,
    price: "1,200,000",
    statusAr: "متاح",
    statusEn: "Available",
    gallery: [
      "/units.webp",
      "/units.webp",
      "/units.webp",
    ],
    descriptionAr: "شقة فاخرة بتصميم عصري وإطلالة بانورامية. تحتوي على صالة فسيحة ونوافذ ممتدة من الأرض إلى السقف، بالإضافة إلى تشطيبات راقية.",
    descriptionEn: "A luxurious apartment with a modern design and panoramic views. It features a spacious living area, floor-to-ceiling windows, and high-end finishes.",
    propertyId: 1,
    locationEn: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    relation: "Property",
  },
  {
    id: "A-102",
    typeAr: "شقة",
    typeEn: "Apartment",
    beds: 2,
    baths: 2,
    sqft: 140,
    price: "950,000",
    statusAr: "مباع",
    statusEn: "Sold",
    gallery: [
      "/units.webp",
      "/units.webp",
      "/units.webp",
    ],
    descriptionAr: "شقة عملية ومريحة بتصميم ذكي يستغل المساحات، مثالية للعائلات الصغيرة. تتميز بموقع استراتيجي داخل المشروع.",
    descriptionEn: "A practical and comfortable apartment with a smart space-saving design, perfect for small families. Strategically located within the project.",
    propertyId: 1,
    locationEn: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    relation: "Property",
    buyerEn: "Mohammed Al-Saud",
    buyerAr: "محمد السعود",
  },
  
  // Linked to Property 2 (Al Malqa Tower Residences)
  {
    id: "B-201",
    typeAr: "بنتهاوس",
    typeEn: "Penthouse",
    beds: 4,
    baths: 5,
    sqft: 320,
    price: "2,800,000",
    statusAr: "متاح",
    statusEn: "Available",
    gallery: [
      "/units.webp",
      "/units.webp",
      "/units.webp",
    ],
    descriptionAr: "بنتهاوس استثنائي مع تراس خارجي خاص ومسبح. يوفر أقصى درجات الخصوصية والرفاهية بأعلى معايير الجودة.",
    descriptionEn: "An exceptional penthouse with a private outdoor terrace and pool. It offers the utmost privacy and luxury with the highest quality standards.",
    propertyId: 2,
    locationEn: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    relation: "Property",
  },
  {
    id: "B-202",
    typeAr: "شقة",
    typeEn: "Apartment",
    beds: 3,
    baths: 4,
    sqft: 195,
    price: "1,450,000",
    statusAr: "محجوز",
    statusEn: "Reserved",
    gallery: [
      "/units.webp",
      "/units.webp",
      "/units.webp",
    ],
    descriptionAr: "شقة واسعة تتميز بتصميم أنيق ومساحات مضيئة طبيعياً. قريبة من المرافق الرئيسية وتعتبر استثماراً ممتازاً.",
    descriptionEn: "A spacious apartment featuring an elegant design and naturally lit spaces. Close to main facilities and considered an excellent investment.",
    propertyId: 2,
    locationEn: "Riyadh, Saudi Arabia",
    locationAr: "الرياض، المملكة العربية السعودية",
    relation: "Property",
  },

  // Standalone units
  {
    id: "C-301",
    typeAr: "فيلا مستقلة",
    typeEn: "Standalone Villa",
    beds: 5,
    baths: 6,
    sqft: 450,
    price: "4,500,000",
    statusAr: "متاح",
    statusEn: "Available",
    gallery: [
      "/properites/3.webp",
      "/properites/1.webp",
      "/properites/2.webp",
    ],
    descriptionAr: "فيلا مستقلة رائعة بتصميم فريد وتشطيبات لا مثيل لها.",
    descriptionEn: "A gorgeous standalone villa with unique design and unmatched finishes.",
    locationEn: "Dubai, UAE",
    locationAr: "دبي، الإمارات العربية المتحدة",
    relation: "Standalone",
  },
  {
    id: "D-401",
    typeAr: "منزل عائلي",
    typeEn: "Family House",
    beds: 4,
    baths: 3,
    sqft: 280,
    price: "3,200,000",
    statusAr: "متاح",
    statusEn: "Available",
    gallery: [
      "/properites/5.avif",
      "/properites/4.avif",
      "/properites/6.webp",
    ],
    descriptionAr: "منزل عائلي مثالي يقع في منطقة هادئة وراقية، يضم مساحات خضراء واسعة ومرافق ممتازة للعائلة.",
    descriptionEn: "A perfect family house located in a quiet, upscale neighborhood with large green spaces and excellent family amenities.",
    locationEn: "Los Angeles, USA",
    locationAr: "لوس أنجلوس، الولايات المتحدة",
    relation: "Standalone",
  },
];

export function getUnitById(id: string): UnitListing | undefined {
  return allUnits.find((unit) => unit.id === id);
}

export function getUnitsByPropertyId(propertyId: number): UnitListing[] {
  return allUnits.filter((unit) => unit.propertyId === propertyId);
}
