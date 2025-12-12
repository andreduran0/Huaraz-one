
import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const NewsletterPage: React.FC = () => {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // 1. Validaciones básicas
    if (!name.trim()) {
      setStatus('error');
      setMessage(t('newsletter.nameRequired'));
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage(t('newsletter.emailInvalid'));
      return;
    }

    setStatus('loading');

    try {
      // 2. URL DE ZAPIER (Webhook) - Actualizada
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/25669518/ufadaa9/';
      
      console.log(`[Newsletter] Enviando datos a: ${zapierWebhookUrl}`);

      // 3. Preparar los datos como FormData
      // Esto es CRÍTICO para que Zapier lo lea correctamente sin errores de CORS
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('source', 'Huaraz Explorer PWA');
      formData.append('timestamp', new Date().toISOString());

      // 4. Enviar la petición
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Evita que el navegador bloquee la petición por seguridad y permita el envío a Zapier
        body: formData,
      });
      
      console.log('[Newsletter] Datos enviados exitosamente (blind request).');
      
      // 5. Manejar el éxito (Como es no-cors, asumimos éxito si no hay error de red)
      setStatus('success');
      setName('');
      setEmail('');

    } catch (error) {
      console.error("[Newsletter] Error enviando lead:", error);
      setStatus('error');
      setMessage(t('newsletter.error'));
      
      setTimeout(() => {
          if (status === 'error') {
             setStatus('idle');
             setMessage('');
          }
      }, 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
      <div className="text-center">
        <i className={`fas ${status === 'success' ? 'fa-check-circle text-green-500' : 'fa-envelope-open-text text-teal-500'} text-5xl mb-4 transition-all`}></i>
        
        {status === 'success' ? (
           <>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('newsletter.successTitle')}</h1>
             <p className="mt-2 text-gray-600 dark:text-gray-400">{t('newsletter.successMsg')}</p>
           </>
        ) : (
           <>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('newsletter.greeting')}</h1>
             <p className="mt-2 text-gray-600 dark:text-gray-400">{t('newsletter.intro')}</p>
           </>
        )}
      </div>
      
      {status === 'success' ? (
        <div className="mt-8 text-center">
          <button 
              onClick={() => setStatus('idle')}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
          >
              {t('newsletter.reset')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('newsletter.namePlaceholder')}
            disabled={status === 'loading'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
          />
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.emailPlaceholder')}
            disabled={status === 'loading'}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
          />
          
          {message && status === 'error' && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all w-full shadow-md flex justify-center items-center ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === 'loading' ? (
               <>
                 <i className="fas fa-spinner fa-spin mr-2"></i> {t('newsletter.sending')}
               </>
            ) : (
               t('newsletter.button')
            )}
          </button>
        </form>
      )}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">{t('newsletter.privacy')}</p>
    </div>
  );
};

export default NewsletterPage;
