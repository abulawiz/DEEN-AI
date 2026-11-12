import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  BookOpen,
  Sun,
  Moon,
  Award,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

type AuthMode = 'login' | 'register' | 'reset';

export const LoginPage: React.FC = () => {
  const { loginByEmail, register, resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'login') {
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    } else if (mode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginByEmail(email, password);
      } else if (mode === 'register') {
        const result = await register(email, fullName, 'user', password);
        if (result?.needsEmailConfirmation) {
          setSuccessMsg(
            'Account created! Please check your email inbox to verify your address before signing in.'
          );
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (mode === 'reset') {
        await resetPassword(email);
        setSuccessMsg('Password recovery instructions have been sent to your email address.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to complete request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#040806] text-neutral-900 dark:text-neutral-100 flex flex-col justify-between p-4 sm:p-6 transition-colors">
      {/* Top Bar with Theme Toggle */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-emerald-950 dark:text-white">
              DEEN <span className="text-amber-500">AI</span>
            </span>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Your Intelligent Islamic Companion
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-amber-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-xs"
          aria-label="Toggle Theme Mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Black Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Center Card */}
      <div className="max-w-4xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#0b130f] rounded-3xl shadow-2xl border border-emerald-100 dark:border-neutral-800 overflow-hidden">
        {/* Left Islamic Welcome Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <p className="font-arabic text-2xl text-amber-300 mb-3 text-right" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Assalamu Alaikum
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Bringing authentic Islamic knowledge closer to everyone through the Noble Qur&apos;an, authentic Sunnah, and recognized scholarly explanations.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-xs text-emerald-100/90">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>Evidence-based answers with Surah, Verse, and Hadith references.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>Complete Qur&apos;an, Hadith Collections, Tafsir, Adhkar, and Learning Centre.</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-200/80">
            Dedicated exclusively to authentic Islamic learning and guidance.
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {mode === 'login'
                ? 'Sign In to Your Account'
                : mode === 'register'
                ? 'Create Your Account'
                : 'Reset Your Password'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {mode === 'login'
                ? 'Enter your email and password to access DEEN AI.'
                : mode === 'register'
                ? 'Register to save your consultations, learning progress, and preferences.'
                : 'Enter your registered email to receive password recovery instructions.'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-[#060b08] rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'login'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'register'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('reset')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                mode === 'reset'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Recover</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : mode === 'register'
                ? 'Create Account'
                : 'Send Recovery Link'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Attribution */}
      <footer className="max-w-5xl w-full mx-auto text-center py-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-amber-300">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Abulawzat Digital Solution</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
          Department of Computer Science
        </p>
      </footer>
    </div>
  );
};
