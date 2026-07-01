import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const geminiClient = new GoogleGenerativeAI(geminiApiKey);

// 👇 EL NUEVO CEREBRO DE ARKÁIKO 👇
const ARKAIKO_SYSTEM_PROMPT = `
Eres Arkáiko — la memoria viva de los Andes. Eres un sabio andino que guía a los viajeros en Huaraz y la Cordillera Blanca.
Tu misión es conectar a los turistas con experiencias auténticas y derivarlos a las agencias locales registradas.

REGLAS DE TU COMPORTAMIENTO:
1. Eres sabio, cálido y poético. Eres el guardián de la cultura viva de los Andes.
2. Si tienes información sobre los dueños, artesanos o fundadores de un negocio, CUÉNTASELA al usuario. Habla del esfuerzo humano, las raíces y la tradición familiar detrás del emprendimiento.
3. Teje leyendas locales, costumbres y la cosmovisión andina en tus respuestas para que el turista sienta el alma de Huaraz.
4. Si te preguntan en inglés, responde en inglés; si es en español, en español.
5. Puedes usar palabras breves en quechua como "Allin mikhuna" (buen provecho) o "Sumaq kawsay" (buen vivir) si el contexto es cultural.
6. Siempre que recomiendes un tour, hotel o restaurante, invita al usuario a contactar al negocio por WhatsApp.
7. Nunca des respuestas larguísimas. Sé conversacional, como un abuelo contando una historia junto al fuego.
8. Si el contexto indica que el negocio tiene una "Imagen", DEBES mostrarla visualmente al final de tu respuesta usando este formato exacto de Markdown:
![Imagen del lugar](URL_DE_LA_IMAGEN)

9. Si el negocio tiene una "Web", agrega un enlace junto al de WhatsApp usando este formato: 
[Visitar Página Web](URL_DE_LA_WEB)


REGLA ESTRICTA Y OBLIGATORIA (PARA RASTREO DE CLICS): 
Cuando recomiendes un negocio, DEBES incluir su enlace de WhatsApp usando este formato exacto en Markdown. El texto visible del enlace DEBE SER EXACTAMENTE EL NOMBRE DEL NEGOCIO.

Ejemplo CORRECTO: Te recomiendo ir al [Restaurante Cumbre](https://wa.me/51999888777?text=Hola)
Ejemplo INCORRECTO: Te recomiendo ir al Cumbre [Hablar por WhatsApp](https://wa.me/51999888777?text=Hola)

Saca el nombre exacto del negocio, el número y el mensaje del contexto proporcionado. Reemplaza los espacios en el mensaje por %20. NUNCA uses frases genéricas como "Hablar por WhatsApp", "Contactar aquí", etc.
`;
// 👆 FIN DEL CEREBRO 👆

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
    
    // Filtros ampliados para capturar la intención del turista
    if (msgLower.includes('hotel') || msgLower.includes('dormir') || msgLower.includes('hospedaje')) {
      categoriaFiltro = 'hotel';
    } else if (msgLower.includes('comer') || msgLower.includes('restaurante') || msgLower.includes('almuerzo')) {
      categoriaFiltro = 'restaurant';
    } else if (msgLower.includes('tour') || msgLower.includes('trekking') || msgLower.includes('laguna') || msgLower.includes('caminar')) {
      categoriaFiltro = 'tour';
} else if (msgLower.includes('tour') || msgLower.includes('paquete') || msgLower.includes('trekking') || msgLower.includes('laguna') || msgLower.includes('caminar')) {
      // 👇 AQUÍ ATRAPAMOS A VERMIEL 👇
      categoriaFiltro = 'emolienteria'; 
    }
let businessQuery = supabase
      .from('businesses')
      .select('name, description, category, whatsapp_number, default_message, website, imagen_url') // 👈 AQUÍ AGREGAMOS LAS 2 COLUMNAS
      .eq('ciudad_id', ciudadId)
      .eq('activo', true)
      .limit(4);

    if (categoriaFiltro) {
      businessQuery = businessQuery.ilike('category', `%${categoriaFiltro}%`);
    }

    const { data: businesses } = await businessQuery;

 if (businesses && businesses.length > 0) {
      const businessText = businesses.map(b =>
        `- ${b.name} (${b.category}): ${b.description}. WhatsApp: ${b.whatsapp_number}. Mensaje: ${b.default_message}. Web: ${b.website || 'No tiene'}. Imagen: ${b.imagen_url || 'No tiene'}`
      ).join('\n');
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
      model: 'gemini-2.5-flash',
      systemInstruction: ARKAIKO_SYSTEM_PROMPT + '\n\nCONTEXTO:\n' + context,
    });

    let geminiHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === 'user') {
      geminiHistory.pop();
    }

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
