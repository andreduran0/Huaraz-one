
import { GoogleGenAI } from "@google/genai";
import { Business, Coupon, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: language === 'es' ? "Lo siento, la señal en las montañas está débil. ¿Podrías intentar de nuevo?" : "Sorry, the signal in the mountains is weak. Could you try again?",
      sources: []
    };
  }
};
