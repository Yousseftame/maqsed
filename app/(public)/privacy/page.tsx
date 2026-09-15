import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية وشروط استخدام منصة مقصد.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalDocumentPage page="privacy" titleKey="legalPages.privacyTitle" />;
}
