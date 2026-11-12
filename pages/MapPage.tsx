import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import StaticMap from '../components/StaticMap';
import InteractiveGoogleMap from '../components/InteractiveGoogleMap';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';
import { BusinessCategory } from '../types';

const MapPage: React.FC = () => {
  const { businesses } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Estado para alternar entre el mapa de Google y el mapa ilustrado
  const [mapMode, setMapMode] = useState<'google' | 'static'>('google');
  
  const filteredBusinesses = businesses.filter(b => 
    b.status === 'approved' && (activeCategory === 'all' || b.category === activeCategory)
  );

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-white overflow-hidden font-['Plus_Jakarta_Sans']">
        {/* Renderizado condicional del mapa sin tocar la capa UI */}
        <div className="absolute inset-0 z-0">
             {mapMode === 'google' ? (
               <InteractiveGoogleMap businesses={filteredBusinesses} activeCategory={activeCategory} />
             ) : (
               <StaticMap businesses={filteredBusinesses} activeCategory={activeCategory} />
             )}
        </div>

        {/* Barra superior con selector de modo y filtros por categoría */}
        <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none gap-2">
          {/* Switcher de Vista */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-full shadow-xl border border-slate-100 flex items-center gap-1 pointer-events-auto shrink-0">
            <button
              onClick={() => setMapMode('google')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${
                mapMode === 'google' ? 'bg-[#2A4D69] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <i className="fas fa-map-location-dot"></i> Google
            </button>
            <button
              onClick={() => setMapMode('static')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${
                mapMode === 'static' ? 'bg-[#2A4D69] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <i className="fas fa-image"></i> Ilustrado
            </button>
          </div>

          {/* Píldoras de Filtro intactas */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-[2rem] shadow-xl border border-slate-100 max-w-[calc(100vw-180px)]">
             <FilterPill active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} label="Todos" icon="fa-border-all" />
             <FilterPill active={activeCategory === BusinessCategory.HOTEL} onClick={() => setActiveCategory(BusinessCategory.HOTEL)} label="Hoteles" icon="fa-bed" />
             <FilterPill active={activeCategory === BusinessCategory.RESTAURANT} onClick={() => setActiveCategory(BusinessCategory.RESTAURANT)} label="Comida" icon="fa-utensils" />
             <FilterPill active={activeCategory === BusinessCategory.TOURIST_SPOT} onClick={() => setActiveCategory(BusinessCategory.TOURIST_SPOT)} label="Turismo" icon="fa-mountain-sun" />
          </div>
        </div>

        {/* Leyenda y Botón de Cupones permanecen 100% operativos */}
        ...
    </div>
  );
};
