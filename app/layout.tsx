import type { Metadata, Viewport } from "next";
import Script from "next/script";
import {
  plusJakartaSans,
  manrope,
  ibmPlexSansArabic,
} from "./fonts";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SplashProvider } from "@/components/providers/SplashProvider";
import { AosProvider } from "@/components/providers/AosProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { AppToaster } from "@/components/providers/AppToaster";
import { MaintenanceGuard } from "@/features/maintenance/MaintenanceGuard";
import {
  SITE_DESCRIPTION_AR,
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_NAME_AR,
  getSiteUrl,
} from "@/lib/seo/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6A2B92",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME_AR}`,
  },
  description: SITE_DESCRIPTION_AR,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "real estate",
  icons: {
    icon: [{ url: "/icon-removebg-preview.png", type: "image/png" }],
    shortcut: "/icon-removebg-preview.png",
    apple: "/icon-removebg-preview.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION_AR,
    images: [{ url: "/icon-removebg-preview.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION_EN,
    images: ["/icon-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const localeBootstrap = `(function(){try{var l=localStorage.getItem("maqsed-locale");if(l==="en"){var d=document.documentElement;d.lang="en";d.dir="ltr";d.classList.add("locale-en");d.classList.remove("locale-ar");}}catch(e){}})();`;

const maintenanceBootstrap = `(function(){try{var p=location.pathname;if(p==="/maintenance"||p.indexOf("/maintenance/")===0||p.indexOf("/admin")===0||p.indexOf("/developer")===0||p==="/login"||p==="/forgot-password")return;if(/(?:^|; )maqsed_maintenance=1(?:;|$)/.test(document.cookie)){document.documentElement.classList.add("maintenance-pending");location.replace("/maintenance");}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${manrope.variable} ${ibmPlexSansArabic.variable} locale-ar min-h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.chatbase.co" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Script id="maqsed-locale-bootstrap" strategy="beforeInteractive">
          {localeBootstrap}
        </Script>
        <Script id="maqsed-maintenance-bootstrap" strategy="beforeInteractive">
          {maintenanceBootstrap}
        </Script>
        <LocaleProvider>
          <QueryProvider>
            <AuthProvider>
              <MaintenanceGuard />
              <SmoothScrollProvider>
                <SplashProvider>
                  <AosProvider>{children}</AosProvider>
                </SplashProvider>
                <AppToaster />
              </SmoothScrollProvider>
            </AuthProvider>
          </QueryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
