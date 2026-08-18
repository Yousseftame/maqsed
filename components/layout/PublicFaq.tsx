"use client";

import { usePathname } from "next/navigation";
import { FAQSection } from "@/features/home/components/FAQSection";

export function PublicFaq() {
  const pathname = usePathname();

  if (pathname === "/faq") {
    return null;
  }

  return <FAQSection />;
}
