"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DailyIntention } from "@/types/routine";

interface Step2Props {
  intention: DailyIntention;
  onUpdate: (updates: Partial<DailyIntention>) => void;
  onComplete: () => void;
}

const FEELINGS = [
  { emoji: "😊", key: "happy" },
  { emoji: "💪", key: "energetic" },
  { emoji: "🧘", key: "calm" },
  { emoji: "🔥", key: "passionate" },
  { emoji: "🎯", key: "focused" },
  { emoji: "💖", key: "grateful" },
];

export function Step2Intentions({ intention, onUpdate, onComplete }: Step2Props) {
  const t = useTranslations("steps.step2");
  const tc = useTranslations("common");
  const [showAffirmations, setShowAffirmations] = useState(false);

  const affirmations = [
    t("affirmations.1"),
    t("affirmations.2"),
    t("affirmations.3"),
    t("affirmations.4"),
    t("affirmations.5"),
  ];

  const isComplete = intention.feeling && intention.goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎯
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-gray-800">{t("feelingLabel")}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FEELINGS.map((f) => (
            <motion.button
              key={f.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdate({ feeling: f.key })}
              className={`p-3 rounded-xl transition-all ${
                intention.feeling === f.key
                  ? "bg-golden-400 text-white"
                  : "bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-xs capitalize">{f.key}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">{t("goalLabel")}</h3>
        </div>
        <textarea
          value={intention.goal}
          onChange={(e) => onUpdate({ goal: e.target.value })}
          placeholder={t("goalPlaceholder")}
          className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-golden-400 resize-none"
          rows={2}
        />
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-golden-500" />
            <h3 className="font-semibold text-gray-800">{t("affirmationLabel")}</h3>
          </div>
          <button
            onClick={() => setShowAffirmations(!showAffirmations)}
            className="text-sm text-golden-600 underline"
          >
            {showAffirmations ? tc("cancel") : t("suggestedAffirmations")}
          </button>
        </div>

        {showAffirmations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {affirmations.map((a, idx) => (
              <button
                key={idx}
                onClick={() => onUpdate({ affirmation: a })}
                className="text-xs px-3 py-1.5 rounded-full bg-golden-100 text-golden-700 hover:bg-golden-200 transition-colors"
              >
                {a}
              </button>
            ))}
          </motion.div>
        )}

        <input
          type="text"
          value={intention.affirmation}
          onChange={(e) => onUpdate({ affirmation: e.target.value })}
          placeholder={t("affirmationPlaceholder")}
          className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-golden-400"
        />
      </div>

      <div className="flex-1" />

      <div className="max-w-md w-full mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          disabled={!isComplete}
          className={`w-full py-4 rounded-full font-semibold shadow-lg transition-all ${
            isComplete
              ? "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isComplete ? `${tc("next")} →` : t("feelingLabel")}
        </motion.button>
        <button
          onClick={onComplete}
          className="w-full mt-3 text-gray-400 text-sm underline"
        >
          {tc("skip")}
        </button>
      </div>
    </motion.div>
  );
}
