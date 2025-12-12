import React from 'react';
import { Link } from 'react-router-dom';
import { Business, AdLevel } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations();
  const categoryKey = `category.${business.category}` as keyof ReturnType<typeof useTranslations>;
  const isPremium = business.adLevel === AdLevel.PREMIUM;

  const handleAction = (e: React.MouseEvent, action: 'call' | 'whatsapp') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'call' && business.phone) {
        window.location.href = `tel:${business.phone}`;
    } else if (action === 'whatsapp' && business.whatsapp) {
        window.open(`https://wa.me/${business.whatsapp}`, '_blank');
    }
  };

  return (
    <Link 
        to={`/business/${business.id}`} 
        className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-800 overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] group"
    >
      <div 
        className="relative w-full bg-center bg-no-repeat aspect-[16/8] bg-cover bg-gray-200 dark:bg-gray-700" 
        style={{ backgroundImage: `url('${business.photos[0]}')` }}
      >
        {isPremium && (
            <div className="absolute top-2 left-2 flex h-6 items-center justify-center gap-x-2 rounded-full bg-brand-accent/90 px-3 shadow-sm z-10">
                <p className="text-black text-xs font-bold leading-normal uppercase">{t('business.sponsored')}</p>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
      </div>
      
      <div className="flex w-full flex-col items-stretch justify-center gap-2 p-4">
        <div className="flex items-start justify-between">
            <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white truncate pr-2">{business.name}</p>
            {/* Mock Rating for design fidelity */}
            <div className="flex items-center gap-1 shrink-0">
                <i className="fas fa-star text-brand-accent text-xs"></i>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">4.8</p>
            </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal truncate">
            {t(categoryKey)} • {business.address}
        </p>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex gap-2">
                 {business.phone && (
                    <button 
                        onClick={(e) => handleAction(e, 'call')}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-brand-dark-blue dark:text-brand-blue hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center"
                        title={t('business.call')}
                    >
                        <i className="fas fa-phone text-sm"></i>
                    </button>
                 )}
                 {business.whatsapp && (
                    <button 
                        onClick={(e) => handleAction(e, 'whatsapp')}
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-green-600 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center"
                        title={t('business.whatsapp')}
                    >
                        <i className="fab fa-whatsapp text-lg"></i>
                    </button>
                 )}
            </div>
            
            <div className="flex items-center gap-1 text-brand-dark-blue dark:text-brand-blue font-semibold text-sm group-hover:underline">
                <span>Ver Detalles</span>
                <i className="fas fa-arrow-right text-xs"></i>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;