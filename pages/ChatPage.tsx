
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
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    <i className="fas fa-robot"></i>
                </div>
            )}
            <div className={`p-3 rounded-lg max-w-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                ) : (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.text}</ReactMarkdown>
                )}
            </div>
             {isUser && (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
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
  
  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: ChatMessage = { id: 'loading', text: '', sender: 'ai', isLoading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const aiText = await getAiResponse(input, businesses, coupons, language);
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

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-center">{t('chat.title')}</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.placeholder')}
            className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:bg-gray-400 hover:bg-teal-700 transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;