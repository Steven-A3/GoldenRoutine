import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import SharePageClient from "./SharePageClient";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ d?: string }>;
}

// Decode share data for metadata generation
function decodeShareData(encoded: string | null): {
  feeling?: string;
  goal?: string;
  affirmation?: string;
  tasksCompleted: number;
  totalTasks: number;
  duration: number;
} | null {
  if (!encoded) return null;
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Dynamic metadata for social sharing
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { d } = await searchParams;
  const data = decodeShareData(d || null);

  // Locale-specific metadata
  const localeMetadata: Record<string, { title: string; description: string }> = {
    en: {
      title: "Someone completed their Golden Morning Routine!",
      description: "See their morning routine results and start your own mindful morning journey.",
    },
    ko: {
      title: "누군가 골든 모닝 루틴을 완료했습니다!",
      description: "그들의 아침 루틴 결과를 확인하고 나만의 마음챙김 아침 여정을 시작하세요.",
    },
    ja: {
      title: "誰かがゴールデンモーニングルーティンを完了しました！",
      description: "彼らのモーニングルーティンの結果を見て、あなた自身のマインドフルな朝の旅を始めましょう。",
    },
    "zh-CN": {
      title: "有人完成了黄金晨间习惯！",
      description: "查看他们的晨间习惯结果，开始您自己的正念早晨之旅。",
    },
    es: {
      title: "¡Alguien completó su Rutina Matutina Dorada!",
      description: "Ve sus resultados y comienza tu propio viaje de mañanas conscientes.",
    },
    fr: {
      title: "Quelqu'un a terminé sa Routine Matinale Dorée !",
      description: "Voyez leurs résultats et commencez votre propre voyage matinal conscient.",
    },
    de: {
      title: "Jemand hat seine Goldene Morgenroutine abgeschlossen!",
      description: "Sehen Sie die Ergebnisse und starten Sie Ihre eigene achtsame Morgenreise.",
    },
  };

  const meta = localeMetadata[locale] || localeMetadata.en;

  // Create dynamic title/description if we have data
  let title = meta.title;
  let description = meta.description;

  if (data) {
    if (data.goal) {
      title = `${meta.title} - "${data.goal.substring(0, 40)}${data.goal.length > 40 ? "..." : ""}"`;
    }
    description = `Completed ${data.tasksCompleted}/${data.totalTasks} tasks in ${data.duration} minutes. ${meta.description}`;
  }

  const url = `${siteConfig.url}/${locale}/share${d ? `?d=${d}` : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: locale.replace("-", "_"),
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/images/og-share.png`,
          width: 1200,
          height: 630,
          alt: "Morning Golden Time - Shared Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/images/og-share.png`],
      creator: "@goldenroutine",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Server Component wrapper
export default async function SharePage({ params }: PageProps) {
  const { locale } = await params;
  return <SharePageClient locale={locale} />;
}
