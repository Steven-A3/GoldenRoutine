import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo";
import ResultPageClient from "./ResultPageClient";

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

// Dynamic metadata for result page
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { d } = await searchParams;
  const data = decodeShareData(d || null);

  // Locale-specific metadata
  const localeMetadata: Record<string, { title: string; description: string }> = {
    en: {
      title: "Morning Routine Completed! | Morning Golden Time",
      description: "Congratulations on completing your morning routine! View your summary and share your achievement.",
    },
    ko: {
      title: "아침 루틴 완료! | 모닝 골든 타임",
      description: "아침 루틴을 완료한 것을 축하합니다! 요약을 확인하고 성과를 공유하세요.",
    },
    ja: {
      title: "モーニングルーティン完了！ | モーニングゴールデンタイム",
      description: "モーニングルーティンの完了おめでとうございます！要約を確認し、達成を共有しましょう。",
    },
    "zh-CN": {
      title: "晨间习惯完成！| 早晨黄金时间",
      description: "恭喜完成晨间习惯！查看摘要并分享您的成就。",
    },
    es: {
      title: "¡Rutina Matutina Completada! | Morning Golden Time",
      description: "¡Felicidades por completar tu rutina matutina! Ve tu resumen y comparte tu logro.",
    },
    fr: {
      title: "Routine Matinale Terminée ! | Morning Golden Time",
      description: "Félicitations pour avoir terminé votre routine matinale ! Consultez votre résumé et partagez votre réussite.",
    },
    de: {
      title: "Morgenroutine Abgeschlossen! | Morning Golden Time",
      description: "Herzlichen Glückwunsch zum Abschluss Ihrer Morgenroutine! Sehen Sie Ihre Zusammenfassung und teilen Sie Ihren Erfolg.",
    },
  };

  const meta = localeMetadata[locale] || localeMetadata.en;
  let title = meta.title;
  let description = meta.description;

  if (data) {
    description = `Completed ${data.tasksCompleted}/${data.totalTasks} tasks in ${data.duration} minutes. ${meta.description}`;
  }

  const url = `${siteConfig.url}/${locale}/result${d ? `?d=${d}` : ""}`;

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
          url: `${siteConfig.url}/images/og-result.png`,
          width: 1200,
          height: 630,
          alt: "Morning Golden Time - Routine Completed",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/images/og-result.png`],
      creator: "@goldenroutine",
    },
    robots: {
      index: false, // Don't index individual result pages
      follow: true,
    },
  };
}

// Server Component wrapper
export default async function ResultPage({ params }: PageProps) {
  const { locale } = await params;
  return <ResultPageClient locale={locale} />;
}
