
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
    // Obtenemos la clave de API
    const apiKey = process.env.API_KEY;

    // Validación estricta para entornos de producción (Vercel)
    if (!apiKey || apiKey === "" || apiKey === "undefined" || apiKey === "null") {
        console.error("CRITICAL: API_KEY is missing or undefined in current context.");
        return {
            text: language === 'es' 
              ? "⚠️ **Error de Configuración:** La aplicación no puede encontrar tu `API_KEY`. \n\n**Para solucionar esto en Vercel:**\n1. Ve a 'Settings' > 'Environment Variables'.\n2. Agrega `API_KEY` con tu valor.\n3. Ve a 'Deployments', selecciona el último y haz clic en **'Redeploy'** (asegúrate de desmarcar 'Use existing Build Cache')." 
              : "⚠️ **Configuration Error:** The app cannot find your `API_KEY`. \n\n**To fix this on Vercel:**\n1. Go to 'Settings' > 'Environment Variables'.\n2. Add `API_KEY` with your value.\n3. Go to 'Deployments' and click **'Redeploy'** (ensure you uncheck 'Use existing Build Cache').",
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
    
    // Si el error es específicamente de llave inválida después de enviarla
    if (error.toString().includes("API_KEY_INVALID") || error.toString().includes("400")) {
        return {
            text: language === 'es' 
                ? "❌ **Error 400:** La llave de API que configuraste en Vercel es **inválida**. Por favor, revísala en Google AI Studio y vuelve a pegarla en Vercel." 
                : "❌ **Error 400:** The API key configured in Vercel is **invalid**. Please check it in Google AI Studio and update it in Vercel.",
            sources: []
        };
    }

    return {
      text: language === 'es' 
        ? "Lo siento, la señal en las montañas está débil. ¿Podrías intentar de nuevo?" 
        : "Sorry, the mountain signal is weak. Could you try again?",
      sources: []
    };
  }
};
