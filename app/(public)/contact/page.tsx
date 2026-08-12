import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | MAQSED",
  description:
    "Get in touch with MAQSED. Send a message about buying, selling, partnerships, or support.",
};

export default function ContactUsPage() {
  return <ContactPage />;
}
