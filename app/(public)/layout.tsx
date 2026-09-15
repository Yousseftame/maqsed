import Script from "next/script";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicFaq } from "@/components/layout/PublicFaq";
import { WhatsAppBubble } from "@/components/layout/WhatsAppBubble";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { PublicRouteLock } from "@/features/maintenance/PublicRouteLock";
import { maintenanceService } from "@/features/maintenance/maintenance.service";
import { MAINTENANCE_PATH } from "@/lib/auth/constants";
import { JsonLd } from "@/lib/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/public-content";

export const revalidate = 60;

const chatbaseEmbed = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="EnkFrond1mCbol0qqQ1Xb";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await maintenanceService.getSettings().catch((error) => {
    console.error("Error reading maintenance settings:", error);
    return null;
  });
  if (settings?.enabled) {
    redirect(MAINTENANCE_PATH);
  }

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Script id="chatbase-embed" strategy="lazyOnload">
        {chatbaseEmbed}
      </Script>
      <PublicRouteLock>
        <div className="flex min-h-screen flex-col bg-[#0a0f1d]">
          <SkipToContent />
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 rounded-b-[2.5rem] bg-white pt-16 outline-none md:rounded-b-[3.5rem] lg:rounded-b-[4rem]"
          >
            {children}
            <PublicFaq />
          </main>
          <Footer />
          <WhatsAppBubble />
        </div>
      </PublicRouteLock>
    </>
  );
}
