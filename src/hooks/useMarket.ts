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

// Convert Yahoo Finance timestamps and prices to chart data
function yahooToChartData(timestamps: number[], prices: (number | null)[], decimals: number = 2): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (prices[i] !== null && prices[i] !== undefined) {
      data.push({
        time: new Date(timestamps[i] * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: Number(prices[i]!.toFixed(decimals))
      });
    }
  }

  return data;
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

  // Fetch real stock data from Yahoo Finance
  const fetchStocks = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, stocks: true },
      error: { ...prev.error, stocks: null },
    }));

    try {
      const symbols = ['SPY', 'QQQ', 'DIA', 'IWM'];
      const stocksData: StockData[] = [];

      // Fetch all symbols in parallel
      const responses = await Promise.allSettled(
        symbols.map(symbol =>
          fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`,
            { cache: 'no-store' }
          ).then(res => res.ok ? res.json() : null)
        )
      );

      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (response.status === 'fulfilled' && response.value) {
          const data = response.value;
          const result = data.chart?.result?.[0];

          if (result) {
            const meta = result.meta;
            const prices = result.indicators?.quote?.[0]?.close || [];
            const timestamps = result.timestamp || [];

            const chartData = yahooToChartData(timestamps, prices, 2);

            if (chartData.length > 0) {
              stocksData.push({
                symbol: meta.symbol,
                name: getStockName(meta.symbol),
                price: meta.regularMarketPrice,
                change: meta.regularMarketPrice - meta.previousClose,
                changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
                high: meta.regularMarketDayHigh || meta.regularMarketPrice,
                low: meta.regularMarketDayLow || meta.regularMarketPrice,
                chartData
              });
            }
          }
        }
      }

      if (stocksData.length === 0) {
        throw new Error("No stock data available");
      }

      setState((prev) => ({
        ...prev,
        stocks: stocksData,
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

  // Fetch real crypto data from CoinGecko
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

  // Fetch real forex data from Yahoo Finance
  const fetchForex = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, forex: true },
      error: { ...prev.error, forex: null },
    }));

    try {
      // Yahoo Finance forex symbols
      const forexPairs = [
        { symbol: 'EURUSD=X', from: 'EUR', to: 'USD', displayPair: 'EUR/USD' },
        { symbol: 'USDJPY=X', from: 'USD', to: 'JPY', displayPair: 'USD/JPY' },
        { symbol: 'GBPUSD=X', from: 'GBP', to: 'USD', displayPair: 'GBP/USD' },
        { symbol: 'USDKRW=X', from: 'USD', to: 'KRW', displayPair: 'USD/KRW' },
        { symbol: 'USDCNY=X', from: 'USD', to: 'CNY', displayPair: 'USD/CNY' },
      ];

      const forexData: ForexData[] = [];

      // Fetch all forex pairs in parallel
      const responses = await Promise.allSettled(
        forexPairs.map(pair =>
          fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${pair.symbol}?interval=5m&range=1d`,
            { cache: 'no-store' }
          ).then(res => res.ok ? res.json() : null)
        )
      );

      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const pairInfo = forexPairs[i];

        if (response.status === 'fulfilled' && response.value) {
          const data = response.value;
          const result = data.chart?.result?.[0];

          if (result) {
            const meta = result.meta;
            const prices = result.indicators?.quote?.[0]?.close || [];
            const timestamps = result.timestamp || [];

            // Determine decimal places based on currency
            const decimals = pairInfo.to === 'JPY' || pairInfo.to === 'KRW' ? 2 : 4;
            const chartData = yahooToChartData(timestamps, prices, decimals);

            if (chartData.length > 0) {
              const currentRate = meta.regularMarketPrice;
              const previousClose = meta.previousClose || meta.chartPreviousClose;
              const change = currentRate - previousClose;
              const changePercent = (change / previousClose) * 100;

              forexData.push({
                pair: pairInfo.displayPair,
                from: pairInfo.from,
                to: pairInfo.to,
                rate: currentRate,
                change,
                changePercent,
                chartData
              });
            }
          }
        }
      }

      if (forexData.length === 0) {
        throw new Error("No forex data available");
      }

      setState((prev) => ({
        ...prev,
        forex: forexData,
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

  // Fetch real market news from Google News RSS
  const fetchNews = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, news: true },
      error: { ...prev.error, news: null },
    }));

    try {
      // Use a CORS proxy to fetch Google News RSS for financial news
      const rssUrl = 'https://news.google.com/rss/search?q=stock+market+finance&hl=en-US&gl=US&ceid=US:en';

      // Try fetching via a public RSS-to-JSON service
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

function getStockName(symbol: string): string {
  const names: Record<string, string> = {
    SPY: 'S&P 500 ETF',
    QQQ: 'NASDAQ 100 ETF',
    DIA: 'Dow Jones ETF',
    IWM: 'Russell 2000 ETF',
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corp.',
    GOOGL: 'Alphabet Inc.',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
  };
  return names[symbol] || symbol;
}
