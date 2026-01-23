import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const baseUrl = "https://goldenroutine.app";

// Pages that should be indexed
const indexablePages = [
  { path: "", priority: 1, changeFrequency: "daily" as const },
  { path: "/share", priority: 0.7, changeFrequency: "weekly" as const },
];

// Image assets for image sitemap
const siteImages = [
  {
    loc: `${baseUrl}/images/og-image.png`,
    title: "Morning Golden Time - Transform Your Morning Routine",
    caption: "The #1 morning routine app for mindful productivity",
  },
  {
    loc: `${baseUrl}/icons/icon-512x512.png`,
    title: "Morning Golden Time App Icon",
    caption: "Golden sunrise icon representing the morning golden hour",
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Root URL
  entries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1,
  });

  // Generate entries for each locale and page combination
  for (const locale of locales) {
    for (const page of indexablePages) {
      // Determine priority based on locale and page
      let priority = page.priority;
      if (locale !== "en") {
        priority = Math.max(0.5, priority - 0.1);
      }

      entries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority,
        // Note: images would be added here in a full implementation
        // but Next.js sitemap doesn't support image sitemap natively
      });
    }
  }

  return entries;
}

// Generate separate image sitemap (for Google Images)
export function generateImageSitemap(): string {
  const images = siteImages
    .map(
      (img) => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    ${images}
  </url>
</urlset>`;
}
