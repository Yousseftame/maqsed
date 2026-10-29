"use client";

import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { ShareButton } from "@/components/shared/ShareButton";
import { type ResolvedBlogPost } from "@/features/blog/blog.service";
import { usePublishedPosts } from "@/features/blog/useBlog";
import { BlogListSkeleton } from "@/features/blog/components/BlogSkeletons";
import { ContainedCover } from "@/components/ui/ContainedCover";
import { cn } from "@/lib/utils";

function formatDate(value: number, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ArticleCard({
  post,
  locale,
  isRtl,
  featured,
  featuredLabel,
  ctaLabel,
}: {
  post: ResolvedBlogPost;
  locale: string;
  isRtl: boolean;
  featured?: boolean;
  featuredLabel: string;
  ctaLabel: string;
}) {
  const date = formatDate(post.publishedAt || post.createdAt, locale);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="flex flex-1 cursor-pointer flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white">
          {post.coverImage ? (
            <ContainedCover
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              imageClassName="transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#6A2B92] to-[#3E1854]" />
          )}

          {featured ? (
            <div className="absolute top-3 start-3 z-10 rounded-full bg-[#17C3B3] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
              {featuredLabel}
            </div>
          ) : null}

          {post.category ? (
            <div
              className={cn(
                "absolute top-3 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur-md",
                featured ? "end-3" : "start-3"
              )}
            >
              {post.category}
            </div>
          ) : null}
        </div>

      <div className="flex flex-1 flex-col p-4 text-start">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#8c8c8c]">
          <Clock className="h-3.5 w-3.5 text-[#17C3B3]" />
          <span>
            {date}
          </span>
        </div>

        <h3 className="mb-3 text-lg font-bold leading-snug text-[#0a0f1d] transition-colors group-hover:text-[#6A2B92]">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-[#8c8c8c]">{post.excerpt}</p>
        ) : null}
      </div>
      </Link>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 p-4 pt-4">
          <ShareButton variant="blog" title={post.title} url={`/blog/${post.slug}`} className="shrink-0" />
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0a0f1d] transition-colors hover:text-[#6A2B92]"
          >
            {!isRtl ? null : (
              <ArrowUpRight className="h-4 w-4" />
            )}
            <span>{ctaLabel}</span>
            {isRtl ? null : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </Link>
        </div>
    </div>
  );
}

export function BlogListPage() {
  const { t, locale, isRtl } = useLocale();
  const { posts, isPending, isFetched } = usePublishedPosts();
  const ctaLabel = t("blogPage.readMore");
  const featuredLabel = t("blogPage.featured");

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="px-6 pt-6 pb-16 md:px-12 lg:px-20 lg:pt-8 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-12 max-w-xl">
            <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
              <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
              <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
                {t("nav.blog")}
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#6A2B92] sm:text-5xl">
              <DiaTextReveal
                key={`blog-title-${locale}`}
                text={t("blogPage.title")}
                textColor="#6A2B92"
                colors={["#6A2B92"]}
              />
            </h1>
          </div>

          {isPending ? <BlogListSkeleton /> : null}

          {!isPending && isFetched && posts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] px-8 py-20 text-center">
              <p className="text-lg font-bold text-[#6A2B92]">{t("blogPage.empty")}</p>
            </div>
          ) : null}

          {!isPending && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post, index) => (
                <ArticleCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  isRtl={isRtl}
                  featured={index === 0}
                  featuredLabel={featuredLabel}
                  ctaLabel={ctaLabel}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
