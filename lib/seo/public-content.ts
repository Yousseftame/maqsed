import { cache } from "react";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { unitsService, unitPublicPath, type Unit } from "@/features/admin/units/units.service";
import { blogService, type BlogPost } from "@/features/blog/blog.service";
import { faqService, type FaqItem } from "@/features/faq/faq.service";
import { isPublicProject } from "@/features/units/mapPublicUnits";
import {
  absoluteUrl,
  getSiteUrl,
  SITE_DESCRIPTION_AR,
  SITE_EMAIL,
  SITE_NAME,
  SITE_NAME_AR,
  SITE_NAME_EN,
} from "./site";

function mediaUrl(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && !trimmed.startsWith("blob:") ? trimmed : "";
  }
  if (value && typeof value === "object") {
    const record = value as { url?: string; preview?: string; src?: string };
    return mediaUrl(record.url || record.preview || record.src || "");
  }
  return "";
}

export function firstMedia(images: unknown): string | undefined {
  if (!Array.isArray(images)) return undefined;
  for (const item of images) {
    const url = mediaUrl(item);
    if (url) return url;
  }
  return undefined;
}

function isPublicProperty(property: Property) {
  return isPublicProject(property.status);
}

export function toSafeDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === "object") {
    const record = value as { toDate?: () => Date; toMillis?: () => number };
    if (typeof record.toDate === "function") {
      try {
        const date = record.toDate();
        return date instanceof Date && !Number.isNaN(date.getTime()) ? date : undefined;
      } catch {
        return undefined;
      }
    }
    if (typeof record.toMillis === "function") {
      try {
        const millis = record.toMillis();
        if (Number.isFinite(millis)) return new Date(millis);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

export const getCachedProperty = cache(async (key: string) => {
  try {
    return await propertiesService.getPropertyBySlugOrId(key);
  } catch {
    return null;
  }
});

export const getCachedUnit = cache(async (key: string) => {
  try {
    return await unitsService.getUnitBySlugOrId(key);
  } catch {
    return null;
  }
});

export const getCachedPost = cache(async (slug: string) => {
  try {
    return await blogService.getPublishedBySlug(decodeURIComponent(String(slug || "").trim()));
  } catch {
    return null;
  }
});

export const getCachedFaqs = cache(async () => {
  try {
    return await faqService.getItems();
  } catch {
    return [];
  }
});

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    alternateName: [SITE_NAME_AR, SITE_NAME_EN],
    url: getSiteUrl(),
    logo: absoluteUrl("/icon-removebg-preview.png"),
    image: absoluteUrl("/icon-removebg-preview.png"),
    email: SITE_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_EMAIL,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "الرياض",
      addressCountry: "SA",
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    description: SITE_DESCRIPTION_AR,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [SITE_NAME_AR, SITE_NAME_EN],
    url: getSiteUrl(),
    inLanguage: ["ar-SA", "en-US"],
    description: SITE_DESCRIPTION_AR,
    publisher: {
      "@type": "RealEstateAgent",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "ar-SA",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن مقصد",
    description: "تعرف على مقصد، رؤيتنا، رسالتنا، وقيمنا كمنصة عقارية سعودية.",
    url: absoluteUrl("/about"),
    inLanguage: "ar-SA",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تواصل معنا",
    description: "تواصل مع فريق مقصد للاستفسار عن المشاريع والوحدات.",
    url: absoluteUrl("/contact"),
    inLanguage: "ar-SA",
    email: SITE_EMAIL,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  const mainEntity = items
    .map((item) => ({
      question: (item.questionAr || item.questionEn || "").trim(),
      answer: (item.answerAr || item.answerEn || "").trim(),
    }))
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function blogPostingJsonLd(post: BlogPost, slug: string) {
  const path = `/blog/${encodeURIComponent(post.slug || slug)}`;
  const url = absoluteUrl(path);
  const published = toSafeDate(post.publishedAt);
  const modified = toSafeDate(post.updatedAt) || published;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titleAr || post.titleEn,
    description: post.excerptAr || post.excerptEn || SITE_DESCRIPTION_AR,
    image: post.coverImage || undefined,
    datePublished: published?.toISOString(),
    dateModified: modified?.toISOString(),
    inLanguage: "ar",
    author: {
      "@type": "Organization",
      name: SITE_NAME_AR,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-removebg-preview.png"),
      },
    },
    mainEntityOfPage: url,
    url,
  };
}

export function propertyJsonLd(property: Property) {
  const image = firstMedia(property.images);
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.name,
    description: String(property.description || "").trim() || SITE_DESCRIPTION_AR,
    url: absoluteUrl(propertyPublicPath(property)),
    image: image ? absoluteUrl(image) : undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
    },
  };
}

export function unitJsonLd(unit: Unit) {
  const image = firstMedia(unit.images);
  const name = String(unit.unitNumber || "").trim() || "وحدة";
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name,
    description: String(unit.unitType || "").trim() || SITE_DESCRIPTION_AR,
    url: absoluteUrl(unitPublicPath(unit)),
    image: image ? absoluteUrl(image) : undefined,
    numberOfRooms: unit.roomsCount || undefined,
    numberOfBathroomsTotal: unit.bathroomsCount || undefined,
    floorSize: unit.totalArea
      ? { "@type": "QuantitativeValue", value: unit.totalArea, unitCode: "MTK" }
      : undefined,
    offers:
      typeof unit.price === "number" && unit.price > 0
        ? {
            "@type": "Offer",
            price: unit.price,
            priceCurrency: "SAR",
            availability: unit.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          }
        : undefined,
  };
}

export { isPublicProperty };
