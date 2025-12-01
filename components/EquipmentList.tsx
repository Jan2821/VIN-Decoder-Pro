import React from 'react';
import { Equipment } from '../types';
import { CheckCircle2, Star } from 'lucide-react';

interface EquipmentListProps {
  standard: Equipment[];
  optional: Equipment[];
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ standard, optional }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Standard Equipment */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={20} />
              Serienausstattung
            </h3>
        </div>
        <div className="p-6 space-y-6 flex-grow">
          {standard.length > 0 ? standard.map((cat, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">{cat.category}</h4>
              <ul className="space-y-2">
                {cat.items.map((item, i) => (
                  <li key={i} className="text-slate-700 text-sm flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )) : (
            <p className="text-slate-400 text-sm italic">Keine Daten verfügbar.</p>
          )}
        </div>
      </div>

      {/* Optional Equipment */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Star className="text-blue-600" size={20} />
            Sonderausstattung & Pakete
            </h3>
        </div>
         
        <div className="p-6 space-y-6 flex-grow">
          {optional.length > 0 ? optional.map((cat, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-xs text-blue-400 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">{cat.category}</h4>
              <ul className="space-y-2">
                {cat.items.map((item, i) => (
                  <li key={i} className="text-slate-700 text-sm flex items-start gap-3">
                    <span className="text-blue-500 font-bold text-xs mt-0.5">+</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                <p className="text-sm">Keine spezifischen Pakete gefunden.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};