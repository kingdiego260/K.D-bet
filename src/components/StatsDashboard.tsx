import React, { useState } from 'react';
import { FinancialStats } from '../types';
import { Wallet, ArrowUpRight, ArrowDownRight, Sparkles, TrendingDown, HelpCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsDashboardProps {
  stats: FinancialStats;
  onDeposit: (amount: number, description: string) => void;
  onWithdraw: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, onDeposit, onWithdraw }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const depositOptions = [
    { amount: 2000, label: 'Urgent 2k Quick Loan', desc: 'High interest, but we need stake capital abeg' },
    { amount: 10000, label: 'Tech Bro Weekend Fuel', desc: 'Money meant for pizza but odds are better' },
    { amount: 50000, label: 'Landlord\'s House Rent', desc: 'Double it before Monday! Landlord can wait' },
    { amount: 500000, label: 'Sell Uncle\'s Land in Lekki', desc: 'Absolute high roller. Uncle won\'t discover soon' },
  ];

  const handleWithdrawClick = () => {
    setIsWithdrawing(true);
    setWithdrawError(null);
    setShowWithdrawModal(true);

    const excuses = [
      "Network Timeout: Central Bank of Nigeria server is currently taking a fufu break.",
      "BVN Mismatch: Your face does not match the billionaire status of your mock balance.",
      "Uncle\'s Alert: Your Uncle in Lekki has discovered his land was sold. Transaction frozen!",
      "Alhaji\'s Rest: Alhaji is currently sleeping. No withdrawals allowed until he approves at 3:15 AM.",
      "Liquidity Vault Lock: To withdraw, you must first complete a 25-odds accumulator win to verify your financial status.",
      "Bookie Fee: Standard 105% withdrawal processing fee applies. Deposit more to cover the fee."
    ];

    setTimeout(() => {
      setIsWithdrawing(false);
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setWithdrawError(randomExcuse);
    }, 1800);
  };

  return (
    <div id="stats-dashboard" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Main balance display */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block mb-1">Your Virtual Capital</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-extrabold text-white">
              ₦{stats.balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs bg-bet-green-dark text-bet-green-bright font-mono px-2 py-0.5 rounded-full border border-bet-green-medium/30">
              Mock Naira
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-bet-gold" />
            100% simulated platform. Real financial loss is simulated; real entertainment is guaranteed.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex gap-3">
          <button
            id="btn-deposit-trigger"
            onClick={() => setShowDepositModal(true)}
            className="flex-1 md:flex-none bg-bet-green-medium hover:bg-bet-green-bright hover:text-black text-white font-semibold px-6 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-bet-green-medium/20 active:scale-95"
          >
            <ArrowUpRight className="w-5 h-5" />
            Mock Deposit
          </button>
          <button
            id="btn-withdraw-trigger"
            onClick={handleWithdrawClick}
            className="flex-1 md:flex-none bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-6 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 border border-neutral-700 active:scale-95"
          >
            <ArrowDownRight className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800 relative z-10">
        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-0.5">Deposited Capital</span>
          <span className="text-base font-bold text-neutral-300">₦{stats.totalDeposited.toLocaleString()}</span>
        </div>
        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-0.5">Total Betting Stakes</span>
          <span className="text-base font-bold text-neutral-300">₦{stats.totalBetStake.toLocaleString()}</span>
        </div>
        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-0.5">Bookie Donations (Lost)</span>
          <span className="text-base font-bold text-bet-red flex items-center gap-1">
            ₦{stats.totalBetLost.toLocaleString()}
            <TrendingDown className="w-4.5 h-4.5 shrink-0" />
          </span>
        </div>
        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-0.5">House Net Profit</span>
          <span className="text-base font-bold text-bet-gold flex items-center gap-1">
            ₦{stats.houseWins.toLocaleString()}
            <Sparkles className="w-3.5 h-3.5 text-bet-gold animate-pulse shrink-0" />
          </span>
        </div>
      </div>

      {/* Sarcastic Sanity Check Bar */}
      <div className="mt-5 pt-3 border-t border-neutral-800/50 flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-400 flex items-center gap-1">
            Financial Sanity Rating:
          </span>
          <span className={`font-mono font-bold ${
            stats.houseWins > 500000 ? 'text-bet-red' : stats.houseWins > 100000 ? 'text-bet-gold' : 'text-bet-green-bright'
          }`}>
            {stats.houseWins > 500000 ? 'ALHAJI\'S DELIGHT (CRITICAL)' : stats.houseWins > 100000 ? 'CUT-ONE-GAME SURVIVOR' : 'SPARKING CAPITALIST'}
          </span>
        </div>
        <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              stats.houseWins > 500000 ? 'bg-bet-red' : stats.houseWins > 100000 ? 'bg-bet-gold' : 'bg-bet-green-bright'
            }`}
            style={{ width: `${Math.max(10, Math.min(100, 100 - (stats.houseWins / (stats.totalDeposited || 1)) * 100))}%` }}
          />
        </div>
      </div>

      {/* Mock Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-bet-green-bright" />
                  <h3 className="font-display font-bold text-lg text-white">Select Fake Capital Option</h3>
                </div>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-neutral-400 hover:text-white font-mono text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-neutral-400">
                  Select how you want to fund your speculative wallet. No real credit card required, but the thrill of using 'Uncle's Land' is fully operational.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {depositOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        onDeposit(opt.amount, opt.label);
                        setShowDepositModal(false);
                      }}
                      className="text-left bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-bet-green-medium/50 p-4 rounded-xl transition duration-150 flex justify-between items-center group"
                    >
                      <div>
                        <span className="font-bold text-white block group-hover:text-bet-green-bright transition">{opt.label}</span>
                        <span className="text-xs text-neutral-500 block mt-0.5">{opt.desc}</span>
                      </div>
                      <span className="text-lg font-mono font-extrabold text-white bg-neutral-900 px-3 py-1 rounded-lg group-hover:bg-bet-green-dark group-hover:text-bet-green-bright transition">
                        +₦{opt.amount.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock Withdraw Roadblock Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-bet-red/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-bet-red" />
                  <h3 className="font-display font-bold text-lg text-white">Withdrawal Blocked!</h3>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-neutral-400 hover:text-white font-mono text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                {isWithdrawing ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bet-green-bright" />
                    <span className="text-sm font-mono text-neutral-400">Querying Central Bank API & Alhaji's conscience...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-bet-red/10 border border-bet-red/30 text-bet-red rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-white text-base">"Alhaji Says No!"</h4>
                    <p className="text-sm text-neutral-300 font-mono bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left">
                      {withdrawError}
                    </p>
                    <p className="text-xs text-neutral-500 italic">
                      "In NaijaBet, the house keeps the wins. That is why it is called an investment in the entertainment ecosystem!"
                    </p>
                    <button
                      onClick={() => setShowWithdrawModal(false)}
                      className="w-full bg-bet-red/20 hover:bg-bet-red/30 border border-bet-red/40 text-white font-semibold py-3 rounded-xl mt-2 transition duration-150"
                    >
                      Accept Loss & Continue Betting
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
