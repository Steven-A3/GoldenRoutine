"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Brain, Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSelector } from "@/components/LanguageSelector";

interface SharedData {
  feeling?: string;
  goal?: string;
  affirmation?: string;
  tasksCompleted: number;
  totalTasks: number;
  duration: number;
}

interface SharePageClientProps {
  locale: string;
}

const STEP_ICONS = ["🔇", "🎯", "☀️", "📝", "🏃", "📈"];
const STEP_KEYS = ["step1", "step2", "step3", "step4", "step5", "step6"];

function decodeShareData(encoded: string | null): SharedData | null {
  if (!encoded) return null;
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function SharePageClient({ locale }: SharePageClientProps) {
  const t = useTranslations();
  const tStep2 = useTranslations("steps.step2");
  const tCompletion = useTranslations("completion");

  const [data, setData] = useState<SharedData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Read URL params on client side only
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d");
    const decoded = decodeShareData(encoded);
    setData(decoded);
    setIsLoaded(true);
  }, []);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Loading">
        <div className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no data, show regular welcome-like screen
  if (!data) {
    return (
      <main className="flex flex-col items-center min-h-screen p-6" role="main">
        <nav className="absolute top-4 right-4" aria-label="Language selection">
          <LanguageSelector />
        </nav>

        <header className="mt-12 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-golden-300 to-golden-500 flex items-center justify-center golden-glow">
              <Sun className="w-16 h-16 text-white" aria-hidden="true" />
            </div>
          </div>
        </header>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          {t("app.name")}
        </h1>

        <p className="text-gray-600 text-center mb-8">
          {t("share.invalidLink")}
        </p>

        <div className="w-full max-w-md">
          <Link href={`/${locale}`}>
            <button className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" aria-hidden="true" />
              {t("welcome.startButton")}
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-6" role="main">
      <nav className="absolute top-4 right-4" aria-label="Language selection">
        <LanguageSelector />
      </nav>

      {/* Sun Logo */}
      <motion.header
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mt-12 mb-6"
      >
        <div className="relative">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-golden-300 to-golden-500 flex items-center justify-center golden-glow"
            animate={{ boxShadow: ["0 0 30px rgba(251, 191, 36, 0.4)", "0 0 60px rgba(251, 191, 36, 0.6)", "0 0 30px rgba(251, 191, 36, 0.4)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sun className="w-16 h-16 text-white" aria-hidden="true" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-golden-500" aria-hidden="true" />
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
        {t("app.name")}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-golden-600 font-medium mb-6"
      >
        {t("share.someoneCompleted")}
      </motion.p>

      {/* Shared Results Card */}
      <motion.article
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
        aria-labelledby="results-title"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl" aria-hidden="true">🌟</span>
          <h2 id="results-title" className="font-semibold text-gray-800">{t("share.theirResults")}</h2>
        </div>

        <dl className="space-y-3">
          {data.feeling && (
            <div className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">💛</span>
              <div>
                <dt className="text-xs text-gray-500">{tCompletion("summary.feeling")}</dt>
                <dd className="font-medium text-gray-800">{tStep2(`feelings.${data.feeling}`)}</dd>
              </div>
            </div>
          )}

          {data.goal && (
            <div className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">🎯</span>
              <div>
                <dt className="text-xs text-gray-500">{tCompletion("summary.goal")}</dt>
                <dd className="font-medium text-gray-800">{data.goal}</dd>
              </div>
            </div>
          )}

          {data.affirmation && (
            <div className="flex items-center gap-3">
              <span className="text-lg" aria-hidden="true">✨</span>
              <div>
                <dt className="text-xs text-gray-500">{tCompletion("summary.affirmation")}</dt>
                <dd className="font-medium text-gray-800 italic text-sm">&quot;{data.affirmation}&quot;</dd>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-lg" aria-hidden="true">💪</span>
            <div>
              <dt className="text-xs text-gray-500">{tCompletion("summary.tasksCompleted")}</dt>
              <dd className="font-medium text-gray-800">{data.tasksCompleted}/{data.totalTasks}</dd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg" aria-hidden="true">⏱️</span>
            <div>
              <dt className="text-xs text-gray-500">{tCompletion("duration")}</dt>
              <dd className="font-medium text-gray-800">{data.duration} {tCompletion("minutes")}</dd>
            </div>
          </div>
        </dl>
      </motion.article>

      {/* Steps Preview Card */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
        aria-labelledby="steps-title"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" aria-hidden="true" />
          <h2 id="steps-title" className="font-semibold text-gray-800">{t("share.tryYourself")}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t("share.sixSteps")}
        </p>

        <ol className="space-y-2" role="list">
          {STEP_KEYS.map((stepKey, index) => (
            <li
              key={stepKey}
              className="flex items-center gap-3 p-2 rounded-lg"
            >
              <span className="text-lg" aria-hidden="true">{STEP_ICONS[index]}</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-800">
                  {t(`steps.${stepKey}.title`)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="glass rounded-2xl p-4 w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-500 italic text-sm">
          &quot;{tCompletion("quote")}&quot;
        </p>
        <footer className="text-center text-xs text-gray-400 mt-1">
          — {tCompletion("quoteAuthor")}
        </footer>
      </motion.blockquote>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="w-full max-w-md"
      >
        <Link href={`/${locale}`}>
          <button
            className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
            aria-label={t("share.startYourOwn")}
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
            {t("share.startYourOwn")}
          </button>
        </Link>
      </motion.div>

      <footer className="mt-6 text-xs text-gray-400 text-center">
        <p>{t("app.duration")} • {t("app.dailyRecommended")}</p>
      </footer>
    </main>
  );
}
