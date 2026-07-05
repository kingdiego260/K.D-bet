import React, { useState, useEffect, useRef } from 'react';
import { FinancialStats } from '../types';
import { Play, TrendingUp, AlertTriangle, HelpCircle, Sparkles, ShieldAlert, ArrowUpRight, Flame, Coins, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CasinoGamesSectionProps {
  stats: FinancialStats;
  onUpdateStats: React.Dispatch<React.SetStateAction<FinancialStats>>;
  onTriggerAlert: (msg: string) => void;
  onAddBabaBlueMessage: (text: string) => void;
}

export const CasinoGamesSection: React.FC<CasinoGamesSectionProps> = ({
  stats,
  onUpdateStats,
  onTriggerAlert,
  onAddBabaBlueMessage,
}) => {
  const [activeGame, setActiveGame] = useState<'aviator' | 'dice' | 'cup'>('aviator');

  // ==========================================
  // Game 1: Lagos Aviator (Crash Game) States
  // ==========================================
  const [aviatorStake, setAviatorStake] = useState<string>('500');
  const [aviatorState, setAviatorState] = useState<'IDLE' | 'FLYING' | 'CRASHED' | 'CASHED_OUT'>('IDLE');
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [crashThreshold, setCrashThreshold] = useState<number>(1.00);
  const [winningPayout, setWinningPayout] = useState<number>(0);
  const [flightHistory, setFlightHistory] = useState<number[]>([1.45, 2.10, 1.05, 5.40, 1.12]);

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Use a ref to always have the latest state values in requestAnimationFrame ticks
  const aviatorStakeRef = useRef<string>(aviatorStake);
  const currentMultiplierRef = useRef<number>(currentMultiplier);

  useEffect(() => {
    aviatorStakeRef.current = aviatorStake;
  }, [aviatorStake]);

  useEffect(() => {
    currentMultiplierRef.current = currentMultiplier;
  }, [currentMultiplier]);

  // Clean animation frame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // ==========================================
  // Game 2: Alhaji's Dice Duel States
  // ==========================================
  const [diceStake, setDiceStake] = useState<string>('1000');
  const [diceSelection, setDiceSelection] = useState<'UNDER' | 'SEVEN' | 'OVER'>('OVER');
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [rolledDice, setRolledDice] = useState<[number, number]>([3, 4]);
  const [diceOutcome, setDiceOutcome] = useState<'WON' | 'LOST' | null>(null);

  // ==========================================
  // Game 3: Lagos Cup & Ball (Shell Game) States
  // ==========================================
  const [cupStake, setCupStake] = useState<string>('500');
  const [winningCup, setWinningCup] = useState<number>(1); // 0, 1, or 2
  const [selectedCup, setSelectedCup] = useState<number | null>(null);
  const [isShufflingCups, setIsShufflingCups] = useState<boolean>(false);
  const [cupState, setCupState] = useState<'IDLE' | 'SHUFFLED' | 'REVEALED'>('IDLE');
  const [shufflePositions, setShufflePositions] = useState<number[]>([0, 1, 2]);

  // ==========================================
  // Lagos Aviator Logic
  // ==========================================
  const startAviatorFlight = () => {
    const stake = parseFloat(aviatorStake);
    if (isNaN(stake) || stake <= 0) {
      onTriggerAlert("❌ Chairman, enter a valid stake before flying the plane!");
      return;
    }
    if (stake > stats.balance) {
      onTriggerAlert("❌ Insufficient funds! Sell another plot of land in Lekki first.");
      return;
    }

    // Deduct stake instantly
    onUpdateStats((prev) => ({
      ...prev,
      balance: prev.balance - stake,
      totalBetStake: prev.totalBetStake + stake,
    }));

    // Determine crash multiplier threshold mathematically with heavy house bias
    // 20% chance of instant crash at 1.00x - 1.15x (house eats immediately)
    // 45% chance of crash between 1.16x - 1.90x
    // 25% chance of crash between 1.91x - 4.50x
    // 10% chance of a miraculous moonshot flight up to 15x+
    const rand = Math.random();
    let threshold = 1.10;

    if (rand < 0.20) {
      threshold = 1.00 + Math.random() * 0.15;
    } else if (rand < 0.65) {
      threshold = 1.16 + Math.random() * 0.74;
    } else if (rand < 0.90) {
      threshold = 1.91 + Math.random() * 2.59;
    } else {
      threshold = 4.50 + Math.random() * 12.50;
    }

    setCrashThreshold(threshold);
    setCurrentMultiplier(1.00);
    setAviatorState('FLYING');
    startTimeRef.current = performance.now();

    // Start tick
    runAviatorTick(threshold);
  };

  const runAviatorTick = (threshold: number) => {
    const tick = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = (now - startTimeRef.current) / 1000; // seconds

      // Multiplier increases exponentially over time
      const calculatedMultiplier = 1.00 + Math.pow(elapsed * 0.45, 1.35);

      if (calculatedMultiplier >= threshold) {
        // CRASH OVERRIDE! Plane flew away!
        setCurrentMultiplier(threshold);
        setAviatorState('CRASHED');
        
        // Save history list limit to 6
        setFlightHistory((prev) => [parseFloat(threshold.toFixed(2)), ...prev].slice(0, 6));

        // Alhaji comments on your premium failure
        const stakeVal = parseFloat(aviatorStakeRef.current);
        onUpdateStats((prev) => ({
          ...prev,
          totalBetLost: prev.totalBetLost + stakeVal,
          houseWins: prev.houseWins + stakeVal,
        }));

        const crashInsults = [
          `Ahn ahn! Aviator plane has flown away to Cameroon with your ₦${stakeVal}! Alhaji tried to wave down the pilot, but he ignored me!`,
          `Absolute speedrun! The plane vanished at ${threshold.toFixed(2)}x. The house has chopped your money with maximum efficiency!`,
          `Egbon, why did you look at your phone? Your cash out target has crashed! Real-time financial redistribution is complete.`,
          `The native doctor warned me about this flight! Aviator crashed at ${threshold.toFixed(2)}x. Top-up and let's book another ticket!`
        ];
        onAddBabaBlueMessage(crashInsults[Math.floor(Math.random() * crashInsults.length)]);

      } else {
        // Continue flying
        setCurrentMultiplier(calculatedMultiplier);
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  const cashOutAviator = () => {
    if (aviatorState !== 'FLYING') return;

    // Cancel animation frame immediately
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const stake = parseFloat(aviatorStake);
    const multiplierWon = currentMultiplierRef.current;
    const payout = stake * multiplierWon;

    setWinningPayout(payout);
    setAviatorState('CASHED_OUT');

    onUpdateStats((prev) => ({
      ...prev,
      balance: prev.balance + payout,
      totalBetWon: prev.totalBetWon + payout,
    }));

    setFlightHistory((prev) => [parseFloat(multiplierWon.toFixed(2)), ...prev].slice(0, 6));

    onTriggerAlert(`🎉 CASHOUT SUCCESSFUL! You escaped with ₦${payout.toLocaleString(undefined, { maximumFractionDigits: 1 })} at ${multiplierWon.toFixed(2)}x!`);
    onAddBabaBlueMessage(`**HOLY SPIRIT! CASHOUT CONFIRMED!** My Boss, you clicked that button with the reflexes of a hungry cheetah! You collected **₦${payout.toLocaleString(undefined, { maximumFractionDigits: 1 })}** from the cockpit before it exploded at ${crashThreshold.toFixed(2)}x! Let's go again!`);
  };


  // ==========================================
  // Alhaji's Dice Duel Logic
  // ==========================================
  const playDiceDuel = () => {
    const stake = parseFloat(diceStake);
    if (isNaN(stake) || stake <= 0) {
      onTriggerAlert("❌ Chairman, choose a valid roll stake!");
      return;
    }
    if (stake > stats.balance) {
      onTriggerAlert("❌ Insufficient funds to compete with Alhaji's lucky dice.");
      return;
    }

    setIsRollingDice(true);
    setDiceOutcome(null);

    // Subtract stake capital
    onUpdateStats((prev) => ({
      ...prev,
      balance: prev.balance - stake,
      totalBetStake: prev.totalBetStake + stake,
    }));

    // Roll after a cool rolling delay
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      setRolledDice([d1, d2]);

      let won = false;
      let payoutRate = 0;

      if (diceSelection === 'UNDER') {
        won = total < 7;
        payoutRate = 1.95;
      } else if (diceSelection === 'OVER') {
        won = total > 7;
        payoutRate = 1.95;
      } else if (diceSelection === 'SEVEN') {
        won = total === 7;
        payoutRate = 5.80;
      }

      setIsRollingDice(false);

      if (won) {
        const payout = stake * payoutRate;
        setDiceOutcome('WON');
        onUpdateStats((prev) => ({
          ...prev,
          balance: prev.balance + payout,
          totalBetWon: prev.totalBetWon + payout,
        }));
        onTriggerAlert(`🎉 DICE MATCH WIN! Alhaji rolled ${total} (${d1}+${d2}). You won ₦${payout.toLocaleString()}!`);
        onAddBabaBlueMessage(`**Ahn ahn! Chairman is a dice wizard!** The dice landed on exactly ${total}. You just collected ₦${payout.toLocaleString()}! Alhaji's pocket is currently crying!`);
      } else {
        setDiceOutcome('LOST');
        onUpdateStats((prev) => ({
          ...prev,
          totalBetLost: prev.totalBetLost + stake,
          houseWins: prev.houseWins + stake,
        }));
        onTriggerAlert(`✂️ LOSE: Alhaji rolled ${total} (${d1}+${d2}). The bookie chopped your ₦${stake.toLocaleString()}.`);
        onAddBabaBlueMessage(`**Egbami! Total was ${total}!** Your guess was incorrect, my chief. Alhaji's lucky Nigerian dice is highly uncooperative today. Re-adjust your strategy and throw again!`);
      }
    }, 1500);
  };

  // ==========================================
  // Lagos Cup & Ball (Shell Game) Logic
  // ==========================================
  const startCupShuffle = () => {
    const stake = parseFloat(cupStake);
    if (isNaN(stake) || stake <= 0) {
      onTriggerAlert("❌ Chairman, enter a valid stake for the Cup Game!");
      return;
    }
    if (stake > stats.balance) {
      onTriggerAlert("❌ Insufficient funds! Sell some assets or invest less.");
      return;
    }

    // Deduct stake instantly
    onUpdateStats((prev) => ({
      ...prev,
      balance: prev.balance - stake,
      totalBetStake: prev.totalBetStake + stake,
    }));

    setIsShufflingCups(true);
    setCupState('SHUFFLED');
    setSelectedCup(null);
    
    // Alhaji hides the ball in a random cup (0, 1, or 2)
    const ballIdx = Math.floor(Math.random() * 3);
    setWinningCup(ballIdx);

    // Swap positions rapidly to animate shuffling
    let shuffleCount = 0;
    const interval = setInterval(() => {
      setShufflePositions((prev) => {
        const next = [...prev];
        // Swap two random items
        const i1 = Math.floor(Math.random() * 3);
        let i2 = Math.floor(Math.random() * 3);
        while (i1 === i2) {
          i2 = Math.floor(Math.random() * 3);
        }
        const temp = next[i1];
        next[i1] = next[i2];
        next[i2] = temp;
        return next;
      });

      shuffleCount++;
      if (shuffleCount >= 12) {
        clearInterval(interval);
        setIsShufflingCups(false);
      }
    }, 120);
  };

  const selectCupToReveal = (cupIndex: number) => {
    if (isShufflingCups || cupState !== 'SHUFFLED') return;

    setSelectedCup(cupIndex);
    setCupState('REVEALED');

    const stake = parseFloat(cupStake);
    const won = cupIndex === winningCup;

    if (won) {
      const payout = stake * 2.80; // Nice 2.80x multiplier for a 1-in-3 guess
      onUpdateStats((prev) => ({
        ...prev,
        balance: prev.balance + payout,
        totalBetWon: prev.totalBetWon + payout,
      }));
      onTriggerAlert(`🎉 CORRECT GUESS! You picked Cup ${cupIndex + 1} containing the Broad Street Diamond! Won ₦${payout.toLocaleString()}`);
      onAddBabaBlueMessage(`**Mogbe! Your eyes are like CCTV camera!** Alhaji shuffled the cups with lightning speed, but you still caught the Diamond under Cup ${cupIndex + 1}! You won **₦${payout.toLocaleString()}**! Excellent execution!`);
    } else {
      onUpdateStats((prev) => ({
        ...prev,
        totalBetLost: prev.totalBetLost + stake,
        houseWins: prev.houseWins + stake,
      }));
      onTriggerAlert(`✂️ INCORRECT! Cup ${cupIndex + 1} is empty! The Lagos Diamond was under Cup ${winningCup + 1}. Stake of ₦${stake.toLocaleString()} lost.`);
      onAddBabaBlueMessage(`**Ahn ahn! Alhaji wins this round!** You lifted Cup ${cupIndex + 1} but it was empty Lagos sand! The heavy golden diamond was hiding under Cup ${winningCup + 1}! Do not worry, try again and follow Alhaji's hand closely!`);
    }
  };

  return (
    <div id="casino-games-section" className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative">
      {/* Decorative red-light visual aura for high risk adrenaline */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-bet-red/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
        <div>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            <Flame className="text-bet-red w-6 h-6 animate-pulse" />
            Lagos Instant Specu-Games
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Why wait 90 minutes for soccer matches? Stake on high-multiplier interactive simulators. High risk, instant feedback.
          </p>
        </div>

        {/* Tab Game Selection Toggle */}
        <div className="flex flex-wrap bg-neutral-950 p-1 rounded-xl border border-neutral-850 gap-1 self-start">
          <button
            onClick={() => setActiveGame('aviator')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'aviator' ? 'bg-bet-red text-white font-extrabold shadow-lg shadow-red-950/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            🚀 Lagos Aviator (Crash)
          </button>
          <button
            onClick={() => setActiveGame('dice')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'dice' ? 'bg-bet-gold text-black font-extrabold shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎲 Alhaji's Dice Duel
          </button>
          <button
            onClick={() => {
              setActiveGame('cup');
              setCupState('IDLE');
              setSelectedCup(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'cup' ? 'bg-purple-600 text-white font-extrabold shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            🥤 Alhaji's Cups & Ball
          </button>
        </div>
      </div>

      {/* ==========================================
          GAME 1: LAGOS AVIATOR VIEW
          ========================================== */}
      {activeGame === 'aviator' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Recent Multipliers ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Recent Flights:</span>
            {flightHistory.map((h, i) => (
              <span
                key={i}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                  h > 3.0
                    ? 'bg-purple-950 text-purple-400 border-purple-900'
                    : h > 1.8
                    ? 'bg-bet-green-dark text-bet-green-bright border-bet-green-medium/30'
                    : 'bg-neutral-950 text-neutral-500 border-neutral-850'
                }`}
              >
                {h.toFixed(2)}x
              </span>
            ))}
          </div>

          {/* Interactive Sky Multiplier Canvas display screen */}
          <div className="h-64 bg-neutral-950 border border-neutral-850 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Ambient radar grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Simulated flight path curve line */}
            {aviatorState === 'FLYING' && (
              <div className="absolute inset-x-0 bottom-0 top-1/2 pointer-events-none opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 0 100 Q 40 90, 100 0"
                    fill="none"
                    stroke="#ff3333"
                    strokeWidth="2"
                    strokeDasharray="4"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            )}

            {/* Flight state content */}
            <AnimatePresence mode="wait">
              {aviatorState === 'IDLE' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-3 z-10 p-4"
                >
                  <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
                    🚀
                  </div>
                  <h4 className="font-display font-extrabold text-white text-sm">Lagos Red-Eye Express Flight</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Set your virtual Naira stake and launch. The multiplier climbs dynamically, but can trigger an instant crash at any millisecond! Cash out before the pilot flees to Dubai!
                  </p>
                </motion.div>
              )}

              {aviatorState === 'FLYING' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-2 z-10"
                >
                  {/* Floating plane avatar */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      x: [-5, 5, -5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                    className="text-4xl filter drop-shadow-[0_0_15px_#ff3333]"
                  >
                    ✈️
                  </motion.div>
                  <span className="text-xs font-mono text-bet-red uppercase tracking-wider block font-bold animate-pulse">
                    The Plane is Climbing...
                  </span>
                  <span className="text-5xl font-display font-black text-white block">
                    {currentMultiplier.toFixed(2)}x
                  </span>
                  <p className="text-[10px] font-mono text-neutral-400">
                    Current value: ₦{(parseFloat(aviatorStake) * currentMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </p>
                </motion.div>
              )}

              {aviatorState === 'CRASHED' && (
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-3 z-10"
                >
                  <div className="w-16 h-16 bg-bet-red/20 border border-bet-red/40 rounded-full flex items-center justify-center mx-auto text-3xl animate-ping">
                    💥
                  </div>
                  <h3 className="font-display font-black text-bet-red text-2xl uppercase tracking-widest">FLEW AWAY!</h3>
                  <span className="text-2xl font-mono text-neutral-400 block font-bold">
                    Crashed at {currentMultiplier.toFixed(2)}x
                  </span>
                  <p className="text-xs text-neutral-500">
                    Your virtual budget of ₦{parseFloat(aviatorStake).toLocaleString()} evaporated into Lagos air.
                  </p>
                </motion.div>
              )}

              {aviatorState === 'CASHED_OUT' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-3 z-10"
                >
                  <div className="w-16 h-16 bg-bet-green-dark border border-bet-green-bright/35 rounded-full flex items-center justify-center mx-auto text-3xl animate-pulse">
                    💰
                  </div>
                  <h3 className="font-display font-black text-bet-green-bright text-2xl uppercase tracking-wide">SUCCESSFUL ESCAPE!</h3>
                  <span className="text-base font-mono text-neutral-400 block">
                    Cashed out at <strong className="text-white">{currentMultiplier.toFixed(2)}x</strong>
                  </span>
                  <p className="text-lg font-mono font-black text-bet-gold">
                    +₦{winningPayout.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5">Your Flight Stake (₦)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={aviatorStake}
                  onChange={(e) => setAviatorStake(e.target.value)}
                  disabled={aviatorState === 'FLYING'}
                  className="flex-1 bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-bet-red"
                />
                <button
                  onClick={() => setAviatorStake('2000')}
                  disabled={aviatorState === 'FLYING'}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold px-3 py-1 text-xs rounded-xl font-mono border border-neutral-800"
                >
                  2K
                </button>
                <button
                  onClick={() => setAviatorStake('10000')}
                  disabled={aviatorState === 'FLYING'}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-300 font-bold px-3 py-1 text-xs rounded-xl font-mono border border-neutral-800"
                >
                  10K
                </button>
              </div>
            </div>

            <div>
              {aviatorState === 'FLYING' ? (
                <button
                  onClick={cashOutAviator}
                  className="w-full bg-bet-green-medium hover:bg-bet-green-bright text-white hover:text-black font-black py-4 rounded-xl transition duration-150 text-base uppercase flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-bet-green-medium/20 active:scale-95"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  CASH OUT ₦{(parseFloat(aviatorStake) * currentMultiplier).toFixed(0)}
                </button>
              ) : (
                <button
                  onClick={startAviatorFlight}
                  className="w-full bg-bet-red hover:bg-red-500 text-white font-extrabold py-4 rounded-xl transition duration-150 text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 animate-pulse"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Launch Flight (Fly Plane)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          GAME 2: ALHAJI'S DICE DUEL VIEW
          ========================================== */}
      {activeGame === 'dice' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Arena table */}
          <div className="h-64 bg-gradient-to-b from-neutral-950 to-neutral-900 border border-neutral-850 rounded-2xl p-5 flex flex-col justify-between relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Alhaji's Street Dice Table</span>
              <span className="text-xs bg-bet-gold/10 text-bet-gold border border-bet-gold/30 px-2 py-0.5 rounded font-mono">
                Odds: Under 7 (1.95x) | Seven (5.80x) | Over 7 (1.95x)
              </span>
            </div>

            {/* Dices showcase container */}
            <div className="flex items-center justify-center gap-6 py-6">
              {isRollingDice ? (
                <div className="flex gap-6">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    className="w-16 h-16 bg-neutral-100 border-4 border-neutral-300 rounded-xl flex items-center justify-center text-3xl font-bold text-black font-display shadow-2xl"
                  >
                    🎲
                  </motion.div>
                  <motion.div
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
                    className="w-16 h-16 bg-neutral-100 border-4 border-neutral-300 rounded-xl flex items-center justify-center text-3xl font-bold text-black font-display shadow-2xl"
                  >
                    🎲
                  </motion.div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-neutral-100 border-4 border-neutral-300 rounded-2xl flex flex-col items-center justify-center text-3xl font-black text-neutral-950 font-display shadow-2xl relative"
                  >
                    <span className="text-4xl">{rolledDice[0]}</span>
                    <span className="absolute bottom-1 text-[8px] font-mono font-bold text-neutral-400">DICE A</span>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-neutral-100 border-4 border-neutral-300 rounded-2xl flex flex-col items-center justify-center text-3xl font-black text-neutral-950 font-display shadow-2xl relative"
                  >
                    <span className="text-4xl">{rolledDice[1]}</span>
                    <span className="absolute bottom-1 text-[8px] font-mono font-bold text-neutral-400">DICE B</span>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Outcome tag footer */}
            <div className="text-center">
              {isRollingDice ? (
                <span className="text-xs font-mono text-neutral-400 animate-pulse uppercase">
                  Alhaji is shaking the dice container vigorously...
                </span>
              ) : diceOutcome ? (
                <div className="space-y-1">
                  <span className={`text-base font-mono font-black ${diceOutcome === 'WON' ? 'text-bet-green-bright' : 'text-bet-red'}`}>
                    Total Sum: {rolledDice[0] + rolledDice[1]} ({rolledDice[0] + rolledDice[1] === 7 ? 'Exactly 7!' : rolledDice[0] + rolledDice[1] > 7 ? 'Over 7' : 'Under 7'})
                  </span>
                  <p className="text-[10px] font-mono text-neutral-500">
                    You selected <strong className="text-neutral-300">{diceSelection}</strong>. Result was {diceOutcome}.
                  </p>
                </div>
              ) : (
                <span className="text-xs text-neutral-500 font-mono">
                  Select your prediction bracket, specify your stake size, and roll to duel Alhaji.
                </span>
              )}
            </div>
          </div>

          {/* Predict Selection Buttons row */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-neutral-400 uppercase block">Predict Sum Outcome</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDiceSelection('UNDER')}
                disabled={isRollingDice}
                className={`py-3.5 rounded-xl font-mono text-xs font-bold transition border ${
                  diceSelection === 'UNDER'
                    ? 'bg-bet-gold text-black border-bet-gold'
                    : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                }`}
              >
                Under 7
                <span className="text-[9px] text-neutral-500 block font-normal mt-0.5">Odds: 1.95x</span>
              </button>

              <button
                onClick={() => setDiceSelection('SEVEN')}
                disabled={isRollingDice}
                className={`py-3.5 rounded-xl font-mono text-xs font-bold transition border ${
                  diceSelection === 'SEVEN'
                    ? 'bg-bet-gold text-black border-bet-gold'
                    : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                }`}
              >
                Exactly 7
                <span className="text-[9px] text-neutral-500 block font-normal mt-0.5">Odds: 5.80x</span>
              </button>

              <button
                onClick={() => setDiceSelection('OVER')}
                disabled={isRollingDice}
                className={`py-3.5 rounded-xl font-mono text-xs font-bold transition border ${
                  diceSelection === 'OVER'
                    ? 'bg-bet-gold text-black border-bet-gold'
                    : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                }`}
              >
                Over 7
                <span className="text-[9px] text-neutral-500 block font-normal mt-0.5">Odds: 1.95x</span>
              </button>
            </div>
          </div>

          {/* Stake & Roll Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5">Dice Stake Size (₦)</label>
              <input
                type="number"
                value={diceStake}
                onChange={(e) => setDiceStake(e.target.value)}
                disabled={isRollingDice}
                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-sm font-mono text-white focus:outline-none focus:border-bet-gold"
              />
            </div>

            <button
              onClick={playDiceDuel}
              disabled={isRollingDice}
              className={`w-full font-extrabold py-4 rounded-xl transition duration-150 text-sm uppercase flex items-center justify-center gap-2 active:scale-95 ${
                isRollingDice
                  ? 'bg-neutral-800 text-neutral-600 border border-neutral-850 cursor-default animate-pulse'
                  : 'bg-bet-gold text-black hover:bg-yellow-400 shadow-lg shadow-yellow-950/20'
              }`}
            >
              🎲 Roll Dice Duel
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          GAME 3: ALHAJI'S CUPS & BALL VIEW
          ========================================== */}
      {activeGame === 'cup' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Shuffling Arena */}
          <div className="h-64 bg-neutral-950 border border-neutral-850 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Table top wooden-style border background line */}
            <div className="absolute bottom-12 inset-x-0 h-1.5 bg-neutral-800 opacity-50" />
            
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Broad Street Shell Game</span>
              <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded font-mono">
                Multiplier: 2.80x
              </span>
            </div>

            {/* Cups visual layouts container */}
            <div className="flex items-center justify-center gap-12 py-4 z-10">
              {[0, 1, 2].map((cupIndex) => {
                // Find visually where this cup is placed according to shufflePositions array
                const visualPositionIndex = shufflePositions.indexOf(cupIndex);
                const isSelected = selectedCup === cupIndex;
                const isWinning = winningCup === cupIndex;

                return (
                  <motion.div
                    key={cupIndex}
                    layout
                    transition={{ type: 'spring', stiffness: 180, damping: 15 }}
                    onClick={() => selectCupToReveal(cupIndex)}
                    className={`flex flex-col items-center cursor-pointer select-none group relative ${
                      isShufflingCups ? 'pointer-events-none' : ''
                    }`}
                  >
                    {/* Animated cup visual */}
                    <motion.div
                      animate={
                        cupState === 'REVEALED' && isSelected
                          ? { y: -45, rotate: -5 }
                          : cupState === 'REVEALED' && !isSelected && isWinning
                          ? { y: -30, opacity: 0.8 } // lift winning cup slightly too to reveal ball
                          : { y: 0, rotate: 0 }
                      }
                      className={`w-16 h-20 rounded-t-3xl rounded-b-md border-b-4 flex flex-col items-center justify-center text-2xl font-bold shadow-xl transition-all duration-300 ${
                        cupState === 'REVEALED'
                          ? isSelected
                            ? isWinning
                              ? 'bg-bet-green-dark border-bet-green-bright text-bet-green-bright'
                              : 'bg-neutral-800 border-bet-red text-bet-red'
                            : 'bg-neutral-800 border-neutral-700 opacity-60'
                          : 'bg-purple-950 border-purple-600 text-purple-300 hover:bg-purple-900 hover:border-purple-500'
                      }`}
                    >
                      🥤
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase mt-1">
                        CUP {cupIndex + 1}
                      </span>
                    </motion.div>

                    {/* Hidden Item ball beneath */}
                    {cupState === 'REVEALED' && (
                      <div className="absolute bottom-1 flex items-center justify-center z-[-1]">
                        {isWinning ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.4, 1] }}
                            className="text-2xl filter drop-shadow-[0_0_8px_#ffcc00] animate-pulse"
                          >
                            💎
                          </motion.div>
                        ) : (
                          <span className="text-lg">🏜️</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Helper status text */}
            <div className="text-center z-10">
              {isShufflingCups ? (
                <span className="text-xs font-mono text-purple-400 animate-pulse uppercase">
                  Alhaji is shuffling the cups at supersonic speeds! Keep your eyes glued...
                </span>
              ) : cupState === 'IDLE' ? (
                <span className="text-xs text-neutral-500 font-mono">
                  Set stake capital and click "Shuffle Cups" to hide the Lagos Diamond!
                </span>
              ) : cupState === 'SHUFFLED' ? (
                <span className="text-xs text-bet-gold font-mono uppercase animate-pulse">
                  Cups Shuffle Complete! Click any cup above to find the Lagos Diamond!
                </span>
              ) : (
                <div className="space-y-0.5">
                  <span className={`text-sm font-mono font-black ${selectedCup === winningCup ? 'text-bet-green-bright' : 'text-bet-red'}`}>
                    {selectedCup === winningCup ? '★ WINNER! DIAMOND FOUND ★' : '☠ EMPTY SHELL (LAGOS SWINDLE) ☠'}
                  </span>
                  <p className="text-[10px] font-mono text-neutral-400">
                    The Diamond was under <strong className="text-white">Cup {winningCup + 1}</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stake & Controls row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5">Cup Bet Stake (₦)</label>
              <input
                type="number"
                value={cupStake}
                onChange={(e) => setCupStake(e.target.value)}
                disabled={isShufflingCups || cupState === 'SHUFFLED'}
                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3.5 text-sm font-mono text-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <button
              onClick={startCupShuffle}
              disabled={isShufflingCups || cupState === 'SHUFFLED'}
              className={`w-full font-extrabold py-4 rounded-xl transition duration-150 text-sm uppercase flex items-center justify-center gap-2 active:scale-95 ${
                isShufflingCups
                  ? 'bg-neutral-800 text-neutral-600 border border-neutral-850 cursor-default animate-pulse'
                  : cupState === 'SHUFFLED'
                  ? 'bg-neutral-800 text-neutral-500 border border-neutral-850 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/20'
              }`}
            >
              🥤 Shuffle & Hide Diamond
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
