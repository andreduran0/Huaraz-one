
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import { BusinessCategory, AdLevel } from '../types';

const FeatureItem: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
  <div className="flex items-center gap-3 group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${color} shadow-lg transform group-hover:rotate-12 transition-transform`}>
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">{label}</span>
  </div>
);

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
  
  const sponsored = filteredBusinesses.filter(b => b.adLevel === AdLevel.PREMIUM);
  const others = filteredBusinesses.filter(b => b.adLevel !== AdLevel.PREMIUM);

  const latestPosts = blogPosts.slice(0, 3);

  const categories = [
    { id: 'all', label: 'Todos', icon: 'fa-th-large' },
    { id: BusinessCategory.RESTAURANT, label: t('category.restaurant'), icon: 'fa-utensils' },
    { id: BusinessCategory.HOTEL, label: t('category.hotel'), icon: 'fa-bed' },
    { id: BusinessCategory.TOURIST_SPOT, label: t('category.tourist_spot'), icon: 'fa-map-marked-alt' },
    { id: BusinessCategory.POLLERIA, label: t('category.polleria'), icon: 'fa-drumstick-bite' },
    { id: BusinessCategory.CEVICHERIA, label: t('category.cevicheria'), icon: 'fa-fish' },
  ];

  const highlights = [
    { icon: 'fa-map-location-dot', label: 'Mapa Interactivo', color: 'bg-brand-blue' },
    { icon: 'fa-ticket', label: 'Cuponera', color: 'bg-brand-orange' },
    { icon: 'fa-robot', label: 'Asistente IA', color: 'bg-brand-dark-blue' },
    { icon: 'fa-star', label: 'Negocios Patrocinados', color: 'bg-yellow-500' },
    { icon: 'fa-coins', label: 'Token & Newsletter', color: 'bg-brand-green' },
    { icon: 'fa-calendar-days', label: 'Calendario Festivo', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
        <HeroSlider images={heroImages}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-gray-50 dark:to-gray-950 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl animate-fadeIn">
              <h1 className="text-white text-5xl md:text-8xl font-black drop-shadow-2xl mb-6 tracking-tighter uppercase italic leading-none">
                Huaraz <span className="text-brand-orange">Explorer</span>
              </h1>
              <p className="text-white text-lg md:text-2xl font-bold drop-shadow-lg opacity-95 mb-10 max-w-2xl mx-auto leading-tight">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <Link to="/map" className="bg-brand-orange hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  {t('home.hero.cta.map')} <i className="fas fa-map-location-dot"></i>
                </Link>
                <Link to="/chat" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black uppercase text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  {t('home.hero.cta.ai')} <i className="fas fa-comment-dots"></i>
                </Link>
              </div>
            </div>
          </div>
        </HeroSlider>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em]">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                {t('home.value.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-dark-blue dark:text-white leading-[1.1] uppercase tracking-tighter">
                {t('home.value.title')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium">
                {t('home.value.description')}
              </p>
              
              {/* Feature Grid Addition */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  {highlights.map((h, i) => (
                      <FeatureItem key={i} icon={h.icon} label={h.label} color={h.color} />
                  ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-6">
               <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:rotate-0 rotate-2 transition-transform duration-500 border-4 border-white dark:border-gray-800">
                  <img src="https://i.imgur.com/cnfE46t.jpeg" className="w-full h-full object-cover" alt="Huaraz Experience" />
               </div>
               <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:rotate-0 -rotate-2 mt-12 transition-transform duration-500 border-4 border-white dark:border-gray-800">
                  <img src="https://pamelatours.com/wp-content/uploads/2019/10/laguna69.jpg" className="w-full h-full object-cover" alt="Cordillera Blanca" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOKEN WIDGET */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative group overflow-hidden rounded-[3.5rem] bg-[#0d1117] p-10 md:p-16 shadow-2xl border border-white/5">
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-5">
                        <div className="w-20 h-20 bg-brand-green rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(19,236,91,0.5)] transform hover:rotate-12 transition-transform">
                            <span className="text-black font-black text-3xl">HZ</span>
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-black text-4xl tracking-tighter uppercase italic">{t('home.token.title')}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="bg-brand-green/20 text-brand-green text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-brand-green/30">Solana Ecosystem</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xl max-w-xl leading-relaxed">
                        {t('home.token.description')}
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                        <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-3xl backdrop-blur-md">
                            <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('home.token.marketcap')}</div>
                            <div className="text-white font-black text-2xl">$42,500.00</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-8 py-5 rounded-3xl backdrop-blur-md">
                            <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('home.token.community')}</div>
                            <div className="text-white font-black text-2xl">1,240+ HZ</div>
                        </div>
                    </div>
                    <a href="https://pump.fun/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 bg-brand-green hover:bg-brand-green/90 text-black px-12 py-6 rounded-[2rem] font-black uppercase text-sm transition-all shadow-2xl hover:scale-105 active:scale-95 group">
                        {t('home.token.invest')} <i className="fas fa-rocket group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                    </a>
                </div>
            </div>
        </div>
      </section>

      {/* 4. NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative bg-brand-dark-blue rounded-[3.5rem] p-10 md:p-16 shadow-2xl overflow-hidden border border-white/10 group">
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center shrink-0 shadow-2xl rotate-6 transition-transform group-hover:rotate-0">
                    <i className="fas fa-envelope-open-text text-brand-dark-blue text-4xl"></i>
                </div>
                <div className="flex-grow space-y-3">
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase italic">
                        {t('home.newsletter.title')}
                    </h3>
                    <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0">
                        {t('home.newsletter.description')}
                    </p>
                </div>
                <Link to="/newsletter" className="group bg-white hover:bg-brand-orange hover:text-white text-brand-dark-blue font-black px-12 py-6 rounded-[2rem] shadow-2xl transition-all transform active:scale-95 flex items-center gap-3 whitespace-nowrap text-lg uppercase tracking-widest">
                    {t('home.newsletter.button')} <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </div>
        </div>
      </section>

      {/* 5. SEARCH & DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 py-20 pb-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Guía de Negocios</h2>
          <p className="text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.2em] text-[11px]">{t('home.discovery.subtitle')}</p>
        </div>
        <div className="max-w-5xl mx-auto space-y-10">
          <input 
              type="text" 
              placeholder={t('home.discovery.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[2.5rem] py-8 px-10 text-gray-800 dark:text-white focus:outline-none focus:border-brand-orange shadow-lg transition-all text-xl font-bold"
          />
          <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
              {categories.map((cat) => (
                  <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-4 px-8 py-4.5 rounded-[1.5rem] whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
                          selectedCategory === cat.id ? 'bg-brand-dark-blue text-white shadow-xl' : 'bg-white dark:bg-gray-900 text-gray-500'
                      }`}
                  >
                      {cat.label}
                  </button>
              ))}
          </div>
        </div>
      </section>

      {/* 6. BUSINESS CARDS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {sponsored.length > 0 && (
            <div className="mb-20">
                <h3 className="text-3xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter italic mb-8">{t('home.premium.title')}</h3>
                <div className="flex flex-col gap-10">
                    {sponsored.map(business => <BusinessCard key={business.id} business={business} />)}
                </div>
            </div>
        )}
        {others.length > 0 && (
            <div>
                <h3 className="text-3xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter mb-8">{t('home.others.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {others.map(business => <BusinessCard key={business.id} business={business} />)}
                </div>
            </div>
        )}
      </section>

      {/* 7. BLOG SECTION (SEO OPTIMIZED) */}
      <section className="max-w-7xl mx-auto px-4 py-24 bg-white dark:bg-gray-900 rounded-[4rem] shadow-inner mt-20 mb-20 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 px-6">
            <div className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                    <i className="fas fa-feather-pointed"></i> {t('home.blog.subtitle')}
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter italic leading-none">
                  Turismo & <span className="text-brand-orange">Relatos</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-xl">
                  Descubre guías expertas, historias locales y los mejores consejos para tu viaje a la Cordillera Blanca.
                </p>
            </div>
            <Link to="/blog" className="group bg-brand-dark-blue hover:bg-brand-blue text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all shadow-2xl active:scale-95 transform hover:-translate-y-1">
                {t('home.blog.viewAll')} <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
            {latestPosts.map((post) => (
                <Link 
                    key={post.id} 
                    to={`/blog/${post.id}`}
                    className="group relative flex flex-col h-[550px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <img 
                            src={post.image} 
                            alt={`Guía Huaraz: ${post.title}`} 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
                         <span className="bg-brand-orange text-white text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/20">
                            {post.category}
                         </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative mt-auto p-12 space-y-5 z-20">
                        <div className="flex items-center gap-4 text-[10px] text-white/70 font-black uppercase tracking-widest">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                              <i className="far fa-calendar-alt text-brand-orange"></i>
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                              <i className="far fa-clock text-brand-blue"></i>
                              <span>{post.readTime}</span>
                            </div>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.1] uppercase italic tracking-tighter group-hover:text-brand-orange transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-white/60 text-sm line-clamp-2 font-medium leading-relaxed group-hover:text-white/90 transition-colors">
                          {post.excerpt}
                        </p>
                        <div className="pt-4 flex items-center gap-3 text-brand-orange font-black text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          Leer guía <i className="fas fa-arrow-right text-[8px]"></i>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
