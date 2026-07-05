import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, User, RefreshCw, KeyRound, CheckCircle, ArrowRight, UserPlus, LogIn, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UserAccount {
  username: string;
  email: string;
  passwordHash: string;
  balance: number;
}

interface AuthPanelProps {
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
  currentUser: UserAccount | null;
  onUpdateUserBalance: (newBalance: number) => void;
  theme: 'dark' | 'light';
}

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    username: "ChairmanLagos",
    email: "chairman@betking.com",
    passwordHash: "king123",
    balance: 25000,
  },
  {
    username: "BabaBlueFans",
    email: "alhajispeculator@gmail.com",
    passwordHash: "babalue123",
    balance: 50000,
  }
];

export const AuthPanel: React.FC<AuthPanelProps> = ({
  onLoginSuccess,
  onLogout,
  currentUser,
  onUpdateUserBalance,
  theme,
}) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('specubet_accounts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return DEFAULT_ACCOUNTS;
  });

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'OTP' | 'NEW_PASSWORD'>('LOGIN');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('specubet_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const triggerMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      triggerMessage("❌ Please enter both your email and password.", "error");
      return;
    }

    const found = accounts.find(
      (acc) => acc.email.toLowerCase() === emailInput.toLowerCase() && acc.passwordHash === passwordInput
    );

    if (found) {
      onLoginSuccess(found);
      triggerMessage(`🎉 Welcome back, ${found.username}! Account successfully authenticated.`, "success");
      setIsModalOpen(false);
      // Reset inputs
      setEmailInput('');
      setPasswordInput('');
    } else {
      triggerMessage("❌ Invalid email or password. Alhaji says check your parameters!", "error");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !emailInput || !passwordInput) {
      triggerMessage("❌ All credentials are required to draft a membership card.", "error");
      return;
    }

    const exists = accounts.some((acc) => acc.email.toLowerCase() === emailInput.toLowerCase());
    if (exists) {
      triggerMessage("❌ This email is already registered inside Baba Blue's registry.", "error");
      return;
    }

    const newAccount: UserAccount = {
      username: usernameInput,
      email: emailInput,
      passwordHash: passwordInput,
      balance: 25000, // Initial premium capital bonus
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    onLoginSuccess(newAccount);
    triggerMessage(`🎉 Account registered successfully! Welcome, ${usernameInput}. enjoy ₦25,000 bonus capital!`, "success");
    setIsModalOpen(false);
    
    // Clear registration fields
    setUsernameInput('');
    setEmailInput('');
    setPasswordInput('');
  };

  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      triggerMessage("❌ Please type your registered email address.", "error");
      return;
    }

    const found = accounts.some((acc) => acc.email.toLowerCase() === resetEmail.toLowerCase());
    if (!found) {
      triggerMessage("❌ No account associated with this email address.", "error");
      return;
    }

    // Move to simulated OTP screen
    setMode('OTP');
    triggerMessage("✉️ Reset OTP code has been simulated! Type '1234' to authorize the reset.", "success");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') {
      setMode('NEW_PASSWORD');
      triggerMessage("🔑 OTP Verified! Please enter your new high-security password.", "success");
    } else {
      triggerMessage("❌ Incorrect OTP! Alhaji says use the master code '1234' for preview purposes.", "error");
    }
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) {
      triggerMessage("❌ Password cannot be empty.", "error");
      return;
    }

    // Update password inside accounts list
    const updated = accounts.map((acc) => {
      if (acc.email.toLowerCase() === resetEmail.toLowerCase()) {
        return {
          ...acc,
          passwordHash: newPasswordInput,
        };
      }
      return acc;
    });

    setAccounts(updated);
    setMode('LOGIN');
    setEmailInput(resetEmail);
    triggerMessage("🎉 Password reset successfully! Please log in with your new password.", "success");
    setResetEmail('');
    setOtpInput('');
    setNewPasswordInput('');
  };

  const isDark = theme === 'dark';

  return (
    <div id="auth-panel-wrapper" className="flex items-center gap-2">
      {currentUser ? (
        <div className="flex items-center gap-3">
          {/* User profile capsule with Betking-style VIP gold crown */}
          <div className="flex flex-col items-end text-right">
            <span className="text-xs font-bold flex items-center gap-1">
              <span className="text-bet-gold">👑</span>
              <span className={isDark ? 'text-white' : 'text-neutral-900'}>{currentUser.username}</span>
            </span>
            <span className="text-[10px] font-mono text-bet-gold font-semibold">
              VIP Level 1 • Stake Active
            </span>
          </div>

          <button
            id="btn-logout"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            id="btn-open-login"
            onClick={() => {
              setMode('LOGIN');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-850 transition flex items-center gap-1 border border-neutral-800"
          >
            <LogIn className="w-3.5 h-3.5 text-bet-gold" />
            Sign In
          </button>
          
          <button
            id="btn-open-register"
            onClick={() => {
              setMode('REGISTER');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-black bg-bet-gold hover:bg-yellow-400 transition flex items-center gap-1 shadow-lg shadow-yellow-950/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border p-6 overflow-hidden relative shadow-2xl ${
                isDark 
                  ? 'bg-neutral-950 border-neutral-850 text-white' 
                  : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-xs font-mono font-bold p-1 hover:opacity-80 border rounded border-neutral-700/20 text-neutral-400"
              >
                ✕
              </button>

              {/* Title / Header segment */}
              <div className="text-center pb-5 border-b border-neutral-800/10 mb-5">
                <div className="w-12 h-12 bg-bet-gold/10 border border-bet-gold/25 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <KeyRound className="w-6 h-6 text-bet-gold animate-pulse" />
                </div>
                <h3 className="font-display font-black text-xl">
                  {mode === 'LOGIN' && 'Sign In to Betking Specubet'}
                  {mode === 'REGISTER' && 'Create Specubet Account'}
                  {mode === 'FORGOT' && 'Reset Alhaji Password'}
                  {mode === 'OTP' && 'Verify Security Code'}
                  {mode === 'NEW_PASSWORD' && 'Set Secure Password'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {mode === 'LOGIN' && 'Enter your premium bookie credentials'}
                  {mode === 'REGISTER' && 'Join Lagos’ highest-APR specu-circle'}
                  {mode === 'FORGOT' && 'Simulate recovery instructions instantly'}
                  {mode === 'OTP' && 'Enter verification OTP delivered via Baba Blue SMS'}
                  {mode === 'NEW_PASSWORD' && 'Ensure your funds are 100% fortified'}
                </p>
              </div>

              {/* Messages Toast within Modal */}
              {message && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono mb-4 border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : message.type === 'error'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-bet-gold/10 text-bet-gold border-bet-gold/20'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Login Form */}
              {mode === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="chairman@betking.com"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block">Secret Password</label>
                      <button
                        type="button"
                        onClick={() => setMode('FORGOT')}
                        className="text-[10px] text-bet-gold font-mono hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-bet-gold text-black font-extrabold rounded-xl transition duration-150 text-xs uppercase shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Authorize Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center text-xs mt-2 text-neutral-400">
                    Don't have a ticket pass?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('REGISTER')}
                      className="text-bet-gold font-bold hover:underline"
                    >
                      Register Now
                    </button>
                  </div>

                  {/* Preloaded accounts helper advice */}
                  <div className="mt-4 p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-850 text-[10px] font-mono text-neutral-400">
                    💡 <strong>Test Accounts available:</strong>
                    <br />• Email: <code>chairman@betking.com</code> / Pass: <code>king123</code>
                    <br />• Email: <code>alhajispeculator@gmail.com</code> / Pass: <code>babalue123</code>
                  </div>
                </form>
              )}

              {/* Register Form */}
              {mode === 'REGISTER' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Username / Nickname</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="Alhaji Lekki"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="boss@speculator.ng"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Passphrase Key</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="At least 6 characters"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-bet-gold text-black font-extrabold rounded-xl transition duration-150 text-xs uppercase shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Register Membership</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <div className="text-center text-xs mt-2 text-neutral-400">
                    Already a certified high-roller?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('LOGIN')}
                      className="text-bet-gold font-bold hover:underline"
                    >
                      Sign In here
                    </button>
                  </div>
                </form>
              )}

              {/* Forgot Password Request Form */}
              {mode === 'FORGOT' && (
                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="chairman@betking.com"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-bet-gold text-black font-extrabold rounded-xl transition duration-150 text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    <span>Request OTP Reset</span>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('LOGIN')}
                    className="w-full py-2.5 text-xs text-neutral-400 hover:text-white text-center hover:underline font-mono"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}

              {/* OTP Code Form */}
              {mode === 'OTP' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl mb-2 text-xs text-bet-gold font-mono">
                    ⚠️ simulated OTP: Enter <strong>1234</strong>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Type 4-digit verification code</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="XXXX"
                      className={`w-full font-mono text-center text-lg tracking-[0.5em] py-3.5 rounded-xl border focus:outline-none focus:border-bet-gold ${
                        isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-bet-gold text-black font-extrabold rounded-xl transition duration-150 text-xs uppercase flex items-center justify-center gap-1"
                  >
                    <span>Authorize Key</span>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Set New Password Form */}
              {mode === 'NEW_PASSWORD' && (
                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">New secure password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-neutral-500" />
                      <input
                        type="password"
                        required
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="At least 6 characters"
                        className={`w-full font-mono text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:border-bet-gold ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-bet-gold text-black font-extrabold rounded-xl transition duration-150 text-xs uppercase flex items-center justify-center gap-1"
                  >
                    <span>Fortify & Update Password</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
