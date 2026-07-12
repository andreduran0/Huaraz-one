import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import HeroSlider from '../components/HeroSlider';
// import { useTranslations } from '../hooks/useTranslations'; // Lo comentamos si usamos la función local
import { useNavigate } from 'react-router-dom';
import { BusinessCategory } from '../types';

const FeatureItem: React.FC<{ icon: string; color: string; label: string }> = ({ icon, color, label }) => (
  <div className="flex items-center gap-6 group animate-fadeIn">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200 tracking-tight leading-tight">{label}</span>
  </div>
);

const HomePage: React.FC = () => {
  // 1. Extraemos 'language' del contexto
  const { businesses, heroImages, language } = useAppContext(); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Creamos la función traductora
  const t = (es: string, en: string) => language === 'es' ? es : en;

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return b.status === 'approved' && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-40 px-4 space-y-10 pt-6 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      
      {/* SEO H1 */}
      <h1 className="sr-only">
        {t('Plataforma de recomendaciones turísticas en Huaraz', 'Tourist recommendation platform in Huaraz')}
      </h1>

      {/* HERO SECTION */}
      <section className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <HeroSlider images={heroImages}>
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
            <p className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg uppercase italic tracking-tighter">
              Huaraz Explorer
            </p>
            <p className="text-xl text-white font-bold tracking-wide drop-shadow-md uppercase italic">
              {t('La Cordillera Blanca a un clic', 'The Cordillera Blanca one click away')}
            </p>
          </div>
        </HeroSlider>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100 dark:border-slate-800 space-y-8 animate-fadeIn">
        <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">
              HUARAZ EXPLORER
            </h2>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">
              {t('PLATAFORMA DE RECOMENDACIONES TURÍSTICAS EN HUARAZ', 'TOURIST RECOMMENDATION PLATFORM IN HUARAZ')}
            </p>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[17px] font-bold leading-relaxed max-w-2xl">
            {t(
              'Huaraz Explorer ayuda a viajeros nacionales e internacionales a descubrir los mejores negocios, experiencias y servicios turísticos de Huaraz y la Cordillera Blanca, combinando información local y tecnología.',
              'Huaraz Explorer helps national and international travelers discover the best businesses, experiences, and tourist services in Huaraz and the Cordillera Blanca, combining local information and technology.'
            )}
        </p>
        <div className="flex flex-col gap-5 pt-4">
            <FeatureItem icon="fa-location-dot" color="bg-red-50 text-red-500" label={t("Mapa turístico interactivo", "Interactive tourist map")} />
            <FeatureItem icon="fa-star" color="bg-yellow-50 text-yellow-500" label={t("Negocios locales recomendados", "Recommended local businesses")} />
            <FeatureItem icon="fa-calendar-day" color="bg-blue-50 text-blue-500" label={t("Festividades y eventos", "Festivities and events")} />
            <FeatureItem icon="fa-robot" color="bg-slate-100 text-slate-600" label={t("Guía turístico IA 24/7", "24/7 AI Tourist Guide")} />
            <FeatureItem icon="fa-ticket" color="bg-orange-50 text-orange-500" label={t("Cupones y beneficios", "Coupons and benefits")} />
            <FeatureItem icon="fa-newspaper" color="bg-gray-50 text-gray-500" label={t("Newsletter & Token Huaraz", "Newsletter & Huaraz Token")} />
            <FeatureItem icon="fa-briefcase" color="bg-emerald-50 text-emerald-600" label={t("Bolsa de trabajo de empresas Hz", "Job board for locals")} />
        </div>
      </section>

      {/* TOKEN $HUARAZ */}
      <section className="bg-[#0A0A0A] rounded-[3.5rem] p-10 shadow-2xl text-white overflow-hidden relative border border-[#39FF14]/30 animate-fadeIn">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-bottom opacity-150"
          style={{ backgroundImage: "url('https://i.imgur.com/YelHKTw.jpeg')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-[#39FF14] rounded-3xl flex items-center justify-center text-black font-black text-3xl shadow-[0_0_30px_rgba(57,255,20,0.6)]">HZ</div>
              <div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-xl inline-flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
                  <p className="text-[10px] font-black tracking-[0.2em] text-white/80 uppercase">PUMP.FUN LIVE</p>
                </div>
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">$HUARAZ</h3>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] mb-2">{t('Market Cap Est.', 'Est. Market Cap')}</p>
               <p className="text-5xl font-black tracking-tighter italic text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">$224.8K</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 mb-10">
              <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Live Performance (24h)</p>
                  <p className="text-2xl font-black text-white italic">$0.00142 <i className="fas fa-caret-up text-[#39FF14] ml-2"></i></p>
              </div>
              <div className="h-32 w-full flex items-end">
                  <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path d="M0,35 Q10,32 20,25 T40,28 T60,15 T80,18 T100,5" fill="none" stroke="#39FF14" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                      <path d="M0,35 Q10,32 20,25 T40,28 T60,15 T80,18 T100,5 L100,40 L0,40 Z" fill="url(#neonGradient)" opacity="0.3" />
                      <defs><linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#39FF14" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                  </svg>
              </div>
          </div>
          
          <a href="https://pump.fun/" target="_blank" rel="noreferrer" className="w-full bg-[#39FF14] text-black py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_15px_40px_rgba(57,255,20,0.3)]">
              {t('Comprar ahora', 'Buy now')} <i className="fas fa-bolt"></i>
          </a>
        </div>
      </section>

      {/* COMUNIDAD Y NEWSLETTER */}
      <section className="bg-[#0A0A0A] rounded-[3.5rem] p-12 text-center relative overflow-hidden shadow-2xl border border-white/10 animate-fadeIn group">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-130 mix-blend-luminosity"
          style={{ backgroundImage: "url('https://i.imgur.com/vG4DFPe.jpeg')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/40"></div>
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#39FF14 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-b from-[#39FF14]/5 to-transparent"></div>

        <div className="relative z-10 space-y-10">
            <div className="w-28 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105 gap-4 px-6">
                <i className="fab fa-whatsapp text-3xl text-[#39FF14] drop-shadow-[0_0_10px_rgba(57,255,20,0.6)]"></i>
                <div className="w-px h-6 bg-white/20"></div>
                <i className="fas fa-envelope-open-text text-2xl text-white/60"></i>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    {t('ÚNETE A LA ', 'JOIN THE ')} <br/><span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">{t('COMUNIDAD', 'COMMUNITY')}</span>
                </h3>
                <p className="text-white/70 text-base font-bold max-w-sm mx-auto leading-relaxed italic">
                    {language === 'es' ? (
                      <>Únete a nuestro <span className="text-white">grupo VIP de WhatsApp</span>. Recibe <span className="text-[#39FF14]">promociones exclusivas</span>, sé parte de nuestro ecosistema para <span className="text-[#39FF14]">importar tecnología sostenible mientras inviertes</span>, obtén <span className="text-[#39FF14]">merch oficial</span>, beneficios en aerolíneas y eventos, pruebas antes que nadie nuestras <span className="text-[#39FF14]">experiencias inmersivas y juegos de montaña</span> en Huaraz Explorer.</>
                    ) : (
                      <>Join our <span className="text-white">VIP WhatsApp group</span>. Get <span className="text-[#39FF14]">exclusive promotions</span>, be part of our ecosystem to <span className="text-[#39FF14]">import sustainable tech while investing</span>, get <span className="text-[#39FF14]">official merch</span>, airline & event benefits, and test our <span className="text-[#39FF14]">immersive mountain games</span> before anyone else on Huaraz Explorer.</>
                    )}
                </p>
            </div>

            <button 
                onClick={() => navigate('/newsletter')} 
                className="w-full bg-[#39FF14] text-black py-7 rounded-[2.2rem] font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_50px_rgba(57,255,20,0.3)] hover:bg-white hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                {t('UNIRME AHORA', 'JOIN NOW')} <i className="fas fa-arrow-right text-[10px]"></i>
            </button>

            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">HUARAZ EXPLORER • {t('RED DE INNOVADORES', 'INNOVATORS NETWORK')}</p>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </section>

      {/* DIRECTORIO */}
      <section className="pt-8 space-y-8 animate-fadeIn relative z-10">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">{t('Directorio', 'Directory')} <span className="text-[#2A4D69]">{t('Explora', 'Explore')}</span></h2>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 ml-6"></div>
        </div>
        <div className="relative group px-2">
          <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder={t("Buscar pollerías, hoteles, tours...", "Search chicken shops, hotels, tours...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] py-6 pl-16 pr-8 shadow-sm focus:ring-4 focus:ring-[#2A4D69]/5 dark:text-white font-semibold outline-none"
          />
        </div>
        
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-semibold">
            {t("No se encontraron resultados para tu búsqueda.", "No results found for your search.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2">
            {filteredBusinesses.map(business => <BusinessCard key={business.id} business={business} />)}
          </div>
        )}
      </section>
      
      {/* FAB MAPA */}
      <div className="fixed bottom-32 right-8 z-[100]">
        <button onClick={() => navigate('/map')} className="w-24 h-24 bg-[#2A4D69] text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(42,77,105,0.4)] hover:scale-110 active:scale-90 transition-all border-2 border-white/10">
          <i className="fas fa-map-location-dot text-4xl mb-1"></i>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">{t('Mapa', 'Map')}</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
