import { NextResponse } from "next/server";

interface StockResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  chartData: { time: string; value: number }[];
}

const STOCK_NAMES: Record<string, string> = {
  SPY: "S&P 500 ETF",
  QQQ: "NASDAQ 100 ETF",
  DIA: "Dow Jones ETF",
  IWM: "Russell 2000 ETF",
};

function yahooToChartData(
  timestamps: number[],
  prices: (number | null)[],
  decimals: number = 2
): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (prices[i] !== null && prices[i] !== undefined) {
      data.push({
        time: new Date(timestamps[i] * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: Number(prices[i]!.toFixed(decimals)),
      });
    }
  }

  return data;
}

export async function GET() {
  try {
    const symbols = ["SPY", "QQQ", "DIA", "IWM"];
    const stocksData: StockResult[] = [];

    const responses = await Promise.allSettled(
      symbols.map((symbol) =>
        fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=5m&range=1d`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
          }
        ).then((res) => (res.ok ? res.json() : null))
      )
    );

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const symbol = symbols[i];

      if (response.status === "fulfilled" && response.value) {
        const data = response.value;
        const result = data.chart?.result?.[0];

        if (result) {
          const meta = result.meta;
          const prices = result.indicators?.quote?.[0]?.close || [];
          const timestamps = result.timestamp || [];

          const chartData = yahooToChartData(timestamps, prices, 2);

          if (chartData.length > 0 && meta.regularMarketPrice) {
            stocksData.push({
              symbol: meta.symbol || symbol,
              name: STOCK_NAMES[symbol] || symbol,
              price: meta.regularMarketPrice,
              change: meta.regularMarketPrice - (meta.previousClose || meta.regularMarketPrice),
              changePercent:
                ((meta.regularMarketPrice - (meta.previousClose || meta.regularMarketPrice)) /
                  (meta.previousClose || meta.regularMarketPrice)) *
                100,
              high: meta.regularMarketDayHigh || meta.regularMarketPrice,
              low: meta.regularMarketDayLow || meta.regularMarketPrice,
              chartData,
            });
          }
        }
      }
    }

    if (stocksData.length === 0) {
      return NextResponse.json(
        { error: "No stock data available" },
        { status: 503 }
      );
    }

    return NextResponse.json({ stocks: stocksData });
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
