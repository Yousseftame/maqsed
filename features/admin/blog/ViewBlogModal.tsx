"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { type BlogPost } from "@/features/blog/blog.service";

function formatDate(value: number, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function DetailBlock({ label, value, dir }: { label: string; value?: string; dir?: "rtl" | "ltr" }) {
  return (
    <div className="flex flex-col gap-1 rounded-[16px] bg-white p-4">
      <span className="text-sm font-bold text-[#8c8c8c]">{label}</span>
      <p dir={dir} className="whitespace-pre-line text-base font-bold leading-relaxed text-[#0a0f1d]">
        {value?.trim() || "—"}
      </p>
    </div>
  );
}

export function ViewBlogModal({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!post) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <AnimatePresence>
      {post ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <h2 className="truncate text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
                  {t("admin.blog.details")}
                </h2>
                <StatusBadge tone={post.published ? "success" : "muted"}>
                  {post.published ? t("admin.blog.published") : t("admin.blog.draft")}
                </StatusBadge>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF9F6] px-6 py-6 sm:px-8">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="h-56 w-full rounded-[20px] object-cover" />
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailBlock label={t("admin.blog.titleAr")} value={post.titleAr} dir="rtl" />
                <DetailBlock label={t("admin.blog.titleEn")} value={post.titleEn} dir="ltr" />
                <DetailBlock label={t("admin.blog.slug")} value={post.slug} dir="ltr" />
                <DetailBlock
                  label={t("admin.blog.date")}
                  value={formatDate(post.publishedAt || post.createdAt, locale)}
                />
                <DetailBlock label={t("admin.blog.categoryAr")} value={post.categoryAr} dir="rtl" />
                <DetailBlock label={t("admin.blog.categoryEn")} value={post.categoryEn} dir="ltr" />
                <DetailBlock label={t("admin.blog.excerptAr")} value={post.excerptAr} dir="rtl" />
                <DetailBlock label={t("admin.blog.excerptEn")} value={post.excerptEn} dir="ltr" />
              </div>

              <DetailBlock label={t("admin.blog.contentAr")} value={post.contentAr} dir="rtl" />
              <DetailBlock label={t("admin.blog.contentEn")} value={post.contentEn} dir="ltr" />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
