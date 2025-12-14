import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TripDetails, TripOptions, DetailedItinerary, SelectedOptions, Currency } from "../types";

let customApiKey: string | null = null;

export const setApiKey = (key: string) => {
  customApiKey = key;
};

const getApiKey = (): string | undefined => {
  return customApiKey || process.env.API_KEY;
}

// Schema for Step 2: Options Generation
const optionsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    draftSummary: { type: Type.STRING, description: "A 3-sentence summary of a potential itinerary focusing on pacing." },
    transportOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['flight', 'train', 'car', 'bus'] },
          label: { type: Type.STRING },
          avgCostPerPerson: { type: Type.NUMBER, description: "Estimated cost in the requested currency" },
          duration: { type: Type.STRING },
          suitability: { type: Type.STRING, description: "Who is this best for? e.g., Families, Solo" }
        },
        required: ['type', 'label', 'avgCostPerPerson', 'duration', 'suitability']
      }
    },
    accommodationOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['budget', 'mid-range', 'luxury', 'boutique'] },
          label: { type: Type.STRING },
          avgCostPerNight: { type: Type.NUMBER, description: "Estimated cost in the requested currency" },
          description: { type: Type.STRING }
        },
        required: ['category', 'label', 'avgCostPerNight', 'description']
      }
    }
  },
  required: ['draftSummary', 'transportOptions', 'accommodationOptions']
};

// Schema for Step 3: Final Itinerary
const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          morning: { type: Type.STRING },
          afternoon: { type: Type.STRING },
          evening: { type: Type.STRING }
        }
      }
    },
    hotelSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cost: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    foodSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          cost: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    transportDetails: { type: Type.STRING },
    budget: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.NUMBER },
        accommodation: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        sightseeing: { type: Type.NUMBER },
        misc: { type: Type.NUMBER },
        total: { type: Type.NUMBER },
        perPerson: { type: Type.NUMBER }
      },
      required: ['transport', 'accommodation', 'food', 'sightseeing', 'misc', 'total', 'perPerson']
    },
    budgetDetails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['Transport', 'Accommodation', 'Food', 'Sightseeing', 'Misc'] },
          description: { type: Type.STRING, description: "Specific line item name e.g., 'Flight NYC to LHR' or 'Louvre Entry Ticket'" },
          amount: { type: Type.NUMBER },
          notes: { type: Type.STRING, description: "Optional details like 'Round trip' or 'Per person'" }
        },
        required: ['category', 'description', 'amount']
      }
    },
    note: { type: Type.STRING }
  },
  required: ['days', 'hotelSuggestions', 'foodSuggestions', 'transportDetails', 'budget', 'budgetDetails', 'note']
};


export const ensureApiKey = async (): Promise<boolean> => {
  if (customApiKey) return true;

  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        return await window.aistudio.hasSelectedApiKey();
    }
    return hasKey;
  }
  return !!process.env.API_KEY;
};

export const fetchTravelOptions = async (trip: TripDetails, currency: Currency): Promise<TripOptions> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  
  const prompt = `
    Context: A trip planner app.
    Request: Generate travel options and a draft summary for a trip.
    Details:
    - Origin: ${trip.origin}
    - Destination: ${trip.destination}
    - Duration: ${trip.duration} days
    - Travelers: ${trip.travelers.adults} adults, ${trip.travelers.children} children (Ages: ${trip.travelers.childAges.join(', ')})
    - Season: ${trip.startDate}
    
    Requirements:
    1. Provide 3-4 transport modes applicable for ${trip.origin} to ${trip.destination}.
    2. Provide 3-4 accommodation categories with REALISTIC average costs for ${trip.destination}.
    3. Costs must be estimated in ${currency}.
    4. Provide a short draft summary of how the days might be split.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: optionsSchema,
      temperature: 0.4
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TripOptions;
};


export const generateDetailedItinerary = async (trip: TripDetails, selected: SelectedOptions, currency: Currency): Promise<DetailedItinerary> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const prompt = `
    Context: Generate a detailed, finalized travel itinerary.
    Trip Details:
    - Origin: ${trip.origin}
    - Destination: ${trip.destination}
    - Duration: ${trip.duration} days
    - Travelers: ${trip.travelers.adults} adults, ${trip.travelers.children} children
    - Season: ${trip.startDate}

    User Selections:
    - Transport Mode: ${selected.transport?.label} (Approx ${selected.transport?.avgCostPerPerson}/person)
    - Accommodation Tier: ${selected.accommodation?.label} (Approx ${selected.accommodation?.avgCostPerNight}/night)
    - Currency: ${currency}

    Requirements:
    1. Create a day-by-day plan (Morning, Afternoon, Evening). Balance rest and sightseeing.
    2. Suggest specific hotels/homestays that fit the ${selected.accommodation?.category} category.
    3. Suggest local restaurants.
    4. Calculate a DETAILED budget in ${currency}. 
       - Provide a summary object.
       - IMPORTANT: Provide a 'budgetDetails' array with specific line items.
         - Break down Transport: e.g. "Flight from ${trip.origin} to ${trip.destination} x 2 people", "Train pass", "Car rental for 3 days".
         - Break down Sightseeing: e.g. "Ticket to Museum X", "Entry fee for Y".
         - Break down Accommodation: "5 nights at ${selected.accommodation?.label}".
    5. Output JSON matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: itinerarySchema,
      temperature: 0.5
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as DetailedItinerary;
};