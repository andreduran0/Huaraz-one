
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import HeroSlider from '../components/HeroSlider';
import { useTranslations } from '../hooks/useTranslations';
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
  const { businesses, heroImages } = useAppContext();
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return b.status === 'approved' && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-40 px-4 space-y-10 pt-6 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      
      {/* SEO H1 - Visually Hidden but Semantically Primary */}
      <h1 className="sr-only">Plataforma de recomendaciones turísticas en Huaraz – Hoteles, Restaurantes y Tours en la Cordillera Blanca</h1>

      {/* HERO SECTION */}
      <section className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <HeroSlider images={heroImages}>
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
            <p className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg uppercase italic tracking-tighter">Huaraz Explorer</p>
            <p className="text-xl text-white font-bold tracking-wide drop-shadow-md uppercase italic">La Cordillera Blanca a un clic</p>
          </div>
        </HeroSlider>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100 dark:border-slate-800 space-y-8 animate-fadeIn">
        <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase leading-none">HUARAZ EXPLORER</h2>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">PLATAFORMA DE RECOMENDACIONES TURÍSTICAS EN HUARAZ</p>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-[17px] font-bold leading-relaxed max-w-2xl">
            Huaraz Explorer ayuda a viajeros nacionales e internacionales a descubrir los mejores negocios, experiencias y servicios turísticos de Huaraz y la Cordillera Blanca, combinando información local y tecnología.
        </p>
        <div className="flex flex-col gap-5 pt-4">
            <FeatureItem icon="fa-location-dot" color="bg-red-50 text-red-500" label="Mapa turístico interactivo" />
            <FeatureItem icon="fa-star" color="bg-yellow-50 text-yellow-500" label="Negocios locales recomendados" />
            <FeatureItem icon="fa-calendar-day" color="bg-blue-50 text-blue-500" label="Festividades y eventos" />
            <FeatureItem icon="fa-robot" color="bg-slate-100 text-slate-600" label="Guía turístico IA 24/7" />
            <FeatureItem icon="fa-ticket" color="bg-orange-50 text-orange-500" label="Cupones y beneficios" />
            <FeatureItem icon="fa-newspaper" color="bg-gray-50 text-gray-500" label="Newsletter & Token Huaraz" />
          <FeatureItem   icon="fa-briefcase" color="bg-emerald-50 text-emerald-600" label="Bolsa de trabajo para empresas"  />
         
        </div>
      </section>

      {/* TOKEN $HUARAZ */}
      <section className="bg-[#0A0A0A] rounded-[3.5rem] p-10 shadow-2xl text-white overflow-hidden relative border border-[#39FF14]/30 animate-fadeIn">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#39FF14]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 relative z-10">
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
             <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em] mb-2">Market Cap Est.</p>
             <p className="text-5xl font-black tracking-tighter italic text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">$124.8K</p>
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
            Comprar ahora <i className="fas fa-bolt"></i>
        </a>
      </section>

      {/* NEWSLETTER - ACTUALIZADA CON MÁS INFORMACIÓN */}
      <section className="bg-[#000000] rounded-[3.5rem] p-12 text-center relative overflow-hidden shadow-2xl border border-white/10 animate-fadeIn group">
        {/* Cyber Pattern Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#39FF14 0.8px, transparent 0.8px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#39FF14]/5 to-transparent"></div>

        <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105">
                <i className="fas fa-envelope-open-text text-4xl text-[#39FF14]"></i>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    ¡MANTENTE <br/><span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]">INFORMADO!</span>
                </h3>
                <p className="text-white/60 text-base font-bold max-w-sm mx-auto leading-relaxed italic">
                    Recibe información cada semana sobre <span className="text-white">Ciencia, tecnología, turismo y emprendimiento.</span>
                </p>
            </div>

            <button 
                onClick={() => navigate('/newsletter')} 
                className="w-full bg-[#39FF14] text-black py-7 rounded-[2.2rem] font-black uppercase text-xs tracking-[0.4em] shadow-[0_20px_50px_rgba(57,255,20,0.3)] hover:bg-white hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-5 overflow-hidden relative"
            >
                {/* Sweep effect on button */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                SUSCRIBIRME AHORA <i className="fas fa-arrow-right text-[10px]"></i>
            </button>

            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.6em]">HUARAZ EXPLORER • NEWS PROTOCOL</p>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </section>

      {/* DIRECTORIO */}
      <section className="pt-8 space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic tracking-tighter">Directorio <span className="text-[#2A4D69]">Explora</span></h2>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 ml-6"></div>
        </div>
        <div className="relative group px-2">
          <i className="fas fa-search absolute left-8 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Buscar pollerías, hoteles, tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-none rounded-[2rem] py-6 pl-16 pr-8 shadow-sm focus:ring-4 focus:ring-[#2A4D69]/5 dark:text-white font-semibold outline-none"
          />
        </div>
        <div className="grid grid-cols-1 gap-10 px-2">
          {filteredBusinesses.map(business => <BusinessCard key={business.id} business={business} />)}
        </div>
      </section>
      
      {/* FAB MAPA */}
      <div className="fixed bottom-32 right-8 z-[100]">
        <button onClick={() => navigate('/map')} className="w-24 h-24 bg-[#2A4D69] text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_20px_50px_rgba(42,77,105,0.4)] hover:scale-110 active:scale-90 transition-all border-2 border-white/10">
          <i className="fas fa-map-location-dot text-4xl mb-1"></i>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Mapa</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
