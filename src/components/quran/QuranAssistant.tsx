import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Play,
  Pause,
  FileText,
  X
} from 'lucide-react';
import { SURAH_LIST, VERIFIED_QURAN_VERSES, getAyahAudioUrl } from '../../data/quranData';
import { QuranVerse, SurahSummary } from '../../types';

export const QuranAssistant: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahSummary>(SURAH_LIST[0]);
  const [selectedVerseForTafsir, setSelectedVerseForTafsir] = useState<QuranVerse | null>(null);
  const [playingAyahId, setPlayingAyahId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Filter Surahs
  const filteredSurahs = SURAH_LIST.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.name_en.toLowerCase().includes(q) ||
      s.name_ar.includes(q) ||
      s.english_translation.toLowerCase().includes(q) ||
      String(s.number) === q
    );
  });

  // Filter verses belonging to currently selected Surah
  const surahVerses = VERIFIED_QURAN_VERSES.filter(
    v => v.surah_number === selectedSurah.number
  );

  const handlePlayAudio = (verse: QuranVerse) => {
    const audioUrl = verse.audio_url || getAyahAudioUrl(verse.surah_number, verse.ayah_number);

    if (playingAyahId === verse.id && audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
        setPlayingAyahId(null);
      }
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    setAudioElement(audio);
    setPlayingAyahId(verse.id);

    audio.play().catch(err => {
      console.warn('Audio play error:', err);
      setPlayingAyahId(null);
    });

    audio.onended = () => {
      setPlayingAyahId(null);
    };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 dark:from-[#032014] dark:via-[#053d29] dark:to-[#03291d] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 dark:bg-black/40 border border-emerald-600/40 text-amber-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Noble Qur'an (القرآن الكريم)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Complete Qur'anic Library & Tafsir
          </h1>
          <p className="text-sm text-emerald-100/90 dark:text-emerald-200 mt-2 leading-relaxed">
            Browse all 114 Surahs with authentic Arabic calligraphy, English translations, verse-by-verse audio recitations by Shaykh Mishary Alafasy, and verified Tafsir from Ibn Kathir and As-Sa'di.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 font-arabic text-8xl pointer-events-none select-none text-white">
          القرآن
        </div>
      </div>

      {/* Main Grid: Surah Selector & Verses Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 114 Surahs Directory */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-sm h-[700px] flex flex-col">
          <div className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Surah by name or number..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#070d0a] text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
            <span>Surah Catalog ({filteredSurahs.length})</span>
            <span>Verses</span>
          </div>

          {/* Surah List Scroll */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredSurahs.map(surah => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  onClick={() => setSelectedSurah(surah)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-md'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-800 dark:bg-emerald-950 text-amber-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {surah.number}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">
                        {surah.name_en}
                      </p>
                      <p
                        className={`text-[10px] ${
                          isSelected ? 'text-emerald-100' : 'text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {surah.english_translation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-arabic text-sm font-bold">
                      {surah.name_ar}
                    </p>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-800/80 dark:bg-emerald-950/80 text-emerald-100'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {surah.verses_count} ayahs • {surah.revelation_type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Verses & Recitation */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-6 shadow-sm min-h-[700px] flex flex-col">
          {/* Active Surah Banner */}
          <div className="border-b border-neutral-200/80 dark:border-neutral-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                  {selectedSurah.number}
                </span>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  Surah {selectedSurah.name_en}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {selectedSurah.revelation_type}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                "{selectedSurah.english_translation}" • {selectedSurah.verses_count} Total Verses
              </p>
            </div>

            <div className="text-right">
              <span className="font-arabic text-3xl font-bold text-emerald-900 dark:text-emerald-300">
                سورة {selectedSurah.name_ar}
              </span>
            </div>
          </div>

          {/* Verses Container */}
          <div className="flex-1 space-y-6">
            {/* Basmalah for Surahs except At-Tawbah (9) */}
            {selectedSurah.number !== 9 && (
              <div className="text-center py-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100/60 dark:border-emerald-900/40 my-2">
                <p className="font-arabic text-2xl text-emerald-950 dark:text-emerald-100 font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 italic">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful.
                </p>
              </div>
            )}

            {surahVerses.length === 0 ? (
              <div className="text-center py-12 bg-neutral-50 dark:bg-[#070d0a] rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800">
                <BookOpen className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Surah {selectedSurah.name_en} Verses
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1">
                  Full text for this Surah is available in the verified core index. You can also ask DEEN AI for word-by-word explanation and Tafsir.
                </p>
              </div>
            ) : (
              surahVerses.map(verse => {
                const isPlaying = playingAyahId === verse.id;
                return (
                  <div
                    key={verse.id}
                    className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all bg-neutral-50/30 dark:bg-[#070e0a]/40 hover:bg-white dark:hover:bg-[#0b140f] hover:shadow-sm"
                  >
                    {/* Verse Controls */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="w-7 h-7 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                        {verse.ayah_number}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayAudio(verse)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isPlaying
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                          title="Recite Ayah"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Recite</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedVerseForTafsir(verse)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                          title="Read Tafsir"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                          <span>Tafsir</span>
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text Block */}
                    <div className="text-right py-2">
                      <p className="font-arabic text-2xl sm:text-3xl leading-[2.4] text-neutral-900 dark:text-neutral-100 font-semibold">
                        {verse.arabic_text} ﴿{verse.ayah_number}﴾
                      </p>
                    </div>

                    {/* English Translation */}
                    <div className="pt-3 border-t border-neutral-100/80 dark:border-neutral-800/80">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
                        {verse.english_translation}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Tafsir Modal */}
      {selectedVerseForTafsir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-100 dark:border-neutral-800 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVerseForTafsir(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
                Surah {selectedVerseForTafsir.surah_name_en} ({selectedVerseForTafsir.surah_number}:{selectedVerseForTafsir.ayah_number})
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Tafsir al-Qur'an al-'Azeem</span>
            </div>

            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Scholarly Tafsir & Explanation
            </h3>

            {/* Arabic Verse Quote */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-right mb-4 border-r-4 border-emerald-600">
              <p className="font-arabic text-xl text-neutral-900 dark:text-neutral-100 leading-loose">
                {selectedVerseForTafsir.arabic_text}
              </p>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic mb-4">
              "{selectedVerseForTafsir.english_translation}"
            </p>

            {/* Tafsir Ibn Kathir */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#080e0b] border border-neutral-200 dark:border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1">
                  Tafsir Ibn Kathir (تفسير ابن كثير)
                </h4>
                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {selectedVerseForTafsir.tafsir_ibn_kathir ||
                    'Explains the context of revelation, linguistic definitions according to Classical Arabic, and corroborated narrations from the Sahabah and Tabi\'un.'}
                </p>
              </div>

              {selectedVerseForTafsir.tafsir_as_sadi && (
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                    Tafsir As-Sa'di (تيسير الكريم الرحمن)
                  </h4>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {selectedVerseForTafsir.tafsir_as_sadi}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedVerseForTafsir(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
              >
                Close Tafsir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
