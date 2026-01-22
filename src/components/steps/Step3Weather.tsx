"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Snowflake, MapPin, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface Step3Props {
  onComplete: () => void;
}

interface WeatherInfo {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export function Step3Weather({ onComplete }: Step3Props) {
  const t = useTranslations("steps.step3");
  const tc = useTranslations("common");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [customPlan, setCustomPlan] = useState("");

  useEffect(() => {
    // Simulated weather data (in production, use OpenWeatherMap API)
    setTimeout(() => {
      const weathers: WeatherInfo[] = [
        { temp: 18, description: "Clear", icon: "sun", city: "Your Location" },
        { temp: 15, description: "Partly Cloudy", icon: "cloud", city: "Your Location" },
        { temp: 12, description: "Cloudy", icon: "cloud-rain", city: "Your Location" },
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
      return t("suggestions.sunny");
    } else if (weather.icon === "cloud") {
      return t("suggestions.cloudy");
    } else if (weather.icon === "cloud-rain") {
      return t("suggestions.rainy");
    }
    return t("suggestions.default");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-12 h-12 text-golden-500" />
        </motion.div>
        <p className="mt-4 text-gray-500">{t("loadingWeather")}</p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h2>
        <p className="text-gray-600">{t("subtitle")}</p>
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
              <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
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
          {t("sunlightPlan")}
        </h3>

        <div className="relative">
          <input
            type="text"
            value={customPlan}
            onChange={(e) => setCustomPlan(e.target.value)}
            placeholder={t("sunlightPlaceholder")}
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
