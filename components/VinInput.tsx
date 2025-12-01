import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface VinInputProps {
  onSearch: (vin: string) => void;
  isLoading: boolean;
}

export const VinInput: React.FC<VinInputProps> = ({ onSearch, isLoading }) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVin = vin.trim().toUpperCase();
    
    // Basic VIN validation (17 chars, no I, O, Q usually, but let's just check length for flexibility)
    if (cleanVin.length < 11 || cleanVin.length > 17) {
      setError('Eine gültige VIN hat in der Regel 17 Zeichen.');
      return;
    }
    
    setError('');
    onSearch(cleanVin);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Fahrzeugabfrage</h2>
      <p className="text-slate-500 text-center mb-6">Geben Sie die 17-stellige Fahrgestellnummer ein (z.B. W0L0SDL...)</p>
      
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="FIN / VIN eingeben"
            className={`w-full pl-4 pr-4 py-3 border-2 rounded-lg outline-none focus:ring-2 transition-all uppercase font-mono tracking-wider ${error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'}`}
            disabled={isLoading}
          />
          {error && <p className="absolute -bottom-6 left-0 text-xs text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading || vin.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-[140px]"
        >
          {isLoading ? (
            <span className="animate-pulse">Lädt...</span>
          ) : (
            <>
              <Search size={20} />
              <span>Prüfen</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
