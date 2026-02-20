import React, { useState } from 'react';
import { 
  Wind, ShieldCheck, AlertTriangle, CheckCircle2, 
  ArrowUpCircle, ArrowDownCircle, Info, Stethoscope, Pill
} from 'lucide-react';

// --- DEFINIȚII DE TIPURI ---
interface ControlQuestions {
  daytimeSymptoms: boolean;
  nightWaking: boolean;
  relieverUse: boolean;
  activityLimitation: boolean;
}

type TreatmentStep = 0 | 1 | 3 | 4 | 5; // 0 = Naiv. 1 = Step 1&2 (sunt combinate în Track 1).

// --- COMPONENTA PRINCIPALĂ ---
export default function AsthmaManager() {
  const [questions, setQuestions] = useState<ControlQuestions>({
    daytimeSymptoms: false,
    nightWaking: false,
    relieverUse: false,
    activityLimitation: false,
  });

  const [currentStep, setCurrentStep] = useState<TreatmentStep>(0);

  // --- LOGICA DE EVALUARE GINA 2024 ---
  const yesCount = Object.values(questions).filter(Boolean).length;
  
  let controlStatus = "Bine Controlat";
  let controlColor = "text-emerald-700";
  let controlBg = "bg-emerald-50 border-emerald-200";
  let controlIcon = <ShieldCheck className="w-8 h-8 text-emerald-500" />;

  if (yesCount >= 3) {
    controlStatus = "Necontrolat";
    controlColor = "text-rose-700";
    controlBg = "bg-rose-50 border-rose-200";
    controlIcon = <AlertTriangle className="w-8 h-8 text-rose-500" />;
  } else if (yesCount >= 1) {
    controlStatus = "Parțial Controlat";
    controlColor = "text-amber-700";
    controlBg = "bg-amber-50 border-amber-200";
    controlIcon = <Info className="w-8 h-8 text-amber-500" />;
  }

  // --- LOGICA DE TRATAMENT (STEPWISE) ---
  let recommendedStep: TreatmentStep = currentStep;
  let actionText = "";
  let actionIcon = null;
  let actionColor = "";

  if (currentStep === 0) {
    actionText = "Inițiere Tratament";
    actionColor = "text-blue-600 bg-blue-50 border-blue-200";
    actionIcon = <Pill className="w-6 h-6 text-blue-500" />;
    recommendedStep = yesCount >= 3 ? 3 : 1; // Naiv necontrolat -> Step 3. Altfel Step 1/2.
  } else {
    if (controlStatus === "Necontrolat") {
      actionText = "Recomandare: STEP UP (Crește treapta)";
      actionColor = "text-rose-700 bg-rose-50 border-rose-200";
      actionIcon = <ArrowUpCircle className="w-6 h-6 text-rose-500" />;
      if (currentStep === 1) recommendedStep = 3;
      else if (currentStep === 3) recommendedStep = 4;
      else if (currentStep === 4) recommendedStep = 5;
      else recommendedStep = 5;
    } else if (controlStatus === "Parțial Controlat") {
      actionText = "Consideră: STEP UP (Crește treapta)";
      actionColor = "text-amber-700 bg-amber-50 border-amber-200";
      actionIcon = <ArrowUpCircle className="w-6 h-6 text-amber-500" />;
      if (currentStep === 1) recommendedStep = 3;
      else if (currentStep === 3) recommendedStep = 4;
      else if (currentStep === 4) recommendedStep = 5;
      else recommendedStep = 5;
    } else {
      actionText = "Menține Tratamentul (Consideră STEP DOWN dacă e stabil > 3 luni)";
      actionColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
      actionIcon = <ArrowDownCircle className="w-6 h-6 text-emerald-500" />;
      recommendedStep = currentStep;
    }
  }

  // --- DESCRIEREA TREPTELOR (GINA TRACK 1 - MART/SMART) ---
  const stepDetails: Record<number, { title: string; desc: string; alternative?: string }> = {
    1: {
      title: "Step 1 & 2: As-Needed Only",
      desc: "ICS-Formoterol în doză mică administrat DOAR la nevoie pentru ameliorarea simptomelor.",
      alternative: "Nu se recomandă SABA în monoterapie."
    },
    3: {
      title: "Step 3: MART Doză Mică",
      desc: "Terapie SMART/MART: ICS-Formoterol în doză mică administrat ZILNIC (de menținere) + LA NEVOIE pentru simptome.",
    },
    4: {
      title: "Step 4: MART Doză Medie",
      desc: "Terapie SMART/MART: ICS-Formoterol în doză medie administrat ZILNIC (de menținere) + LA NEVOIE.",
    },
    5: {
      title: "Step 5: Terapie Avansată & Fenotipare",
      desc: "Adaugă LAMA. Treci la ICS-Formoterol doză mare. Evaluează fenotipul (IgE, Eozinofile) pentru terapie biologică (ex. Anti-IgE, Anti-IL5, Anti-IL4R). Trimite la specialist.",
    }
  };

  const handleToggle = (field: keyof ControlQuestions) => {
    setQuestions(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans p-4 md:p-8 rounded-3xl">
      <header className="mb-8 flex items-center space-x-3">
        <Wind className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Management Astm (GINA 2024)</h2>
          <p className="text-sm text-slate-500 font-medium">Evaluarea Controlului & Abordarea MART (Track 1)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLOANA STÂNGA: INPUTURI */}
        <section className="lg:col-span-6 space-y-6">
          
          {/* Partea 1: Evaluare Control (4 întrebări) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" /> 1. Evaluarea Controlului (Ultimele 4 săptămâni)
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <input type="checkbox" checked={questions.daytimeSymptoms} onChange={() => handleToggle('daytimeSymptoms')} 
                  className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold text-slate-800">Simptome diurne de astm &gt; 2 ori/săptămână?</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <input type="checkbox" checked={questions.nightWaking} onChange={() => handleToggle('nightWaking')} 
                  className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold text-slate-800">Treziri nocturne din cauza astmului?</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <input type="checkbox" checked={questions.relieverUse} onChange={() => handleToggle('relieverUse')} 
                  className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold text-slate-800">Utilizare medicație de salvare (reliever) &gt; 2 ori/săptămână?</p>
                  <p className="text-xs text-slate-500">Exclusiv utilizarea profilactică înainte de efort.</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                <input type="checkbox" checked={questions.activityLimitation} onChange={() => handleToggle('activityLimitation')} 
                  className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"/>
                <div>
                  <p className="font-semibold text-slate-800">Limitarea activității din cauza astmului?</p>
                </div>
              </label>
            </div>
          </div>

          {/* Partea 2: Tratament Curent */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2" /> 2. Tratament Curent
            </h3>
            
            <select 
              value={currentStep} 
              onChange={(e) => setCurrentStep(Number(e.target.value) as TreatmentStep)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value={0}>Pacient Naiv (Fără tratament curent)</option>
              <option value={1}>Step 1 sau 2 (Doar medicație la nevoie - SABA sau ICS-Formoterol)</option>
              <option value={3}>Step 3 (Tratament de menținere doză mică)</option>
              <option value={4}>Step 4 (Tratament de menținere doză medie)</option>
              <option value={5}>Step 5 (Tratament de menținere doză mare / LAMA / Biologic)</option>
            </select>
          </div>

        </section>

        {/* COLOANA DREAPTA: REZULTATE ȘI RECOMANDĂRI */}
        <section className="lg:col-span-6 space-y-6">
          
          {/* Card Control Astm */}
          <div className={`p-6 rounded-2xl shadow-sm border ${controlBg} flex items-center space-x-4 transition-all duration-300`}>
            {controlIcon}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70 text-slate-600">Nivel Control</p>
              <h3 className={`text-3xl font-black ${controlColor}`}>{controlStatus}</h3>
              <p className="text-sm font-medium mt-1 text-slate-600">
                {yesCount} din 4 criterii prezente
              </p>
            </div>
          </div>

          {/* Card Decizie Acțiune */}
          <div className={`p-5 rounded-2xl border flex items-center space-x-4 ${actionColor}`}>
            {actionIcon}
            <span className="font-bold text-lg">{actionText}</span>
          </div>

          {/* Pre-Step Up Warning */}
          {yesCount >= 1 && currentStep > 0 && (
            <div className="bg-slate-800 p-5 rounded-2xl shadow-lg text-white">
              <h4 className="font-bold text-rose-400 flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 mr-2"/> Înainte de orice STEP UP:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                <li>Verifică tehnica de inhalare a pacientului.</li>
                <li>Verifică aderența la tratamentul actual.</li>
                <li>Investighează expunerea la alergeni/fumat și comorbiditățile (ex. rinită, GERD).</li>
              </ul>
            </div>
          )}

          {/* Card Recomandare Tratament GINA */}
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-600/20 text-white transform transition-all duration-300">
            <p className="text-blue-200 font-semibold text-xs uppercase tracking-wider mb-2">
              Tratament Recomandat (Track 1 Preferat)
            </p>
            <h3 className="text-2xl font-black mb-3 leading-tight">{stepDetails[recommendedStep].title}</h3>
            <p className="text-blue-50 text-base font-medium leading-relaxed">
              {stepDetails[recommendedStep].desc}
            </p>
            
            {stepDetails[recommendedStep].alternative && (
              <div className="mt-4 pt-4 border-t border-blue-500/50 flex items-start">
                <Info className="w-5 h-5 mr-2 flex-shrink-0 text-blue-300" />
                <p className="text-sm text-blue-100">{stepDetails[recommendedStep].alternative}</p>
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}
