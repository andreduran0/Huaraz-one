import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- EL ESPÍA DEFINITIVO PARA ARKAIKO ---
const logClick = async (businessName: string) => {
    try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
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

const NAVY = '#1A3C5E';
const GOLD = '#C8960C';
const DARK = '#0D2137';

export default function ArkaikoPage() {
    const ciudadId = 'huaraz';
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Cambiar el título de la pestaña del navegador
        document.title = "Arkáiko | La historia viva de los Andes";
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
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#FFF', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
            {/* Cabecera */}
            <div style={{ background: DARK, padding: '20px', display: 'flex', color: 'white', alignItems: 'center', justifyContent: 'center', borderBottom: `2px solid ${GOLD}` }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>🏔️ Arkáiko | Huaraz Explorer</div>
            </div>

            {/* Zona de Mensajes */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#F7F8FA', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                        <div style={{
                            padding: '14px', borderRadius: '16px', background: msg.role === 'user' ? NAVY : 'white',
                            color: msg.role === 'user' ? 'white' : 'black', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}>
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => {
                                        let nombre = typeof props.children === 'string' ? props.children : (Array.isArray(props.children) ? String(props.children[0]) : "Link Arkaiko");
                                        return (
                                            <a {...props} target="_blank" rel="noopener noreferrer" onClick={() => logClick(`Arkaiko - ${nombre}`)}
                                                style={{ display: 'inline-block', background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '8px', marginTop: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
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
                {loading && <div style={{ fontSize: '14px', color: '#888', fontStyle: 'italic', textAlign: 'center' }}>Arkáiko consulta a los Apus...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Zona de Input */}
            <div style={{ padding: '15px 20px', display: 'flex', gap: '10px', background: 'white', borderTop: '1px solid #EEE' }}>
                <textarea
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Escribe tu mensaje..."
                    style={{ flex: 1, borderRadius: '24px', padding: '14px 20px', border: '1px solid #DDD', resize: 'none', outline: 'none', fontSize: '16px' }} rows={1}
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}
                    style={{ background: loading || !input.trim() ? '#CCC' : NAVY, color: 'white', borderRadius: '50%', width: '50px', height: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    ➤
                </button>
            </div>
        </div>
    );
}
