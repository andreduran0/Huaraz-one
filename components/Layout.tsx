
import React, { ReactNode, useState } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useAppContext } from '../context/AppContext';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const t = useTranslations();
    
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 text-brand-dark-blue dark:text-white">
                        <div className="flex items-center gap-2">
                            <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-8 h-8 rounded-lg" alt="Logo" />
                            <span className="font-bold text-lg">Huaraz Explorer</span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <nav className="space-y-1 flex-grow">
                        <MenuLink to="/" icon="fa-home" label={t('nav.home')} onClick={onClose} />
                        <MenuLink to="/map" icon="fa-map" label={t('nav.map')} onClick={onClose} />
                        <MenuLink to="/calendar" icon="fa-calendar-alt" label={t('nav.calendar')} onClick={onClose} />
                        <MenuLink to="/blog" icon="fa-newspaper" label="Guías y Relatos" onClick={onClose} />
                        <MenuLink to="/coupons" icon="fa-ticket-alt" label={t('nav.coupons')} onClick={onClose} />
                        <hr className="my-4 border-gray-100 dark:border-gray-800" />
                        <MenuLink to="/newsletter" icon="fa-envelope" label="Boletín Semanal" onClick={onClose} />
                        <MenuLink to="/onboarding" icon="fa-bullhorn" label="Publicita tu Negocio" onClick={onClose} />
                    </nav>
                </div>
            </div>
        </>
    );
};

const MenuLink: React.FC<{ to: string; icon: string; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink 
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-brand-dark-blue/10 text-brand-dark-blue dark:bg-brand-green/10 dark:text-brand-green' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
    >
        <i className={`fas ${icon} w-5 text-center`}></i>
        <span className="font-semibold text-sm">{label}</span>
    </NavLink>
);

const Header: React.FC<{ onMenuOpen: () => void }> = ({ onMenuOpen }) => {
    const { language, setLanguage } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const isMainPage = ['/', '/map', '/chat', '/coupons', '/calendar', '/blog'].includes(location.pathname);

    return (
        <header className="bg-[#2A4D69] text-white shadow-md sticky top-0 z-50 h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {isMainPage ? (
                        <button onClick={onMenuOpen} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                    ) : (
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <i className="fas fa-arrow-left text-xl"></i>
                        </button>
                    )}
                    
                    <Link to="/" className="flex items-center gap-2">
                        <img 
                            src="https://i.imgur.com/Cax54U1.png?v=4" 
                            alt="Logo"
                            className="w-8 h-8 rounded-lg shadow-sm border border-white/20"
                        />
                        <span className="text-base md:text-lg font-bold tracking-tight">Huaraz Explorer</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="h-10 px-4 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-all border border-white/5"
                    >
                        {language === 'es' ? 'ES' : 'EN'}
                    </button>
                </div>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const t = useTranslations();
    const navItems = [
        { path: '/', icon: 'fa-home', label: 'Inicio' },
        { path: '/map', icon: 'fa-map', label: 'Mapa' },
        { path: '/calendar', icon: 'fa-calendar-alt', label: 'Fiestas' },
        { path: '/chat', icon: 'fa-robot', label: 'Asistente IA' },
        { path: '/coupons', icon: 'fa-ticket-alt', label: 'Cupones' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-[0_-4px_15px_rgba(0,0,0,0.1)] z-40 pb-safe border-t dark:border-gray-800">
            <div className="container mx-auto flex justify-around">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center text-center w-full pt-3 pb-2 transition-all ${
                                isActive 
                                ? 'text-brand-dark-blue dark:text-brand-green' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`
                        }
                    >
                        <i className={`fas ${item.icon} text-lg mb-1`}></i>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <Header onMenuOpen={() => setIsMenuOpen(true)} />
            <main className="flex-grow pb-24">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;
