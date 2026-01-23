"use client";

import { motion } from "framer-motion";
import { Sparkles, RotateCcw, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DailyIntention, JournalEntry, PersonalTask } from "@/types/routine";

interface CompletionScreenProps {
  intention: DailyIntention;
  journal: JournalEntry;
  tasks: PersonalTask[];
  startedAt: string | null;
  completedAt: string | null;
  onReset: () => void;
}

export function CompletionScreen({
  intention,
  journal,
  tasks,
  startedAt,
  completedAt,
  onReset,
}: CompletionScreenProps) {
  const t = useTranslations("completion");
  const tStep2 = useTranslations("steps.step2");
  const completedTasks = tasks.filter((t) => t.completed).length;

  const getDuration = () => {
    if (!startedAt || !completedAt) return "N/A";
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} ${t("minutes")}`;
  };

  const handleShare = async () => {
    const text = `
🌅 Morning Golden Time Complete!

✨ Feeling: ${intention.feeling || "Not set"}
🎯 Goal: ${intention.goal || "Not set"}
💪 Tasks: ${completedTasks}/${tasks.length}
⏱️ Duration: ${getDuration()}

#MorningGoldenTime #GoldenRoutine
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
    >
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

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-6"
      >
        <h2 className="font-semibold text-gray-800 mb-4">{t("summary.title")}</h2>

        <div className="space-y-4">
          {intention.feeling && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💛</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.feeling")}</div>
                <div className="font-medium text-gray-800">{tStep2(`feelings.${intention.feeling}`)}</div>
              </div>
            </div>
          )}

          {intention.goal && (
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.goal")}</div>
                <div className="font-medium text-gray-800">{intention.goal}</div>
              </div>
            </div>
          )}

          {intention.affirmation && (
            <div className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.affirmation")}</div>
                <div className="font-medium text-gray-800 italic">&quot;{intention.affirmation}&quot;</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-xl">💪</span>
            <div>
              <div className="text-xs text-gray-500">{t("summary.tasksCompleted")}</div>
              <div className="font-medium text-gray-800">{completedTasks}/{tasks.length}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <div className="text-xs text-gray-500">{t("duration")}</div>
              <div className="font-medium text-gray-800">{getDuration()}</div>
            </div>
          </div>

          {journal.gratitude.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xl">💖</span>
              <div>
                <div className="text-xs text-gray-500">{t("summary.gratitude")}</div>
                <ul className="text-sm text-gray-700">
                  {journal.gratitude.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>

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

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-md space-y-3"
      >
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          {t("shareButton")}
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 rounded-full font-medium text-gray-600 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t("resetButton")}
        </button>
      </motion.div>
    </motion.div>
  );
}
