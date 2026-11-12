import React, { useState } from 'react';
import { X, ShieldAlert, Send, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ViolationModal: React.FC<ViolationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, isSuspended, restrictionSecondsRemaining, submitAppeal } = useAuth();
  const [appealText, setAppealText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;
    setLoading(true);
    try {
      await submitAppeal(appealText);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {isSuspended ? 'Account Suspension Notice' : 'Policy & Restriction Status'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              DEEN AI Islamic Knowledge Guidelines
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 mb-4 text-xs text-red-900 dark:text-red-200 space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span>Violations Logged:</span>
            <span className="px-2 py-0.5 rounded bg-red-200 dark:bg-red-900/80 text-red-950 dark:text-red-100 font-bold">
              {currentUser?.violation_count || 0} Incident(s)
            </span>
          </div>
          {restrictionSecondsRemaining > 0 && (
            <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300 pt-1 border-t border-red-100 dark:border-red-900/40">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> Restriction Countdown:
              </span>
              <span className="font-bold text-red-700 dark:text-red-400">
                {formatCountdown(restrictionSecondsRemaining)}
              </span>
            </div>
          )}
          <p className="text-neutral-700 dark:text-neutral-300 pt-1 leading-relaxed">
            DEEN AI is dedicated solely to authentic Islamic knowledge, Qur'an, Sunnah, and recognized scholarly guidance. Worldly entertainment, sports predictions, programming help, and secular queries are prohibited to protect its sacred purpose.
          </p>
        </div>

        {/* Appeal Form */}
        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
              Appeal Submitted Successfully
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              An administrator will review your appeal and the flagged query. You will be notified once reviewed.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitAppeal} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Submit an Appeal to Administrators
              </label>
              <textarea
                value={appealText}
                onChange={e => setAppealText(e.target.value)}
                placeholder="Explain why your query was intended for legitimate Islamic guidance or educational inquiry..."
                rows={4}
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={loading || !appealText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {loading ? 'Submitting...' : 'Submit Appeal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
