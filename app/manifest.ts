import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION_AR, SITE_NAME, SITE_NAME_AR } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME_AR,
    description: SITE_DESCRIPTION_AR,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6A2B92",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icon-removebg-preview.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
