import type { Metadata } from "next";
import { BlogArticlePage } from "@/features/blog/components/BlogArticlePage";
import { JsonLd } from "@/lib/seo/json-ld";
import { blogPostingJsonLd, breadcrumbJsonLd, getCachedPost, toSafeDate } from "@/lib/seo/public-content";
import { pageMetadata, SITE_DESCRIPTION_AR } from "@/lib/seo/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  const path = `/blog/${encodeURIComponent(slug)}`;
  if (!post) {
    return pageMetadata({
      title: "المدونة",
      description: SITE_DESCRIPTION_AR,
      path,
      noIndex: true,
    });
  }

  const title = post.titleAr || post.titleEn || "مقال";
  const description = post.excerptAr || post.excerptEn || SITE_DESCRIPTION_AR;
  const publishedTime = toSafeDate(post.publishedAt)?.toISOString();
  const modifiedTime = toSafeDate(post.updatedAt)?.toISOString() || publishedTime;
  return pageMetadata({
    title,
    description,
    path: `/blog/${encodeURIComponent(post.slug || slug)}`,
    image: post.coverImage || undefined,
    ogType: "article",
    publishedTime,
    modifiedTime,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getCachedPost(slug);
  const path = `/blog/${encodeURIComponent(post?.slug || slug)}`;

  return (
    <>
      {post ? (
        <JsonLd
          data={[
            blogPostingJsonLd(post, slug),
            breadcrumbJsonLd([
              { name: "الرئيسية", path: "/" },
              { name: "المدونة", path: "/blog" },
              { name: post.titleAr || post.titleEn || "مقال", path },
            ]),
          ]}
        />
      ) : null}
      <BlogArticlePage />
    </>
  );
}
