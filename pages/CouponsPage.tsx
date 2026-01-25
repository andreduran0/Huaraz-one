
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { Link } from 'react-router-dom';

const CouponCard: React.FC<{ coupon: any, business: any }> = ({ coupon, business }) => {
    const t = useTranslations();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isExpiringSoon = () => {
        const expiry = new Date(coupon.expiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        const days = diff / (1000 * 3600 * 24);
        return days > 0 && days < 30;
    };

    return (
        <div className="relative group animate-fadeIn">
            {/* Decoración de sombra dinámica */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange/20 to-brand-blue/20 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.01]">
                
                {/* Left Section */}
                <div className="w-full md:w-2/3 p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                    <div className="relative w-28 h-28 shrink-0 rounded-3xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                        <img src={business.photos[0]} className="w-full h-full object-cover" alt={business.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                             <Link to={`/business/${business.id}`} className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] hover:text-brand-blue transition-colors">
                                {business.name}
                            </Link>
                            {isExpiringSoon() && (
                                <span className="bg-red-500 text-white text-[8px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-widest">Vence pronto</span>
                            )}
                        </div>
                        <h3 className="text-2xl font-black text-brand-dark-blue dark:text-white uppercase italic tracking-tighter leading-none">
                            {coupon.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            {coupon.description}
                        </p>
                    </div>
                </div>

                {/* Perforation Line */}
                <div className="hidden md:flex flex-col items-center justify-between py-6 relative">
                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -mt-10 shadow-inner"></div>
                    <div className="flex-grow border-l-2 border-dashed border-gray-200 dark:border-gray-800 my-4"></div>
                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -mb-10 shadow-inner"></div>
                </div>

                <div className="flex md:hidden items-center justify-between px-6 relative">
                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -ml-10 shadow-inner"></div>
                    <div className="flex-grow border-t-2 border-dashed border-gray-200 dark:border-gray-800 mx-4"></div>
                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-950 rounded-full -mr-10 shadow-inner"></div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-1/3 bg-gray-50/80 dark:bg-gray-800/50 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-full mb-5">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">CÓDIGO EXCLUSIVO</p>
                        <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-brand-orange/40 p-4 rounded-2xl text-brand-orange font-black text-2xl tracking-[0.3em] shadow-inner relative overflow-hidden group/code">
                            <span className="relative z-10">{coupon.code}</span>
                            <div className="absolute inset-0 bg-brand-orange/5 translate-y-full group-hover/code:translate-y-0 transition-transform duration-300"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={copyToClipboard}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                            copied 
                            ? 'bg-brand-green text-brand-dark-blue' 
                            : 'bg-brand-dark-blue text-white hover:bg-brand-blue'
                        }`}
                    >
                        {copied ? (
                            <><i className="fas fa-check-circle text-lg"></i> ¡Listo!</>
                        ) : (
                            <><i className="fas fa-copy text-lg"></i> Canjear ahora</>
                        )}
                    </button>
                    
                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            Válido hasta: <span className="text-gray-600 dark:text-gray-300">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CouponsPage: React.FC = () => {
  const { coupons, businesses } = useAppContext();
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
        
        {/* Header Hero */}
        <div className="relative bg-brand-dark-blue dark:bg-gray-900 pt-20 pb-32 rounded-b-[5rem] shadow-2xl overflow-hidden mb-16">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img src="https://www.transparenttextures.com/patterns/cubes.png" className="w-full h-full" alt="texture" />
            </div>
            
            <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
                <div className="inline-flex items-center gap-3 bg-brand-orange text-white px-6 py-2 rounded-full shadow-lg animate-bounce">
                    <i className="fas fa-percent text-xs"></i>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Huaraz Explorer Deals</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Cupones <span className="text-brand-orange">& Ofertas</span>
                </h1>
                <p className="text-white/60 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-tight">
                    Desbloquea beneficios exclusivos en los mejores establecimientos de la ciudad.
                </p>
            </div>
        </div>

        {/* Listado Principal */}
        <div className="container mx-auto px-6 max-w-5xl -mt-24 relative z-20">
            {coupons.length > 0 ? (
                <div className="flex flex-col gap-10">
                {coupons.map(coupon => {
                    const business = businesses.find(b => b.id === coupon.businessId);
                    if (!business) return null;
                    return <CouponCard key={coupon.id} coupon={coupon} business={business} />;
                })}
                </div>
            ) : (
                <div className="py-40 text-center bg-white dark:bg-gray-900 rounded-[4rem] shadow-xl border-4 border-dashed border-gray-100 dark:border-gray-800">
                    <i className="fas fa-ticket-alt text-gray-200 text-7xl mb-6"></i>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Pronto tendremos nuevas ofertas para ti</p>
                </div>
            )}
            
            {/* CTA Business */}
            <div className="mt-24 relative overflow-hidden bg-brand-dark-blue rounded-[4rem] p-12 md:p-20 text-center shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/40 via-transparent to-brand-blue/20 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative z-10 space-y-8">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">¿Quieres que tu negocio destaque?</h3>
                    <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
                        Únete a Huaraz Explorer y llega a miles de turistas que buscan las mejores experiencias y ofertas en la región Ancash.
                    </p>
                    <Link 
                        to="/onboarding" 
                        className="inline-flex items-center gap-4 bg-brand-orange hover:bg-orange-600 text-white px-12 py-6 rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        Empezar ahora <i className="fas fa-rocket"></i>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CouponsPage;
