"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Coffee, Clock, BarChart3, TrendingUp, Newspaper, Bitcoin, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

interface Step6Props {
  onComplete: () => void;
}

export function Step6Market({ onComplete }: Step6Props) {
  const t = useTranslations("steps.step6");
  const tc = useTranslations("common");
  const [acknowledged, setAcknowledged] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  const handleSkip = () => {
    setSkipped(true);
  };

  const checkOptions = [
    { key: "stocks", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100" },
    { key: "crypto", icon: Bitcoin, color: "text-orange-500", bg: "bg-orange-100" },
    { key: "news", icon: Newspaper, color: "text-purple-500", bg: "bg-purple-100" },
    { key: "forex", icon: DollarSign, color: "text-green-500", bg: "bg-green-100" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          📈
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {!acknowledged && !skipped ? (
        <>
          <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{t("warningTitle")}</h3>
                <p className="text-sm text-gray-600">{t("warningText")}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <Coffee className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-amber-800">{t("principles.1")}</p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-blue-800">{t("principles.2")}</p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <BarChart3 className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-green-800">{t("principles.3")}</p>
              </div>
            </div>
          </div>

          <div className="max-w-md w-full mx-auto space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAcknowledge}
              className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-slate-400 to-gray-500 text-white"
            >
              {tc("confirm")}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white"
            >
              {t("checkOptions.skip")} ✨
            </motion.button>
          </div>
        </>
      ) : skipped ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center flex-1"
        >
          <div className="text-6xl mb-4">🧘</div>
          <p className="text-gray-700 text-center max-w-md mb-8">{t("skipMessage")}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            className="w-full max-w-md py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white"
          >
            {t("completeRoutine")} 🌟
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t("checkOptions.title")}</h3>

            <div className="grid grid-cols-2 gap-3">
              {checkOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.a
                    key={option.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className={`flex items-center gap-3 p-4 rounded-xl ${option.bg} transition-all`}
                  >
                    <Icon className={`w-6 h-6 ${option.color}`} />
                    <span className="font-medium text-gray-700">
                      {t(`checkOptions.${option.key}`)}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>

          <div className="flex-1" />

          <div className="max-w-md w-full mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white"
            >
              {t("completeRoutine")} 🌟
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}
