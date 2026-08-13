export type Dictionary = {
  nav: {
    home: string;
    properties: string;
    sell: string;
    blog: string;
    contact: string;
    signIn: string;
    english: string;
    arabic: string;
    rights: string;
    scrollToTop: string;
  };
  hero: {
    scroll: string;
    down: string;
    description: string;
    featureTitle: string;
    featureAddress: string;
    imageAlt: string;
  };
  search: {
    pill: string;
    title: string;
    description: string;
    lookingFor: string;
    locations: string;
    bedrooms: string;
    budget: string;
    search: string;
    options: {
      buy: string;
      rent: string;
      invest: string;
      single: string;
      bed1: string;
      bed2: string;
      bed3: string;
      bed4: string;
    };
    cities: {
      riyadh: string;
      jeddah: string;
      neom: string;
      dammam: string;
      khobar: string;
      mecca: string;
    };
  };
  about: {
    pill: string;
    clickMe: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    cards: {
      villa: { title: string; description: string; count: string };
      family: { title: string; description: string; count: string };
      apartment: { title: string; description: string; count: string };
      office: { title: string; description: string; count: string };
    };
  };
  properties: {
    pill: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    view: string;
    details: string;
    seeAll: string;
    bed: string;
    bath: string;
    sqft: string;
    filters: {
      all: string;
      family: string;
      villa: string;
      apartment: string;
    };
    forSale: string;
    forRent: string;
    page: {
      pill: string;
      titleLine1: string;
      titleLine2: string;
      description: string;
    };
  };
  agents: {
    pill: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    reserveUnit: string;
    seeAll: string;
  };
  faq: {
    pill: string;
    titleLine1: string;
    titleLine2: string;
    intro: string;
    items: { q: string; a: string }[];
  };
  stats: {
    title: string;
    homesForRent: string;
    homesToBuy: string;
    citiesCovered: string;
    totalProperties: string;
  };
  partners: {
    pill: string;
    title: string;
    description: string;
  };
};

export const en: Dictionary = {
  nav: {
    home: "Home",
    properties: "Properties",
    sell: "Sell Your Unit",
    blog: "The Blog",
    contact: "Contact Us",
    signIn: "Sign In",
    english: "English",
    arabic: "العربية",
    rights: "All Rights Reserved",
    scrollToTop: "Scroll to top",
  },
  hero: {
    scroll: "Scroll",
    down: "Down",
    description:
      "Discover meticulously crafted homes and properties, blending contemporary aesthetics with sustainable living.",
    featureTitle: "Silverstone Residence",
    featureAddress: "1234 Sunflower Lane",
    imageAlt: "Modern House Architecture",
  },
  search: {
    pill: "Search Properties",
    title: "Find Your Dream Home",
    description:
      "We offer modern properties with the best quality that meet all your needs.",
    lookingFor: "Looking for",
    locations: "Locations",
    bedrooms: "Bedrooms",
    budget: "Budget",
    search: "Search",
    options: {
      buy: "Buy",
      rent: "Rent",
      invest: "Invest",
      single: "Single",
      bed1: "1 Bedroom",
      bed2: "2 Bedrooms",
      bed3: "3 Bedrooms",
      bed4: "4+ Bedrooms",
    },
    cities: {
      riyadh: "Riyadh",
      jeddah: "Jeddah",
      neom: "NEOM",
      dammam: "Dammam",
      khobar: "Al Khobar",
      mecca: "Mecca",
    },
  },
  about: {
    pill: "About MAQSED",
    clickMe: "Click on me",
    titleLine1: "Your Dream Home,",
    titleLine2: "Our Expertise.",
    description:
      "At MAQSED, we are committed to helping individuals and families find their perfect homes and smart investment properties. Our approach blends personalized service, expert insights, and a dedication to excellence, ensuring your real estate journey is seamless, rewarding, and tailored to your unique needs.",
    cards: {
      villa: {
        title: "Luxury Villa",
        description:
          "Experience unparalleled luxury in sprawling private estates with stunning architecture and world-class amenities.",
        count: "320+ Properties",
      },
      family: {
        title: "Modern Family Home",
        description:
          "Thoughtfully designed spaces for families who value comfort, style, and community in premium neighborhoods.",
        count: "540+ Properties",
      },
      apartment: {
        title: "Luxury Apartment",
        description:
          "Indulge in high-end city living with sophisticated interiors, premium facilities, and exclusive services tailored for ultimate convenience.",
        count: "850+ Properties",
      },
      office: {
        title: "Premium Office Space",
        description:
          "Elevate your business with prestigious commercial spaces in prime locations across Saudi Arabia's key cities.",
        count: "140+ Properties",
      },
    },
  },
  properties: {
    pill: "Featured Properties",
    titleLine1: "Discover MAQSED",
    titleLine2: "Properties",
    description:
      "Explore an exclusive selection of premium properties, meticulously curated to provide you with the best in luxury living and prime real estate investment options, tailored to your needs",
    view: "View",
    details: "Details",
    seeAll: "See All Properties",
    bed: "bed",
    bath: "bath",
    sqft: "sq ft",
    filters: {
      all: "All Properties",
      family: "Family House",
      villa: "Modern Vila",
      apartment: "Luxury Apartment",
    },
    forSale: "FOR SALE",
    forRent: "FOR RENT",
    page: {
      pill: "Explore Properties",
      titleLine1: "Perfect Family Homes for",
      titleLine2: "Comfort and Togetherness",
      description:
        "Discover spacious and welcoming family houses designed for a warm, secure, and joyful living experience.",
    },
  },
  agents: {
    pill: "Reserve a Unit",
    titleLine1: "Book Your Next",
    titleLine2: "Dream Unit.",
    description:
      "Explore featured units ready for reservation — secure your preferred home early with a simple booking process guided by MAQSED.",
    reserveUnit: "Reserve Unit",
    seeAll: "See All Units",
  },
  faq: {
    pill: "Testimonial",
    titleLine1: "Frequently Asked",
    titleLine2: "Questions",
    intro:
      "Have questions about buying, selling, or renting with MAQSED? We've got the answers to help guide you through the process.",
    items: [
      {
        q: "How do I start searching for a property with MAQSED?",
        a: "Set your preferences on our platform and explore a wide range of properties. Our team is ready to assist you!",
      },
      {
        q: "What services does MAQSED offer for first-time homebuyers?",
        a: "We provide comprehensive guidance including mortgage pre-approval assistance, property tours, and step-by-step closing support.",
      },
      {
        q: "Can MAQSED help me sell my property?",
        a: "Yes! We offer a full suite of seller services including professional photography, market analysis, and targeted marketing campaigns.",
      },
      {
        q: "What types of properties does MAQSED specialize in?",
        a: "We specialize in luxury residential properties, modern apartments, and premium commercial real estate.",
      },
    ],
  },
  stats: {
    title: "By the Numbers",
    homesForRent: "Homes for Rent",
    homesToBuy: "Homes to Buy",
    citiesCovered: "Cities Covered",
    totalProperties: "Total Properties",
  },
  partners: {
    pill: "Trusted by Industry Leaders",
    title: "Our Global Partners",
    description:
      "Built on strong alliances with leading brands and institutions that share our standard for trust, quality, and long-term value.",
  },
};
