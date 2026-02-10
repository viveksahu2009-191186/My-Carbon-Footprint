import { GoogleGenAI, Type } from "@google/genai";
import { ActivityCategory, ActivityLog, Recommendation } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeActivity(description: string): Promise<Partial<ActivityLog>> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following human activity and estimate its carbon footprint in kg CO2e.
    Be precise about these categories:
    - Transportation (flights, cars, transit)
    - Food (meat, dairy, plant-based, waste)
    - Electricity (appliances, heating, lights)
    - Cooking Fuel (LPG, gas, wood)
    - Water (hot showers, laundry, irrigation)
    - Digital (streaming, cloud storage, device usage)
    - Waste (recycling, landfill)
    
    Activity: "${description}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emissionKg: { type: Type.NUMBER, description: "Estimated CO2 emission in kilograms" },
          category: { 
            type: Type.STRING, 
            enum: Object.values(ActivityCategory),
            description: "Category of the activity" 
          },
          aiExplanation: { type: Type.STRING, description: "Brief explanation of the calculation and impact factors" }
        },
        required: ["emissionKg", "category", "aiExplanation"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      emissionKg: 0,
      category: ActivityCategory.OTHER,
      aiExplanation: "Could not analyze activity."
    };
  }
}

export async function getRecommendations(logs: ActivityLog[]): Promise<Recommendation[]> {
  const logSummary = logs.slice(-20).map(l => `${l.category}: ${l.description} (${l.emissionKg}kg)`).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on these recent activities: [${logSummary}], provide 3 personalized, realistic recommendations to reduce the user's carbon footprint.
    Think about:
    - Optimizing travel routes or modes.
    - Shifting to energy-efficient appliances or habits.
    - Shifting peak-hour electricity usage.
    - Low-carbon diet adjustments.
    - Water-saving techniques.
    
    For each recommendation, estimate the monthly potential saving in kg CO2e, a cost impact statement (e.g. "Saves Money", "No Cost", "High Upfront Investment"), and a feasibility score from 1 (hard) to 10 (very easy).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            potentialSavingKg: { type: Type.NUMBER },
            priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
            category: { type: Type.STRING, enum: Object.values(ActivityCategory) },
            costImpact: { type: Type.STRING, description: "Brief cost assessment" },
            feasibilityScore: { type: Type.INTEGER, description: "Ease of implementation from 1 to 10" }
          },
          required: ["title", "description", "potentialSavingKg", "priority", "category", "costImpact", "feasibilityScore"]
        }
      }
    }
  });

  try {
    const text = response.text || "[]";
    const rawData = JSON.parse(text);
    return rawData.map((item: any) => ({
      ...item,
      id: crypto.randomUUID()
    }));
  } catch (error) {
    console.error("Failed to parse recommendations", error);
    return [];
  }
}

export async function getDailyNudge(logs: ActivityLog[]): Promise<string> {
  if (logs.length === 0) return "Ready to start your climate journey? Log your first activity today!";
  
  const summary = logs.slice(0, 5).map(l => l.description).join(", ");
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short, encouraging, and friendly 1-sentence behavioral nudge or reminder for someone tracking their carbon footprint.
    Recent activities: [${summary}]
    Focus on positive reinforcement and small habit shifts.`,
  });

  return response.text?.trim() || "Every small action counts toward a greener planet!";
}