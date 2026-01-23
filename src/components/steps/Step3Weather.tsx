"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSun,
  CloudMoon,
  CloudLightning,
  CloudFog,
  Snowflake,
  MapPin,
  Clock,
  Droplets,
  Thermometer,
  RefreshCw,
  Sunrise,
  Sunset,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useWeather } from "@/hooks/useWeather";

interface Step3Props {
  onComplete: () => void;
}

export function Step3Weather({ onComplete }: Step3Props) {
  const t = useTranslations("steps.step3");
  const tc = useTranslations("common");
  const { weather, loading, error, refetch } = useWeather();
  const [customPlan, setCustomPlan] = useState("");

  const getWeatherIcon = (icon: string) => {
    const iconClass = "w-16 h-16";
    switch (icon) {
      case "sun":
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case "moon":
        return <Moon className={`${iconClass} text-indigo-400`} />;
      case "cloud-sun":
        return <CloudSun className={`${iconClass} text-yellow-400`} />;
      case "cloud-moon":
        return <CloudMoon className={`${iconClass} text-indigo-300`} />;
      case "cloud":
      case "clouds":
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case "cloud-rain":
      case "cloud-sun-rain":
      case "cloud-moon-rain":
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case "cloud-lightning":
        return <CloudLightning className={`${iconClass} text-yellow-600`} />;
      case "snowflake":
        return <Snowflake className={`${iconClass} text-blue-300`} />;
      case "cloud-fog":
        return <CloudFog className={`${iconClass} text-gray-400`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getWeatherAdvice = () => {
    if (!weather) return t("suggestions.default");

    const icon = weather.icon;
    if (icon === "sun" || icon === "cloud-sun") {
      return t("suggestions.sunny");
    } else if (icon.includes("cloud") && !icon.includes("rain")) {
      return t("suggestions.cloudy");
    } else if (icon.includes("rain") || icon === "cloud-lightning") {
      return t("suggestions.rainy");
    }
    return t("suggestions.default");
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        {error && (
          <p className="mt-2 text-sm text-gray-400">{t("locationError")}</p>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-[70vh] p-6"
    >
      <div className="text-center mb-6">
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
        <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-4">
          {/* Location and Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">
                {weather.city}
                {weather.country && `, ${weather.country}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getWeatherIcon(weather.icon)}
            </motion.div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800">
                {weather.temp}°C
              </div>
              <div className="text-gray-600 capitalize">{weather.description}</div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-xs text-gray-500">{t("feelsLike", { temp: "" })}</div>
                <div className="font-medium text-gray-700">{weather.feelsLike}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500">{t("humidity")}</div>
                <div className="font-medium text-gray-700">{weather.humidity}%</div>
              </div>
            </div>
            {weather.sunrise && (
              <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                <Sunrise className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-xs text-gray-500">{t("sunrise")}</div>
                  <div className="font-medium text-gray-700">
                    {formatTime(weather.sunrise)}
                  </div>
                </div>
              </div>
            )}
            {weather.sunset && (
              <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                <Sunset className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs text-gray-500">{t("sunset")}</div>
                  <div className="font-medium text-gray-700">
                    {formatTime(weather.sunset)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {weather.uvIndex !== undefined && (
            <div className="flex items-center justify-center gap-2 p-2 bg-amber-50 rounded-lg mb-4">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-700">
                {t("uvIndex")}: <strong>{weather.uvIndex}</strong>
                {weather.uvIndex >= 6 && " (High - Use sunscreen!)"}
              </span>
            </div>
          )}

          {/* Weather Advice */}
          <div className="bg-golden-50 rounded-xl p-4 text-sm text-golden-800">
            💡 {getWeatherAdvice()}
          </div>
        </div>
      )}

      {/* Sunlight Plan */}
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-golden-500" />
          {t("sunlightPlan")}
        </h3>

        <textarea
          value={customPlan}
          onChange={(e) => setCustomPlan(e.target.value)}
          placeholder={t("sunlightPlaceholder")}
          className="w-full p-3 rounded-xl bg-white/50 border-none focus:ring-2 focus:ring-golden-400 text-sm resize-none"
          rows={2}
        />

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {["walk", "lunchOutside", "morningYoga", "eveningStroll"].map(
            (key) => (
              <button
                key={key}
                onClick={() => setCustomPlan(t(`quickSuggestions.${key}`))}
                className="text-xs px-3 py-1 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
              >
                {t(`quickSuggestions.${key}`)}
              </button>
            )
          )}
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
