import { useState, useEffect } from 'react';
import { Match, BetSlipItem, ActiveBet, InvestmentProduct, ChatMessage, FinancialStats } from './types';
import { StatsDashboard } from './components/StatsDashboard';
import { MatchesSection } from './components/MatchesSection';
import { InvestmentSection } from './components/InvestmentSection';
import { BetSlipSection } from './components/BetSlipSection';
import { GuruChatSection } from './components/GuruChatSection';
import { BetDetailsChecker } from './components/BetDetailsChecker';
import { AdminConsole } from './components/AdminConsole';
import { CasinoGamesSection } from './components/CasinoGamesSection';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthPanel, UserAccount } from './components/AuthPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { LiveScoresSection } from './components/LiveScoresSection';
import { Trophy, Coins, MessageSquare, AlertCircle, Sparkles, TrendingUp, HelpCircle, Receipt, ShieldCheck, Flame } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

// Starting investment items
const INITIAL_PRODUCTS: InvestmentProduct[] = [
  {
    id: 'pyhc',
    name: 'Ponzi-Yield High Core (PYHC)',
    description: 'A totally self-sustaining wealth algorithm backed by active recruitment. Definitely not a Ponzi.',
    currentPrice: 1000,
    history: [
      { time: '10:00', price: 950 },
      { time: '10:05', price: 1000 },
    ],
    riskLevel: 'PONZI-SCHEME',
    yieldRate: '350% APR',
    minInvestment: 50,
    ownedQuantity: 0,
    avgBuyPrice: 0,
  },
  {
    id: 'nma',
    name: 'Naira Moonshot Accelerator (NMA)',
    description: 'A quantum algorithmic model betting on the extreme speedrun of speculative currencies.',
    currentPrice: 100,
    history: [
      { time: '10:00', price: 120 },
      { time: '10:05', price: 100 },
    ],
    riskLevel: 'APOCALYPTIC',
    yieldRate: '980% Vol',
    minInvestment: 10,
    ownedQuantity: 0,
    avgBuyPrice: 0,
  },
  {
    id: 'lure',
    name: 'Lekki Under-Water Real Estate (LURE)',
    description: 'Digital land fractions in luxurious Lekki. Currently flooded, but valuation is soaring!',
    currentPrice: 500,
    history: [
      { time: '10:00', price: 490 },
      { time: '10:05', price: 500 },
    ],
    riskLevel: 'MODERATE',
    yieldRate: '18% Year',
    minInvestment: 100,
    ownedQuantity: 0,
    avgBuyPrice: 0,
  },
  {
    id: 'asap',
    name: "Alhaji's Sure Accumulator Pool (ASAP)",
    description: 'Pool funds directly for Baba Blue to stake on high-multiplier, unhedged weekend soccer bets.',
    currentPrice: 250,
    history: [
      { time: '10:00', price: 230 },
      { time: '10:05', price: 250 },
    ],
    riskLevel: 'EXTREME',
    yieldRate: '50% Ticks',
    minInvestment: 25,
    ownedQuantity: 0,
    avgBuyPrice: 0,
  }
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'LAL-IBW',
    homeTeam: 'Lagos Lions',
    awayTeam: 'Ibadan Warriors',
    homeOdds: 1.85,
    drawOdds: 3.10,
    awayOdds: 4.20,
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    minute: 0,
    category: 'Naija Premier Specu-League',
    events: [],
  },
  {
    id: 'AJU-LTB',
    homeTeam: 'Ajegunle Underdogs FC',
    awayTeam: 'Lekki Tech Billionaires',
    homeOdds: 5.50,
    drawOdds: 4.00,
    awayOdds: 1.45,
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    minute: 0,
    category: 'Naija Premier Specu-League',
    events: [],
  },
  {
    id: 'ECM-PHO',
    homeTeam: 'Enugu Coal Miners',
    awayTeam: 'Port Harcourt Oil Kings',
    homeOdds: 2.30,
    drawOdds: 2.90,
    awayOdds: 2.80,
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    minute: 0,
    category: 'Naija Premier Specu-League',
    events: [],
  },
  {
    id: 'VCS-EDU',
    homeTeam: 'Vatican City Saints',
    awayTeam: 'Euro Degenerate XI',
    homeOdds: 1.20,
    drawOdds: 5.00,
    awayOdds: 9.50,
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    minute: 0,
    category: 'Global Miracle Cup',
    events: [],
  },
  {
    id: 'KPC-APC',
    homeTeam: 'Kano Pyramids FC',
    awayTeam: 'Abuja Politicians FC',
    homeOdds: 3.20,
    drawOdds: 3.00,
    awayOdds: 2.10,
    status: 'UPCOMING',
    score: { home: 0, away: 0 },
    minute: 0,
    category: 'Naija Premier Specu-League',
    events: [],
  }
];

export default function App() {
  // Welcome screen overlay animation state (7 seconds transition)
  const [showWelcome, setShowWelcome] = useState(true);

  // Theme support (Dark vs Light mode)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('specubet_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Sound cues enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('specubet_sounds') !== 'false';
  });

  // Simulation velocity core
  const [simSpeed, setSimSpeed] = useState<'NORMAL' | 'FAST' | 'INSTANT'>(() => {
    const saved = localStorage.getItem('specubet_simspeed');
    return (saved === 'NORMAL' || saved === 'FAST' || saved === 'INSTANT') ? saved : 'NORMAL';
  });

  // User auth state
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('specubet_currentuser');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic user handle/username
  const [username, setUsername] = useState<string>(() => {
    const saved = localStorage.getItem('specubet_username');
    return saved || (currentUser ? currentUser.username : 'Chairman Lagos');
  });

  // Navigation tab states
  const [activeTab, setActiveTab] = useState<'betting' | 'investment' | 'checker' | 'admin' | 'casino' | 'livescores'>('betting');

  // Sync theme changes
  useEffect(() => {
    localStorage.setItem('specubet_theme', theme);
  }, [theme]);

  // Sync sounds state
  useEffect(() => {
    localStorage.setItem('specubet_sounds', String(soundEnabled));
  }, [soundEnabled]);

  // Sync simulation speed
  useEffect(() => {
    localStorage.setItem('specubet_simspeed', simSpeed);
  }, [simSpeed]);

  // Sync user state & handle
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('specubet_currentuser', JSON.stringify(currentUser));
      localStorage.setItem('specubet_username', currentUser.username);
      setUsername(currentUser.username);
    } else {
      localStorage.removeItem('specubet_currentuser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('specubet_username', username);
  }, [username]);

  // Currently inspected bet in the Ticket Validator receipt
  const [selectedBet, setSelectedBet] = useState<ActiveBet | null>(null);

  // Stats State
  const [stats, setStats] = useState<FinancialStats>(() => {
    const saved = localStorage.getItem('specubet_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      balance: 25000,
      totalDeposited: 25000,
      totalWithdrawn: 0,
      totalBetStake: 0,
      totalBetWon: 0,
      totalBetLost: 0,
      totalInvested: 0,
      totalInvestmentValue: 0,
      houseWins: 0,
    };
  });

  // Matches State
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [isSimulatingMatches, setIsSimulatingMatches] = useState(false);

  // Bet Slip States
  const [slipItems, setSlipItems] = useState<BetSlipItem[]>([]);
  const [activeBets, setActiveBets] = useState<ActiveBet[]>(() => {
    const saved = localStorage.getItem('specubet_bets');
    return saved ? JSON.parse(saved) : [];
  });

  // Investments State
  const [products, setProducts] = useState<InvestmentProduct[]>(() => {
    const saved = localStorage.getItem('specubet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Ah, **My Boss! Chairman! Egbon!** You are highly welcome to **NaijaBet Invest & Speculate Hub**! \n\nI am **Baba Blue**, the senior football analyst and certified Speculation Alhaji of Lagos. This is the place where we turn virtual Naira into hot tickets, and watch the bookies chop our money with clean smiles! \n\nAre we building a classic 15-game accumulator, or do you want to invest in our high-APR **Ponzi-Yield Core** scheme today? Speak to Alhaji, I am ready!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Notifications or system message alerts
  const [tickerNotification, setTickerNotification] = useState<string | null>(null);

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem('specubet_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('specubet_bets', JSON.stringify(activeBets));
  }, [activeBets]);

  useEffect(() => {
    localStorage.setItem('specubet_products', JSON.stringify(products));
  }, [products]);

  // Tick simulated stock market every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleStockMarketTick();
    }, 5000);
    return () => clearInterval(interval);
  }, [products, stats]);

  // Handle Match Live Progress Simulator
  useEffect(() => {
    let matchInterval: NodeJS.Timeout;
    if (isSimulatingMatches) {
      const simIntervalMs = simSpeed === 'FAST' ? 1500 : simSpeed === 'INSTANT' ? 500 : 4000;
      matchInterval = setInterval(() => {
        progressMatches();
      }, simIntervalMs); // Progress matches dynamically based on speed settings
    }
    return () => clearInterval(matchInterval);
  }, [isSimulatingMatches, matches, activeBets, simSpeed]);

  // Stock Tick Engine
  const handleStockMarketTick = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let isPonziRugged = false;

    const updated = products.map((prod) => {
      let changePercent = 0;
      let newPrice = prod.currentPrice;

      if (prod.riskLevel === 'MODERATE') {
        // Lekki Land: slow steady with minor slips
        changePercent = (Math.random() * 6 - 2.5) / 100; // -2.5% to +3.5%
      } else if (prod.riskLevel === 'EXTREME') {
        // Alhaji Pool: wild fluctuations
        changePercent = (Math.random() * 25 - 11) / 100; // -11% to +14%
      } else if (prod.riskLevel === 'APOCALYPTIC') {
        // Naira Moonshot: absolutely crazy
        changePercent = (Math.random() * 80 - 35) / 100; // -35% to +45%
      } else if (prod.riskLevel === 'PONZI-SCHEME') {
        // Ponzi: steady rise (+6% to +12%), but has 12% crash chance
        const crashRoll = Math.random();
        if (crashRoll < 0.12 && prod.currentPrice > 150) {
          // RUG PULL!
          newPrice = Math.max(10, prod.currentPrice * 0.03); // Collapses 97%
          isPonziRugged = true;
          changePercent = 0;
        } else {
          changePercent = (Math.random() * 8 + 6) / 100; // steady rise
        }
      }

      if (!isPonziRugged) {
        newPrice = Math.max(2, prod.currentPrice * (1 + changePercent));
      }

      const nextHistory = [...prod.history, { time: nowStr, price: newPrice }].slice(-10);

      return {
        ...prod,
        currentPrice: newPrice,
        history: nextHistory,
      };
    });

    setProducts(updated);

    // If a Ponzi rug happened, post a hilarious chat message and alert
    if (isPonziRugged) {
      triggerSystemAlert("🚨 RUG PULL ALERT: Ponzi-Yield Core just collapsed by 97%. The developer flew to Dubai on a private jet!");
      addBabaBlueSystemMessage("Ahn ahn! Chairman! Did you see PYHC? The founder just posted on Twitter that 'the liquidity was drained by hackers' while uploading a photo from a yacht in Dubai! Standard investment re-calibration, my boss! Abeg, let's put our remaining change on a soccer ticket, football doesn't crash to zero!");
    }

    // Recalculate portfolio value
    let totalPortfolioVal = 0;
    updated.forEach((p) => {
      totalPortfolioVal += p.ownedQuantity * p.currentPrice;
    });

    setStats(prev => ({
      ...prev,
      totalInvestmentValue: totalPortfolioVal
    }));
  };

  const triggerSystemAlert = (msg: string) => {
    setTickerNotification(msg);
    setTimeout(() => {
      setTickerNotification(null);
    }, 6000);
  };

  const addBabaBlueSystemMessage = (text: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        role: 'assistant',
        content: text,
        timestamp: timeStr,
      },
    ]);
  };

  // Mock Deposit Handler
  const handleDeposit = (amount: number, description: string) => {
    setStats((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      totalDeposited: prev.totalDeposited + amount,
    }));
    triggerSystemAlert(`💰 Deposit Successful: ₦${amount.toLocaleString()} added via "${description}". The house is cooking!`);
    addBabaBlueSystemMessage(`**Nairas Confirmed!** Chairman, I have spotted the ₦${amount.toLocaleString()} inside our vault! Outstanding decision to fund the speculative engine. Let's start picking selections before the bookies reduce the odds!`);
  };

  // Toggle Odds selections for Bet Slip
  const handleToggleOdds = (match: Match, betType: 'HOME' | 'DRAW' | 'AWAY', odds: number) => {
    const isSelected = slipItems.some((item) => item.matchId === match.id && item.betType === betType);

    if (isSelected) {
      // Remove it
      setSlipItems((prev) => prev.filter((item) => !(item.matchId === match.id)));
    } else {
      // Filter out any existing bets on this same match, then add new prediction
      const filtered = slipItems.filter((item) => item.matchId !== match.id);
      const predictionText =
        betType === 'HOME'
          ? `${match.homeTeam} straight win`
          : betType === 'DRAW'
          ? `Draw match`
          : `${match.awayTeam} straight win`;

      const newItem: BetSlipItem = {
        matchId: match.id,
        matchName: `${match.homeTeam} vs ${match.awayTeam}`,
        betType,
        odds,
        predictionText,
      };

      setSlipItems([...filtered, newItem]);
    }
  };

  // Remove individual slip selection
  const handleRemoveSlipItem = (matchId: string) => {
    setSlipItems((prev) => prev.filter((item) => item.matchId !== matchId));
  };

  // Clear Slip entirely
  const handleClearSlip = () => {
    setSlipItems([]);
  };

  // Submit/Place Bet
  const handlePlaceBet = (stake: number) => {
    const newBet: ActiveBet = {
      id: 'BET-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      slip: [...slipItems],
      stake,
      potentialPayout: stake * slipItems.reduce((acc, item) => acc * item.odds, 1),
      status: 'PENDING',
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setStats((prev) => ({
      ...prev,
      balance: prev.balance - stake,
      totalBetStake: prev.totalBetStake + stake,
    }));

    setActiveBets((prev) => [newBet, ...prev]);
    setSlipItems([]);

    // Set matches to Live state so user can watch the result in real time
    setMatches((prev) =>
      prev.map((m) => {
        if (m.status === 'UPCOMING') {
          return {
            ...m,
            status: 'LIVE',
            minute: 1,
            score: { home: 0, away: 0 },
            events: ['0\' Match has kicked off under cloudy skies and intense sports betting prayer.'],
          };
        }
        return m;
      })
    );

    setIsSimulatingMatches(true);

    triggerSystemAlert(`🎟️ Ticket Placed! Stake: ₦${stake.toLocaleString()}. Watch the live match events progress!`);
    addBabaBlueSystemMessage(`**Boom! Ticket Locked!** Alhaji has approved this slip. Your ₦${stake.toLocaleString()} is currently dancing on the pitch. Keep an eye on our live sports console below to follow the drama!`);
  };

  // Progressive Live Matches Simulation Engine
  const progressMatches = () => {
    let allFinished = true;

    const updatedMatches = matches.map((match) => {
      if (match.status !== 'LIVE') return match;

      allFinished = false;
      const nextMinute = match.minute + 15; // fast progress by 15 mins per cycle
      const events = [...match.events];
      const score = { ...match.score };

      // Random goal score simulation
      const eventChance = Math.random();
      if (nextMinute < 90 && eventChance < 0.35) {
        const isHomeGoal = Math.random() > 0.5;
        if (isHomeGoal) {
          score.home += 1;
          events.push(`${nextMinute}' GOAL! ${match.homeTeam} striker slides past the goalie! Score: ${score.home}-${score.away}`);
        } else {
          score.away += 1;
          events.push(`${nextMinute}' GOAL! Beautiful combination allows ${match.awayTeam} to score! Score: ${score.home}-${score.away}`);
        }
      }

      // High-Stakes "House Bias" in final minutes
      if (nextMinute >= 90) {
        const userHasBetOnThis = activeBets.some(
          (b) => b.status === 'PENDING' && b.slip.some((item) => item.matchId === match.id)
        );

        if (userHasBetOnThis && Math.random() < 0.70) {
          // Apply hilarious late-upset event to make the user "lose very well"
          const randomLateEvent = Math.random();
          if (randomLateEvent < 0.35) {
            // Equalizer or surprise goal
            if (score.home > score.away) {
              score.away += 1;
              events.push(`90+2' LATE DRAMA! ${match.awayTeam} equalizes with an unbelievable bicycle kick. Bookie's warehouse erupted in celebration! Final Score: ${score.home}-${score.away}`);
            } else if (score.away > score.home) {
              score.home += 1;
              events.push(`90+3' SURPRISE! ${match.homeTeam} equalizes in injury time. The linesman was spotted smiling at the bookies. Final Score: ${score.home}-${score.away}`);
            } else {
              // break a draw
              score.home += 1;
              events.push(`90+4' EXTRAORDINARY! Referee awards a highly controversial penalty to ${match.homeTeam}. Stadium fans are throwing pure water sachets. Final Score: ${score.home}-${score.away}`);
            }
          } else if (randomLateEvent < 0.70) {
            // Disallowed goal
            events.push(`90+1' VAR REJECTION! A potential winning goal for this match is ruled out because the striker's big toe was deemed offside by 0.5 millimeters!`);
          } else {
            // Sarcastic commentary
            events.push(`90' RED CARD! Star midfielder gets sent off for complaining that the referee is wearing a shirt that looks like the opposing team's jersey.`);
          }
        } else {
          events.push(`90' Full Time whistle blows! Players exchange jerseys and counting slips.`);
        }
      }

      return {
        ...match,
        minute: Math.min(90, nextMinute),
        status: nextMinute >= 90 ? 'FINISHED' as const : 'LIVE' as const,
        score,
        events,
      };
    });

    setMatches(updatedMatches);

    // If matches finished, settle pending bets
    if (updatedMatches.every((m) => m.status === 'FINISHED')) {
      setIsSimulatingMatches(false);
      settleBets(updatedMatches);
    }
  };

  const settleBets = (settledMatches: Match[]) => {
    const updatedBets = activeBets.map((bet) => {
      if (bet.status !== 'PENDING') return bet;

      let isWon = true;

      for (const item of bet.slip) {
        const match = settledMatches.find((m) => m.id === item.matchId);
        if (!match) {
          isWon = false;
          break;
        }

        const score = match.score;
        let actualOutcome: 'HOME' | 'DRAW' | 'AWAY' = 'DRAW';
        if (score.home > score.away) actualOutcome = 'HOME';
        else if (score.away > score.home) actualOutcome = 'AWAY';

        if (item.betType !== actualOutcome) {
          isWon = false;
          break;
        }
      }

      const finalStatus = isWon ? 'WON' as const : 'LOST' as const;

      if (isWon) {
        setStats((prev) => ({
          ...prev,
          balance: prev.balance + bet.potentialPayout,
          totalBetWon: prev.totalBetWon + bet.potentialPayout,
        }));
        triggerSystemAlert(`🎉 CONGRATULATIONS! Ticket #${bet.id.substring(0,6)} won ₦${bet.potentialPayout.toLocaleString()}! Native doctor claims full credit.`);
        addBabaBlueSystemMessage(`**HOLY SPIRIT! FIRE! DELIVERANCE!** My Boss, you have broken the bookie! Ticket #${bet.id.substring(0,6)} has qualified for premium payouts. Total of **₦${bet.potentialPayout.toLocaleString()}** has been injected into your balance. Alhaji is bowing down to your sovereign analytical vision! Buy cold drinks, egbon!`);
      } else {
        setStats((prev) => ({
          ...prev,
          totalBetLost: prev.totalBetLost + bet.stake,
          houseWins: prev.houseWins + bet.stake,
        }));
        triggerSystemAlert(`✂️ CUT-ONE-GAME! Ticket #${bet.id.substring(0,6)} lost. The house pocketed ₦${bet.stake.toLocaleString()}.`);
        addBabaBlueSystemMessage(`**Ahn ahn! Cut-one-game has struck!** Alhaji is truly heartbroken. The match commentator award that surprise penalty and ruined our ancestral retirement plans. Don't worry, Chairman. Loss is just a temporary redirection! Top-up and let's configure a fresh ticket immediately!`);
      }

      return {
        ...bet,
        status: finalStatus,
      };
    });

    setActiveBets(updatedBets);

    // Reset finished matches back to upcoming status after a delay so they can bet again
    setTimeout(() => {
      setMatches(INITIAL_MATCHES);
    }, 12000);
  };

  // Buy speculative investment product
  const handleBuyInvestment = (productId: string, quantity: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const cost = quantity * prod.currentPrice;
    if (cost > stats.balance) {
      triggerSystemAlert("❌ Trade Rejected: Insufficient balance! Sell land or fund your vault first.");
      return;
    }

    // Calculate new average buy price
    const totalQty = prod.ownedQuantity + quantity;
    const totalCost = (prod.ownedQuantity * prod.avgBuyPrice) + cost;
    const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;

    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          ownedQuantity: totalQty,
          avgBuyPrice: avgPrice,
        };
      }
      return p;
    });

    setProducts(updated);
    setStats((prev) => ({
      ...prev,
      balance: prev.balance - cost,
      totalInvested: prev.totalInvested + cost,
    }));

    triggerSystemAlert(`📈 Portfolio Purchase: Bought ${quantity.toFixed(4)} of ${prod.name} for ₦${cost.toLocaleString()}.`);
    addBabaBlueSystemMessage(`**Portfolio Diversified!** You bought **${quantity.toFixed(4)}** units of **${prod.name}**. Alhaji suggests monitoring this closely, as the server algorithm is extremely unstable and loves to reallocate funds elsewhere!`);
  };

  // Sell speculative investment product
  const handleSellInvestment = (productId: string, quantity: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod || prod.ownedQuantity < quantity) {
      triggerSystemAlert("❌ Trade Rejected: You do not own enough units to complete this sell order.");
      return;
    }

    const saleValue = quantity * prod.currentPrice;

    const updated = products.map((p) => {
      if (p.id === productId) {
        const remainingQty = p.ownedQuantity - quantity;
        return {
          ...p,
          ownedQuantity: remainingQty,
          avgBuyPrice: remainingQty > 0 ? p.avgBuyPrice : 0,
        };
      }
      return p;
    });

    setProducts(updated);
    setStats((prev) => ({
      ...prev,
      balance: prev.balance + saleValue,
    }));

    triggerSystemAlert(`📉 Portfolio Liquidation: Sold ${quantity.toFixed(4)} units of ${prod.name} for ₦${saleValue.toLocaleString()}`);
    addBabaBlueSystemMessage(`**Asset Liquidated!** You converted **${quantity.toFixed(4)}** units into cash. Total of **₦${saleValue.toLocaleString()}** added back to your balance. The house is still smiling!`);
  };

  // Chat engine invoking Express backend API proxy
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: "Ahn ahn, My Boss! The network provider has cut Alhaji's internet cable! Let me pray over the router and reconnect, please send that message again in a minute!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setStats((prev) => ({
      ...prev,
      balance: user.balance,
    }));
    triggerSystemAlert(`👋 Welcome, ${user.username}! Secure speculator balance loaded: ₦${user.balance.toLocaleString()}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerSystemAlert("🔒 Account signed out successfully.");
  };

  const handleResetBalance = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      balance: amount,
    }));
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        balance: amount,
      });
    }
  };

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        username: newUsername,
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans pb-12 relative overflow-x-hidden ${
        isDark 
          ? 'bg-[#070b09] text-neutral-100 selection:bg-bet-green-medium selection:text-white' 
          : 'bg-[#f4f7f5] text-neutral-900 selection:bg-bet-gold selection:text-black'
      }`}>
        
        {/* Premium sports-lounge ambient glowing spotlights */}
        {isDark && (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(0,102,51,0.25)_0%,transparent_70%)] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[25%] right-[-15%] w-[50%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.06)_0%,transparent_70%)] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-[radial-gradient(circle_at_center,rgba(0,51,25,0.2)_0%,transparent_70%)] rounded-full blur-[100px] pointer-events-none" />
          </>
        )}

        {/* Fine-mesh tactical layout grid mask */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#111714_1px,transparent_1px),linear-gradient(to_bottom,#111714_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0 ${
          isDark ? 'opacity-40' : 'opacity-10'
        }`} />

        {/* Main app contents wrapped safely relative to the grid overlay */}
        <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* Betking Clone Signature Topbar (Royal Blue & Crown Yellow) */}
          <header className="border-b border-yellow-500/10 bg-[#004b87] sticky top-0 z-40 text-white shadow-xl shadow-blue-950/20">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Betking Crown Header Logo */}
              <div className="flex items-center gap-3">
                <div className="bg-neutral-950 border-2 border-bet-gold px-3 py-1.5 rounded-lg font-display font-black text-lg tracking-tight text-white flex items-center gap-1.5">
                  <span className="text-xl text-bet-gold drop-shadow animate-pulse">👑</span>
                  <span>Betking <span className="text-bet-gold font-extrabold uppercase">Specu-Invest</span></span>
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-[10px] font-mono text-yellow-300 font-black tracking-widest uppercase">Lagos Sports Lounge</span>
                  <span className="text-[8px] font-mono text-blue-200 font-bold">Nigeria's Safest Speculation Core</span>
                </div>
              </div>

              {/* Functional User Profile Panel & configuration consoles */}
              <div className="flex items-center gap-3.5">
                
                {/* Authentic Login accounts flow widget */}
                <AuthPanel
                  currentUser={currentUser}
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                  onUpdateUserBalance={(newBal) => handleResetBalance(newBal)}
                  theme={theme}
                />

                {/* Portal settings overlay controller (contains Theme Switcher, Refills, sound configs) */}
                <SettingsPanel
                  theme={theme}
                  onThemeChange={(t) => setTheme(t)}
                  username={username}
                  onUsernameChange={handleUsernameChange}
                  onResetBalance={handleResetBalance}
                  soundEnabled={soundEnabled}
                  onSoundToggle={(e) => setSoundEnabled(e)}
                  simSpeed={simSpeed}
                  onSimSpeedChange={(s) => setSimSpeed(s)}
                  onTriggerAlert={(msg) => triggerSystemAlert(msg)}
                />

              </div>

            </div>
          </header>

          {/* Dynamic sub-topbar showing time and server details */}
          <div className={`border-b text-[10px] font-mono py-1.5 px-4 ${
            isDark ? 'bg-neutral-900/60 border-neutral-850 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-bet-green-bright animate-ping" />
                <span>Naija-Sim Live Feed: Active</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Account Member: <strong className="text-bet-gold uppercase font-bold">{username}</strong></span>
                <span className="hidden md:inline">Server UTC+1 • Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Interactive Global Ticker Notification Bar */}
          {tickerNotification && (
            <div className="bg-gradient-to-r from-blue-900 via-neutral-950 to-neutral-950 border-b border-bet-gold/20 py-2 px-4 animate-slide-down z-30">
              <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-yellow-300 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-bet-gold" />
                <span className="truncate">{tickerNotification}</span>
              </div>
            </div>
          )}

          {/* Main Container Layout */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
            
            {/* Top Financial Dashboard */}
            <StatsDashboard stats={stats} onDeposit={handleDeposit} onWithdraw={() => {}} />

            {/* Tab Selection Row */}
            <div className={`flex flex-wrap p-1 rounded-xl w-fit gap-1 border ${
              isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('betting')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'betting'
                    ? (isDark ? 'bg-neutral-850 text-white shadow' : 'bg-slate-200 text-neutral-900 shadow')
                    : 'text-neutral-400 hover:text-neutral-500'
                }`}
              >
                ⚽ Sports Arena
              </button>
              
              <button
                onClick={() => setActiveTab('livescores')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'livescores'
                    ? 'bg-bet-gold text-black shadow-md font-black'
                    : 'text-neutral-400 hover:text-neutral-500'
                }`}
              >
                🔴 Live Scores & Events
              </button>

              <button
                onClick={() => setActiveTab('investment')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'investment'
                    ? (isDark ? 'bg-neutral-850 text-white shadow' : 'bg-slate-200 text-neutral-900 shadow')
                    : 'text-neutral-400 hover:text-neutral-500'
                }`}
              >
                📈 Speculative desk
              </button>

              <button
                onClick={() => setActiveTab('casino')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'casino'
                    ? (isDark ? 'bg-neutral-850 text-white shadow' : 'bg-slate-200 text-neutral-900 shadow')
                    : 'text-neutral-400 hover:text-neutral-500'
                }`}
              >
                🔥 Instant Casino (Aviator)
              </button>

              <button
                onClick={() => setActiveTab('checker')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'checker'
                    ? (isDark ? 'bg-neutral-850 text-white shadow' : 'bg-slate-200 text-neutral-900 shadow')
                    : 'text-neutral-400 hover:text-neutral-500'
                }`}
              >
                🎟️ Ticket Validator
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-red-600 text-white font-extrabold shadow-md'
                    : 'text-neutral-400 hover:text-red-500 hover:bg-red-500/5'
                }`}
              >
                🔑 Admin Backroom Rig
              </button>
            </div>

            {/* Grid Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Matches or LiveScores or Investments or Checker or Admin (8 columns) */}
              <div className="lg:col-span-8 space-y-6">
                
                {activeTab === 'betting' && (
                  <MatchesSection
                    matches={matches}
                    slipItems={slipItems}
                    onToggleOdds={handleToggleOdds}
                    isSimulating={isSimulatingMatches}
                    onTriggerSimulation={progressMatches}
                  />
                )}

                {activeTab === 'livescores' && (
                  <LiveScoresSection
                    matches={matches}
                    isSimulating={isSimulatingMatches}
                    onTriggerSimulation={progressMatches}
                  />
                )}
                
                {activeTab === 'investment' && (
                  <InvestmentSection
                    products={products}
                    stats={stats}
                    onBuy={handleBuyInvestment}
                    onSell={handleSellInvestment}
                    onTriggerTick={handleStockMarketTick}
                  />
                )}

                {activeTab === 'casino' && (
                  <CasinoGamesSection
                    stats={stats}
                    onUpdateStats={setStats}
                    onTriggerAlert={(msg) => {
                      setTickerNotification(msg);
                      setTimeout(() => setTickerNotification(''), 6000);
                    }}
                    onAddBabaBlueMessage={(text) => {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          id: `msg-${Date.now()}`,
                          role: 'assistant',
                          content: text,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        },
                      ]);
                    }}
                  />
                )}

                {activeTab === 'checker' && (
                  <BetDetailsChecker
                    activeBets={activeBets}
                    matches={matches}
                    selectedBet={selectedBet}
                    onSelectBet={setSelectedBet}
                    onClose={() => setActiveTab('betting')}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminConsole
                    activeBets={activeBets}
                    matches={matches}
                    stats={stats}
                    onUpdateBets={setActiveBets}
                    onUpdateMatches={setMatches}
                    onUpdateStats={setStats}
                  />
                )}

                {/* Alhaji Guru Chat placed beautifully at the bottom of the left column */}
                <GuruChatSection
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={isChatLoading}
                />
              </div>

              {/* Right Column: Bet Slip / History (4 columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                <BetSlipSection
                  slipItems={slipItems}
                  activeBets={activeBets}
                  stats={stats}
                  onRemoveItem={handleRemoveSlipItem}
                  onClearSlip={handleClearSlip}
                  onPlaceBet={handlePlaceBet}
                  onSelectBet={(bet) => {
                    setSelectedBet(bet);
                    setActiveTab('checker');
                  }}
                />

                {/* Hilarious Gambling Warning Badge */}
                <div className={`border rounded-2xl p-5 text-xs space-y-3.5 ${
                  isDark ? 'bg-neutral-950 border-neutral-850 text-neutral-400' : 'bg-white border-slate-200 text-slate-600 shadow'
                }`}>
                  <div className={`flex items-center gap-2 border-b pb-2 ${
                    isDark ? 'border-neutral-900' : 'border-slate-100'
                  }`}>
                    <AlertCircle className="w-5 h-5 text-bet-red shrink-0" />
                    <h4 className={`font-bold uppercase font-display text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Alhaji's Responsible Speculator Advisory
                    </h4>
                  </div>
                  <p className="font-mono leading-relaxed text-[11px]">
                    "Speculative betting and Ponzi structures are high adrenaline sports. 99% of people quit right before they hit the jackpot, but 100% of Alhaji's cousins have lost their bicycles. Stake wisely, egbon! If your land is sold, Alhaji has no knowledge of it."
                  </p>
                  <div className={`px-3 py-1.5 rounded-lg border text-[10px] text-center font-mono ${
                    isDark ? 'bg-neutral-900 border-neutral-850/50' : 'bg-slate-50 border-slate-200'
                  }`}>
                    House win ratio: <span className="font-bold text-bet-red">94.8%</span> (Very healthy ecosystem)
                  </div>
                </div>

              </div>

            </div>
          </main>

        </div>
      </div>
    </>
  );
}
