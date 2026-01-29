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
    // 1. Detección flexible de API KEY (Vite local o Vercel Production)
    const apiKey = (import.meta.env?.VITE_API_KEY) || (process.env.API_KEY);
    
    if (!apiKey) {
      throw new Error("API_KEY no encontrada. Configúrala en el panel de Vercel.");
    }

    // 2. Inicialización con la librería oficial actualizada
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. Uso de Gemini 1.5 Flash (el modelo estándar actual de Google AI Studio)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');

    // 4. Construcción de las instrucciones del sistema
    const systemInstruction = `Eres 'Huaraz Explorer AI', el asistente virtual experto #1 en turismo, aventura y cultura de Huaraz, la Cordillera Blanca y el Callejón de Huaylas. 

TU MISIÓN:
1. Proporcionar recomendaciones de viaje precisas y seguras.
2. Experto en trekking (Laguna 69, Parón, Santa Cruz, Pastoruri) y logística de montaña.
3. Conocer gastronomía ancashina (Cuy Chactado, Llunca Kashki, Picante de Chocho).
4. Promover negocios patrocinados: ${JSON.stringify(sponsored.map(b => ({name: b.name, category: b.category, id: b.id})))}.
5. Hablar sobre tradiciones (Carnaval Huaracino, Semana Santa).

TONO:
- Responde en ${language === 'es' ? 'español' : 'inglés'}.
- Sé amable y apasionado por las montañas.
- Usa Markdown.
- ADVERTENCIA SIEMPRE: Aclimatación y guías certificados en rutas de altura.`;

    // 5. Ejecución de la petición con la estructura correcta para Gemini 1.5
    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [{ text: `System Instruction: ${systemInstruction}\n\nUser Question: ${prompt}` }] 
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    const response = await result.response;
    const text = response.text();

    return { 
      text: text || (language === 'es' ? "Lo siento, no pude procesar la respuesta." : "Sorry, I couldn't process the response."), 
      sources: [] 
    };
    
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    
    // Mensaje de error amigable con la temática de Huaraz
    return {
      text: language === 'es' 
        ? "🏔️ **Señal débil:** Las tormentas en la Cordillera Blanca están interfiriendo. ¿Podrías intentar de nuevo en unos segundos?" 
        : "🏔️ **Weak Signal:** Mountain storms in the Cordillera Blanca are interfering. Could you try again in a few seconds?",
      sources: []
    };
  }
};
