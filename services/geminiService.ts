
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
    // 1. Obtención y limpieza rigurosa de la clave
    // Priorizamos process.env.API_KEY pero aceptamos VITE_API_KEY si el shim falló
    let rawKey = process.env.API_KEY || (process.env as any).VITE_API_KEY || "";
    
    // Limpiamos comillas, espacios y caracteres invisibles
    const apiKey = rawKey.replace(/['"]+/g, '').trim();

    if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
        return {
            text: language === 'es' 
              ? "⚠️ **Clave de API no detectada.**\n\nPor favor, verifica que has configurado la variable `API_KEY` en tu panel de Vercel y has hecho un **Redeploy desmarcando la caché**." 
              : "⚠️ **API Key not detected.**\n\nPlease verify you set the `API_KEY` variable in Vercel and performed a **Redeploy unchecking the cache**.",
            sources: []
        };
    }

    // Diagnóstico visual interno para el usuario (si la clave parece incompleta)
    if (apiKey.length === 38) {
        console.warn("La clave tiene 38 caracteres. Las claves de Google AI Studio suelen tener 39. Revisa si te faltó copiar el último carácter.");
    }

    // 2. Inicialización obligatoria con objeto de configuración { apiKey }
    const ai = new GoogleGenAI({ apiKey });
    
    const sponsoredBusinesses = businesses.filter(b => b.adLevel !== 'none');
    const now = new Date();
    const dateStr = now.toLocaleDateString(language === 'es' ? 'es-PE' : 'en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const systemInstruction = `Eres el asistente de 'Huaraz Explorer'. Hoy es ${dateStr}. 
    Información local: ${JSON.stringify(sponsoredBusinesses.map(b => b.name))}. 
    Responde en ${language === 'es' ? 'español' : 'inglés'}.`;

    // 3. Generación de contenido usando la estructura de partes requerida
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
    
    if (errorMsg.includes("400") || errorMsg.includes("API key not valid")) {
        return {
            text: language === 'es' 
              ? "❌ **Error 400: Clave Inválida.**\n\nGoogle rechaza la clave proporcionada. Esto ocurre si:\n1. La clave está incompleta (le falta un carácter al final).\n2. Es de Google Cloud en lugar de **Google AI Studio**.\n3. Tiene restricciones de IP/Referer en la consola de Google." 
              : "❌ **Error 400: Invalid Key.**\n\nGoogle rejects the provided key. This happens if:\n1. The key is incomplete (missing the last character).\n2. It's from Google Cloud instead of **Google AI Studio**.\n3. It has IP/Referer restrictions in the Google Console.",
            sources: []
        };
    }

    return {
      text: language === 'es' 
        ? "Hubo un problema al conectar con el servidor de la Cordillera Blanca. Inténtalo de nuevo." 
        : "There was a problem connecting to the White Mountain server. Try again.",
      sources: []
    };
  }
};
