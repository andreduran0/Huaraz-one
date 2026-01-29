import { GoogleGenerativeAI } from "@google/generative-ai";
// ... tus otros imports

export const getAiResponse = async (...) => {
  try {
    // 1. Intentar obtener la API KEY de ambos posibles lugares
    const apiKey = (import.meta.env?.VITE_API_KEY) || (process.env.API_KEY);
    
    if (!apiKey) {
        throw new Error("No API Key found in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Usar un modelo estable (el 3-flash-preview puede fallar si no tienes acceso)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ... resto de tu lógica de sponsored

    // 3. Estructura correcta de la llamada según la documentación 2024/2025
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: `System: ${systemInstruction}\n\nUser: ${prompt}` }] }
      ]
    });

    const response = await result.response;
    return { text: response.text(), sources: [] };

  } catch (error) {
    console.error("Critical AI Error:", error);
    // ... tu mensaje de error de las montañas
  }
}
