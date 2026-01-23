"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  chartData: ChartDataPoint[];
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  marketCap: number;
  image: string;
  sparkline: number[];
  chartData: ChartDataPoint[];
}

export interface ForexData {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  chartData: ChartDataPoint[];
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: "positive" | "negative" | "neutral";
}

interface MarketState {
  stocks: StockData[];
  crypto: CryptoData[];
  forex: ForexData[];
  news: NewsItem[];
  lastUpdated: Date | null;
  loading: {
    stocks: boolean;
    crypto: boolean;
    forex: boolean;
    news: boolean;
  };
  error: {
    stocks: string | null;
    crypto: string | null;
    forex: string | null;
    news: string | null;
  };
}

// Convert CoinGecko sparkline to chart data
function sparklineToChartData(sparkline: number[], currentPrice: number): ChartDataPoint[] {
  const now = new Date();
  const decimals = currentPrice >= 100 ? 2 : currentPrice >= 1 ? 2 : 6;

  const data = sparkline.map((value, index) => ({
    time: new Date(now.getTime() - (sparkline.length - index) * 60 * 60 * 1000)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: Number(value.toFixed(decimals))
  }));

  // Ensure the last point matches current price
  if (data.length > 0) {
    data[data.length - 1].value = Number(currentPrice.toFixed(decimals));
  }

  return data;
}

// Map app locales to Google News hl/gl/ceid parameters
function getGoogleNewsParams(locale: string): { hl: string; gl: string; ceid: string } {
  const localeMap: Record<string, { hl: string; gl: string; ceid: string }> = {
    'en': { hl: 'en-US', gl: 'US', ceid: 'US:en' },
    'ko': { hl: 'ko', gl: 'KR', ceid: 'KR:ko' },
    'ja': { hl: 'ja', gl: 'JP', ceid: 'JP:ja' },
    'zh-CN': { hl: 'zh-CN', gl: 'CN', ceid: 'CN:zh-Hans' },
    'zh-TW': { hl: 'zh-TW', gl: 'TW', ceid: 'TW:zh-Hant' },
    'de': { hl: 'de', gl: 'DE', ceid: 'DE:de' },
    'fr': { hl: 'fr', gl: 'FR', ceid: 'FR:fr' },
    'es': { hl: 'es', gl: 'ES', ceid: 'ES:es' },
    'it': { hl: 'it', gl: 'IT', ceid: 'IT:it' },
    'pt': { hl: 'pt-PT', gl: 'PT', ceid: 'PT:pt-150' },
    'pt-BR': { hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' },
    'ru': { hl: 'ru', gl: 'RU', ceid: 'RU:ru' },
    'ar': { hl: 'ar', gl: 'SA', ceid: 'SA:ar' },
    'hi': { hl: 'hi', gl: 'IN', ceid: 'IN:hi' },
    'th': { hl: 'th', gl: 'TH', ceid: 'TH:th' },
    'vi': { hl: 'vi', gl: 'VN', ceid: 'VN:vi' },
    'id': { hl: 'id', gl: 'ID', ceid: 'ID:id' },
    'ms': { hl: 'ms', gl: 'MY', ceid: 'MY:ms' },
    'tr': { hl: 'tr', gl: 'TR', ceid: 'TR:tr' },
    'pl': { hl: 'pl', gl: 'PL', ceid: 'PL:pl' },
    'nl': { hl: 'nl', gl: 'NL', ceid: 'NL:nl' },
    'sv': { hl: 'sv', gl: 'SE', ceid: 'SE:sv' },
    'da': { hl: 'da', gl: 'DK', ceid: 'DK:da' },
    'no': { hl: 'no', gl: 'NO', ceid: 'NO:no' },
    'fi': { hl: 'fi', gl: 'FI', ceid: 'FI:fi' },
    'el': { hl: 'el', gl: 'GR', ceid: 'GR:el' },
    'he': { hl: 'he', gl: 'IL', ceid: 'IL:he' },
    'hu': { hl: 'hu', gl: 'HU', ceid: 'HU:hu' },
    'cs': { hl: 'cs', gl: 'CZ', ceid: 'CZ:cs' },
    'ro': { hl: 'ro', gl: 'RO', ceid: 'RO:ro' },
    'uk': { hl: 'uk', gl: 'UA', ceid: 'UA:uk' },
  };
  return localeMap[locale] || localeMap['en'];
}

export function useMarket(refreshInterval: number = 30000) {
  const [state, setState] = useState<MarketState>({
    stocks: [],
    crypto: [],
    forex: [],
    news: [],
    lastUpdated: null,
    loading: {
      stocks: false,
      crypto: false,
      forex: false,
      news: false,
    },
    error: {
      stocks: null,
      crypto: null,
      forex: null,
      news: null,
    },
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeCategory = useRef<string | null>(null);

  // Fetch stock data via our API route (avoids CORS)
  const fetchStocks = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, stocks: true },
      error: { ...prev.error, stocks: null },
    }));

    try {
      const response = await fetch('/api/market/stocks', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const data = await response.json();

      if (data.error || !data.stocks || data.stocks.length === 0) {
        throw new Error(data.error || 'No stock data available');
      }

      setState((prev) => ({
        ...prev,
        stocks: data.stocks,
        lastUpdated: new Date(),
        loading: { ...prev.loading, stocks: false },
      }));
    } catch (error) {
      console.error('Stock fetch error:', error);
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, stocks: false },
        error: { ...prev.error, stocks: "Failed to fetch real-time stock data" },
      }));
    }
  }, []);

  // Fetch crypto data from CoinGecko (supports CORS)
  const fetchCrypto = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, crypto: true },
      error: { ...prev.error, crypto: null },
    }));

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin&order=market_cap_desc&sparkline=true&price_change_percentage=24h",
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No crypto data available");
      }

      const crypto: CryptoData[] = data.map((coin: {
        id: string;
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        high_24h: number;
        low_24h: number;
        total_volume: number;
        market_cap: number;
        image: string;
        sparkline_in_7d?: { price: number[] };
      }) => {
        // Get last 24 hours of sparkline data (CoinGecko provides 7 days, ~168 points)
        const sparkline = coin.sparkline_in_7d?.price?.slice(-24) || [];

        return {
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
          volume: coin.total_volume,
          marketCap: coin.market_cap,
          image: coin.image,
          sparkline,
          chartData: sparkline.length > 0
            ? sparklineToChartData(sparkline, coin.current_price)
            : []
        };
      });

      setState((prev) => ({
        ...prev,
        crypto,
        lastUpdated: new Date(),
        loading: { ...prev.loading, crypto: false },
      }));
    } catch (error) {
      console.error('Crypto fetch error:', error);
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, crypto: false },
        error: { ...prev.error, crypto: "Failed to fetch real-time crypto data" },
      }));
    }
  }, []);

  // Fetch forex data via our API route (avoids CORS)
  const fetchForex = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, forex: true },
      error: { ...prev.error, forex: null },
    }));

    try {
      const response = await fetch('/api/market/forex', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Failed to fetch forex data');
      }

      const data = await response.json();

      if (data.error || !data.forex || data.forex.length === 0) {
        throw new Error(data.error || 'No forex data available');
      }

      setState((prev) => ({
        ...prev,
        forex: data.forex,
        lastUpdated: new Date(),
        loading: { ...prev.loading, forex: false },
      }));
    } catch (error) {
      console.error('Forex fetch error:', error);
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, forex: false },
        error: { ...prev.error, forex: "Failed to fetch real-time forex data" },
      }));
    }
  }, []);

  // Store current locale for news fetching
  const currentLocale = useRef<string>('en');

  // Fetch market news from Google News RSS
  const fetchNews = useCallback(async (locale?: string) => {
    if (locale) {
      currentLocale.current = locale;
    }

    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, news: true },
      error: { ...prev.error, news: null },
    }));

    try {
      // Use rss2json service to fetch Google News RSS for financial news
      const { hl, gl, ceid } = getGoogleNewsParams(currentLocale.current);
      const rssUrl = `https://news.google.com/rss/search?q=stock+market+finance&hl=${hl}&gl=${gl}&ceid=${ceid}`;

      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`,
        { cache: 'no-store' }
      );

      if (!response.ok) {
        throw new Error('News API error');
      }

      const data = await response.json();

      if (data.status !== 'ok' || !data.items || data.items.length === 0) {
        throw new Error('No news available');
      }

      const news: NewsItem[] = data.items.slice(0, 5).map((item: {
        title: string;
        link: string;
        pubDate: string;
        source?: { title: string };
      }) => {
        // Extract source from title (Google News format: "Title - Source")
        const titleParts = item.title.split(' - ');
        const source = titleParts.length > 1 ? titleParts.pop() || 'News' : 'Google News';
        const title = titleParts.join(' - ');

        // Simple sentiment analysis based on keywords
        const lowerTitle = title.toLowerCase();
        let sentiment: "positive" | "negative" | "neutral" = "neutral";
        if (lowerTitle.includes('surge') || lowerTitle.includes('gain') || lowerTitle.includes('rise') ||
            lowerTitle.includes('high') || lowerTitle.includes('bull') || lowerTitle.includes('up')) {
          sentiment = 'positive';
        } else if (lowerTitle.includes('fall') || lowerTitle.includes('drop') || lowerTitle.includes('crash') ||
                   lowerTitle.includes('low') || lowerTitle.includes('bear') || lowerTitle.includes('down') ||
                   lowerTitle.includes('lose') || lowerTitle.includes('fear')) {
          sentiment = 'negative';
        }

        return {
          title,
          source,
          url: item.link,
          publishedAt: new Date(item.pubDate).toISOString(),
          sentiment
        };
      });

      setState((prev) => ({
        ...prev,
        news,
        lastUpdated: new Date(),
        loading: { ...prev.loading, news: false },
      }));
    } catch (error) {
      console.error('News fetch error:', error);
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, news: false },
        error: { ...prev.error, news: "Failed to fetch market news" },
      }));
    }
  }, []);

  const startAutoRefresh = useCallback((category: string) => {
    activeCategory.current = category;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for auto-refresh
    intervalRef.current = setInterval(() => {
      switch (category) {
        case 'stocks':
          fetchStocks();
          break;
        case 'crypto':
          fetchCrypto();
          break;
        case 'forex':
          fetchForex();
          break;
        case 'news':
          fetchNews();
          break;
      }
    }, refreshInterval);
  }, [refreshInterval, fetchStocks, fetchCrypto, fetchForex, fetchNews]);

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeCategory.current = null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    fetchStocks,
    fetchCrypto,
    fetchForex,
    fetchNews,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
