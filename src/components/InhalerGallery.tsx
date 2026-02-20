import React, { useState } from 'react';
import { 
  Search, Wind, Filter, CheckCircle2, 
  AlertOctagon, BookOpen, Pill
} from 'lucide-react';

// --- DATABASE MOCKUP ---
type DeviceType = 'MDI' | 'DPI' | 'SMI';
type DrugClass = 'SABA' | 'LAMA' | 'LABA' | 'ICS' | 'LABA-LAMA' | 'LABA-ICS' | 'TRIPLE';

interface Inhaler {
  id: string;
  name: string; // Nume comercial
  substances: string;
  type: DeviceType; // Tip dispozitiv
  deviceModel: string; // ex: Turbuhaler, Diskus, Ellipta
  classification: DrugClass;
  technique: string[];
  color: string;
}

const INHALERS_DB: Inhaler[] = [
  {
    id: '1',
    name: 'Ventolin',
    substances: 'Salbutamol',
    type: 'MDI',
    deviceModel: 'Spray (Inhalator presurizat)',
    classification: 'SABA',
    technique: [
      'Agitați flaconul înainte de utilizare.',
      'Expirați complet aerul din plămâni.',
      'Inspir LENT și PROFUND simultan cu apăsarea.',
      'Mențineți apnee 10 secunde.'
    ],
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: '2',
    name: 'Spiriva Respimat',
    substances: 'Tiotropium',
    type: 'SMI',
    deviceModel: 'Respimat (Soft Mist)',
    classification: 'LAMA',
    technique: [
      'Răsuciți baza până se aude "click".',
      'Deschideți capacul.',
      'Expirați, sigilați buzele pe piesă.',
      'Apăsați butonul și inspirați LENT și ADÂNC.',
      'Mențineți apnee 10 secunde.'
    ],
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: '3',
    name: 'Symbicort',
    substances: 'Budesonidă / Formoterol',
    type: 'DPI',
    deviceModel: 'Turbuhaler',
    classification: 'LABA-ICS',
    technique: [
      'Răsuciți baza roșie într-un sens și înapoi ("click").',
      'NU agitați. Expirați în afara dispozitivului.',
      'Inspirați RAPID și PUTERNIC.',
      'Clătiți gura cu apă după utilizare (risc candidoză).'
    ],
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: '4',
    name: 'Seretide / Salmeterol',
    substances: 'Salmeterol / Fluticazonă',
    type: 'DPI',
    deviceModel: 'Diskus',
    classification: 'LABA-ICS',
    technique: [
      'Împingeți maneta până se aude "clack".',
      'Expirați în afara dispozitivului.',
      'Inspirați RAPID și ADÂNC.',
      'Clătiți gura cu apă.'
    ],
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: '5',
    name: 'Trelegy',
    substances: 'Fluticazonă / Umeclidiu / Vilanterol',
    type: 'DPI',
    deviceModel: 'Ellipta',
    classification: 'TRIPLE',
    technique: [
      'Glisați capacul în jos până se aude "click".',
      'Nu blocați gurile de aerisire.',
      'Inspirați LUNG, CONSTANT și ADÂNC.',
      'Clătiți gura cu apă.'
    ],
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: '6',
    name: 'Foster',
    substances: 'Beclometazonă / Formoterol',
    type: 'MDI',
    deviceModel: 'Spray (Soluție)',
    classification: 'LABA-ICS',
    technique: [
      'Necesită inspir LENT (ca la orice spray).',
      'Particule extra-fine (ajung distal).',
      'Clătiți gura după utilizare.'
    ],
    color: 'bg-pink-100 text-pink-800 border-pink-200'
  },
  {
    id: '7',
    name: 'Anoro',
    substances: 'Umeclidiu / Vilanterol',
    type: 'DPI',
    deviceModel: 'Ellipta',
    classification: 'LABA-LAMA',
    technique: [
      'Glisați capacul în jos (click).',
      'Inspirați LUNG și ADÂNC.',
      'Nu necesita clătirea gurii (fără ICS).'
    ],
    color: 'bg-red-100 text-red-800 border-red-200'
  },
   {
    id: '8',
    name: 'Ultibro',
    substances: 'Indacaterol / Glicopironiu',
    type: 'DPI',
    deviceModel: 'Breezhaler (Capsule)',
    classification: 'LABA-LAMA',
    technique: [
      'Introduceți capsula și închideți.',
      'Apăsați butoanele laterale o dată (perforare).',
      'Inspirați RAPID și CONSTANT (trebuie să se audă un "bâzâit").',
      'Verificați dacă capsula e goală.'
    ],
    color: 'bg-teal-100 text-teal-800 border-teal-200'
  }
];

export default function InhalerGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | DeviceType>('ALL');

  // Logică filtrare
  const filteredInhalers = INHALERS_DB.filter(inhaler => {
    const matchesSearch = inhaler.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inhaler.substances.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inhaler.classification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || inhaler.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans p-4 md:p-8 rounded-3xl">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8 text-cyan-600" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ghid Inhalatoare</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium">Bază de date vizuală pentru educarea tehnicii corecte de administrare.</p>
      </header>

      {/* CONTROLS AREA */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Caută după nume, substanță (ex: Salmeterol) sau clasă..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-5 h-5 text-slate-400 hidden md:block" />
          {['ALL', 'MDI', 'DPI', 'SMI'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeFilter === type 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Toate' : type}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInhalers.length > 0 ? (
          filteredInhalers.map((inhaler) => (
            <div key={inhaler.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">{inhaler.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    inhaler.type === 'MDI' ? 'bg-blue-100 text-blue-700' :
                    inhaler.type === 'DPI' ? 'bg-purple-100 text-purple-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {inhaler.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-3">{inhaler.deviceModel}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold border ${inhaler.color}`}>
                    {inhaler.classification}
                  </span>
                  <span className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    {inhaler.substances}
                  </span>
                </div>
              </div>

              {/* Technique Section */}
              <div className="p-5 bg-slate-50/50 h-full">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Tehnică Cheie
                </h4>
                <ul className="space-y-2">
                  {inhaler.technique.map((step, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 mr-2 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>

                {(inhaler.classification.includes('ICS') || inhaler.classification === 'TRIPLE') && (
                  <div className="mt-4 flex items-center p-2 bg-rose-50 border border-rose-100 rounded-lg">
                    <AlertOctagon className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0" />
                    <p className="text-xs text-rose-700 font-bold">Clătire obligatorie (risc candidoză)!</p>
                  </div>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Wind className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nu am găsit inhalatoare care să corespundă criteriilor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
