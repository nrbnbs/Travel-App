import React, { useState, useEffect } from 'react';
import { TripOptions, TransportOption, AccommodationOption, SelectedOptions, Currency } from '../types';
import { Plane, Train, Car, Bus, Home, Building2, Bed, Star, CheckCircle2 } from 'lucide-react';

interface PreferenceSelectorProps {
  options: TripOptions;
  currency: Currency;
  onConfirm: (selections: SelectedOptions) => void;
  onBack: () => void;
}

export const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ options, currency, onConfirm, onBack }) => {
  const [selectedTransport, setSelectedTransport] = useState<TransportOption | null>(null);
  const [selectedStay, setSelectedStay] = useState<AccommodationOption | null>(null);

  const formatCost = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };
  
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-6 h-6" />;
      case 'train': return <Train className="w-6 h-6" />;
      case 'car': return <Car className="w-6 h-6" />;
      case 'bus': return <Bus className="w-6 h-6" />;
      default: return <Plane className="w-6 h-6" />;
    }
  };

  const getStayIcon = (category: string) => {
    switch (category) {
      case 'luxury': return <Star className="w-6 h-6 text-yellow-500" />;
      case 'mid-range': return <Building2 className="w-6 h-6" />;
      case 'boutique': return <Bed className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const isReady = selectedTransport && selectedStay;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Draft Summary Card */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-orange-400" />
          Draft Itinerary Strategy
        </h3>
        <p className="text-teal-50 leading-relaxed">{options.draftSummary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Transport Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plane className="w-5 h-5 text-teal-600" /> Select Transport
          </h3>
          <div className="space-y-3">
            {options.transportOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTransport(opt)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedTransport === opt 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-white bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${selectedTransport === opt ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                      {getTransportIcon(opt.type)}
                    </div>
                    <span className="font-semibold text-slate-800 capitalize">{opt.label}</span>
                  </div>
                  <span className="text-teal-700 font-bold">{formatCost(opt.avgCostPerPerson)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 pl-11">
                  <span>{opt.duration}</span>
                  <span>{opt.suitability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" /> Select Accommodation
          </h3>
          <div className="space-y-3">
            {options.accommodationOptions.map((opt, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedStay(opt)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedStay === opt 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-white bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${selectedStay === opt ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                      {getStayIcon(opt.category)}
                    </div>
                    <span className="font-semibold text-slate-800 capitalize">{opt.label}</span>
                  </div>
                  <span className="text-teal-700 font-bold">{formatCost(opt.avgCostPerNight)}<span className="text-slate-400 text-xs font-normal">/night</span></span>
                </div>
                <p className="text-xs text-slate-500 pl-11 line-clamp-2">{opt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-between items-center z-40 max-w-5xl mx-auto">
        <button 
            onClick={onBack}
            className="px-6 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition"
        >
            Back
        </button>
        <div className="flex items-center gap-4">
            <button
                disabled={!isReady}
                onClick={() => isReady && onConfirm({ transport: selectedTransport, accommodation: selectedStay })}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform ${
                    isReady 
                    ? 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
            >
                Generate Final Plan
            </button>
        </div>
      </div>

    </div>
  );
};