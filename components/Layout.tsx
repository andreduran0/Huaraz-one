
import React, { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const t = useTranslations();
    const { language, setLanguage } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Huaraz Explorer';
            case '/map': return t('nav.map');
            case '/chat': return t('nav.chat');
            case '/coupons': return t('nav.coupons');
            case '/calendar': return t('calendar.title');
            case '/onboarding': return t('nav.onboarding');
            default:
                if (location.pathname.startsWith('/business/')) return "Detalle del Negocio";
                if (location.pathname.startsWith('/admin')) return "Admin Panel";
                if (location.pathname.startsWith('/newsletter')) return "Boletín Informativo";
                return 'Huaraz Explorer';
        }
    };

    const showBackButton = !['/', '/map', '/chat', '/coupons', '/calendar', '/onboarding'].includes(location.pathname);
    const toggleLanguage = () => {
        setLanguage(language === 'es' ? 'en' : 'es');
    };

    return (
        <header className="bg-brand-dark-blue dark:bg-gray-900 text-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center gap-3">
                {showBackButton && (
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <i className="fas fa-arrow-left text-lg"></i>
                    </button>
                )}
                <h1 className="text-xl font-bold flex-1 truncate">{getTitle()}</h1>
                <button
                    onClick={toggleLanguage}
                    className="ml-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition-colors border border-white/20"
                >
                    {language === 'es' ? 'EN' : 'ES'}
                </button>
            </div>
        </header>
    );
};


const BottomNav: React.FC = () => {
    const t = useTranslations();
    // Updated nav items to include Calendar
    const navItems = [
        { path: '/', icon: 'fa-home', label: t('nav.home') },
        { path: '/map', icon: 'fa-map', label: t('nav.map') },
        { path: '/calendar', icon: 'fa-calendar-alt', label: t('nav.calendar') },
        { path: '/chat', icon: 'fa-robot', label: t('nav.chat') },
        { path: '/coupons', icon: 'fa-ticket-alt', label: t('nav.coupons') },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] z-30 pb-safe">
            <div className="container mx-auto flex justify-around">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center text-center w-full pt-3 pb-2 transition-colors duration-200 ${
                                isActive ? 'text-brand-dark-blue dark:text-brand-green' : 'text-gray-400 dark:text-gray-500 hover:text-brand-dark-blue'
                            }`
                        }
                    >
                        <i className={`fas ${item.icon} text-xl mb-1`}></i>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full pb-20">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default Layout;
