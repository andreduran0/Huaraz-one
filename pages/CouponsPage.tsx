
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
            {/* Glow effect background */}
            <div className="absolute -inset-1 bg-[#39FF14]/10 rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row bg-[#0D0D0D] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#39FF14]/20 transition-all hover:border-[#39FF14]/50 group-hover:scale-[1.01]">
                
                {/* Left Section - Business Info */}
                <div className="w-full md:w-2/3 p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                    <div className="relative w-32 h-32 shrink-0 rounded-3xl overflow-hidden border-2 border-[#39FF14]/20 group-hover:border-[#39FF14]/60 transition-all duration-500">
                        <img src={business.photos[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={business.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="space-y-4 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                             <Link to={`/business/${business.id}`} className="text-[10px] font-black text-[#39FF14] uppercase tracking-[0.4em] hover:drop-shadow-[0_0_5px_#39FF14] transition-all">
                                {business.name}
                            </Link>
                            {isExpiringSoon() && (
                                <span className="bg-red-600 text-white text-[8px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-widest border border-red-500/50">Vence pronto</span>
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-[#39FF14] transition-colors">
                            {coupon.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                            {coupon.description}
                        </p>
                    </div>
                </div>

                {/* Vertical Divider / Perforation (Digital Style) */}
                <div className="hidden md:flex flex-col items-center justify-between py-6 relative w-px bg-white/5 mx-2">
                    <div className="w-6 h-6 bg-[#050505] rounded-full -mt-9 border border-white/5"></div>
                    <div className="flex-grow border-l-2 border-dashed border-[#39FF14]/20 my-4"></div>
                    <div className="w-6 h-6 bg-[#050505] rounded-full -mb-9 border border-white/5"></div>
                </div>

                <div className="flex md:hidden items-center justify-between px-6 relative h-px bg-white/5 my-4">
                    <div className="w-6 h-6 bg-[#050505] rounded-full -ml-9 border border-white/5"></div>
                    <div className="flex-grow border-t-2 border-dashed border-[#39FF14]/20 mx-4"></div>
                    <div className="w-6 h-6 bg-[#050505] rounded-full -mr-9 border border-white/5"></div>
                </div>

                {/* Right Section - Claim Code */}
                <div className="w-full md:w-1/3 bg-[#111111] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 blur-[60px] pointer-events-none"></div>
                    
                    <div className="w-full mb-6">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3">Código de Desbloqueo</p>
                        <div className="bg-[#050505] border-2 border-dashed border-[#39FF14]/40 p-5 rounded-2xl text-[#39FF14] font-black text-3xl tracking-[0.3em] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group/code">
                            <span className="relative z-10 drop-shadow-[0_0_10px_rgba(57,255,20,0.4)]">{coupon.code}</span>
                            <div className="absolute inset-0 bg-[#39FF14]/5 translate-y-full group-hover/code:translate-y-0 transition-transform duration-500"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={copyToClipboard}
                        className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group/btn ${
                            copied 
                            ? 'bg-white text-black' 
                            : 'bg-[#39FF14] text-black shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-105'
                        }`}
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        {copied ? (
                            <><i className="fas fa-check-circle text-lg"></i> Código Copiado</>
                        ) : (
                            <><i className="fas fa-bolt text-lg"></i> Canjear Cupón</>
                        )}
                    </button>
                    
                    <div className="mt-5">
                        <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.3em]">
                            Expira: <span className="text-gray-500">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
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
    <div className="min-h-screen bg-[#050505] pb-40 font-['Plus_Jakarta_Sans']">
        
        {/* Header Hero - Tech Dark Style */}
        <div className="relative bg-[#0A0A0A] pt-28 pb-40 rounded-b-[5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden border-b border-[#39FF14]/10">
            {/* Glow Backgrounds */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <img src="https://www.transparenttextures.com/patterns/cubes.png" className="w-full h-full" alt="texture" />
            </div>
            
            <div className="container mx-auto px-8 text-center relative z-10 space-y-8">
                <div className="inline-flex items-center gap-3 bg-[#39FF14]/10 border border-[#39FF14]/40 text-[#39FF14] px-8 py-3 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Huaraz Explorer Network</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Cuponera <br /><span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">Exclusiva</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-wide">
                    Beneficios especiales desbloqueados solo para exploradores de la comunidad Huaraz Explorer.
                </p>
            </div>
        </div>

        {/* Listado Principal */}
        <div className="container mx-auto px-8 max-w-5xl -mt-24 relative z-20">
            {coupons.length > 0 ? (
                <div className="flex flex-col gap-10">
                {coupons.map(coupon => {
                    const business = businesses.find(b => b.id === coupon.businessId);
                    if (!business) return null;
                    return <CouponCard key={coupon.id} coupon={coupon} business={business} />;
                })}
                </div>
            ) : (
                <div className="py-48 text-center bg-[#0D0D0D] rounded-[4rem] shadow-2xl border-2 border-dashed border-white/5">
                    <i className="fas fa-ticket-alt text-gray-800 text-8xl mb-8"></i>
                    <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-xs">Cargando nuevas oportunidades de ahorro...</p>
                </div>
            )}
            
            {/* CTA Business - Neon Green Style */}
            <div className="mt-32 relative overflow-hidden bg-[#0A0A0A] rounded-[4rem] p-12 md:p-24 text-center shadow-3xl group border border-[#39FF14]/20">
                <div className="absolute -inset-2 bg-gradient-to-br from-[#39FF14]/10 via-transparent to-white/5 opacity-50 pointer-events-none"></div>
                <div className="relative z-10 space-y-10">
                    <div className="w-20 h-20 bg-[#39FF14]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#39FF14]/30 shadow-inner">
                        <i className="fas fa-rocket text-3xl text-[#39FF14]"></i>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">¿Eres dueño de un <br/><span className="text-[#39FF14]">negocio local?</span></h3>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
                        Aumenta tu tráfico de clientes y fideliza a los turistas integrando tus cupones en nuestra red de exploración inteligente.
                    </p>
                    <Link 
                        to="/onboarding" 
                        className="inline-flex items-center gap-4 bg-[#39FF14] hover:scale-105 active:scale-95 text-black px-16 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_15px_40px_rgba(57,255,20,0.3)] transition-all"
                    >
                        Publicar Beneficio <i className="fas fa-bolt"></i>
                    </Link>
                </div>
            </div>
        </div>

        <div className="py-24 text-center">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">Huaraz Explorer Network • Coupon System v4.0</p>
        </div>
    </div>
  );
};

export default CouponsPage;
