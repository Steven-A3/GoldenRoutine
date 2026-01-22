"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Coffee, Clock, BarChart3, TrendingUp, TrendingDown,
  Newspaper, Bitcoin, DollarSign, ArrowLeft, RefreshCw, ExternalLink
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMarket, StockData, CryptoData, ForexData, NewsItem } from "@/hooks/useMarket";

interface Step6Props {
  onComplete: () => void;
}

type MarketView = "menu" | "stocks" | "crypto" | "news" | "forex";

function PriceChange({ value, showPercent = true }: { value: number; showPercent?: boolean }) {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{value.toFixed(2)}{showPercent ? "%" : ""}
    </span>
  );
}

function StocksWidget({ stocks, loading }: { stocks: StockData[]; loading: boolean }) {
  const t = useTranslations("steps.step6");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 mb-3">{t("widgets.majorIndices")}</h4>
      {stocks.map((stock) => (
        <motion.div
          key={stock.symbol}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
        >
          <div>
            <div className="font-semibold text-gray-800">{stock.symbol}</div>
            <div className="text-xs text-gray-500">{stock.name}</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">${stock.price.toFixed(2)}</div>
            <PriceChange value={stock.changePercent} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CryptoWidget({ crypto, loading }: { crypto: CryptoData[]; loading: boolean }) {
  const t = useTranslations("steps.step6");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 mb-3">{t("widgets.topCrypto")}</h4>
      {crypto.map((coin) => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            {coin.image ? (
              <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-orange-500" />
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-800">{coin.symbol}</div>
              <div className="text-xs text-gray-500">{coin.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">
              ${coin.price >= 1 ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
            </div>
            <PriceChange value={coin.change24h} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ForexWidget({ forex, loading }: { forex: ForexData[]; loading: boolean }) {
  const t = useTranslations("steps.step6");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 mb-3">{t("widgets.exchangeRates")}</h4>
      {forex.map((pair) => (
        <motion.div
          key={pair.pair}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="font-semibold text-gray-800">{pair.pair}</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">{pair.rate.toFixed(pair.rate >= 100 ? 2 : 4)}</div>
            <PriceChange value={pair.change} showPercent={false} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function NewsWidget({ news, loading }: { news: NewsItem[]; loading: boolean }) {
  const t = useTranslations("steps.step6");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700 mb-3">{t("widgets.latestNews")}</h4>
      {news.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-3 bg-white/50 rounded-xl"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium text-gray-800 text-sm leading-tight mb-1">
                {item.title}
              </div>
              <div className="text-xs text-gray-500">{item.source}</div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Step6Market({ onComplete }: Step6Props) {
  const t = useTranslations("steps.step6");
  const tc = useTranslations("common");
  const [acknowledged, setAcknowledged] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [currentView, setCurrentView] = useState<MarketView>("menu");

  const {
    stocks, crypto, forex, news,
    loading,
    fetchStocks, fetchCrypto, fetchForex, fetchNews
  } = useMarket();

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  const handleSkip = () => {
    setSkipped(true);
  };

  const handleSelectCategory = (category: MarketView) => {
    setCurrentView(category);

    // Fetch data when category is selected
    switch (category) {
      case "stocks":
        fetchStocks();
        break;
      case "crypto":
        fetchCrypto();
        break;
      case "forex":
        fetchForex();
        break;
      case "news":
        fetchNews();
        break;
    }
  };

  const checkOptions = [
    { key: "stocks" as const, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100" },
    { key: "crypto" as const, icon: Bitcoin, color: "text-orange-500", bg: "bg-orange-100" },
    { key: "news" as const, icon: Newspaper, color: "text-purple-500", bg: "bg-purple-100" },
    { key: "forex" as const, icon: DollarSign, color: "text-green-500", bg: "bg-green-100" },
  ];

  const renderMarketContent = () => {
    switch (currentView) {
      case "stocks":
        return <StocksWidget stocks={stocks} loading={loading.stocks} />;
      case "crypto":
        return <CryptoWidget crypto={crypto} loading={loading.crypto} />;
      case "forex":
        return <ForexWidget forex={forex} loading={loading.forex} />;
      case "news":
        return <NewsWidget news={news} loading={loading.news} />;
      default:
        return null;
    }
  };

  const getCategoryTitle = () => {
    switch (currentView) {
      case "stocks":
        return t("checkOptions.stocks");
      case "crypto":
        return t("checkOptions.crypto");
      case "forex":
        return t("checkOptions.forex");
      case "news":
        return t("checkOptions.news");
      default:
        return "";
    }
  };

  const getCategoryColor = () => {
    switch (currentView) {
      case "stocks":
        return "text-blue-500";
      case "crypto":
        return "text-orange-500";
      case "forex":
        return "text-green-500";
      case "news":
        return "text-purple-500";
      default:
        return "";
    }
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
          <AnimatePresence mode="wait">
            {currentView === "menu" ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6"
              >
                <h3 className="font-semibold text-gray-800 mb-4">{t("checkOptions.title")}</h3>

                <div className="grid grid-cols-2 gap-3">
                  {checkOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectCategory(option.key)}
                        className={`flex items-center gap-3 p-4 rounded-xl ${option.bg} transition-all text-left`}
                      >
                        <Icon className={`w-6 h-6 ${option.color}`} />
                        <span className="font-medium text-gray-700">
                          {t(`checkOptions.${option.key}`)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentView("menu")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">{tc("back")}</span>
                  </button>
                  <h3 className={`font-semibold ${getCategoryColor()}`}>
                    {getCategoryTitle()}
                  </h3>
                  <button
                    onClick={() => handleSelectCategory(currentView)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {renderMarketContent()}
              </motion.div>
            )}
          </AnimatePresence>

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
