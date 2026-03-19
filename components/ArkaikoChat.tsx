import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- EL ESPÍA DEFINITIVO PARA ARKAIKO ---
const logClick = async (businessName: string) => {
    try {
        // Truco: Silenciamos a TypeScript para leer las llaves reales de Vite sin errores
        // @ts-ignore
        const viteUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null;
        // @ts-ignore
        const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

        const nextUrl = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : null;
        const nextKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : null;

        const url = viteUrl || nextUrl;
        const key = viteKey || nextKey;

        if (url && key && url !== 'https://placeholder.supabase.co') {
            const supabase = createClient(url, key);
            await supabase.from('clicks_log').insert([{ business_name: businessName }]);
        }
    } catch (err) {
        console.error("Error silencioso del espía:", err);
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
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '✨ Soy Arkáiko — la memoria viva de los Andes.\n\n¿Qué experiencia buscas en Huaraz?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}`);
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

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, history: updatedHistory.slice(-8), ciudadId, sessionId }),
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Los Apus están en silencio. 🏔️' }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, messages, ciudadId, sessionId]);

    return (
        <>
            <button
                onClick={() => { setIsOpen(true); setMin(false); }}
                style={{
                    display: isOpen ? 'none' : 'flex',
                    // 👇 AQUÍ SUBIMOS EL BOTÓN (DE 24px A 90px) 👇
                    position: 'fixed', bottom: '90px', right: '24px',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPrimario}, ${DARK})`,
                    border: `2px solid ${colorDorado}`, color: 'white',
                    zIndex: 9999, alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                    cursor: 'pointer'
                }}
            >
                🏔️
            </button>

            {isOpen && (
                <div style={{
                    // 👇 AQUÍ SUBIMOS LA VENTANA DEL CHAT EN MÓVIL (DE 0 A 70px) PARA QUE NO TAPE EL MENÚ 👇
                    position: 'fixed', bottom: isMobile ? '70px' : '90px', right: isMobile ? '0' : '24px',
                    width: isMobile ? '100%' : '380px', height: isMinimized ? 'auto' : (isMobile ? 'calc(100% - 70px)' : '560px'),
                    background: '#FFF', borderRadius: isMobile && !isMinimized ? '20px 20px 0 0' : '20px', zIndex: 9998,
                    display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ background: DARK, padding: '16px', display: 'flex', color: 'white', cursor: 'pointer' }} onClick={() => setMin(!isMinimized)}>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>Arkáiko</div>
                        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
                    </div>

                    {!isMinimized && (
                        <>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#F7F8FA', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {messages.map((msg, i) => (
                                    <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                        <div style={{
                                            padding: '12px', borderRadius: '12px',
                                            background: msg.role === 'user' ? colorPrimario : 'white',
                                            color: msg.role === 'user' ? 'white' : 'black',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}>
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => {
                                                        let nombre = "Link Arkaiko";
                                                        if (typeof props.children === 'string') {
                                                            nombre = props.children;
                                                        } else if (Array.isArray(props.children)) {
                                                            nombre = String(props.children[0]);
                                                        }
                                                        return (
                                                            <a
                                                                {...props}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => logClick(`Arkaiko - ${nombre}`)}
                                                                style={{
                                                                    display: 'inline-block', background: '#25D366', color: 'white',
                                                                    padding: '8px 16px', borderRadius: '8px', marginTop: '8px',
                                                                    textDecoration: 'none', fontWeight: 'bold'
                                                                }}
                                                            >
                                                                {props.children}
                                                            </a>
                                                        );
                                                    }
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {loading && <div style={{ fontSize: '13px', color: '#888' }}>Arkáiko consulta los Apus...</div>}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{ padding: '12px', display: 'flex', gap: '8px', borderTop: '1px solid #EEE' }}>
                                <textarea
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    placeholder="Escribe tu mensaje..."
                                    style={{ flex: 1, borderRadius: '20px', padding: '10px 14px', border: '1px solid #DDD', resize: 'none', outline: 'none' }}
                                    rows={1}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    style={{
                                        background: loading || !input.trim() ? '#CCC' : colorPrimario,
                                        color: 'white', borderRadius: '50%', width: '44px', height: '44px',
                                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}