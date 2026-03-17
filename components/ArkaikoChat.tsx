import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// 👇 EL ESPÍA DEFINITIVO PARA ARKAIKO 👇
const logClick = async (businessName: string) => {
  try {
    const url = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) 
                || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL);
    const key = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) 
                || (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (!url || !key) {
      console.error("Espía Arkaiko: No se encontraron las llaves de Supabase.");
      return;
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.from('clicks_log').insert([{ business_name: businessName }]);
    
    if (error) {
      console.error("Espía Arkaiko: Error al insertar en BD:", error);
    } else {
      console.log(`✅ Clic guardado con éxito desde Arkaiko: ${businessName}`);
    }
  } catch (err) {
    console.error("Error crítico del espía en Arkaiko:", err);
  }
};
// 👆 FIN DEL ESPÍA 👆

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}
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
    const [isMobile, setIsMobile] = useState(false); // ✨ El nuevo sensor de celulares
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '✨ Soy Arkáiko — la memoria viva de los Andes.\n\n¿Qué experiencia buscas en Huaraz? Puedo guiarte hacia negocios, tours, eventos y lugares que la mayoría de viajeros nunca descubren.',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // ✨ Lógica para detectar el tamaño de la pantalla en tiempo real
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isOpen && !isMinimized && !isMobile) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized, isMobile]);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput('');
        setLoading(true);

        const updatedHistory: Message[] = [
            ...messages,
            { role: 'user', content: userText, timestamp: new Date() },
        ];
        setMessages(updatedHistory);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    history: updatedHistory.slice(-8).map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                    ciudadId,
                    sessionId,
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply || 'No pude procesar tu mensaje.',
                    timestamp: new Date(),
                },
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Los Apus están en silencio momentáneamente. Intenta de nuevo 🏔️',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, ciudadId, sessionId]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Botón Flotante */}
            <button
                onClick={() => { setIsOpen(true); setMin(false); }}
                aria-label="Abrir chat con Arkáiko"
                style={{
                    display: isOpen ? 'none' : 'flex',
                    position: 'fixed',
                    bottom: isMobile ? '90px' : '24px',
                    right: isMobile ? '16px' : '24px',
                    width: isMobile ? '56px' : '64px',
                    height: isMobile ? '56px' : '64px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPrimario}, ${DARK})`,
                    border: `2px solid ${colorDorado}`,
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(200,150,12,0.35)',
                    zIndex: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '22px' : '26px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    outline: 'none',
                }}
            >
                🏔️
            </button>

            {/* Ventana de Chat */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? '0' : '24px',
                        right: isMobile ? '0' : '24px',
                        width: isMobile ? '100%' : '380px',
                        height: isMinimized ? 'auto' : (isMobile ? '100%' : '560px'),
                        background: '#FFFFFF',
                        borderRadius: isMobile && !isMinimized ? '0' : (isMobile && isMinimized ? '16px 16px 0 0' : '20px'),
                        boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
                        zIndex: 9998,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                        border: isMobile ? 'none' : `1px solid rgba(200,150,12,0.2)`,
                    }}
                >
                    {/* Cabecera */}
                    <div style={{
                        background: `linear-gradient(135deg, ${DARK} 0%, ${colorPrimario} 100%)`,
                        padding: isMobile ? '16px 16px' : '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                    }}
                        onClick={() => setMin(!isMinimized)}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '15px' }}>Arkáiko</div>
                            <div style={{ color: colorDorado, fontSize: '11px' }}>Memoria viva de los Andes</div>
                        </div>
                        <button
                            onClick={e => { e.stopPropagation(); setIsOpen(false); }}
                            style={{
                                background: 'rgba(255,255,255,0.15)', border: 'none',
                                color: '#FFFFFF', cursor: 'pointer', borderRadius: '50%',
                                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >✕</button>
                    </div>

                    {/* Área de Mensajes */}
                    {!isMinimized && (
                        <>
                            <div style={{
                                flex: 1, overflowY: 'auto', padding: '16px 14px',
                                display: 'flex', flexDirection: 'column', gap: '10px',
                                background: '#F7F8FA',
                            }}>
                                {messages.map((msg, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}>
                                        <div style={{
                                            maxWidth: isMobile ? '90%' : '82%', padding: '10px 14px',
                                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: msg.role === 'user' ? `linear-gradient(135deg, ${colorPrimario}, ${DARK})` : '#FFFFFF',
                                            color: msg.role === 'user' ? '#FFFFFF' : '#1A1A1A',
                                            fontSize: '14px', whiteSpace: 'pre-wrap',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}>
                                            <ReactMarkdown
                                                components={{
                                                  a: ({ node, ...props }) => {
  // Magia para robar el texto visible del enlace (Ej: "Restaurante Cumbre")
  let nombreNegocio = "Link de WhatsApp Arkaiko";
  if (props.children && Array.isArray(props.children) && props.children.length > 0) {
    nombreNegocio = String(props.children[0]);
  } else if (typeof props.children === 'string') {
    nombreNegocio = props.children;
  }

  return (
    <a
      {...props}
      target="_blank"
      onClick={() => {
        // Disparamos el espía con el nombre que la IA escribió
        logClick(`Arkaiko - ${nombreNegocio}`);
      }}
      style={{
        display: 'inline-block',
        backgroundColor: '#25D366',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginTop: '10px'
      }}
    >
      {props.children}
    </a>
  );
}