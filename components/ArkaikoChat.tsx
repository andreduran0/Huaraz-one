import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURACIÓN GLOBAL DE SUPABASE ---
const getSupabaseClient = () => {
    try {
        // @ts-ignore
        const viteUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null;
        // @ts-ignore
        const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

        const nextUrl = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : null;
        const nextKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : null;

        const url = viteUrl || nextUrl;
        const key = viteKey || nextKey;

        if (url && key && url !== 'https://placeholder.supabase.co') {
            return createClient(url, key);
        }
    } catch (err) {
        console.error("Error inicializando Supabase:", err);
    }
    return null;
};

const supabase = getSupabaseClient();

const logClick = async (businessName: string) => {
    if (supabase) {
        try {
            await supabase.from('clicks_log').insert([{ business_name: businessName }]);
        } catch (err) {
            console.error("Error silencioso del espía:", err);
        }
    }
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

interface ArkaikoChatProps {
    ciudadId?: string;
    colorPrimario?: string;
    colorDorado?: string;
}

const NAVY = '#1A3C5E';
const GOLD = '#C8960C';
const DARK = '#0D2137';

export default function ArkaikoChat({
    ciudadId = 'huaraz',
    colorPrimario = NAVY,
    colorDorado = GOLD,
}: ArkaikoChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setMin] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // 👇 MEMORIAS DEL CHAT 👇
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '✨ Soy Arkáiko — la memoria viva de los Andes.\n\n¿Qué experiencia buscas en Huaraz?', timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
    
    // 👇 NUEVA MEMORIA PARA EL NOMBRE DEL NEGOCIO 👇
    const [currentBusinessName, setCurrentBusinessName] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return;
        const userText = input.trim();
        setInput('');
        setLoading(true);

        const updatedHistory = [...messages, { role: 'user', content: userText, timestamp: new Date() }];
        setMessages(updatedHistory as Message[]);

        // 1. Detección de leads
        const isPhoneNumber = /^[0-9+ \-]{8,15}$/.test(userText);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userText);
        const isContactInfo = isPhoneNumber || isEmail;
        
        const lastBotMessage = messages[messages.length - 1];
        const botJustAskedForContact = lastBotMessage && 
                                      lastBotMessage.role === 'assistant' && 
                                      (lastBotMessage.content.toLowerCase().includes('número') || 
                                       lastBotMessage.content.toLowerCase().includes('correo'));

        // 2. Guardado en Supabase con el nombre del negocio
        if (isContactInfo && botJustAskedForContact && supabase) {
            try {
                const codigoGenerado = 'HEXP-' + Math.floor(1000 + Math.random() * 9000);
                const insertData = {
                    voucher_code: codigoGenerado,
                    customer_whatsapp: isPhoneNumber ? userText : null,
                    customer_email: isEmail ? userText : null,
                    business_name: currentBusinessName // 👈 Guardamos el nombre capturado
                };
                
                await supabase.from('vouchers_issued').insert([insertData]);
                console.log('✅ Turista capturado asociado a:', currentBusinessName);
            } catch (error) {
                console.error('Error al guardar el lead:', error);
            }
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, history: updatedHistory.slice(-8), ciudadId, sessionId }),
            });
            const data = await response.json();
            
            // 👇 CAPTURAMOS EL NOMBRE SI LA IA LO ENVIÓ 👇
            if (data.businessName) {
                setCurrentBusinessName(data.businessName);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Los Apus están en silencio. 🏔️' }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, ciudadId, sessionId, currentBusinessName]);

    // ... (Tu diseño visual `return` sigue igual aquí abajo)
    return (
        // ... (Mantiene tu diseño original)
    );
}
