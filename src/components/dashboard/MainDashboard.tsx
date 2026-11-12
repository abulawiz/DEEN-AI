import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Scroll,
  Sun,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { VERIFIED_QURAN_VERSES } from '../../data/quranData';
import { VERIFIED_HADITH_RECORDS } from '../../data/hadithData';
import { MORNING_ADHKAR } from '../../data/adhkarData';
import { ISLAMIC_COURSES } from '../../data/coursesData';
import { ActiveTab } from '../layout/Sidebar';

interface MainDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
  onSendDirectPrompt: (prompt: string) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onNavigate, onSendDirectPrompt }) => {
  const { currentUser } = useAuth();
  const [quickPrompt, setQuickPrompt] = useState('');

  const featuredVerse = VERIFIED_QURAN_VERSES[1]; // Ayat al-Kursi
  const featuredHadith = VERIFIED_HADITH_RECORDS[0]; // Bukhari 1
  const quickAdhkar = MORNING_ADHKAR[0]; // Sayyid al-Istighfar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onSendDirectPrompt(quickPrompt);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#0f766e] dark:from-[#032115] dark:via-[#053d29] dark:to-[#04281b] text-white p-6 sm:p-10 shadow-2xl border border-emerald-700/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 dark:bg-black/40 border border-emerald-400/30 text-amber-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEEN AI • Your Intelligent Islamic Companion</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
            السلام عليكم ورحمة الله وبركاته
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 dark:text-emerald-200 font-medium leading-relaxed">
            Welcome{currentUser?.full_name ? `, ${currentUser.full_name}` : ''}. Discover authentic answers from the Noble Qur'an, the authentic Sunnah, and recognized scholarly explanations according to the Salaf as-Salih.
          </p>

          {/* Quick Chat Input Box directly in hero */}
          <form
            onSubmit={handleSubmit}
            className="pt-4 flex items-center gap-2 max-w-2xl"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={quickPrompt}
                onChange={e => setQuickPrompt(e.target.value)}
                placeholder="Ask DEEN AI any question on Qur'an, Hadith, Salah, or Fiqh..."
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white/95 dark:bg-[#0c1611] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm focus:outline-none focus:ring-4 focus:ring-amber-400/40 shadow-lg font-medium border border-transparent dark:border-emerald-900/60"
              />
              <button
                type="submit"
                disabled={!quickPrompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Core Methodology Highlights */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              Qur'an & Sahih Hadith Evidence
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              Understanding of the Salaf as-Salih
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              Strict Topic Boundary Enforcement
            </span>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-6 -bottom-8 opacity-10 font-arabic text-9xl pointer-events-none select-none text-white">
          دين
        </div>
      </div>

      {/* Featured Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Qur'an Verse of the Day */}
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Ayah of the Day
              </span>
              <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </div>

            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Ayat al-Kursi (2:255)
            </h3>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl text-right mb-3">
              <p className="font-arabic text-lg text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed line-clamp-2">
                {featuredVerse.arabic_text}
              </p>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic line-clamp-3">
              "{featuredVerse.english_translation}"
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between mt-4">
            <span className="text-[11px] text-neutral-400">Surah Al-Baqarah</span>
            <button
              onClick={() => onNavigate('quran')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore Qur'an</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Hadith of the Day */}
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Hadith of the Day
              </span>
              <Scroll className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>

            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Sincerity of Intentions (Ikhlas)
            </h3>

            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 rounded-xl text-right mb-3">
              <p className="font-arabic text-base text-amber-950 dark:text-amber-100 font-semibold leading-relaxed line-clamp-2">
                {featuredHadith.arabic_text}
              </p>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic line-clamp-3">
              "{featuredHadith.english_text}"
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between mt-4">
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
              {featuredHadith.collection} • Sahih
            </span>
            <button
              onClick={() => onNavigate('hadith')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Read Hadiths</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Daily Adhkar */}
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Essential Adhkar
              </span>
              <Sun className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>

            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Sayyid al-Istighfar
            </h3>

            <div className="p-3 bg-teal-50/40 dark:bg-teal-950/30 rounded-xl text-right mb-3">
              <p className="font-arabic text-base text-teal-950 dark:text-teal-100 font-semibold leading-relaxed line-clamp-2">
                {quickAdhkar.arabic}
              </p>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic line-clamp-3">
              "{quickAdhkar.translation}"
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between mt-4">
            <span className="text-[11px] text-neutral-400">1x Morning & Evening</span>
            <button
              onClick={() => onNavigate('reminders')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View Adhkar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Learning Courses Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Structured Islamic Learning Recommendations
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Step-by-step programmes with authentic evidence and quizzes
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            <span>All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ISLAMIC_COURSES.map(course => (
            <div
              key={course.id}
              onClick={() => onNavigate('learning')}
              className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300">
                  {course.level}
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-2 mb-1">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {course.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.estimated_hours} Hours
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Explore &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Author & Engineering Attribution Banner */}
      <div className="rounded-2xl p-6 bg-white dark:bg-[#0b130e] border border-neutral-200/90 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              DEEN AI Platform Architecture & Author
            </h4>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Engineered & Developed by <strong className="text-emerald-800 dark:text-amber-300 font-bold">Abulawzat Digital Solution</strong> • <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Department of Computer Science</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-[#070d0a] px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Authentic Islamic Knowledge & Technology</span>
        </div>
      </div>
    </div>
  );
};
