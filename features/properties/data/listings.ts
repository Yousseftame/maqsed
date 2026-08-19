export type PropertyListing = {
  id: number;
  image: string;
  gallery: [string, string, string];
  tag: string;
  tagAr: string;
  price: string;
  title: string;
  titleAr: string;
  address: string;
  addressAr: string;
  beds: number;
  baths: number;
  sqft: string;
  year: number;
  type: string;
  typeAr: string;
  description: string;
  descriptionAr: string;
  descriptionSecondary: string;
  descriptionSecondaryAr: string;
  features: string[];
  featuresAr: string[];
  buyerEn?: string;
  buyerAr?: string;
};

const images = [
  "/properites/1.webp",
  "/properites/2.webp",
  "/properites/3.webp",
  "/properites/4.avif",
  "/properites/5.avif",
  "/properites/6.webp",
];

const baseListings: Omit<
  PropertyListing,
  "id" | "image" | "gallery" | "descriptionSecondary" | "descriptionSecondaryAr"
>[] = [
  {
    tag: "FOR SALE",
    tagAr: "للبيع",
    price: "$1,750,000",
    title: "Al Qirawan Estate",
    titleAr: "عقارات القيروان",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    addressAr: "القيروان،\nالرياض، المملكة العربية السعودية",
    beds: 4,
    baths: 4,
    sqft: "2,000",
    year: 2023,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "A stunning family home nestled in the rapidly developing Al Qirawan neighborhood. Blending timeless architecture with modern interiors — featuring soaring ceilings, a chef's kitchen, and a private garden retreat.",
    descriptionAr: "منزل عائلي مذهل يقع في حي القيروان سريع التطور. يمزج بين الهندسة المعمارية الخالدة والتصميمات الداخلية الحديثة - ويتميز بأسقف عالية ومطبخ مجهز بالكامل وحديقة خاصة.",
    features: ["Private Garden", "Chef's Kitchen", "Double Garage", "Home Office", "Smart Home", "Fireplace"],
    featuresAr: ["حديقة خاصة", "مطبخ مجهز", "مرآب مزدوج", "مكتب منزلي", "منزل ذكي", "مدفأة"],
  },
  {
    tag: "COMING SOON",
    tagAr: "قريباً",
    price: "$5,500,000",
    title: "Al Malqa Tower Residences",
    titleAr: "مساكن برج الملقا",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    addressAr: "الملقا،\nالرياض، المملكة العربية السعودية",
    beds: 2,
    baths: 2,
    sqft: "700",
    year: 2024,
    type: "Luxury Apartment",
    typeAr: "شقة فاخرة",
    description:
      "Rise above the skyline in Al Malqa Tower — a pinnacle of luxury living in the heart of Riyadh. With panoramic city views, floor-to-ceiling glass, and curated designer finishes.",
    descriptionAr: "ارتقِ فوق الأفق في برج الملقا - قمة الرفاهية في قلب الرياض. إطلالات بانورامية على المدينة، وواجهات زجاجية ممتدة من الأرض إلى السقف، وتشطيبات راقية.",
    features: ["City Views", "Concierge 24/7", "Infinity Pool", "Private Gym", "Valet Parking", "Sky Lounge"],
    featuresAr: ["إطلالات على المدينة", "خدمة كونسيرج", "مسبح إنفينيتي", "صالة ألعاب خاصة", "خدمة صف السيارات", "صالة سكاي"],
  },
  {
    tag: "SOLD OUT",
    tagAr: "مباع",
    price: "$2,600,000",
    title: "An Narjis Luxury Villa",
    titleAr: "فيلا فاخرة في النرجس",
    address: "An Narjis,\nRiyadh, Saudi Arabia",
    addressAr: "النرجس،\nالرياض، المملكة العربية السعودية",
    beds: 5,
    baths: 5,
    sqft: "850",
    year: 2022,
    type: "Modern Vila",
    typeAr: "فيلا حديثة",
    description:
      "Located in the highly sought-after An Narjis district, this luxury villa offers an unparalleled living experience with stone facades, expansive terraces and breathtaking modern design.",
    descriptionAr: "تقع هذه الفيلا الفاخرة في حي النرجس الراقي، وتقدم تجربة معيشية لا مثيل لها بواجهات حجرية وتراسات واسعة وتصميم حديث خلاب.",
    features: ["Private Pool", "City Views", "Smart Home", "Terrace Bar", "Outdoor Cinema", "Landscaped Garden"],
    featuresAr: ["مسبح خاص", "إطلالات على المدينة", "منزل ذكي", "تراس بار", "سينما خارجية", "حديقة منسقة"],
    buyerEn: "Ahmed Al-Fahad",
    buyerAr: "أحمد الفهد",
  },
  {
    tag: "FOR SALE",
    tagAr: "للبيع",
    price: "$3,200,000",
    title: "Al Yasmin Heights",
    titleAr: "مرتفعات الياسمين",
    address: "Al Yasmin,\nRiyadh, Saudi Arabia",
    addressAr: "الياسمين،\nالرياض، المملكة العربية السعودية",
    beds: 3,
    baths: 3,
    sqft: "1,200",
    year: 2023,
    type: "Luxury Apartment",
    typeAr: "شقة فاخرة",
    description:
      "Command the Riyadh skyline from this extraordinary apartment in Al Yasmin. Generous floor plans, high-end finishes, and interiors designed for absolute comfort.",
    descriptionAr: "سيطر على أفق الرياض من هذه الشقة الاستثنائية في الياسمين. مخططات طوابق واسعة، وتشطيبات راقية، وتصميمات داخلية لراحة مطلقة.",
    features: ["Wraparound Terrace", "Skyline Views", "Private Elevator", "Rooftop Access", "Security 24/7", "Heated Floors"],
    featuresAr: ["تراس محيط", "إطلالات على الأفق", "مصعد خاص", "وصول للسطح", "أمن 24/7", "أرضيات مدفأة"],
  },
  {
    tag: "COMING SOON",
    tagAr: "قريباً",
    price: "$3,100,000",
    title: "Hittin Golden Estate",
    titleAr: "عقارات حطين الذهبية",
    address: "Hittin,\nRiyadh, Saudi Arabia",
    addressAr: "حطين،\nالرياض، المملكة العربية السعودية",
    beds: 6,
    baths: 5,
    sqft: "3,500",
    year: 2024,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "Set on a generous lot in the prestigious Hittin area, this estate is a masterclass in modern living. Sun-drenched interiors, a resort-style pool, and six spacious bedrooms.",
    descriptionAr: "يقع هذا العقار على مساحة واسعة في منطقة حطين الراقية، وهو تحفة في المعيشة الحديثة. تصميمات داخلية مشمسة ومسبح بأسلوب المنتجعات وست غرف نوم واسعة.",
    features: ["Resort Pool", "Home Theater", "6-Car Garage", "Guest House", "Outdoor Kitchen", "Tennis Court"],
    featuresAr: ["مسبح منتجع", "سينما منزلية", "مرآب لـ 6 سيارات", "منزل ضيوف", "مطبخ خارجي", "ملعب تنس"],
  },
  {
    tag: "SOLD OUT",
    tagAr: "مباع",
    price: "$1,250,000",
    title: "Al Qirawan Minimalist Retreat",
    titleAr: "ملاذ القيروان البسيط",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    addressAr: "القيروان،\nالرياض، المملكة العربية السعودية",
    beds: 2,
    baths: 2,
    sqft: "950",
    year: 2022,
    type: "Modern Vila",
    typeAr: "فيلا حديثة",
    description:
      "Inspired by quiet elegance and modern architecture, this retreat in Al Qirawan is a study in restraint and beauty. Natural materials and open courtyards create a peaceful atmosphere.",
    descriptionAr: "مستوحى من الأناقة الهادئة والهندسة المعمارية الحديثة، يعتبر هذا الملاذ في القيروان دراسة في الجمال. مواد طبيعية وساحات مفتوحة تخلق جواً هادئاً.",
    features: ["Courtyard", "Private Gym", "High Ceilings", "Guest Suite", "Stone Finishes", "Smart Lighting"],
    featuresAr: ["ساحة فناء", "صالة ألعاب خاصة", "أسقف عالية", "جناح ضيوف", "تشطيبات حجرية", "إضاءة ذكية"],
    buyerEn: "Sarah Al-Rashid",
    buyerAr: "سارة الراشد",
  },
  {
    tag: "FOR SALE",
    tagAr: "للبيع",
    price: "$2,150,000",
    title: "Al Malqa Ridge Residence",
    titleAr: "سكن قمة الملقا",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    addressAr: "الملقا،\nالرياض، المملكة العربية السعودية",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    year: 2023,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "A warm and inviting residence located in Al Malqa. Open living spaces, a chef-ready kitchen, and beautiful outdoor spaces make this home ideal for growing families.",
    descriptionAr: "سكن دافئ وجذاب يقع في الملقا. مساحات معيشة مفتوحة ومطبخ مجهز ومساحات خارجية جميلة تجعل هذا المنزل مثالياً للعائلات.",
    features: ["Outdoor Deck", "Fireplace", "Mudroom", "EV Charger", "Garden", "Workshop"],
    featuresAr: ["سطح خارجي", "مدفأة", "غرفة أحذية", "شاحن سيارات", "حديقة", "ورشة عمل"],
  },
  {
    tag: "COMING SOON",
    tagAr: "قريباً",
    price: "$4,200,000",
    title: "An Narjis Court Apartments",
    titleAr: "شقق كورت النرجس",
    address: "An Narjis,\nRiyadh, Saudi Arabia",
    addressAr: "النرجس،\nالرياض، المملكة العربية السعودية",
    beds: 2,
    baths: 2,
    sqft: "1,050",
    year: 2024,
    type: "Luxury Apartment",
    typeAr: "شقة فاخرة",
    description:
      "Sunlit living with beautiful courtyards, floor-to-ceiling windows, and premium amenities steps from everything you need. Bright interiors and soft finishes throughout.",
    descriptionAr: "معيشة مشمسة مع ساحات فناء جميلة ونوافذ ممتدة من الأرض للسقف ومرافق راقية قريبة منك. تصميمات داخلية مشرقة وتشطيبات ناعمة.",
    features: ["Pool Access", "Concierge", "Balcony", "Gym", "Lounge", "Pet Friendly"],
    featuresAr: ["دخول المسبح", "خدمة كونسيرج", "شرفة", "صالة رياضية", "لاونج", "يسمح بالحيوانات"],
  },
  {
    tag: "SOLD OUT",
    tagAr: "مباع",
    price: "$4,800,000",
    title: "Hittin Horizon Estate",
    titleAr: "عقارات أفق حطين",
    address: "Hittin,\nRiyadh, Saudi Arabia",
    addressAr: "حطين،\nالرياض، المملكة العربية السعودية",
    beds: 5,
    baths: 4,
    sqft: "3,100",
    year: 2023,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "Expansive estate in Hittin with layered terraces, a private pool, and interiors designed for effortless entertaining. Every room is designed with luxury in mind.",
    descriptionAr: "عقار واسع في حطين مع تراسات متدرجة ومسبح خاص وتصميمات داخلية مخصصة للترفيه المريح. تم تصميم كل غرفة مع مراعاة الفخامة.",
    features: ["City Views", "Private Pool", "Wine Room", "Spa", "Guest Suite", "Smart Home"],
    featuresAr: ["إطلالات على المدينة", "مسبح خاص", "غرفة مشروبات", "منتجع صحي", "جناح ضيوف", "منزل ذكي"],
    buyerEn: "Khalid Al-Mansour",
    buyerAr: "خالد المنصور",
  },
  {
    tag: "FOR SALE",
    tagAr: "للبيع",
    price: "$1,890,000",
    title: "Al Yasmin Grove Villa",
    titleAr: "فيلا بستان الياسمين",
    address: "Al Yasmin,\nRiyadh, Saudi Arabia",
    addressAr: "الياسمين،\nالرياض، المملكة العربية السعودية",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    year: 2022,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "A refined family villa set in Al Yasmin, with generous bedrooms, a light-filled kitchen, and a backyard built for weekend gatherings with family and friends.",
    descriptionAr: "فيلا عائلية راقية تقع في الياسمين، مع غرف نوم واسعة ومطبخ مشرق وساحة خلفية مصممة للتجمعات العائلية في عطلة نهاية الأسبوع.",
    features: ["Backyard Patio", "Spacious Lounge", "Garage", "Home Office", "Fireplace", "Garden"],
    featuresAr: ["فناء خلفي", "صالة واسعة", "مرآب", "مكتب منزلي", "مدفأة", "حديقة"],
  },
  {
    tag: "COMING SOON",
    tagAr: "قريباً",
    price: "$2,950,000",
    title: "Al Qirawan Loft Collection",
    titleAr: "مجموعة لوفت القيروان",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    addressAr: "القيروان،\nالرياض، المملكة العربية السعودية",
    beds: 3,
    baths: 3,
    sqft: "1,800",
    year: 2024,
    type: "Luxury Apartment",
    typeAr: "شقة فاخرة",
    description:
      "Modern loft living with beautiful views, soaring ceilings, and a rooftop terrace ideal for sunset entertaining above the vibrant city.",
    descriptionAr: "معيشة لوفت حديثة بإطلالات جميلة وأسقف عالية وتراس على السطح مثالي للترفيه وقت الغروب فوق المدينة النابضة بالحياة.",
    features: ["Rooftop Terrace", "City Views", "Open Plan", "Parking", "Gym", "Concierge"],
    featuresAr: ["تراس على السطح", "إطلالات على المدينة", "تصميم مفتوح", "موقف سيارات", "صالة رياضية", "كونسيرج"],
  },
  {
    tag: "FOR SALE",
    tagAr: "للبيع",
    price: "$1,680,000",
    title: "Al Malqa Family Retreat",
    titleAr: "ملاذ العائلة في الملقا",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    addressAr: "الملقا،\nالرياض، المملكة العربية السعودية",
    beds: 5,
    baths: 4,
    sqft: "2,800",
    year: 2023,
    type: "Family House",
    typeAr: "منزل عائلي",
    description:
      "A calm family retreat with spacious family rooms, and a beautiful garden that feels incredibly peaceful. The perfect balance of city access and quiet living.",
    descriptionAr: "ملاذ عائلي هادئ بغرف عائلية واسعة وحديقة جميلة تمنح شعوراً بالسلام المذهل. التوازن المثالي بين الوصول للمدينة والعيش الهادئ.",
    features: ["Garden Access", "Play Area", "Shaded Patio", "Maid Room", "Garage", "Guest Room"],
    featuresAr: ["وصول للحديقة", "منطقة ألعاب", "فناء مظلل", "غرفة خادمة", "مرآب", "غرفة ضيوف"],
  },
];

const secondaryCopy =
  "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const secondaryCopyAr =
  "تم تعميمه في الستينيات مع إصدار أوراق Letraset التي تحتوي على مقاطع لوريم إيبسوم، ومؤخرًا مع برامج النشر المكتبي مثل Aldus PageMaker التي تتضمن إصدارات من لوريم إيبسوم.";

export const allProperties: PropertyListing[] = baseListings.map((listing, index) => {
  const image = images[index % images.length];
  const gallery: [string, string, string] = [
    image,
    images[(index + 1) % images.length],
    images[(index + 2) % images.length],
  ];

  return {
    ...listing,
    id: index + 1,
    image,
    gallery,
    descriptionSecondary: secondaryCopy,
    descriptionSecondaryAr: secondaryCopyAr,
  };
});

export function getPropertyById(id: number): PropertyListing | undefined {
  return allProperties.find((property) => property.id === id);
}
