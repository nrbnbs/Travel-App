export enum AppStep {
  LOGIN = 'LOGIN',
  INPUT_DETAILS = 'INPUT_DETAILS',
  DRAFT_AND_OPTIONS = 'DRAFT_AND_OPTIONS',
  FINAL_ITINERARY = 'FINAL_ITINERARY'
}

export type Currency = 'INR' | 'USD' | 'EUR';

export interface TravelerInfo {
  adults: number;
  children: number;
  childAges: number[];
}

export interface TripDetails {
  origin: string;
  destination: string;
  startDate: string; // approximate season/month
  duration: number;
  travelers: TravelerInfo;
}

export interface TransportOption {
  type: 'flight' | 'train' | 'car' | 'bus';
  label: string;
  avgCostPerPerson: number;
  duration: string;
  suitability: string;
}

export interface AccommodationOption {
  category: 'budget' | 'mid-range' | 'luxury' | 'boutique';
  label: string;
  avgCostPerNight: number;
  description: string;
}

export interface TripOptions {
  draftSummary: string; // A quick summary of the draft itinerary
  transportOptions: TransportOption[];
  accommodationOptions: AccommodationOption[];
}

export interface SelectedOptions {
  transport: TransportOption | null;
  accommodation: AccommodationOption | null;
}

// Final Detailed Itinerary Types
export interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface Suggestion {
  name: string;
  cost: string;
  description: string;
}

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  sightseeing: number;
  misc: number;
  total: number;
  perPerson: number;
}

export interface BudgetLineItem {
  category: 'Transport' | 'Accommodation' | 'Food' | 'Sightseeing' | 'Misc';
  description: string;
  amount: number;
  notes?: string;
}

export interface DetailedItinerary {
  days: DayPlan[];
  hotelSuggestions: Suggestion[];
  foodSuggestions: Suggestion[];
  transportDetails: string;
  budget: BudgetBreakdown;
  budgetDetails: BudgetLineItem[];
  note: string;
}