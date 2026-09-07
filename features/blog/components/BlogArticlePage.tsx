"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usePublishedPost } from "@/features/blog/useBlog";
import { ShareButton } from "@/components/shared/ShareButton";
import { BlogArticleSkeleton } from "@/features/blog/components/BlogSkeletons";
import { cn } from "@/lib/utils";

function formatDate(value: number, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function ArticleBody({ content }: { content: string }) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div className="space-y-7">
      {blocks.map((block, index) => (
        <p
          key={index}
          className={cn(
            "whitespace-pre-line leading-[2] text-[#3A3344]",
            index === 0 ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          )}
        >
          {block}
        </p>
      ))}
    </div>
  );
}

function BackLink({ label, isRtl }: { label: string; isRtl: boolean }) {
  return (
    <Link
      href="/blog"
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]"
    >
      <ArrowRight className={cn("h-4 w-4", !isRtl && "rotate-180")} />
      {label}
    </Link>
  );
}

export function BlogArticlePage() {
  const { t, locale, isRtl } = useLocale();
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug || "");
  const { post, isPending, isFetched } = usePublishedPost(slug);

  if (isPending) {
    return <BlogArticleSkeleton />;
  }

  if (isFetched && !post) {
    return (
      <div className="flex w-full flex-col bg-[#fcfcfc]">
        <section className="px-6 pt-6 pb-20 text-center md:px-12 lg:px-20 lg:pt-8">
          <p className="mb-6 text-lg font-bold text-[#6A2B92]">{t("blogPage.notFound")}</p>
          <BackLink label={t("blogPage.back")} isRtl={isRtl} />
        </section>
      </div>
    );
  }

  if (!post) {
    return <BlogArticleSkeleton />;
  }

  const date = formatDate(post.publishedAt || post.createdAt, locale);
  const author = post.author || t("blogPage.authorFallback");

  return (
    <div className="flex w-full flex-col bg-[#fcfcfc]">
      <article className="px-6 pt-6 pb-16 md:px-12 lg:px-20 lg:pt-8 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <BackLink label={t("blogPage.back")} isRtl={isRtl} />
            <ShareButton variant="blog" title={post.title} url={`/blog/${post.slug}`} />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[4/3] min-h-[280px] bg-[#3E1854] lg:aspect-auto lg:min-h-[520px]">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6A2B92] to-[#3E1854]" />
                )}
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                {post.category ? (
                  <div className="mb-5 w-fit rounded-full border border-[#17C3B3]/20 bg-[#17C3B3]/10 px-4 py-1.5 text-sm font-bold text-[#17C3B3]">
                    {post.category}
                  </div>
                ) : null}

                <h1 className="mb-6 text-3xl font-black leading-tight tracking-tight text-[#0a0f1d] sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>

                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-[#8c8c8c]">
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4 text-[#17C3B3]" />
                    {author}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#17C3B3]" />
                    {date}
                  </span>
                </div>

                {post.excerpt ? (
                  <p className="text-base leading-relaxed text-gray-500 sm:text-lg">{post.excerpt}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-gray-100 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-[#6A2B92] sm:text-3xl">
              {t("blogPage.contentTitle")}
            </h2>
            <ArticleBody content={post.content} />
          </div>
        </div>
      </article>
    </div>
  );
}
