
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseAnalysis } from "../types";

/**
 * World-class senior engineer implementation of Gemini API integration.
 * Uses gemini-3-flash-preview for high-performance reasoning.
 */

export const analyzePlantDisease = async (base64Image: string): Promise<DiseaseAnalysis> => {
  // Always obtain key from environment variable as per requirements
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API_KEY environment variable. Please configure it in your Vercel project settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Model selection based on Task Type: Complex Text/Reasoning Task
  const model = "gemini-3-flash-preview";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image,
              },
            },
            {
              text: `Act as an expert phytopathologist. Analyze the provided image of a plant and return a detailed diagnostic report in JSON format.
              The report must include:
              1. Species identification.
              2. Name of the disease (if any).
              3. Severity assessment (Low, Moderate, High).
              4. A confidence score between 0 and 1.
              5. Known causes of this specific issue.
              6. Detailed treatment plan (organic or chemical).
              7. Long-term preventive measures.
              8. Specific product categories available in Pakistan (fertilizers/pesticides).`,
            },
          ],
        },
      ],
      config: {
        // Enforcing structured output via responseSchema
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            species: { type: Type.STRING },
            diseaseName: { type: Type.STRING },
            severity: { 
              type: Type.STRING, 
              description: "Must be one of: Low, Moderate, High" 
            },
            confidence: { type: Type.NUMBER },
            causes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            treatment: { type: Type.STRING },
            prevention: { type: Type.STRING },
            recommendedProducts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: [
            "species", 
            "diseaseName", 
            "severity", 
            "confidence", 
            "treatment", 
            "prevention", 
            "recommendedProducts"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini AI");
    
    return JSON.parse(text) as DiseaseAnalysis;
  } catch (error) {
    console.error("Gemini Disease Analysis Error:", error);
    throw error;
  }
};

export const getSmartLandscapeAdvice = async (currentItemsCount: number, plantTypes: string[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "AI advice unavailable: Missing API Key.";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I have a garden design with ${currentItemsCount} items containing ${plantTypes.join(", ")}. Give me one brief, expert landscape architecture tip (max 20 words) for aesthetic balance.`,
    });

    return response.text || "Design looking good! Keep maintaining balance.";
  } catch (error) {
    return "Focus on negative space and focal points.";
  }
};
