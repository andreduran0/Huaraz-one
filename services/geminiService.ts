import { GoogleGenerativeAI } from "@google/generative-ai"; // Importación corregida
import { Business, Coupon, GroundingSource } from '../types';

export interface AiResponse {
  text: string;
  sources: GroundingSource[];
}

export const getAiResponse = async (
  prompt: string,
  businesses: Business[],
  coupons: Coupon[],
  language: 'es' | 'en'
): Promise<AiResponse> => {
  try {
    // Usar process.env para compatibilidad con Vercel/Node
    const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY; 
    
    if (!apiKey) throw new Error("API Key missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Modelo corregido a una versión estable
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
    });

    const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');
    
    const systemInstruction = `Eres 'Huaraz Explorer AI'... (tu prompt actual)`;

    // Estructura de llamada corregida según el SDK de Google
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const response = await result.response;
    const text = response.text();

    return { 
      text: text || (language === 'es' ? "Lo siento..." : "Sorry..."), 
      sources: [] 
    };
    
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return {
      text: language === 'es' 
        ? "🏔️ **Señal débil:** Las tormentas en los Andes están interfiriendo." 
        : "🏔️ **Weak Signal:** Mountain storms are interfering.",
      sources: []
    };
  }
};
