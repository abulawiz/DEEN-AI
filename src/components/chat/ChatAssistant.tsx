import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Plus,
  Trash2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Conversation, Message, Citation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/dbService';
import { classifyIslamicTopic, getViolationMessage } from '../../services/topicClassifier';
import { generateAIResponse } from '../../services/aiService';
import { SpeechService } from '../../services/speechService';
import { MessageItem } from './MessageItem';
import { IslamicReferenceModal } from './IslamicReferenceModal';
import { ViolationModal } from './ViolationModal';

const SUGGESTED_QUESTIONS = [
  'What are the 7 conditions of the testimony "La ilaha illallah"?',
  'What is the virtue and Tafsir of Ayat al-Kursi (2:255)?',
  'How do I perform the prostration of forgetfulness (Sujud as-Sahw)?',
  'What are the rights of parents (Birr al-Walidayn) in Islam?',
  'What is the difference between Major Shirk and Minor Shirk (Riya\')?',
  'What are the Islamic guidelines on business ethics and interest (Riba)?'
];

interface ChatAssistantProps {
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ initialPrompt, onClearInitialPrompt }) => {
  const { currentUser, isRestricted, isSuspended, restrictionSecondsRemaining, refreshUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState<'en-US' | 'ar-SA'>('en-US');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount or user switch
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser?.id]);

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  // Handle initialPrompt from Dashboard
  useEffect(() => {
    if (initialPrompt && currentUser) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt, currentUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const loadConversations = async () => {
    if (!currentUser) return;
    const convs = await DBService.getConversations(currentUser.id);
    setConversations(convs);
    if (convs.length > 0 && !activeConvId) {
      setActiveConvId(convs[0].id);
    } else if (convs.length === 0) {
      handleCreateNewChat();
    }
  };

  const loadMessages = async (convId: string) => {
    const msgs = await DBService.getMessages(convId);
    setMessages(msgs);
  };

  const handleCreateNewChat = async () => {
    if (!currentUser) return;
    const newConv = await DBService.createConversation(currentUser.id, 'New Islamic Consultation');
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setMessages([]);
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this conversation history?')) {
      await DBService.deleteConversation(convId);
      const remaining = conversations.filter(c => c.id !== convId);
      setConversations(remaining);
      if (activeConvId === convId) {
        if (remaining.length > 0) {
          setActiveConvId(remaining[0].id);
        } else {
          handleCreateNewChat();
        }
      }
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      SpeechService.startListening(
        transcript => {
          setInputPrompt(prev => (prev ? prev + ' ' : '') + transcript);
        },
        err => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        },
        speechLang
      );
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || !currentUser || isGenerating) return;

    if (isRestricted) {
      setShowAppealModal(true);
      return;
    }

    let targetConvId = activeConvId;
    if (!targetConvId) {
      const newConv = await DBService.createConversation(currentUser.id, prompt.slice(0, 36) + '...');
      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      targetConvId = newConv.id;
    } else if (messages.length === 0) {
      await DBService.updateConversationTitle(targetConvId, prompt.slice(0, 36) + '...');
      setConversations(prev =>
        prev.map(c => (c.id === targetConvId ? { ...c, title: prompt.slice(0, 36) + '...' } : c))
      );
    }

    // 1. Save and display user message
    const userMsg = await DBService.saveMessage({
      conversation_id: targetConvId,
      sender_role: 'user',
      content: prompt
    });
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      // 2. BACKEND TOPIC CLASSIFICATION & PROGRESSIVE RESTRICTION SYSTEM
      const classification = classifyIslamicTopic(prompt);

      if (!classification.is_islamic) {
        const nextViolationLevel = (currentUser.violation_count || 0) + 1;
        const notice = getViolationMessage(nextViolationLevel);

        await DBService.recordViolation(
          currentUser.id,
          prompt,
          nextViolationLevel,
          classification.matched_category || 'Unrelated Topic',
          notice.actionTaken,
          notice.timeoutMinutes
        );
        await refreshUser();

        const rejectionMsg = await DBService.saveMessage({
          conversation_id: targetConvId,
          sender_role: 'assistant',
          content: notice.message,
          is_restricted_rejection: true,
          rejection_reason: notice.title
        });
        setMessages(prev => [...prev, rejectionMsg]);

        if (notice.isRestricted) {
          setShowAppealModal(true);
        }
      } else {
        const history = messages.slice(-4).map(m => ({
          role: m.sender_role as 'user' | 'assistant',
          content: m.content
        }));

        const aiResult = await generateAIResponse(prompt, history, classification.is_emergency);

        const assistantMsg = await DBService.saveMessage({
          conversation_id: targetConvId,
          sender_role: 'assistant',
          content: aiResult.content,
          arabic_content: aiResult.arabic_content,
          citations: aiResult.citations
        });

        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('AI generation error:', err);
      const fallbackMsg = await DBService.saveMessage({
        conversation_id: targetConvId,
        sender_role: 'assistant',
        content: 'Assalamu Alaikum. An unexpected error occurred while consulting the knowledge base. Please try asking again in a moment.'
      });
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-neutral-50 dark:bg-[#040806] overflow-hidden relative">
      {/* Sidebar: Conversation History Drawer */}
      <aside
        className={`w-72 bg-white dark:bg-[#080d0a] border-r border-neutral-200/90 dark:border-neutral-800/80 flex flex-col justify-between shrink-0 transition-all duration-200 ${
          sidebarOpen ? 'block absolute z-20 h-full shadow-xl' : 'hidden md:flex'
        }`}
      >
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              Consultation History
            </h3>
          </div>
          <button
            onClick={handleCreateNewChat}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors text-xs font-semibold flex items-center gap-1"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center py-8">
              No previous conversations.
            </p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setSidebarOpen(false);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                  activeConvId === conv.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 font-semibold border border-emerald-200 dark:border-emerald-800/80 shadow-2xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeConvId === conv.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  onClick={e => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Methodology Footer Note */}
        <div className="p-3 bg-neutral-50/80 dark:bg-black/30 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
          <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Strict Islamic Filter</span>
          </div>
          DEEN AI enforces authentic Islamic evidence and rejects secular/unrelated topics.
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50/50 dark:bg-[#040806]">
        {/* Top Chat Bar */}
        <div className="bg-white/80 dark:bg-[#080d0a]/80 backdrop-blur-sm border-b border-neutral-200/70 dark:border-neutral-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
              title="Toggle History"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">
                {conversations.find(c => c.id === activeConvId)?.title || 'Islamic AI Consultation'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeechLang(prev => (prev === 'en-US' ? 'ar-SA' : 'en-US'))}
              className="px-2 py-1 text-[11px] font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Voice Recognition Language"
            >
              Voice: {speechLang === 'en-US' ? 'English (US)' : 'العربية (Arabic)'}
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {messages.length === 0 ? (
            /* Welcome Empty State */
            <div className="max-w-2xl mx-auto py-8 sm:py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/10 mb-4 ring-4 ring-emerald-100 dark:ring-emerald-950">
                <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight mb-2">
                DEEN <span className="text-emerald-700 dark:text-emerald-400">AI</span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-lg mx-auto mb-6">
                Your Intelligent Islamic Companion. Built upon the Holy Qur'an, authentic Sunnah, and recognized scholarly consensus according to the Salaf as-Salih.
              </p>

              {/* Islamic Topic Boundary Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-semibold mb-8">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dedicated exclusively to Islamic knowledge & everyday religious guidance</span>
              </div>

              {/* Suggested Questions Grid */}
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 px-1">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>Explore Verified Inquiries:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="p-3 rounded-xl bg-white dark:bg-[#0c1410] border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-sm text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-all flex items-center justify-between group"
                    >
                      <span className="leading-snug pr-2">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Render Message History */
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map(msg => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onSelectCitation={c => setSelectedCitation(c)}
                  onSelectSuggestedTopic={topic => handleSendMessage(topic)}
                  userFullName={currentUser?.full_name}
                />
              ))}

              {/* Generating Animation */}
              {isGenerating && (
                <div className="flex items-center gap-2 p-4 bg-white dark:bg-[#0c1410] border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xs shadow-sm">
                  <div className="w-5 h-5 rounded-md bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                      Consulting authentic Qur'an & Sunnah...
                    </span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="bg-white dark:bg-[#080d0a] border-t border-neutral-200/90 dark:border-neutral-800/80 p-4">
          <div className="max-w-3xl mx-auto">
            {/* If Restricted Alert Banner */}
            {isRestricted ? (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between text-xs text-red-900 dark:text-red-200 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span>
                    {isSuspended
                      ? 'Account suspended for policy violations.'
                      : `Messaging paused due to off-topic requests. Unlocking in ${formatCountdown(restrictionSecondsRemaining)}`}
                  </span>
                </div>
                <button
                  onClick={() => setShowAppealModal(true)}
                  className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                  Appeal to Admin
                </button>
              </div>
            ) : null}

            {/* Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2 bg-neutral-100 dark:bg-[#0f1712] rounded-2xl p-2 border border-neutral-200/90 dark:border-neutral-800 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
            >
              <textarea
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isRestricted || isGenerating}
                placeholder={
                  isRestricted
                    ? 'Messaging temporarily restricted...'
                    : 'Ask any question on the Qur\'an, Hadith, Fiqh, Aqeedah, or Islamic practice...'
                }
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none max-h-32 disabled:opacity-50"
              />

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isRestricted || isGenerating}
                className={`p-2.5 rounded-xl transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-neutral-800'
                }`}
                title={isListening ? 'Stop listening' : 'Speak inquiry'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isRestricted || isGenerating}
                className="p-2.5 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white hover:bg-emerald-800 dark:hover:bg-emerald-500 disabled:opacity-40 transition-colors shadow-sm"
                title="Send inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>DEEN AI follows the methodology of Ahl us-Sunnah wal-Jama'ah</span>
              <span>Consult qualified scholars for intricate legal verdicts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Citations Viewer Modal */}
      <IslamicReferenceModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Policy Restriction & Appeal Modal */}
      <ViolationModal
        isOpen={showAppealModal}
        onClose={() => setShowAppealModal(false)}
      />
    </div>
  );
};
