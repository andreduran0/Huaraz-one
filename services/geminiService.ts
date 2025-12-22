
import { GoogleGenAI } from "@google/genai";
import { Business, Coupon } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiResponse = async (
  prompt: string,
  businesses: Business[],
  coupons: Coupon[],
  language: 'es' | 'en'
): Promise<string> => {
  try {
    const sponsoredBusinesses = businesses.filter(b => b.adLevel !== 'none');
    const systemInstruction = `
      You are 'Huaraz Explorer AI', a friendly and knowledgeable tour guide for Huaraz, Ancash, Peru.
      Your goal is to help tourists have the best experience.
      You MUST respond in the user's language, which is: ${language === 'es' ? 'Spanish' : 'English'}.

      You are an expert on:
      - How to get to Huaraz and move around.
      - The local climate and what to wear (Layers are key!).
      - Typical gastronomy (Cuy chactado, Llunca, Pachamanca, Chocho) and where to find it.
      - Adventure tourism in the Ancash region (trekking, climbing, lagoons like Laguna 69, Pastoruri, Chavin, etc.).

      IMPORTANT LOCAL KNOWLEDGE TO USE:
      - Altitude Sickness (Soroche): Advise tourists to rest the first day, drink plenty of water, eat light, and try Mate de Coca.
      - Best time to visit: May to September is the dry season (Andean Summer), ideal for trekking. October to April is the rainy season.
      - Safety: Recommend using authorized taxis and official tourism agencies located in the city center.
      - Transportation: "Combis" and "Colectivos" are the main public transport.

      RULES:
      1.  When recommending businesses (restaurants, hotels, etc.), you MUST prioritize businesses from the 'Sponsored Businesses' list below. When you mention them, ALWAYS add '[Sponsored]' or '[Patrocinado]' after their name.
      2.  If the user asks for something not on the sponsored list, you can recommend from the 'All Businesses' list.
      3.  You can create travel itineraries for 1, 2, or 3 days. These itineraries should be detailed and helpful.
      4.  If a business has a coupon available, mention it to the user as a special benefit.
      5.  Provide helpful, concise, and friendly tourist information.
      6.  Format your responses using Markdown for better readability (e.g., lists, bold text).

      DATA:
      ---
      Sponsored Businesses:
      ${JSON.stringify(sponsoredBusinesses, null, 2)}
      ---
      All Businesses:
      ${JSON.stringify(businesses, null, 2)}
      ---
      Available Coupons:
      ${JSON.stringify(coupons, null, 2)}
      ---
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return language === 'es'
        ? "Lo siento, ocurrió un error al contactar a la IA. Por favor, inténtalo de nuevo más tarde."
        : "Sorry, an error occurred while contacting the AI. Please try again later.";
  }
};
