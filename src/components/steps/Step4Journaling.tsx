"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, PenLine, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import type { JournalEntry } from "@/types/routine";

interface Step4Props {
  journal: JournalEntry;
  onUpdate: (updates: Partial<JournalEntry>) => void;
  onComplete: () => void;
}

const ZODIAC_KEYS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
] as const;

const ZODIAC_EMOJIS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const KEYWORD_KEYS = [
  "challenge", "growth", "rest", "focus", "creativity", "patience",
  "communication", "gratitude", "courage", "wisdom", "balance", "passion"
] as const;

export function Step4Journaling({ journal, onUpdate, onComplete }: Step4Props) {
  const t = useTranslations("steps.step4");
  const tc = useTranslations("common");
  const tz = useTranslations("zodiac");
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [todayKeyword, setTodayKeyword] = useState("");
  const [horoscopeMessage, setHoroscopeMessage] = useState("");
  const [gratitudeInput, setGratitudeInput] = useState("");

  useEffect(() => {
    const today = new Date().getDate();
    const keywordKey = KEYWORD_KEYS[today % KEYWORD_KEYS.length];
    setTodayKeyword(t(`keywords.${keywordKey}`));
    setHoroscopeMessage(t(`horoscopes.${(today % 6) + 1}`));
  }, [t]);

  const addGratitude = () => {
    if (gratitudeInput.trim()) {
      onUpdate({ gratitude: [...journal.gratitude, gratitudeInput.trim()] });
      setGratitudeInput("");
    }
  };

  const removeGratitude = (index: number) => {
    onUpdate({ gratitude: journal.gratitude.filter((_, i) => i !== index) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📝
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Horoscope Section */}
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-golden-500" />
          <h3 className="font-semibold text-gray-800">{t("keywordTitle")}</h3>
        </div>

        <motion.div
          className="bg-gradient-to-r from-golden-100 to-golden-200 rounded-xl p-4 text-center mb-4"
          animate={{ boxShadow: ["0 0 0 rgba(251, 191, 36, 0.4)", "0 0 20px rgba(251, 191, 36, 0.4)", "0 0 0 rgba(251, 191, 36, 0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-3xl font-bold text-golden-700 mb-1">{todayKeyword}</div>
          <p className="text-sm text-golden-600">{horoscopeMessage}</p>
        </motion.div>

        {!selectedSign && (
          <div>
            <p className="text-xs text-gray-500 mb-2">{t("zodiacSelect")}</p>
            <div className="grid grid-cols-4 gap-1">
              {ZODIAC_KEYS.map((key, idx) => (
                <button
                  key={key}
                  onClick={() => setSelectedSign(key)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-golden-100 transition-colors text-center"
                >
                  <div className="text-lg">{ZODIAC_EMOJIS[idx]}</div>
                  <div className="text-xs text-gray-600">{tz(key)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSign && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-golden-100 text-golden-700 text-sm">
              {ZODIAC_EMOJIS[ZODIAC_KEYS.indexOf(selectedSign as typeof ZODIAC_KEYS[number])]} {tz(selectedSign as typeof ZODIAC_KEYS[number])}
              <button
                onClick={() => setSelectedSign(null)}
                className="ml-1 text-golden-500 hover:text-golden-700"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Gratitude Section */}
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-gray-800">{t("gratitudeTitle")}</h3>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={gratitudeInput}
            onChange={(e) => setGratitudeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGratitude()}
            placeholder={t("gratitudePlaceholder")}
            className="flex-1 p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
          <button
            onClick={addGratitude}
            className="px-4 py-2 rounded-xl bg-rose-400 text-white font-medium hover:bg-rose-500 transition-colors"
          >
            {t("gratitudeAdd")}
          </button>
        </div>

        {journal.gratitude.length > 0 && (
          <div className="space-y-2">
            {journal.gratitude.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg"
              >
                <span className="text-rose-400">♥</span>
                <span className="flex-1 text-sm text-gray-700">{item}</span>
                <button
                  onClick={() => removeGratitude(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Journal Section */}
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PenLine className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold text-gray-800">{t("journalTitle")}</h3>
        </div>

        <textarea
          value={journal.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={t("journalPlaceholder")}
          className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-pink-300 resize-none text-sm"
          rows={3}
        />
      </div>

      <div className="flex-1" />

      <div className="max-w-md w-full mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-pink-400 to-rose-500 text-white"
        >
          {tc("next")} →
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
