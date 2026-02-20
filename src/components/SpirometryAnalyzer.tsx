import React, { useState, useEffect } from 'react';
import { Activity, Info, Wind, AlertTriangle, CheckCircle2 } from 'lucide-react';

// --- DEFINIȚII DE TIPURI ---
interface SpiroData {
  fev1FvcRatio: number | '';
  fev1Percent: number | '';
  fvcPercent: number | '';
  tlcPercent: number | '';
  rvPercent: number | '';
  dlcoPercent: number | '';
}

interface InterpretationResult {
  pattern: string;
  patternColor: string;
  patternBg: string;
  severity: string;
  severityColor: string;
  dlcoStatus: string;
  dlcoColor: string;
  warnings: string[];
}

// --- LOGICA DE INTERPRETARE ATS/ERS ---
function interpretSpirometry(data: SpiroData): InterpretationResult {
  const result: InterpretationResult = {
    pattern: "Normal",
    patternColor: "text-emerald-700",
    patternBg: "bg-emerald-50 border-emerald-200",
    severity: "N/A",
    severityColor: "text-slate-500",
    dlcoStatus: "Neevaluat",
    dlcoColor: "text-slate-500",
    warnings: []
  };

  const ratio = Number(data.fev1FvcRatio);
  const fev1 = Number(data.fev1Percent);
  const fvc = Number(data.fvcPercent);
  const tlc = Number(data.tlcPercent);
  const dlco = Number(data.dlcoPercent);

  if (!data.fev1FvcRatio) return result; // Așteptăm date

  // 1. Tipul Defectului
  // Folosim 0.70 ca proxy standard pt obstrucție (deși ERS recomandă strict LLN, 0.70 e standard în practică)
  const isObstructed = ratio < 0.70;
  
  // Restricția se confirmă cu TLC < 80%. Dacă nu avem TLC, suspectăm din FVC < 80%
  let isRestricted = false;
  if (data.tlcPercent !== '') {
    isRestricted = tlc < 80;
  } else if (data.fvcPercent !== '') {
    isRestricted = fvc < 80;
    if (isRestricted) {
      result.warnings.push("Restricția este sugerată de FVC scăzut. Se recomandă pletismografie (TLC) pentru confirmare.");
    }
  }

  if (isObstructed && isRestricted) {
    result.pattern = "Model Mixt (Obstructiv + Restrictiv)";
    result.patternColor = "text-rose-700";
    result.patternBg = "bg-rose-50 border-rose-200";
  } else if (isObstructed) {
    result.pattern = "Sindrom Obstructiv";
    result.patternColor = "text-orange-700";
    result.patternBg = "bg-orange-50 border-orange-200";
  } else if (isRestricted) {
    result.pattern = "Sindrom Restrictiv";
    result.patternColor = "text-amber-700";
    result.patternBg = "bg-amber-50 border-amber-200";
  }

  // 2. Severitatea Obstrucției (ATS/ERS pe baza FEV1%)
  if (isObstructed && data.fev1Percent !== '') {
    if (fev1 >= 70) { result.severity = "Ușoară"; result.severityColor = "text-amber-500"; }
    else if (fev1 >= 60) { result.severity = "Moderată"; result.severityColor = "text-orange-500"; }
    else if (fev1 >= 50) { result.severity = "Moderat-Severă"; result.severityColor = "text-orange-600"; }
    else if (fev1 >= 35) { result.severity = "Severă"; result.severityColor = "text-rose-600"; }
    else { result.severity = "Foarte Severă"; result.severityColor = "text-rose-800 font-bold"; }
  }

  // 3. Interpretare DLCO
  if (data.dlcoPercent !== '') {
    if (dlco < 40) { result.dlcoStatus = "Scăzut (Sever)"; result.dlcoColor = "text-rose-600"; }
    else if (dlco < 60) { result.dlcoStatus = "Scăzut (Moderat)"; result.dlcoColor = "text-orange-500"; }
    else if (dlco < 80) { result.dlcoStatus = "Scăzut (Ușor)"; result.dlcoColor = "text-amber-500"; }
    else if (dlco <= 120) { result.dlcoStatus = "Normal"; result.dlcoColor = "text-emerald-600"; }
    else { result.dlcoStatus = "Crescut"; result.dlcoColor = "text-blue-600"; }
  }

  return result;
}

// --- COMPONENTA REACT ---
export default function SpirometryAnalyzer() {
  const [data, setData] = useState<SpiroData>({
    fev1FvcRatio: '',
    fev1Percent: '',
    fvcPercent: '',
    tlcPercent: '',
    rvPercent: '',
    dlcoPercent: ''
  });

  const [result, setResult] = useState<InterpretationResult>(interpretSpirometry(data));

  useEffect(() => {
    setResult(interpretSpirometry(data));
  }, [data]);

  const handleChange = (field: keyof SpiroData, value: string) => {
    setData(prev => ({ ...prev, [field]: value === '' ? '' : Number(value) }));
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans p-4 md:p-8 rounded-3xl">
      <header className="mb-8 flex items-center space-x-3">
        <Wind className="w-8 h-8 text-teal-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analizor Spirometrie ATS/ERS</h2>
          <p className="text-sm text-slate-500 font-medium">Interpretare automată volume și difuziune</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLOANA STÂNGA: INPUTURI */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Flux și Volume Dinamice */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Flux & Volume
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">FEV1/FVC (Raport absolut, ex: 0.65)</label>
                <input type="number" step="0.01" value={data.fev1FvcRatio} onChange={(e) => handleChange('fev1FvcRatio', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">FEV1 (% prezis)</label>
                  <input type="number" value={data.fev1Percent} onChange={(e) => handleChange('fev1Percent', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">FVC (% prezis)</label>
                  <input type="number" value={data.fvcPercent} onChange={(e) => handleChange('fvcPercent', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
              </div>
            </div>
          </div>

          {/* Pletismografie & Difuziune */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Volume Statice & Difuziune</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">TLC (% prezis)</label>
                  <input type="number" value={data.tlcPercent} onChange={(e) => handleChange('tlcPercent', e.target.value)}
                    placeholder="Opțional" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">RV (% prezis)</label>
                  <input type="number" value={data.rvPercent} onChange={(e) => handleChange('rvPercent', e.target.value)}
                    placeholder="Opțional" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">DLCO (% prezis)</label>
                <input type="number" value={data.dlcoPercent} onChange={(e) => handleChange('dlcoPercent', e.target.value)}
                  placeholder="Capacitatea de difuziune" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"/>
              </div>
            </div>
          </div>
        </section>

        {/* COLOANA DREAPTA: REZULTATE */}
        <section className="lg:col-span-7 space-y-6">
          
          {data.fev1FvcRatio === '' ? (
             <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
               <Activity className="w-12 h-12 mb-3 text-slate-300" />
               <p className="font-medium text-lg">Introduceți datele spirometrice</p>
               <p className="text-sm">Raportul FEV1/FVC este necesar pentru a începe.</p>
             </div>
          ) : (
            <>
              {/* Pattern Card */}
              <div className={`p-6 rounded-2xl shadow-sm border ${result.patternBg} transition-all duration-300`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Model Ventilator</p>
                <h3 className={`text-3xl font-black ${result.patternColor}`}>{result.pattern}</h3>
                
                {result.pattern === "Normal" && (
                  <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Funcție pulmonară în limite normale.
                  </div>
                )}
              </div>

              {/* Parametrii Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Severitate Obstrucție</p>
                  <p className={`text-2xl font-bold ${result.severityColor}`}>
                    {result.severity}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Bazat pe FEV1 % prezis</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Interpretare DLCO</p>
                  <p className={`text-2xl font-bold ${result.dlcoColor}`}>
                    {result.dlcoStatus}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Capacitatea de transfer</p>
                </div>
              </div>

              {/* Avertismente (dacă există) */}
              {result.warnings.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-sm font-semibold text-blue-800">{w}</p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </section>
      </div>
    </div>
  );
}
