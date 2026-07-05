import React, { useState } from 'react';
import { InvestmentProduct, FinancialStats } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, RefreshCw, Sparkles, Building, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface InvestmentSectionProps {
  products: InvestmentProduct[];
  stats: FinancialStats;
  onBuy: (productId: string, quantity: number) => void;
  onSell: (productId: string, quantity: number) => void;
  onTriggerTick: () => void;
}

export const InvestmentSection: React.FC<InvestmentSectionProps> = ({
  products,
  stats,
  onBuy,
  onSell,
  onTriggerTick,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [tradeAmount, setTradeAmount] = useState<string>('1');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleBuy = () => {
    const qty = parseFloat(tradeAmount);
    if (isNaN(qty) || qty <= 0) return;
    onBuy(selectedProduct.id, qty);
  };

  const handleSell = () => {
    const qty = parseFloat(tradeAmount);
    if (isNaN(qty) || qty <= 0) return;
    onSell(selectedProduct.id, qty);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'MODERATE':
        return 'text-blue-400 bg-blue-950 border-blue-900';
      case 'EXTREME':
        return 'text-orange-400 bg-orange-950 border-orange-900';
      case 'PONZI-SCHEME':
        return 'text-red-400 bg-red-950 border-red-900/40';
      case 'APOCALYPTIC':
        return 'text-purple-400 bg-purple-950 border-purple-900/40';
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  const calculateReturn = (prod: InvestmentProduct) => {
    if (prod.ownedQuantity === 0) return 0;
    const value = prod.ownedQuantity * prod.currentPrice;
    const cost = prod.ownedQuantity * prod.avgBuyPrice;
    return value - cost;
  };

  return (
    <div id="investment-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            <Coins className="text-bet-green-bright w-6 h-6 animate-pulse" />
            Speculative Investment Vehicles
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Why wait 90 minutes for a football match? Lose your ancestral wealth in real time with our automated algorithms.
          </p>
        </div>

        {/* Force tick button */}
        <button
          onClick={onTriggerTick}
          className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Update Prices (Tick)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of products */}
        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {products.map((p) => {
            const currentTotalValue = p.ownedQuantity * p.currentPrice;
            const netReturn = calculateReturn(p);
            const isUp = p.history.length > 1 && p.currentPrice >= p.history[p.history.length - 2].price;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProductId(p.id)}
                className={`w-full text-left p-4 rounded-xl transition border ${
                  selectedProductId === p.id
                    ? 'bg-neutral-950 border-bet-green-medium shadow-lg'
                    : 'bg-neutral-950/45 border-neutral-850 hover:border-neutral-800'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-sm text-white block">{p.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${getRiskColor(p.riskLevel)}`}>
                      {p.riskLevel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-white block">
                      ₦{p.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold flex items-center justify-end gap-0.5 ${isUp ? 'text-bet-green-bright' : 'text-bet-red'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {p.yieldRate}
                    </span>
                  </div>
                </div>

                {p.ownedQuantity > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-850 flex justify-between items-center text-[10px] font-mono text-neutral-400">
                    <span>Holding: {p.ownedQuantity.toFixed(4)}</span>
                    <span className={netReturn >= 0 ? 'text-bet-green-bright' : 'text-bet-red'}>
                      {netReturn >= 0 ? '+' : ''}₦{netReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Right column: Chart & trade interface */}
        {selectedProduct && (
          <div className="lg:col-span-7 bg-neutral-950/50 border border-neutral-850 rounded-2xl p-5 space-y-5">
            {/* Asset header */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">{selectedProduct.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{selectedProduct.description}</p>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="text-[10px] text-neutral-500 uppercase block">Active Rate</span>
                <span className="text-sm font-bold text-bet-gold">{selectedProduct.yieldRate} Yield</span>
              </div>
            </div>

            {/* Micro Chart */}
            <div className="h-44 bg-neutral-950 border border-neutral-850/65 rounded-xl p-2 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedProduct.history} margin={{ top: 10, right: 10, left: -20, bottom: -10 }}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px' }}
                    labelStyle={{ color: '#888' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={selectedProduct.riskLevel === 'PONZI-SCHEME' ? '#ff3333' : '#00ff66'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              {selectedProduct.riskLevel === 'PONZI-SCHEME' && (
                <div className="absolute top-2 right-2 bg-bet-red/10 border border-bet-red/30 px-2 py-0.5 rounded text-[9px] text-bet-red font-mono animate-pulse uppercase font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Rug Alert High
                </div>
              )}
            </div>

            {/* Trading block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5">Trade Size (Units)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    min="0.0001"
                    step="any"
                    className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-bet-green-medium focus:outline-none rounded-xl px-4 py-2.5 text-sm font-mono text-white pr-16"
                  />
                  <button
                    onClick={() => {
                      const maxBuy = stats.balance / selectedProduct.currentPrice;
                      setTradeAmount(maxBuy > 0 ? maxBuy.toFixed(4) : '0');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-bet-green-bright bg-bet-green-dark px-2 py-1 rounded hover:bg-bet-green-medium/40 transition"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Action buy / sell buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleBuy}
                  className="bg-bet-green-medium hover:bg-bet-green-bright hover:text-black text-white font-bold py-2.5 rounded-xl transition duration-150 active:scale-95 text-sm uppercase font-sans"
                >
                  Buy Asset
                </button>
                <button
                  onClick={handleSell}
                  disabled={selectedProduct.ownedQuantity <= 0}
                  className={`border font-bold py-2.5 rounded-xl transition duration-150 active:scale-95 text-sm uppercase font-sans ${
                    selectedProduct.ownedQuantity > 0
                      ? 'border-bet-red text-bet-red hover:bg-bet-red/10'
                      : 'border-neutral-850 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  Sell Asset
                </button>
              </div>
            </div>

            {/* Holding overview */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="text-neutral-500 font-mono block">Your Portfolio holdings</span>
                <span className="font-bold text-white text-sm">
                  {selectedProduct.ownedQuantity.toFixed(4)} Units
                </span>
              </div>
              <div className="text-right space-y-0.5 font-mono">
                <span className="text-neutral-500 block">Avg Buy Price</span>
                <span className="font-bold text-neutral-300">
                  ₦{selectedProduct.avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
