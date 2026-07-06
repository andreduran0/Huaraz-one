import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

const NewsletterPage: React.FC = () => {
  const t = useTranslations();
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!whatsapp.trim()) {
      setStatus('error');
      setMessage('Por favor, ingresa tu número de WhatsApp');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Por favor, ingresa un correo electrónico válido');
      return;
    }

    setStatus('loading');

    try {
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/28120126/427n29k/';

      const formData = new FormData();
      formData.append('whatsapp', whatsapp); 
      formData.append('email', email);
      formData.append('source', 'Huaraz Explorer PWA - Newsletter Campaign');
      formData.append('timestamp', new Date().toISOString());

      await fetch(zapierWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      setStatus('success');
      setWhatsapp('');
      setEmail('');

    } catch (error) {
      console.error("[Newsletter] Error:", error);
      setStatus('error');
      setMessage('Hubo un error al procesar tu solicitud. Inténtalo de nuevo.');
    }
  };

  const handleDownload = () => {
    // Enlace de descarga directa desde tu Google Drive
    const pdfUrl = 'https://drive.google.com/uc?export=download&id=1VoYFHKi9P3TSZP_iv5JShqp03rkN-vZU';
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'Guia_Huaraz_Explorer.pdf');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-['Plus_Jakarta_Sans'] py-6">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800 text-center space-y-6 animate-fadeIn relative overflow-hidden">

        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Icono Principal */}
        <div className={`relative z-10 w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl transition-all duration-500 ${status === 'success' ? 'bg-[#39FF14] text-black shadow-[0_0_30px_rgba(57,255,20,0.4)] rotate-12' : 'bg-slate-100 dark:bg-slate-800 text-[#39FF14] shadow-inner'}`}>
          <i className={`fas ${status === 'success' ? 'fa-file-arrow-down' : 'fa-envelope-open-text'}`}></i>
        </div>

        {status === 'success' ? (
          /* --- ESTADO DE ÉXITO --- */
          <div className="space-y-5 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter leading-none">
              ¡Registro exitoso! <br/>Descarga tu guía
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base max-w-md mx-auto">
              Revisa tu WhatsApp o correo electrónico para acceder al material. O haz clic abajo para descargarla de inmediato.
            </p>

            <button
              onClick={handleDownload}
              className="w-full bg-[#39FF14] text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-[0_15px_30px_rgba(57,255,20,0.3)] hover:bg-white hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 mt-4"
            >
              <i className="fas fa-download text-lg"></i> DESCARGAR PDF AHORA
            </button>

            <button
              onClick={() => setStatus('idle')}
              className="text-slate-400 text-xs font-bold hover:underline mt-2 inline-block"
            >
              Volver al formulario
            </button>
          </div>
        ) : (
          /* --- ESTADO DE FORMULARIO --- */
          <div className="space-y-6 relative z-10">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter leading-tight">
                ¡Descarga tu Guía PDF Exclusiva y Únete a la Red!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed max-w-md mx-auto">
                Únete y accede a <span className="font-bold text-slate-700 dark:text-slate-300">promociones en negocios y eventos, estrategias de finanzas e importación sostenible</span>. ¡Y sé el primero en probar nuestros <span className="text-green-600 dark:text-[#39FF14] font-bold">juegos de montaña inmersiva</span>!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Input WhatsApp */}
              <div className="space-y-1.5 text-left">
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Tu número de WhatsApp"
                  disabled={status === 'loading'}
                  className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#39FF14] focus:border-transparent outline-none transition-all font-semibold dark:text-white"
                />
                <p className="text-[10px] md:text-[11px] text-slate-400 dark:text-slate-500 font-medium pl-2 flex items-center gap-1.5 leading-tight">
                  <i className="fas fa-info-circle"></i> También enviamos alertas rápidas y beneficios por aquí.
                </p>
              </div>

              {/* Input Email */}
              <div className="text-left">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu Correo Electrónico"
                  disabled={status === 'loading'}
                  className="w-full p-4 md:p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-[#39FF14] focus:border-transparent outline-none transition-all font-semibold dark:text-white"
                />
              </div>

              {/* Mensaje de error */}
              {message && status === 'error' && (
                <p className="text-red-500 text-xs font-black uppercase tracking-widest animate-fadeIn">{message}</p>
              )}

              <div className="pt-1">
                {/* Privacidad */}
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-3 mt-2">
                  <i className="fas fa-shield-alt mr-1"></i> HUARAZ EXPLORER • TU PRIVACIDAD ES IMPORTANTE
                </p>

                {/* CTA Agresivo */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#39FF14] text-black py-5 md:py-6 rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.1em] shadow-[0_15px_30px_rgba(57,255,20,0.2)] hover:bg-[#32e612] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <i className="fas fa-spinner fa-spin text-xl"></i>
                  ) : (
                    <>
                      <i className="fas fa-bolt text-lg"></i> ¡ENVIAR Y DESCARGAR MI GUÍA!
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* SECCIÓN DE VALOR AÑADIDO (Mejora de conversión) */}
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-white/5 text-left space-y-5">
              <h4 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <i className="fas fa-lock text-green-600 dark:text-[#39FF14]"></i> Lo que obtienes al instante:
              </h4>
              
              <ul className="space-y-3">
                <li className="flex gap-3 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
                  <span className="text-green-600 dark:text-[#39FF14] mt-0.5"><i className="fas fa-check-circle"></i></span>
                  <span><strong>Acceso VIP:</strong> Cupones flash para los mejores restaurantes y eventos en Huaraz.</span>
                </li>
                <li className="flex gap-3 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
                  <span className="text-green-600 dark:text-[#39FF14] mt-0.5"><i className="fas fa-check-circle"></i></span>
                  <span><strong>Laboratorio Tech:</strong> Sé de los primeros en probar nuestros juegos de montaña inmersiva.</span>
                </li>
                <li className="flex gap-3 text-slate-600 dark:text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
                  <span className="text-green-600 dark:text-[#39FF14] mt-0.5"><i className="fas fa-check-circle"></i></span>
                  <span><strong>Estrategias Pro:</strong> Guías de finanzas e importación sostenible en los Andes.</span>
                </li>
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterPage;
