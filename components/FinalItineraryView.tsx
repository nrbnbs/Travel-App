import React, { useState } from 'react';
import { DetailedItinerary, TripDetails, BudgetLineItem, Currency } from '../types';
import { MapPin, Utensils, Bed, Wallet, AlertCircle, Edit2, Sun, Moon, Coffee, ChevronRight, X, Car, Ticket, ShoppingBag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface FinalItineraryViewProps {
  itinerary: DetailedItinerary;
  trip: TripDetails;
  currency: Currency;
  onEdit: () => void;
}

export const FinalItineraryView: React.FC<FinalItineraryViewProps> = ({ itinerary, trip, currency, onEdit }) => {
  const [showBudgetDetails, setShowBudgetDetails] = useState(false);

  const formatCost = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };

  const chartData = [
    { name: 'Transport', value: itinerary.budget.transport, color: '#0d9488' }, // teal-600
    { name: 'Stay', value: itinerary.budget.accommodation, color: '#f97316' }, // orange-500
    { name: 'Food', value: itinerary.budget.food, color: '#eab308' }, // yellow-500
    { name: 'Activities', value: itinerary.budget.sightseeing, color: '#6366f1' }, // indigo-500
    { name: 'Misc', value: itinerary.budget.misc, color: '#94a3b8' }, // slate-400
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Transport': return <Car className="w-4 h-4 text-teal-600" />;
      case 'Accommodation': return <Bed className="w-4 h-4 text-orange-500" />;
      case 'Food': return <Utensils className="w-4 h-4 text-yellow-500" />;
      case 'Sightseeing': return <Ticket className="w-4 h-4 text-indigo-500" />;
      default: return <ShoppingBag className="w-4 h-4 text-slate-400" />;
    }
  };

  // Group items by category for the modal
  const groupedDetails = itinerary.budgetDetails?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetLineItem[]>) || {};

  // Sort categories to match chart colors approximately
  const categoryOrder = ['Transport', 'Accommodation', 'Food', 'Sightseeing', 'Misc'];

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in relative">
      
      {/* Header */}
      <div className="relative h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <img 
          src={`https://picsum.photos/1200/400?grayscale&blur=2`} 
          alt="Destination" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{trip.destination}</h1>
              <p className="text-teal-200 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {trip.duration} Days • {trip.travelers.adults + trip.travelers.children} Travelers • {trip.startDate}
              </p>
            </div>
            <button 
              onClick={onEdit}
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Edit2 className="w-4 h-4" /> Modify Plan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Itinerary */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Daily Plan */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Day-by-Day Itinerary</h2>
                {itinerary.days.map((day) => (
                    <div key={day.day} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-lg text-sm">Day {day.day}</span>
                            <h3 className="font-bold text-lg text-slate-800">{day.title}</h3>
                        </div>
                        <div className="space-y-4 pl-4 border-l-2 border-teal-100">
                            <div className="relative">
                                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Coffee className="w-2.5 h-2.5 text-orange-500" />
                                </div>
                                <p className="text-slate-600"><span className="font-semibold text-slate-700">Morning:</span> {day.morning}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <Sun className="w-2.5 h-2.5 text-yellow-600" />
                                </div>
                                <p className="text-slate-600"><span className="font-semibold text-slate-700">Afternoon:</span> {day.afternoon}</p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Moon className="w-2.5 h-2.5 text-indigo-500" />
                                </div>
                                <p className="text-slate-600"><span className="font-semibold text-slate-700">Evening:</span> {day.evening}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

             {/* Suggestions */}
             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Bed className="w-5 h-5 text-teal-600" /> Recommended Stays
                    </h3>
                    <ul className="space-y-3">
                        {itinerary.hotelSuggestions.map((h, i) => (
                            <li key={i} className="text-sm">
                                <div className="font-semibold text-slate-700 flex justify-between">
                                    {h.name} <span className="text-orange-500">{h.cost}</span>
                                </div>
                                <p className="text-slate-500 text-xs mt-1">{h.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-teal-600" /> Dining Picks
                    </h3>
                    <ul className="space-y-3">
                        {itinerary.foodSuggestions.map((f, i) => (
                            <li key={i} className="text-sm">
                                <div className="font-semibold text-slate-700 flex justify-between">
                                    {f.name} <span className="text-orange-500">{f.cost}</span>
                                </div>
                                <p className="text-slate-500 text-xs mt-1">{f.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
        </div>

        {/* Right Column: Budget & Info */}
        <div className="space-y-6">
            
            {/* Budget Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-50 sticky top-4">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-teal-600" /> Budget Breakdown
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip formatter={(value) => formatCost(Number(value))} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-2 mt-4 border-t border-slate-100 pt-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Total Estimate</span>
                        <span className="font-bold text-slate-800">{formatCost(itinerary.budget.total)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Per Person</span>
                        <span className="font-bold text-teal-600">{formatCost(itinerary.budget.perPerson)}</span>
                     </div>
                </div>

                <button 
                  onClick={() => setShowBudgetDetails(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold transition"
                >
                   View Detailed Breakdown <ChevronRight className="w-4 h-4" />
                </button>

                <div className="mt-4 bg-orange-50 p-3 rounded-lg flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700 leading-tight">
                        Costs are approximate averages in {currency}. Prices vary by season and availability.
                    </p>
                </div>
            </div>

            {/* Transport Details Note */}
             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-700 text-sm mb-2">Transportation Notes</h4>
                <p className="text-slate-600 text-sm">{itinerary.transportDetails}</p>
             </div>
        </div>
      </div>

      {/* Budget Details Modal */}
      {showBudgetDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-50 rounded-t-2xl">
              <div>
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                   <Wallet className="w-6 h-6 text-teal-600" /> Detailed Expenses
                 </h2>
                 <p className="text-sm text-slate-500 mt-1">Breakdown of estimated costs per category</p>
              </div>
              <button 
                onClick={() => setShowBudgetDetails(false)}
                className="p-2 hover:bg-white rounded-full transition text-slate-500 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
              {categoryOrder.map(category => {
                const items = groupedDetails[category];
                if (!items || items.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-3">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                      {getCategoryIcon(category)} {category}
                    </h3>
                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-sm">
                          <div>
                            <p className="font-medium text-slate-800">{item.description}</p>
                            {item.notes && <p className="text-xs text-slate-500 italic">{item.notes}</p>}
                          </div>
                          <span className="font-mono font-semibold text-slate-600">
                             {formatCost(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
               <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Total Estimated Cost</span>
                  <span className="text-2xl font-bold text-teal-700">{formatCost(itinerary.budget.total)}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};