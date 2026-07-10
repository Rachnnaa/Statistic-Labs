import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Compass,
  Coins,
  Cpu,
  BookOpen,
  HelpCircle,
  FileText,
  Landmark,
  Layers,
  Heart,
  Settings,
  X,
  Keyboard,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DistributionType } from './types';

// Import Modular Components
import HeroSection from './components/HeroSection';
import DistributionExplorer from './components/DistributionExplorer';
import SimulationSection from './components/SimulationSection';
import CLTSimulator from './components/CLTSimulator';
import LearningMode from './components/LearningMode';
import QuizSection from './components/QuizSection';
import PracticeProblems from './components/PracticeProblems';
import FormulaLibrary from './components/FormulaLibrary';
import AboutSection from './components/AboutSection';

type TabType =
  | 'home'
  | 'explorer'
  | 'simulations'
  | 'clt'
  | 'learn'
  | 'quiz'
  | 'problems'
  | 'formulas'
  | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [favorites, setFavorites] = useState<DistributionType[]>([]);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Load preferences from Local Storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('statslab-theme') as 'light' | 'dark' | null;
    const savedFavs = localStorage.getItem('statslab-favorites');

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to light theme
      document.documentElement.classList.remove('dark');
    }

    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    }
  }, []);

  // Sync theme changes
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('statslab-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle favorite distribution
  const handleToggleFavorite = (id: DistributionType) => {
    let nextFavs: DistributionType[] = [];
    if (favorites.includes(id)) {
      nextFavs = favorites.filter(f => f !== id);
    } else {
      nextFavs = [...favorites, id];
    }
    setFavorites(nextFavs);
    localStorage.setItem('statslab-favorites', JSON.stringify(nextFavs));
  };

  // Keyboard shortcuts event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Number keys to switch tabs
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const tabs: TabType[] = [
          'home',
          'explorer',
          'simulations',
          'clt',
          'learn',
          'quiz',
          'problems',
          'formulas',
          'about'
        ];
        const index = parseInt(e.key) - 1;
        if (index < tabs.length) {
          setActiveTab(tabs[index]);
        }
      }
      
      // press 'k' to show shortcuts modal
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col font-sans" id="main-application-frame">
      {/* Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800/80 transition-all" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" id="header-content-wrapper">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')} id="logo-brand">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-blue-500/20" id="logo-badge">
              ∑
            </div>
            <div>
              <span className="font-black text-gray-950 dark:text-white tracking-tight text-md block" id="header-logo-text">StatsLab</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase block" id="header-logo-sub">Probability Portal</span>
            </div>
          </div>

          {/* Desktop central navigation links */}
          <nav className="hidden xl:flex items-center gap-1" id="desktop-navbar">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'explorer'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-explorer"
            >
              Explorer
            </button>
            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'simulations'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-simulations"
            >
              Simulations
            </button>
            <button
              onClick={() => setActiveTab('clt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'clt'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-clt"
            >
              CLT
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-learn"
            >
              Handbook
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-quiz"
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'problems'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-problems"
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-formulas"
            >
              Formulas
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              id="nav-about"
            >
              History
            </button>
          </nav>

          {/* Action Utilities (Theme, Keyboard Shortcuts, etc.) */}
          <div className="flex items-center gap-2" id="header-utils">
            {/* Keyboard guide trigger */}
            <button
              onClick={() => setShowShortcutsHelp(true)}
              className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Keyboard Shortcuts Guide"
              id="kbd-guide-trigger"
            >
              <Keyboard className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Toggle Theme Mode"
              id="theme-toggle"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row (Scrollable horizontally) */}
        <div className="xl:hidden border-t border-gray-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md overflow-x-auto" id="mobile-navbar">
          <div className="px-4 py-2 flex gap-1.5 min-w-max">
            {(['home', 'explorer', 'simulations', 'clt', 'learn', 'quiz', 'problems', 'formulas', 'about'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg capitalize transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-slate-200'
                }`}
              >
                {tab === 'clt' ? 'CLT' : tab === 'learn' ? 'Handbook' : tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Educational Panels Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="app-main-canvas">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="panel-wrapper-motion"
          >
            {activeTab === 'home' && (
              <HeroSection onNavigate={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === 'explorer' && (
              <DistributionExplorer
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'simulations' && <SimulationSection />}

            {activeTab === 'clt' && <CLTSimulator />}

            {activeTab === 'learn' && <LearningMode />}

            {activeTab === 'quiz' && <QuizSection />}

            {activeTab === 'problems' && <PracticeProblems />}

            {activeTab === 'formulas' && <FormulaLibrary />}

            {activeTab === 'about' && <AboutSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Statistics Department Academic Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800/80 py-8 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-3" id="footer-inner">
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3" id="footer-academic-labels">
            <span>Department of Statistics</span>
            <span className="hidden md:inline text-gray-300 dark:text-slate-800">|</span>
            <span>Virtual Probability Laboratory</span>
            <span className="hidden md:inline text-gray-300 dark:text-slate-800">|</span>
            <span>Academic Portal 2026</span>
          </div>
          <p className="text-[10px] text-gray-400" id="footer-frameworks-spec">
            Engineered cleanly with HTML5 • CSS3 • React 19 • Tailwind CSS v4 • KaTeX Equations • Vector SVGs
          </p>
        </div>
      </footer>

      {/* Keyboard shortcuts modal overlay */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm" id="shortcuts-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-gray-100 dark:border-slate-700 shadow-2xl relative space-y-4"
              id="shortcuts-modal-box"
            >
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                id="close-shortcuts-modal"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-500" />
                Keyboard Shortcuts
              </h4>

              <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300" id="shortcuts-list">
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Show / Hide shortcuts</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Ctrl + k</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Home</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 1</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Explorer</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 2</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Simulations</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 3</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: CLT Simulator</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 4</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Handbooks</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 5</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Quiz game</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 6</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Practice</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 7</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-slate-700/60 pb-1.5">
                  <span className="font-semibold">Tab: Formulas</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 8</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-semibold">Tab: History</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-bold">Alt + 9</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-slate-800/50 rounded-xl flex items-start gap-2 border border-blue-100 dark:border-slate-700 text-[10px] text-blue-700 dark:text-blue-300 font-semibold leading-normal" id="shortcuts-info">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Keyboard shortcuts facilitate quick and rapid tab routing directly from your desktop keyboard layout.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
