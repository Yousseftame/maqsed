"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { blogService, resolveBlogPost, type BlogPost } from "@/features/blog/blog.service";

export function usePublishedPosts() {
  const { locale } = useLocale();
  const { data, isPending, isFetched } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: () => blogService.getPublishedPosts(),
  });
  return {
    posts: (data || []).map((post) => resolveBlogPost(post, locale)),
    isPending,
    isFetched,
  };
}

export function usePublishedPost(slug: string) {
  const { locale } = useLocale();
  const queryClient = useQueryClient();
  const { data, isPending, isFetched, isError } = useQuery({
    queryKey: ["blog", "slug", slug],
    queryFn: () => blogService.getPublishedBySlug(slug),
    enabled: Boolean(slug),
    placeholderData: () => {
      const posts = queryClient.getQueryData<BlogPost[]>(["blog", "published"]);
      return posts?.find((post) => post.slug === slug && post.published);
    },
  });
  return {
    post: data ? resolveBlogPost(data, locale) : null,
    isPending,
    isFetched,
    isError,
  };
}
