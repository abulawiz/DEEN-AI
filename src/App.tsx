import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ChatAssistant } from './components/chat/ChatAssistant';
import { QuranAssistant } from './components/quran/QuranAssistant';
import { HadithAssistant } from './components/hadith/HadithAssistant';
import { KnowledgeLibrary } from './components/library/KnowledgeLibrary';
import { DailyReminders } from './components/reminders/DailyReminders';
import { LearningCenter } from './components/learning/LearningCenter';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { ViolationModal } from './components/chat/ViolationModal';
import { LoginPage } from './components/auth/LoginPage';

const MainAppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#040806] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            Loading DEEN AI...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleSendDirectPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#040806] text-neutral-900 dark:text-neutral-100 flex font-sans transition-colors">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onOpenAppealModal={() => setIsAppealModalOpen(true)}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <MainDashboard
              onNavigate={setActiveTab}
              onSendDirectPrompt={handleSendDirectPrompt}
            />
          )}

          {activeTab === 'chat' && (
            <ChatAssistant
              initialPrompt={initialPrompt}
              onClearInitialPrompt={() => setInitialPrompt(null)}
            />
          )}

          {activeTab === 'quran' && (
            <QuranAssistant />
          )}

          {activeTab === 'hadith' && (
            <HadithAssistant />
          )}

          {activeTab === 'library' && (
            <KnowledgeLibrary />
          )}

          {activeTab === 'reminders' && (
            <DailyReminders />
          )}

          {activeTab === 'learning' && (
            <LearningCenter />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard />
          )}
        </main>
      </div>

      {/* Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAppealModal={() => {
          setIsSettingsOpen(false);
          setIsAppealModalOpen(true);
        }}
      />

      <ViolationModal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
