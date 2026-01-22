"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Shield, Brain, Timer } from "lucide-react";

interface Step1Props {
  onComplete: () => void;
}

export function Step1DigitalDetox({ onComplete }: Step1Props) {
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
    inhale: "들이쉬세요...",
    hold: "멈추세요...",
    exhale: "내쉬세요...",
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">세타파 보호</h2>
        <p className="text-gray-600">Theta State Protection</p>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mb-6">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            기상 직후 뇌는 창의적이고 잠재의식에 접근하기 쉬운 <strong>세타파</strong> 상태입니다.
            스마트폰을 보면 즉시 스트레스 상태인 베타파로 전환됩니다.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-golden-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            1분간 디지털 디톡스로 하루의 주도권을 지키세요.
          </p>
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
          1분 명상 시작
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
          <p className="text-gray-600 text-sm">
            눈을 감고 깊은 호흡을 하세요
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✨</div>
          <p className="text-xl font-semibold text-gray-800 mb-6">
            세타파 보호 완료!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="bg-gradient-to-r from-golden-400 to-golden-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg"
          >
            다음 단계로 →
          </motion.button>
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onComplete}
          className="text-gray-400 text-sm underline"
        >
          건너뛰기
        </button>
      </div>
    </motion.div>
  );
}
