import React from 'react';
import { VehicleData } from '../types';
import { Car, Calendar, Gauge, Zap, CheckCircle } from 'lucide-react';

interface VehicleHeaderProps {
  data: VehicleData;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({ data }) => {
  const hp = data.technicalData?.horsepower || 0;
  const kw = data.technicalData?.kilowatts || 0;
  const fuel = data.technicalData?.fuelType || 'N/A';
  const engine = data.technicalData?.engineType || 'N/A';

  // Use Vin to generate a consistent "random" image if model search fails, 
  // but prioritize searching for the model name
  const searchQuery = `${data.make} ${data.model}`.replace(/ /g, ',');

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 mb-8">
      <div className="md:flex">
        <div className="md:w-1/3 bg-slate-800 relative h-64 md:h-auto min-h-[250px] flex items-center justify-center overflow-hidden group">
           <img 
            src={`https://source.unsplash.com/800x600/?${searchQuery},car`} 
            alt={`${data.make} ${data.model}`}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80';
            }}
           />
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
           <div className="absolute bottom-4 left-4 text-white">
             <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold inline-block mb-1 shadow-sm uppercase tracking-wider">
               {data.trimLevel}
             </div>
             <div className="text-xs opacity-70 font-mono">{data.vin}</div>
           </div>
        </div>
        <div className="p-8 md:w-2/3 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
            <span>{data.make}</span>
            <span>//</span>
            <span>{data.bodyType}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {data.model}
          </h1>
          
          <div className="flex items-center gap-2 mb-8">
             <span className="text-slate-500 text-sm font-medium">{data.summary}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={10}/> Baujahr</span>
              <span className="font-bold text-slate-800 text-lg">{data.year}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Zap size={10}/> Leistung</span>
              <span className="font-bold text-slate-800 text-lg">{hp} PS <span className="text-sm text-slate-400 font-normal">({kw} kW)</span></span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1"><Gauge size={10}/> Motor</span>
              <span className="font-bold text-slate-800 text-lg truncate" title={engine}>{engine}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};