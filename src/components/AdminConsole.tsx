import React, { useState } from 'react';
import { ActiveBet, Match, FinancialStats, BetSlipItem } from '../types';
import { ShieldCheck, Coins, RefreshCw, Trophy, Sparkles, Check, Trash2, ArrowUpRight, TrendingUp, AlertOctagon } from 'lucide-react';

interface AdminConsoleProps {
  activeBets: ActiveBet[];
  matches: Match[];
  stats: FinancialStats;
  onUpdateBets: (updatedBets: ActiveBet[]) => void;
  onUpdateMatches: (updatedMatches: Match[]) => void;
  onUpdateStats: (updatedStats: FinancialStats) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  activeBets,
  matches,
  stats,
  onUpdateBets,
  onUpdateMatches,
  onUpdateStats,
}) => {
  const [selectedBetId, setSelectedBetId] = useState<string>('');
  const [customStake, setCustomStake] = useState<string>('');
  const [customPayout, setCustomPayout] = useState<string>('');
  const [customStatus, setCustomStatus] = useState<'PENDING' | 'WON' | 'LOST' | ''>('');

  const [rigBalanceValue, setRigBalanceValue] = useState<string>('500000');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [matchHomeScore, setMatchHomeScore] = useState<string>('0');
  const [matchAwayScore, setMatchAwayScore] = useState<string>('0');

  const selectedBet = activeBets.find((b) => b.id === selectedBetId);
  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  // Load selected bet values into edit inputs
  const handleSelectBetToEdit = (betId: string) => {
    setSelectedBetId(betId);
    const bet = activeBets.find((b) => b.id === betId);
    if (bet) {
      setCustomStake(bet.stake.toString());
      setCustomPayout(bet.potentialPayout.toString());
      setCustomStatus(bet.status);
    }
  };

  // Save changes to the selected bet
  const handleSaveChangesToBet = () => {
    if (!selectedBet) return;

    const updatedBets = activeBets.map((b) => {
      if (b.id === selectedBetId) {
        const newStake = parseFloat(customStake) || b.stake;
        const newPayout = parseFloat(customPayout) || b.potentialPayout;
        const newStatus = (customStatus as 'PENDING' | 'WON' | 'LOST') || b.status;

        // Financial adjustments if the status is changing in this transaction
        if (newStatus !== b.status) {
          let balanceDiff = 0;
          let wonDiff = 0;
          let lostDiff = 0;
          let houseWinsDiff = 0;

          // If changing FROM something TO something else, reverse old state first
          if (b.status === 'WON') {
            balanceDiff -= b.potentialPayout;
            wonDiff -= b.potentialPayout;
          } else if (b.status === 'LOST') {
            lostDiff -= b.stake;
            houseWinsDiff -= b.stake;
          }

          // Apply new state financial adjustments
          if (newStatus === 'WON') {
            balanceDiff += newPayout;
            wonDiff += newPayout;
          } else if (newStatus === 'LOST') {
            lostDiff += newStake;
            houseWinsDiff += newStake;
          }

          onUpdateStats({
            ...stats,
            balance: Math.max(0, stats.balance + balanceDiff),
            totalBetWon: Math.max(0, stats.totalBetWon + wonDiff),
            totalBetLost: Math.max(0, stats.totalBetLost + lostDiff),
            houseWins: Math.max(0, stats.houseWins + houseWinsDiff),
          });
        }

        return {
          ...b,
          stake: newStake,
          potentialPayout: newPayout,
          status: newStatus,
        };
      }
      return b;
    });

    onUpdateBets(updatedBets);
    alert(`⚡ Admin Override Applied: Ticket #${selectedBetId.substring(0, 6)} successfully updated!`);
  };

  // Void/Delete a bet placed
  const handleVoidBet = (betId: string) => {
    const bet = activeBets.find((b) => b.id === betId);
    if (!bet) return;

    // Refund stake capital if the bet was pending or lost
    let balanceRefund = 0;
    if (bet.status === 'PENDING') {
      balanceRefund = bet.stake;
    } else if (bet.status === 'LOST') {
      balanceRefund = bet.stake;
    }

    const filtered = activeBets.filter((b) => b.id !== betId);
    onUpdateBets(filtered);

    onUpdateStats({
      ...stats,
      balance: stats.balance + balanceRefund,
      totalBetStake: Math.max(0, stats.totalBetStake - bet.stake),
      totalBetLost: bet.status === 'LOST' ? Math.max(0, stats.totalBetLost - bet.stake) : stats.totalBetLost,
      houseWins: bet.status === 'LOST' ? Math.max(0, stats.houseWins - bet.stake) : stats.houseWins,
    });

    setSelectedBetId('');
    alert(`🗑️ Admin Override: Ticket #${betId.substring(0, 6)} has been declared void. Stake refunded.`);
  };

  // Direct balance rigging
  const handleRigBalance = (action: 'ADD' | 'SET' | 'WIPE') => {
    let newBalance = stats.balance;
    const value = parseFloat(rigBalanceValue) || 0;

    if (action === 'ADD') {
      newBalance += value;
    } else if (action === 'SET') {
      newBalance = value;
    } else if (action === 'WIPE') {
      newBalance = 0;
    }

    onUpdateStats({
      ...stats,
      balance: newBalance,
      totalDeposited: action === 'ADD' ? stats.totalDeposited + value : stats.totalDeposited,
    });

    alert(`💰 Alhaji Balance Rigged to: ₦${newBalance.toLocaleString()}`);
  };

  // Direct match rigging
  const handleLoadMatchToEdit = (matchId: string) => {
    setSelectedMatchId(matchId);
    const m = matches.find((match) => match.id === matchId);
    if (m) {
      setMatchHomeScore(m.score.home.toString());
      setMatchAwayScore(m.score.away.toString());
    }
  };

  const handleApplyRigMatch = () => {
    if (!selectedMatch) return;

    const hScore = parseInt(matchHomeScore) || 0;
    const aScore = parseInt(matchAwayScore) || 0;

    const updated = matches.map((m) => {
      if (m.id === selectedMatchId) {
        return {
          ...m,
          status: 'FINISHED' as const,
          score: { home: hScore, away: aScore },
          events: [
            ...m.events,
            `⚠️ Alhaji Backroom Override: Match forcibly settled by executive order. Score set to ${hScore}-${aScore}.`
          ]
        };
      }
      return m;
    });

    onUpdateMatches(updated);
    alert(`⚽ Executive Order: Match ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam} forcibly completed at score ${hScore}-${aScore}!`);
  };

  return (
    <div id="admin-console" className="bg-neutral-900 border border-bet-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Visual background tint */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-bet-gold/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-bet-gold/10 border border-bet-gold/40 text-bet-gold rounded-xl animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-white flex items-center gap-2">
              Alhaji's Backroom Rig Console
              <span className="text-[10px] bg-bet-gold text-black px-2 py-0.5 rounded font-mono font-bold">Admin Mode</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Modify tickets on the fly, adjust live match results, or print money. Uncontrolled bookie authority.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Module 1: Edit Placed Bets (6 columns) */}
        <div className="lg:col-span-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-neutral-900 pb-2">
            <Coins className="w-4 h-4 text-bet-gold" />
            Manipulate Placed Tickets
          </h3>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5">Select Ticket to edit</label>
            <select
              value={selectedBetId}
              onChange={(e) => handleSelectBetToEdit(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-bet-gold font-mono"
            >
              <option value="">-- Placed Tickets List --</option>
              {activeBets.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.id.substring(0, 6)} - Stake: ₦{b.stake} | Status: {b.status}
                </option>
              ))}
            </select>
          </div>

          {selectedBet ? (
            <div className="space-y-4 p-4 bg-neutral-900/40 rounded-lg border border-neutral-850">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Edit Stake (₦)</label>
                  <input
                    type="number"
                    value={customStake}
                    onChange={(e) => setCustomStake(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Edit Payout (₦)</label>
                  <input
                    type="number"
                    value={customPayout}
                    onChange={(e) => setCustomPayout(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Override Status</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['PENDING', 'WON', 'LOST'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setCustomStatus(st)}
                      className={`py-1.5 rounded text-[10px] font-mono font-bold transition ${
                        customStatus === st
                          ? st === 'WON'
                            ? 'bg-bet-green-bright text-black'
                            : st === 'LOST'
                            ? 'bg-bet-red text-white'
                            : 'bg-bet-gold text-black'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-850'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={handleSaveChangesToBet}
                  className="flex-1 bg-bet-gold text-black font-extrabold py-2 rounded text-xs hover:bg-yellow-400 transition"
                >
                  Save Modifications
                </button>
                <button
                  type="button"
                  onClick={() => handleVoidBet(selectedBet.id)}
                  className="bg-bet-red/20 hover:bg-bet-red/30 text-bet-red font-bold px-3 rounded text-xs transition flex items-center gap-1 border border-bet-red/40"
                  title="Refund Stake & Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Void
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-neutral-500 font-mono italic">
              No ticket selected. Click one in the list to start manipulating.
            </div>
          )}
        </div>

        {/* Module 2: Rig Live Match Scores (6 columns) */}
        <div className="lg:col-span-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800 space-y-4 font-mono">
          <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-neutral-900 pb-2">
            <Trophy className="w-4 h-4 text-bet-green-bright" />
            Cheating & Score Rigging
          </h3>

          <div>
            <label className="text-[10px] text-neutral-400 uppercase block mb-1.5">Select Match to rig</label>
            <select
              value={selectedMatchId}
              onChange={(e) => handleLoadMatchToEdit(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-bet-green-bright font-mono"
            >
              <option value="">-- Active Soccer Fixtures --</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.homeTeam} vs {m.awayTeam} (Current: {m.score.home}-{m.score.away})
                </option>
              ))}
            </select>
          </div>

          {selectedMatch ? (
            <div className="space-y-4 p-4 bg-neutral-900/40 rounded-lg border border-neutral-850 text-xs text-neutral-300">
              <span className="font-bold text-white block text-center pb-1 border-b border-neutral-850">
                {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </span>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 block truncate">{selectedMatch.homeTeam} Score</span>
                  <input
                    type="number"
                    value={matchHomeScore}
                    onChange={(e) => setMatchHomeScore(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded p-2 text-white text-center font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 block truncate">{selectedMatch.awayTeam} Score</span>
                  <input
                    type="number"
                    value={matchAwayScore}
                    onChange={(e) => setMatchAwayScore(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded p-2 text-white text-center font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyRigMatch}
                className="w-full bg-bet-green-medium hover:bg-bet-green-bright text-white hover:text-black font-extrabold py-2.5 rounded text-xs transition"
              >
                Force Settle Match Immediately!
              </button>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-neutral-500 italic">
              Select an active fixture to edit scores on the fly.
            </div>
          )}
        </div>
      </div>

      {/* Financial Wallet Injection */}
      <div className="mt-6 pt-5 border-t border-neutral-800 bg-neutral-950/40 p-4 rounded-xl border border-neutral-850 space-y-4">
        <h4 className="font-display font-extrabold text-sm text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-bet-gold" />
          Virtual Treasury Overrides (Bank of Alhaji)
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="text-[9px] font-mono text-neutral-400 uppercase block mb-1.5">Naira Quantity</label>
            <input
              type="number"
              value={rigBalanceValue}
              onChange={(e) => setRigBalanceValue(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2.5 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto shrink-0 pt-5">
            <button
              onClick={() => handleRigBalance('ADD')}
              className="bg-bet-green-medium hover:bg-bet-green-bright text-white hover:text-black font-bold px-4 py-2.5 rounded text-xs transition font-mono"
            >
              Inject ₦
            </button>
            <button
              onClick={() => handleRigBalance('SET')}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold px-4 py-2.5 rounded text-xs transition font-mono border border-neutral-700"
            >
              Set exact
            </button>
            <button
              onClick={() => handleRigBalance('WIPE')}
              className="bg-bet-red hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded text-xs transition font-mono"
            >
              Drain Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Safety Warnings block */}
      <div className="mt-4 bg-bet-red/5 border border-bet-red/20 rounded-lg p-3.5 flex gap-2 text-[10px] text-neutral-400 font-mono">
        <AlertOctagon className="w-4 h-4 text-bet-red shrink-0" />
        <div>
          <span className="font-bold text-bet-red block uppercase mb-0.5">Lagos Central Bank Notice:</span>
          These features manipulate direct React states and persist directly. Any modifications to finished tickets or active soccer legs will instantly re-adjust user payouts and mock house wins. Use your power wisely!
        </div>
      </div>
    </div>
  );
};
