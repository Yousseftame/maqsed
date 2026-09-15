import type { Metadata } from "next";

export const SITE_NAME_AR = "مقصد";
export const SITE_NAME_EN = "MAQSED";
export const SITE_NAME = "مقصد | MAQSED";
export const SITE_TAGLINE_AR = "منصتك العقارية في المملكة العربية السعودية";
export const SITE_DESCRIPTION_AR =
  "مقصد منصة عقارية موثوقة لعرض وشراء وبيع المشاريع والوحدات السكنية في الرياض والمملكة العربية السعودية.";
export const SITE_DESCRIPTION_EN =
  "MAQSED is a trusted real estate platform for buying, selling, and exploring premium projects and units in Riyadh and Saudi Arabia.";
export const SITE_EMAIL = "marketing@maqsed.com";
export const SITE_KEYWORDS = [
  "مقصد",
  "MAQSED",
  "عقارات",
  "الرياض",
  "مشاريع سكنية",
  "وحدات للبيع",
  "real estate",
  "Riyadh",
  "Saudi Arabia",
];

const DEFAULT_SITE_URL = "https://maqsed.com";
const DEFAULT_OG_IMAGE = "/icon-removebg-preview.png";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit.startsWith("http") ? explicit : `https://${explicit}`;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return DEFAULT_SITE_URL;
}

export function absoluteUrl(path = "/") {
  const origin = getSiteUrl();
  if (!path || path === "/") return origin;
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

const INDEXABLE_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const NOINDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  absoluteTitle = false,
  ogType = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const displayTitle = absoluteTitle ? title : `${title} | ${SITE_NAME_AR}`;
  const openGraphBase = {
    locale: "ar_SA" as const,
    alternateLocale: ["en_US"],
    url,
    siteName: SITE_NAME,
    title: displayTitle,
    description,
    images: [{ url: ogImage, alt: title }],
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: { canonical: url },
    robots: noIndex ? NOINDEX_ROBOTS : INDEXABLE_ROBOTS,
    openGraph:
      ogType === "article"
        ? {
            ...openGraphBase,
            type: "article" as const,
            publishedTime,
            modifiedTime,
          }
        : {
            ...openGraphBase,
            type: "website" as const,
          },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [ogImage],
    },
  };
}
