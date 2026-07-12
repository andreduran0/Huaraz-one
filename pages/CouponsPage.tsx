import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const CouponCard: React.FC<{ coupon: any, business: any }> = ({ coupon, business }) => {
    const { language } = useAppContext(); // Extraemos language
    const t = (es: string, en: string) => language === 'es' ? es : en;
    const [copied, setCopied] = useState(false);

    const isExpiringSoon = () => {
        const expiry = new Date(coupon.expiryDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        const days = diff / (1000 * 3600 * 24);
        return days > 0 && days < 30;
    };

    return (
        <div className="relative group animate-fadeIn">
            <div className="absolute -inset-1 bg-[#00D4FF]/10 rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100 transition-all hover:border-[#00D4FF]/50 group-hover:scale-[1.01]">
                
                <div className="w-full md:w-2/3 p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                    <div className="relative w-32 h-32 shrink-0 rounded-3xl overflow-hidden border-2 border-slate-100 group-hover:border-[#00D4FF]/40 transition-all duration-500 shadow-inner">
                        <img src={business.photos[0]} className="w-full h-full object-cover transition-all" alt={business.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="space-y-4 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                             <Link to={`/business/${business.id}`} className="text-[10px] font-black text-[#00D4FF] uppercase tracking-[0.4em] hover:drop-shadow-[0_0_5px_rgba(0,212,255,0.5)] transition-all">
                                {business.name}
                            </Link>
                            {isExpiringSoon() && (
                                <span className="bg-red-500 text-white text-[8px] px-3 py-1 rounded-full font-black animate-pulse uppercase tracking-widest border border-red-400">
                                    {t('Vence pronto', 'Expires soon')}
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-[#00D4FF] transition-colors">
                            {coupon.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                            {coupon.description}
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-center justify-between py-6 relative w-px bg-slate-100 mx-2">
                    <div className="w-6 h-6 bg-[#F8FAFC] rounded-full -mt-9 border border-slate-100"></div>
                    <div className="flex-grow border-l-2 border-dashed border-[#00D4FF]/20 my-4"></div>
                    <div className="w-6 h-6 bg-[#F8FAFC] rounded-full -mb-9 border border-slate-100"></div>
                </div>

                <div className="w-full md:w-1/3 bg-slate-50 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D4FF]/5 blur-[60px] pointer-events-none"></div>
                    
                    <div className="w-full mb-6">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            {t('Beneficio Bloqueado', 'Locked Benefit')}
                        </p>
                        <div className="bg-white border-2 border-dashed border-[#00D4FF]/40 p-5 rounded-2xl text-slate-400 font-bold text-sm shadow-sm relative overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <i className="fas fa-lock text-[#00D4FF]"></i> {t('Desbloquea con Arkáiko', 'Unlock with Arkáiko')}
                            </span>
                            <div className="absolute inset-0 bg-[#00D4FF]/5"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            const numeroWhatsApp = "51944841455"; 
                            const mensaje = encodeURIComponent(t(
                                `Hola Arkaiko, quiero canjear el cupón: ${coupon.title} en Huaraz Explorer.`,
                                `Hi Arkáiko, I want to redeem the coupon: ${coupon.title} at Huaraz Explorer.`
                            ));
                            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
                        }}
                        className="w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group/btn bg-[#00D4FF] text-white shadow-[0_10px_30px_rgba(0,212,255,0.3)] hover:scale-105"
                    >
                        <i className="fab fa-whatsapp text-lg"></i> {t('Canjear Cupón', 'Redeem Coupon')}
                    </button>
                    
                    <div className="mt-5">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.3em]">
                            {t('Promoción Exclusiva', 'Exclusive Promotion')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CouponsPage: React.FC = () => {
  const { coupons, businesses, language } = useAppContext();
  const t = (es: string, en: string) => language === 'es' ? es : en;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 font-['Plus_Jakarta_Sans']">
        
        <div className="relative bg-white pt-28 pb-44 rounded-b-[5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden border-b border-slate-100">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#00D4FF]/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#00D4FF 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
            </div>
            
            <div className="container mx-auto px-8 text-center relative z-10 space-y-8">
                <div className="inline-flex items-center gap-3 bg-white border border-slate-200 text-[#00D4FF] px-8 py-3 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Huaraz Explorer Rewards</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                    {t('Cuponera', 'Coupon Book')} <br /><span className="text-[#00D4FF] drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">{t('Exclusiva', 'Exclusive')}</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-wide">
                    {t('Descuentos y beneficios especiales desbloqueados para nuestra comunidad de viajeros.', 'Special discounts and benefits unlocked for our traveler community.')}
                </p>
            </div>
        </div>

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
                <div className="py-48 text-center bg-white rounded-[4rem] shadow-xl border-2 border-dashed border-slate-100">
                    <i className="fas fa-ticket-alt text-slate-100 text-8xl mb-8"></i>
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs">
                        {t('Cargando nuevas ofertas para ti...', 'Loading new offers for you...')}
                    </p>
                </div>
            )}
            
            <div className="mt-32 relative overflow-hidden bg-white rounded-[4rem] p-12 md:p-24 text-center shadow-2xl group border border-slate-100">
                <div className="absolute -inset-2 bg-gradient-to-br from-[#00D4FF]/10 via-transparent to-slate-100/50 opacity-50 pointer-events-none"></div>
                <div className="relative z-10 space-y-10">
                    <div className="w-20 h-20 bg-[#00D4FF]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#00D4FF]/20 shadow-inner">
                        <i className="fas fa-rocket text-3xl text-[#00D4FF]"></i>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                        {t('¿Tienes un ', 'Do you have a ')}<br/><span className="text-[#00D4FF]">{t('negocio local?', 'local business?')}</span>
                    </h3>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                        {t('Atrae a más clientes y potencia tu visibilidad integrando tus cupones en la plataforma favorita de Huaraz.', 'Attract more customers and boost your visibility by integrating your coupons into Huaraz\'s favorite platform.')}
                    </p>
                    <Link 
                        to="/onboarding" 
                        className="inline-flex items-center gap-4 bg-[#00D4FF] hover:scale-105 active:scale-95 text-white px-16 py-7 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_15px_40px_rgba(0,212,255,0.3)] transition-all"
                    >
                        {t('Publicar Cupón', 'Publish Coupon')} <i className="fas fa-bolt"></i>
                    </Link>
                </div>
            </div>
        </div>

        <div className="py-24 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Huaraz Explorer Network • Blue Edition v5.0</p>
        </div>
    </div>
  );
};

export default CouponsPage;
