"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Suspense } from "react";

interface SharedData {
  feeling?: string;
  goal?: string;
  affirmation?: string;
  tasksCompleted: number;
  totalTasks: number;
  duration: number;
}

interface ResultPageClientProps {
  locale: string;
}

function decodeShareData(encoded: string | null): SharedData | null {
  if (!encoded) return null;
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function ResultContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const t = useTranslations("completion");
  const tStep2 = useTranslations("steps.step2");
  const tWelcome = useTranslations("welcome");

  const data = decodeShareData(searchParams.get("d"));

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6" role="main">
        <div className="text-6xl mb-4" aria-hidden="true">🤔</div>
        <h1 className="text-xl font-bold text-gray-800 mb-4">Invalid share link</h1>
        <Link href={`/${locale}`} className="text-golden-600 underline">
          {tWelcome("startButton")}
        </Link>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
      role="main"
    >
      {/* Star Animation */}
      <motion.header
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mt-12 mb-8"
      >
        <div className="relative">
          <motion.div
            className="text-8xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden="true"
          >
            🌟
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-golden-400" aria-hidden="true" />
          </motion.div>
        </div>
      </motion.header>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-gray-800 text-center mb-2"
      >
        {t("title")}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 text-center mb-8"
      >
        {t("subtitle")}
      </motion.p>

      {/* Summary Card */}
      <motion.article
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
        aria-labelledby="summary-title"
      >
        <h2 id="summary-title" className="font-semibold text-gray-800 mb-4">{t("summary.title")}</h2>

        <dl className="space-y-4">
          {data.feeling && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">💛</span>
              <div>
                <dt className="text-xs text-gray-500">{t("summary.feeling")}</dt>
                <dd className="font-medium text-gray-800">{tStep2(`feelings.${data.feeling}`)}</dd>
              </div>
            </div>
          )}

          {data.goal && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">🎯</span>
              <div>
                <dt className="text-xs text-gray-500">{t("summary.goal")}</dt>
                <dd className="font-medium text-gray-800">{data.goal}</dd>
              </div>
            </div>
          )}

          {data.affirmation && (
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden="true">✨</span>
              <div>
                <dt className="text-xs text-gray-500">{t("summary.affirmation")}</dt>
                <dd className="font-medium text-gray-800 italic">&quot;{data.affirmation}&quot;</dd>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">💪</span>
            <div>
              <dt className="text-xs text-gray-500">{t("summary.tasksCompleted")}</dt>
              <dd className="font-medium text-gray-800">{data.tasksCompleted}/{data.totalTasks}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">⏱️</span>
            <div>
              <dt className="text-xs text-gray-500">{t("duration")}</dt>
              <dd className="font-medium text-gray-800">{data.duration} {t("minutes")}</dd>
            </div>
          </div>
        </dl>
      </motion.article>

      {/* Quote */}
      <motion.blockquote
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-4 w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-600 italic">
          &quot;{t("quote")}&quot;
        </p>
        <footer className="text-center text-sm text-gray-400 mt-1">
          — {t("quoteAuthor")}
        </footer>
      </motion.blockquote>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md"
      >
        <Link href={`/${locale}`}>
          <button
            className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
            aria-label={tWelcome("startButton")}
          >
            <Play className="w-5 h-5" aria-hidden="true" />
            {tWelcome("startButton")}
          </button>
        </Link>
      </motion.div>
    </motion.main>
  );
}

export default function ResultPageClient({ locale }: ResultPageClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full"
        />
      </div>
    }>
      <ResultContent locale={locale} />
    </Suspense>
  );
}
