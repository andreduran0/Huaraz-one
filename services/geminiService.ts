
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
    // Obtenemos la clave de API desde process.env según lineamientos
    const apiKey = process.env.API_KEY;

    // Diagnóstico para Vercel/Vite:
    // Si la clave llega como string "undefined", significa que Vite no la inyectó correctamente
    if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey === "null") {
        console.error("DEBUG: API_KEY no disponible en el contexto de ejecución.");
        return {
            text: language === 'es' 
              ? "⚠️ **Error de Conexión:** No se detectó una clave de API válida.\n\n**Para solucionarlo en Vercel:**\n1. Asegúrate de que la variable se llame exactamente `API_KEY`.\n2. Ve a 'Deployments' y haz un **Redeploy** desmarcando la casilla 'Use existing Build Cache'." 
              : "⚠️ **Connection Error:** No valid API Key detected.\n\n**To fix this on Vercel:**\n1. Ensure the variable is named exactly `API_KEY`.\n2. Go to 'Deployments' and perform a **Redeploy**, unchecking 'Use existing Build Cache'.",
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
      Eres el asistente oficial de 'Huaraz Explorer'.
      Fecha actual: ${dateStr}. Responde en ${language === 'es' ? 'Español' : 'Inglés'}.

      CONTEXTO:
      - Negocios destacados: ${JSON.stringify(sponsoredBusinesses.map(b => ({ name: b.name, category: b.category, description: b.description })))}
      - Cupones activos: ${JSON.stringify(coupons.map(c => ({ title: c.title, code: c.code })))}

      REGLAS:
      - Ayuda a los turistas a planificar su viaje a Huaraz y la Cordillera Blanca.
      - Siempre recomienda primero los negocios destacados del contexto.
      - Sé amable, experto en montaña y usa emojis de vez en cuando.
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

    return { 
      text, 
      sources: sources.slice(0, 3) 
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Captura específica del error 400 que mencionaste
    if (error.toString().includes("400") || error.toString().includes("API key not valid")) {
        return {
            text: language === 'es' 
              ? "❌ **Error 400:** La clave de API configurada es inválida. Por favor, verifica tu configuración en Google AI Studio y el nombre de la variable en Vercel." 
              : "❌ **Error 400:** The API Key is invalid. Please check your Google AI Studio setup and Vercel variable name.",
            sources: []
        };
    }

    return {
      text: language === 'es' 
        ? "Lo siento, la señal en las montañas está débil o la configuración de la IA es incorrecta. ¿Podrías intentar de nuevo?" 
        : "Sorry, the mountain signal is weak or the AI setup is incorrect. Could you try again?",
      sources: []
    };
  }
};
