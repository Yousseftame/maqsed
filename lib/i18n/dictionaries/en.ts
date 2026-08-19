export interface Dictionary {
  nav: {
    home: string;
    about: string;
    properties: string;
    units: string;
    sell: string;
    blog: string;
    contact: string;
    faq: string;
    signIn: string;
    dashboard: string;
    english: string;
    arabic: string;
    rights: string;
    scrollToTop: string;
    switchLanguage: string;
  };
  notFound: {
    title: string;
    subtitle: string;
    description: string;
    backHome: string;
  };
  hero: {
    title: string;
    subtitle1: string;
    subtitle2: string;
    subtitle3: string;
    primaryButton: string;
    secondaryButton: string;
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
      apt: string;
      villa: string;
      floor: string;
      commercial: string;
      ground: string;
      first: string;
      second: string;
      third: string;
      upper: string;
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
    features: {
      pill: string;
      title: string;
      description1: string;
      description2: string;
      callUs: string;
      phone: string;
      corporate: { title: string; desc: string };
      experts: { title: string; desc: string };
      excellence: { title: string; desc: string };
      learnMore: string;
    };
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
    types: {
      apartment: string;
      villa: string;
      house: string;
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
    title: string;
    intro: string;
    items: { q: string; a: string }[];
  };
  stats: {
    title: string;
    items: {
      value: string;
      suffix: string;
      text: string;
    }[];
  };
  visionMission: {
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  cta: {
    pill: string;
    title: string;
    subtitle: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    button: string;
  };
  partners: {
    pill: string;
    title: string;
    description: string;
  };
  sellPage: {
    hero: {
      title1: string;
      title2: string;
      description: string;
    };
    form: {
      pill: string;
      title: string;
      description: string;
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      propertyType: string;
      city: string;
      cityPlaceholder: string;
      address: string;
      addressPlaceholder: string;
      bedrooms: string;
      bedroomsPlaceholder: string;
      size: string;
      sizePlaceholder: string;
      price: string;
      pricePlaceholder: string;
      notes: string;
      notesPlaceholder: string;
      agreement: string;
      submit: string;
      success: string;
    };
    propertyTypes: {
      apartment: string;
      villa: string;
      townhouse: string;
      penthouse: string;
      office: string;
      land: string;
      other: string;
    };
  };
  contactPage: {
    hero: {
      title1: string;
      title2: string;
      description: string;
    };
    contactDetails: {
      email: string;
      phone: string;
      office: string;
    };
    form: {
      pill: string;
      title: string;
      description: string;
      subject: string;
      fullName: string;
      fullNamePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      message: string;
      messagePlaceholder: string;
      agreement: string;
      submit: string;
      success: string;
    };
    subjects: {
      general: string;
      buy: string;
      sell: string;
      partnership: string;
      support: string;
    };
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
    backToWebsite: string;
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
  footer: {
    description: string;
    importantLinks: string;
    contactUs: string;
    location: string;
    brand: string;
    rightsPrefix: string;
    rightsSuffix: string;
    email: string;
    phone: string;
    privacyPolicy: string;
    termsConditions: string;
    techSupport: string;
    socials: {
      facebook: string;
      linkedin: string;
      twitter: string;
      instagram: string;
    };
  };
}

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About Us",
    properties: "Properties",
    units: "Units",
    sell: "Sell Your Unit",
    blog: "The Blog",
    contact: "Contact Us",
    faq: "FAQs",
    signIn: "Sign In",
    dashboard: "Dashboard",
    english: "English",
    arabic: "العربية",
    rights: "All Rights Reserved",
    scrollToTop: "Scroll to top",
    switchLanguage: "Switch language",
  },
  notFound: {
    title: "Page Not Found",
    subtitle: "We couldn't find the page you're looking for.",
    description: "It might have been removed, had its name changed, or is temporarily unavailable.",
    backHome: "Back to Home",
  },
  hero: {
    title: "Maqsed Platform: Your Ideal Choice for Real Estate Development",
    subtitle1: "The relationship with the client is not just a service: it is a shared journey towards excellence, where the business relationship grows, presence flourishes, and efforts bear fruit.",
    subtitle2: "The 'Maqsed' logo represents a towering tree, its roots deep in the ground, and its branches reaching towards the sky. This tree is not just a visual symbol, but an embodiment of the company's marketing philosophy: to be a destination everyone seeks for shade, benefit, and growth.",
    subtitle3: "With Maqsed.. we grow together",
    primaryButton: "Contact Us",
    secondaryButton: "About Us",
  },
  search: {
    pill: "Search Properties",
    title: "Find Your Dream Home",
    description:
      "We offer modern properties with the best quality that meet all your needs.",
    lookingFor: "Property Type",
    locations: "Locations",
    bedrooms: "Floors",
    budget: "Budget",
    search: "Search",
    options: {
      apt: "Residential Apartment",
      villa: "Villa",
      floor: "Floor",
      commercial: "Commercial",
      ground: "Floor 1",
      first: "Floor 2",
      second: "Floor 3",
      third: "Floor 4",
      upper: "Floor 5+",
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
    features: {
      pill: "Who we are",
      title: "We created historic real estate ventures.",
      description1:
        "We bring decades of experience to real estate strategy, advisory, and development. As one of the world's largest privately held real estate groups, we deliver tailored solutions that align with your long-term vision.",
      description2:
        "We bring decades of experience to real estate strategy, advisory, and development. As one of the world's largest privately held real estate groups, we deliver tailored solutions that align with your long-term vision.",
      callUs: "Call Us For Any Inquiry",
      phone: "+258 - 5485 - 4845",
      corporate: {
        title: "Corporate Responsibility",
        desc: "Our goal is zero incidents and our lost time frequency rate is industry leading.",
      },
      experts: {
        title: "Experts with Team Spirit",
        desc: "Our goal is zero incidents and our lost time frequency rate is industry leading.",
      },
      excellence: {
        title: "Commitment to Excellence",
        desc: "Our goal is zero incidents and our lost time frequency rate is industry leading.",
      },
      learnMore: "Learn More",
    },
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
      villa: "Modern Villa",
      apartment: "Luxury Apartment",
    },
    types: {
      apartment: "Apartments",
      villa: "Villas",
      house: "Family Houses",
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
    pill: "Frequently Asked Questions",
    title: "Browse the most common questions.",
    intro: "",
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
    title: "",
    items: [
      { value: "145", suffix: "+", text: "Completed Projects" },
      { value: "129", suffix: "+", text: "Completed Projects" },
      { value: "4.3B", suffix: "+", text: "Completed Projects" },
      { value: "25M", suffix: "+", text: "Completed Projects" },
    ],
  },
  visionMission: {
    mission: {
      title: "Our Mission",
      description: "To deliver projects in partnership with our clients: Safer, with zero loss time injuries. Better, with zero quality rejections. And faster, by always meeting deadlines."
    },
    vision: {
      title: "Our Vision",
      description: "To be the premier integrated project solutions provider across the energy, infrastructure, and buildings sectors, entrusted to transform ambitious visions into reality in Saudi Arabia and beyond."
    }
  },
  cta: {
    pill: "Register as a Service Provider",
    title: "Join as a Certified Partner",
    subtitle: "Do you own an engineering office or a contracting company and want access to thousands of projects?",
    bullet1: "Offer your services on the largest contracting platform in Saudi Arabia",
    bullet2: "Get projects that suit your specialization",
    bullet3: "Increase your profits through a competitive commission system",
    button: "Register Now",
  },
  partners: {
    pill: "Trusted by Industry Leaders",
    title: "Trusted Partners",
    description:
      "Built on strong alliances with leading brands and institutions that share our standard for trust, quality, and long-term value.",
  },
  sellPage: {
    hero: {
      title1: "Market your property",
      title2: "with confidence.",
      description:
        "Submit your unit details and let MAQSED handle professional marketing, qualified buyers, and a clear path to closing.",
    },
    form: {
      pill: "Request Form",
      title: "Property Marketing / Sale Request",
      description:
        "Share a few details about your unit. Our team will review your request and follow up with the next steps.",
      role: 'Your Role',
      unitLocation: 'Unit Location',
      city: 'City',
      neighborhood: 'Neighborhood',
      googleMapsLink: 'Google Maps Link',
      roomsCount: 'Number of Rooms',
      bathroomsCount: 'Number of Bathrooms',
      propertyAge: 'Property Age (Years)',
      additionalFeatures: 'Additional Features',
      contactInfo: 'Contact Information',
      fullNameAlt: 'Full Name',
      mobileNumber: 'Mobile Number',
      roleOptions: ['Property Owner', 'Agent'],
      unitLocationOptions: ['Independent (Villa/Building...)', 'Within a building'],
      cityPlaceholder: 'Choose city...',
      neighborhoodPlaceholder: 'Choose neighborhood...',
      googleMapsPlaceholder: 'https://maps.google.com/...',
      propertyAgePlaceholder: 'Example: 0 (if new)',
      additionalFeaturesPlaceholder: 'Pool, elevator, roof...',
      mobileNumberPlaceholder: '05XXXXXXXX',
      agreement:
        "By submitting, you agree to be contacted by MAQSED about your sale request.",
      submit: "Submit Request",
      success: "Request received",
    },
    propertyTypes: {
      apartment: "Apartment",
      villa: "Villa",
      townhouse: "Townhouse",
      penthouse: "Penthouse",
      office: "Office",
      land: "Land",
      other: "Other",
    },
  },
  contactPage: {
    hero: {
      title1: "Let's start a",
      title2: "conversation.",
      description:
        "Questions, opportunities, or next steps — send us a message and the MAQSED team will get back to you promptly.",
    },
    contactDetails: {
      email: "Email",
      phone: "Phone",
      office: "Office",
    },
    form: {
      pill: "Contact Form",
      title: "Send us a message",
      description:
        "Choose a topic, leave your details, and tell us how we can help.",
      subject: "Subject",
      fullName: "Full Name",
      fullNamePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      phone: "Phone",
      phonePlaceholder: "+966 ...",
      message: "Message",
      messagePlaceholder: "How can we help you?",
      agreement: "We typically respond within one business day.",
      submit: "Send Message",
      success: "Message sent",
    },
    subjects: {
      general: "General Inquiry",
      buy: "Buy a Unit",
      sell: "Sell a Unit",
      partnership: "Partnership",
      support: "Support",
    },
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
    backToWebsite: "Back to website",
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
  footer: {
    description: "An integrated digital platform for providing and managing corporate housing for workers and individuals, effectively connecting property owners, companies, and individuals.",
    importantLinks: "Important Links",
    contactUs: "Contact Us",
    location: "Riyadh, Saudi Arabia",
    brand: "MAQSED",
    rightsPrefix: "© 2026",
    rightsSuffix: "All Rights Reserved",
    email: "marketing@maqsed.com",
    phone: "+966 55 555 5555",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    techSupport: "Tech Support",
    socials: {
      facebook: "Facebook",
      linkedin: "LinkedIn",
      twitter: "Twitter",
      instagram: "Instagram",
    },
  },
};
