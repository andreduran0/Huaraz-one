
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // SEO Dinámico
    document.title = "Huaraz Explorer | Guía Turística Oficial de Ancash";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explora los mejores restaurantes, hoteles y trekkings en Huaraz. Tu guía definitiva para la Cordillera Blanca.");
    }
  }, []);

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return b.status === 'approved' && matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 px-4 space-y-6 pt-6 font-['Plus_Jakarta_Sans'] relative">
      
      {/* 1. HERO CARD DINÁMICO */}
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

      {/* 3. TOKEN CARD */}
      <section className="bg-[#0A0A0A] rounded-[2.5rem] p-8 shadow-2xl text-white overflow-hidden relative border border-[#39FF14]/20">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[80px]"></div>
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#39FF14] rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(57,255,20,0.4)]">HZ</div>
            <div>
              <h3 className="font-black text-2xl tracking-tighter italic">$HUARAZ</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <p className="text-[#39FF14] text-xs font-black uppercase tracking-widest">+842.15%</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Market Cap</p>
            <p className="text-2xl font-black tracking-tighter italic text-[#39FF14]">$124.8K</p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <a href="https://pump.fun/" target="_blank" rel="noreferrer" className="flex-grow bg-[#39FF14] text-black py-5 rounded-3xl font-black uppercase text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(57,255,20,0.3)]">
            Comprar ahora <i className="fas fa-bolt"></i>
          </a>
        </div>
      </section>

      {/* 4. DIRECTORIO */}
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

        <div className="grid grid-cols-1 gap-8">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </section>
      
      <div className="fixed bottom-28 right-6 z-50">
        <button 
          onClick={() => navigate('/map')}
          className="w-16 h-16 bg-[#2A4D69] dark:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:scale-110 active:scale-95 transition-all group"
        >
          <i className="fas fa-map text-2xl group-hover:scale-110 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
