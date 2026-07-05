export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  status: MatchStatus;
  score: { home: number; away: number };
  minute: number;
  category: string;
  events: string[];
}

export interface BetSlipItem {
  matchId: string;
  matchName: string;
  betType: 'HOME' | 'DRAW' | 'AWAY';
  odds: number;
  predictionText: string;
}

export type BetStatus = 'PENDING' | 'WON' | 'LOST';

export interface ActiveBet {
  id: string;
  slip: BetSlipItem[];
  stake: number;
  potentialPayout: number;
  status: BetStatus;
  placedAt: string;
}

export interface InvestmentProduct {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  history: { time: string; price: number }[];
  riskLevel: 'MODERATE' | 'EXTREME' | 'PONZI-SCHEME' | 'APOCALYPTIC';
  yieldRate: string;
  minInvestment: number;
  ownedQuantity: number;
  avgBuyPrice: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FinancialStats {
  balance: number; // in virtual Naira (₦)
  totalDeposited: number;
  totalWithdrawn: number;
  totalBetStake: number;
  totalBetWon: number;
  totalBetLost: number;
  totalInvested: number;
  totalInvestmentValue: number;
  houseWins: number; // amount of user's money pocketed by house
}
