
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
    // Intentamos obtener la clave de varias fuentes posibles para máxima compatibilidad
    let key = "";
    
    if (typeof process !== 'undefined' && process.env) {
        key = process.env.API_KEY || (process.env as any).VITE_API_KEY || "";
    }
    
    // Si sigue vacía, intentamos buscarla en el objeto global por si el shim la capturó
    if (!key && (window as any).process?.env?.API_KEY) {
        key = (window as any).process.env.API_KEY;
    }
    if (!key && (window as any).process?.env?.VITE_API_KEY) {
        key = (window as any).process.env.VITE_API_KEY;
    }

    if (!key) {
        return {
            text: language === 'es' 
                ? "Asistente desconectado. Por favor, verifica que la variable de entorno 'API_KEY' o 'VITE_API_KEY' esté configurada en Vercel." 
                : "Assistant disconnected. Please verify that the 'API_KEY' or 'VITE_API_KEY' environment variable is configured in Vercel.",
            sources: []
        };
    }

    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
    
    const sponsoredBusinesses = businesses.filter(b => b.adLevel !== 'none');
    const now = new Date();
    const dateStr = now.toLocaleDateString(language === 'es' ? 'es-PE' : 'en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const systemInstruction = `
      You are the official 'Huaraz Explorer' AI Assistant. 
      Today is ${dateStr}.

      CORE MISSION:
      Help tourists explore Huaraz and the Ancash region. You are an expert local guide integrated into the Huaraz Explorer platform. Respond in ${language === 'es' ? 'Spanish' : 'English'}.

      RULES:
      1. IDENTITY: You are 'Huaraz Explorer Assistant'. Never use other names.
      2. PROMOTE LOCAL: Use the provided business data to recommend places. 
      3. SPONSORED FIRST: Always mention sponsored businesses first with "[⭐ Sponsored]" or "[⭐ Patrocinado]".
      4. REAL-TIME: Use Google Search for weather, current events, or recent news in Huaraz.
      5. SAFETY: Always warn about altitude sickness (soroche) for high-altitude activities.
      6. FORMAT: Use clear Markdown. No walls of text. Use bold for place names.

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
    
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    
    if (isQuotaError) {
        return {
            text: language === 'es' 
                ? "⚠️ **Límite de la IA alcanzado:** Hemos agotado las consultas gratuitas por hoy. Por favor, intenta de nuevo más tarde." 
                : "⚠️ **AI Limit reached:** We have exhausted the free queries for today. Please try again later.",
            sources: []
        };
    }

    return {
      text: language === 'es' ? "Lo siento, la señal en las montañas está débil. ¿Podrías intentar de nuevo?" : "Sorry, the signal in the mountains is weak. Could you try again?",
      sources: []
    };
  }
};
