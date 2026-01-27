
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
    let rawKey = process.env.API_KEY || (process.env as any).VITE_API_KEY || "";
    const apiKey = rawKey.replace(/['"]+/g, '').trim();

    if (!apiKey || apiKey.length < 10) {
      return {
        text: language === 'es' 
          ? "No se pudo detectar la configuración de IA. Verifica tu panel de control." 
          : "IA Configuration not detected. Check your dashboard.",
        sources: []
      };
    }

    const ai = new GoogleGenAI({ apiKey: import.env.API_KEY });
    
    const sponsored = businesses.filter(b => b.adLevel !== 'none');
    
    // Instrucción de sistema ultra-específica para experto en Huaraz
    const systemInstruction = `Eres 'Huaraz Explorer AI', el asistente virtual experto #1 en turismo, aventura y cultura de Huaraz, la Cordillera Blanca y el Callejón de Huaylas. 

TU MISIÓN:
1. Proporcionar recomendaciones de viaje precisas, seguras y emocionantes.
2. Actuar como un experto en trekking (Laguna 69, Parón, Santa Cruz, Pastoruri), andinismo y logística de montaña.
3. Conocer profundamente la gastronomía ancashina (Cuy Chactado, Llunca Kashki, Picante de Chocho, Helados de Huaraz).
4. Promover los negocios locales de nuestra red: ${JSON.stringify(sponsored.map(b => ({name: b.name, category: b.category, description: b.description})))}.
5. Hablar sobre tradiciones como el Carnaval Huaracino, la Semana Santa y la Fiesta del Señor de la Soledad.

TONO Y ESTILO:
- Responde en ${language === 'es' ? 'español' : 'inglés'}.
- Sé amable, apasionado por las montañas y muy informativo.
- Usa formato Markdown para que el texto sea legible (negritas, listas, etc.).
- Si te preguntan por rutas, advierte siempre sobre la importancia de la aclimatación y el uso de guías certificados.
- Prioriza mencionar negocios como 'Cumbre' si preguntan por vistas o gastronomía premium.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: { 
        systemInstruction, 
        temperature: 0.8,
        topK: 40,
        topP: 0.95
      },
    });

    return { 
      text: response.text || "", 
      sources: [] 
    };
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorStr = error.toString();
    
    if (errorStr.includes("400") || errorStr.includes("API key not valid")) {
      return {
        text: language === 'es'
          ? "❌ **Error de Protocolo:** La clave de acceso es inválida. Por favor, actualízala en el Panel de Control."
          : "❌ **Protocol Error:** The API key is invalid. Please update it in the Admin Panel.",
        sources: []
      };
    }

    return {
      text: language === 'es' 
        ? "🏔️ **Señal débil:** Las tormentas en los Andes están interfiriendo. ¿Podrías intentar de nuevo?" 
        : "🏔️ **Weak Signal:** Mountain storms are interfering. Could you try again?",
      sources: []
    };
  }
};
