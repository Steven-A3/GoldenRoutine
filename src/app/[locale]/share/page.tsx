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

export default function SharePage() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no data, show regular welcome-like screen
  if (!data) {
    return (
      <div className="flex flex-col items-center min-h-screen p-6">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>

        <div className="mt-12 mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-golden-300 to-golden-500 flex items-center justify-center golden-glow">
              <Sun className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          {t("app.name")}
        </h1>

        <p className="text-gray-600 text-center mb-8">
          {t("share.invalidLink")}
        </p>

        <div className="w-full max-w-md">
          <Link href="/">
            <button className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              {t("welcome.startButton")}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Sun Logo */}
      <motion.div
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
            <Sun className="w-16 h-16 text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-golden-500" />
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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🌟</span>
          <h2 className="font-semibold text-gray-800">{t("share.theirResults")}</h2>
        </div>

        <div className="space-y-3">
          {data.feeling && (
            <div className="flex items-center gap-3">
              <span className="text-lg">💛</span>
              <div>
                <div className="text-xs text-gray-500">{tCompletion("summary.feeling")}</div>
                <div className="font-medium text-gray-800">{tStep2(`feelings.${data.feeling}`)}</div>
              </div>
            </div>
          )}

          {data.goal && (
            <div className="flex items-center gap-3">
              <span className="text-lg">🎯</span>
              <div>
                <div className="text-xs text-gray-500">{tCompletion("summary.goal")}</div>
                <div className="font-medium text-gray-800">{data.goal}</div>
              </div>
            </div>
          )}

          {data.affirmation && (
            <div className="flex items-center gap-3">
              <span className="text-lg">✨</span>
              <div>
                <div className="text-xs text-gray-500">{tCompletion("summary.affirmation")}</div>
                <div className="font-medium text-gray-800 italic text-sm">&quot;{data.affirmation}&quot;</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-lg">💪</span>
            <div>
              <div className="text-xs text-gray-500">{tCompletion("summary.tasksCompleted")}</div>
              <div className="font-medium text-gray-800">{data.tasksCompleted}/{data.totalTasks}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">⏱️</span>
            <div>
              <div className="text-xs text-gray-500">{tCompletion("duration")}</div>
              <div className="font-medium text-gray-800">{data.duration} {tCompletion("minutes")}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Steps Preview Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold text-gray-800">{t("share.tryYourself")}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t("share.sixSteps")}
        </p>

        <div className="space-y-2">
          {STEP_KEYS.map((stepKey, index) => (
            <div
              key={stepKey}
              className="flex items-center gap-3 p-2 rounded-lg"
            >
              <span className="text-lg">{STEP_ICONS[index]}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {t(`steps.${stepKey}.title`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-500 italic text-sm">
          &quot;{tCompletion("quote")}&quot;
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          - {tCompletion("quoteAuthor")}
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="w-full max-w-md"
      >
        <Link href="/">
          <button className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" />
            {t("share.startYourOwn")}
          </button>
        </Link>
      </motion.div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        {t("app.duration")} • {t("app.dailyRecommended")}
      </p>
    </div>
  );
}
