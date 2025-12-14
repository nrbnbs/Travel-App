import React, { useState } from 'react';
    import { TripDetails, TravelerInfo } from '../types';
    import { MapPin, Calendar, Users, Clock } from 'lucide-react';
    
    interface TripInputProps {
      onSubmit: (details: TripDetails) => void;
    }
    
    export const TripInput: React.FC<TripInputProps> = ({ onSubmit }) => {
      const [origin, setOrigin] = useState('');
      const [destination, setDestination] = useState('');
      const [startDate, setStartDate] = useState('');
      const [duration, setDuration] = useState(5);
      const [adults, setAdults] = useState(1);
      const [children, setChildren] = useState(0);
      const [childAges, setChildAges] = useState<number[]>([]);
    
      const handleChildCountChange = (count: number) => {
        setChildren(count);
        const newAges = [...childAges];
        if (count > childAges.length) {
          for (let i = childAges.length; i < count; i++) newAges.push(5);
        } else {
          newAges.splice(count);
        }
        setChildAges(newAges);
      };
    
      const handleAgeChange = (index: number, val: number) => {
        const newAges = [...childAges];
        newAges[index] = val;
        setChildAges(newAges);
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const travelers: TravelerInfo = { adults, children, childAges };
        onSubmit({ origin, destination, startDate, duration, travelers });
      };
    
      return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="bg-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Where to next?
            </h2>
            <p className="text-teal-100 mt-2">Start your journey with AI-powered planning.</p>
          </div>
    
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin & Destination */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Boarding City</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. New York"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Destination</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Paris, France"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
    
              {/* Date & Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Travel Month/Season
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. July or Summer"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Duration (Days)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="60"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
    
            {/* Travelers */}
            <div className="border-t border-slate-100 pt-6">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" /> Travelers
              </label>
              <div className="flex gap-6 flex-wrap">
                <div className="flex-1 min-w-[120px]">
                  <span className="text-sm text-slate-600 block mb-1">Adults (12+)</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border border-slate-200 rounded-lg"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <span className="text-sm text-slate-600 block mb-1">Children</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-3 border border-slate-200 rounded-lg"
                    value={children}
                    onChange={(e) => handleChildCountChange(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              {children > 0 && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Child Ages</p>
                  <div className="flex flex-wrap gap-3">
                    {childAges.map((age, i) => (
                      <div key={i} className="flex flex-col">
                        <label className="text-xs text-slate-400 mb-1">Child {i + 1}</label>
                        <input
                          type="number"
                          min="0"
                          max="17"
                          className="w-16 p-2 text-center border border-slate-200 rounded shadow-sm"
                          value={age}
                          onChange={(e) => handleAgeChange(i, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
    
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
              >
                Draft My Trip
              </button>
            </div>
          </form>
        </div>
      );
    };
    