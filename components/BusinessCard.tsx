
import React from 'react';
import { Link } from 'react-router-dom';
import { Business, AdLevel } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { messages } from '../i18n/locales';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations();
  // Fixed typing for translation keys
  const categoryKey = `category.${business.category}` as keyof typeof messages.es;
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

  if (isPremium) {
    return (
        <Link 
            to={`/business/${business.id}`} 
            className="flex flex-col md:flex-row items-stretch justify-start rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white dark:bg-gray-900 overflow-hidden transform transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)] group border-2 border-brand-orange/10 relative"
        >
          {/* Glowing accent for premium */}
          <div className="absolute top-0 left-0 w-2 h-full bg-brand-orange"></div>

          <div className="relative w-full md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
            <img 
              src={business.photos[0]} 
              alt={business.name}
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 flex h-8 items-center justify-center gap-x-2 rounded-full bg-brand-orange px-5 shadow-2xl z-10 border border-white/20">
                <i className="fas fa-star text-white text-[10px] animate-pulse"></i>
                <p className="text-white text-[10px] font-black leading-normal uppercase tracking-widest">{t('business.sponsored')}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="flex w-full flex-col items-stretch justify-center gap-4 p-10 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h4 className="text-3xl font-black leading-none tracking-tighter text-gray-900 dark:text-white uppercase italic">{business.name}</h4>
                    <p className="text-brand-orange dark:text-brand-orange text-xs font-black uppercase tracking-[0.2em]">
                        {t(categoryKey)} • {business.address}
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-5 py-2 rounded-2xl self-start md:self-center shadow-inner">
                    <i className="fas fa-star text-brand-accent text-sm"></i>
                    <p className="text-sm font-black text-gray-900 dark:text-white">4.9 Excepcional</p>
                </div>
            </div>
            
            <p className="text-gray-500 dark:text-gray-400 text-lg line-clamp-2 leading-relaxed font-medium mt-2">
                {business.description}
            </p>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-4">
                     {business.phone && (
                        <button 
                            onClick={(e) => handleAction(e, 'call')}
                            className="w-12 h-12 rounded-[1.2rem] bg-gray-50 dark:bg-gray-800 text-brand-dark-blue dark:text-brand-blue hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-90"
                            title={t('business.call')}
                        >
                            <i className="fas fa-phone text-lg"></i>
                        </button>
                     )}
                     {business.whatsapp && (
                        <button 
                            onClick={(e) => handleAction(e, 'whatsapp')}
                            className="w-12 h-12 rounded-[1.2rem] bg-gray-50 dark:bg-gray-800 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-90"
                            title={t('business.whatsapp')}
                        >
                            <i className="fab fa-whatsapp text-2xl"></i>
                        </button>
                     )}
                </div>
                
                <div className="flex items-center gap-3 bg-brand-dark-blue text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest group-hover:bg-brand-orange transition-all shadow-xl">
                    <span>Ver Experiencia Completa</span>
                    <i className="fas fa-chevron-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
          </div>
        </Link>
    );
  }

  // STANDARD CARD (GRID)
  return (
    <Link 
        to={`/business/${business.id}`} 
        className="flex flex-col items-stretch justify-start rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-900 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group border border-gray-100 dark:border-gray-800"
    >
      <div 
        className="relative w-full aspect-[16/10] overflow-hidden bg-gray-200 dark:bg-gray-800"
      >
        <img 
          src={business.photos[0]} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="flex w-full flex-col items-stretch justify-center gap-2 p-8">
        <div className="flex items-start justify-between">
            <h4 className="text-xl font-black leading-none tracking-tighter text-gray-900 dark:text-white truncate pr-2 uppercase italic">{business.name}</h4>
            <div className="flex items-center gap-1.5 shrink-0 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                <i className="fas fa-star text-brand-accent text-[10px]"></i>
                <p className="text-xs font-black text-gray-900 dark:text-white">4.8</p>
            </div>
        </div>
        
        <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest truncate">
            {t(categoryKey)} • {business.address}
        </p>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-3">
                 {business.phone && (
                    <button 
                        onClick={(e) => handleAction(e, 'call')}
                        className="w-10 h-10 rounded-[0.8rem] bg-gray-50 dark:bg-gray-800 text-brand-dark-blue dark:text-brand-blue hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                        <i className="fas fa-phone text-sm"></i>
                    </button>
                 )}
                 {business.whatsapp && (
                    <button 
                        onClick={(e) => handleAction(e, 'whatsapp')}
                        className="w-10 h-10 rounded-[0.8rem] bg-gray-50 dark:bg-gray-800 text-green-600 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                        <i className="fab fa-whatsapp text-lg"></i>
                    </button>
                 )}
            </div>
            
            <div className="flex items-center gap-2 text-brand-dark-blue dark:text-brand-blue font-black text-[10px] uppercase tracking-widest group-hover:text-brand-orange transition-colors">
                <span>Ver Detalles</span>
                <i className="fas fa-arrow-right text-[8px] transform group-hover:translate-x-1 transition-transform"></i>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
