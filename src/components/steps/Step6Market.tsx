"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Coffee, Clock, BarChart3, TrendingUp, TrendingDown,
  Newspaper, Bitcoin, DollarSign, ArrowLeft, RefreshCw, ExternalLink,
  Activity, Wifi
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useMarket, StockData, CryptoData, ForexData, NewsItem, ChartDataPoint } from "@/hooks/useMarket";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface Step6Props {
  onComplete: () => void;
}

type MarketView = "menu" | "stocks" | "crypto" | "news" | "forex";

// Mini Chart Component
function MiniChart({ data, color, height = 60 }: { data: ChartDataPoint[]; color: string; height?: number }) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const isPositive = data[data.length - 1]?.value >= data[0]?.value;

  // Add padding to domain for better visualization
  const padding = range * 0.1 || minValue * 0.005;
  const domainMin = minValue - padding;
  const domainMax = maxValue + padding;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.3} />
            <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[domainMin, domainMax]} hide />
        <Area
          type="monotone"
          dataKey="value"
          stroke={isPositive ? "#10B981" : "#EF4444"}
          strokeWidth={1.5}
          fill={`url(#gradient-${color})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Full Chart Component
function FullChart({ data, color }: { data: ChartDataPoint[]; color: string }) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const isPositive = data[data.length - 1]?.value >= data[0]?.value;
  const chartColor = isPositive ? "#10B981" : "#EF4444";

  // Add padding to domain for better visualization
  const padding = range * 0.15 || minValue * 0.01;
  const domainMin = minValue - padding;
  const domainMax = maxValue + padding;

  // Format price based on magnitude
  const formatPrice = (val: number): string => {
    if (val >= 1000) return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (val >= 1) return `$${val.toFixed(2)}`;
    return `$${val.toFixed(4)}`;
  };

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={`fullGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={[domainMin, domainMax]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => [formatPrice(Number(value)), 'Price']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#fullGradient-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PriceChange({ value, showPercent = true }: { value: number; showPercent?: boolean }) {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{value.toFixed(2)}{showPercent ? "%" : ""}
    </span>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function LiveIndicator({ lastUpdated }: { lastUpdated: Date | null }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!lastUpdated) return null;

  const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>Updated {secondsAgo}s ago</span>
    </div>
  );
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

function StocksWidget({
  stocks,
  loading,
  lastUpdated,
  selectedStock,
  onSelectStock,
  error,
  onRetry
}: {
  stocks: StockData[];
  loading: boolean;
  lastUpdated: Date | null;
  selectedStock: StockData | null;
  onSelectStock: (stock: StockData | null) => void;
  error: string | null;
  onRetry: () => void;
}) {
  const t = useTranslations("steps.step6");

  if (loading && stocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error && stocks.length === 0) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">{t("widgets.majorIndices")}</h4>
        <LiveIndicator lastUpdated={lastUpdated} />
      </div>

      {selectedStock ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => onSelectStock(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm text-gray-500">{selectedStock.symbol}</span>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              ${selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <PriceChange value={selectedStock.changePercent} />
          </div>

          <FullChart data={selectedStock.chartData} color={selectedStock.symbol} />

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">High</div>
              <div className="font-semibold">${selectedStock.high.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">Low</div>
              <div className="font-semibold">${selectedStock.low.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        stocks.map((stock) => (
          <motion.button
            key={stock.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelectStock(stock)}
            className="w-full flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-all text-left"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{stock.symbol}</div>
              <div className="text-xs text-gray-500">{stock.name}</div>
            </div>
            <div className="w-20 h-10 mx-2">
              <MiniChart data={stock.chartData} color={stock.symbol} height={40} />
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-800">${stock.price.toFixed(2)}</div>
              <PriceChange value={stock.changePercent} />
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}

function CryptoWidget({
  crypto,
  loading,
  lastUpdated,
  selectedCrypto,
  onSelectCrypto,
  error,
  onRetry
}: {
  crypto: CryptoData[];
  loading: boolean;
  lastUpdated: Date | null;
  selectedCrypto: CryptoData | null;
  onSelectCrypto: (crypto: CryptoData | null) => void;
  error: string | null;
  onRetry: () => void;
}) {
  const t = useTranslations("steps.step6");

  if (loading && crypto.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error && crypto.length === 0) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">{t("widgets.topCrypto")}</h4>
        <LiveIndicator lastUpdated={lastUpdated} />
      </div>

      {selectedCrypto ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => onSelectCrypto(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              {selectedCrypto.image && (
                <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-6 h-6 rounded-full" />
              )}
              <span className="text-sm text-gray-500">{selectedCrypto.symbol}</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              ${selectedCrypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <PriceChange value={selectedCrypto.change24h} />
          </div>

          <FullChart data={selectedCrypto.chartData} color={selectedCrypto.id} />

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">24h High</div>
              <div className="font-semibold">${selectedCrypto.high24h?.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">24h Low</div>
              <div className="font-semibold">${selectedCrypto.low24h?.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">Volume</div>
              <div className="font-semibold">{formatLargeNumber(selectedCrypto.volume)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-gray-500">Market Cap</div>
              <div className="font-semibold">{formatLargeNumber(selectedCrypto.marketCap)}</div>
            </div>
          </div>
        </motion.div>
      ) : (
        crypto.map((coin) => (
          <motion.button
            key={coin.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelectCrypto(coin)}
            className="w-full flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-all text-left"
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
            <div className="w-16 h-10 mx-2">
              <MiniChart data={coin.chartData} color={coin.id} height={40} />
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-800">
                ${coin.price >= 1 ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
              </div>
              <PriceChange value={coin.change24h} />
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}

function ForexWidget({
  forex,
  loading,
  lastUpdated,
  selectedPair,
  onSelectPair,
  error,
  onRetry
}: {
  forex: ForexData[];
  loading: boolean;
  lastUpdated: Date | null;
  selectedPair: ForexData | null;
  onSelectPair: (pair: ForexData | null) => void;
  error: string | null;
  onRetry: () => void;
}) {
  const t = useTranslations("steps.step6");

  if (loading && forex.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error && forex.length === 0) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">{t("widgets.exchangeRates")}</h4>
        <LiveIndicator lastUpdated={lastUpdated} />
      </div>

      {selectedPair ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => onSelectPair(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm font-medium text-gray-700">{selectedPair.pair}</span>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              {selectedPair.rate.toFixed(selectedPair.rate >= 100 ? 2 : 4)}
            </div>
            <PriceChange value={selectedPair.changePercent} />
          </div>

          <FullChart data={selectedPair.chartData} color={selectedPair.pair} />
        </motion.div>
      ) : (
        forex.map((pair) => (
          <motion.button
            key={pair.pair}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onSelectPair(pair)}
            className="w-full flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-semibold text-gray-800">{pair.pair}</div>
            </div>
            <div className="w-16 h-10 mx-2">
              <MiniChart data={pair.chartData} color={pair.pair} height={40} />
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-800">{pair.rate.toFixed(pair.rate >= 100 ? 2 : 4)}</div>
              <PriceChange value={pair.changePercent} />
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
}

function NewsWidget({ news, loading, error, onRetry }: { news: NewsItem[]; loading: boolean; error: string | null; onRetry: () => void }) {
  const t = useTranslations("steps.step6");

  if (loading && news.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error && news.length === 0) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeAgo = (date: string) => {
    const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">{t("widgets.latestNews")}</h4>
      {news.map((item, idx) => (
        <motion.a
          key={idx}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="block p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="font-medium text-gray-800 text-sm leading-tight mb-2">
                {item.title}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(item.sentiment)}`}>
                  {item.source}
                </span>
                <span className="text-xs text-gray-400">{getTimeAgo(item.publishedAt)}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </motion.a>
      ))}
    </div>
  );
}

export function Step6Market({ onComplete }: Step6Props) {
  const t = useTranslations("steps.step6");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [acknowledged, setAcknowledged] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [currentView, setCurrentView] = useState<MarketView>("menu");
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [selectedForex, setSelectedForex] = useState<ForexData | null>(null);

  const {
    stocks, crypto, forex, news,
    lastUpdated,
    loading,
    error,
    fetchStocks, fetchCrypto, fetchForex, fetchNews,
    startAutoRefresh, stopAutoRefresh
  } = useMarket(15000); // Refresh every 15 seconds

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  const handleSkip = () => {
    setSkipped(true);
  };

  const handleSelectCategory = (category: MarketView) => {
    setCurrentView(category);
    setSelectedStock(null);
    setSelectedCrypto(null);
    setSelectedForex(null);

    // Fetch data and start auto-refresh when category is selected
    switch (category) {
      case "stocks":
        fetchStocks();
        startAutoRefresh('stocks');
        break;
      case "crypto":
        fetchCrypto();
        startAutoRefresh('crypto');
        break;
      case "forex":
        fetchForex();
        startAutoRefresh('forex');
        break;
      case "news":
        fetchNews(locale);
        startAutoRefresh('news');
        break;
    }
  };

  const handleBackToMenu = () => {
    setCurrentView("menu");
    stopAutoRefresh();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, [stopAutoRefresh]);

  const checkOptions = [
    { key: "stocks" as const, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100" },
    { key: "crypto" as const, icon: Bitcoin, color: "text-orange-500", bg: "bg-orange-100" },
    { key: "news" as const, icon: Newspaper, color: "text-purple-500", bg: "bg-purple-100" },
    { key: "forex" as const, icon: DollarSign, color: "text-green-500", bg: "bg-green-100" },
  ];

  const renderMarketContent = () => {
    switch (currentView) {
      case "stocks":
        return (
          <StocksWidget
            stocks={stocks}
            loading={loading.stocks}
            lastUpdated={lastUpdated}
            selectedStock={selectedStock}
            onSelectStock={setSelectedStock}
            error={error.stocks}
            onRetry={fetchStocks}
          />
        );
      case "crypto":
        return (
          <CryptoWidget
            crypto={crypto}
            loading={loading.crypto}
            lastUpdated={lastUpdated}
            selectedCrypto={selectedCrypto}
            onSelectCrypto={setSelectedCrypto}
            error={error.crypto}
            onRetry={fetchCrypto}
          />
        );
      case "forex":
        return (
          <ForexWidget
            forex={forex}
            loading={loading.forex}
            lastUpdated={lastUpdated}
            selectedPair={selectedForex}
            onSelectPair={setSelectedForex}
            error={error.forex}
            onRetry={fetchForex}
          />
        );
      case "news":
        return (
          <NewsWidget
            news={news}
            loading={loading.news}
            error={error.news}
            onRetry={fetchNews}
          />
        );
      default:
        return null;
    }
  };

  const getCategoryTitle = () => {
    switch (currentView) {
      case "stocks": return t("checkOptions.stocks");
      case "crypto": return t("checkOptions.crypto");
      case "forex": return t("checkOptions.forex");
      case "news": return t("checkOptions.news");
      default: return "";
    }
  };

  const getCategoryColor = () => {
    switch (currentView) {
      case "stocks": return "text-blue-500";
      case "crypto": return "text-orange-500";
      case "forex": return "text-green-500";
      case "news": return "text-purple-500";
      default: return "";
    }
  };

  const handleRefresh = () => {
    switch (currentView) {
      case "stocks": fetchStocks(); break;
      case "crypto": fetchCrypto(); break;
      case "forex": fetchForex(); break;
      case "news": fetchNews(locale); break;
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
                className="glass rounded-2xl p-4 max-w-md w-full mx-auto mb-6 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleBackToMenu}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">{tc("back")}</span>
                  </button>
                  <h3 className={`font-semibold ${getCategoryColor()}`}>
                    {getCategoryTitle()}
                  </h3>
                  <button
                    onClick={handleRefresh}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading[currentView as keyof typeof loading] ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto">
                  {renderMarketContent()}
                </div>
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
