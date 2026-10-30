/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { NewsAnalyzer } from './components/NewsAnalyzer';
import { AnalysisHistory } from './components/AnalysisHistory';
import { AdminDashboard } from './components/AdminDashboard';
import { UserGuide } from './components/UserGuide';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';

function MainAppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Sync dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openAuthModal={() => setAuthModalOpen(true)}
        openProfileModal={() => setProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyzer' && (
          <div className="space-y-10">
            <LandingHero
              onStartAnalysis={() => {
                const el = document.getElementById('news-article-input');
                el?.scrollIntoView({ behavior: 'smooth' });
                el?.focus();
              }}
              onExploreArchitecture={() => setActiveTab('architecture')}
            />
            <NewsAnalyzer />
          </div>
        )}

        {activeTab === 'history' && <AnalysisHistory />}

        {activeTab === 'architecture' && <ArchitectureDocs />}

        {activeTab === 'guide' && <UserGuide onGoToAnalyzer={() => setActiveTab('analyzer')} />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-200">Veritas AI</span>
            <span>— Bi-LSTM Bidirectional Deep Learning News Verification System</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-indigo-500" />
              <span>128-Sequence Bi-LSTM (Keras/TensorFlow/PyTorch)</span>
            </span>
            <span>•</span>
            <span>F1: 94.2%</span>
            <span>•</span>
            <span>Responsible AI Compliance</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
