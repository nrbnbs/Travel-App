import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-100 flex flex-col items-center max-w-sm w-full">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 text-center mb-2">Planning Your Trip</h3>
        <p className="text-slate-500 text-center animate-pulse">{message}</p>
      </div>
    </div>
  );
};
