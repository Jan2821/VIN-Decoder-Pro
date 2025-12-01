
import React, { useState } from 'react';
import { VinInput } from './components/VinInput';
import { VehicleHeader } from './components/VehicleHeader';
import { TechSpecs } from './components/TechSpecs';
import { EquipmentList } from './components/EquipmentList';
import { Spinner } from './components/Spinner';
import { Login } from './components/Login';
import { AppStatus, VehicleData } from './types';
import { decodeVin } from './services/geminiService';
import { generateVehiclePdf } from './services/pdfService';
import { Download, AlertCircle, ShieldCheck, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<VehicleData | null>(null);
  const [error, setError] = useState<string>('');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setData(null);
    setStatus(AppStatus.IDLE);
    setError('');
  };

  const handleVinSearch = async (vin: string) => {
    setStatus(AppStatus.LOADING);
    setError('');
    setData(null);

    try {
      const result = await decodeVin(vin);
      setData(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownloadPdf = () => {
    if (data) {
      generateVehiclePdf(data);
    }
  };

  // Show Login Screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">VIN Decoder <span className="text-blue-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            {status === AppStatus.SUCCESS && data && (
                <button 
                onClick={handleDownloadPdf}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                <Download size={16} />
                <span className="hidden sm:inline">PDF Export</span>
                </button>
            )}
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Abmelden"
            >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <VinInput onSearch={handleVinSearch} isLoading={status === AppStatus.LOADING} />
        </div>

        {/* Content Section */}
        {status === AppStatus.LOADING && (
          <div className="py-20 text-center">
            <Spinner />
            <p className="mt-4 text-slate-500 animate-pulse">Analysiere Fahrzeugdatenbanken...</p>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-bold text-red-800">Fehler bei der Abfrage</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && data && (
          <div className="animate-fade-in-up">
            <VehicleHeader data={data} />
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Tech Specs */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <TechSpecs data={data.technicalData} />
                  <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>Hinweis:</strong> Die angezeigten Daten basieren auf einer KI-gestützten Analyse der Fahrgestellnummer. Abweichungen zum tatsächlichen Fahrzeugzustand sind möglich. Bitte vergleichen Sie die Daten mit den Fahrzeugpapieren.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Equipment */}
              <div className="lg:col-span-2">
                <EquipmentList standard={data.standardEquipment} optional={data.optionalEquipment} />
              </div>
            </div>
          </div>
        )}
        
        {status === AppStatus.IDLE && (
           <div className="text-center mt-20 opacity-40">
              <CarSilhouette />
              <p className="mt-4 font-medium text-slate-400">Willkommen zurück. Geben Sie eine VIN ein.</p>
           </div>
        )}
      </main>
    </div>
  );
};

const CarSilhouette = () => (
    <svg className="w-48 h-24 mx-auto text-slate-300" viewBox="0 0 100 50" fill="currentColor">
        <path d="M10,40 L90,40 L95,35 L85,20 L65,15 L35,15 L20,25 L5,35 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="25" cy="40" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="75" cy="40" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
)

export default App;
