
import React, { ReactNode, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            
            <div className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 text-[#2A4D69] dark:text-white">
                        <div className="flex items-center gap-2">
                            <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-8 h-8 rounded-lg" alt="Logo" />
                            <span className="font-bold text-lg italic tracking-tighter uppercase">Huaraz Explorer</span>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <nav className="space-y-1 flex-grow overflow-y-auto no-scrollbar">
                        <MenuLink to="/" icon="fa-home" label="Inicio" onClick={onClose} />
                        <MenuLink to="/map" icon="fa-map" label="Mapa" onClick={onClose} />
                        <MenuLink to="/calendar" icon="fa-calendar-alt" label="Fiestas" onClick={onClose} />
                        <MenuLink to="/chat" icon="fa-robot" label="Asistente IA" onClick={onClose} />
                        <MenuLink to="/blog" icon="fa-newspaper" label="Guías y Relatos" onClick={onClose} />
                        <MenuLink to="/coupons" icon="fa-ticket-alt" label="Cupones" onClick={onClose} />
                        <hr className="my-4 border-gray-100 dark:border-gray-800" />
                        <MenuLink to="/onboarding" icon="fa-bullhorn" label="Publicita tu Negocio" onClick={onClose} />
                        <MenuLink to="/admin" icon="fa-user-shield" label="Panel de Control" onClick={onClose} />
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
        className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-[#2A4D69]/10 text-[#2A4D69] font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
    >
        <i className={`fas ${icon} w-5 text-center`}></i>
        <span className="text-sm uppercase tracking-widest">{label}</span>
    </NavLink>
);

const Header: React.FC<{ onMenuOpen: () => void }> = ({ onMenuOpen }) => {
    const { language, setLanguage } = useAppContext();

    return (
        <header className="bg-[#2A4D69] text-white sticky top-0 z-50 h-16 shadow-lg border-b border-white/10">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onMenuOpen}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-white/80"
                        aria-label="Menú principal"
                    >
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <img src="https://i.imgur.com/Cax54U1.png?v=4" alt="Logo" className="w-5 h-5 object-contain" />
                        </div>
                        <span className="text-base md:text-lg font-black tracking-tighter uppercase italic hidden sm:inline-block text-white">Huaraz Explorer</span>
                    </div>
                </div>

                {/* Selector Circular de Idioma basado en la imagen de referencia */}
                <div className="flex items-center">
                    <button 
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="group relative flex items-center justify-center bg-white/10 hover:bg-white/20 border-2 border-white/20 w-12 h-10 md:w-14 md:h-11 rounded-[1.2rem] transition-all active:scale-90 shadow-lg overflow-hidden"
                        title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                    >
                        <span className="text-[11px] md:text-xs font-black tracking-widest text-white uppercase transform transition-transform group-hover:scale-110">
                            {language === 'es' ? 'ES' : 'EN'}
                        </span>
                        <div className="absolute bottom-1 w-1 h-1 bg-white/40 rounded-full"></div>
                    </button>
                </div>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const navItems = [
        { path: '/', icon: 'fa-home', label: 'Inicio' },
        { path: '/map', icon: 'fa-map', label: 'Mapa' },
        { path: '/calendar', icon: 'fa-calendar-alt', label: 'Fiestas' },
        { path: '/chat', icon: 'fa-robot', label: 'Asistente IA' },
        { path: '/coupons', icon: 'fa-ticket-alt', label: 'Cupones' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] z-40 pb-safe border-t border-slate-50 dark:border-gray-800">
            <div className="container mx-auto flex justify-around">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center text-center w-full pt-4 pb-3 transition-all ${
                                isActive 
                                ? 'text-[#2A4D69]' 
                                : 'text-slate-300'
                            }`
                        }
                    >
                        <i className={`fas ${item.icon} text-xl mb-1.5`}></i>
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1 text-center leading-tight whitespace-nowrap">{item.label}</span>
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
