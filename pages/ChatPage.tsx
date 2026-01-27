
import React, { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}>
            {/* Avatar - High Tech Style */}
            <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-black font-black text-sm shadow-[0_0_20px_rgba(57,255,20,0.15)] border-2 transition-transform hover:scale-105 ${
                isUser ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-[#39FF14] border-[#39FF14]/50'
            }`}>
                {isUser ? <i className="fas fa-user-astronaut"></i> : <img src="https://i.imgur.com/Cax54U1.png" className="w-6 h-6 object-contain" alt="H" />}
            </div>
            
            <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%]`}>
                <div className={`px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-md transition-all border ${
                    isUser 
                    ? 'bg-slate-900/80 text-gray-200 rounded-tr-none border-white/10' 
                    : 'bg-[#0D0D0D]/90 text-white rounded-tl-none border-[#39FF14]/30 shadow-[0_0_30px_rgba(57,255,20,0.08)]'
                }`}>
                    {message.isLoading ? (
                        <div className="flex items-center gap-2 py-2">
                            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_#39FF14]"></div>
                            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse [animation-delay:0.2s] shadow-[0_0_8px_#39FF14]"></div>
                            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse [animation-delay:0.4s] shadow-[0_0_8px_#39FF14]"></div>
                        </div>
                    ) : (
                        <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-[#39FF14] prose-strong:font-black prose-a:text-[#39FF14] font-medium tracking-tight ${isUser ? 'prose-invert text-gray-300' : 'text-gray-100'}`}>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    )}
                </div>
                <div className={`flex items-center gap-2 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isUser ? 'text-gray-600' : 'text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]'}`}>
                        {isUser ? 'Explorador' : 'Huaraz Explorer'}
                    </span>
                    {!message.isLoading && !isUser && <i className="fas fa-check-double text-[8px] text-[#39FF14]/40"></i>}
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async (textToSend?: string) => {
    const finalInput = textToSend || input;
    if (finalInput.trim() === '' || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text: finalInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const loadingMsg: ChatMessage = { id: 'loading', text: '', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      const response = await getAiResponse(finalInput, businesses, coupons, language);
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: response.text, 
        sender: 'ai'
      }]);
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, { id: 'error', text: '🏔️ **Señal débil en la montaña.** Inténtalo de nuevo en unos segundos.', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { text: '¿Cuáles son los mejores tours de un día?', icon: 'fa-route', category: 'Aventura' },
    { text: 'Recomiéndame comida típica huaracina', icon: 'fa-bowl-hot', category: 'Gastronomía' },
    { text: '¿Cómo llegar a la Laguna 69?', icon: 'fa-mountain-sun', category: 'Guía' },
    { text: 'Eventos y fiestas en Huaraz hoy', icon: 'fa-calendar-star', category: 'Cultura' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#050505] font-['Plus_Jakarta_Sans'] text-white overflow-hidden relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#39FF14 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#050505]"></div>

      {/* Header - Huaraz Explorer Branding */}
      <div className="px-8 py-6 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#39FF14]/15 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative z-20">
          <div className="flex items-center gap-5">
              <div className="relative group">
                  <div className="absolute -inset-2 bg-[#39FF14]/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-14 h-14 rounded-2xl bg-[#0D0D0D] flex items-center justify-center border-2 border-[#39FF14]/40 shadow-[0_0_25px_rgba(57,255,20,0.2)]">
                      <img src="https://i.imgur.com/Cax54U1.png" className="w-8 h-8 object-contain" alt="Huaraz Explorer Logo" />
                  </div>
              </div>
              <div>
                  <h2 className="font-black text-white text-xl tracking-tighter uppercase italic leading-none">Huaraz <span className="text-[#39FF14]">Explorer</span></h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]"></span>
                    </span>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Experto Local Online</p>
                  </div>
              </div>
          </div>
          <button 
            onClick={() => setMessages([])} 
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all active:scale-95"
            title="Limpiar conversación"
          >
            <i className="fas fa-trash-can text-base"></i>
          </button>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar relative z-10">
        {/* Central Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[180px] pointer-events-none"></div>

        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-12 p-8 animate-fadeIn relative z-10">
                <div className="relative group">
                    <div className="absolute -inset-10 bg-[#39FF14]/15 rounded-full blur-3xl group-hover:bg-[#39FF14]/25 transition-all duration-1000"></div>
                    <div className="relative w-36 h-36 bg-[#0D0D0D] border-2 border-[#39FF14]/20 rounded-[3rem] shadow-[0_0_60px_rgba(57,255,20,0.1)] flex items-center justify-center group-hover:border-[#39FF14]/50 transition-all">
                        <i className="fas fa-mountain-city text-6xl text-[#39FF14] drop-shadow-[0_0_15px_#39FF14] group-hover:scale-110 transition-transform duration-500"></i>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none max-w-sm mx-auto">
                        Tu Guía <span className="text-[#39FF14] drop-shadow-[0_0_10px_#39FF14]">Definitivo</span>
                    </h3>
                    <p className="text-gray-500 font-bold max-w-xs mx-auto text-[11px] tracking-[0.2em] uppercase leading-relaxed">
                        Sistema experto en la Cordillera Blanca. Pregúntame lo que necesites sobre Huaraz.
                    </p>
                </div>

                {/* Suggestions Grid - Improved Layout to avoid "squashing" */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(s.text)} 
                        className="group p-6 bg-[#0D0D0D]/60 backdrop-blur-lg border border-white/5 rounded-[2rem] text-left hover:border-[#39FF14]/50 hover:bg-[#111111] transition-all flex items-start gap-5 shadow-lg active:scale-95"
                      >
                          <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] border border-[#39FF14]/20 group-hover:bg-[#39FF14] group-hover:text-black transition-colors">
                              <i className={`fas ${s.icon} text-2xl`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#39FF14]/60 group-hover:text-[#39FF14] transition-colors mb-1">{s.category}</p>
                              <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors leading-snug">
                                {s.text}
                              </p>
                          </div>
                      </button>
                    ))}
                </div>
            </div>
        )}
        
        <div className="max-w-3xl mx-auto px-8 py-10 relative z-10">
            {messages.map((msg) => <Message key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Futuristic Tech Console */}
      <div className="p-8 bg-[#0A0A0A] border-t border-[#39FF14]/15 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="relative max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-grow relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/20 to-[#39FF14]/0 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Consulta al guía de la Cordillera..."
                    className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#39FF14]/60 focus:ring-0 rounded-3xl py-6 px-8 text-base font-semibold text-white outline-none transition-all shadow-inner placeholder-gray-700 relative z-10"
                    disabled={isLoading}
                />
            </div>
            
            <button
                onClick={() => handleSend()}
                disabled={isLoading || input.trim() === ''}
                className={`shrink-0 w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 relative overflow-hidden group border-2 ${
                    isLoading || input.trim() === '' 
                    ? 'bg-gray-900/50 text-gray-800 border-white/5' 
                    : 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_40px_rgba(57,255,20,0.35)] active:scale-90'
                }`}
            >
                {isLoading ? (
                    <i className="fas fa-atom fa-spin text-2xl"></i>
                ) : (
                    <i className="fas fa-paper-plane text-2xl group-hover:scale-125 transition-transform duration-300"></i>
                )}
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
        </div>
        
        <div className="mt-8 flex items-center justify-between max-w-3xl mx-auto opacity-30 hover:opacity-100 transition-opacity">
             <div className="h-px bg-white/10 flex-grow max-w-[50px]"></div>
             <div className="flex items-center gap-3">
                 <i className="fas fa-shield-halved text-[10px] text-[#39FF14]"></i>
                 <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] italic whitespace-nowrap">Conexión Segura con el Ecosistema Huaraz Explorer</p>
             </div>
             <div className="h-px bg-white/10 flex-grow max-w-[50px]"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
