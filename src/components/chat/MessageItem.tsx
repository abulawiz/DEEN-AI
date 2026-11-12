import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Flag,
  BookOpen,
  Scroll,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Message, Citation } from '../../types';
import { SpeechService } from '../../services/speechService';
import { DBService } from '../../services/dbService';

interface MessageItemProps {
  message: Message;
  onSelectCitation: (citation: Citation) => void;
  onSelectSuggestedTopic?: (topic: string) => void;
  userFullName?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onSelectCitation,
  onSelectSuggestedTopic,
  userFullName
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<number | undefined>(message.feedback_rating);
  const [reported, setReported] = useState(false);
  const isAssistant = message.sender_role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speak(message.content, () => setIsSpeaking(false));
    }
  };

  const handleFeedback = async (rating: number) => {
    const nextRating = feedback === rating ? 0 : rating;
    setFeedback(nextRating);
    await DBService.setMessageFeedback(message.id, nextRating);
  };

  const handleReport = async () => {
    if (reported) return;
    const reason = prompt('Please describe the concern regarding this religious explanation for scholarly review:');
    if (reason) {
      await DBService.reportMessage(message.id, 'user-current', reason);
      setReported(true);
      alert('Answer reported for scholarly review. JazakAllahu Khayran.');
    }
  };

  return (
    <div className={`flex flex-col mb-6 ${isAssistant ? 'items-start' : 'items-end'}`}>
      {/* Sender Header */}
      <div className="flex items-center gap-2 mb-1.5 px-1">
        {isAssistant ? (
          <>
            <div className="w-6 h-6 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">DEEN AI</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Qur&apos;an &amp; Sunnah
            </span>
          </>
        ) : (
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            {userFullName || 'You'}
          </span>
        )}
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Message Bubble Content */}
      <div
        className={`relative max-w-[94%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
          !isAssistant
            ? 'bg-emerald-800 dark:bg-emerald-700 text-white rounded-tr-none'
            : message.is_restricted_rejection
            ? 'bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-neutral-900 dark:text-amber-100 rounded-tl-none'
            : 'bg-white dark:bg-[#0c1410] border border-neutral-200/90 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none shadow-sm'
        }`}
      >
        {/* If Rejected due to Non-Islamic topic */}
        {message.is_restricted_rejection ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{message.rejection_reason || 'Islamic-Only Conversation Notice'}</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
              {message.content}
            </p>

            {/* Suggested Authentic Topics */}
            {onSelectSuggestedTopic && (
              <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60">
                <p className="text-[11px] font-bold text-amber-950 dark:text-amber-300 uppercase tracking-wider mb-2">
                  Suggested Authentic Islamic Inquiries:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Tafsir of Ayat al-Kursi (2:255)',
                    'Conditions of La ilaha illallah',
                    'How to attain Khushu\' in Salah',
                    'Virtues of morning & evening Adhkar'
                  ].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectSuggestedTopic(topic)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-950 dark:text-amber-200 font-medium transition-colors flex items-center gap-1 border border-amber-300/60 dark:border-amber-800"
                    >
                      <span>{topic}</span>
                      <ArrowRight className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Normal Message Body */
          <div className="prose prose-sm max-w-none space-y-2">
            {/* Render formatted text */}
            <div
              className={`leading-relaxed text-sm whitespace-pre-wrap ${!isAssistant ? 'text-white' : 'text-neutral-800 dark:text-neutral-100'}`}
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/### (.*?)\n/g, '<h4 class="text-sm font-bold text-emerald-900 dark:text-emerald-300 mt-3 mb-1">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/bg-emerald-50\/80/g, 'bg-emerald-50/80 dark:bg-emerald-950/40 text-neutral-900 dark:text-emerald-100')
                  .replace(/bg-amber-50\/70/g, 'bg-amber-50/70 dark:bg-amber-950/30 text-neutral-900 dark:text-amber-100')
              }}
            />

            {/* Citations badges if present */}
            {message.citations && message.citations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Verified Religious Citations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectCitation(c)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
                    >
                      {c.type === 'quran' ? (
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      ) : (
                        <Scroll className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>{c.reference}</span>
                      {c.grade && (
                        <span className="text-[10px] px-1 rounded bg-emerald-200/80 dark:bg-emerald-800 font-bold text-emerald-950 dark:text-emerald-100">
                          {c.grade}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Actions Bar for Assistant */}
      {isAssistant && !message.is_restricted_rejection && (
        <div className="flex items-center gap-1 mt-1.5 px-2 text-neutral-400 dark:text-neutral-500">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Copy response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleToggleSpeech}
            className={`p-1.5 rounded-md transition-colors ${
              isSpeaking ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={isSpeaking ? 'Stop speech' : 'Listen with Speech Synthesis'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleFeedback(1)}
            className={`p-1.5 rounded-md transition-colors ${
              feedback === 1 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Helpful Islamic answer"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleFeedback(-1)}
            className={`p-1.5 rounded-md transition-colors ${
              feedback === -1 ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50' : 'hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Unhelpful"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReport}
            className={`p-1.5 rounded-md transition-colors ${
              reported ? 'text-amber-600 dark:text-amber-400' : 'hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Report to Admin / Scholar Review"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
