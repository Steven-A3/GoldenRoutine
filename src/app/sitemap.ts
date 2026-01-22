import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";

const baseUrl = "https://goldenroutine.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Generate sitemap entries for each locale
  const localeEntries = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: locale === "en" ? 1 : 0.9,
  }));

  // Main entry points
  const mainEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  return [...mainEntries, ...localeEntries];
}
