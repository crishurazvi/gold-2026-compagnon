import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Activity, Heart, ShieldAlert, 
  Syringe, Info, ChevronRight, Stethoscope
} from 'lucide-react';
// --- 1. TYPE DEFINITIONS ---
type TreatmentRegimen = "NONE" | "SABA_SAMA_ONLY" | "LABA" | "LAMA" | "LABA_ICS" | "LABA_LAMA" | "LABA_LAMA_ICS";
interface PatientData {
postBdfEv1FvcRatio: number;
postBdFev1Percent: number;
mMRC: number;
catScoreTotal: number;
exacerbations: { moderateOrSevere: number };
bloodEosinophils: number;
hasChronicBronchitis: boolean;
smokingStatus: "CURRENT_SMOKER" | "EX_SMOKER" | "NEVER_SMOKER";
hasConcomitantAsthma: boolean;
isTreatmentNaive: boolean;
currentTreatment: TreatmentRegimen;
followUpTarget: "DYSPNEA" | "EXACERBATIONS" | "BOTH";
}
interface EvaluationResult {
isCOPDConfirmed: boolean;
goldGrade: string;
symptomBurden: "LOW" | "HIGH";
patientGroup: "A" | "B" | "E" | "N/A";
recommendations: {
primary: string;
details: string[];
addons: string[];
};
warnings: string[];
}
// --- 2. LOGIC ENGINE (GOLD 2026) ---
function evaluateCOPD(patient: PatientData): EvaluationResult {
const result: EvaluationResult = {
isCOPDConfirmed: false,
goldGrade: "N/A",
symptomBurden: "LOW",
patientGroup: "N/A",
recommendations: { primary: "", details: [], addons: [] },
warnings: [],
};
if (patient.postBdfEv1FvcRatio >= 0.7) {
result.warnings.push("Atenție: Raportul FEV1/FVC post-bronhodilatator este ≥ 0.7. Diagnosticul de BPOC nu este confirmat spirometric.");
result.recommendations.primary = "Investighează alte cauze (ex. Astm, Insuficiență cardiacă).";
return result;
}
result.isCOPDConfirmed = true;
if (patient.postBdFev1Percent >= 80) result.goldGrade = "1";
else if (patient.postBdFev1Percent >= 50) result.goldGrade = "2";
else if (patient.postBdFev1Percent >= 30) result.goldGrade = "3";
else result.goldGrade = "4";
const hasHighSymptoms = patient.mMRC >= 2 || patient.catScoreTotal >= 10;
result.symptomBurden = hasHighSymptoms ? "HIGH" : "LOW";
// GOLD 2026 Update: Group E is >= 1 moderate/severe exacerbation
const isGroupE = patient.exacerbations.moderateOrSevere >= 1;
result.patientGroup = isGroupE ? "E" : (hasHighSymptoms ? "B" : "A");
if (patient.hasConcomitantAsthma) {
result.warnings.push("Pacientul asociază trăsături de ASTM. Terapia cu ICS este obligatorie!");
}
// TREATMENT LOGIC
if (patient.isTreatmentNaive) {
if (result.patientGroup === "A") {
result.recommendations.primary = "Un Bronhodilatator (SABD sau LABD)";
result.recommendations.details.push("Se preferă LABA sau LAMA pe termen lung.");
} else if (result.patientGroup === "B") {
result.recommendations.primary = "LABA + LAMA";
result.recommendations.details.push("Combinația s-a dovedit superioară monoterapiei pentru simptome.");
} else if (result.patientGroup === "E") {
if (patient.bloodEosinophils >= 300) {
result.recommendations.primary = "LABA + LAMA + ICS (Triplă Terapie)";
result.recommendations.details.push("Inițiere directă cu Triplă Terapie susținută de eozinofile ≥ 300 cel/µL.");
} else {
result.recommendations.primary = "LABA + LAMA";
result.recommendations.details.push("Terapia preferată pentru inițiere în Grupul E. LABA+ICS nu este recomandat de rutină.");
}
}
} else {
const target = patient.followUpTarget;
code
Code
if (patient.currentTreatment === "LABA_ICS") {
  if (target === "EXACERBATIONS" || target === "BOTH") {
    if (patient.bloodEosinophils >= 100) {
      result.recommendations.primary = "Escaladare la LABA + LAMA + ICS";
    } else {
      result.recommendations.primary = "Schimbare pe LABA + LAMA (De-escaladare ICS)";
      result.warnings.push("Se recomandă oprirea ICS dacă eozinofilele sunt < 100 cel/µL (lipsă de beneficiu + risc pneumonie).");
    }
  } else {
    result.recommendations.primary = "Treci pe LABA+LAMA sau Triplă Terapie";
    result.recommendations.details.push("În funcție de răspunsul clinic la ICS și eozinofile.");
  }
} 
else if (target === "DYSPNEA") {
  if (patient.currentTreatment === "LABA" || patient.currentTreatment === "LAMA") {
    result.recommendations.primary = "Escaladare la LABA + LAMA";
  } else {
    result.recommendations.primary = "Optimizează tratamentul non-farmacologic";
    result.recommendations.details.push("Reabilitare pulmonară, verifică tehnica de inhalare, investighează alte cauze.");
    result.recommendations.addons.push("Adaugă Ensifentrine (inhibitor PDE3/4) dacă este disponibil.");
  }
} 
else if (target === "EXACERBATIONS" || target === "BOTH") {
  if (patient.currentTreatment === "LABA" || patient.currentTreatment === "LAMA") {
    result.recommendations.primary = "Escaladare la LABA + LAMA";
  } 
  else if (patient.currentTreatment === "LABA_LAMA") {
    if (patient.bloodEosinophils >= 100) {
      result.recommendations.primary = "Escaladare la LABA + LAMA + ICS";
      result.recommendations.details.push(`Răspuns favorabil așteptat la ICS având eozinofile = ${patient.bloodEosinophils}.`);
    } else {
      result.recommendations.primary = "Menține LABA + LAMA și adaugă adjuvanți";
      if (patient.postBdFev1Percent < 50 && patient.hasChronicBronchitis) {
        result.recommendations.addons.push("Roflumilast (indicat pentru FEV1 < 50% și bronșită cronică).");
      }
      if (patient.smokingStatus === "EX_SMOKER") {
        result.recommendations.addons.push("Azitromicină (macrolid long-term).");
      }
    }
  } 
  else if (patient.currentTreatment === "LABA_LAMA_ICS") {
    result.recommendations.primary = "Menține Tripla Terapie + Fenotipare";
    if (patient.postBdFev1Percent < 50 && patient.hasChronicBronchitis) {
      result.recommendations.addons.push("Roflumilast");
    }
    if (patient.smokingStatus === "EX_SMOKER") {
      result.recommendations.addons.push("Azitromicină");
    }
    if (patient.bloodEosinophils >= 300) {
      result.recommendations.addons.push("Terapie Biologică: Mepolizumab sau Dupilumab (dacă are bronșită cronică).");
    }
  }
}
}
if (patient.hasConcomitantAsthma && !result.recommendations.primary.includes("ICS")) {
result.recommendations.primary += " + ICS (Obligatoriu pt. Astm)";
}
return result;
}
// --- 3. MAIN REACT COMPONENT ---
export default function CopdApp() {
const [data, setData] = useState<PatientData>({
postBdfEv1FvcRatio: 0.65,
postBdFev1Percent: 55,
mMRC: 2,
catScoreTotal: 12,
exacerbations: { moderateOrSevere: 0 },
bloodEosinophils: 150,
hasChronicBronchitis: false,
smokingStatus: "EX_SMOKER",
hasConcomitantAsthma: false,
isTreatmentNaive: true,
currentTreatment: "NONE",
followUpTarget: "BOTH"
});
const [result, setResult] = useState<EvaluationResult>(evaluateCOPD(data));
useEffect(() => {
setResult(evaluateCOPD(data));
}, [data]);
const handleChange = (field: keyof PatientData, value: any) => {
setData(prev => ({ ...prev, [field]: value }));
};
const handleExacChange = (value: number) => {
setData(prev => ({ ...prev, exacerbations: { moderateOrSevere: value } }));
};
return (
<div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
code
Code
<header className="max-w-6xl mx-auto mb-8 flex items-center space-x-3">
    <Lungs className="w-10 h-10 text-blue-600" />
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GOLD COPD 2026</h1>
      <p className="text-sm text-slate-500 font-medium">Clinical Decision Support Tool</p>
    </div>
  </header>

  <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    {/* LEFT COLUMN: INPUT FORM */}
    <section className="lg:col-span-5 space-y-6">
      
      {/* Card 1: Spirometrie */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="flex items-center text-lg font-semibold mb-4 text-slate-800">
          <Activity className="w-5 h-5 mr-2 text-blue-500"/> 1. Spirometrie (Post-BD)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">FEV1/FVC Ratio</label>
            <input type="number" step="0.01" value={data.postBdfEv1FvcRatio} onChange={(e) => handleChange('postBdfEv1FvcRatio', parseFloat(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">FEV1 (% prezis)</label>
            <input type="number" value={data.postBdFev1Percent} onChange={(e) => handleChange('postBdFev1Percent', parseInt(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          </div>
        </div>
      </div>

      {/* Card 2: Simptome & Exacerbari */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="flex items-center text-lg font-semibold mb-4 text-slate-800">
          <HeartPulse className="w-5 h-5 mr-2 text-rose-500"/> 2. Clinic & Istoric
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Scor mMRC (0-4)</label>
              <select value={data.mMRC} onChange={(e) => handleChange('mMRC', parseInt(e.target.value))} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                {[0,1,2,3,4].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Scor CAT (0-40)</label>
              <input type="number" value={data.catScoreTotal} onChange={(e) => handleChange('catScoreTotal', parseInt(e.target.value))} 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Exacerbări moderate/severe (ultimul an)</label>
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map(val => (
                <button key={val} onClick={() => handleExacChange(val)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${data.exacerbations.moderateOrSevere === val ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {val}{val === 3 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Fenotip & Terapie */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="flex items-center text-lg font-semibold mb-4 text-slate-800">
          <Syringe className="w-5 h-5 mr-2 text-teal-500"/> 3. Fenotip & Tratament
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Eozinofile sânge (celule/µL)</label>
            <input type="number" value={data.bloodEosinophils} onChange={(e) => handleChange('bloodEosinophils', parseInt(e.target.value))} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input type="checkbox" checked={data.hasChronicBronchitis} onChange={(e) => handleChange('hasChronicBronchitis', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/>
              <span className="font-medium text-slate-700">Bronșită Cronică</span>
            </label>
            <label className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input type="checkbox" checked={data.hasConcomitantAsthma} onChange={(e) => handleChange('hasConcomitantAsthma', e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/>
              <span className="font-medium text-slate-700">Astm Concomitent</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status Fumat</label>
            <select value={data.smokingStatus} onChange={(e) => handleChange('smokingStatus', e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-medium">
              <option value="CURRENT_SMOKER">Fumător Activ</option>
              <option value="EX_SMOKER">Fost Fumător</option>
              <option value="NEVER_SMOKER">Nefumător</option>
            </select>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <label className="flex items-center space-x-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={data.isTreatmentNaive} onChange={(e) => handleChange('isTreatmentNaive', e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"/>
              <span className="font-bold text-slate-800">Pacient Naiv Terapeutic (Inițiere)</span>
            </label>

            {!data.isTreatmentNaive && (
              <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                <div>
                  <label className="block text-xs font-semibold text-blue-800 mb-1">Tratament Curent</label>
                  <select value={data.currentTreatment} onChange={(e) => handleChange('currentTreatment', e.target.value)} 
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700">
                    <option value="LABA">LABA monoterapie</option>
                    <option value="LAMA">LAMA monoterapie</option>
                    <option value="LABA_ICS">LABA + ICS</option>
                    <option value="LABA_LAMA">LABA + LAMA</option>
                    <option value="LABA_LAMA_ICS">LABA + LAMA + ICS (Triplă)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-800 mb-1">Ținta la Follow-up</label>
                  <select value={data.followUpTarget} onChange={(e) => handleChange('followUpTarget', e.target.value)} 
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700">
                    <option value="DYSPNEA">Dispnee Persistentă</option>
                    <option value="EXACERBATIONS">Exacerbări Recurente</option>
                    <option value="BOTH">Dispnee + Exacerbări</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>


    {/* RIGHT COLUMN: RESULTS DASHBOARD */}
    <section className="lg:col-span-7 space-y-6">
      
      {!result.isCOPDConfirmed ? (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-2xl shadow-sm flex items-start space-x-4">
          <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0" />
          <div>
            <h3 className="text-rose-800 font-bold text-lg mb-1">Diagnostic Neconfirmat</h3>
            <p className="text-rose-700 text-sm font-medium">{result.warnings[0]}</p>
            <p className="text-rose-600 text-sm mt-2">{result.recommendations.primary}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Classification Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stadiu Spirometric</p>
                <p className="text-3xl font-black text-slate-800">GOLD {result.goldGrade}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-slate-500"/>
              </div>
            </div>

            <div className={`p-5 rounded-2xl shadow-sm border flex items-center justify-between ${
              result.patientGroup === 'E' ? 'bg-rose-50 border-rose-200' : 
              result.patientGroup === 'B' ? 'bg-amber-50 border-amber-200' : 
              'bg-emerald-50 border-emerald-200'
            }`}>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  result.patientGroup === 'E' ? 'text-rose-500' : 
                  result.patientGroup === 'B' ? 'text-amber-600' : 
                  'text-emerald-600'
                }`}>Încadrare GOLD</p>
                <p className={`text-3xl font-black ${
                  result.patientGroup === 'E' ? 'text-rose-700' : 
                  result.patientGroup === 'B' ? 'text-amber-700' : 
                  'text-emerald-700'
                }`}>Grup {result.patientGroup}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.patientGroup === 'E' ? 'bg-rose-200 text-rose-600' : 
                  result.patientGroup === 'B' ? 'bg-amber-200 text-amber-600' : 
                  'bg-emerald-200 text-emerald-600'
                }`}>
                <Stethoscope className="w-6 h-6"/>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-sm font-semibold text-amber-800">{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* Main Treatment Recommendation */}
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-600/20 text-white transform transition-all duration-300">
            <p className="text-blue-200 font-semibold text-sm uppercase tracking-wider mb-2">
              {data.isTreatmentNaive ? "Tratament Inițial Recomandat" : "Decizie Follow-up (GOLD 2026)"}
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">{result.recommendations.primary}</h3>
            
            {result.recommendations.details.length > 0 && (
              <ul className="space-y-2 mt-4 pt-4 border-t border-blue-500/50">
                {result.recommendations.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm text-blue-100 font-medium">
                    <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-300" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add-ons / Biologics */}
          {result.recommendations.addons.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Syringe className="w-4 h-4 text-purple-600" />
                </div>
                Terapii Adiționale & Avansate
              </h3>
              <ul className="space-y-3">
                {result.recommendations.addons.map((addon, idx) => (
                  <li key={idx} className="flex items-center p-3 bg-purple-50 rounded-lg text-sm font-semibold text-purple-800 border border-purple-100">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-3 animate-pulse" />
                    {addon}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

    </section>
  </main>

  <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-medium pb-8 flex flex-col items-center">
    <Info className="w-5 h-5 mb-2 text-slate-300" />
    <p>Acest instrument este strict educațional și destinat profesioniștilor din domeniul sănătății.</p>
    <p>Algoritmul se bazează pe raportul GOLD 2026 și nu înlocuiește judecata clinică a medicului curant.</p>
  </footer>

</div>
);
}
