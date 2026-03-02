import { useState, useRef, useEffect, useCallback } from 'react';

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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

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

    const quickReplies = [
        '¿Qué tours hay disponibles?',
        '¿Dónde comer en Huaraz?',
        '¿Dónde hospedarme?',
        '¿Qué eventos hay?',
    ];

    return (
        <>
            <button
                onClick={() => { setIsOpen(true); setMin(false); }}
                aria-label="Abrir chat con Arkáiko"
                style={{
                    display: isOpen ? 'none' : 'flex',
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colorPrimario}, ${DARK})`,
                    border: `2px solid ${colorDorado}`,
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(200,150,12,0.35)',
                    zIndex: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    outline: 'none',
                }}
            >
                🏔️
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '380px',
                        height: isMinimized ? 'auto' : '560px',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.22)',
                        zIndex: 9998,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
                        border: `1px solid rgba(200,150,12,0.2)`,
                    }}
                >
                    <div style={{
                        background: `linear-gradient(135deg, ${DARK} 0%, ${colorPrimario} 100%)`,
                        padding: '14px 16px',
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
                                width: '28px', height: '28px',
                            }}
                        >✕</button>
                    </div>

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
                                            maxWidth: '82%', padding: '10px 14px',
                                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: msg.role === 'user' ? `linear-gradient(135deg, ${colorPrimario}, ${DARK})` : '#FFFFFF',
                                            color: msg.role === 'user' ? '#FFFFFF' : '#1A1A1A',
                                            fontSize: '14px', whiteSpace: 'pre-wrap',
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {loading && <div style={{ fontSize: '13px', color: '#888' }}>Arkáiko consulta los Apus...</div>}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{
                                padding: '12px 14px', borderTop: '1px solid #EEEEEE', background: '#FFFFFF',
                                display: 'flex', gap: '8px',
                            }}>
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Pregúntale a Arkáiko..."
                                    style={{
                                        flex: 1, border: `1px solid #DDDDDD`, borderRadius: '20px',
                                        padding: '10px 16px', fontSize: '14px', resize: 'none', outline: 'none',
                                    }}
                                    rows={1}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading || !input.trim()}
                                    style={{
                                        width: '42px', height: '42px', borderRadius: '50%',
                                        background: loading || !input.trim() ? '#CCC' : colorPrimario,
                                        border: 'none', color: '#FFF', cursor: 'pointer',
                                    }}
                                >➤</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}