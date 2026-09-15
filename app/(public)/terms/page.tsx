import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "الشروط والأحكام",
  description: "الشروط والأحكام الخاصة باستخدام منصة مقصد.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalDocumentPage page="terms" titleKey="legalPages.termsTitle" />;
}
