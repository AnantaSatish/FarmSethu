
import { GoogleGenAI, Type } from "@google/genai";

export const getCropAdvisory = async (crop: string, location: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide sowing and harvesting advice for ${crop} in ${location}. Include soil tips and common pests. Keep it concise.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Advisory currently unavailable. Please try again later.";
  }
};

export const getDemandForecast = async (region: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Predict demand for fruits and vegetables in ${region} for next week based on seasonality. Return a JSON object with crop names as keys and high/medium/low as values.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  crop: { type: Type.STRING },
                  demand: { type: Type.STRING }
                },
                required: ["crop", "demand"]
              }
            }
          }
        }
      },
    });
    return JSON.parse(response.text).forecast;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
