import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  Scale,
  ShieldCheck,
  Scroll,
  Compass,
  Landmark,
  Heart,
  Users,
  Briefcase,
  Sun,
  Search,
  ArrowRight,
  X,
  Quote
} from 'lucide-react';
import { ISLAMIC_CATEGORIES, LIBRARY_ARTICLES } from '../../data/libraryData';
import { LibraryArticle } from '../../types';

export const KnowledgeLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<LibraryArticle | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Scale': return Scale;
      case 'BookOpen': return BookOpen;
      case 'Scroll': return Scroll;
      case 'Compass': return Compass;
      case 'Landmark': return Landmark;
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Briefcase': return Briefcase;
      case 'Sun': return Sun;
      default: return BookOpen;
    }
  };

  const filteredArticles = LIBRARY_ARTICLES.filter(a => {
    const matchesCategory = selectedCategory === 'all' || a.category_id === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 dark:from-[#032014] dark:via-[#043322] dark:to-[#031d13] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/30 dark:border-emerald-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 dark:bg-black/40 border border-emerald-600/40 text-amber-300 text-xs font-semibold mb-3">
            <Library className="w-3.5 h-3.5" />
            <span>Islamic Knowledge Library (المكتبة الإسلامية)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Scholarly Treatises & Core Sciences
          </h1>
          <p className="text-sm text-emerald-100/90 dark:text-emerald-200 mt-2 leading-relaxed">
            Curated authentic literature across the ten major fields of Islamic knowledge, including Aqeedah, Fiqh, Tafsir, Hadith, Seerah, Manners, Family Life, and Business Transactions according to the Salaf.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 font-arabic text-8xl pointer-events-none select-none text-white">
          علم
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Select Knowledge Category
          </h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#070d0a] text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
                : 'bg-white dark:bg-[#0b130e] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            All Categories ({LIBRARY_ARTICLES.length})
          </button>
          {ISLAMIC_CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.icon);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
                    : 'bg-white dark:bg-[#0b130e] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {article.category_name}
                </span>
                {article.arabic_title && (
                  <span className="font-arabic text-sm text-neutral-600 dark:text-neutral-400 font-bold">
                    {article.arabic_title}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors mb-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                By: {article.author}
              </p>

              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-3 mb-4">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {article.references.length} verified citation(s)
              </span>
              <button
                onClick={() => setSelectedArticle(article)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
              >
                <span>Read Treatise</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
                  {selectedArticle.category_name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">• {selectedArticle.author}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {selectedArticle.title}
              </h2>
              {selectedArticle.arabic_title && (
                <p className="font-arabic text-xl text-emerald-900 dark:text-emerald-300 mt-1">
                  {selectedArticle.arabic_title}
                </p>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-neutral-700 dark:text-neutral-300 italic mb-6">
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedArticle.summary}</span>
              </div>
            </div>

            <div
              className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed space-y-4 whitespace-pre-wrap font-sans"
              dangerouslySetInnerHTML={{
                __html: selectedArticle.content
                  .replace(/### (.*?)\n/g, '<h4 class="text-base font-bold text-emerald-900 dark:text-emerald-300 mt-4 mb-2">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />

            {/* Classical References */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Verified Scholarly Sources & Citations
              </h4>
              <ul className="space-y-1">
                {selectedArticle.references.map((ref, idx) => (
                  <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
              >
                Close Treatise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
