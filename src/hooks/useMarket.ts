"use client";

import { useState, useEffect, useCallback } from "react";

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  image: string;
}

export interface ForexData {
  pair: string;
  rate: number;
  change: number;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

interface MarketState {
  stocks: StockData[];
  crypto: CryptoData[];
  forex: ForexData[];
  news: NewsItem[];
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

// Major stock indices (simulated with realistic data)
const MOCK_STOCKS: StockData[] = [
  { symbol: "SPY", name: "S&P 500", price: 512.34, change: 2.45, changePercent: 0.48 },
  { symbol: "QQQ", name: "NASDAQ 100", price: 438.67, change: -1.23, changePercent: -0.28 },
  { symbol: "DIA", name: "Dow Jones", price: 423.89, change: 3.12, changePercent: 0.74 },
  { symbol: "IWM", name: "Russell 2000", price: 198.45, change: -0.89, changePercent: -0.45 },
];

// Major forex pairs (will be fetched from API)
const FOREX_PAIRS = ["USD/EUR", "USD/JPY", "USD/GBP", "USD/KRW"];

export function useMarket() {
  const [state, setState] = useState<MarketState>({
    stocks: [],
    crypto: [],
    forex: [],
    news: [],
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

  const fetchStocks = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, stocks: true },
      error: { ...prev.error, stocks: null },
    }));

    try {
      // Using mock data with slight randomization to simulate real-time changes
      const stocks = MOCK_STOCKS.map((stock) => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 2,
        change: stock.change + (Math.random() - 0.5) * 0.5,
        changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2,
      }));

      setState((prev) => ({
        ...prev,
        stocks,
        loading: { ...prev.loading, stocks: false },
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, stocks: false },
        error: { ...prev.error, stocks: "Failed to fetch stock data" },
      }));
    }
  }, []);

  const fetchCrypto = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, crypto: true },
      error: { ...prev.error, crypto: null },
    }));

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple&order=market_cap_desc&sparkline=false"
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const crypto: CryptoData[] = data.map((coin: {
        id: string;
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        image: string;
      }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        image: coin.image,
      }));

      setState((prev) => ({
        ...prev,
        crypto,
        loading: { ...prev.loading, crypto: false },
      }));
    } catch {
      // Fallback to mock data
      const mockCrypto: CryptoData[] = [
        { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 67234.56, change24h: 2.34, image: "" },
        { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3456.78, change24h: -1.23, image: "" },
        { id: "solana", symbol: "SOL", name: "Solana", price: 178.90, change24h: 5.67, image: "" },
        { id: "ripple", symbol: "XRP", name: "XRP", price: 0.62, change24h: -0.45, image: "" },
      ];

      setState((prev) => ({
        ...prev,
        crypto: mockCrypto,
        loading: { ...prev.loading, crypto: false },
        error: { ...prev.error, crypto: null },
      }));
    }
  }, []);

  const fetchForex = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, forex: true },
      error: { ...prev.error, forex: null },
    }));

    try {
      // Using exchangerate.host free API
      const response = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=EUR,JPY,GBP,KRW"
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const forex: ForexData[] = [
        { pair: "USD/EUR", rate: data.rates?.EUR || 0.92, change: 0.12 },
        { pair: "USD/JPY", rate: data.rates?.JPY || 154.23, change: -0.45 },
        { pair: "USD/GBP", rate: data.rates?.GBP || 0.79, change: 0.08 },
        { pair: "USD/KRW", rate: data.rates?.KRW || 1345.67, change: 2.34 },
      ];

      setState((prev) => ({
        ...prev,
        forex,
        loading: { ...prev.loading, forex: false },
      }));
    } catch {
      // Fallback to mock data
      const mockForex: ForexData[] = [
        { pair: "USD/EUR", rate: 0.92, change: 0.12 },
        { pair: "USD/JPY", rate: 154.23, change: -0.45 },
        { pair: "USD/GBP", rate: 0.79, change: 0.08 },
        { pair: "USD/KRW", rate: 1345.67, change: 2.34 },
      ];

      setState((prev) => ({
        ...prev,
        forex: mockForex,
        loading: { ...prev.loading, forex: false },
        error: { ...prev.error, forex: null },
      }));
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, news: true },
      error: { ...prev.error, news: null },
    }));

    try {
      // Mock financial news headlines (in production, use NewsAPI or similar)
      const mockNews: NewsItem[] = [
        {
          title: "Fed Signals Potential Rate Cuts in Coming Months",
          source: "Reuters",
          url: "#",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "Tech Stocks Rally on Strong Earnings Reports",
          source: "Bloomberg",
          url: "#",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "Bitcoin Reaches New Monthly High Amid ETF Inflows",
          source: "CoinDesk",
          url: "#",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "Global Markets Mixed on Trade Policy Concerns",
          source: "CNBC",
          url: "#",
          publishedAt: new Date().toISOString(),
        },
      ];

      setState((prev) => ({
        ...prev,
        news: mockNews,
        loading: { ...prev.loading, news: false },
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, news: false },
        error: { ...prev.error, news: "Failed to fetch news" },
      }));
    }
  }, []);

  const fetchAll = useCallback(() => {
    fetchStocks();
    fetchCrypto();
    fetchForex();
    fetchNews();
  }, [fetchStocks, fetchCrypto, fetchForex, fetchNews]);

  return {
    ...state,
    fetchStocks,
    fetchCrypto,
    fetchForex,
    fetchNews,
    fetchAll,
  };
}
