import React from 'react';
import { X, BookOpen, Scroll, CheckCircle2, ShieldCheck, Quote } from 'lucide-react';
import { Citation } from '../../types';

interface IslamicReferenceModalProps {
  citation: Citation | null;
  onClose: () => void;
}

export const IslamicReferenceModal: React.FC<IslamicReferenceModalProps> = ({ citation, onClose }) => {
  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-emerald-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
            {citation.type === 'quran' ? (
              <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            ) : (
              <Scroll className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
              {citation.type === 'quran'
                ? 'Verified Qur\'anic Reference'
                : citation.type === 'hadith'
                ? 'Authenticated Prophetic Sunnah'
                : 'Scholarly Verification'}
            </span>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
              {citation.reference}
            </h3>
          </div>
        </div>

        {/* Authenticity Grade Badge if Hadith */}
        {citation.grade && (
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Grading: {citation.grade}</span>
            {citation.narrator && <span className="text-neutral-500 dark:text-neutral-400">• Narrated by {citation.narrator}</span>}
          </div>
        )}

        {/* Arabic Text Display */}
        {citation.arabic && (
          <div className="my-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border-r-4 border-emerald-600 text-right">
            <p className="font-arabic text-2xl leading-loose text-neutral-900 dark:text-neutral-100">
              {citation.arabic}
            </p>
          </div>
        )}

        {/* English Translation / Explanation */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#070d0a] border border-neutral-200/80 dark:border-neutral-800 my-3">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal italic">
              "{citation.text}"
            </p>
          </div>
        </div>

        {/* Methodology Notice */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verified against authentic sources according to the Salaf</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
