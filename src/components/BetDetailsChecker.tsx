import React, { useState } from 'react';
import { ActiveBet, Match } from '../types';
import { Ticket, Search, CheckCircle, XCircle, AlertCircle, Clock, Sparkles } from 'lucide-react';

interface BetDetailsCheckerProps {
  activeBets: ActiveBet[];
  matches: Match[];
  onSelectBet?: (bet: ActiveBet) => void;
  selectedBet: ActiveBet | null;
  onClose: () => void;
}

export const BetDetailsChecker: React.FC<BetDetailsCheckerProps> = ({
  activeBets,
  matches,
  onSelectBet,
  selectedBet,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    const cleanQuery = searchQuery.trim().toUpperCase();
    if (!cleanQuery) {
      setSearchError("Chairman, type a valid Ticket ID!");
      return;
    }

    // Try to find exact match or close match
    const found = activeBets.find(
      (b) => b.id.toUpperCase() === cleanQuery || b.id.toUpperCase().includes(cleanQuery)
    );

    if (found) {
      if (onSelectBet) {
        onSelectBet(found);
      }
    } else {
      setSearchError("Ticket not found! Did Alhaji eat this receipt? Double check the ID.");
    }
  };

  // Helper to resolve match status for each slip leg
  const getLegStatus = (matchId: string, predicted: 'HOME' | 'DRAW' | 'AWAY') => {
    // Check if the match is currently running in our active matches or was finished
    const m = matches.find((match) => match.id === matchId);
    if (!m) return { text: 'Leg Settled', color: 'text-neutral-500', isMatchWon: false, isPending: false };

    if (m.status === 'UPCOMING') {
      return {
        text: 'Upcoming • Match not started',
        color: 'text-neutral-400 font-mono',
        isMatchWon: false,
        isPending: true,
        scoreText: '0-0'
      };
    }

    // Determine actual winner
    let actual: 'HOME' | 'DRAW' | 'AWAY' = 'DRAW';
    if (m.score.home > m.score.away) actual = 'HOME';
    else if (m.score.away > m.score.home) actual = 'AWAY';

    const isMatchWon = predicted === actual;
    const scoreText = `${m.score.home}-${m.score.away}`;

    if (m.status === 'LIVE') {
      return {
        text: `Live ${m.minute}' • Score: ${scoreText} (${isMatchWon ? 'Currently winning!' : 'Leg losing'})`,
        color: isMatchWon ? 'text-bet-green-bright' : 'text-bet-red',
        isMatchWon,
        isPending: true,
        scoreText
      };
    }

    // Finished
    return {
      text: `Finished • Final: ${scoreText} (${isMatchWon ? 'Leg Won!' : 'Leg Cut'})`,
      color: isMatchWon ? 'text-bet-green-bright' : 'text-bet-red',
      isMatchWon,
      isPending: false,
      scoreText
    };
  };

  return (
    <div id="bet-details-checker" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-bet-gold" />
          <h2 className="font-display font-extrabold text-lg text-white">Live Ticket Validator</h2>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 uppercase bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
          NaijaBet Security Node
        </span>
      </div>

      {/* Lookup Bar */}
      <form onSubmit={handleSearch} className="space-y-2">
        <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Check Any Ticket status</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g. BET-4F6X9)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-bet-green-medium focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-white uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 rounded-xl text-xs transition duration-150 flex items-center gap-1 border border-neutral-700"
          >
            Check
          </button>
        </div>
        {searchError && (
          <p className="text-xs text-bet-red font-mono flex items-center gap-1 mt-1 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {searchError}
          </p>
        )}
      </form>

      {/* Slip Display section */}
      {selectedBet ? (
        <div className="space-y-4">
          {/* Thermal Slip mockup */}
          <div className="bg-neutral-100 text-neutral-900 p-5 rounded-lg shadow-2xl relative overflow-hidden font-mono text-xs select-none border-t-8 border-dashed border-bet-green-medium">
            
            {/* Top jagged teeth visual overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,#003319_25%,transparent_25%),linear-gradient(-45deg,#003319_25%,transparent_25%)] bg-[size:8px_8px] opacity-15" />

            {/* Header thermal layout */}
            <div className="text-center space-y-1 border-b border-dashed border-neutral-400 pb-4">
              <span className="font-extrabold text-base tracking-tighter uppercase font-display block">*** NAIJABET OFFICIAL ***</span>
              <span className="text-[10px] text-neutral-600 block">LAGOS CENTRAL SPECULATIVE TERMINAL</span>
              <span className="text-[10px] text-neutral-600 block">DATE: {selectedBet.placedAt} • OPERATOR: ALHAJI BLUE</span>
              <span className="text-sm font-bold bg-neutral-900 text-white px-2.5 py-0.5 rounded inline-block mt-2 font-mono">
                ID: {selectedBet.id}
              </span>
            </div>

            {/* Selection list */}
            <div className="py-4 space-y-3.5 border-b border-dashed border-neutral-400">
              <div className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Selections Breakdown:</div>
              
              {selectedBet.slip.map((leg, idx) => {
                const resolution = getLegStatus(leg.matchId, leg.betType);
                return (
                  <div key={idx} className="space-y-1 bg-neutral-200/50 p-2 rounded border border-neutral-300">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[180px]">{leg.matchName}</span>
                      <span>@{leg.odds.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-700 font-medium">
                      <span>Predicted: {leg.predictionText}</span>
                    </div>
                    <div className="pt-1 text-[9px] border-t border-neutral-300/60 flex justify-between items-center">
                      <span className={resolution.color}>{resolution.text}</span>
                      {resolution.isPending ? (
                        <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      ) : resolution.isMatchWon ? (
                        <CheckCircle className="w-3.5 h-3.5 text-bet-green-medium shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-bet-red shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary statistics */}
            <div className="py-3 space-y-1.5 text-xs font-bold">
              <div className="flex justify-between">
                <span>TOTAL ACCUMULATED ODDS:</span>
                <span>
                  {selectedBet.slip.reduce((acc, l) => acc * l.odds, 1).toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span>STAKE CAPITAL:</span>
                <span>₦{selectedBet.stake.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-dashed border-neutral-400 pt-2 font-black">
                <span>POTENTIAL PAYOUT:</span>
                <span className="text-neutral-900">
                  ₦{selectedBet.potentialPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Stamp status overlay */}
            <div className="mt-4 pt-3 border-t border-neutral-300 flex flex-col items-center justify-center gap-1 text-center">
              <span className={`text-sm font-extrabold px-3 py-1.5 border-4 rounded-lg rotate-[-3deg] inline-block uppercase ${
                selectedBet.status === 'WON'
                  ? 'border-bet-green-medium text-bet-green-medium bg-bet-green-dark/10'
                  : selectedBet.status === 'LOST'
                  ? 'border-bet-red text-bet-red bg-bet-red/10 animate-pulse'
                  : 'border-bet-gold text-bet-gold bg-neutral-900/10'
              }`}>
                {selectedBet.status === 'WON' ? '★ WINNER - CASHOUT GRANTED ★' : selectedBet.status === 'LOST' ? '☠ TICKET LOST (CUT BY 1) ☠' : '🕒 IN PROGRESS - BREEDING'}
              </span>

              <p className="text-[9px] text-neutral-500 italic mt-2 max-w-[240px]">
                {selectedBet.status === 'WON'
                  ? '"Congratulations Chief! Buy Alhaji a hot fufu, you have conquered the bookie!"'
                  : selectedBet.status === 'LOST'
                  ? '"Ahn ahn, the standard operations of sports betting! Do not panic, top-up and rebuild."'
                  : '"Matches are active. Keep praying, native doctor is currently blowing breeze on the servers!"'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (onSelectBet) onSelectBet(null as any);
                onClose();
              }}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2.5 rounded-xl text-xs transition border border-neutral-700"
            >
              Close Receipt view
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-6 text-center text-neutral-500 space-y-2">
          <Ticket className="w-10 h-10 text-neutral-700 mx-auto" />
          <p className="text-sm">No ticket selected for live evaluation</p>
          <p className="text-[10px] font-mono">
            Click any ticket from your <strong>Ticket History</strong> below, or search its ID above to print a visual receipt!
          </p>
        </div>
      )}
    </div>
  );
};
