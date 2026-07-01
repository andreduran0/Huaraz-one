
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
      // Nuevo Webhook de Zapier actualizado
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/28120126/427n29k/';

      const formData = new FormData();
      formData.append('Numero de whastapp', Numero de whastapp);
      formData.append('email', email);
      formData.append('source', 'Huaraz Explorer PWA - Newsletter Campaign');
      formData.append('timestamp', new Date().toISOString());

      await fetch(zapierWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setStatus('success');
      setName('');
      setEmail('');

    } catch (error) {
      console.error("[Newsletter] Error:", error);
      setStatus('error');
      setMessage(t('newsletter.error'));
    }
  };

  const handleDownload = () => {
    alert("Iniciando descarga de tu Guía PDF Exclusiva de Huaraz Explorer...");
    // window.open('https://tu-enlace-al-pdf.com/guia.pdf', '_blank');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-['Plus_Jakarta_Sans']">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 md:p-16 border border-slate-100 dark:border-slate-800 text-center space-y-8 animate-fadeIn">

        <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-3xl transition-all duration-500 ${status === 'success' ? 'bg-green-500 text-white shadow-xl rotate-12' : 'bg-brand-blue/10 text-brand-blue'}`}>
          <i className={`fas ${status === 'success' ? 'fa-file-arrow-down' : 'fa-envelope-open-text'}`}></i>
        </div>

        {status === 'success' ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter leading-none">{t('newsletter.successTitle')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('newsletter.successMsg')}</p>

            <button
              onClick={handleDownload}
              className="w-full bg-brand-blue text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <i className="fas fa-download"></i> Descargar PDF Ahora
            </button>

            <button
              onClick={() => setStatus('idle')}
              className="text-slate-400 text-xs font-bold hover:underline"
            >
              {t('newsletter.reset')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter leading-none">{t('newsletter.greeting')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Suscríbete a nuestro boletín semanal y recibe información sobre <strong>ciencia, tecnología, turismo y emprendimiento</strong>. ¡Y obtén tu guía PDF de regalo!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('newsletter.namePlaceholder')}
                disabled={status === 'loading'}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-semibold"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.emailPlaceholder')}
                disabled={status === 'loading'}
                className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all font-semibold"
              />

              {message && status === 'error' && (
                <p className="text-red-500 text-xs font-black uppercase tracking-widest">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-blue text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {status === 'loading' ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-bolt"></i> {t('newsletter.button')}</>}
              </button>
            </form>
          </div>
        )}

        <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">{t('newsletter.privacy')}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
