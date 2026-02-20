import React, { useState } from 'react';
import { 
  Activity, Wind, Moon, Scan, LayoutGrid
} from 'lucide-react';

// --- IMPORTĂ TOATE PAGINILE ---
// Asigură-te că ai fișierul CopdCalculator.tsx creat (vezi pasul 2)
import CopdCalculator from './components/CopdCalculator'; 
import AsthmaManager from './components/AsthmaManager';
import SpirometryAnalyzer from './components/SpirometryAnalyzer';
import SleepApneaScreening from './components/SleepApneaScreening';
import NoduleCalculator from './components/NoduleCalculator';

// --- CONFIGURAȚIA PAGINILOR (Aici adaugi pagini noi) ---
const PAGES = [
  { 
    id: 'copd', 
    label: 'BPOC (GOLD)', 
    icon: <Activity className="w-5 h-5"/>,
    component: <CopdCalculator /> 
  },
  { 
    id: 'asthma', 
    label: 'Astm (GINA)', 
    icon: <Wind className="w-5 h-5"/>,
    component: <AsthmaManager /> 
  },
  { 
    id: 'spiro', 
    label: 'Spirometrie', 
    icon: <LayoutGrid className="w-5 h-5"/>,
    component: <SpirometryAnalyzer /> 
  },
  { 
    id: 'sleep', 
    label: 'Somnologie', 
    icon: <Moon className="w-5 h-5"/>,
    component: <SleepApneaScreening /> 
  },
  { 
    id: 'nodule', 
    label: 'Noduli (Fleischner)', 
    icon: <Scan className="w-5 h-5"/>,
    component: <NoduleCalculator /> 
  },
];

export default function App() {
  const [activeTabId, setActiveTabId] = useState(PAGES[0].id);

  // Găsim componenta activă
  const activePage = PAGES.find(p => p.id === activeTabId) || PAGES[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION (Desktop) / TOPBAR (Mobile) */}
      <nav className="bg-white shadow-md z-20 md:w-64 md:min-h-screen flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center">
             <div className="w-8 h-8 bg-blue-600 rounded-lg mr-2 flex items-center justify-center text-white">
               <Activity className="w-5 h-5" />
             </div>
             PneumoTool
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium pl-10">Cabinet Assistant</p>
        </div>

        {/* Lista de butoane generate automat din PAGES */}
        <div className="flex overflow-x-auto md:flex-col p-2 gap-1 md:gap-2 no-scrollbar">
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setActiveTabId(page.id)}
              className={`
                flex items-center whitespace-nowrap px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold
                ${activeTabId === page.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className={`mr-3 ${activeTabId === page.id ? 'opacity-100' : 'opacity-70'}`}>
                {page.icon}
              </span>
              {page.label}
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENT AREA */}
      <main className="flex-1 p-2 md:p-6 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
           {activePage.component}
        </div>
        
        <footer className="mt-12 text-center text-xs text-slate-400 py-6 border-t border-slate-200/50">
           <p>© 2025 PneumoTool. Instrument educațional.</p>
        </footer>
      </main>

    </div>
  );
}
