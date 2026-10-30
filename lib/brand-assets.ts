import splashscreen from "@/assets/brand/splashscreen.png";
import iconHero from "@/assets/brand/iconheroimg.png";
import authPattern from "@/assets/brand/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg";
import iconPng from "@/assets/brand/icon-removebg-preview.png";
import logoAdmin from "@/assets/brand/logoadminpanel.png";
import defaultHero from "@/assets/brand/9.jpg";
import gmailIcon from "@/assets/brand/google_mail_gmail_logo_icon_159346.webp";
import pagePattern from "@/assets/brand/patern-maqsed.jpg";

function assetSrc(asset: string | { src: string }) {
  return typeof asset === "string" ? asset : asset.src;
}

/** Bundled brand assets — use on App Hosting where /public/* can 404. */
export const BRAND_ASSETS = {
  splash: assetSrc(splashscreen),
  /** PNG stand-in for /svglogo.svg (SVG imports are unreliable under Turbopack). */
  logoSvg: assetSrc(logoAdmin),
  iconHero: assetSrc(iconHero),
  authPattern: assetSrc(authPattern),
  icon: assetSrc(iconPng),
  logoAdmin: assetSrc(logoAdmin),
  defaultHero: assetSrc(defaultHero),
  gmail: assetSrc(gmailIcon),
} as const;
