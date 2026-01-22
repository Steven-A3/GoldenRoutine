import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { locales, isRtlLocale, type Locale } from "@/i18n/config";
import { defaultMetadata, structuredData, faqStructuredData, siteConfig } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = defaultMetadata;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// SEO-optimized locale titles and descriptions
const localeMetadata: Record<string, { title: string; description: string }> = {
  en: {
    title: "Morning Golden Time - Best Morning Routine App for Mindful Productivity",
    description: "Transform your morning with the #1 morning routine app. Digital detox, affirmations, weather planning, journaling, and habit tracking.",
  },
  ko: {
    title: "모닝 골든 타임 - 최고의 아침 루틴 앱",
    description: "아침을 황금빛으로 물들이는 골든 루틴 앱. 디지털 디톡스, 확언, 날씨 확인, 저널링, 습관 추적 기능.",
  },
  ja: {
    title: "モーニングゴールデンタイム - 最高の朝ルーティンアプリ",
    description: "朝を黄金の時間に変える究極のルーティンアプリ。デジタルデトックス、アファメーション、天気予報、ジャーナリング機能。",
  },
  "zh-CN": {
    title: "早晨黄金时间 - 最佳晨间习惯追踪应用",
    description: "将您的早晨变成黄金时刻。数字排毒、肯定语、天气规划、日记和习惯追踪功能。",
  },
  es: {
    title: "Morning Golden Time - La Mejor App de Rutina Matutina",
    description: "Transforma tu mañana con la app de rutina matutina #1. Desintoxicación digital, afirmaciones, planificación del clima y seguimiento de hábitos.",
  },
  fr: {
    title: "Morning Golden Time - Meilleure App de Routine Matinale",
    description: "Transformez votre matinée avec l'app de routine matinale #1. Détox numérique, affirmations, météo et suivi des habitudes.",
  },
  de: {
    title: "Morning Golden Time - Beste Morgenroutine-App",
    description: "Verwandeln Sie Ihren Morgen mit der #1 Morgenroutine-App. Digital Detox, Affirmationen, Wetterplanung und Gewohnheitstracking.",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = isRtlLocale(locale as Locale);
  const localeMeta = localeMetadata[locale] || localeMetadata.en;

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"}>
      <head>
        {/* Primary Meta Tags */}
        <title>{localeMeta.title}</title>
        <meta name="title" content={localeMeta.title} />
        <meta name="description" content={localeMeta.description} />
        <meta name="keywords" content="morning routine app, morning golden time, golden hour routine, morning habit tracker, digital detox app, morning mindfulness, morning affirmations, morning journaling, morning productivity, daily routine tracker, best morning routine app, mindful morning routine" />

        {/* Canonical URL */}
        <link rel="canonical" href={`${siteConfig.url}/${locale}`} />

        {/* Alternate Language Links for SEO */}
        {locales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`${siteConfig.url}/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Golden Time" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FBBF24" />
        <meta name="msapplication-TileColor" content="#FBBF24" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteConfig.url}/${locale}`} />
        <meta property="og:title" content={localeMeta.title} />
        <meta property="og:description" content={localeMeta.description} />
        <meta property="og:image" content={`${siteConfig.url}/images/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={locale.replace("-", "_")} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${siteConfig.url}/${locale}`} />
        <meta name="twitter:title" content={localeMeta.title} />
        <meta name="twitter:description" content={localeMeta.description} />
        <meta name="twitter:image" content={`${siteConfig.url}/images/og-image.png`} />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="Golden Routine" />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="format-detection" content="telephone=no" />

        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-9348297343583989" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Structured Data - FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/icons/icon-512x512.png`,
              sameAs: [
                "https://twitter.com/goldenroutine",
                "https://github.com/goldenroutine",
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
