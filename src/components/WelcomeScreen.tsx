import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Coins, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { time: 0, text: "🔌 Booting Baba Blue's high-intelligence predictive grid..." },
  { time: 1500, text: "📈 Balancing Ponzi-Yield High Core (PYHC) interest matrices..." },
  { time: 3000, text: "🎲 Shuffling Alhaji's lucky dice and greasing broad-street cups..." },
  { time: 4500, text: "💵 Synthesizing virtual Naira collateral with Lekki sand valuation..." },
  { time: 6000, text: "✈️ Warming up the red-eye Aviator engine..." },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0].text);

  // Run the 7-second loading timer
  useEffect(() => {
    const totalDuration = 7000; // 7 seconds
    const intervalTime = 50; // Update progress every 50ms
    const stepIncrement = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + stepIncrement, 100);
        if (next >= 100) {
          clearInterval(timer);
          // Let the user admire the 100% state for a split second, then complete
          setTimeout(() => {
            onComplete();
          }, 300);
        }
        return next;
      });
    }, intervalTime);

    // Dynamic loading text updates based on elapsed time
    const textTimers = LOADING_STEPS.map((step, index) => {
      return setTimeout(() => {
        setLoadingText(step.text);
      }, step.time);
    });

    return () => {
      clearInterval(timer);
      textTimers.forEach(clearTimeout);
    };
  }, [onComplete]);

  // Floating elements to create a luxurious immersive effect
  const floatingIcons = [
    { emoji: "⚽", top: "15%", left: "10%", delay: 0 },
    { emoji: "📈", top: "25%", right: "15%", delay: 1.5 },
    { emoji: "🎲", top: "70%", left: "12%", delay: 0.8 },
    { emoji: "💰", top: "75%", right: "10%", delay: 2 },
    { emoji: "🚀", top: "45%", left: "80%", delay: 1.2 },
    { emoji: "🏆", top: "85%", left: "45%", delay: 1.8 },
  ];

  return (
    <div
      id="welcome-screen-overlay"
      className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center text-white overflow-hidden p-6 select-none"
    >
      {/* Immersive radial glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bet-red/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bet-gold/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Floating speculative badges background layer */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute text-4xl pointer-events-none opacity-20 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]Hidden sm:block"
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Main Card Content container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center space-y-8 max-w-xl w-full z-10 px-4 flex flex-col items-center"
      >
        {/* Animated Brand Mark */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-bet-red via-neutral-900 to-bet-gold p-[2px] flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.25)]"
          >
            <div className="w-full h-full bg-neutral-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-bet-gold" />
            </div>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 bg-bet-red text-white p-1 rounded-full text-xs shadow-md"
          >
            <Flame className="w-4 h-4 fill-current animate-pulse" />
          </motion.div>
        </div>

        {/* Brand Naming Hierarchy */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-bet-gold uppercase bg-bet-gold/5 px-3.5 py-1.5 rounded-full border border-bet-gold/15">
            🇳🇬 NIGERIAN SPECULATOR ECOSYSTEM
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white mt-1">
            SPECUBET <span className="bg-gradient-to-r from-bet-red to-bet-gold bg-clip-text text-transparent">HUB</span>
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-sans">
            Welcome to Lagos' leading virtual ticket accumulator & speculate engine. Get premium access to Baba Blue's Backroom and maximum high-APR high-risk assets.
          </p>
        </div>

        {/* Ticking Progress bar & status info */}
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between items-end text-xs font-mono">
            <span className="text-neutral-500 uppercase tracking-wider font-bold">SYSTEM STATUS:</span>
            <span className="text-bet-gold font-bold">{Math.floor(progress)}%</span>
          </div>

          {/* Loading bar */}
          <div className="h-2 w-full bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden relative">
            {/* Active glowing progress bar */}
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-bet-red via-bet-gold to-bet-green-bright rounded-full relative"
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Dynamic rotating Lagos funny messages */}
          <div className="h-8 flex items-center justify-center">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-mono text-neutral-300 text-center font-semibold"
            >
              {loadingText}
            </motion.p>
          </div>
        </div>

        {/* Skip button for comfortable preview navigation */}
        <motion.button
          onClick={onComplete}
          className="text-[10px] font-mono text-neutral-500 hover:text-white transition uppercase border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-lg bg-neutral-950/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏩ Skip intro & enter lobby
        </motion.button>
      </motion.div>

      {/* Trust Advisory Badge Footer */}
      <div className="absolute bottom-6 flex items-center gap-2.5 bg-neutral-900/60 px-4 py-2.5 rounded-xl border border-neutral-850 text-[10px] font-mono text-neutral-400 max-w-sm text-center">
        <AlertCircle className="w-4 h-4 text-bet-red shrink-0" />
        <span>"Staking on Alhaji's platform has a 99% satisfaction rate among Alhaji's direct relatives."</span>
      </div>
    </div>
  );
};
