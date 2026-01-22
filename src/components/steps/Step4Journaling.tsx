"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, PenLine, Heart } from "lucide-react";
import type { JournalEntry } from "@/types/routine";

interface Step4Props {
  journal: JournalEntry;
  onUpdate: (updates: Partial<JournalEntry>) => void;
  onComplete: () => void;
}

const ZODIAC_SIGNS = [
  { sign: "양자리", dates: "3/21-4/19", emoji: "♈" },
  { sign: "황소자리", dates: "4/20-5/20", emoji: "♉" },
  { sign: "쌍둥이자리", dates: "5/21-6/20", emoji: "♊" },
  { sign: "게자리", dates: "6/21-7/22", emoji: "♋" },
  { sign: "사자자리", dates: "7/23-8/22", emoji: "♌" },
  { sign: "처녀자리", dates: "8/23-9/22", emoji: "♍" },
  { sign: "천칭자리", dates: "9/23-10/22", emoji: "♎" },
  { sign: "전갈자리", dates: "10/23-11/21", emoji: "♏" },
  { sign: "궁수자리", dates: "11/22-12/21", emoji: "♐" },
  { sign: "염소자리", dates: "12/22-1/19", emoji: "♑" },
  { sign: "물병자리", dates: "1/20-2/18", emoji: "♒" },
  { sign: "물고기자리", dates: "2/19-3/20", emoji: "♓" },
];

const DAILY_KEYWORDS = [
  "도전", "성장", "휴식", "집중", "창의성", "인내",
  "소통", "감사", "용기", "지혜", "균형", "열정",
];

const HOROSCOPE_MESSAGES = [
  "오늘은 새로운 도전을 시작하기 좋은 날입니다. 두려워하지 마세요.",
  "인내심을 가지고 기다리면 좋은 결과가 올 것입니다.",
  "주변 사람들과의 소통이 행운을 가져다 줄 수 있습니다.",
  "오늘 하루는 자기 자신에게 집중하는 시간을 가져보세요.",
  "예상치 못한 좋은 소식이 찾아올 수 있습니다.",
  "감사하는 마음으로 하루를 시작하면 더 많은 것이 찾아옵니다.",
];

export function Step4Journaling({ journal, onUpdate, onComplete }: Step4Props) {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [todayKeyword, setTodayKeyword] = useState("");
  const [horoscopeMessage, setHoroscopeMessage] = useState("");
  const [gratitudeInput, setGratitudeInput] = useState("");

  useEffect(() => {
    const today = new Date().getDate();
    setTodayKeyword(DAILY_KEYWORDS[today % DAILY_KEYWORDS.length]);
    setHoroscopeMessage(HOROSCOPE_MESSAGES[today % HOROSCOPE_MESSAGES.length]);
  }, []);

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">내면 의식화</h2>
        <p className="text-gray-600">Ritualizing the Self</p>
      </div>

      {/* Horoscope Section */}
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-golden-500" />
          <h3 className="font-semibold text-gray-800">오늘의 키워드</h3>
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
            <p className="text-xs text-gray-500 mb-2">나의 별자리 선택 (선택사항)</p>
            <div className="grid grid-cols-4 gap-1">
              {ZODIAC_SIGNS.map((z) => (
                <button
                  key={z.sign}
                  onClick={() => setSelectedSign(z.sign)}
                  className="p-2 rounded-lg bg-white/50 hover:bg-golden-100 transition-colors text-center"
                >
                  <div className="text-lg">{z.emoji}</div>
                  <div className="text-xs text-gray-600">{z.sign}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSign && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-golden-100 text-golden-700 text-sm">
              {ZODIAC_SIGNS.find(z => z.sign === selectedSign)?.emoji} {selectedSign}
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
          <h3 className="font-semibold text-gray-800">감사 일기</h3>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={gratitudeInput}
            onChange={(e) => setGratitudeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addGratitude()}
            placeholder="오늘 감사한 것은..."
            className="flex-1 p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
          <button
            onClick={addGratitude}
            className="px-4 py-2 rounded-xl bg-rose-400 text-white font-medium hover:bg-rose-500 transition-colors"
          >
            추가
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
          <h3 className="font-semibold text-gray-800">오늘의 한 줄</h3>
        </div>

        <textarea
          value={journal.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="오늘 아침 떠오르는 생각을 자유롭게 적어보세요..."
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
          다음 단계로 →
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
