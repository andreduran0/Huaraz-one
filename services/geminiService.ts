
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
    // Inicialización directa según estándares senior
    const ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY });
    
    const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');
    
    const systemInstruction = `Eres 'Huaraz Explorer AI', el asistente virtual experto #1 en turismo, aventura y cultura de Huaraz, la Cordillera Blanca y el Callejón de Huaylas. 

TU MISIÓN:
1. Proporcionar recomendaciones de viaje precisas, seguras y emocionantes.
2. Actuar como un experto en trekking (Laguna 69, Parón, Santa Cruz, Pastoruri), andinismo y logística de montaña.
3. Conocer profundamente la gastronomía ancashina (Cuy Chactado, Llunca Kashki, Picante de Chocho, Helados de Huaraz).
4. Promover estos negocios locales patrocinados: ${JSON.stringify(sponsored.map(b => ({name: b.name, category: b.category, description: b.description, id: b.id})))}.
5. Hablar sobre tradiciones como el Carnaval Huaracino, la Semana Santa y la Fiesta del Señor de la Soledad.

TONO Y ESTILO:
- Responde en ${language === 'es' ? 'español' : 'inglés'}.
- Sé amable, apasionado por las montañas y muy informativo.
- Usa formato Markdown (negritas, listas, etc.).
- Si preguntan por rutas, advierte siempre sobre aclimatación y guías certificados.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { 
        systemInstruction, 
        temperature: 0.7,
        topP: 0.95
      },
    });

    return { 
      text: response.text || (language === 'es' ? "Lo siento, no pude procesar esa información." : "Sorry, I couldn't process that information."), 
      sources: [] 
    };
    
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return {
      text: language === 'es' 
        ? "🏔️ **Señal débil:** Las tormentas en los Andes están interfiriendo. ¿Podrías intentar de nuevo en unos segundos?" 
        : "🏔️ **Weak Signal:** Mountain storms are interfering. Could you try again in a few seconds?",
      sources: []
    };
  }
};
