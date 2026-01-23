"use client";

import { motion } from "framer-motion";
import { Sun, Brain, Heart, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./LanguageSelector";

const STEP_ICONS = ["🔇", "🎯", "☀️", "📝", "🏃", "📈"];
const STEP_KEYS = ["step1", "step2", "step3", "step4", "step5", "step6"];

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const t = useTranslations();
  const tCompletion = useTranslations("completion");
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 6) return t("greeting.dawn");
    if (currentHour < 12) return t("greeting.morning");
    if (currentHour < 18) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
    >
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

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
        className="text-golden-600 font-medium mb-8"
      >
        {getGreeting()}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 w-full max-w-md mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold text-gray-800">{t("welcome.title")}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t.rich("welcome.description", {
            theta: (chunks) => <span className="text-purple-600 font-medium">{chunks}</span>,
            alpha: (chunks) => <span className="text-blue-600 font-medium">{chunks}</span>,
          })}
        </p>

        <div className="space-y-2">
          {STEP_KEYS.map((stepKey, index) => (
            <motion.div
              key={stepKey}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <span className="text-xl">{STEP_ICONS[index]}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {t(`steps.${stepKey}.title`)}
                </div>
                <div className="text-xs text-gray-500">
                  {t(`steps.${stepKey}.subtitle`)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-md mb-6"
      >
        <p className="text-center text-gray-500 italic text-sm">
          &quot;{tCompletion("quote")}&quot;
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          - {tCompletion("quoteAuthor")}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          {t("welcome.startButton")}
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="mt-6 text-xs text-gray-400 text-center"
      >
        {t("app.duration")} • {t("app.dailyRecommended")}
      </motion.p>
    </motion.div>
  );
}
