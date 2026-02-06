
import React, { ReactNode, useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <div 
            className={`fixed inset-0 z-[200] transition-all duration-300 ${
                isOpen ? 'visible' : 'invisible'
            }`}
        >
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            ></div>
            
            <div 
                className={`absolute top-0 left-0 w-[280px] sm:w-[320px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <img src="https://i.imgur.com/Cax54U1.png?v=4" className="w-8 h-8 object-contain" alt="Logo" />
                        <span className="font-black text-[#2A4D69] text-lg tracking-tighter italic uppercase">Huaraz Explorer</span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <nav className="flex-grow overflow-y-auto py-4 px-3 space-y-1">
                    <MenuLink to="/" icon="fa-home" label="Inicio" onClick={onClose} />
                    <MenuLink to="/map" icon="fa-map" label="Mapa" onClick={onClose} />
                    <MenuLink to="/calendar" icon="fa-calendar-alt" label="Fiestas" onClick={onClose} />
                    <MenuLink to="/chat" icon="fa-robot" label="Asistente IA" onClick={onClose} />
                    <MenuLink to="/blog" icon="fa-newspaper" label="Guías y Relatos" onClick={onClose} />
                    <MenuLink to="/coupons" icon="fa-ticket-alt" label="Cupones" onClick={onClose} />
                    <div className="my-4 border-t border-slate-50 mx-4"></div>
                    <MenuLink to="/onboarding" icon="fa-bullhorn" label="Publicita aquí" onClick={onClose} />
                    <MenuLink to="/admin" icon="fa-user-shield" label="Admin" onClick={onClose} />
                </nav>

                <div className="p-6 text-center border-t border-slate-50">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Versión 5.2 • 2026</p>
                </div>
            </div>
        </div>
    );
};

const MenuLink: React.FC<{ to: string; icon: string; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink 
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `
            flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all w-full
            ${isActive ? 'bg-[#2A4D69]/5 text-[#2A4D69] font-extrabold' : 'text-slate-500 hover:bg-slate-50 font-bold'}
        `}
    >
        <div className="w-6 flex justify-center"><i className={`fas ${icon} text-lg`}></i></div>
        <span className="text-sm uppercase tracking-widest">{label}</span>
    </NavLink>
);

const Header: React.FC<{ onMenuOpen: () => void }> = ({ onMenuOpen }) => {
    const { language, setLanguage } = useAppContext();
    return (
        <header className="bg-[#2A4D69] text-white sticky top-0 z-50 h-16 shadow-md border-b border-white/10">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuOpen} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <img src="https://i.imgur.com/Cax54U1.png?v=4" alt="Logo" className="w-5 h-5 object-contain" />
                        </div>
                        <span className="text-sm font-black tracking-tighter uppercase italic text-white">Huaraz Explorer</span>
                    </Link>
                </div>

                {/* Rediseño del Selector de Idiomas */}
                <div className="bg-white/10 p-1 rounded-full border border-white/10 backdrop-blur-md flex items-center shadow-inner">
                    <button 
                        onClick={() => setLanguage('es')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group ${
                            language === 'es' 
                            ? 'bg-white text-[#2A4D69] shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-100' 
                            : 'text-white/60 hover:text-white scale-95'
                        }`}
                    >
                        <img 
                            src="https://flagcdn.com/w40/pe.png" 
                            className={`w-4 h-4 rounded-full object-cover border border-slate-100 shadow-sm transition-transform group-hover:scale-110 ${language === 'es' ? 'opacity-100' : 'opacity-70'}`} 
                            alt="ES" 
                        />
                        <span className="text-[10px] font-black uppercase tracking-tighter">ES</span>
                    </button>
                    
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group ${
                            language === 'en' 
                            ? 'bg-white text-[#2A4D69] shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-100' 
                            : 'text-white/60 hover:text-white scale-95'
                        }`}
                    >
                        <img 
                            src="https://flagcdn.com/w40/us.png" 
                            className={`w-4 h-4 rounded-full object-cover border border-slate-100 shadow-sm transition-transform group-hover:scale-110 ${language === 'en' ? 'opacity-100' : 'opacity-70'}`} 
                            alt="EN" 
                        />
                        <span className="text-[10px] font-black uppercase tracking-tighter">EN</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

const BottomNav: React.FC = () => {
    const navItems = [
        { path: '/', icon: 'fa-house', label: 'INICIO' },
        { path: '/map', icon: 'fa-map', label: 'MAPA' },
        { path: '/calendar', icon: 'fa-calendar-days', label: 'FIESTAS' },
        { path: '/chat', icon: 'fa-robot', label: 'ASISTENTE IA' },
        { path: '/coupons', icon: 'fa-ticket', label: 'CUPONES' },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
            <div className="flex justify-around items-center h-16 md:h-20 max-w-xl mx-auto">
                {navItems.map(item => (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex flex-col items-center justify-center text-center w-full h-full transition-colors ${isActive ? 'text-[#2A4D69]' : 'text-slate-300'}`}>
                        <div className="text-xl md:text-2xl mb-1"><i className={`fas ${item.icon}`}></i></div>
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider leading-none">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    useEffect(() => { setIsMenuOpen(false); }, [location]);
    return (
        <div className="flex flex-col min-h-screen">
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <Header onMenuOpen={() => setIsMenuOpen(true)} />
            <main className="flex-grow pb-20 md:pb-24 bg-white">{children}</main>
            <BottomNav />
        </div>
    );
};

export default Layout;
