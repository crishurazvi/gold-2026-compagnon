import React, { useState, useEffect } from 'react';
import { 
  Scan, AlertCircle, FileText, CalendarClock, 
  HelpCircle, Microscope, Layers
} from 'lucide-react';

type NoduleType = 'SOLID' | 'GROUND_GLASS' | 'PART_SOLID';
type RiskProfile = 'LOW' | 'HIGH'; // High = fumat, istoric neoplazic, expunere azbest, varsta inaintata

interface NoduleData {
  sizeMm: number;
  type: NoduleType;
  isMultiple: boolean;
  riskProfile: RiskProfile;
}

export default function NoduleCalculator() {
  const [data, setData] = useState<NoduleData>({
    sizeMm: 5,
    type: 'SOLID',
    isMultiple: false,
    riskProfile: 'LOW'
  });

  const [recommendation, setRecommendation] = useState<{title: string, desc: string, color: string}>({
    title: "", desc: "", color: ""
  });

  useEffect(() => {
    setRecommendation(calculateFleischner(data));
  }, [data]);

  const handleChange = (field: keyof NoduleData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans p-4 md:p-8 rounded-3xl">
      <header className="mb-8 flex items-center space-x-3">
        <Scan className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Management Noduli Pulmonari</h2>
          <p className="text-sm text-slate-500 font-medium">Ghidul Fleischner Society 2017 (Pacienți > 35 ani)</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUTS */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            
            {/* 1. Dimensiune */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Dimensiune Nodul (mm)</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" min="1" max="30" step="0.5" 
                  value={data.sizeMm} 
                  onChange={(e) => handleChange('sizeMm', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-xl font-bold text-indigo-700 w-16 text-center">{data.sizeMm} mm</span>
              </div>
            </div>

            {/* 2. Tip Nodul */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tip Nodul</label>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleChange('type', 'SOLID')}
                  className={`py-2 px-1 text-xs md:text-sm rounded-lg font-bold border transition-all ${data.type === 'SOLID' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  Solid
                </button>
                <button 
                  onClick={() => handleChange('type', 'PART_SOLID')}
                  className={`py-2 px-1 text-xs md:text-sm rounded-lg font-bold border transition-all ${data.type === 'PART_SOLID' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  Part-Solid
                </button>
                <button 
                  onClick={() => handleChange('type', 'GROUND_GLASS')}
                  className={`py-2 px-1 text-xs md:text-sm rounded-lg font-bold border transition-all ${data.type === 'GROUND_GLASS' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  Ground Glass
                </button>
              </div>
            </div>

            {/* 3. Multiplicitate */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Număr</label>
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => handleChange('isMultiple', false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!data.isMultiple ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}
                >
                  Unic
                </button>
                <button 
                  onClick={() => handleChange('isMultiple', true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${data.isMultiple ? 'bg-white shadow text-indigo-700' : 'text-slate-500'}`}
                >
                  Multiplu
                </button>
              </div>
            </div>

            {/* 4. Risc */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Profil Risc Pacient</label>
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => handleChange('riskProfile', 'LOW')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${data.riskProfile === 'LOW' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Scăzut
                </button>
                <button 
                  onClick={() => handleChange('riskProfile', 'HIGH')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${data.riskProfile === 'HIGH' ? 'bg-rose-100 text-rose-700 shadow-sm' : 'text-slate-500'}`}
                >
                  Înalt (Fumat/Istoric)
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* OUTPUT */}
        <section className="lg:col-span-7 space-y-6">
           <div className={`p-6 rounded-2xl border-l-8 shadow-md transition-all duration-300 bg-white ${recommendation.color}`}>
             <div className="flex items-start space-x-4">
               <AlertCircle className="w-8 h-8 mt-1 opacity-80" />
               <div>
                 <h3 className="text-xl font-black text-slate-800 mb-2">{recommendation.title}</h3>
                 <p className="text-slate-600 font-medium leading-relaxed">{recommendation.desc}</p>
               </div>
             </div>
           </div>

           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start space-x-2">
             <HelpCircle className="w-5 h-5 flex-shrink-0" />
             <p>Recomandările se aplică nodulilor incidentali. Nu se aplică pentru screening cancer pulmonar (LUNG-RADS), pacienți < 35 ani sau pacienți cu cancer cunoscut (metastaze).</p>
           </div>
        </section>
      </div>
    </div>
  );
}

// --- LOGIC ENGINE (Fleischner 2017) ---
function calculateFleischner(d: NoduleData): {title: string, desc: string, color: string} {
  // 1. SOLID NODULES
  if (d.type === 'SOLID') {
    if (!d.isMultiple) {
      // Single Solid
      if (d.sizeMm < 6) {
        if (d.riskProfile === 'LOW') return { 
          title: "Nu necesită urmărire de rutină", 
          desc: "Riscul de malignitate este extrem de mic (<1%).", 
          color: "border-emerald-500" 
        };
        return { 
          title: "Urmărire opțională", 
          desc: "Se poate lua în considerare un CT la 12 luni dacă există suspiciuni, dar nu este obligatoriu.", 
          color: "border-emerald-500" 
        };
      }
      else if (d.sizeMm >= 6 && d.sizeMm < 8) {
        if (d.riskProfile === 'LOW') return { 
          title: "CT la 6-12 luni", 
          desc: "Dacă este stabil, se poate lua în considerare încă un CT la 18-24 luni.", 
          color: "border-amber-500" 
        };
        return { 
          title: "CT la 6-12 luni", 
          desc: "Apoi obligatoriu CT la 18-24 luni.", 
          color: "border-orange-500" 
        };
      }
      else { // > 8mm
        return { 
          title: "Risc Crescut: CT la 3 luni, PET-CT sau Biopsie", 
          desc: "Se recomandă evaluare atentă. Alegeți între monitorizare scurtă (3 luni), PET-CT (dacă e solid >8mm) sau biopsie în funcție de morfologie.", 
          color: "border-rose-600" 
        };
      }
    } else {
      // Multiple Solid
      if (d.sizeMm < 6) {
        return { title: "Nu necesită urmărire de rutină", desc: "Dacă sunt foarte mulți, se poate face un CT opțional la 12 luni.", color: "border-emerald-500" };
      }
      else if (d.sizeMm >= 6 && d.sizeMm < 8) {
        return { title: "CT la 3-6 luni", desc: "Apoi monitorizare la 18-24 luni. Riscul se bazează pe cel mai mare nodul.", color: "border-orange-500" };
      }
      else { // > 8mm
        return { title: "CT la 3-6 luni", desc: "Apoi monitorizare la 18-24 luni. Managementul se face în funcție de nodulul dominant (cel mai suspect).", color: "border-rose-600" };
      }
    }
  }

  // 2. SUBSOLID NODULES (Ground Glass / Part Solid) - Fleischner tratează multiplu similar cu unic pt subsolide, focus pe cel dominant
  else {
    if (d.type === 'GROUND_GLASS') {
      if (d.sizeMm < 6) return { title: "Nu necesită urmărire de rutină", desc: "Precursori (AAH/AIS) cu evoluție lentă.", color: "border-emerald-500" };
      return { 
        title: "CT la 6-12 luni", 
        desc: "Dacă persistă, se continuă monitorizarea la 2 ani și 5 ani. Evoluția este foarte lentă.", 
        color: "border-amber-500" 
      };
    }
    else { // PART SOLID
      if (d.sizeMm < 6) return { title: "Nu necesită urmărire de rutină", desc: "Evoluție lentă, risc mic.", color: "border-emerald-500" };
      return { 
        title: "CT la 3-6 luni", 
        desc: "Dacă persistă componenta solidă sau crește: rezecție chirurgicală sau monitorizare anuală timp de 5 ani.", 
        color: "border-rose-500" 
      };
    }
  }
}
