import React from 'react';
import {
  MessageSquare,
  BookOpen,
  Scroll,
  Library,
  Sun,
  GraduationCap,
  Shield,
  Settings,
  Sparkles,
  Compass,
  CheckCircle2,
  Moon,
  Award,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export type ActiveTab = 'dashboard' | 'chat' | 'quran' | 'hadith' | 'library' | 'reminders' | 'learning' | 'admin' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onOpenSettings
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare, badge: 'Live' },
    { id: 'quran', label: 'The Holy Qur\'an', icon: BookOpen },
    { id: 'hadith', label: 'Hadith Repository', icon: Scroll },
    { id: 'library', label: 'Islamic Library', icon: Library },
    { id: 'reminders', label: 'Daily Adhkar & Sunnah', icon: Sun },
    { id: 'learning', label: 'Learning Centre', icon: GraduationCap, badge: 'Courses' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#064e3b] dark:bg-[#04120b] text-white flex flex-col justify-between border-r border-emerald-900 dark:border-emerald-950/80 shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-6 border-b border-emerald-800/80 dark:border-emerald-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-2 ring-amber-300/40">
                  <Sparkles className="w-6 h-6 text-emerald-950 fill-emerald-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                      DEEN <span className="text-amber-400 font-extrabold">AI</span>
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-800/90 dark:bg-emerald-900 text-amber-300 border border-amber-400/30">
                      v1.0
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 tracking-wide font-medium">
                    Your Intelligent Islamic Companion
                  </p>
                </div>
              </div>

              {/* Theme toggle in sidebar */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-emerald-900/80 dark:bg-neutral-900 text-amber-300 hover:text-white transition-colors"
                title={theme === 'dark' ? 'Light Mode' : 'Black Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Sacred Guidance Pill */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-900/60 dark:bg-emerald-950/80 border border-emerald-700/50 dark:border-emerald-800/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[11px] text-emerald-100 font-medium leading-tight">
                Qur'an & Sunnah upon the understanding of the Salaf
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-340px)]">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              Navigation
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-md font-semibold ring-1 ring-emerald-500/40'
                      : 'text-emerald-100/90 hover:bg-emerald-800/60 dark:hover:bg-emerald-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-300' : 'text-emerald-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Section */}
            <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
              Administration & System
            </div>
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md font-semibold ring-1 ring-amber-400/50'
                  : 'text-amber-200/90 hover:bg-emerald-800/60 dark:hover:bg-emerald-900/40 hover:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Admin Dashboard</span>
              </div>
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 rounded">
                  Admin
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom User Profile, Switcher & Author Credit */}
        <div className="p-4 border-t border-emerald-800/80 dark:border-emerald-900/60 bg-emerald-950/40 dark:bg-black/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.full_name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/60"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.full_name || 'Member'}
                </p>
                <p className="text-[10px] text-emerald-300 capitalize">
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/80 dark:hover:bg-emerald-900 transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => logout()}
                className="p-2 rounded-lg text-emerald-300 hover:text-red-300 hover:bg-emerald-800/80 dark:hover:bg-emerald-900 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Author & Institutional Attribution */}
          <div className="pt-2.5 border-t border-emerald-800/50 dark:border-emerald-900/60 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 font-bold tracking-wide">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Abulawzat Digital Solution</span>
            </div>
            <p className="text-[9px] text-emerald-200/80 font-medium mt-0.5">
              Department of Computer Science
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
