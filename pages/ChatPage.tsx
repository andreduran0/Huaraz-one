
import React, { useState, useRef, useEffect } from 'react';
import { createTouristChat } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import { Chat, GenerateContentResponse } from '@google/genai';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-4 my-8 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}>
            <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform hover:scale-105 overflow-hidden ${
                isUser 
                ? 'bg-slate-100 border-slate-200 shadow-sm' 
                : 'bg-white border-[#FF5F1F] shadow-[0_0_15px_rgba(255,95,31,0.3)]'
            }`}>
                {isUser ? (
                    <i className="fas fa-user-astronaut text-slate-400"></i>
                ) : (
                    <img src="https://i.imgur.com/Cax54U1.png" className="w-8 h-8 object-contain" alt="Huaraz Explorer" />
                )}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[75%]`}>
                <div className={`px-6 py-4 rounded-[1.8rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all border ${
                    isUser 
                    ? 'bg-slate-50 text-slate-800 rounded-tr-none border-slate-100' 
                    : 'bg-white text-slate-900 rounded-tl-none border-[#FF5F1F]/20 shadow-[0_10px_25px_rgba(255,95,31,0.08)]'
                }`}>
                    {message.isLoading ? (
                        <div className="flex items-center gap-2 py-2">
                            <div className="w-2 h-2 bg-[#FF5F1F] rounded-full animate-bounce shadow-[0_0_8px_#FF5F1F]"></div>
                            <div className="w-2 h-2 bg-[#FF5F1F] rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_8px_#FF5F1F]"></div>
                            <div className="w-2 h-2 bg-[#FF5F1F] rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_8px_#FF5F1F]"></div>
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-[#FF5F1F] prose-strong:font-black prose-a:text-[#FF5F1F] font-medium text-slate-700`}>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    )}
                </div>
                <div className={`flex items-center gap-3 px-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isUser ? 'text-slate-300' : 'text-[#FF5F1F]'}`}>
                        {isUser ? 'Viajero' : 'Huaraz Explorer IA'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const ChatPage: React.FC = () => {
  const { businesses, coupons, language } = useAppContext();
  const t = useTranslations();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Referencia para mantener la sesión de chat activa
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar chat si no existe
  useEffect(() => {
    if (!chatSessionRef.current) {
      try {
        chatSessionRef.current = createTouristChat(businesses, coupons, language);
      } catch (e) {
        console.error("Error initializing chat session", e);
      }
    }
  }, [businesses, coupons, language]);
  
  const handleSend = async (textToSend?: string) => {
    const finalInput = textToSend || input;
    if (finalInput.trim() === '' || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text: finalInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const loadingId = 'loading-' + Date.now();
    const loadingMsg: ChatMessage = { id: loadingId, text: '', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createTouristChat(businesses, coupons, language);
      }

      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: finalInput });
      
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: response.text || "No pude generar una respuesta.", 
        sender: 'ai'
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => prev.filter(m => m.id !== loadingId));
      setMessages(prev => [...prev, { 
        id: 'error', 
        text: '🏔️ **Aviso:** No logramos conectar con el satélite en las montañas. Verifica tu conexión e inténtalo de nuevo.', 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { text: '¿Qué tours de un día recomiendas?', icon: 'fa-route', category: 'Aventura' },
    { text: 'Comida típica que debo probar', icon: 'fa-plate-wheat', category: 'Gastronomía' },
    { text: '¿Cómo llegar a la Laguna 69?', icon: 'fa-mountain-sun', category: 'Guía' },
    { text: 'Próximas fiestas en Huaraz', icon: 'fa-masks-theater', category: 'Cultura' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white font-['Plus_Jakarta_Sans'] text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#FF5F1F 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between shadow-sm relative z-20">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border-2 border-[#FF5F1F] shadow-lg overflow-hidden">
                  <img src="https://i.imgur.com/Cax54U1.png" className="w-8 h-8 object-contain" alt="Logo" />
              </div>
              <div>
                  <h2 className="font-black text-slate-900 text-lg tracking-tighter uppercase italic leading-none">
                    Huaraz <span className="text-[#FF5F1F]">Assistant</span>
                  </h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Guía Inteligente 24/7</p>
              </div>
          </div>
          <button 
            onClick={() => {
                setMessages([]);
                chatSessionRef.current = createTouristChat(businesses, coupons, language);
            }} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2"
            title="Reiniciar conversación"
          >
            <i className="fas fa-trash-can"></i>
          </button>
      </div>

      <div className="flex-grow overflow-y-auto no-scrollbar relative z-10 px-4">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-fadeIn py-12">
                <div className="relative">
                    <div className="absolute -inset-10 bg-[#FF5F1F]/10 rounded-full blur-[60px]"></div>
                    <img src="https://i.imgur.com/Cax54U1.png" className="w-24 h-24 object-contain relative z-10" alt="Huaraz Explorer Logo" />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        ¿Cómo puedo <span className="text-[#FF5F1F]">ayudarte?</span>
                    </h3>
                    <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Expertos en la Cordillera Blanca</p>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(s.text)} 
                        className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-[#FF5F1F]/30 hover:bg-white transition-all flex items-center gap-4 active:scale-95"
                      >
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#FF5F1F] border border-slate-100 shadow-sm">
                              <i className={`fas ${s.icon}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-black uppercase text-[#FF5F1F] mb-1">{s.category}</p>
                              <p className="text-sm font-bold text-slate-700 italic uppercase tracking-tighter">{s.text}</p>
                          </div>
                      </button>
                    ))}
                </div>
            </div>
        )}
        
        <div className="max-w-3xl mx-auto py-8">
            {messages.map((msg) => <Message key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-100 relative z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-grow bg-slate-50 border border-slate-200 focus:border-[#FF5F1F] focus:ring-0 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none transition-all placeholder-slate-300 italic"
                disabled={isLoading}
            />
            <button
                onClick={() => handleSend()}
                disabled={isLoading || input.trim() === ''}
                className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isLoading || input.trim() === '' 
                    ? 'bg-slate-100 text-slate-300' 
                    : 'bg-[#FF5F1F] text-white shadow-lg active:scale-90'
                }`}
            >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
