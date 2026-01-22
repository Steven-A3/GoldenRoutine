"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Heart } from "lucide-react";
import type { DailyIntention } from "@/types/routine";

interface Step2Props {
  intention: DailyIntention;
  onUpdate: (updates: Partial<DailyIntention>) => void;
  onComplete: () => void;
}

const FEELINGS = [
  { emoji: "😊", label: "행복하게" },
  { emoji: "💪", label: "활기차게" },
  { emoji: "🧘", label: "평온하게" },
  { emoji: "🔥", label: "열정적으로" },
  { emoji: "🎯", label: "집중해서" },
  { emoji: "💖", label: "감사하며" },
];

const AFFIRMATIONS = [
  "나는 좋은 일이 생길 것이라 기대한다",
  "나는 오늘 하루 최선을 다할 것이다",
  "나는 충분히 가치 있는 사람이다",
  "오늘은 나에게 좋은 기회가 찾아온다",
  "나는 어떤 도전도 해낼 수 있다",
  "나는 긍정적인 에너지로 가득 차 있다",
];

export function Step2Intentions({ intention, onUpdate, onComplete }: Step2Props) {
  const [showAffirmations, setShowAffirmations] = useState(false);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">의도 설정</h2>
        <p className="text-gray-600">Setting Intentions & Affirmations</p>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h3 className="font-semibold text-gray-800">오늘 어떤 기분을 느끼고 싶나요?</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {FEELINGS.map((f) => (
            <motion.button
              key={f.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdate({ feeling: f.label })}
              className={`p-3 rounded-xl transition-all ${
                intention.feeling === f.label
                  ? "bg-golden-400 text-white"
                  : "bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              <div className="text-2xl mb-1">{f.emoji}</div>
              <div className="text-xs">{f.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">오늘의 핵심 목표는?</h3>
        </div>
        <textarea
          value={intention.goal}
          onChange={(e) => onUpdate({ goal: e.target.value })}
          placeholder="예: 프로젝트 기획안 완성하기"
          className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-golden-400 resize-none"
          rows={2}
        />
      </div>

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-golden-500" />
            <h3 className="font-semibold text-gray-800">긍정 확언</h3>
          </div>
          <button
            onClick={() => setShowAffirmations(!showAffirmations)}
            className="text-sm text-golden-600 underline"
          >
            {showAffirmations ? "닫기" : "추천 보기"}
          </button>
        </div>

        {showAffirmations && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {AFFIRMATIONS.map((a) => (
              <button
                key={a}
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
          placeholder="나만의 확언을 입력하세요"
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
          {isComplete ? "다음 단계로 →" : "기분과 목표를 설정해주세요"}
        </motion.button>
        <button
          onClick={onComplete}
          className="w-full mt-3 text-gray-400 text-sm underline"
        >
          건너뛰기
        </button>
      </div>
    </motion.div>
  );
}
