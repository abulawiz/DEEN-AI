import React, { useState } from 'react';
import {
  Scroll,
  Search,
  ShieldCheck,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { VERIFIED_HADITH_RECORDS } from '../../data/hadithData';
import { HadithRecord } from '../../types';

export const HadithAssistant: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const collections = [
    { id: 'all', name: 'All Authentic Collections' },
    { id: 'bukhari', name: 'Sahih al-Bukhari' },
    { id: 'muslim', name: 'Sahih Muslim' },
    { id: 'tirmidhi', name: 'Jami\' at-Tirmidhi' },
    { id: 'abu_dawud', name: 'Sunan Abi Dawud' },
  ];

  const filteredHadiths = VERIFIED_HADITH_RECORDS.filter(h => {
    const matchesCollection = selectedCollection === 'all' || h.collection_code === selectedCollection;
    const matchesGrade = selectedGrade === 'all' || h.authenticity_grade === selectedGrade;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      h.english_text.toLowerCase().includes(q) ||
      h.arabic_text.includes(q) ||
      h.narrator.toLowerCase().includes(q) ||
      h.hadith_number.includes(q) ||
      h.chapter_name_en.toLowerCase().includes(q);
    return matchesCollection && matchesGrade && matchesSearch;
  });

  const handleCopy = (hadith: HadithRecord) => {
    const text = `${hadith.arabic_text}\n\n"${hadith.english_text}"\n— Narrated by ${hadith.narrator}\n[${hadith.collection}, Hadith #${hadith.hadith_number} — Authenticity: ${hadith.authenticity_grade}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 dark:from-[#031c11] dark:via-[#053221] dark:to-[#171003] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
            <Scroll className="w-3.5 h-3.5" />
            <span>The Prophetic Sunnah (السنة النبوية المطهرة)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Authenticated Hadith Repository
          </h1>
          <p className="text-sm text-emerald-100/90 dark:text-emerald-200 mt-2 leading-relaxed">
            Access verified narrations with complete chains, exact reference numbers, Arabic texts, English meanings, and authenticity classifications strictly adhering to the methodology of Ahl al-Hadith.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 font-arabic text-8xl pointer-events-none select-none text-white">
          حديث
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Hadith by keyword, narrator, chapter or Hadith number..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#070d0a] text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Collection Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCollection}
            onChange={e => setSelectedCollection(e.target.value)}
            className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-[#070d0a] focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {collections.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-[#070d0a] focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">All Grades</option>
            <option value="Sahih">Sahih Only (صحيح)</option>
            <option value="Hasan">Hasan (حسن)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
        <span>Showing {filteredHadiths.length} authenticated Hadith record(s)</span>
        <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Zero fabricated narrations admitted
        </span>
      </div>

      {/* Hadith Cards List */}
      <div className="space-y-6">
        {filteredHadiths.length === 0 ? (
          <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <Scroll className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No matching Hadiths found</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Try searching with a broader keyword or resetting collection filters.
            </p>
          </div>
        ) : (
          filteredHadiths.map(hadith => {
            const isCopied = copiedId === hadith.id;
            return (
              <div
                key={hadith.id}
                className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all p-6 shadow-sm hover:shadow-md space-y-4"
              >
                {/* Top Metadata Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                      #{hadith.hadith_number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {hadith.collection}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Chapter: {hadith.chapter_name_en}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Authenticity Badge */}
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{hadith.authenticity_grade}</span>
                    </span>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(hadith)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                      title="Copy Hadith"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Narrator */}
                <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Narrated by {hadith.narrator}:
                </div>

                {/* Arabic Text Block */}
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border-r-4 border-amber-500 text-right">
                  <p className="font-arabic text-xl sm:text-2xl leading-[2.3] text-neutral-950 dark:text-neutral-100 font-semibold">
                    {hadith.arabic_text}
                  </p>
                </div>

                {/* English Translation */}
                <div className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  "{hadith.english_text}"
                </div>

                {/* Scholarly Explanation */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#070d0a] border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-300">
                    <Info className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Scholarly Explanation & Fiqh Significance:</span>
                  </div>
                  <p className="leading-relaxed pl-5">{hadith.explanation}</p>
                </div>

                {/* Footer Grading Citation */}
                <div className="pt-2 text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
                  <span>Graded by: {hadith.graded_by}</span>
                  <span>Category: {hadith.category}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
