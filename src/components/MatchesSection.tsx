import React from 'react';
import { Match, BetSlipItem } from '../types';
import { Activity, Trophy, Play, Check, ShieldAlert } from 'lucide-react';

interface MatchesSectionProps {
  matches: Match[];
  slipItems: BetSlipItem[];
  onToggleOdds: (match: Match, betType: 'HOME' | 'DRAW' | 'AWAY', odds: number) => void;
  isSimulating: boolean;
  onTriggerSimulation: () => void;
}

export const MatchesSection: React.FC<MatchesSectionProps> = ({
  matches,
  slipItems,
  onToggleOdds,
  isSimulating,
  onTriggerSimulation,
}) => {
  const categories = Array.from(new Set(matches.map((m) => m.category)));

  const getSelectionForItem = (matchId: string, betType: 'HOME' | 'DRAW' | 'AWAY') => {
    return slipItems.some((item) => item.matchId === matchId && item.betType === betType);
  };

  const getSarcasticEvent = (events: string[]) => {
    if (events.length === 0) return "Match kicks off soon. Native doctors are currently praying on the field.";
    return events[events.length - 1];
  };

  return (
    <div id="matches-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            <Trophy className="text-bet-gold w-6 h-6" />
            Naija League Specu-Odds
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Odds are heavily dynamic and guaranteed to shift seconds before your bet is placed.
          </p>
        </div>

        {/* Start matches button */}
        <button
          id="btn-simulate-ticker"
          onClick={onTriggerSimulation}
          disabled={isSimulating}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95 border ${
            isSimulating
              ? 'bg-bet-green-dark border-bet-green-bright/30 text-bet-green-bright animate-pulse cursor-default'
              : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          {isSimulating ? 'Simulating Matches Live...' : 'Trigger Simulation Cycle'}
        </button>
      </div>

      {/* Live Match Commentary Banner */}
      {isSimulating && (
        <div className="mb-6 bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
          <span className="relative flex h-3 w-3 mt-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bet-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-bet-red"></span>
          </span>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Live Alhaji Specu-Radio Highlights</span>
            <p className="text-sm font-mono text-bet-green-bright">
              {matches.some((m) => m.status === 'LIVE')
                ? getSarcasticEvent(matches.flatMap((m) => m.events))
                : 'Evaluating match states. Live bets locking soon...'}
            </p>
          </div>
        </div>
      )}

      {/* Categories & Fixtures */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const catMatches = matches.filter((m) => m.category === cat);
          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase border-l-2 border-bet-green-medium pl-2.5">
                {cat}
              </h3>

              <div className="space-y-3">
                {catMatches.map((match) => {
                  return (
                    <div
                      key={match.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:border-neutral-700 transition duration-150"
                    >
                      {/* Left: Match State & Teams */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {match.status === 'LIVE' ? (
                            <span className="bg-bet-red text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white flex items-center gap-1">
                              <Activity className="w-3 h-3 animate-pulse" />
                              LIVE {match.minute}'
                            </span>
                          ) : match.status === 'FINISHED' ? (
                            <span className="bg-neutral-850 text-neutral-500 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-neutral-800">
                              FT
                            </span>
                          ) : (
                            <span className="bg-neutral-800 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded">
                              UPCOMING
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-neutral-500">Match ID: #{match.id}</span>
                        </div>

                        <div className="flex items-center justify-between md:justify-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{match.homeTeam}</span>
                              {match.status !== 'UPCOMING' && (
                                <span className="font-mono text-sm text-bet-gold font-bold">{match.score.home}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{match.awayTeam}</span>
                              {match.status !== 'UPCOMING' && (
                                <span className="font-mono text-sm text-bet-gold font-bold">{match.score.away}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Odds Selection Grid */}
                      <div className="grid grid-cols-3 gap-2 w-full md:w-80">
                        {/* 1: Home odds */}
                        <button
                          onClick={() => onToggleOdds(match, 'HOME', match.homeOdds)}
                          disabled={match.status === 'FINISHED'}
                          className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg font-mono transition border duration-150 ${
                            match.status === 'FINISHED'
                              ? 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed'
                              : getSelectionForItem(match.id, 'HOME')
                              ? 'bg-bet-green-bright text-black font-extrabold border-bet-green-bright'
                              : 'bg-neutral-900 border-neutral-800 text-white hover:border-bet-green-medium hover:bg-neutral-850'
                          }`}
                        >
                          <span className="text-[10px] text-neutral-500 font-sans block mb-0.5 font-semibold uppercase">1</span>
                          <span className="text-sm font-bold flex items-center gap-0.5">
                            {match.homeOdds.toFixed(2)}
                            {getSelectionForItem(match.id, 'HOME') && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </button>

                        {/* X: Draw odds */}
                        <button
                          onClick={() => onToggleOdds(match, 'DRAW', match.drawOdds)}
                          disabled={match.status === 'FINISHED'}
                          className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg font-mono transition border duration-150 ${
                            match.status === 'FINISHED'
                              ? 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed'
                              : getSelectionForItem(match.id, 'DRAW')
                              ? 'bg-bet-green-bright text-black font-extrabold border-bet-green-bright'
                              : 'bg-neutral-900 border-neutral-800 text-white hover:border-bet-green-medium hover:bg-neutral-850'
                          }`}
                        >
                          <span className="text-[10px] text-neutral-500 font-sans block mb-0.5 font-semibold uppercase">X</span>
                          <span className="text-sm font-bold flex items-center gap-0.5">
                            {match.drawOdds.toFixed(2)}
                            {getSelectionForItem(match.id, 'DRAW') && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </button>

                        {/* 2: Away odds */}
                        <button
                          onClick={() => onToggleOdds(match, 'AWAY', match.awayOdds)}
                          disabled={match.status === 'FINISHED'}
                          className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg font-mono transition border duration-150 ${
                            match.status === 'FINISHED'
                              ? 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed'
                              : getSelectionForItem(match.id, 'AWAY')
                              ? 'bg-bet-green-bright text-black font-extrabold border-bet-green-bright'
                              : 'bg-neutral-900 border-neutral-800 text-white hover:border-bet-green-medium hover:bg-neutral-850'
                          }`}
                        >
                          <span className="text-[10px] text-neutral-500 font-sans block mb-0.5 font-semibold uppercase">2</span>
                          <span className="text-sm font-bold flex items-center gap-0.5">
                            {match.awayOdds.toFixed(2)}
                            {getSelectionForItem(match.id, 'AWAY') && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
