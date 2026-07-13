import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import StaticMap from '../components/StaticMap';
import { Link } from 'react-router-dom';
import { BusinessCategory } from '../types';

const MapPage: React.FC = () => {
  const { businesses, language } = useAppContext();
  const t = (es: string, en: string) => language === 'es' ? es : en;
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const filteredBusinesses = businesses.filter(b => 
    b.status === 'approved' && (activeCategory === 'all' || b.category === activeCategory)
  );

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-white overflow-hidden font-['Plus_Jakarta_Sans']">
        <div className="absolute inset-0 z-0">
             <StaticMap businesses={filteredBusinesses} activeCategory={activeCategory} />
        </div>

        {/* Floating Category Pills */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-x-auto no-scrollbar max-w-[95vw] px-4 pointer-events-auto">
             <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-[2rem] shadow-xl border border-slate-100 flex gap-1">
                 <FilterPill 
                    active={activeCategory === 'all'} 
                    onClick={() => setActiveCategory('all')} 
                    label={t("Todos", "All")} icon="fa-border-all" 
                 />
                 <FilterPill 
                    active={activeCategory === BusinessCategory.HOTEL} 
                    onClick={() => setActiveCategory(BusinessCategory.HOTEL)} 
                    label={t("Hoteles", "Hotels")} icon="fa-bed" 
                 />
                 <FilterPill 
                    active={activeCategory === BusinessCategory.RESTAURANT} 
                    onClick={() => setActiveCategory(BusinessCategory.RESTAURANT)} 
                    label={t("Comida", "Food")} icon="fa-utensils" 
                 />
                 <FilterPill 
                    active={activeCategory === BusinessCategory.TOURIST_SPOT} 
                    onClick={() => setActiveCategory(BusinessCategory.TOURIST_SPOT)} 
                    label={t("Turismo", "Tourism")} icon="fa-mountain-sun" 
                 />
             </div>
        </div>

        {/* Dynamic Legend */}
        <div className="absolute bottom-28 left-6 z-20 hidden md:block pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    {t("Leyenda de Mapa", "Map Legend")}
                </p>
                <div className="space-y-3">
                    <LegendItem color="bg-[#2A4D69]" label={t("Hoteles & Estancias", "Hotels & Stays")} />
                    <LegendItem color="bg-[#F58220]" label={t("Restaurantes & Cafés", "Restaurants & Cafes")} />
                    <LegendItem color="bg-emerald-600" label={t("Atractivos Naturales", "Natural Attractions")} />
                </div>
            </div>
        </div>

        {/* Coupons Floating Link */}
        <div className="absolute bottom-10 right-6 z-20">
            <Link to="/coupons" className="group flex items-center gap-5 bg-white p-3 pr-8 rounded-full shadow-2xl border border-slate-100 transition-all hover:scale-105 active:scale-95 pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-[#F58220] flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                    <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {t("Descuentos", "Discounts")}
                    </p>
                    <p className="text-sm font-black text-[#2A4D69] uppercase italic tracking-tighter leading-none">
                        {t("Ver Cupones", "View Coupons")}
                    </p>
                </div>
            </Link>
        </div>
    </div>
  );
};

const FilterPill: React.FC<{active: boolean, onClick: () => void, label: string, icon: string}> = ({active, onClick, label, icon}) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            active 
            ? 'bg-[#2A4D69] text-white shadow-lg' 
            : 'text-slate-400 hover:bg-slate-50'
        }`}
    >
        <i className={`fas ${icon}`}></i> {label}
    </button>
);

const LegendItem: React.FC<{color: string, label: string}> = ({color, label}) => (
    <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
);

export default MapPage;
