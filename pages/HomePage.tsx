
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import HeroSlider from '../components/HeroSlider';
import { useTranslations } from '../hooks/useTranslations';
import { BusinessCategory } from '../types';
import { Link } from 'react-router-dom';

const CategoryChip: React.FC<{
    label: string;
    icon?: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium ${
            isActive 
            ? 'bg-brand-dark-blue text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
    >
        {icon && <i className={`fas ${icon} text-sm`}></i>}
        {label}
    </button>
);

const HomePage: React.FC = () => {
  const { businesses } = useAppContext();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'ALL'>('ALL');
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const INITIAL_DISPLAY_COUNT = 5;

  const categories = [
    { id: 'ALL', label: 'Todos', icon: undefined },
    { id: BusinessCategory.RESTAURANT, label: t('category.restaurant'), icon: 'fa-utensils' },
    { id: 'HOTEL', label: t('category.hotel'), icon: 'fa-bed' },
    { id: BusinessCategory.TOURIST_SPOT, label: t('category.tourist_spot'), icon: 'fa-hiking' },
    { id: BusinessCategory.POLLERIA, label: t('category.polleria'), icon: 'fa-drumstick-bite' },
    { id: BusinessCategory.CEVICHERIA, label: t('category.cevicheria'), icon: 'fa-fish' },
  ];

  // General Filter Logic
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;
    const isApproved = b.status === 'approved';
    return matchesSearch && matchesCategory && isApproved;
  });

  // Sort: Premium first
  filteredBusinesses.sort((a, b) => {
     if (a.adLevel === 'premium' && b.adLevel !== 'premium') return -1;
     if (a.adLevel !== 'premium' && b.adLevel === 'premium') return 1;
     return 0;
  });

  const displayedBusinesses = isAllExpanded 
    ? filteredBusinesses 
    : filteredBusinesses.slice(0, INITIAL_DISPLAY_COUNT);

  const heroImages = [
    "https://i.ytimg.com/vi/hpLKsB4uUNY/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGC0gEyh_MA8=&rs=AOn4CLD5oVIWpkNFGgfYq-brbuD9LYjU8g", 
    "https://i.imgur.com/cnfE46t.jpeg", 
    "https://i.imgur.com/6OmpJf3.jpeg", 
    "https://bananomeridiano.com/wp-content/uploads/2022/03/huaraz-peru-1.jpg",
    "https://pamelatours.com/wp-content/uploads/2019/10/laguna69.jpg",
    "https://www.antamina.com/wp-content/uploads/2020/02/carnaval-huaraz-rompecalle-9.jpg"
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 text-text-light dark:text-text-dark">
      
        {/* Hero Section with Slider */}
        <div className="h-56 md:h-72 w-full relative rounded-xl overflow-hidden shadow-md group">
            <HeroSlider images={heroImages}>
                 <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center p-4 z-20">
                    <h2 className="text-white text-3xl md:text-4xl font-extrabold shadow-black drop-shadow-lg mb-2 tracking-tight">{t('home.welcome')}</h2>
                    <p className="text-white text-lg font-medium shadow-black drop-shadow-md">{t('home.discover')}</p>
                 </div>
            </HeroSlider>
        </div>

        {/* Pump.Fun Token Section */}
        <div className="relative bg-[#1b1d22] rounded-xl p-4 shadow-xl my-6 overflow-hidden border-2 border-[#8dc06d]/20 group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'linear-gradient(#8dc06d 1px, transparent 1px), linear-gradient(90deg, #8dc06d 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }}></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-[#8dc06d] rounded-lg flex items-center justify-center shadow-[0_0_15px_#8dc06d]">
                            <span className="text-black font-black text-xl">HZ</span>
                         </div>
                         <div>
                             <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                                 $HUARAZ 
                                 <span className="bg-[#2a2d35] text-[#8dc06d] text-[10px] px-1.5 py-0.5 rounded border border-[#8dc06d]/30 font-mono">
                                     PUMP.FUN
                                 </span>
                             </h3>
                             <p className="text-[#8dc06d] text-sm font-mono flex items-center gap-1 animate-pulse">
                                 <i className="fas fa-caret-up"></i> +420.69% <span className="text-gray-500 text-xs ml-1">24h</span>
                             </p>
                         </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 font-mono mb-1">MARKET CAP</div>
                        <div className="text-white font-bold font-mono text-lg">$42.5K</div>
                    </div>
                </div>

                {/* Mock Chart Visualization */}
                <div className="h-20 w-full bg-black/20 rounded-lg mb-4 relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full p-1" preserveAspectRatio="none" viewBox="0 0 100 50">
                        <defs>
                            <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#8dc06d" stopOpacity="0.5"/>
                                <stop offset="100%" stopColor="#8dc06d" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path d="M0,50 L5,45 L10,48 L20,35 L30,40 L40,20 L50,25 L60,15 L70,22 L80,10 L90,15 L100,2 L100,50 Z" fill="url(#chartGrad)" />
                        <path d="M0,50 L5,45 L10,48 L20,35 L30,40 L40,20 L50,25 L60,15 L70,22 L80,10 L90,15 L100,2" fill="none" stroke="#8dc06d" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                    
                    {/* Floating Price Tag */}
                    <div className="absolute top-2 right-2 bg-[#8dc06d] text-black text-xs font-bold px-2 py-1 rounded shadow-lg">
                        $0.00420
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1">
                        <span>BONDING CURVE</span>
                        <span>82%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#8dc06d] to-green-400 w-[82%] relative">
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <a 
                        href="https://pump.fun/board" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-[#8dc06d] hover:bg-[#7ab05a] text-[#1b1d22] font-black py-3 rounded-lg text-center transition-all transform active:scale-95 shadow-[0_0_20px_rgba(141,192,109,0.3)] flex items-center justify-center gap-2"
                    >
                        <span>COMPRAR AHORA</span>
                        <i className="fas fa-rocket"></i>
                    </a>
                    <button className="px-4 bg-[#2a2d35] hover:bg-[#343842] text-white rounded-lg transition-colors border border-gray-700">
                        <i className="fas fa-chart-bar"></i>
                    </button>
                </div>
            </div>
        </div>

        {/* Newsletter CTA */}
        <div className="relative bg-brand-dark-blue rounded-2xl p-6 text-white overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-brand-green/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6">
                <div className="w-12 h-12 shrink-0 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope-open-text text-xl text-brand-green"></i>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{t('home.newsletter.title')}</h3>
                    <p className="text-gray-200 text-sm max-w-md">
                        {t('home.newsletter.description')}
                    </p>
                </div>
                <Link 
                    to="/newsletter" 
                    className="bg-brand-green text-brand-dark-blue font-bold py-2 px-6 rounded-full hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm whitespace-nowrap"
                >
                    <span>{t('home.newsletter.button')}</span>
                    <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
            </div>
            <input 
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-dark-blue sm:text-sm shadow-sm"
                placeholder="Buscar lugares, comida, hoteles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 pb-2">
            {categories.map(cat => (
                <CategoryChip 
                    key={cat.id}
                    label={cat.label}
                    icon={cat.icon}
                    isActive={selectedCategory === cat.id}
                    onClick={() => {
                        setSelectedCategory(cat.id as any);
                        setIsAllExpanded(false); // Reset expansion on category change
                    }}
                />
            ))}
        </div>

        {/* All Results */}
        <div className="space-y-4 pb-12">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-dark-blue dark:text-brand-green">
                    {selectedCategory === 'ALL' ? 'Explora Huaraz' : 'Resultados'}
                </h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    {filteredBusinesses.length} sitios
                </span>
             </div>
             
            {filteredBusinesses.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-6">
                        {displayedBusinesses.map(business => (
                            <div key={business.id} className="animate-fadeIn">
                                <BusinessCard business={business} />
                            </div>
                        ))}
                    </div>
                    
                    {filteredBusinesses.length > INITIAL_DISPLAY_COUNT && (
                         <button 
                            onClick={() => setIsAllExpanded(!isAllExpanded)}
                            className="w-full py-3 mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-brand-dark-blue dark:text-white font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isAllExpanded ? (
                                <>
                                    {t('home.showLess')} <i className="fas fa-chevron-up"></i>
                                </>
                            ) : (
                                <>
                                    {t('home.showMore')} ({filteredBusinesses.length - INITIAL_DISPLAY_COUNT} más) <i className="fas fa-chevron-down"></i>
                                </>
                            )}
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No encontramos resultados</h3>
                    <p className="text-sm text-gray-500">Intenta con otra categoría o término de búsqueda.</p>
                </div>
            )}
        </div>

      {/* FAB */}
      <div className="fixed bottom-20 right-6 z-30">
        <Link to="/map" className="flex items-center justify-center rounded-full h-14 w-14 bg-brand-dark-blue text-white shadow-lg hover:bg-blue-800 transition-colors hover:rotate-3">
            <i className="fas fa-map text-2xl"></i>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
