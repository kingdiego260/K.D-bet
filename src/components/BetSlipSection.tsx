import React, { useState } from 'react';
import { BetSlipItem, ActiveBet, FinancialStats } from '../types';
import { Ticket, Coins, Trash2, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BetSlipSectionProps {
  slipItems: BetSlipItem[];
  activeBets: ActiveBet[];
  stats: FinancialStats;
  onRemoveItem: (matchId: string) => void;
  onClearSlip: () => void;
  onPlaceBet: (stake: number) => void;
  onSelectBet: (bet: ActiveBet) => void;
}

export const BetSlipSection: React.FC<BetSlipSectionProps> = ({
  slipItems,
  activeBets,
  stats,
  onRemoveItem,
  onClearSlip,
  onPlaceBet,
  onSelectBet,
}) => {
  const [stakeInput, setStakeInput] = useState<string>('500');
  const [isPlacing, setIsPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalOdds = slipItems.reduce((acc, item) => acc * item.odds, 1);
  const stake = parseFloat(stakeInput) || 0;
  const potentialPayout = stake * totalOdds;

  const handlePlaceBet = () => {
    setErrorMsg(null);
    if (slipItems.length === 0) {
      setErrorMsg("Abeg, select at least one sure odd to build a ticket!");
      return;
    }
    if (stake <= 0) {
      setErrorMsg("Chairman, you cannot bet with zero Naira! Enter capital stake!");
      return;
    }
    if (stake > stats.balance) {
      setErrorMsg("Insufficient funds! Go to Mock Deposit and sell Uncle's land!");
      return;
    }

    setIsPlacing(true);

    // Simulate bookie receiving delay
    setTimeout(() => {
      onPlaceBet(stake);
      setIsPlacing(false);
    }, 1200);
  };

  const getSarcasticRemark = (odds: number) => {
    if (odds === 1) return "Slip is dry. Choose some odds!";
    if (odds < 2) return "Safe 1.5 odds player. Your profit cannot even buy cold mineral.";
    if (odds < 5) return "Standard 3 odds speculator. Decent chance, but Alhaji is still confident.";
    if (odds < 25) return "Bold accumulator speculator. Bold move, egbon.";
    if (odds < 100) return "Greedy ticket. High potential, but remember: the bookie is smiling.";
    return "100+ odds miracle hunt! Your native doctor better be working overtime!";
  };

  return (
    <div id="betslip-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5 sticky top-6">
      {/* Tab Header */}
      <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-bet-gold" />
          <h3 className="font-display font-bold text-base text-white">Interactive Bet Slip</h3>
        </div>
        {slipItems.length > 0 && (
          <button
            onClick={onClearSlip}
            className="text-[10px] font-mono text-neutral-500 hover:text-bet-red transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear ({slipItems.length})
          </button>
        )}
      </div>

      {/* Slip Items List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {slipItems.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 space-y-1">
              <p className="text-sm">Your bet slip is empty</p>
              <p className="text-[10px] font-mono">Click some match odds to build your ticket!</p>
            </div>
          ) : (
            slipItems.map((item) => (
              <motion.div
                key={item.matchId}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 flex justify-between items-start gap-2 text-xs relative group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-neutral-400 block font-bold">{item.matchName}</span>
                  <span className="font-semibold text-bet-gold block">{item.predictionText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                    {item.odds.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.matchId)}
                    className="text-neutral-500 hover:text-bet-red transition"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Calculator Accumulator stats */}
      {slipItems.length > 0 && (
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-3.5 text-xs">
          <div className="flex justify-between items-center text-neutral-400">
            <span>Selections Total:</span>
            <span className="font-mono font-bold text-white">{slipItems.length} games</span>
          </div>
          <div className="flex justify-between items-center text-neutral-400">
            <span>Accumulated Odds:</span>
            <span className="font-mono font-extrabold text-bet-green-bright text-sm">
              {totalOdds.toFixed(2)}x
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-850 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-neutral-400">Stake Capital (₦):</label>
              <input
                type="number"
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                min="50"
                className="w-24 bg-neutral-900 border border-neutral-800 focus:border-bet-green-medium focus:outline-none rounded px-2 py-1 text-right font-mono text-white text-xs"
              />
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-neutral-400 font-bold">Potential Return:</span>
              <span className="font-mono font-black text-bet-gold text-sm">
                ₦{potentialPayout.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-850 p-2.5 rounded-lg flex items-start gap-1.5 text-[10px] text-neutral-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-bet-gold shrink-0 mt-0.5" />
            <span>{getSarcasticRemark(totalOdds)}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-bet-red/10 border border-bet-red/30 p-3 rounded-xl text-xs text-bet-red flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Place Bet Button */}
      {slipItems.length > 0 && (
        <button
          onClick={handlePlaceBet}
          disabled={isPlacing}
          className="w-full bg-bet-green-medium hover:bg-bet-green-bright hover:text-black text-white font-extrabold py-3.5 rounded-xl transition duration-150 active:scale-95 text-sm uppercase font-sans flex items-center justify-center gap-2 shadow-lg shadow-bet-green-medium/10"
        >
          {isPlacing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Locking odds with bookie...
            </>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              Place Speculative Bet
            </>
          )}
        </button>
      )}

      {/* Bets logs list */}
      <div className="border-t border-neutral-850 pt-4 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider uppercase block">
          Ticket History ({activeBets.length})
        </span>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activeBets.length === 0 ? (
            <span className="text-[10px] text-neutral-500 font-mono italic block py-4 text-center">
              No tickets submitted in this session.
            </span>
          ) : (
            activeBets.map((bet) => (
              <div
                key={bet.id}
                onClick={() => onSelectBet(bet)}
                className="bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-[10px] font-mono space-y-1.5 cursor-pointer hover:bg-neutral-900/80 hover:border-neutral-750 transition active:scale-[0.98] group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 group-hover:text-neutral-300 transition">ID: #{bet.id.substring(0, 6)}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                    bet.status === 'WON'
                      ? 'bg-bet-green-dark text-bet-green-bright border border-bet-green-medium/30'
                      : bet.status === 'LOST'
                      ? 'bg-bet-red/10 text-bet-red border border-bet-red/20'
                      : 'bg-neutral-900 text-bet-gold border border-bet-gold/20 animate-pulse'
                  }`}>
                    {bet.status === 'WON' ? '🎉 Miracle Win!' : bet.status === 'LOST' ? '✂️ Cut by 1' : '🕒 Breeding...'}
                  </span>
                </div>

                <div className="flex justify-between items-center font-semibold text-neutral-300">
                  <span>Stake: ₦{bet.stake.toLocaleString()}</span>
                  <span className="text-bet-gold">Return: ₦{bet.potentialPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>

                <div className="text-[9px] text-neutral-500 border-t border-neutral-900 pt-1 flex justify-between">
                  <span>Selections: {bet.slip.length} games</span>
                  <span>{bet.placedAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
