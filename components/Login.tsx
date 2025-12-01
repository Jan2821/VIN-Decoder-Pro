
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import { checkCredentials } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // Standardmäßig 'admin' vorausfüllen
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simuliere eine kurze Ladezeit für besseres UX
    setTimeout(() => {
      if (checkCredentials(username, password)) {
        onLogin();
      } else {
        setError('Ungültiger Benutzername oder Passwort.');
        setIsLoading(false);
      }
    }, 600);
  };

  const email = "janradtke2011@gmx.de";
  const subject = encodeURIComponent("Anfrage Zugang VIN Decoder Pro");
  const body = encodeURIComponent("Hallo,\n\nich würde gerne einen Zugang für den VIN Decoder Pro erhalten.\n\nBitte um Freischaltung.\n\nViele Grüße");
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-10 transform -skew-y-12 scale-150 origin-bottom-left"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <ShieldCheck className="text-blue-400" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">VIN Decoder <span className="text-blue-400">Pro</span></h1>
                <p className="text-slate-400 text-sm mt-2">Geschützter Zugang für autorisierte Partner</p>
            </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Benutzername</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
                  placeholder="Ihr Benutzername"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Passwort</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-lg border border-red-100 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                 {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2 group"
            >
              {isLoading ? (
                'Anmeldung wird geprüft...'
              ) : (
                <>
                  Anmelden
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <a
              href={mailtoLink}
              className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors cursor-pointer"
            >
              <Mail size={16} />
              Kein Account? Zugang anfordern
            </a>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
             <p className="text-xs text-slate-400">© 2024 VIN Decoder Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
