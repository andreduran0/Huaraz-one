
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
    // 1. Obtención y limpieza profunda de la clave
    let rawKey = process.env.API_KEY || "";
    
    // Eliminamos posibles comillas accidentales, espacios o saltos de línea
    const apiKey = rawKey.replace(/['"]+/g, '').trim();

    if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
        console.error("DEBUG: API_KEY detected as invalid or too short. Check your environment variables.");
        return {
            text: language === 'es' 
              ? "⚠️ **Error de Configuración:** La clave de API no está llegando al navegador.\n\n**Solución rápida en Vercel:**\n1. Ve a 'Settings' > 'Environment Variables'.\n2. Asegúrate de que se llame exactamente `API_KEY`.\n3. Haz un **Redeploy** de tu última versión pero **DESMARCA** la opción 'Use existing Build Cache'." 
              : "⚠️ **Configuration Error:** The API key is not reaching the browser.\n\n**Quick fix on Vercel:**\n1. Go to 'Settings' > 'Environment Variables'.\n2. Ensure it is named exactly `API_KEY`.\n3. Perform a **Redeploy** of your latest version and **UNCHECK** 'Use existing Build Cache'.",
            sources: []
        };
    }

    // 2. Inicialización del cliente con la clave limpia
    const ai = new GoogleGenAI({ apiKey });
    
    const sponsoredBusinesses = businesses.filter(b => b.adLevel !== 'none');
    const now = new Date();
    const dateStr = now.toLocaleDateString(language === 'es' ? 'es-PE' : 'en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const systemInstruction = `Eres el asistente de 'Huaraz Explorer'. Hoy es ${dateStr}. 
    Información local: ${JSON.stringify(sponsoredBusinesses.map(b => b.name))}. 
    Responde en ${language === 'es' ? 'español' : 'inglés'}.`;

    // 3. Llamada al modelo
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [{ text: prompt }] 
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return { 
      text: response.text || "", 
      sources: [] 
    };
    
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    const errorMsg = error.toString();
    
    // Si Google devuelve 400, la clave es estructuralmente correcta pero inválida para ellos
    if (errorMsg.includes("400") || errorMsg.includes("API key not valid")) {
        return {
            text: language === 'es' 
              ? "❌ **Clave Inválida (Error 400):** Google rechaza tu clave.\n\n**Causas probables:**\n- Copiaste la clave con un espacio extra al final.\n- Estás usando una clave de Google Cloud Console en lugar de una de **Google AI Studio**.\n- La clave ha expirado o ha sido revocada." 
              : "❌ **Invalid Key (Error 400):** Google rejects your key.\n\n**Probable causes:**\n- You copied the key with a trailing space.\n- You are using a Google Cloud Console key instead of a **Google AI Studio** key.\n- The key has expired or been revoked.",
            sources: []
        };
    }

    return {
      text: language === 'es' 
        ? "Lo siento, la señal en los nevados es inestable. ¿Podrías intentar de nuevo?" 
        : "Sorry, the snowy signal is unstable. Could you try again?",
      sources: []
    };
  }
};
