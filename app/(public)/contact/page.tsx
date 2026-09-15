import { ContactPage } from "@/features/contact/components/ContactPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { contactPageJsonLd } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "تواصل معنا",
  description:
    "تواصل مع فريق مقصد للاستفسار عن المشاريع والوحدات، أو الشراكات، أو طلب الدعم.",
  path: "/contact",
});

export default function ContactUsPage() {
  return (
    <>
      <JsonLd data={contactPageJsonLd()} />
      <ContactPage />
    </>
  );
}
