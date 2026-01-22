"use client";

import { motion } from "framer-motion";
import { Sun, Brain, Heart, Sparkles } from "lucide-react";
import { ROUTINE_STEPS } from "@/types/routine";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const currentHour = new Date().getHours();

  const getGreeting = () => {
    if (currentHour < 6) return "새벽이 밝아옵니다";
    if (currentHour < 12) return "좋은 아침이에요";
    if (currentHour < 18) return "오후에도 루틴을";
    return "내일 아침을 준비해요";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen p-6"
    >
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
        Morning Golden Time
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
          <h2 className="font-semibold text-gray-800">골든 루틴이란?</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          뇌가 가장 창의적인 <span className="text-purple-600 font-medium">세타파</span>와{" "}
          <span className="text-blue-600 font-medium">알파파</span> 상태를 보호하고,
          도파민 중독을 예방하며, 부와 정신적 풍요를 모두 잡는 아침 루틴입니다.
        </p>

        <div className="space-y-2">
          {ROUTINE_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <span className="text-xl">{step.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{step.title}</div>
                <div className="text-xs text-gray-500">{step.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full py-4 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          골든 루틴 시작하기
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 text-xs text-gray-400 text-center"
      >
        약 10-15분 소요 • 매일 아침 권장
      </motion.p>
    </motion.div>
  );
}
