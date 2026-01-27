
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import HeroSlider from '../components/HeroSlider';
import { useTranslations } from '../hooks/useTranslations';
import { Link, useNavigate } from 'react-router-dom';
import { BusinessCategory, AdLevel } from '../types';

const HomePage: React.FC = () => {
  const { businesses, heroImages } = useAppContext();
  const t = useTranslations();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return b.status === 'approved' && matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 px-4 space-y-6 pt-6 font-['Plus_Jakarta_Sans'] relative">
      
      {/* 1. HERO CARD DINÁMICO (Con Slider de imágenes) */}
      <section className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-xl">
        <HeroSlider images={heroImages}>
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg uppercase italic tracking-tighter">Bienvenido a Huaraz Explorer</h1>
            <p className="text-xl text-white font-bold tracking-wide drop-shadow-md uppercase italic">Descubre, Come, Disfruta</p>
          </div>
        </HeroSlider>
      </section>

      {/* 2. INTRO & FEATURES CARD */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-md border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-extrabold text-[#2A4D69] dark:text-white mb-2 uppercase tracking-tighter italic">Huaraz Explorer</h2>
        <p className="font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase text-xs tracking-[0.2em]">Plataforma de recomendaciones turísticas en Huaraz</p>
        
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium">
          <strong>Huaraz Explorer</strong> ayuda a viajeros nacionales e internacionales a descubrir los mejores negocios, experiencias y servicios turísticos de Huaraz y la Cordillera Blanca, combinando información local y tecnología.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">📍</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Mapa turístico interactivo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">⭐</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Negocios locales recomendados</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">📅</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Festividades y eventos</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">🤖</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Agente turístico IA 24/7</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">🎟️</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Cupones y beneficios</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2A4D69]/5 flex items-center justify-center text-[#2A4D69]">📰</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Newsletter & Token Huaraz</span>
          </div>
        </div>
      </section>

      {/* 3. TOKEN CARD - NEON GREEN & STATISTIC IMPROVED */}
      <section className="bg-[#0A0A0A] rounded-[2.5rem] p-8 shadow-2xl text-white overflow-hidden relative border border-[#39FF14]/20">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[80px]"></div>

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#39FF14] rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(57,255,20,0.4)]">HZ</div>
            <div>
              <h3 className="font-black text-2xl tracking-tighter italic">$HUARAZ <span className="text-[10px] bg-[#39FF14]/20 border border-[#39FF14]/40 px-2 py-0.5 rounded text-[#39FF14] ml-2 font-black uppercase">PUMP.FUN</span></h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <p className="text-[#39FF14] text-xs font-black uppercase tracking-widest">+842.15% <span className="text-gray-600 font-bold ml-1">Live</span></p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Market Cap</p>
            <p className="text-2xl font-black tracking-tighter italic text-[#39FF14]">$124.8K</p>
          </div>
        </div>
        
        {/* Gráfica Estadística Mejorada */}
        <div className="h-40 w-full mb-8 relative bg-gray-900/40 rounded-3xl border border-white/5 p-4 group">
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Price History</span>
            <span className="text-lg font-black text-white">$0.00142 <i className="fas fa-caret-up text-[#39FF14]"></i></span>
          </div>
          
          <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" viewBox="0 0 100 40" preserveAspectRatio="none">
            <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
            <path 
              d="M0,38 L10,35 L20,37 L30,25 L40,28 L50,15 L60,18 L70,8 L80,12 L90,5 L100,2" 
              fill="none" 
              stroke="#39FF14" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M0,38 L10,35 L20,37 L30,25 L40,28 L50,15 L60,18 L70,8 L80,12 L90,5 L100,2 V40 H0 Z" 
              fill="url(#neonGradient)" 
              opacity="0.3" 
            />
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#39FF14', stopOpacity:0.8}} />
                <stop offset="100%" style={{stopColor:'#39FF14', stopOpacity:0}} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="15" r="1.5" fill="#39FF14" className="animate-pulse" />
            <circle cx="100" cy="2" r="1.5" fill="#39FF14" className="animate-pulse" />
          </svg>

          <div className="absolute right-4 bottom-4 flex gap-4">
            <span className="text-[8px] font-black text-gray-600 uppercase">1H</span>
            <span className="text-[8px] font-black text-gray-600 uppercase">4H</span>
            <span className="text-[8px] font-black text-[#39FF14] uppercase border-b border-[#39FF14]">24H</span>
            <span className="text-[8px] font-black text-gray-600 uppercase">7D</span>
          </div>
        </div>

        <div className="mb-8 relative z-10">
           <div className="flex justify-between text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">
              <span>Bonding Curve Progress</span>
              <span className="text-[#39FF14]">94.2%</span>
           </div>
           <div className="w-full bg-gray-800/50 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div className="bg-[#39FF14] h-full w-[94.2%] rounded-full shadow-[0_0_15px_rgba(57,255,20,0.6)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>
           </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <a href="https://pump.fun/" target="_blank" rel="noreferrer" className="flex-grow bg-[#39FF14] text-black py-5 rounded-3xl font-black uppercase text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
            Comprar ahora <i className="fas fa-bolt"></i>
          </a>
          <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-95">
            <i className="fas fa-chart-line text-lg text-[#39FF14]"></i>
          </button>
        </div>
      </section>

      {/* 4. NEWSLETTER CARD - NEON GREEN & BLACK STYLE */}
      <section className="bg-[#0A0A0A] rounded-[2.5rem] p-10 text-white text-center shadow-2xl relative overflow-hidden border border-[#39FF14]/20">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[80px]"></div>
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <img src="https://www.transparenttextures.com/patterns/cubes.png" className="w-full h-full" alt="texture" />
        </div>

        <div className="w-16 h-16 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#39FF14]/30 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
           <i className="fas fa-envelope-open-text text-3xl text-[#39FF14]"></i>
        </div>

        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter italic relative z-10">
          ¡Mantente <span className="text-[#39FF14]">Conectado!</span>
        </h3>
        <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium max-w-sm mx-auto relative z-10">
          Suscríbete a nuestro boletín semanal y recibe noticias, historias de emprendimiento y guías de turismo exclusivas.
        </p>

        <Link to="/newsletter" className="bg-[#39FF14] hover:scale-[1.02] text-black px-10 py-5 rounded-[1.8rem] font-black uppercase text-xs flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(57,255,20,0.3)] mx-auto w-full max-w-xs transition-all active:scale-95 tracking-widest relative z-10">
           Suscribirme ahora <i className="fas fa-bolt"></i>
        </Link>

        {/* Decorative Grid Line */}
        <div className="mt-8 pt-4 border-t border-white/5">
           <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Huaraz Explorer Network • No Spam Policy</p>
        </div>
      </section>

      {/* 5. DIRECTORIO */}
      <section className="pt-6 space-y-8">
        <div className="relative group">
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2A4D69] transition-colors"></i>
          <input 
            type="text" 
            placeholder="Buscar lugares, comida, hoteles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-none rounded-[1.8rem] py-5 pl-14 pr-8 shadow-sm focus:ring-4 focus:ring-[#2A4D69]/5 dark:text-white font-semibold transition-all"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['all', BusinessCategory.RESTAURANT, BusinessCategory.HOTEL, BusinessCategory.TOURIST_SPOT, BusinessCategory.POLLERIA, BusinessCategory.CEVICHERIA].map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-7 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                ? 'bg-[#2A4D69] text-white border-[#2A4D69] shadow-lg shadow-[#2A4D69]/20' 
                : 'bg-white text-slate-400 border-slate-100 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'Todos' : t(`category.${cat}` as any)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-[#2A4D69] dark:text-white uppercase tracking-tighter italic">Explora Huaraz</h2>
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredBusinesses.length} sitios encontrados</span>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </section>
      
      {/* Botón Flotante de Mapa - Diseño refinado según referencia visual */}
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => navigate('/map')}
          className="w-16 h-16 bg-[#2A4D69] dark:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:scale-110 active:scale-95 transition-all group"
        >
          <i className="fas fa-map text-2xl group-hover:scale-110 transition-transform"></i>
        </button>
      </div>

      {/* Footer Info */}
      <div className="py-12 text-center">
         <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em] italic">Huaraz Explorer • Official Digital Guide 2025</p>
      </div>

    </div>
  );
};

export default HomePage;
