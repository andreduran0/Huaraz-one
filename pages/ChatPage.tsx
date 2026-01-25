
import React, { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { ChatMessage, GroundingSource } from '../types';
import ReactMarkdown from 'react-markdown';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-4 my-8 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}>
            {/* Avatar */}
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden transition-transform hover:scale-110 ${
                isUser ? 'bg-brand-orange rotate-3' : 'bg-brand-dark-blue -rotate-3'
            }`}>
                {isUser ? (
                    <i className="fas fa-user text-xs"></i>
                ) : (
                    <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-full h-full object-cover" alt="Explorer Assistant" />
                )}
            </div>
            
            {/* Bubble */}
            <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]`}>
                <div className={`relative px-6 py-5 rounded-[2rem] shadow-sm transition-all duration-500 ${
                    isUser 
                    ? 'bg-brand-dark-blue text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                }`}>
                    {message.isLoading ? (
                        <div className="flex items-center space-x-2 py-2">
                            <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-duration:0.6s]"></div>
                            <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none 
                            prose-p:leading-relaxed prose-p:my-2
                            prose-strong:text-brand-orange dark:prose-strong:text-brand-green 
                            prose-headings:text-brand-dark-blue dark:prose-headings:text-white
                            prose-ul:my-2 prose-li:my-1">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Grounding Sources */}
                {message.sources && message.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 px-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest w-full mb-1">Fuentes verificadas:</span>
                        {message.sources.map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-brand-blue hover:text-white rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-300 transition-all border border-gray-200 dark:border-gray-600 shadow-sm"
                            >
                                <i className="fas fa-globe text-[8px]"></i>
                                <span className="max-w-[120px] truncate">{source.title}</span>
                                <i className="fas fa-external-link-alt text-[7px] opacity-50"></i>
                            </a>
                        ))}
                    </div>
                )}
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleSend = async (textToSend?: string) => {
    const finalInput = textToSend || input;
    if (finalInput.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: finalInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const loadingMessage: ChatMessage = { id: 'loading', text: '', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await getAiResponse(finalInput, businesses, coupons, language);
      const aiMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        text: response.text, 
        sender: 'ai',
        sources: response.sources
      };
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { 
        id: 'error', 
        text: language === 'es' ? 'Lo siento, hubo un problema. ¿Podrías repetir?' : 'Sorry, I had a problem. Could you repeat?', 
        sender: 'ai' 
      };
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm(language === 'es' ? '¿Borrar conversación?' : 'Clear chat?')) {
        setMessages([]);
    }
  };

  const suggestions = [
    { icon: 'fa-cloud-sun', label: 'Clima Hoy', text: language === 'es' ? '¿Cómo está el clima hoy en Huaraz para ir a la Laguna 69?' : 'How is the weather today in Huaraz for Laguna 69?' },
    { icon: 'fa-utensils', label: 'Cena Típica', text: language === 'es' ? 'Recomiéndame un lugar para cenar comida típica huaracina hoy' : 'Recommend a place for traditional Huaraz dinner tonight' },
    { icon: 'fa-bus', label: 'Tours Mañana', text: language === 'es' ? '¿Qué tours salen mañana desde el centro de Huaraz?' : 'What tours are departing tomorrow from Huaraz center?' },
    { icon: 'fa-heart-pulse', label: 'Mal de Altura', text: language === 'es' ? 'Consejos rápidos para evitar el soroche' : 'Quick tips to avoid altitude sickness' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white dark:bg-gray-950 md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
      
      {/* Header Huaraz Explorer */}
      <div className="shrink-0 px-8 py-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-brand-dark-blue flex items-center justify-center text-white shadow-2xl rotate-3 transition-transform group-hover:rotate-0">
                    <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-12 h-12 rounded-xl" alt="Huaraz Explorer Logo" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-brand-dark-blue dark:text-white uppercase italic tracking-tighter leading-none">IA Explorer</h2>
                    <span className="bg-brand-orange/10 text-brand-orange text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-brand-orange/20">Official</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    Asistente de Huaraz Explorer
                  </p>
              </div>
          </div>
          <button 
            onClick={clearChat}
            disabled={messages.length === 0}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-0"
            title="Limpiar chat"
          >
            <i className="fas fa-trash-alt text-lg"></i>
          </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-grow p-6 overflow-y-auto no-scrollbar bg-gray-50/50 dark:bg-gray-950/50">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-12 animate-fadeIn max-w-lg mx-auto">
                <div className="space-y-6">
                    <div className="relative inline-block">
                        <div className="w-28 h-28 bg-brand-dark-blue rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-6">
                            <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-24 h-24 rounded-[2rem]" alt="AI" />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-brand-orange text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-950 rotate-12">
                            <i className="fas fa-sparkles text-sm"></i>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-brand-dark-blue dark:text-white uppercase italic tracking-tighter leading-tight">Huaraz Explorer</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                            Tu asistente oficial para planificar tu aventura en la Cordillera Blanca. ¿En qué puedo ayudarte hoy?
                        </p>
                    </div>
                </div>
                
                <div className="w-full space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Preguntas Frecuentes</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {suggestions.map((s, i) => (
                            <button 
                                key={i}
                                onClick={() => handleSend(s.text)}
                                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-left hover:border-brand-blue hover:shadow-xl transition-all group active:scale-95 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                    <i className={`fas ${s.icon} text-sm`}></i>
                                </div>
                                <span className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-tight leading-tight">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        
        <div className="max-w-3xl mx-auto pb-10">
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-6 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        {messages.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 scroll-smooth">
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(s.text)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-brand-blue hover:text-white border border-gray-100 dark:border-gray-700 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                    >
                        <i className={`fas ${s.icon}`}></i>
                        {s.label}
                    </button>
                ))}
            </div>
        )}

        <div className="relative group max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                <i className={`fas ${isLoading ? 'fa-circle-notch fa-spin text-brand-orange' : 'fa-feather-pointed text-gray-300 group-focus-within:text-brand-blue'} text-xl transition-colors`}></i>
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-brand-blue focus:bg-white dark:focus:bg-gray-800 rounded-[2.5rem] py-6 pl-16 pr-24 text-gray-800 dark:text-white focus:outline-none focus:ring-8 focus:ring-brand-blue/5 transition-all text-base font-bold shadow-inner placeholder:text-gray-300 dark:placeholder:text-gray-600"
                disabled={isLoading}
            />
            <button
                onClick={() => handleSend()}
                disabled={isLoading || input.trim() === ''}
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 flex items-center justify-center transition-all shadow-2xl active:scale-90 ${
                    isLoading || input.trim() === '' 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-300' 
                    : 'bg-brand-dark-blue hover:bg-brand-blue text-white hover:scale-105'
                }`}
            >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-lg`}></i>
            </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-5 opacity-40">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">Huaraz Explorer IA</p>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em]">Google Search Verified</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
