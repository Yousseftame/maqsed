export type PropertyListing = {
  id: number;
  image: string;
  gallery: [string, string, string];
  tag: string;
  price: string;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: string;
  year: number;
  type: string;
  description: string;
  descriptionSecondary: string;
  features: string[];
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
  "id" | "image" | "gallery" | "descriptionSecondary"
>[] = [
  {
    tag: "FOR SALE",
    price: "$1,750,000",
    title: "Al Qirawan Estate",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    beds: 4,
    baths: 4,
    sqft: "2,000",
    year: 2023,
    type: "Family House",
    description:
      "A stunning family home nestled in the rapidly developing Al Qirawan neighborhood. Blending timeless architecture with modern interiors — featuring soaring ceilings, a chef's kitchen, and a private garden retreat.",
    features: ["Private Garden", "Chef's Kitchen", "Double Garage", "Home Office", "Smart Home", "Fireplace"],
  },
  {
    tag: "COMING SOON",
    price: "$5,500,000",
    title: "Al Malqa Tower Residences",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    beds: 2,
    baths: 2,
    sqft: "700",
    year: 2024,
    type: "Luxury Apartment",
    description:
      "Rise above the skyline in Al Malqa Tower — a pinnacle of luxury living in the heart of Riyadh. With panoramic city views, floor-to-ceiling glass, and curated designer finishes.",
    features: ["City Views", "Concierge 24/7", "Infinity Pool", "Private Gym", "Valet Parking", "Sky Lounge"],
  },
  {
    tag: "SOLD OUT",
    price: "$2,600,000",
    title: "An Narjis Luxury Villa",
    address: "An Narjis,\nRiyadh, Saudi Arabia",
    beds: 5,
    baths: 5,
    sqft: "850",
    year: 2022,
    type: "Modern Vila",
    description:
      "Located in the highly sought-after An Narjis district, this luxury villa offers an unparalleled living experience with stone facades, expansive terraces and breathtaking modern design.",
    features: ["Private Pool", "City Views", "Smart Home", "Terrace Bar", "Outdoor Cinema", "Landscaped Garden"],
  },
  {
    tag: "FOR SALE",
    price: "$3,200,000",
    title: "Al Yasmin Heights",
    address: "Al Yasmin,\nRiyadh, Saudi Arabia",
    beds: 3,
    baths: 3,
    sqft: "1,200",
    year: 2023,
    type: "Luxury Apartment",
    description:
      "Command the Riyadh skyline from this extraordinary apartment in Al Yasmin. Generous floor plans, high-end finishes, and interiors designed for absolute comfort.",
    features: ["Wraparound Terrace", "Skyline Views", "Private Elevator", "Rooftop Access", "Security 24/7", "Heated Floors"],
  },
  {
    tag: "COMING SOON",
    price: "$3,100,000",
    title: "Hittin Golden Estate",
    address: "Hittin,\nRiyadh, Saudi Arabia",
    beds: 6,
    baths: 5,
    sqft: "3,500",
    year: 2024,
    type: "Family House",
    description:
      "Set on a generous lot in the prestigious Hittin area, this estate is a masterclass in modern living. Sun-drenched interiors, a resort-style pool, and six spacious bedrooms.",
    features: ["Resort Pool", "Home Theater", "6-Car Garage", "Guest House", "Outdoor Kitchen", "Tennis Court"],
  },
  {
    tag: "SOLD OUT",
    price: "$1,250,000",
    title: "Al Qirawan Minimalist Retreat",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    beds: 2,
    baths: 2,
    sqft: "950",
    year: 2022,
    type: "Modern Vila",
    description:
      "Inspired by quiet elegance and modern architecture, this retreat in Al Qirawan is a study in restraint and beauty. Natural materials and open courtyards create a peaceful atmosphere.",
    features: ["Courtyard", "Private Gym", "High Ceilings", "Guest Suite", "Stone Finishes", "Smart Lighting"],
  },
  {
    tag: "FOR SALE",
    price: "$2,150,000",
    title: "Al Malqa Ridge Residence",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    year: 2023,
    type: "Family House",
    description:
      "A warm and inviting residence located in Al Malqa. Open living spaces, a chef-ready kitchen, and beautiful outdoor spaces make this home ideal for growing families.",
    features: ["Outdoor Deck", "Fireplace", "Mudroom", "EV Charger", "Garden", "Workshop"],
  },
  {
    tag: "COMING SOON",
    price: "$4,200,000",
    title: "An Narjis Court Apartments",
    address: "An Narjis,\nRiyadh, Saudi Arabia",
    beds: 2,
    baths: 2,
    sqft: "1,050",
    year: 2024,
    type: "Luxury Apartment",
    description:
      "Sunlit living with beautiful courtyards, floor-to-ceiling windows, and premium amenities steps from everything you need. Bright interiors and soft finishes throughout.",
    features: ["Pool Access", "Concierge", "Balcony", "Gym", "Lounge", "Pet Friendly"],
  },
  {
    tag: "SOLD OUT",
    price: "$4,800,000",
    title: "Hittin Horizon Estate",
    address: "Hittin,\nRiyadh, Saudi Arabia",
    beds: 5,
    baths: 4,
    sqft: "3,100",
    year: 2023,
    type: "Family House",
    description:
      "Expansive estate in Hittin with layered terraces, a private pool, and interiors designed for effortless entertaining. Every room is designed with luxury in mind.",
    features: ["City Views", "Private Pool", "Wine Room", "Spa", "Guest Suite", "Smart Home"],
  },
  {
    tag: "FOR SALE",
    price: "$1,890,000",
    title: "Al Yasmin Grove Villa",
    address: "Al Yasmin,\nRiyadh, Saudi Arabia",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    year: 2022,
    type: "Family House",
    description:
      "A refined family villa set in Al Yasmin, with generous bedrooms, a light-filled kitchen, and a backyard built for weekend gatherings with family and friends.",
    features: ["Backyard Patio", "Spacious Lounge", "Garage", "Home Office", "Fireplace", "Garden"],
  },
  {
    tag: "COMING SOON",
    price: "$2,950,000",
    title: "Al Qirawan Loft Collection",
    address: "Al Qirawan,\nRiyadh, Saudi Arabia",
    beds: 3,
    baths: 3,
    sqft: "1,800",
    year: 2024,
    type: "Luxury Apartment",
    description:
      "Modern loft living with beautiful views, soaring ceilings, and a rooftop terrace ideal for sunset entertaining above the vibrant city.",
    features: ["Rooftop Terrace", "City Views", "Open Plan", "Parking", "Gym", "Concierge"],
  },
  {
    tag: "FOR SALE",
    price: "$1,680,000",
    title: "Al Malqa Family Retreat",
    address: "Al Malqa,\nRiyadh, Saudi Arabia",
    beds: 5,
    baths: 4,
    sqft: "2,800",
    year: 2023,
    type: "Family House",
    description:
      "A calm family retreat with spacious family rooms, and a beautiful garden that feels incredibly peaceful. The perfect balance of city access and quiet living.",
    features: ["Garden Access", "Play Area", "Shaded Patio", "Maid Room", "Garage", "Guest Room"],
  },
];

const secondaryCopy =
  "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

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
  };
});

export function getPropertyById(id: number): PropertyListing | undefined {
  return allProperties.find((property) => property.id === id);
}
