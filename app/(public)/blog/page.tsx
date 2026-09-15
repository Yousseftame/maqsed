import { BlogListPage } from "@/features/blog/components/BlogListPage";
import { JsonLd } from "@/lib/seo/json-ld";
import { collectionPageJsonLd } from "@/lib/seo/public-content";
import { pageMetadata } from "@/lib/seo/site";

const TITLE = "المدونة";
const DESCRIPTION = "أخبار ومقالات مقصد حول السوق العقاري والمشاريع والوحدات.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd data={collectionPageJsonLd(TITLE, "/blog", DESCRIPTION)} />
      <BlogListPage />
    </>
  );
}
