import React, { useState } from 'react';
import { AppStep, TripDetails, TripOptions, SelectedOptions, DetailedItinerary, Currency } from './types';
import { ensureApiKey, fetchTravelOptions, generateDetailedItinerary, setApiKey } from './services/geminiService';
import { Login } from './components/Login';
import { TripInput } from './components/TripInput';
import { LoadingScreen } from './components/LoadingScreen';
import { PreferenceSelector } from './components/PreferenceSelector';
import { FinalItineraryView } from './components/FinalItineraryView';
import { Globe, LogOut, Settings2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LOGIN);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currency, setCurrency] = useState<Currency>('INR');
  
  // App Data State
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [options, setOptions] = useState<TripOptions | null>(null);
  const [selections, setSelections] = useState<SelectedOptions | null>(null);
  const [finalItinerary, setFinalItinerary] = useState<DetailedItinerary | null>(null);

  const handleLogin = async (manualKey?: string) => {
    try {
        if (manualKey) {
            setApiKey(manualKey);
            setCurrentStep(AppStep.INPUT_DETAILS);
            return;
        }

        const hasKey = await ensureApiKey();
        if (hasKey) {
            setCurrentStep(AppStep.INPUT_DETAILS);
        } else {
            alert("An API Key is required to use this demo. Please sign in or enter a key.");
        }
    } catch (e) {
        console.error(e);
        alert("Failed to initialize API access.");
    }
  };

  const handleTripSubmit = async (details: TripDetails) => {
    setTripDetails(details);
    setLoading(true);
    setLoadingMessage(`Analyzing destination and calculating costs in ${currency}...`);
    
    try {
      const result = await fetchTravelOptions(details, currency);
      setOptions(result);
      setCurrentStep(AppStep.DRAFT_AND_OPTIONS);
    } catch (error) {
      console.error(error);
      alert("Failed to generate options. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionsConfirm = async (selected: SelectedOptions) => {
    if (!tripDetails) return;
    setSelections(selected);
    setLoading(true);
    setLoadingMessage("Finalizing detailed itinerary and budget...");

    try {
      const result = await generateDetailedItinerary(tripDetails, selected, currency);
      setFinalItinerary(result);
      setCurrentStep(AppStep.FINAL_ITINERARY);
    } catch (error) {
      console.error(error);
      alert("Failed to generate final itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const handleModify = () => {
    setCurrentStep(AppStep.DRAFT_AND_OPTIONS);
  };

  const handleLogout = () => {
    setCurrentStep(AppStep.LOGIN);
    setTripDetails(null);
    setOptions(null);
    setSelections(null);
    setFinalItinerary(null);
    setApiKey(''); // Clear manual key on logout
  };

  if (currentStep === AppStep.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-xl cursor-pointer" onClick={() => setCurrentStep(AppStep.INPUT_DETAILS)}>
             <Globe className="w-6 h-6" /> GeminiTravel
          </div>
          
          <div className="flex items-center gap-6">
             {tripDetails && (
                <div className="hidden md:block text-xs text-slate-500">
                    Planning: <span className="font-semibold text-slate-700">{tripDetails.destination}</span>
                </div>
             )}

             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
                   <Settings2 className="w-4 h-4 text-slate-500" />
                   <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                   </select>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="text-slate-400 hover:text-red-500 transition p-1 hover:bg-slate-100 rounded-full"
                  title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        {loading && <LoadingScreen message={loadingMessage} />}

        {currentStep === AppStep.INPUT_DETAILS && (
            <div className="max-w-4xl mx-auto pt-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Plan Your Perfect Trip</h1>
                    <p className="text-slate-500">Tell us where you want to go, and we'll handle the logistics.</p>
                </div>
                <TripInput onSubmit={handleTripSubmit} />
            </div>
        )}

        {currentStep === AppStep.DRAFT_AND_OPTIONS && options && (
             <div className="max-w-6xl mx-auto pt-4">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Customize Your Journey</h2>
                    <p className="text-slate-500">Select your preferred travel style and comfort level.</p>
                 </div>
                <PreferenceSelector 
                    options={options}
                    currency={currency} 
                    onConfirm={handleOptionsConfirm}
                    onBack={() => setCurrentStep(AppStep.INPUT_DETAILS)}
                />
             </div>
        )}

        {currentStep === AppStep.FINAL_ITINERARY && finalItinerary && tripDetails && (
             <FinalItineraryView 
                itinerary={finalItinerary} 
                trip={tripDetails}
                currency={currency}
                onEdit={handleModify}
             />
        )}
      </main>
    </div>
  );
};

export default App;