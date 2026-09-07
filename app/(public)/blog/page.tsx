import type { Metadata } from "next";
import { BlogListPage } from "@/features/blog/components/BlogListPage";

export const metadata: Metadata = {
  title: "Blog | MAQSED",
  description: "News and articles from MAQSED.",
};

export default function BlogPage() {
  return <BlogListPage />;
}
