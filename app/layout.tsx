import type { Metadata } from "next";
import Script from "next/script";
import {
  plusJakartaSans,
  manrope,
  cairo,
  notoKufiArabic,
} from "./fonts";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SplashProvider } from "@/components/providers/SplashProvider";
import { AosProvider } from "@/components/providers/AosProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export const metadata: Metadata = {
  title: " Maqsed | مقصد",
  description:
    "MAQSED is your trusted real estate platform for buying, selling, and renting premium properties.",
  icons: {
    icon: [{ url: "/icon-removebg-preview.png", type: "image/png" }],
    shortcut: "/icon-removebg-preview.png",
    apple: "/icon-removebg-preview.png",
  },
};

const localeBootstrap = `(function(){try{var l=localStorage.getItem("maqsed-locale");if(l==="ar"){var d=document.documentElement;d.lang="ar";d.dir="rtl";d.classList.add("locale-ar");d.classList.remove("locale-en");}}catch(e){}})();`;

const chatbaseEmbed = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="EnkFrond1mCbol0qqQ1Xb";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${manrope.variable} ${cairo.variable} ${notoKufiArabic.variable} min-h-full antialiased`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Script id="maqsed-locale-bootstrap" strategy="beforeInteractive">
          {localeBootstrap}
        </Script>
        <Script id="chatbase-embed" strategy="afterInteractive">
          {chatbaseEmbed}
        </Script>
        <LocaleProvider>
          <SmoothScrollProvider>
            <ToastProvider>
              <SplashProvider>
                <AosProvider>{children}</AosProvider>
              </SplashProvider>
            </ToastProvider>
          </SmoothScrollProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
