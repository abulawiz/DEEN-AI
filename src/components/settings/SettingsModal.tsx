import React, { useState } from 'react';
import { X, User, Shield, Check, Save, Award, Info, BookOpen, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppealModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenAppealModal }) => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'account' | 'author'>('profile');

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [translation, setTranslation] = useState(currentUser?.preferred_translation || 'Saheeh International');
  const [fontSize, setFontSize] = useState<'text-xl' | 'text-2xl' | 'text-3xl'>(currentUser?.arabic_font_size || 'text-2xl');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      preferred_translation: translation,
      arabic_font_size: fontSize
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Unable to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0c1410] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Settings & Preferences
        </h2>

        {/* Tab Headers */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'security'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'account'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Policy Status</span>
          </button>
          <button
            onClick={() => setActiveTab('author')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'author'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Author & Credits</span>
          </button>
        </div>

        {/* Success toast */}
        {savedSuccess && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Settings updated successfully.</span>
          </div>
        )}

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Display Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Preferred Qur'an Translation
              </label>
              <select
                value={translation}
                onChange={e => setTranslation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option>Saheeh International</option>
                <option>Hilali & Khan (Noble Qur'an)</option>
                <option>Pickthall</option>
                <option>Yusuf Ali</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Arabic Font Size
              </label>
              <select
                value={fontSize}
                onChange={e => setFontSize(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="text-xl">Standard (20px)</option>
                <option value="text-2xl">Large (24px - Recommended)</option>
                <option value="text-3xl">Extra Large (30px)</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
            <div className="p-3 bg-neutral-50 dark:bg-[#080e0b] rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
              Signed in as <span className="font-semibold text-neutral-900 dark:text-neutral-100">{currentUser?.email}</span>. Update your password below to keep your account secure.
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-medium">
                {passwordError}
              </div>
            )}

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#070d0a] text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ACCOUNT & RESTRICTIONS */}
        {activeTab === 'account' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#080e0b] border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Account Role:</span>
                <span className="px-2 py-0.5 rounded uppercase font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300">
                  {currentUser?.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Policy Violation Strikes:</span>
                <span className="font-bold text-red-600 dark:text-red-400">{currentUser?.violation_count || 0} Incident(s)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Account Suspension:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                  {currentUser?.is_suspended ? 'Suspended' : 'Clear / Good Standing'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAppealModal();
              }}
              className="w-full py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              Open Appeal & Restriction Center
            </button>
          </div>
        )}

        {/* TAB 4: AUTHOR & CREDITS */}
        {activeTab === 'author' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-neutral-900 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                Abulawzat Digital Solution
              </h3>
              <p className="text-xs font-semibold text-emerald-800 dark:text-amber-300">
                Department of Computer Science
              </p>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto pt-2 leading-relaxed">
                Creators and Principal Authors of <strong>DEEN AI</strong> — The Intelligent Islamic Companion dedicated to authentic Islamic knowledge retrieval, Quran, and Sunnah according to the Salaf as-Salih.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#080e0b] border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Application Specifications</span>
              </div>
              <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">DEEN AI v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Organization / Author:</span>
                  <span className="font-semibold text-emerald-800 dark:text-amber-300">Abulawzat Digital Solution</span>
                </div>
                <div className="flex justify-between">
                  <span>Faculty / Department:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Department of Computer Science</span>
                </div>
                <div className="flex justify-between">
                  <span>Knowledge Methodology:</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Qur'an & Sunnah upon the Salaf</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
