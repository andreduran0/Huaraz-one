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
      // Llamamos al servicio (asegúrate de que getAiResponse devuelva el objeto {text, sources})
      const response = await getAiResponse(finalInput, businesses, coupons, language);
      
      const aiMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        text: response.text, // <-- Aquí sacamos el texto del objeto
        sender: 'ai' 
      };

      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error en ChatPage:", error);
      const errorMessage: ChatMessage = { 
        id: 'error', 
        text: language === 'es' ? 'Lo siento, hubo un error al conectar con la IA.' : 'Error getting response.', 
        sender: 'ai' 
      };
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
