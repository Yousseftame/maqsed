"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { AdminButton } from "@/features/admin/ui/AdminButton";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { blogService, resolveBlogPost, type BlogPost } from "@/features/blog/blog.service";
import { ViewBlogModal } from "@/features/admin/blog/ViewBlogModal";
import { BlogFormModal } from "@/features/admin/blog/BlogFormModal";

function formatDate(value: number, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [viewPost, setViewPost] = useState<BlogPost | null>(null);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ["blog", "admin"],
    queryFn: () => blogService.getPosts(),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => {
      const resolved = resolveBlogPost(post, locale);
      return [resolved.title, post.slug, resolved.excerpt].join(" ").toLowerCase().includes(q);
    });
  }, [posts, query, locale]);

  async function handleDelete(post: BlogPost) {
    const ok = await confirm({
      title: t("admin.blog.deleteTitle"),
      description: t("admin.blog.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(post.id);
    try {
      await blogService.deletePost(post);
      const remaining = posts.filter((item) => item.id !== post.id);
      if (remaining.length > 0) {
        await blogService.reorderPosts(remaining);
      }
      await queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success(t("admin.ui.saved"));
    } catch {
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  async function move(post: BlogPost, direction: -1 | 1) {
    const index = posts.findIndex((item) => item.id === post.id);
    const swapWith = posts[index + direction];
    if (index < 0 || !swapWith) return;
    const next = [...posts];
    next[index] = swapWith;
    next[index + direction] = post;
    setBusyId(post.id);
    try {
      await blogService.reorderPosts(next);
      await queryClient.invalidateQueries({ queryKey: ["blog"] });
    } catch {
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  function openCreate() {
    setEditPost(null);
    setIsFormOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditPost(post);
    setIsFormOpen(true);
  }

  const columns: Column<BlogPost>[] = [
    {
      id: "order",
      header: t("admin.blog.order"),
      cell: (row) => {
        const index = posts.findIndex((item) => item.id === row.id);
        const isBusy = busyId === row.id;
        return (
          <div className="flex items-center gap-1">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-xs font-bold text-[#0a0f1d]">
              {index + 1}
            </span>
            <button
              type="button"
              disabled={isBusy || index <= 0}
              onClick={() => void move(row, -1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("admin.blog.moveUp")}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={isBusy || index < 0 || index >= posts.length - 1}
              onClick={() => void move(row, 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("admin.blog.moveDown")}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
    {
      id: "cover",
      header: t("admin.blog.cover"),
      cell: (row) =>
        row.coverImage ? (
          <img src={row.coverImage} alt="" className="h-12 w-16 rounded-xl object-cover" />
        ) : (
          <div className="h-12 w-16 rounded-xl bg-[#F4F4F4]" />
        ),
    },
    {
      id: "title",
      header: t("admin.blog.title"),
      cell: (row) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-bold text-[#0a0f1d]">{resolveBlogPost(row, locale).title || "—"}</span>
          <span className="truncate text-xs font-semibold text-[#8c8c8c]">/{row.slug}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.blog.status"),
      cell: (row) => (
        <StatusBadge tone={row.published ? "success" : "muted"}>
          {row.published ? t("admin.blog.published") : t("admin.blog.draft")}
        </StatusBadge>
      ),
    },
    {
      id: "date",
      header: t("admin.blog.date"),
      cell: (row) => (
        <span className="text-sm font-medium text-[#6B7280]">
          {formatDate(row.publishedAt || row.createdAt, locale)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={t("admin.blog.empty")}
        actionsHeader={t("admin.ui.actions")}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative min-w-0 flex-1 max-w-md">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("admin.blog.search")}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <AdminButton type="button" onClick={openCreate}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t("admin.blog.add")}
            </AdminButton>
          </div>
        }
        actions={(row) => (
          <div className="flex justify-end gap-1">
            <TableAction label={t("admin.ui.view")} onClick={() => setViewPost(row)} />
            <TableAction label={t("admin.ui.edit")} onClick={() => openEdit(row)} />
            <TableAction label={t("admin.ui.delete")} tone="danger" onClick={() => void handleDelete(row)} />
          </div>
        )}
      />

      <ViewBlogModal post={viewPost} onClose={() => setViewPost(null)} />
      <BlogFormModal
        isOpen={isFormOpen}
        post={editPost}
        onClose={() => {
          setIsFormOpen(false);
          setEditPost(null);
        }}
      />
    </div>
  );
}
