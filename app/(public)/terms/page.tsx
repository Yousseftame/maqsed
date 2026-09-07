import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | MAQSED",
  description: "Terms and conditions for using MAQSED.",
};

export default function TermsPage() {
  return <LegalDocumentPage page="terms" titleKey="legalPages.termsTitle" />;
}
