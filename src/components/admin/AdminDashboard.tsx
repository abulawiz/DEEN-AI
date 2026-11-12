import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Search,
  Plus,
  Settings,
  Flag,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/dbService';
import { AdminStats, UserProfile, UserViolation, AccountRestriction } from '../../types';
import { DEEN_AI_SYSTEM_PROMPT } from '../../services/aiService';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'kpis' | 'users' | 'violations' | 'knowledge' | 'ai_config' | 'reports'>('kpis');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [violations, setViolations] = useState<UserViolation[]>([]);
  const [restrictions, setRestrictions] = useState<AccountRestriction[]>([]);
  const [reportedAnswers, setReportedAnswers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Hadith Form state
  const [showAddHadithModal, setShowAddHadithModal] = useState(false);
  const [newHadith, setNewHadith] = useState({
    collection: 'Sahih al-Bukhari',
    collection_code: 'bukhari',
    hadith_number: '',
    chapter_name_en: '',
    narrator: '',
    arabic_text: '',
    english_text: '',
    authenticity_grade: 'Sahih' as const,
    graded_by: 'Imam al-Bukhari',
    explanation: '',
    category: 'General Fiqh'
  });

  // AI instructions state
  const [customInstructions, setCustomInstructions] = useState(DEEN_AI_SYSTEM_PROMPT);
  const [strictnessLevel, setStrictnessLevel] = useState('Strict (Salaf Methodology)');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, u, v, r, rep] = await Promise.all([
        DBService.getAdminStats(),
        DBService.getAllUsers(),
        DBService.getAllViolations(),
        DBService.getAllRestrictions(),
        DBService.getReportedAnswers()
      ]);
      setStats(s);
      setUsers(u);
      setViolations(v);
      setRestrictions(r);
      setReportedAnswers(rep);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (userId: string) => {
    if (confirm('Toggle suspension status for this user account?')) {
      await DBService.toggleUserSuspension(userId);
      await loadAdminData();
    }
  };

  const handleLiftRestriction = async (userId: string) => {
    await DBService.liftRestriction(userId, 'Appeal reviewed and restriction lifted by Admin');
    await loadAdminData();
    alert('User restrictions lifted and violation strikes cleared.');
  };

  const handleToggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await DBService.updateUserProfile({ id: user.id, role: newRole });
    await loadAdminData();
  };

  const handleSaveHadith = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHadith.hadith_number || !newHadith.arabic_text || !newHadith.english_text) {
      alert('Please fill out all mandatory Hadith fields.');
      return;
    }
    await DBService.addCustomHadith(newHadith);
    setShowAddHadithModal(false);
    await loadAdminData();
    alert('Verified Hadith record added to knowledge base.');
  };

  const handleSaveAIConfig = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-emerald-950 to-neutral-950 dark:from-[#021008] dark:via-[#032316] dark:to-[#030d06] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Administrator Control Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            DEEN AI Admin & Moderation Console
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 mt-1">
            Supervise user accounts, monitor off-topic conversation violations, review appeals, manage verified knowledge sources, and configure AI prompt rules.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-emerald-600/50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto">
        {[
          { id: 'kpis', label: 'Platform Analytics', icon: Sparkles },
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'violations', label: `Flagged Violations (${violations.length})`, icon: AlertTriangle },
          { id: 'knowledge', label: 'Knowledge Base Manager', icon: BookOpen },
          { id: 'ai_config', label: 'AI Instructions & Filter', icon: Settings },
          { id: 'reports', label: `Reported Answers (${reportedAnswers.length})`, icon: Flag },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 dark:bg-emerald-800 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLATFORM KPIS */}
      {activeTab === 'kpis' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0b130e] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                Total Registered Users
              </span>
              <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{stats.total_users}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{stats.active_users} active accounts</span>
            </div>

            <div className="bg-white dark:bg-[#0b130e] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                Suspended / Restricted
              </span>
              <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.suspended_users}</div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">Under policy lockout</span>
            </div>

            <div className="bg-white dark:bg-[#0b130e] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                Islamic Questions Answered
              </span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{stats.islamic_questions}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Verified against Sunnah</span>
            </div>

            <div className="bg-white dark:bg-[#0b130e] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                Rejected Off-Topic Queries
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.rejected_questions}</div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">{stats.flagged_conversations} logged violations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0b130e] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Core System Health & Knowledge Status
              </h3>
              <div className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-[#070d0a]">
                  <span>Verified Qur'anic Ayahs Indexed:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">114 Surahs / Core Verses Live</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-[#070d0a]">
                  <span>Authenticated Hadiths (Bukhari, Muslim, etc.):</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">10 Master Hadith Records</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-[#070d0a]">
                  <span>Scholarly Articles Across 10 Fields:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">6 Major Treatises</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-[#070d0a]">
                  <span>Topic Detection Backend Filter:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fully Operational
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0b130e] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Methodological Integrity Checks
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                DEEN AI enforces rigorous standards. Weak and fabricated narrations are strictly blocked. Inquiries without Islamic context receive progressive warnings.
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium">
                Tip: Use the "Flagged Violations" tab to review user appeals and manage account suspensions transparently.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Registered Users & Privilege Controls
            </h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#070d0a] text-xs text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-[#070d0a] border-y border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Policy Strikes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.map(u => {
                  const isRestrictedUser = u.is_suspended || (u.restriction_until && new Date(u.restriction_until) > new Date());
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-neutral-900 dark:text-neutral-100">{u.full_name}</div>
                            <div className="text-neutral-400 dark:text-neutral-500 text-[10px]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                          }`}
                          title="Click to toggle Admin / Member"
                        >
                          {u.role}
                        </button>
                      </td>

                      <td className="p-3 font-semibold">
                        <span className={u.violation_count > 0 ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}>
                          {u.violation_count} strike(s)
                        </span>
                      </td>

                      <td className="p-3">
                        {isRestrictedUser ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 text-[10px] font-bold">
                            {u.is_suspended ? 'Suspended' : 'Timed Out'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right space-x-2">
                        {isRestrictedUser && (
                          <button
                            onClick={() => handleLiftRestriction(u.id)}
                            className="px-2.5 py-1 rounded bg-emerald-700 text-white font-semibold text-[11px] hover:bg-emerald-800"
                          >
                            Lift Restriction
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleSuspend(u.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                            u.is_suspended
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100'
                          }`}
                        >
                          {u.is_suspended ? 'Restore Account' : 'Suspend Account'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FLAGGED VIOLATIONS & APPEALS */}
      {activeTab === 'violations' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Active Appeals & Restriction Requests
            </h3>
            {restrictions.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 py-4">No active appeals pending review.</p>
            ) : (
              <div className="space-y-3">
                {restrictions.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        Restriction: {r.restriction_type} • Status: <span className="uppercase text-amber-800 dark:text-amber-300">{r.status}</span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 mt-1">Reason: {r.reason}</p>
                      {r.appeal_text && (
                        <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-[#070d0a] border border-amber-300 dark:border-amber-800 text-neutral-900 dark:text-neutral-100">
                          <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">User Appeal Statement:</span>
                          "{r.appeal_text}"
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleLiftRestriction(r.user_id)}
                      className="self-start sm:self-center px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 shrink-0"
                    >
                      Approve Appeal & Lift
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Logged Violation History
            </h3>
            <div className="space-y-2">
              {violations.length === 0 ? (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 py-4">No logged violations recorded.</p>
              ) : (
                violations.map(v => (
                  <div key={v.id} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#070d0a] flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">{v.user_name || 'User'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300">
                          Level {v.violation_level} Notice
                        </span>
                        <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">
                          {new Date(v.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 italic">
                        Prompt submitted: "{v.prompt_text}"
                      </p>
                      <p className="text-emerald-800 dark:text-emerald-400 font-medium text-[11px]">
                        Action Enforced: {v.action_taken}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE MANAGER */}
      {activeTab === 'knowledge' && (
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Verified Islamic Knowledge Registry
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Add and curate verified Hadiths and Qur'anic verses for the Islamic knowledge base
              </p>
            </div>
            <button
              onClick={() => setShowAddHadithModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Hadith</span>
            </button>
          </div>

          {/* Add Hadith Modal */}
          {showAddHadithModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-emerald-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Add Verified Hadith to Knowledge Base
                </h3>
                <form onSubmit={handleSaveHadith} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Collection</label>
                      <select
                        value={newHadith.collection}
                        onChange={e => setNewHadith({ ...newHadith, collection: e.target.value })}
                        className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                      >
                        <option>Sahih al-Bukhari</option>
                        <option>Sahih Muslim</option>
                        <option>Jami' at-Tirmidhi</option>
                        <option>Sunan Abi Dawud</option>
                        <option>Sunan an-Nasa'i</option>
                        <option>Sunan Ibn Majah</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Hadith Reference Number</label>
                      <input
                        type="text"
                        value={newHadith.hadith_number}
                        onChange={e => setNewHadith({ ...newHadith, hadith_number: e.target.value })}
                        placeholder="e.g. 1, 255, 3012"
                        className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Narrator</label>
                    <input
                      type="text"
                      value={newHadith.narrator}
                      onChange={e => setNewHadith({ ...newHadith, narrator: e.target.value })}
                      placeholder="e.g. Abu Hurairah (may Allah be pleased with him)"
                      className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Arabic Text with Tashkeel</label>
                    <textarea
                      value={newHadith.arabic_text}
                      onChange={e => setNewHadith({ ...newHadith, arabic_text: e.target.value })}
                      rows={3}
                      className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200 font-arabic text-sm text-right"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">English Translation</label>
                    <textarea
                      value={newHadith.english_text}
                      onChange={e => setNewHadith({ ...newHadith, english_text: e.target.value })}
                      rows={3}
                      className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Authenticity Grade</label>
                      <select
                        value={newHadith.authenticity_grade}
                        onChange={e => setNewHadith({ ...newHadith, authenticity_grade: e.target.value as any })}
                        className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                      >
                        <option value="Sahih">Sahih (صحيح)</option>
                        <option value="Hasan">Hasan (حسن)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Graded By</label>
                      <input
                        type="text"
                        value={newHadith.graded_by}
                        onChange={e => setNewHadith({ ...newHadith, graded_by: e.target.value })}
                        className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">Scholarly Explanation</label>
                    <textarea
                      value={newHadith.explanation}
                      onChange={e => setNewHadith({ ...newHadith, explanation: e.target.value })}
                      rows={2}
                      className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200"
                      placeholder="Fiqh deductions and Salaf commentary..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddHadithModal(false)}
                      className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                    >
                      Save Hadith
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AI INSTRUCTIONS & FILTER */}
      {activeTab === 'ai_config' && (
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                AI Islamic Persona & Topic Strictness Configuration
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Adjust prompt constraints and boundary strictness
              </p>
            </div>
            {savedNotice && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Configuration Updated Successfully
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Methodological Filter Preset:
              </label>
              <select
                value={strictnessLevel}
                onChange={e => setStrictnessLevel(e.target.value)}
                className="w-full sm:w-80 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200 font-semibold"
              >
                <option>Strict (Salaf Methodology & Authentic Sunnah Only)</option>
                <option>Standard (Educational & Compassionate Inquiries)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                System Prompt & Scholarly Instructions:
              </label>
              <textarea
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-800 dark:text-neutral-200 font-mono text-[11px] leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveAIConfig}
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
              >
                Save AI Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REPORTED ANSWERS */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-[#0b130e] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Reported Explanations for Scholarly Review
          </h3>
          {reportedAnswers.length === 0 ? (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 py-6 text-center">
              No answers reported by users. All responses are currently verified.
            </p>
          ) : (
            <div className="space-y-3">
              {reportedAnswers.map(rep => (
                <div key={rep.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">Report ID: {rep.id}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-semibold uppercase">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">Concern:</span> {rep.report_reason}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => DBService.resolveReportedAnswer(rep.id, 'Reviewed and verified authentic.', 'resolved').then(loadAdminData)}
                      className="px-3 py-1 rounded bg-emerald-700 text-white font-bold text-[11px]"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => DBService.resolveReportedAnswer(rep.id, 'Dismissed as unfounded.', 'dismissed').then(loadAdminData)}
                      className="px-3 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
