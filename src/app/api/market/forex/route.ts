import { NextResponse } from "next/server";

interface ForexResult {
  pair: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  chartData: { time: string; value: number }[];
}

const FOREX_PAIRS = [
  { symbol: "EURUSD=X", from: "EUR", to: "USD", displayPair: "EUR/USD" },
  { symbol: "USDJPY=X", from: "USD", to: "JPY", displayPair: "USD/JPY" },
  { symbol: "GBPUSD=X", from: "GBP", to: "USD", displayPair: "GBP/USD" },
  { symbol: "USDKRW=X", from: "USD", to: "KRW", displayPair: "USD/KRW" },
  { symbol: "USDCNY=X", from: "USD", to: "CNY", displayPair: "USD/CNY" },
];

function yahooToChartData(
  timestamps: number[],
  prices: (number | null)[],
  decimals: number = 4
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
    const forexData: ForexResult[] = [];

    const responses = await Promise.allSettled(
      FOREX_PAIRS.map((pair) =>
        fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${pair.symbol}?interval=5m&range=1d`,
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
      const pairInfo = FOREX_PAIRS[i];

      if (response.status === "fulfilled" && response.value) {
        const data = response.value;
        const result = data.chart?.result?.[0];

        if (result) {
          const meta = result.meta;
          const prices = result.indicators?.quote?.[0]?.close || [];
          const timestamps = result.timestamp || [];

          // Determine decimal places based on currency
          const decimals =
            pairInfo.to === "JPY" || pairInfo.to === "KRW" ? 2 : 4;
          const chartData = yahooToChartData(timestamps, prices, decimals);

          if (chartData.length > 0 && meta.regularMarketPrice) {
            const currentRate = meta.regularMarketPrice;
            const previousClose =
              meta.previousClose || meta.chartPreviousClose || currentRate;
            const change = currentRate - previousClose;
            const changePercent = (change / previousClose) * 100;

            forexData.push({
              pair: pairInfo.displayPair,
              from: pairInfo.from,
              to: pairInfo.to,
              rate: currentRate,
              change,
              changePercent,
              chartData,
            });
          }
        }
      }
    }

    if (forexData.length === 0) {
      return NextResponse.json(
        { error: "No forex data available" },
        { status: 503 }
      );
    }

    return NextResponse.json({ forex: forexData });
  } catch (error) {
    console.error("Forex API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch forex data" },
      { status: 500 }
    );
  }
}
