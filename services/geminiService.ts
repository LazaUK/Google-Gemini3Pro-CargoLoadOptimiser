import { GoogleGenAI } from "@google/genai";
import { PackingResult, ParcelCounts } from "../types";

// NOTE: In a real production app, this key should be handled via a secure backend proxy
// or user input. For this prototype, we assume it's in the environment.
const apiKey = process.env.API_KEY || ''; 
// Fallback logic for demo if no env var (simulated response if needed, 
// but code must adhere to instructions. The instructions say assume valid key in process.env.API_KEY)

const ai = new GoogleGenAI({ apiKey });

export const getOptimizationInsights = async (
  result: PackingResult,
  originalCounts: ParcelCounts
): Promise<string> => {
  if (!apiKey) {
      return "API Key is missing. Please configure process.env.API_KEY to use AI features.";
  }

  const model = "gemini-2.5-flash";

  const prompt = `
    I have performed a 3D Bin Packing simulation for a cargo van (3.0m x 1.8m x 1.9m, Volume: 10.26m³).
    
    Here are the results:
    - Total Parcels Requested: ${result.totalParcels}
    - Parcels Packed Successfully: ${result.packedParcels}
    - Volume Utilisation: ${result.utilization.toFixed(2)}%
    
    Inventory Breakdown (Requested -> Failed):
    - Small: ${originalCounts.Small} -> ${result.unplacedCount.Small} failed
    - Medium: ${originalCounts.Medium} -> ${result.unplacedCount.Medium} failed
    - Large: ${originalCounts.Large} -> ${result.unplacedCount.Large} failed

    Please provide a concise, professional logistics analysis (max 150 words) using British English. 
    1. Evaluate the load efficiency.
    2. Suggest 2 specific tips to improve packing or volume utilisation (e.g., ordering strategy, reducing specific box sizes).
    3. If utilisation is low, explain why (e.g., shape fragmentation).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch AI insights");
  }
};