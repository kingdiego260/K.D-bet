import React, { useState } from 'react';
import { Match } from '../types';
import { Activity, Trophy, Clock, Calendar, CheckSquare, Search, Award, HelpCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveScoresSectionProps {
  matches: Match[];
  isSimulating: boolean;
  onTriggerSimulation: () => void;
}

export const LiveScoresSection: React.FC<LiveScoresSectionProps> = ({
  matches,
  isSimulating,
  onTriggerSimulation,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINISHED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const toggleExpandMatch = (id: string) => {
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  const filteredMatches = matches.filter((m) => {
    // Tab filter
    if (filter === 'LIVE' && m.status !== 'LIVE') return false;
    if (filter === 'UPCOMING' && m.status !== 'UPCOMING') return false;
    if (filter === 'FINISHED' && m.status !== 'FINISHED') return false;

    // Search query filter
    const query = searchQuery.toLowerCase();
    return (
      m.homeTeam.toLowerCase().includes(query) ||
      m.awayTeam.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query)
    );
  });

  // Calculate stats mock values based on match ID to keep it deterministic but fun
  const getSimulatedMatchStats = (match: Match) => {
    const charCodeSum = match.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Determine stats from match events or scores
    const homeGoals = match.score.home;
    const awayGoals = match.score.away;

    // Random but constant based on ID
    const possessionHome = 40 + (charCodeSum % 21); // between 40% and 60%
    const shotsHome = Math.max(homeGoals, 3 + (charCodeSum % 7));
    const shotsAway = Math.max(awayGoals, 2 + (charCodeSum % 8));
    const cornersHome = 1 + (charCodeSum % 6);
    const cornersAway = 2 + (charCodeSum % 5);
    const yellowHome = charCodeSum % 3;
    const yellowAway = (charCodeSum + 1) % 4;

    return {
      possessionHome,
      possessionAway: 100 - possessionHome,
      shotsHome,
      shotsAway,
      cornersHome,
      cornersAway,
      yellowHome,
      yellowAway,
    };
  };

  return (
    <div id="live-scores-container" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-5 relative">
      
      {/* Betking Style Neon Yellow Accent corner decoration */}
      <div className="absolute top-0 right-10 w-24 h-1.5 bg-bet-gold rounded-b-full shadow-[0_0_12px_rgba(255,204,0,0.4)]" />

      {/* Title Header segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            <span className="bg-bet-gold text-black p-1 rounded-md text-xs font-black animate-pulse">LIVE</span>
            Betking Specu-Scores Center
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time simulation scores. Alhaji’s backroom referees are currently calculating VAR trajectories with high house edge.
          </p>
        </div>

        {/* Quick simulator status */}
        <div className="flex items-center gap-3">
          {!isSimulating ? (
            <button
              onClick={onTriggerSimulation}
              className="px-4 py-2 bg-bet-gold hover:bg-yellow-400 text-black text-xs font-black rounded-xl transition duration-150 flex items-center gap-1.5 shadow-md shadow-yellow-950/20 active:scale-95"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Activate Live Simulation
            </button>
          ) : (
            <div className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bet-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bet-red"></span>
              </span>
              <span>Speculator Feed: Shuffling 90'</span>
            </div>
          )}
        </div>
      </div>

      {/* Search & Quick Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team, league, or Match ID..."
            className="w-full bg-neutral-950 border border-neutral-800 text-xs pl-10 pr-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-bet-gold font-mono"
          />
        </div>

        {/* Live Filter Selection tabs */}
        <div className="flex bg-neutral-950 border border-neutral-850 p-1 rounded-xl self-start gap-1">
          {(['ALL', 'LIVE', 'UPCOMING', 'FINISHED'] as const).map((t) => {
            const count = matches.filter((m) => {
              if (t === 'ALL') return true;
              if (t === 'LIVE') return m.status === 'LIVE';
              if (t === 'UPCOMING') return m.status === 'UPCOMING';
              return m.status === 'FINISHED';
            }).length;

            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition flex items-center gap-1 ${
                  filter === t
                    ? 'bg-bet-gold text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{t === 'ALL' ? 'All' : t === 'LIVE' ? '🔴 Live' : t === 'UPCOMING' ? '🕒 Upcoming' : '✔️ Finished'}</span>
                <span className={`px-1 rounded-full text-[8px] ${filter === t ? 'bg-black/15 text-black' : 'bg-neutral-900 text-neutral-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Scores Feed Grid */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-8 text-center space-y-2">
            <Calendar className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="font-display font-bold text-neutral-300 text-sm">No Matches Found</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Alhaji has currently suspended matches in this filter bracket to go and count speculative deposits. Select "All" or toggle other filters!
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const stats = getSimulatedMatchStats(match);
            const isExpanded = expandedMatchId === match.id;

            return (
              <div
                key={match.id}
                className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-750 transition"
              >
                {/* Match Row */}
                <div
                  onClick={() => toggleExpandMatch(match.id)}
                  className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  {/* Category and status badge column */}
                  <div className="flex items-center gap-3 shrink-0 sm:w-48">
                    <div>
                      <span className="text-[10px] font-mono text-bet-gold font-bold block mb-1">
                        {match.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {match.status === 'LIVE' ? (
                          <span className="bg-bet-red text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white flex items-center gap-1">
                            <Activity className="w-3 h-3 animate-pulse" />
                            {match.minute}'
                          </span>
                        ) : match.status === 'FINISHED' ? (
                          <span className="bg-neutral-850 text-neutral-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-neutral-800">
                            FINISHED (FT)
                          </span>
                        ) : (
                          <span className="bg-neutral-900 text-neutral-500 text-[9px] font-mono px-1.5 py-0.5 rounded border border-neutral-850">
                            UPCOMING
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-neutral-500 font-bold">#{match.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Teams and score displays */}
                  <div className="flex-1 flex items-center justify-between px-2 sm:px-6">
                    {/* Home Team */}
                    <div className="text-right w-1/3 min-w-0 pr-2">
                      <span className="text-xs font-extrabold text-white truncate block">{match.homeTeam}</span>
                    </div>

                    {/* Live Ticking Score Board */}
                    <div className="w-1/3 shrink-0 flex items-center justify-center gap-2">
                      {match.status === 'UPCOMING' ? (
                        <div className="bg-neutral-900 border border-neutral-850 text-neutral-500 font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold">
                          VS
                        </div>
                      ) : (
                        <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl flex items-center gap-3">
                          <span className={`font-mono font-black text-lg w-7 text-center ${match.status === 'LIVE' ? 'text-bet-gold' : 'text-neutral-400'}`}>
                            {match.score.home}
                          </span>
                          <span className="text-neutral-600 font-bold text-xs">-</span>
                          <span className={`font-mono font-black text-lg w-7 text-center ${match.status === 'LIVE' ? 'text-bet-gold' : 'text-neutral-400'}`}>
                            {match.score.away}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="text-left w-1/3 min-w-0 pl-2">
                      <span className="text-xs font-extrabold text-white truncate block">{match.awayTeam}</span>
                    </div>
                  </div>

                  {/* Toggle stats chevron */}
                  <div className="hidden sm:flex items-center pr-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>
                </div>

                {/* Collapsible Stats & Events Commentary Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-neutral-850/60 overflow-hidden bg-[#0a0f0c]/60"
                    >
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        
                        {/* Simulated Team Stats bars */}
                        <div className="space-y-3.5 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850">
                          <h4 className="text-[10px] font-mono text-bet-gold font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            Tactical Match Stats
                          </h4>

                          {/* Possession */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono font-bold">
                              <span>{stats.possessionHome}% Possession</span>
                              <span>{stats.possessionAway}%</span>
                            </div>
                            <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden flex">
                              <div style={{ width: `${stats.possessionHome}%` }} className="bg-bet-gold h-full" />
                              <div style={{ width: `${stats.possessionAway}%` }} className="bg-neutral-800 h-full" />
                            </div>
                          </div>

                          {/* Shots on Goal */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono font-bold">
                              <span>{stats.shotsHome} Shots (On Target)</span>
                              <span>{stats.shotsAway}</span>
                            </div>
                            <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden flex">
                              <div style={{ width: `${(stats.shotsHome / (stats.shotsHome + stats.shotsAway)) * 100}%` }} className="bg-bet-green-bright h-full" />
                              <div style={{ width: `${(stats.shotsAway / (stats.shotsHome + stats.shotsAway)) * 100}%` }} className="bg-neutral-800 h-full" />
                            </div>
                          </div>

                          {/* Corners & Yellow Cards summary */}
                          <div className="grid grid-cols-2 gap-4 pt-1">
                            <div className="bg-neutral-950 border border-neutral-850/50 p-2.5 rounded-lg text-center font-mono">
                              <span className="text-[9px] text-neutral-500 uppercase block">Corners (H/A)</span>
                              <strong className="text-xs text-white block mt-0.5">{stats.cornersHome} - {stats.cornersAway}</strong>
                            </div>
                            <div className="bg-neutral-950 border border-neutral-850/50 p-2.5 rounded-lg text-center font-mono">
                              <span className="text-[9px] text-neutral-500 uppercase block">Yellow Cards (H/A)</span>
                              <strong className="text-xs text-red-400 block mt-0.5">{stats.yellowHome} - {stats.yellowAway}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Alhaji Live Specu-Commentary events list */}
                        <div className="space-y-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 flex flex-col h-full justify-between">
                          <h4 className="text-[10px] font-mono text-bet-gold font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Live Ticker Commentary
                          </h4>

                          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 font-mono text-[11px] leading-relaxed flex-1">
                            {match.events.length === 0 ? (
                              <p className="text-neutral-500 italic py-4 text-center">
                                No commentary yet. Match kicks off when Alhaji places his speculative accumulator tickets.
                              </p>
                            ) : (
                              match.events.map((evt, idx) => (
                                <div key={idx} className="flex gap-2.5 pb-2 border-b border-neutral-850/40 last:border-0 last:pb-0">
                                  <span className="text-bet-gold font-black shrink-0">⚽</span>
                                  <p className="text-neutral-300">{evt}</p>
                                </div>
                              ))
                            ).reverse()} {/* reverse so latest events show on top in expanded details */}
                          </div>

                          {/* Funny house bias advice footer for specific matches */}
                          {match.status === 'LIVE' && (
                            <div className="flex items-center gap-2 bg-yellow-500/5 px-2.5 py-1.5 rounded-lg border border-yellow-500/10 text-[9px] text-neutral-400 mt-1">
                              <AlertCircle className="w-3.5 h-3.5 text-bet-gold shrink-0" />
                              <span>Baba Blue reports referee was spotted drinking palm wine with home team owner. Odds are locking.</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
