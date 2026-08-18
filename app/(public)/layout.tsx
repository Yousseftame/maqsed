import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicFaq } from "@/components/layout/PublicFaq";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0f1d]">
      <Navbar />
      <main className="flex-1 rounded-b-[2.5rem] bg-white pt-16 md:rounded-b-[3.5rem] lg:rounded-b-[4rem]">
        {children}
        <PublicFaq />
      </main>
      <Footer />
    </div>
  );
}