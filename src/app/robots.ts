import { MetadataRoute } from "next";

const baseUrl = "https://goldenroutine.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General rules for all crawlers
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/*.json$", // Block direct JSON access except manifest
          "/result", // Don't index individual result pages (user data)
        ],
      },
      // Google specific - most important for SEO
      {
        userAgent: "Googlebot",
        allow: ["/", "/manifest.json"],
        disallow: ["/api/", "/_next/", "/private/", "/result"],
      },
      // Googlebot Image - allow all images
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/icons/", "/screenshots/"],
      },
      // Bing
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/api/", "/_next/", "/private/", "/result"],
      },
      // Yandex
      {
        userAgent: "Yandex",
        allow: ["/"],
        disallow: ["/api/", "/_next/", "/private/", "/result"],
      },
      // Baidu - important for Chinese market
      {
        userAgent: "Baiduspider",
        allow: ["/"],
        disallow: ["/api/", "/_next/", "/private/", "/result"],
      },
      // DuckDuckGo
      {
        userAgent: "DuckDuckBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/", "/private/", "/result"],
      },
      // Social Media Crawlers - for Open Graph previews
      {
        userAgent: "facebookexternalhit",
        allow: ["/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/"],
      },
      {
        userAgent: "LinkedInBot",
        allow: ["/"],
      },
      // Block aggressive/unwanted bots
      {
        userAgent: "AhrefsBot",
        disallow: ["/"],
      },
      {
        userAgent: "SemrushBot",
        disallow: ["/"],
      },
      {
        userAgent: "MJ12bot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
