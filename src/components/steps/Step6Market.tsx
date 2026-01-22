"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Coffee, Clock, DollarSign, BarChart3 } from "lucide-react";

interface Step6Props {
  onComplete: () => void;
}

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
}

export function Step6Market({ onComplete }: Step6Props) {
  const [showMarket, setShowMarket] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [marketData, setMarketData] = useState<MarketItem[]>([]);

  useEffect(() => {
    // Simulated market data (in production, use real API)
    setMarketData([
      { symbol: "KOSPI", name: "코스피", price: "2,687.45", change: 12.34, changePercent: 0.46 },
      { symbol: "KOSDAQ", name: "코스닥", price: "876.23", change: -5.67, changePercent: -0.64 },
      { symbol: "USD/KRW", name: "달러/원", price: "1,342.50", change: 2.30, changePercent: 0.17 },
      { symbol: "BTC", name: "비트코인", price: "$67,234", change: 1234, changePercent: 1.87 },
    ]);
  }, []);

  const handleShowMarket = () => {
    if (!acknowledged) {
      setAcknowledged(true);
    } else {
      setShowMarket(true);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">전략적 시장 확인</h2>
        <p className="text-gray-600">Strategic Market Check</p>
      </div>

      {!showMarket ? (
        <>
          <div className="glass rounded-2xl p-6 max-w-md w-full mx-auto mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">잠깐!</h3>
                <p className="text-sm text-gray-600">
                  시장 확인은 골든 루틴의 <strong>마지막 단계</strong>입니다.
                  아침 루틴을 완료한 후, 감정적 안정을 확보한 상태에서 시장을 확인하세요.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <Coffee className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-amber-800">
                  너무 잦은 포트폴리오 확인은 스트레스를 유발하고 수익률을 떨어뜨릴 수 있습니다.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-blue-800">
                  가능하다면 매일이 아닌 <strong>주간 단위</strong> 확인을 권장합니다.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <BarChart3 className="w-4 h-4 text-green-600 mt-0.5" />
                <p className="text-green-800">
                  계좌 확인 빈도를 줄인 투자자들의 성과가 더 좋았다는 연구 결과가 있습니다.
                </p>
              </div>
            </div>
          </div>

          {!acknowledged ? (
            <div className="max-w-md w-full mx-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShowMarket}
                className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-slate-400 to-gray-500 text-white"
              >
                이해했습니다
              </motion.button>
            </div>
          ) : (
            <div className="max-w-md w-full mx-auto space-y-3">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShowMarket}
                className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-slate-400 to-gray-500 text-white"
              >
                시장 확인하기
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white"
              >
                오늘은 확인하지 않기 ✨
              </motion.button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="glass rounded-2xl p-4 max-w-md w-full mx-auto mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              오늘의 시장
            </h3>

            <div className="space-y-3">
              {marketData.map((item) => (
                <motion.div
                  key={item.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
                >
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{item.price}</div>
                    <div className={`flex items-center gap-1 text-sm ${
                      item.change >= 0 ? "text-red-500" : "text-blue-500"
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{item.change >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              * 실제 데이터는 API 연동 후 표시됩니다
            </p>
          </div>

          <div className="glass rounded-2xl p-4 max-w-md w-full mx-auto mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">💡 오늘의 투자 마인드</h3>
            <p className="text-sm text-gray-600">
              단기 변동에 감정적으로 반응하지 마세요. 장기적인 관점에서
              당신의 투자 전략을 신뢰하세요. 오늘 아침 루틴을 통해
              얻은 마음의 평화를 유지하며 현명한 결정을 내리세요.
            </p>
          </div>

          <div className="flex-1" />

          <div className="max-w-md w-full mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full py-4 rounded-full font-semibold shadow-lg bg-gradient-to-r from-golden-400 to-golden-500 text-white"
            >
              골든 루틴 완료! 🌟
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
}
