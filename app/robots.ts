import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const host = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/developer",
          "/developer/",
          "/login",
          "/register",
          "/forgot-password",
          "/maintenance",
          "/api/",
          "/offer/",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
