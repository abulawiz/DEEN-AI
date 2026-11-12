import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, Mail, User, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginByEmail, register, resetPassword, isSupabaseAuthActive } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (isSupabaseAuthActive && !password) {
          setError('Please enter your password.');
          return;
        }
        const ok = await loginByEmail(email, password || undefined);
        if (ok) {
          onClose();
        } else {
          setError('No account found with that email. You may register a new account or use tariq@deen.ai / admin@deen.ai.');
        }
      } else if (mode === 'register') {
        if (!fullName.trim() || !email.trim()) {
          setError('Please enter your full name and email.');
          return;
        }
        if (isSupabaseAuthActive && password.length < 6) {
          setError('Password must be at least 6 characters for Supabase Auth.');
          return;
        }
        const result = await register(email, fullName, 'user', password || undefined);
        if (result?.needsEmailConfirmation) {
          setSuccessMsg('Registration successful! Please check your inbox to verify your email before signing in.');
        } else {
          setSuccessMsg('Account registered and signed in successfully!');
          setTimeout(() => {
            onClose();
            setSuccessMsg('');
          }, 1200);
        }
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setError('Please enter your email address.');
          return;
        }
        if (isSupabaseAuthActive) {
          await resetPassword(email);
        }
        setSuccessMsg('Password recovery instructions have been sent to your email address.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 dark:border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {mode === 'login' ? 'Sign In to DEEN AI' : mode === 'register' ? 'Create Your Account' : 'Recover Password'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Your Intelligent Islamic Companion
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-[#070d0a] rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'login'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('reset'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mode === 'reset'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Abdullah Yusuf"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tariq@deen.ai"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : mode === 'register'
              ? 'Create Account'
              : 'Send Recovery Email'}
          </button>
        </form>
      </div>
    </div>
  );
};
