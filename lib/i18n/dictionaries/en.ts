export type Dictionary = {
  nav: {
    home: string;
    properties: string;
    sell: string;
    blog: string;
    contact: string;
    signIn: string;
    dashboard: string;
    english: string;
    arabic: string;
    rights: string;
    scrollToTop: string;
    switchLanguage: string;
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
  auth: {
    welcomeBack: string;
    signInTitle1: string;
    signInTitle2: string;
    email: string;
    password: string;
    forgotPassword: string;
    signIn: string;
    signingIn: string;
    showPassword: string;
    hidePassword: string;
    forgotTitle1: string;
    forgotTitle2: string;
    forgotDescription: string;
    backToSignIn: string;
    sendReset: string;
    sendingLink: string;
    waitResend: string;
    resendIn: string;
    resetSent: string;
    emailPlaceholder: string;
    copyright: string;
    panelBadge: string;
    panelTitle1: string;
    panelTitle2: string;
    panelQuote: string;
    panelRole: string;
    panelCompany: string;
    restoreFailed: string;
    signInFailed: string;
    imageAlt: string;
    errors: {
      invalidEmail: string;
      disabled: string;
      notFound: string;
      invalidCredential: string;
      tooMany: string;
      notAllowed: string;
      missingPassword: string;
      missingEmail: string;
      generic: string;
      resetFailed: string;
    };
  };
  admin: {
    website: string;
    search: string;
    collapse: string;
    expand: string;
    signOut: string;
    signOutTitle: string;
    signOutDescription: string;
    stay: string;
    comingSoon: string;
    overview: string;
    last7Days: string;
    customers: string;
    balance: string;
    vsLastMonth: string;
    openMenu: string;
    cancel: string;
    confirm: string;
    closeDialog: string;
    nav: {
      overview: string;
      projects: string;
      units: string;
      cities: string;
      customers: string;
      settingsHeading: string;
      company: string;
      menu: string;
      interface: string;
      blog: string;
      additional: string;
      maintenance: string;
      security: string;
      users: string;
    };
    ui: {
      add: string;
      edit: string;
      delete: string;
      view: string;
      search: string;
      empty: string;
      actions: string;
      save: string;
      saved: string;
    };
    projects: {
      add: string;
      search: string;
      total: string;
      active: string;
      units: string;
      cities: string;
      name: string;
      city: string;
      unitsCol: string;
      status: string;
      updated: string;
      deleteTitle: string;
      deleteDescription: string;
      statuses: {
        active: string;
        draft: string;
        soldOut: string;
        upcoming: string;
      };
    };
    cities: {
      addTitle: string;
      addCity: string;
      cityPlaceholder: string;
      neighborhoodsTitle: string;
      addNeighborhood: string;
      selectCity: string;
      neighborhoodPlaceholder: string;
      deleteCity: string;
      deleteTitle: string;
      deleteDescription: string;
      emptyNeighborhoods: string;
      emptyCities: string;
      neighborhoods: string;
    };
    company: {
      logo: string;
      logoHint: string;
      changeLogo: string;
      about: string;
      aboutPlaceholder: string;
      contacts: string;
      number: string;
      legal: string;
      owner: string;
      commercial: string;
      fal: string;
      complaints: string;
    };
    analytics: {
      inquiries: string;
      visits: string;
      projects: string;
      units: string;
      traffic: string;
      byCity: string;
      recent: string;
      status: string;
      viewAll: string;
      new: string;
      pending: string;
      closed: string;
      days: {
        sat: string;
        sun: string;
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
      };
    };
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
    dashboard: "Dashboard",
    english: "English",
    arabic: "العربية",
    rights: "All Rights Reserved",
    scrollToTop: "Scroll to top",
    switchLanguage: "Switch language",
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
  auth: {
    welcomeBack: "Welcome back",
    signInTitle1: "Sign In to",
    signInTitle2: "your account.",
    email: "Email address",
    password: "Password",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    signingIn: "Signing in…",
    showPassword: "Show password",
    hidePassword: "Hide password",
    forgotTitle1: "Forgot your",
    forgotTitle2: "password?",
    forgotDescription:
      "Enter your email address below and we'll send you a link to reset it.",
    backToSignIn: "Back to sign in",
    sendReset: "Send reset link",
    sendingLink: "Sending link…",
    waitResend: "Please wait before sending again",
    resendIn: "Resend in",
    resetSent: "Reset link sent",
    emailPlaceholder: "you@example.com",
    copyright: "© 2026 Maqsed. All Rights Reserved",
    panelBadge: "Premium Real Estate",
    panelTitle1: "Redefining",
    panelTitle2: "luxury living.",
    panelQuote:
      "Our vision has always been to elevate the standard of living. Maqsed is built on trust, innovation, and an unwavering commitment to excellence.",
    panelRole: "Chairman",
    panelCompany: "Maqsed Group",
    restoreFailed: "Could not restore your session. Please sign in again.",
    signInFailed: "Could not sign in.",
    imageAlt: "Luxury property",
    errors: {
      invalidEmail: "Enter a valid email address.",
      disabled: "This account has been disabled.",
      notFound: "No account found with this email.",
      invalidCredential: "Incorrect email or password.",
      tooMany: "Too many attempts. Try again in a few minutes.",
      notAllowed: "Email sign-in is not enabled in Firebase Authentication yet.",
      missingPassword: "Enter your password.",
      missingEmail: "Enter your email address.",
      generic: "Something went wrong. Please try again.",
      resetFailed: "Could not send the reset link.",
    },
  },
  admin: {
    website: "Website",
    search: "Search anything...",
    collapse: "Collapse",
    expand: "Expand",
    signOut: "Sign out",
    signOutTitle: "Sign out?",
    signOutDescription: "You'll need to sign in again to access the dashboard.",
    stay: "Stay",
    comingSoon: "Coming soon.",
    overview: "Overview",
    last7Days: "Last 7 days",
    customers: "Customers",
    balance: "Balance",
    vsLastMonth: "vs last month",
    openMenu: "Open sidebar",
    cancel: "Cancel",
    confirm: "Confirm",
    closeDialog: "Close dialog",
    nav: {
      overview: "Overview",
      projects: "Project Management",
      units: "Unit Management",
      cities: "Cities and Neighborhoods",
      customers: "Customer Communication",
      settingsHeading: "Settings and Content",
      company: "Company Information",
      menu: "Menu Settings",
      interface: "Interface Settings",
      blog: "Blog Management",
      additional: "Additional Information",
      maintenance: "Maintenance Mode",
      security: "Security Settings",
      users: "Users",
    },
    ui: {
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      search: "Search...",
      empty: "No results found.",
      actions: "Actions",
      save: "Save changes",
      saved: "Changes saved",
    },
    projects: {
      add: "Add project",
      search: "Search projects...",
      total: "Total projects",
      active: "Active projects",
      units: "Total units",
      cities: "Cities",
      name: "Project",
      city: "City",
      unitsCol: "Units",
      status: "Status",
      updated: "Updated",
      deleteTitle: "Delete project?",
      deleteDescription: "This will remove the project from the list.",
      statuses: {
        active: "Active",
        draft: "Draft",
        soldOut: "Sold out",
        upcoming: "Upcoming",
      },
    },
    cities: {
      addTitle: "Add a new city",
      addCity: "Add city",
      cityPlaceholder: "City name (e.g. Riyadh)",
      neighborhoodsTitle: "Add neighborhoods",
      addNeighborhood: "Add neighborhood",
      selectCity: "Select a city to link…",
      neighborhoodPlaceholder: "Neighborhood name (e.g. Al Malqa)",
      deleteCity: "Delete city",
      deleteTitle: "Delete this city?",
      deleteDescription: "This will remove the city and all of its neighborhoods.",
      emptyNeighborhoods: "No neighborhoods yet.",
      emptyCities: "No cities yet.",
      neighborhoods: "Neighborhoods",
    },
    company: {
      logo: "Company logo",
      logoHint: "512×512px · max 700KB",
      changeLogo: "Change logo",
      about: "About the company",
      aboutPlaceholder: "Write a short description of the company…",
      contacts: "Contact numbers",
      number: "Number",
      legal: "Official and legal details",
      owner: "Owner name",
      commercial: "Commercial registration",
      fal: "Fal license",
      complaints: "Complaints number",
    },
    analytics: {
      inquiries: "Inquiries",
      visits: "Visits",
      projects: "Projects",
      units: "Units",
      traffic: "Inquiries this week",
      byCity: "Performance by city",
      recent: "Recent inquiries",
      status: "Project status",
      viewAll: "View all",
      new: "New",
      pending: "Pending",
      closed: "Closed",
      days: {
        sat: "Sat",
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
      },
    },
  },
};
