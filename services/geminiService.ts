
import { GoogleGenAI } from "@google/genai";
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
    // Referencia directa a process.env.API_KEY según los lineamientos
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error("Error: API_KEY no configurada en el entorno.");
        return {
            text: language === 'es' 
              ? "⚠️ **Configuración incompleta:** No se detectó la clave de API. Por favor, asegúrate de configurar `API_KEY` en el panel de Vercel y hacer un 'Redeploy' sin cache." 
              : "⚠️ **Incomplete setup:** API Key not detected. Please ensure `API_KEY` is set in Vercel and perform a 'Redeploy' without cache.",
            sources: []
        };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const sponsoredBusinesses = businesses.filter(b => b.adLevel !== 'none');
    const now = new Date();
    const dateStr = now.toLocaleDateString(language === 'es' ? 'es-PE' : 'en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const systemInstruction = `
      You are the official 'Huaraz Explorer' AI Assistant. 
      Today is ${dateStr}. Respond in ${language === 'es' ? 'Spanish' : 'English'}.

      CORE MISSION:
      Help tourists explore Huaraz and Ancash. Mention sponsored businesses first.
      
      DATA CONTEXT:
      - Businesses: ${JSON.stringify(sponsoredBusinesses.map(b => ({ name: b.name, cat: b.category, desc: b.description })))}
      - Coupons: ${JSON.stringify(coupons.map(c => ({ title: c.title, code: c.code })))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    const sources: GroundingSource[] = [];

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    const uniqueSources = Array.from(new Set(sources.map(s => s.uri)))
      .map(uri => sources.find(s => s.uri === uri)!)
      .slice(0, 3);

    return { text, sources: uniqueSources };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return {
      text: language === 'es' 
        ? "Lo siento, la señal en las montañas está débil o la clave de API es inválida. ¿Podrías intentar de nuevo?" 
        : "Sorry, the mountain signal is weak or the API Key is invalid. Could you try again?",
      sources: []
    };
  }
};
