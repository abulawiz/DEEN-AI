import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Scroll,
  Play,
  Pause,
  CheckCircle2,
  RotateCcw,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { MORNING_ADHKAR, EVENING_ADHKAR, FRIDAY_REMINDERS } from '../../data/adhkarData';
import { VERIFIED_QURAN_VERSES, getAyahAudioUrl } from '../../data/quranData';
import { VERIFIED_HADITH_RECORDS } from '../../data/hadithData';
import { AdhkarItem } from '../../types';

export const DailyReminders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'morning' | 'evening' | 'friday'>('highlights');
  const [adhkarCounts, setAdhkarCounts] = useState<Record<string, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const dailyVerse = VERIFIED_QURAN_VERSES[1];
  const dailyHadith = VERIFIED_HADITH_RECORDS[0];

  const handleIncrementAdhkar = (item: AdhkarItem) => {
    setAdhkarCounts(prev => {
      const current = prev[item.id] || 0;
      if (current < item.repeat_count) {
        return { ...prev, [item.id]: current + 1 };
      }
      return prev;
    });
  };

  const handleResetAdhkar = (id: string) => {
    setAdhkarCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const toggleVerseAudio = () => {
    const url = dailyVerse.audio_url || getAyahAudioUrl(dailyVerse.surah_number, dailyVerse.ayah_number);
    if (isPlayingAudio && audioInstance) {
      audioInstance.pause();
      setIsPlayingAudio(false);
    } else {
      const audio = new Audio(url);
      setAudioInstance(audio);
      setIsPlayingAudio(true);
      audio.play().catch(() => setIsPlayingAudio(false));
      audio.onended = () => setIsPlayingAudio(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 dark:from-[#032014] dark:via-[#043322] dark:to-[#031d13] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 dark:bg-black/40 border border-emerald-600/40 text-amber-300 text-xs font-semibold mb-3">
            <Sun className="w-3.5 h-3.5" />
            <span>Daily Reminders & Sunnah Adhkar (الأذكار اليومية)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Spiritual Nourishment & Daily Protections
          </h1>
          <p className="text-sm text-emerald-100/90 dark:text-emerald-200 mt-2 leading-relaxed">
            Preserve your heart with authentic Morning and Evening Adhkar, the Hadith of the Day, and Friday Sunan authenticated by recognized scholars of Hadith.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 font-arabic text-8xl pointer-events-none select-none text-white">
          ذكر
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('highlights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'highlights'
              ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Daily Highlights</span>
        </button>
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'morning'
              ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Morning Adhkar ({MORNING_ADHKAR.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'evening'
              ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Moon className="w-4 h-4 text-indigo-300" />
          <span>Evening Adhkar ({EVENING_ADHKAR.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('friday')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'friday'
              ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-300" />
          <span>Friday Sunan</span>
        </button>
      </div>

      {/* TAB 1: DAILY HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Qur'an Verse of the Day Card */}
          <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Qur'an Verse of the Day
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Surah {dailyVerse.surah_name_en} ({dailyVerse.surah_number}:{dailyVerse.ayah_number})
                  </p>
                </div>
              </div>

              <button
                onClick={toggleVerseAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
                }`}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Pause Recitation' : 'Listen'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-emerald-600 text-right">
              <p className="font-arabic text-xl sm:text-2xl leading-[2.3] text-neutral-950 dark:text-neutral-100 font-semibold">
                {dailyVerse.arabic_text}
              </p>
            </div>

            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans italic">
              "{dailyVerse.english_translation}"
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-[#070d0a] rounded-xl text-xs text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-0.5">Tafsir Reflection:</span>
              {dailyVerse.tafsir_ibn_kathir}
            </div>
          </div>

          {/* Hadith of the Day Card */}
          <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-800 dark:text-amber-300">
                  <Scroll className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Hadith of the Day
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {dailyHadith.collection} • No. {dailyHadith.hadith_number}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {dailyHadith.authenticity_grade}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border-r-4 border-amber-600 text-right">
              <p className="font-arabic text-lg sm:text-xl leading-[2.2] text-neutral-950 dark:text-neutral-100 font-semibold">
                {dailyHadith.arabic_text}
              </p>
            </div>

            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans italic">
              "{dailyHadith.english_text}"
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-[#070d0a] rounded-xl text-xs text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 block mb-0.5">Scholarly Lesson:</span>
              {dailyHadith.explanation}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 & 3: MORNING & EVENING ADHKAR */}
      {(activeTab === 'morning' || activeTab === 'evening') && (
        <div className="space-y-4">
          {(activeTab === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR).map(item => {
            const currentCount = adhkarCounts[item.id] || 0;
            const isCompleted = currentCount >= item.repeat_count;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-[#0b130e] rounded-2xl border transition-all p-6 shadow-sm ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Reference: {item.reference}
                    </p>
                  </div>

                  {/* Interactive Counter Badge */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleIncrementAdhkar(item)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-500 text-white active:scale-95'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span>
                          Recite: {currentCount} / {item.repeat_count}
                        </span>
                      )}
                    </button>

                    {currentCount > 0 && (
                      <button
                        onClick={() => handleResetAdhkar(item.id)}
                        className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Reset counter"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Arabic Calligraphy */}
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border-r-4 border-emerald-600 text-right my-3">
                  <p className="font-arabic text-xl sm:text-2xl leading-[2.3] text-neutral-950 dark:text-neutral-100 font-semibold">
                    {item.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium mb-1">
                  {item.transliteration}
                </p>

                {/* Translation */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 italic mb-3">
                  "{item.translation}"
                </p>

                {/* Virtue & Reward */}
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Virtue:</span> {item.benefit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: FRIDAY REMINDERS */}
      {activeTab === 'friday' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FRIDAY_REMINDERS.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{item.title}</span>
              </div>

              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl text-right">
                <p className="font-arabic text-lg text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed">
                  {item.arabic}
                </p>
              </div>

              <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                "{item.english}"
              </p>

              <div className="text-[11px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                Source: {item.reference}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
