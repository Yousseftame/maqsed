"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CloudUpload, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { blogService, slugify, type BlogPost } from "@/features/blog/blog.service";
import { cn } from "@/lib/utils";

export function BlogEditor({
  postId,
  post,
  showBack = true,
  onSaved,
}: {
  postId?: string;
  post?: BlogPost | null;
  showBack?: boolean;
  onSaved?: () => void;
}) {
  const { t, isRtl } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [titleAr, setTitleAr] = useState(post?.titleAr || "");
  const [titleEn, setTitleEn] = useState(post?.titleEn || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerptAr, setExcerptAr] = useState(post?.excerptAr || "");
  const [excerptEn, setExcerptEn] = useState(post?.excerptEn || "");
  const [contentAr, setContentAr] = useState(post?.contentAr || "");
  const [contentEn, setContentEn] = useState(post?.contentEn || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [storagePath, setStoragePath] = useState(post?.storagePath || "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [authorAr, setAuthorAr] = useState(post?.authorAr || "");
  const [authorEn, setAuthorEn] = useState(post?.authorEn || "");
  const [categoryAr, setCategoryAr] = useState(post?.categoryAr || "");
  const [categoryEn, setCategoryEn] = useState(post?.categoryEn || "");
  const [isSaving, setIsSaving] = useState(false);

  const { data: existing, isFetched } = useQuery({
    queryKey: ["blog", "post", postId],
    queryFn: () => blogService.getPost(postId!),
    enabled: Boolean(postId) && !post,
  });

  const currentPost = post || existing || null;
  const currentId = post?.id || postId;

  useEffect(() => {
    if (post) return;
    if (!postId || !isFetched || !existing) return;
    setTitleAr(existing.titleAr);
    setTitleEn(existing.titleEn);
    setSlug(existing.slug);
    setExcerptAr(existing.excerptAr);
    setExcerptEn(existing.excerptEn);
    setContentAr(existing.contentAr);
    setContentEn(existing.contentEn);
    setCoverImage(existing.coverImage);
    setStoragePath(existing.storagePath || "");
    setPublished(existing.published);
    setAuthorAr(existing.authorAr);
    setAuthorEn(existing.authorEn);
    setCategoryAr(existing.categoryAr);
    setCategoryEn(existing.categoryEn);
    setCoverFile(null);
  }, [existing, isFetched, post, postId]);

  function onCoverPick(file: File) {
    if (coverImage.startsWith("blob:")) URL.revokeObjectURL(coverImage);
    setCoverFile(file);
    setCoverImage(URL.createObjectURL(file));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const nextSlug = slugify(slug);
    if (!titleAr.trim() && !titleEn.trim()) {
      toast.error(t("admin.blog.titleRequired"));
      return;
    }
    if (!nextSlug) {
      toast.error(t("admin.blog.slugRequired"));
      return;
    }

    setIsSaving(true);
    try {
      if (await blogService.isSlugTaken(nextSlug, currentId)) {
        toast.error(t("admin.blog.slugTaken"));
        return;
      }

      let nextCover = coverImage.startsWith("blob:") ? "" : coverImage;
      let nextStoragePath = storagePath;
      if (coverFile) {
        const uploaded = await blogService.uploadCover(coverFile);
        nextCover = uploaded.url;
        nextStoragePath = uploaded.storagePath;
      }

      const payload = {
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim(),
        slug: nextSlug,
        excerptAr: excerptAr.trim(),
        excerptEn: excerptEn.trim(),
        contentAr: contentAr.trim(),
        contentEn: contentEn.trim(),
        coverImage: nextCover,
        storagePath: nextStoragePath,
        published,
        authorAr: authorAr.trim(),
        authorEn: authorEn.trim(),
        categoryAr: categoryAr.trim(),
        categoryEn: categoryEn.trim(),
      };

      if (currentId && currentPost) {
        await blogService.updatePost(currentId, payload, currentPost);
      } else {
        await blogService.createPost(payload);
      }

      if (coverImage.startsWith("blob:")) URL.revokeObjectURL(coverImage);
      await queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success(t("admin.ui.saved"));
      if (onSaved) {
        onSaved();
      } else {
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  const fields = (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("admin.blog.titleAr")}>
          <input
            dir="rtl"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            placeholder={t("admin.blog.titleAr")}
            className={fieldClass}
          />
        </Field>
        <Field label={t("admin.blog.titleEn")}>
          <input
            dir="ltr"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder={t("admin.blog.titleEn")}
            className={`${fieldClass} text-start`}
          />
        </Field>
      </div>

      <Field label={t("admin.blog.slug")}>
        <input
          dir="ltr"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="real-estate-news"
          className={`${fieldClass} text-start font-mono`}
        />
        <span className="text-xs font-semibold text-[#8c8c8c]">{t("admin.blog.slugHint")}</span>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("admin.blog.authorAr")}>
          <input
            dir="rtl"
            value={authorAr}
            onChange={(e) => setAuthorAr(e.target.value)}
            placeholder={t("admin.blog.authorAr")}
            className={fieldClass}
          />
        </Field>
        <Field label={t("admin.blog.authorEn")}>
          <input
            dir="ltr"
            value={authorEn}
            onChange={(e) => setAuthorEn(e.target.value)}
            placeholder={t("admin.blog.authorEn")}
            className={`${fieldClass} text-start`}
          />
        </Field>
        <Field label={t("admin.blog.categoryAr")}>
          <input
            dir="rtl"
            value={categoryAr}
            onChange={(e) => setCategoryAr(e.target.value)}
            placeholder={t("admin.blog.categoryAr")}
            className={fieldClass}
          />
        </Field>
        <Field label={t("admin.blog.categoryEn")}>
          <input
            dir="ltr"
            value={categoryEn}
            onChange={(e) => setCategoryEn(e.target.value)}
            placeholder={t("admin.blog.categoryEn")}
            className={`${fieldClass} text-start`}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("admin.blog.excerptAr")}>
          <textarea
            dir="rtl"
            rows={3}
            value={excerptAr}
            onChange={(e) => setExcerptAr(e.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label={t("admin.blog.excerptEn")}>
          <textarea
            dir="ltr"
            rows={3}
            value={excerptEn}
            onChange={(e) => setExcerptEn(e.target.value)}
            className={`${textareaClass} text-start`}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.blog.cover")}</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
        >
          {coverImage ? (
            <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0a0f1d] shadow-sm">
              <CloudUpload className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 font-bold text-[#0a0f1d]">
              {t("admin.blog.coverUpload")}
            </span>
          </div>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onCoverPick(file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t("admin.blog.contentAr")}>
          <textarea
            dir="rtl"
            rows={12}
            value={contentAr}
            onChange={(e) => setContentAr(e.target.value)}
            className={`${textareaClass} min-h-[280px]`}
          />
        </Field>
        <Field label={t("admin.blog.contentEn")}>
          <textarea
            dir="ltr"
            rows={12}
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            className={`${textareaClass} min-h-[280px] text-start`}
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={() => setPublished((current) => !current)}
        className="flex items-center justify-between gap-4 rounded-[24px] bg-[#F4F4F4] px-5 py-4 text-start"
      >
        <span className="text-sm font-bold text-[#0a0f1d]">{t("admin.blog.publish")}</span>
        <span
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            published ? "bg-[#17C3B3]" : "bg-[#D1D5DB]"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
              published ? "start-[1.35rem]" : "start-0.5"
            )}
          />
        </span>
      </button>
    </div>
  );

  return (
    <form
      onSubmit={handleSave}
      className={cn("flex flex-col gap-6", showBack ? "pt-4 sm:pt-6 pb-20" : "")}
    >
      {showBack ? (
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8c8c8c] transition-colors hover:text-[#0a0f1d]"
          >
            <ArrowRight className={cn("h-4 w-4", !isRtl && "rotate-180")} />
            {t("admin.blog.back")}
          </Link>
        </div>
      ) : null}

      {showBack ? <Panel title={currentId ? t("admin.blog.edit") : t("admin.blog.add")}>{fields}</Panel> : fields}

      <div className="flex justify-end">
        <AdminButton type="submit" disabled={isSaving} className="w-full px-10 sm:w-auto">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("admin.ui.save")}
        </AdminButton>
      </div>
    </form>
  );
}
