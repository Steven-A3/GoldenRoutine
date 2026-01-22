"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Timer } from "lucide-react";
import { useTranslations } from "next-intl";

interface Step1Props {
  onComplete: () => void;
}

export function Step1DigitalDetox({ onComplete }: Step1Props) {
  const t = useTranslations("steps.step1");
  const tc = useTranslations("common");
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (!timerActive) return;

    const breathCycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === "inhale") return "hold";
        if (prev === "hold") return "exhale";
        return "inhale";
      });
    }, 4000);

    return () => clearInterval(breathCycle);
  }, [timerActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const breathText = {
    inhale: "Inhale...",
    hold: "Hold...",
    exhale: "Exhale...",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔇
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">{t("description")}</p>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-golden-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">{t("fact")}</p>
        </div>
      </div>

      {!timerActive ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTimerActive(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center gap-2"
        >
          <Timer className="w-5 h-5" />
          {t("timer")}
        </motion.button>
      ) : seconds > 0 ? (
        <div className="text-center">
          <motion.div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-6 golden-glow"
            animate={{
              scale: breathPhase === "inhale" ? [1, 1.2] : breathPhase === "exhale" ? [1.2, 1] : 1.2,
            }}
            transition={{ duration: 4 }}
          >
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{formatTime(seconds)}</div>
              <div className="text-sm mt-1">{breathText[breathPhase]}</div>
            </div>
          </motion.div>
          <p className="text-gray-600 text-sm">{t("timerRunning")}</p>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✨</div>
          <p className="text-xl font-semibold text-gray-800 mb-6">{t("timerComplete")}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-gradient-to-r from-golden-400 to-golden-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
          >
            {tc("next")} →
          </motion.button>
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <button onClick={onComplete} className="text-gray-400 text-sm underline">
          {tc("skip")}
        </button>
      </div>
    </motion.div>
  );
}
