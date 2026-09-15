import { FaqPage } from "@/features/faq/FaqPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { faqJsonLd, getCachedFaqs } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "الأسئلة الشائعة",
  description: "إجابات الأسئلة الشائعة حول مقصد، المشاريع، الوحدات، والتواصل معنا.",
  path: "/faq",
});

export default async function FAQRoutePage() {
  const faqs = await getCachedFaqs();
  const schema = faqJsonLd(faqs);

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <FaqPage />
    </>
  );
}
