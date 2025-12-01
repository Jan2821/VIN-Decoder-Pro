import React from 'react';
import { TechnicalData } from '../types';
import { Activity, Droplet, Wind, Settings, ArrowRightCircle, Gauge } from 'lucide-react';

interface TechSpecsProps {
  data: TechnicalData;
}

export const TechSpecs: React.FC<TechSpecsProps> = ({ data }) => {
  // Safety check if data is undefined/null to prevent crash
  if (!data) return null;

  const specs = [
    { label: 'Hubraum', value: data?.displacement || 'N/A', icon: <Settings size={18} /> },
    { label: 'Drehmoment', value: data?.torque || 'N/A', icon: <Activity size={18} /> },
    { label: 'Getriebe', value: data?.transmission || 'N/A', icon: <Settings size={18} /> },
    { label: 'Antrieb', value: data?.drivetrain || 'N/A', icon: <ArrowRightCircle size={18} /> },
    { label: 'V-Max', value: data?.topSpeed || 'N/A', icon: <Gauge size={18} /> },
    { label: '0-100 km/h', value: data?.acceleration || 'N/A', icon: <Wind size={18} /> },
    { label: 'Verbrauch', value: data?.fuelConsumption || 'N/A', icon: <Droplet size={18} /> },
    { label: 'CO2 Emission', value: data?.co2Emissions || 'N/A', icon: <Wind size={18} /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Settings className="text-blue-500" />
        Technische Daten
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <span className="text-slate-500 flex items-center gap-2 text-sm">
              <span className="text-slate-400">{spec.icon}</span>
              {spec.label}
            </span>
            <span className="font-medium text-slate-800 text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};