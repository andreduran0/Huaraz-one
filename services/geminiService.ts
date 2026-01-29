import { GoogleGenerativeAI } from "@google/generative-ai";
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
    // Intenta leer de Vite o de proceso estándar de Node/Vercel
    const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("API Key no configurada en Vercel");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');

    const systemInstruction = `Eres 'Huaraz Explorer AI', experto en turismo en Ancash. 
    Negocios recomendados: ${JSON.stringify(sponsored.map(b => b.name))}.
    Idioma: ${language}`;

    const result = await model.generateContent([
      { text: systemInstruction },
      { text: prompt }
    ]);

    const response = await result.response;
    
    return {
      text: response.text(),
      sources: []
    };

  } catch (error: any) {
    console.error("Error en el chat:", error);
    return {
      text: language === 'es' 
        ? "🏔️ **Señal débil:** Problemas de conexión en la cordillera. Intenta de nuevo." 
        : "🏔️ **Weak Signal:** Connection issues in the mountains. Try again.",
      sources: []
    };
  }
};
