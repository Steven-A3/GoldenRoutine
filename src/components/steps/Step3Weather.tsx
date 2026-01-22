"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Snowflake, MapPin, Clock } from "lucide-react";

interface Step3Props {
  onComplete: () => void;
}

interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

const SUNLIGHT_PLANS = [
  { time: "아침", plan: "출근 전 10분 베란다에서 햇볕 쬐기" },
  { time: "점심", plan: "점심시간 20분 산책하기" },
  { time: "오후", plan: "커피 마시며 창가에서 5분 휴식" },
  { time: "저녁", plan: "퇴근 후 공원 한 바퀴 걷기" },
];

export function Step3Weather({ onComplete }: Step3Props) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customPlan, setCustomPlan] = useState("");

  useEffect(() => {
    // Simulated weather data (in production, use OpenWeatherMap API)
    setTimeout(() => {
      const weathers: WeatherInfo[] = [
        { temp: 18, description: "맑음", icon: "sun", city: "서울" },
        { temp: 15, description: "구름 조금", icon: "cloud", city: "서울" },
        { temp: 12, description: "흐림", icon: "cloud-rain", city: "서울" },
      ];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="w-16 h-16 text-yellow-500" />;
      case "cloud":
        return <Cloud className="w-16 h-16 text-gray-400" />;
      case "cloud-rain":
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      case "snow":
        return <Snowflake className="w-16 h-16 text-blue-300" />;
      default:
        return <Sun className="w-16 h-16 text-yellow-500" />;
    }
  };

  const getWeatherAdvice = () => {
    if (!weather) return "";
    if (weather.icon === "sun") {
      return "오늘은 햇볕이 좋아요! 세로토닌 충전의 최적의 날입니다.";
    } else if (weather.icon === "cloud") {
      return "구름이 있지만 자연광은 충분해요. 산책을 계획해보세요.";
    } else {
      return "흐린 날이에요. 실내에서 창가 가까이, 또는 비타민 D 보충을 고려하세요.";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-12 h-12 text-golden-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ☀️
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">빛과 감정의 동기화</h2>
        <p className="text-gray-600">Syncing Light & Mood</p>
      </div>

      {weather && (
        <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{weather.city}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getWeatherIcon(weather.icon)}
            </motion.div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">{weather.temp}°C</div>
              <div className="text-gray-600">{weather.description}</div>
            </div>
          </div>

          <div className="bg-golden-50 rounded-xl p-4 text-sm text-golden-800">
            💡 {getWeatherAdvice()}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-golden-500" />
          자연광 노출 계획 세우기
        </h3>

        <div className="space-y-2 mb-4">
          {SUNLIGHT_PLANS.map((plan) => (
            <motion.button
              key={plan.time}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.plan)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                selectedPlan === plan.plan
                  ? "bg-golden-400 text-white"
                  : "bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              <span className="text-xs font-medium opacity-70">{plan.time}</span>
              <div className="text-sm">{plan.plan}</div>
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={customPlan}
            onChange={(e) => {
              setCustomPlan(e.target.value);
              setSelectedPlan(e.target.value);
            }}
            placeholder="나만의 계획 입력하기..."
            className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-golden-400 text-sm"
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="max-w-md w-full mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-sky-400 to-blue-500 text-white"
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
