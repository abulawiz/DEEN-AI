import React from 'react';
import { Menu, AlertTriangle, ShieldAlert, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenAppealModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenAppealModal }) => {
  const { currentUser, isRestricted, isSuspended, restrictionSecondsRemaining } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#080d0a]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-emerald-950/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Islamic Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100 font-sans tracking-tight">
                السلام عليكم ورحمة الله وبركاته
              </h2>
              <span className="hidden sm:inline-block text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                (Peace and Mercy of Allah be upon you)
              </span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 font-medium hidden sm:block">
              {currentUser?.full_name ? `Welcome back, ${currentUser.full_name}` : 'Welcome to DEEN AI'} • Authentic Islamic AI Platform
            </p>
          </div>
        </div>

        {/* Right: Status Indicators & Light / Black Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Black Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-amber-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Black / Dark Mode'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Black Mode</span>
              </>
            )}
          </button>

          {/* Restriction / Policy Alert */}
          {isRestricted ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs font-semibold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                {isSuspended
                  ? 'Account Suspended'
                  : `Paused: ${formatCountdown(restrictionSecondsRemaining)}`}
              </span>
              <button
                onClick={onOpenAppealModal}
                className="underline hover:text-red-950 dark:hover:text-white font-bold ml-1"
              >
                Appeal
              </button>
            </div>
          ) : currentUser && currentUser.violation_count > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                {currentUser.violation_count === 1
                  ? '1 Warning on file'
                  : `${currentUser.violation_count} Policy Notices`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Authentic Sunnah Verified</span>
              <span className="sm:hidden">Verified</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
