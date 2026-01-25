
import React from 'react';
import { useAppContext } from '../context/AppContext';
import StaticMap from '../components/StaticMap';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';

const MapPage: React.FC = () => {
  const { businesses } = useAppContext();
  const t = useTranslations();
  
  // Filtramos la lista para mostrar exclusivamente a Cumbre (ID: '1')
  const allBusinesses = businesses.filter(b => b.id === '1');

  return (
    <div className="relative h-[calc(100vh-120px)] w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Map Container - Full Screen */}
        <div className="absolute inset-0 z-0">
             <StaticMap businesses={allBusinesses} />
        </div>

        {/* Floating Stats Badge */}
        <div className="absolute top-24 left-6 z-10 pointer-events-none">
            <div className="bg-brand-dark-blue/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 text-white">
                <div className="flex -space-x-3">
                    {allBusinesses.slice(0, 3).map((b, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-dark-blue overflow-hidden shadow-lg">
                            <img src={b.photos[0]} className="w-full h-full object-cover" alt="avatar" />
                        </div>
                    ))}
                </div>
                <div>
                    <h2 className="font-black text-[10px] uppercase tracking-widest text-brand-orange">{t('map.badge')}</h2>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                        {allBusinesses.length} {t('map.available')}
                    </p>
                </div>
            </div>
        </div>

        {/* Directory Search / Floating Button (Optional) */}
        <div className="absolute bottom-10 left-10 z-10">
            <Link to="/coupons" className="group flex items-center gap-4 bg-white dark:bg-gray-900 p-3 pr-8 rounded-full shadow-2xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-105 active:scale-95">
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-lg animate-pulse">
                    <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Ofertas cerca</p>
                    <p className="text-xs font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Ver Cupones</p>
                </div>
            </Link>
        </div>
    </div>
  );
};

export default MapPage;
