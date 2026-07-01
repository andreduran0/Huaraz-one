
import { GoogleGenAI, Chat } from "@google/genai";
import { Business, Coupon } from '../types';

export const createTouristChat = (
  businesses: Business[],
  coupons: Coupon[],
  language: 'es' | 'en'
): Chat => {
  // Fix: Initialize using strictly required named parameter with process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  const sponsored = businesses.filter(b => b.adLevel !== 'none' && b.status === 'approved');

  return ai.chats.create({
    model: 'gemini-2.5-flash',
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
- Si no sabes algo de Huaraz, admítelo y sugiere preguntar en la oficina de turismo de la Plaza de Armas.
REGLA PARA EL BOTÓN DE VENTA:
Al final de tu itinerario, DEBES recomendar una de las "AGENCIAS DE TOURS DISPONIBLES DESDE BASE DE DATOS" y poner su enlace usando obligatoriamente este formato en Markdown para que la interfaz cree el botón:

[RESERVAR PAQUETE CON NOMBRE DE LA AGENCIA](https://wa.me/NUMERO_DE_WHATSAPP?text=Hola,%20quiero%20reservar)
`,
      temperature: 0.3,
    },
  });
};
