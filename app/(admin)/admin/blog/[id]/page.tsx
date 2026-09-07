"use client";

import { useParams } from "next/navigation";
import { BlogEditor } from "@/features/admin/blog/BlogEditor";

export default function AdminEditBlogPage() {
  const params = useParams<{ id: string }>();
  return <BlogEditor postId={params.id} />;
}
