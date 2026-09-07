import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | MAQSED",
  description: "Terms of use and privacy policy for MAQSED.",
};

export default function PrivacyPage() {
  return <LegalDocumentPage page="privacy" titleKey="legalPages.privacyTitle" />;
}
