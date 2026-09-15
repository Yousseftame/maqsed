import type { MetadataRoute } from "next";
import { propertiesService, propertyPublicPath } from "@/features/admin/projects/properties.service";
import { unitsService, unitPublicPath } from "@/features/admin/units/units.service";
import { blogService } from "@/features/blog/blog.service";
import { isPublicProject } from "@/features/units/mapPublicUnits";
import { toSafeDate } from "@/lib/seo/public-content";
import { absoluteUrl } from "@/lib/seo/site";

export const revalidate = 300;

const STATIC_PATHS: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "weekly", priority: 0.8 },
  { path: "/properties", changeFrequency: "daily", priority: 0.9 },
  { path: "/units", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sell", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((item) => ({
    url: absoluteUrl(item.path),
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  try {
    const [properties, units, posts] = await Promise.all([
      propertiesService.getProperties().catch(() => []),
      unitsService.getUnits().catch(() => []),
      blogService.getPublishedPosts().catch(() => []),
    ]);

    for (const property of properties) {
      if (!isPublicProject(property.status)) continue;
      entries.push({
        url: absoluteUrl(propertyPublicPath(property)),
        lastModified: toSafeDate(property.updatedAt) || toSafeDate(property.createdAt) || now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    const publicPropertyIds = new Set(
      properties.filter((property) => isPublicProject(property.status)).map((property) => property.id)
    );

    for (const unit of units) {
      const independent = unit.projectId === "independent";
      if (!independent && !publicPropertyIds.has(unit.projectId)) continue;
      entries.push({
        url: absoluteUrl(unitPublicPath(unit)),
        lastModified: toSafeDate(unit.updatedAt) || toSafeDate(unit.createdAt) || now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const post of posts) {
      if (!post.slug) continue;
      entries.push({
        url: absoluteUrl(`/blog/${encodeURIComponent(post.slug)}`),
        lastModified: toSafeDate(post.publishedAt) || toSafeDate(post.updatedAt) || now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error("Failed to build dynamic sitemap entries:", error);
  }

  return entries;
}
