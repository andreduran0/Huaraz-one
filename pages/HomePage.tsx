
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import { BusinessCategory } from '../types';

const HomePage: React.FC = () => {
  const { businesses, heroImages, blogPosts } = useAppContext();
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return b.status === 'approved' && matchesSearch && matchesCategory;
  });
  
  filteredBusinesses.sort((a, b) => (a.adLevel === 'premium' ? -1 : 1));

  const categories = [
    { id: 'all', label: 'Todos', icon: null },
    { id: BusinessCategory.RESTAURANT, label: 'Restaurantes', icon: 'fa-utensils' },
    { id: BusinessCategory.HOTEL, label: 'Hoteles', icon: 'fa-bed' },
    { id: BusinessCategory.TOURIST_SPOT, label: 'Puntos Turísticos', icon: 'fa-map-marked-alt' },
    { id: BusinessCategory.POLLERIA, label: 'Pollerías', icon: 'fa-drumstick-bite' },
    { id: BusinessCategory.CEVICHERIA, label: 'Cevicherías', icon: 'fa-fish' },
  ];

  const features = [
    { icon: 'fa-map-marker-alt', color: 'text-red-500', label: 'Mapa turístico interactivo' },
    { icon: 'fa-star', color: 'text-yellow-500', label: 'Negocios locales recomendados' },
    { icon: 'fa-calendar-alt', color: 'text-red-600', label: 'Festividades y eventos' },
    { icon: 'fa-robot', color: 'text-gray-500', label: 'Agente turístico IA 24/7' },
    { icon: 'fa-ticket-alt', color: 'text-orange-500', label: 'Cupones y beneficios' },
    { icon: 'fa-envelope', color: 'text-gray-400', label: 'Newsletter & Token Huaraz' },
  ];

  return (
    <div className="space-y-0 bg-white dark:bg-gray-900 min-h-screen pb-10">
      
      {/* 1. MOVING PHOTOS HEADER */}
      <div className="px-4 pt-4">
        <div className="h-64 md:h-[450px] w-full relative">
            <HeroSlider images={heroImages}>
                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-white text-3xl md:text-6xl font-black drop-shadow-2xl mb-2 tracking-tight">
                        Bienvenido a Huaraz Explorer
                    </h2>
                    <p className="text-white text-lg md:text-2xl font-bold drop-shadow-md">
                        Descubre, Come, Disfruta
                    </p>
                </div>
            </HeroSlider>
        </div>
      </div>

      {/* 2. DESCRIPTION SECTION */}
      <div className="bg-white dark:bg-gray-800 px-6 py-10 md:py-16">
        <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-[#2A4D69] dark:text-white tracking-tight">
                    Huaraz Explorer
                </h1>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    Plataforma de recomendaciones turísticas en Huaraz
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
                    <span className="font-bold">Huaraz Explorer</span> ayuda a viajeros nacionales e internacionales a descubrir los mejores negocios, experiencias y servicios turísticos de Huaraz y la Cordillera Blanca, combinando información local y tecnología.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 pt-6">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <i className={`fas ${f.icon} ${f.color} w-5 text-center`}></i>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* 3. TOKEN WIDGET */}
      <div className="px-4 py-8">
        <div className="relative bg-[#0d1117] rounded-3xl p-6 shadow-2xl overflow-hidden border border-white/5 max-w-5xl mx-auto">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#8dc06d] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(141,192,109,0.3)]">
                            <span className="text-black font-black text-xl">HZ</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-black text-xl">$HUARAZ</h3>
                                <span className="bg-[#20252e] text-[#8dc06d] text-[10px] px-2 py-0.5 rounded font-bold">PUMP.FUN</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#8dc06d] font-bold text-sm">
                                <i className="fas fa-caret-up"></i> +420.69% <span className="text-gray-500 text-[10px] ml-1">24h</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">MARKET CAP</div>
                        <div className="text-white font-black text-xl">$42.5K</div>
                    </div>
                </div>
                <div className="relative h-28 w-full bg-[#161b22]/50 rounded-xl overflow-hidden border border-white/5">
                    <div className="absolute top-2 right-2 bg-[#8dc06d] text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg z-20">
                        $0.00420
                    </div>
                    <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <path d="M0,80 L50,85 L100,70 L150,75 L200,60 L250,55 L300,45 L350,50 L400,20 L400,100 L0,100 Z" fill="url(#grad)" opacity="0.3" />
                        <path d="M0,80 L50,85 L100,70 L150,75 L200,60 L250,55 L300,45 L350,50 L400,20" fill="none" stroke="#8dc06d" strokeWidth="2" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#8dc06d', stopOpacity: 0.6 }} />
                                <stop offset="100%" style={{ stopColor: '#8dc06d', stopOpacity: 0 }} />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                        <span className="text-gray-500">BONDING CURVE</span>
                        <span className="text-white">82%</span>
                    </div>
                    <div className="h-2 w-full bg-[#161b22] rounded-full overflow-hidden">
                        <div className="h-full bg-[#8dc06d] w-[82%] shadow-[0_0_15px_#8dc06d]"></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <a href="https://pump.fun/" target="_blank" rel="noreferrer" className="flex-1 bg-[#8dc06d] hover:bg-[#a6d98c] text-black font-black py-4 px-6 rounded-2xl text-center transition-all transform active:scale-95 shadow-xl flex items-center justify-center gap-2 text-sm uppercase">
                        COMPRAR AHORA <i className="fas fa-rocket"></i>
                    </a>
                </div>
            </div>
        </div>
      </div>

      {/* 4. LEAD MANAGEMENT SECTION (Exact screenshot style) */}
      <div className="px-4 py-4">
        <div className="bg-[#2A4D69] rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 text-white border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            <div className="w-16 h-16 rounded-full bg-[#13ec5b]/20 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#13ec5b] flex items-center justify-center text-[#2A4D69]">
                    <i className="fas fa-envelope text-lg"></i>
                </div>
            </div>
            <div className="flex-grow text-center md:text-left space-y-2">
                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">¡Mantente Conectado con Huaraz!</h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                    Suscríbete a nuestro boletín semanal y recibe noticias, historias de emprendimiento, guías de turismo y las últimas festividades directo en tu correo.
                </p>
            </div>
            <Link 
                to="/newsletter" 
                className="bg-[#13ec5b] hover:bg-[#10d652] text-brand-dark-blue font-black px-8 py-4 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center gap-2 whitespace-nowrap text-sm"
            >
                Suscribirme ahora <i className="fas fa-arrow-right text-xs"></i>
            </Link>
        </div>
      </div>

      {/* 5. SEARCH BAR & FILTERS (RESTAURADO) */}
      <div className="px-4 py-6 max-w-5xl mx-auto space-y-6">
        {/* Pill Search Bar */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400 group-focus-within:text-[#2A4D69] transition-colors"></i>
            </div>
            <input 
                type="text" 
                placeholder="Buscar lugares, comida, hoteles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full py-4 pl-14 pr-6 text-gray-700 dark:text-white focus:outline-none focus:border-[#2A4D69] focus:ring-4 focus:ring-[#2A4D69]/5 shadow-sm transition-all text-sm md:text-base"
            />
        </div>

        {/* Category Chips Scrollable */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all transform active:scale-95 shadow-sm ${
                        selectedCategory === cat.id 
                        ? 'bg-[#2A4D69] text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                >
                    {cat.icon && <i className={`fas ${cat.icon} text-xs ${selectedCategory === cat.id ? 'text-white' : 'text-gray-400'}`}></i>}
                    {cat.label}
                </button>
            ))}
        </div>
      </div>

      {/* 6. BUSINESS SECTION TITLE & COUNT */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-end pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
                <h2 className="text-2xl font-black text-[#2A4D69] dark:text-white tracking-tighter">Explora Huaraz</h2>
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                {filteredBusinesses.length} sitios
            </div>
        </div>
      </div>

      {/* 7. BUSINESS RESULTS */}
      <div className="container mx-auto px-4 pb-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map(business => (
                    <BusinessCard key={business.id} business={business} />
                ))
            ) : (
                <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                    <i className="fas fa-search text-4xl mb-4 opacity-20"></i>
                    <p>No se encontraron negocios en esta categoría.</p>
                </div>
            )}
        </div>
      </div>

      {/* 8. BLOG SECTION */}
      <div className="px-4 py-8 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-2xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Guías y Relatos</h2>
                    <p className="text-xs text-gray-500 font-bold">APRENDE TODO SOBRE HUARAZ</p>
                </div>
                <Link to="/blog" className="text-brand-blue text-xs font-black hover:underline uppercase tracking-widest">
                    Ver todo <i className="fas fa-external-link-alt ml-1"></i>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.slice(0, 2).map((post) => (
                    <Link 
                        key={post.id} 
                        to={`/blog/${post.id}`}
                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 dark:border-gray-700"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-brand-blue transition-colors">
                                {post.title}
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </div>

      {/* Floating Map Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <Link to="/map" className="flex items-center justify-center rounded-2xl h-16 w-16 bg-[#2A4D69] text-white shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-gray-900">
            <i className="fas fa-map-marked-alt text-2xl"></i>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
