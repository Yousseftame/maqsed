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
    title: "Amberwood Homestead",
    address: "150 Maple Road,\nVancouver, BC V6E1B6, Canada",
    beds: 4,
    baths: 4,
    sqft: "2,000",
    year: 2019,
    type: "Family House",
    description:
      "A stunning family home nestled in the heart of Vancouver's most sought-after neighbourhood. Amberwood Homestead blends timeless architecture with modern interiors — featuring soaring ceilings, a chef's kitchen, and a private garden retreat designed for the discerning homeowner.",
    features: ["Private Garden", "Chef's Kitchen", "Double Garage", "Home Office", "Smart Home", "Fireplace"],
  },
  {
    tag: "FOR SALE",
    price: "$5,500,000",
    title: "Aurora Tower",
    address: "19 Crescent Bay Street,\nDubai, 00000, UAE",
    beds: 2,
    baths: 2,
    sqft: "700",
    year: 2023,
    type: "Luxury Apartment",
    description:
      "Rise above the skyline in Aurora Tower — a pinnacle of luxury living in the heart of Dubai. With panoramic Gulf views, floor-to-ceiling glass, and curated designer finishes, every detail has been considered for those who expect nothing less than extraordinary.",
    features: ["Gulf Views", "Concierge 24/7", "Infinity Pool", "Private Gym", "Valet Parking", "Sky Lounge"],
  },
  {
    tag: "FOR SALE",
    price: "$2,600,000",
    title: "Azure Bay Villa",
    address: "Seaside Avenue,\nSantorini, 84700, Greece",
    beds: 5,
    baths: 5,
    sqft: "850",
    year: 2021,
    type: "Modern Vila",
    description:
      "Perched on Santorini's iconic cliffs, Azure Bay Villa offers an unparalleled living experience with whitewashed stone walls, volcanic stone terraces and breathtaking Aegean views. A sanctuary of calm where the Mediterranean lifestyle meets architectural mastery.",
    features: ["Cliff Edge Pool", "Sea Views", "Wine Cellar", "Terrace Bar", "Outdoor Cinema", "Private Dock"],
  },
  {
    tag: "FOR RENT",
    price: "$8,500 / mo",
    title: "Urban Skyline Penthouse",
    address: "101 Skyline Blvd,\nNew York, NY 10001, USA",
    beds: 3,
    baths: 3,
    sqft: "1,200",
    year: 2022,
    type: "Luxury Apartment",
    description:
      "Command the New York skyline from this extraordinary penthouse at 101 Skyline Blvd. Three full floors of curated luxury, featuring a wraparound terrace, a private helipad access, and interiors by a renowned Manhattan designer. The city, on your terms.",
    features: ["Wraparound Terrace", "Skyline Views", "Private Elevator", "Rooftop Access", "Doorman", "Heated Floors"],
  },
  {
    tag: "FOR SALE",
    price: "$3,100,000",
    title: "Golden Horizon Estate",
    address: "88 Golden Way,\nLos Angeles, CA 90210, USA",
    beds: 6,
    baths: 5,
    sqft: "3,500",
    year: 2020,
    type: "Family House",
    description:
      "Set on a generous 3,500 sq ft lot in the prestigious 90210 zip code, Golden Horizon Estate is a masterclass in California living. Sun-drenched interiors, a resort-style pool, and six spacious bedrooms — all just minutes from the Sunset Strip.",
    features: ["Resort Pool", "Home Theater", "6-Car Garage", "Guest House", "Outdoor Kitchen", "Tennis Court"],
  },
  {
    tag: "FOR SALE",
    price: "$1,250,000",
    title: "Minimalist Zen Retreat",
    address: "42 Serenity Lane,\nKyoto, 604-8091, Japan",
    beds: 2,
    baths: 2,
    sqft: "950",
    year: 2022,
    type: "Modern Vila",
    description:
      "Inspired by the quiet elegance of traditional Japanese architecture, this Kyoto retreat is a study in restraint and beauty. Natural wood, stone, and paper screens create a meditative atmosphere, while a zen garden and private onsen complete the experience.",
    features: ["Zen Garden", "Private Onsen", "Tatami Rooms", "Tea House", "Stone Courtyard", "Bamboo Garden"],
  },
  {
    tag: "FOR SALE",
    price: "$2,150,000",
    title: "Cedar Ridge Residence",
    address: "27 Cedar Ridge Rd,\nPortland, OR 97201, USA",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    year: 2018,
    type: "Family House",
    description:
      "A warm cedar-clad residence surrounded by Pacific Northwest greenery. Open living spaces, a chef-ready kitchen, and a deck built for long summer evenings make this home ideal for growing families.",
    features: ["Cedar Deck", "Fireplace", "Mudroom", "EV Charger", "Garden", "Workshop"],
  },
  {
    tag: "FOR RENT",
    price: "$4,200 / mo",
    title: "Palm Court Apartments",
    address: "9 Palm Court,\nMiami, FL 33139, USA",
    beds: 2,
    baths: 2,
    sqft: "1,050",
    year: 2021,
    type: "Luxury Apartment",
    description:
      "Sunlit Miami living with palm-lined courtyards, floor-to-ceiling windows, and resort amenities steps from the beach. Bright interiors and soft coastal finishes throughout.",
    features: ["Pool Access", "Concierge", "Balcony", "Gym", "Bike Storage", "Pet Friendly"],
  },
  {
    tag: "FOR SALE",
    price: "$4,800,000",
    title: "Harborview Estate",
    address: "3 Harborview Drive,\nSydney, NSW 2000, Australia",
    beds: 5,
    baths: 4,
    sqft: "3,100",
    year: 2017,
    type: "Family House",
    description:
      "Expansive harbor-facing estate with layered terraces, a private pier, and interiors designed for effortless entertaining. Every room frames the water.",
    features: ["Harbor Views", "Private Pier", "Wine Room", "Pool", "Guest Suite", "Smart Home"],
  },
  {
    tag: "FOR SALE",
    price: "$1,890,000",
    title: "Maple Grove Villa",
    address: "14 Maple Grove,\nToronto, ON M5V 2T6, Canada",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    year: 2020,
    type: "Family House",
    description:
      "A refined family villa set among maple trees, with generous bedrooms, a light-filled kitchen, and a backyard built for weekend gatherings.",
    features: ["Backyard Patio", "Finished Basement", "Garage", "Home Office", "Fireplace", "Garden"],
  },
  {
    tag: "FOR SALE",
    price: "$2,950,000",
    title: "Summit Loft Collection",
    address: "220 Summit Ave,\nDenver, CO 80202, USA",
    beds: 3,
    baths: 3,
    sqft: "1,800",
    year: 2023,
    type: "Luxury Apartment",
    description:
      "Industrial-chic loft living with mountain views, soaring ceilings, and a rooftop terrace ideal for sunset entertaining above the city.",
    features: ["Rooftop Terrace", "Mountain Views", "Open Plan", "Parking", "Gym", "Concierge"],
  },
  {
    tag: "FOR SALE",
    price: "$1,680,000",
    title: "Lakeside Family House",
    address: "55 Lakeside Path,\nGeneva, 1201, Switzerland",
    beds: 5,
    baths: 4,
    sqft: "2,800",
    year: 2019,
    type: "Family House",
    description:
      "A calm lakeside retreat with panoramic water views, spacious family rooms, and a shoreline garden that feels a world away from the city.",
    features: ["Lake Access", "Garden", "Boat Dock", "Fireplace", "Garage", "Guest Room"],
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
