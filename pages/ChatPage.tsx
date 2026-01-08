
import React, { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                    <i className="fas fa-robot"></i>
                </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[85%] md:max-w-lg shadow-sm ${isUser ? 'bg-brand-dark-blue text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                {message.isLoading ? (
                    <div className="flex items-center space-x-2 p-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                ) : (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.text}</ReactMarkdown>
                )}
            </div>
             {isUser && (
                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-brand-dark-blue font-bold flex-shrink-0 shadow-md">
                    <i className="fas fa-user"></i>
                </div>
            )}
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
      const aiText = await getAiResponse(finalInput, businesses, coupons, language);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { id: 'error', text: 'Error getting response.', sender: 'ai' };
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { icon: 'fa-drumstick-bite', label: t('chat.suggestion.food'), text: language === 'es' ? '¿Qué platos típicos debo probar en Huaraz?' : 'What typical dishes should I try in Huaraz?' },
    { icon: 'fa-hiking', label: t('chat.suggestion.itinerary'), text: language === 'es' ? 'Recomiéndame un itinerario de 3 días en Huaraz' : 'Recommend a 3-day itinerary in Huaraz' },
    { icon: 'fa-first-aid', label: t('chat.suggestion.soroche'), text: language === 'es' ? '¿Cómo puedo evitar el mal de altura o soroche?' : 'How can I avoid altitude sickness or soroche?' },
    { icon: 'fa-cloud-sun', label: t('chat.suggestion.weather'), text: language === 'es' ? '¿Cuál es la mejor época para viajar a Huaraz?' : 'When is the best time to visit Huaraz?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700 bg-teal-600 dark:bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fas fa-robot text-sm"></i>
              </div>
              <h2 className="text-lg font-bold">{t('chat.title')}</h2>
          </div>
          <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-[10px] uppercase font-bold opacity-70">En línea</span>
          </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 max-w-sm mx-auto animate-fadeIn">
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-3xl mb-2">
                    <i className="fas fa-comments"></i>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{t('chat.suggestions.title')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toca una opción para empezar a planificar tu viaje.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 w-full">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSend(s.text)}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-left hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                <i className={`fas ${s.icon} text-sm`}></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
        
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.placeholder')}
            className="flex-grow p-3 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || input.trim() === ''}
            className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:bg-gray-300 disabled:shadow-none shadow-lg hover:bg-teal-700 transition-all transform active:scale-95"
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
