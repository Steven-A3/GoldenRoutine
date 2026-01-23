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

function decodeShareData(encoded: string | null): SharedData | null {
  if (!encoded) return null;
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function ResultContent() {
  const searchParams = useSearchParams();
  const t = useTranslations("completion");
  const tStep2 = useTranslations("steps.step2");
  const tWelcome = useTranslations("welcome");

  const data = decodeShareData(searchParams.get("d"));

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-xl font-bold text-gray-800 mb-4">Invalid share link</h1>
        <Link href="/" className="text-golden-600 underline">
          {tWelcome("startButton")}
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
    >
      {/* Star Animation */}
      <motion.div
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
          >
            🌟
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-golden-400" />
          </motion.div>
        </div>
      </motion.div>

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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
      >
        <h2 className="font-semibold text-gray-800 mb-4">{t("summary.title")}</h2>

        <div className="space-y-4">
          {data.feeling && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💛</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.feeling")}</div>
                <div className="font-medium text-gray-800">{tStep2(`feelings.${data.feeling}`)}</div>
              </div>
            </div>
          )}

          {data.goal && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.goal")}</div>
                <div className="font-medium text-gray-800">{data.goal}</div>
              </div>
            </div>
          )}

          {data.affirmation && (
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.affirmation")}</div>
                <div className="font-medium text-gray-800 italic">&quot;{data.affirmation}&quot;</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-xl">💪</span>
            <div>
              <div className="text-xs text-gray-500">{t("summary.tasksCompleted")}</div>
              <div className="font-medium text-gray-800">{data.tasksCompleted}/{data.totalTasks}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <div className="text-xs text-gray-500">{t("duration")}</div>
              <div className="font-medium text-gray-800">{data.duration} {t("minutes")}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-4 w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-600 italic">
          &quot;{t("quote")}&quot;
        </p>
        <p className="text-center text-sm text-gray-400 mt-1">- {t("quoteAuthor")}</p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md"
      >
        <Link href="/">
          <button className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            {tWelcome("startButton")}
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full"
        />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
