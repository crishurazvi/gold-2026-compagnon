import React, { useState } from 'react';
import { 
  Moon, Scale, User, Ruler, 
  Activity, AlertTriangle, CheckCircle2, 
  BedDouble, Car, Armchair, Coffee
} from 'lucide-react';

// --- DEFINIȚII STOP-BANG ---
interface StopBangState {
  snoring: boolean;    // S - Snoring
  tired: boolean;      // T - Tired
  observed: boolean;   // O - Observed
  pressure: boolean;   // P - Blood Pressure
  bmi: boolean;        // B - BMI > 35
  age: boolean;        // A - Age > 50
  neck: boolean;       // N - Neck > 40cm
  gender: boolean;     // G - Gender = Male
}

// --- DEFINIȚII EPWORTH ---
// 8 întrebări standard, scor 0-3
type EpworthScores = number[]; 

const EPWORTH_QUESTIONS = [
  { id: 0, text: "Stând jos și citind", icon: <Armchair className="w-5 h-5"/> },
  { id: 1, text: "Privind la televizor", icon: <Activity className="w-5 h-5"/> },
  { id: 2, text: "Stând inactiv într-un loc public (teatru, ședință)", icon: <User className="w-5 h-5"/> },
  { id: 3, text: "Pasager într-o mașină timp de o oră fără pauză", icon: <Car className="w-5 h-5"/> },
  { id: 4, text: "Stând întins după-amiaza (când e posibil)", icon: <BedDouble className="w-5 h-5"/> },
  { id: 5, text: "Stând jos și vorbind cu cineva", icon: <Coffee className="w-5 h-5"/> },
  { id: 6, text: "Stând liniștit după prânz (fără alcool)", icon: <Armchair className="w-5 h-5"/> },
  { id: 7, text: "În mașină, oprit câteva minute în trafic", icon: <Car className="w-5 h-5"/> },
];

export default function SleepApneaScreening() {
  // STATE
  const [stopBang, setStopBang] = useState<StopBangState>({
    snoring: false, tired: false, observed: false, pressure: false,
    bmi: false, age: false, neck: false, gender: false
  });

  const [epworth, setEpworth] = useState<EpworthScores>(Array(8).fill(0));

  // --- LOGICĂ CALCUL ---
  const sbScore = Object.values(stopBang).filter(Boolean).length;
  const essScore = epworth.reduce((a, b) => a + b, 0);

  // Interpretare STOP-BANG
  let osaRisk = "Scăzut";
  let osaColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (sbScore >= 5) {
    osaRisk = "Înalt";
    osaColor = "text-rose-600 bg-rose-50 border-rose-200";
  } else if (sbScore >= 3) {
    osaRisk = "Intermediar";
    osaColor = "text-orange-600 bg-orange-50 border-orange-200";
  }

  // Recomandare
  let recommendation = "";
  if (sbScore >= 3 && essScore >= 11) {
    recommendation = "Poligrafie / Polisomnografie Prioritară (Simptomatic)";
  } else if (sbScore >= 5) {
    recommendation = "Screening prin Poligrafie Respiratorie";
  } else if (sbScore >= 3) {
    recommendation = "Monitorizare clinică sau Poligrafie dacă există comorbidități CV";
  } else {
    recommendation = "Nu necesită investigații specifice de somn în acest moment";
  }

  // HANDLERS
  const toggleStopBang = (key: keyof StopBangState) => {
    setStopBang(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setEpworthScore = (index: number, val: number) => {
    const newScores = [...epworth];
    newScores[index] = val;
    setEpworth(newScores);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans p-4 md:p-8 rounded-3xl">
      <header className="mb-8 flex items-center space-x-3">
        <Moon className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Screening Apnee în Somn</h2>
          <p className="text-sm text-slate-500 font-medium">STOP-BANG & Epworth Sleepiness Scale</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PARTEA 1: STOP-BANG (Left Column on large screens) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md text-sm mr-2">1</span> 
              Chestionar STOP-BANG
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* S */}
              <StopBangCard 
                active={stopBang.snoring} 
                onClick={() => toggleStopBang('snoring')}
                label="S - Sforăit"
                desc="Sforăiți zgomotos? (Se aude prin ușa închisă?)"
              />
              {/* T */}
              <StopBangCard 
                active={stopBang.tired} 
                onClick={() => toggleStopBang('tired')}
                label="T - Tired (Obosit)"
                desc="Vă simțiți obosit sau somnolent în timpul zilei?"
              />
              {/* O */}
              <StopBangCard 
                active={stopBang.observed} 
                onClick={() => toggleStopBang('observed')}
                label="O - Observed (Observat)"
                desc="A observat cineva că vă opriți din respirat în somn?"
              />
              {/* P */}
              <StopBangCard 
                active={stopBang.pressure} 
                onClick={() => toggleStopBang('pressure')}
                label="P - Presiune Arterială"
                desc="Aveți hipertensiune arterială (sau luați tratament)?"
              />
              {/* B */}
              <StopBangCard 
                active={stopBang.bmi} 
                onClick={() => toggleStopBang('bmi')}
                label="B - BMI (IMC)"
                desc="Indicele de masă corporală > 35 kg/m²?"
                icon={<Scale className="w-4 h-4"/>}
              />
              {/* A */}
              <StopBangCard 
                active={stopBang.age} 
                onClick={() => toggleStopBang('age')}
                label="A - Age (Vârstă)"
                desc="Vârsta > 50 de ani?"
              />
              {/* N */}
              <StopBangCard 
                active={stopBang.neck} 
                onClick={() => toggleStopBang('neck')}
                label="N - Neck (Gât)"
                desc="Circumferința gâtului > 40 cm?"
                icon={<Ruler className="w-4 h-4"/>}
              />
              {/* G */}
              <StopBangCard 
                active={stopBang.gender} 
                onClick={() => toggleStopBang('gender')}
                label="G - Gender (Gen)"
                desc="Gen masculin?"
                icon={<User className="w-4 h-4"/>}
              />
            </div>
          </div>
        </section>

        {/* PARTEA 2: EPWORTH & REZULTATE (Right Column) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Rezultate Dashboard (Sticky pe tabletă) */}
          <div className={`p-6 rounded-2xl shadow-md border-l-4 ${osaColor} transition-all sticky top-4 z-10 bg-white`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Risc STOP-BANG</p>
                <h3 className="text-3xl font-black">{osaRisk}</h3>
                <p className="text-sm font-semibold opacity-80 mt-1">Scor: {sbScore} / 8</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Scor Epworth</p>
                <h3 className={`text-3xl font-black ${essScore > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {essScore} / 24
                </h3>
                <p className="text-xs font-semibold opacity-80 mt-1">
                  {essScore > 10 ? "Somnolență Excesivă" : "Normal"}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-2">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Recomandare Clinică</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">{recommendation}</p>
            </div>
          </div>

          {/* Scara Epworth */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md text-sm mr-2">2</span> 
              Scara Epworth (Șansa de a ațipi)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              0 = Niciodată, 1 = Șansă mică, 2 = Șansă moderată, 3 = Șansă mare
            </p>

            <div className="space-y-4">
              {EPWORTH_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                    <span className="text-slate-400 mr-2">{q.icon}</span>
                    {q.text}
                  </div>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3].map(val => (
                      <button
                        key={val}
                        onClick={() => setEpworthScore(idx, val)}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                          epworth[idx] === val 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}

// Helper Component pentru cardurile STOP-BANG
function StopBangCard({ active, onClick, label, desc, icon }: { 
  active: boolean, onClick: () => void, label: string, desc: string, icon?: React.ReactNode 
}) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col justify-between h-full ${
        active 
          ? 'border-indigo-500 bg-indigo-50 shadow-md' 
          : 'border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white'
      }`}
    >
      <div className="flex justify-between items-start w-full mb-2">
        <span className={`font-bold ${active ? 'text-indigo-700' : 'text-slate-600'}`}>{label}</span>
        {active ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : (icon || <div className="w-5 h-5"/>)}
      </div>
      <p className={`text-xs font-medium leading-relaxed ${active ? 'text-indigo-800' : 'text-slate-500'}`}>
        {desc}
      </p>
    </button>
  );
}
