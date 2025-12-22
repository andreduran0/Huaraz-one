
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
    <div className="flex flex-col h-[calc(100vh-120px)] w-full bg-background-light dark:bg-background-dark">
        {/* Map Container - Aumentado a 65vh para mejor visibilidad */}
        <div className="relative h-[65vh] shrink-0 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-b border-gray-300 dark:border-gray-700 shadow-md z-0">
             <StaticMap
                imageUrl={mapImageUrl}
                businesses={approvedBusinesses}
            />
        </div>

        {/* List of POIs */}
        <div className="flex-grow overflow-y-auto p-4 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark flex items-center gap-2">
                <i className="fas fa-map-marked-alt text-brand-orange"></i>
                {t('map.title')}
            </h2>
            <div className="flex flex-col gap-3 pb-20">
                {approvedBusinesses.map(business => (
                    <Link 
                        key={business.id}
                        to={`/business/${business.id}`}
                        className="flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-gray-800 p-3 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                            <i className={`fas text-xl ${
                                business.category === 'restaurant' ? 'fa-utensils' : 
                                business.category === 'hotel' ? 'fa-bed' : 'fa-map-marker-alt'
                            }`}></i>
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-text-light dark:text-text-dark truncate">{business.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{business.address}</p>
                        </div>
                        <i className="fas fa-chevron-right text-gray-400"></i>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MapPage;
