import React, { useState } from 'react';
import { Plane, Globe, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (apiKey?: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        {/* Left Side: Visuals */}
        <div className="md:w-1/2 bg-teal-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 {/* Decorative circles */}
                 <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white"></div>
                 <div className="absolute bottom-10 -left-10 w-32 h-32 rounded-full bg-white"></div>
            </div>
            
            <div className="z-10">
                <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-8 h-8 text-teal-200" />
                    <span className="font-bold text-xl tracking-wide">GeminiTravel</span>
                </div>
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Your Personal AI Travel Architect.
                </h1>
                <p className="text-teal-100 text-lg">
                    Plan smarter, travel better. Dynamic itineraries that adapt to your budget and style.
                </p>
            </div>
            
            <div className="z-10 mt-12">
                 <div className="flex items-center gap-4 text-teal-200 text-sm font-medium">
                    <span className="flex items-center gap-1"><Plane className="w-4 h-4" /> Smart Flights</span>
                    <span className="w-1 h-1 bg-teal-400 rounded-full"></span>
                    <span>Budget Optimization</span>
                 </div>
            </div>
        </div>

        {/* Right Side: Auth Action */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Aboard</h2>
                <p className="text-slate-500">Sign in to access your AI planner</p>
            </div>

            <button
                onClick={() => onLogin()}
                className="w-full max-w-sm flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md mb-6"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
            </button>
            
            <div className="relative w-full max-w-sm mb-6 flex items-center justify-center">
                <div className="absolute w-full border-t border-slate-200"></div>
                <span className="bg-white px-3 text-xs text-slate-400 relative z-10">OR USE API KEY</span>
            </div>

            <div className="w-full max-w-sm space-y-3">
                <div className="relative">
                    <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="password"
                        placeholder="Enter Gemini API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm transition"
                    />
                </div>
                <button
                    disabled={!apiKey}
                    onClick={() => onLogin(apiKey)}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
                >
                    Use API Key
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                    Use this if you have a free tier key and want to skip the Google Cloud project selection.
                </p>
            </div>
            
            <p className="mt-8 text-xs text-center text-slate-400 max-w-xs">
                By continuing, you agree to use your Google Account or API Key to access Gemini AI services for personalized planning.
            </p>
        </div>
      </div>
    </div>
  );
};