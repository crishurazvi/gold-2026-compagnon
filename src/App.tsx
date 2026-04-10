import React, { useState } from 'react';
import { 
  Activity, Wind, Moon, Scan, LayoutGrid, BookOpen, Menu, X
} from 'lucide-react';

import CopdCalculator from './components/CopdCalculator'; 
import AsthmaManager from './components/AsthmaManager';
import SpirometryAnalyzer from './components/SpirometryAnalyzer';
import SleepApneaScreening from './components/SleepApneaScreening';
import NoduleCalculator from './components/NoduleCalculator';
import InhalerGallery from './components/InhalerGallery';

type PageIcon = typeof Activity;

interface Page {
  id: string;
  label: string;
  Icon: PageIcon;
  gradient: string;
  component: React.ReactNode;
}

const PAGES: Page[] = [
  { id: 'copd',    label: 'BPOC (GOLD)',       Icon: Activity,   gradient: 'from-blue-400 to-blue-600',     component: <CopdCalculator /> },
  { id: 'asthma',  label: 'Astm (GINA)',        Icon: Wind,       gradient: 'from-cyan-400 to-sky-600',      component: <AsthmaManager /> },
  { id: 'spiro',   label: 'Spirometrie',         Icon: LayoutGrid, gradient: 'from-teal-400 to-emerald-600',  component: <SpirometryAnalyzer /> },
  { id: 'sleep',   label: 'Somnologie',          Icon: Moon,       gradient: 'from-violet-400 to-purple-600', component: <SleepApneaScreening /> },
  { id: 'nodule',  label: 'Noduli (Fleischner)', Icon: Scan,       gradient: 'from-orange-400 to-rose-500',   component: <NoduleCalculator /> },
  { id: 'inhaler', label: 'Ghid Inhalatoare',    Icon: BookOpen,   gradient: 'from-pink-400 to-rose-600',     component: <InhalerGallery /> },
];

export default function App() {
  const [activeTabId, setActiveTabId] = useState(PAGES[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activePage = PAGES.find(p => p.id === activeTabId) || PAGES[0];

  const handleNav = (id: string) => {
    setActiveTabId(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 flex flex-col md:flex-row font-sans">

      {/* ── SIDEBAR (desktop) ── */}
      <nav className="hidden md:flex flex-col w-72 flex-shrink-0 min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 shadow-2xl z-20">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">PneumoTool</h1>
              <p className="text-xs text-blue-300/70 font-medium">Cabinet Assistant</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col p-3 gap-1 flex-1 mt-2 overflow-y-auto no-scrollbar">
          {PAGES.map(({ id, label, Icon, gradient }) => {
            const isActive = activeTabId === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold text-left border
                  ${isActive
                    ? 'bg-white/10 text-white border-white/10 shadow-lg'
                    : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all flex-shrink-0
                  ${isActive ? `bg-gradient-to-br ${gradient} shadow-md` : 'bg-white/5'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className="flex-1">{label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-slate-500 text-center">© 2025 PneumoTool · Instrument educațional</p>
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900 shadow-xl">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-lg">PneumoTool</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(v => !v)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-900/98 backdrop-blur-sm pt-16 px-4 overflow-y-auto">
          <div className="space-y-2 py-4">
            {PAGES.map(({ id, label, Icon, gradient }) => {
              const isActive = activeTabId === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={`w-full flex items-center px-4 py-4 rounded-xl transition-all text-left font-semibold border
                    ${isActive
                      ? 'bg-white/10 text-white border-white/10'
                      : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0
                    ${isActive ? `bg-gradient-to-br ${gradient}` : 'bg-white/5'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full animate-page-in">
          {activePage.component}
        </div>
        <footer className="px-8 py-5 border-t border-slate-200/60 text-center">
          <p className="text-xs text-slate-400">© 2025 PneumoTool · Instrument educațional · Nu înlocuiește judecata clinică</p>
        </footer>
      </main>

    </div>
  );
}
