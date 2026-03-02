import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiApiKey = process.env.VITE_API_KEY || '';
const geminiClient = new GoogleGenerativeAI(geminiApiKey);

const ARKAIKO_SYSTEM_PROMPT = `
Eres Arkáiko — la memoria viva de los Andes. Eres un sabio andino que guía a los viajeros en Huaraz y la Cordillera Blanca.
Tu misión es conectar a los turistas con experiencias auténticas y derivarlos a las agencias locales registradas.

REGLAS DE TU COMPORTAMIENTO:
1. Eres sabio, cálido y poético, pero directo al grano cuando recomiendes negocios.
2. Si te preguntan en inglés, responde en inglés; si es en español, en español.
3. Puedes usar palabras breves en quechua como "Allin mikhuna" (buen provecho) o "Sumaq kawsay" (buen vivir) si el contexto es cultural.
4. Siempre que recomiendes un tour, hotel o restaurante, invita al usuario a contactar al negocio por WhatsApp.
5. Nunca des respuestas larguísimas. Sé conversacional.
`;

async function getContext(userMessage: string, ciudadId: string): Promise<string> {
  const contextParts: string[] = [];
  try {
    const { data: knowledge } = await supabase
      .from('knowledge_base')
      .select('contenido, categoria')
      .eq('ciudad_id', ciudadId)
      .eq('activo', true)
      .limit(3);

    if (knowledge && knowledge.length > 0) {
      const knowledgeText = knowledge.map(k => `[${k.categoria?.toUpperCase()}] ${k.contenido}`).join('\n');
      contextParts.push('CONOCIMIENTO GENERAL:\n' + knowledgeText);
    }

    const msgLower = userMessage.toLowerCase();
    let categoriaFiltro = null;
    if (msgLower.includes('hotel') || msgLower.includes('dormir') || msgLower.includes('hospedaje')) categoriaFiltro = 'hotel';
    else if (msgLower.includes('comer') || msgLower.includes('restaurante')) categoriaFiltro = 'restaurant';
    else if (msgLower.includes('tour') || msgLower.includes('trekking') || msgLower.includes('laguna')) categoriaFiltro = 'tour';

    let businessQuery = supabase
      .from('businesses')
      .select('name, description, category, whatsapp')
      .eq('ciudad_id', ciudadId)
      .eq('activo', true)
      .limit(4);

    if (categoriaFiltro) {
      businessQuery = businessQuery.ilike('category', `%${categoriaFiltro}%`);
    }

    const { data: businesses } = await businessQuery;

    if (businesses && businesses.length > 0) {
      const businessText = businesses.map(b => `• ${b.name} (${b.category}): ${b.description}. WhatsApp: ${b.whatsapp || 'No disponible'}`).join('\n');
      contextParts.push('NEGOCIOS DISPONIBLES EN LA PLATAFORMA PARA RECOMENDAR:\n' + businessText);
    }
  } catch (error) {
    console.error('Error buscando contexto:', error);
  }
  return contextParts.join('\n\n');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [], ciudadId = 'huaraz', sessionId = 'anonymous' } = req.body;
  if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

  try {
    const context = await getContext(message, ciudadId);

    const model = geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: ARKAIKO_SYSTEM_PROMPT + '\n\nCONTEXTO:\n' + context,
    });

    let geminiHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // ✨ LA NUEVA CURA: Quitamos el último mensaje repetido para no confundir a Google
    if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === 'user') {
      geminiHistory.pop();
    }

    // ✨ CURA ANTERIOR: Si la memoria empieza con Arkáiko, lo cortamos.
    while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.shift();
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    await supabase.from('conversations').insert({
      ciudad_id: ciudadId,
      session_id: sessionId,
      user_message: message,
      agent_reply: reply,
    });

    return res.status(200).json({ reply });

  } catch (error: any) {
    console.error('Error en el chat:', error);
    return res.status(500).json({ reply: 'Los Apus están en silencio momentáneamente. Intenta de nuevo 🏔️' });
  }
}