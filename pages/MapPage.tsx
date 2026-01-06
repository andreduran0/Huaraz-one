
import React from 'react';
import { useAppContext } from '../context/AppContext';
import StaticMap from '../components/StaticMap';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';

const MapPage: React.FC = () => {
  const { businesses } = useAppContext();
  const t = useTranslations();
  const approvedBusinesses = businesses.filter(b => b.status === 'approved');

  // URL de imagen mejorada para el mapa de Huaraz
  const mapImageUrl = "https://i.imgur.com/G8W2FRt.jpeg";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Map Container - Full View Priority */}
        <div className="relative flex-grow w-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-b border-gray-300 dark:border-gray-700 shadow-inner z-0">
             <StaticMap
                imageUrl={mapImageUrl}
                businesses={approvedBusinesses}
            />
        </div>

        {/* List of POIs - Compact Bottom Panel */}
        <div className="h-40 shrink-0 overflow-y-auto bg-white dark:bg-gray-900 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-list text-brand-orange"></i>
                    {t('map.title')}
                </h2>
                <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold">
                    {approvedBusinesses.length} SITIOS
                </span>
            </div>
            
            <div className="flex flex-col">
                {approvedBusinesses.map(business => (
                    <Link 
                        key={business.id}
                        to={`/business/${business.id}`}
                        className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                            <i className={`fas text-lg ${
                                business.category === 'restaurant' ? 'fa-utensils' : 
                                business.category === 'hotel' ? 'fa-bed' : 'fa-map-marker-alt'
                            }`}></i>
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="text-sm font-bold text-text-light dark:text-text-dark truncate">{business.name}</h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{business.address}</p>
                        </div>
                        <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MapPage;
