import { SellPage } from "@/features/sell/components/SellPage";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "اعرض وحدتك",
  description:
    "قدّم طلب تسويق وبيع وحدتك مع مقصد. فريقنا يراجع الطلب ويتابع معك الخطوات التالية.",
  path: "/sell",
});

export default function SellYourUnitPage() {
  return <SellPage />;
}
