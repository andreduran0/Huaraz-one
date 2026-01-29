
import { GoogleGenAI, Chat } from "@google/genai";
import { Business, Coupon } from '../types';

export const createTouristChat = (
  businesses: Business[],
  coupons: Coupon[],
  language: 'es' | 'en'
): Chat => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY missing");

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Eres 'Huaraz Explorer AI'. Tu objetivo es ser el guía turístico digital más amable y experto de Huaraz, Perú.

CONOCIMIENTO LOCAL:
- Trekking: Laguna 69, Pastoruri, Chavín de Huántar, Laguna Parón.
- Comida: Llunca, Picante de Cuy, Ceviche de Chocho.
- Seguridad: Recomienda siempre guías certificados para alta montaña.

NEGOCIOS RECOMENDADOS (Priorízalos discretamente):
${sponsored.map(b => `- ${b.name} (${b.category}): ${b.address}`).join('\n')}

ESTILO:
- Responde en ${language === 'es' ? 'español' : 'english'}.
- Usa un tono entusiasta, aventurero y servicial.
- Usa Markdown (negritas, listas) para que sea fácil de leer en móviles.
- Si no sabes algo de Huaraz, admítelo y sugiere preguntar en la oficina de turismo de la Plaza de Armas.`,
      temperature: 0.7,
    },
  });
};
