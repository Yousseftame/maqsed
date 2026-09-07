import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicFaq } from "@/components/layout/PublicFaq";
import { WhatsAppBubble } from "@/components/layout/WhatsAppBubble";
import { PublicRouteLock } from "@/features/maintenance/PublicRouteLock";
import { maintenanceService } from "@/features/maintenance/maintenance.service";
import { MAINTENANCE_PATH } from "@/lib/auth/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
    <PublicRouteLock>
      <div className="flex min-h-screen flex-col bg-[#0a0f1d]">
        <Navbar />
        <main className="flex-1 rounded-b-[2.5rem] bg-white pt-16 md:rounded-b-[3.5rem] lg:rounded-b-[4rem]">
          {children}
          <PublicFaq />
        </main>
        <Footer />
        <WhatsAppBubble />
      </div>
    </PublicRouteLock>
  );
}
