import React, { useState } from 'react';
import { Settings, Moon, Sun, ShieldAlert, Coins, RefreshCw, Volume2, VolumeX, User, HelpCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsPanelProps {
  theme: 'dark' | 'light';
  onThemeChange: (newTheme: 'dark' | 'light') => void;
  username: string;
  onUsernameChange: (newUsername: string) => void;
  onResetBalance: (amount: number) => void;
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  simSpeed: 'NORMAL' | 'FAST' | 'INSTANT';
  onSimSpeedChange: (speed: 'NORMAL' | 'FAST' | 'INSTANT') => void;
  onTriggerAlert: (msg: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  theme,
  onThemeChange,
  username,
  onUsernameChange,
  onResetBalance,
  soundEnabled,
  onSoundToggle,
  simSpeed,
  onSimSpeedChange,
  onTriggerAlert,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername.trim()) {
      onTriggerAlert("❌ Nickname cannot be empty, egbon!");
      return;
    }
    onUsernameChange(tempUsername);
    onTriggerAlert(`🎉 Name successfully updated to "${tempUsername}" inside Alhaji's system!`);
  };

  const handleTopup = (amount: number) => {
    onResetBalance(amount);
    onTriggerAlert(`💰 Account funded with ₦${amount.toLocaleString()} capital! Alhaji is smiling.`);
  };

  const isDark = theme === 'dark';

  return (
    <div id="settings-panel-wrapper">
      <button
        id="btn-open-settings"
        onClick={() => {
          setTempUsername(username);
          setIsOpen(true);
        }}
        className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
          isDark
            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850'
            : 'bg-white border-neutral-200 text-neutral-700 hover:text-black hover:bg-neutral-50'
        }`}
      >
        <Settings className="w-4 h-4 text-bet-gold" />
        <span className="hidden sm:inline">Portal Settings</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border p-6 relative shadow-2xl ${
                isDark ? 'bg-neutral-950 border-neutral-850 text-white' : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              {/* Close Icon */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-xs font-mono font-bold p-1 hover:opacity-80 border rounded border-neutral-700/20 text-neutral-400"
              >
                ✕
              </button>

              <div className="text-center pb-4 border-b border-neutral-800/15 mb-5">
                <div className="w-11 h-11 bg-bet-gold/15 rounded-full flex items-center justify-center mx-auto mb-2 border border-bet-gold/20">
                  <Settings className="w-5 h-5 text-bet-gold" />
                </div>
                <h3 className="font-display font-black text-lg">Specubet Console Configuration</h3>
                <p className="text-[11px] text-neutral-400 mt-1">Configure your VIP portal parameters & simulation variables</p>
              </div>

              <div className="space-y-5">
                {/* 1. Theme Selection Toggle - Dark Mode / Light Mode */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block">Visual Theme Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onThemeChange('dark');
                        onTriggerAlert("🌙 Dark Theme configured. Eye-safe night speculator mode active.");
                      }}
                      className={`py-3.5 rounded-xl font-mono text-xs font-bold transition border flex items-center justify-center gap-2 ${
                        isDark
                          ? 'bg-neutral-900 border-bet-gold text-bet-gold shadow-md'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-bet-gold" />
                      <span>Alhaji Dark</span>
                    </button>

                    <button
                      onClick={() => {
                        onThemeChange('light');
                        onTriggerAlert("☀️ Light Theme configured. High-contrast day speculator mode active.");
                      }}
                      className={`py-3.5 rounded-xl font-mono text-xs font-bold transition border flex items-center justify-center gap-2 ${
                        !isDark
                          ? 'bg-neutral-100 border-bet-gold text-neutral-950 shadow-md'
                          : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span>Sunny Light</span>
                    </button>
                  </div>
                </div>

                {/* 2. Customize Username */}
                <form onSubmit={handleSaveUsername} className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block">Vip Member Handle</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        placeholder="Chairman Lagos"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-3 bg-bet-gold hover:bg-yellow-400 text-black font-extrabold rounded-xl text-xs uppercase shadow transition duration-150 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </form>

                {/* 3. Simulator Speed Tuning */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block">Simulation Core Frequency</label>
                    <span className="text-[10px] font-mono text-bet-gold font-bold bg-bet-gold/10 px-1.5 py-0.5 rounded uppercase">
                      {simSpeed}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['NORMAL', 'FAST', 'INSTANT'] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          onSimSpeedChange(spd);
                          onTriggerAlert(`⚡ Simulation velocity set to ${spd}! Matches cycle at customized rate.`);
                        }}
                        className={`py-2 px-1 rounded-lg font-mono text-[10px] font-bold transition border uppercase ${
                          simSpeed === spd
                            ? 'bg-bet-gold text-black border-bet-gold'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:text-black'
                        }`}
                      >
                        {spd === 'NORMAL' ? 'Standard' : spd === 'FAST' ? 'High Speed' : 'Instant 90’'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. instant Nigerian Naira Refill */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block">Simulated Naira Core Injection</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleTopup(10000)}
                      className="py-2 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-bold font-mono text-xs transition"
                    >
                      +₦10K
                    </button>
                    <button
                      onClick={() => handleTopup(50000)}
                      className="py-2 px-3 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-bold font-mono text-xs transition"
                    >
                      +₦50K
                    </button>
                    <button
                      onClick={() => handleTopup(250000)}
                      className="py-2 px-3 rounded-lg bg-bet-gold/15 border border-bet-gold/30 hover:border-bet-gold text-bet-gold font-black font-mono text-xs transition"
                    >
                      +₦250K VIP
                    </button>
                  </div>
                </div>

                {/* 5. Sound effects toggle (visualized alerts sound status) */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-850">
                  <div className="flex items-center gap-2">
                    {soundEnabled ? (
                      <Volume2 className="w-4.5 h-4.5 text-bet-green-bright animate-bounce" />
                    ) : (
                      <VolumeX className="w-4.5 h-4.5 text-neutral-500" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Simulated Audio Indicators</span>
                      <span className="text-[9px] text-neutral-500">Enable synthesized click alert noises</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSoundToggle(!soundEnabled);
                      onTriggerAlert(soundEnabled ? "🔇 Audio synthesized cues disabled." : "🔊 Audio synthesized cues active! Bleep bloop.");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                      soundEnabled
                        ? 'bg-bet-green-dark text-bet-green-bright border border-bet-green-bright/20'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700/30'
                    }`}
                  >
                    {soundEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Settings Disclaimer Footer */}
              <div className="mt-5 pt-4 border-t border-neutral-800/10 flex items-start gap-2 text-[9px] text-neutral-400">
                <ShieldAlert className="w-4 h-4 text-bet-gold shrink-0 mt-0.5" />
                <span>Note: This is a 100% compliant and fully client-side sandbox environment. No actual money or credit reports are modified by these operations.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
