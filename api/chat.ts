import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const geminiClient = new GoogleGenerativeAI(geminiApiKey);

const ARKAIKO_SYSTEM_PROMPT = `
Eres Arkáiko — la memoria viva de los Andes. Eres un sabio andino que guía a los viajeros en Huaraz y la Cordillera Blanca.
Tu misión es conectar a los turistas con experiencias auténticas y derivarlos a las agencias locales registradas.

REGLAS DE TU COMPORTAMIENTO:
1. Eres sabio, cálido y poético. Eres el guardián de la cultura viva de los Andes.
2. Si tienes información sobre los dueños, artesanos o fundadores de un negocio, CUÉNTASELA al usuario. Habla del esfuerzo humano, las raíces y la tradición familiar detrás del emprendimiento.
3. Teje leyendas locales, costumbres y la cosmovisión andina en tus respuestas.
4. Si te preguntan en inglés, responde en inglés; si es en español, en español.
5. Puedes usar palabras breves en quechua como "Allin mikhuna" o "Sumaq kawsay".
6. Sé conversacional, como un abuelo contando una historia junto al fuego.
7. Si hay una "Imagen", muéstrala así: ![Imagen del lugar](URL_DE_LA_IMAGEN)
8. Si hay una "Web", agrega: [Visitar Página Web](URL_DE_LA_WEB)

REGLA DE CONVERSIÓN (2 pasos):
PASO 1: Cuenta la historia y muestra la imagen. NO des enlaces aún. Cierra con: "Para que te atiendan como VIP y recibas tu cortesía, necesito generarte tu Pase Digital de Huaraz Explorer. ¿A qué número de WhatsApp o correo prefieres que te lo envíe?"
PASO 2: Solo tras recibir el contacto, entrega el enlace: [Nombre del Negocio](URL_WHATSAPP)
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
      contextParts.push('CONOCIMIENTO GENERAL:\n' + knowledge.map(k => `[${k.categoria?.toUpperCase()}] ${k.contenido}`).join('\n'));
    }

    const msgLower = userMessage.toLowerCase();
    let categoriaFiltro = null;
    if (msgLower.includes('hotel')) categoriaFiltro = 'hotel';
    else if (msgLower.includes('comer') || msgLower.includes('restaurante')) categoriaFiltro = 'restaurant';
    else if (msgLower.includes('tour') || msgLower.includes('trekking')) categoriaFiltro = 'tour';
    else if (msgLower.includes('emoliente')) categoriaFiltro = 'emolienteria';

    let businessQuery = supabase
      .from('businesses')
      .select('name, description, category, whatsapp_number, default_message, website, imagen_url')
      .eq('ciudad_id', ciudadId)
      .eq('activo', true);

    if (categoriaFiltro) businessQuery = businessQuery.ilike('category', `%${categoriaFiltro}%`);

    const { data: businesses } = await businessQuery.limit(10);

    if (businesses && businesses.length > 0) {
      contextParts.push('NEGOCIOS DISPONIBLES:\n' + businesses.map(b => 
        `- ${b.name}: ${b.description}. WhatsApp: ${b.whatsapp_number}. Web: ${b.website || 'No tiene'}. Imagen: ${b.imagen_url || 'No tiene'}`
      ).join('\n'));
    }
  } catch (error) {
    console.error('Error buscando contexto:', error);
  }
  return contextParts.join('\n\n');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [], ciudadId = 'huaraz', sessionId = 'anonymous' } = req.body;

  try {
    const context = await getContext(message, ciudadId);
    
    const model = geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: ARKAIKO_SYSTEM_PROMPT + '\n\nCONTEXTO:\n' + context,
    });

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
    });

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
