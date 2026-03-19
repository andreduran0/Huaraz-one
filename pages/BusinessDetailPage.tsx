import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AdLevel } from '../types';
import { createClient } from '@supabase/supabase-js';

// 👇 ESPÍA BLINDADO 👇
const logClick = async (businessName: string) => {
    try {
        // @ts-ignore
        const viteUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null;
        // @ts-ignore
        const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

        const nextUrl = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_URL : null;
        const nextKey = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : null;

        const url = viteUrl || nextUrl;
        const key = viteKey || nextKey;

        if (url && key && url !== 'https://placeholder.supabase.co') {
            const supabase = createClient(url, key);
            await supabase.from('clicks_log').insert([{ business_name: businessName }]);
            console.log(`✅ Clic guardado desde Detalles: ${businessName}`);
        }
    } catch (err) {
        console.error("Error silencioso del espía:", err);
    }
};

const BusinessDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { businesses } = useAppContext();
    const t = useTranslations();
    const business = businesses.find(b => b.id === id);

    // Lightbox state
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxMode, setLightboxMode] = useState<'gallery' | 'menu'>('gallery');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!business) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <i className="fas fa-search text-4xl text-slate-200"></i>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Negocio no encontrado</p>
                </div>
            </div>
        );
    }

    const isSponsored = business.adLevel !== AdLevel.NONE;
    const hasMenu = business.menuImages && business.menuImages.length > 0;
    const categoryText = String(business.category).toLowerCase();

    const openLightbox = (index: number, mode: 'gallery' | 'menu') => {
        setCurrentImageIndex(index);
        setLightboxMode(mode);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const currentImages = lightboxMode === 'gallery' ? (business.photos || []) : (business.menuImages || []);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImages.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentImages.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
        }
    };

    // 👇 AQUÍ ARREGLÉ EL ERROR DEL MAPA 👇
    const mapUrl = business.googleMapsQuery
        ? `https://maps.google.com/?q=${encodeURIComponent(business.googleMapsQuery)}`
        : `https://maps.google.com/?q=${business.lat},${business.lng}`;

    // Lógica WhatsApp VIP
    const getWhatsappMessage = () => {
        if (business.id === 'la-carpa-rosa') return `¡Hola! Vengo de Huaraz Explorer 🐧. Quisiera reservar una mesa en La Carpa Rosa para disfrutar de sus parrillas. ¿Tienen disponibilidad?`;
        if (business.id === 'cumbre-rataquenua') return `¡Hola! Vengo de Huaraz Explorer 🐧. Quisiera hacer una reserva en Cumbre para cenar con la vista panorámica de Huaraz.`;
        if (business.id === 'del-sole-huaraz') return `¡Hola! Vengo de Huaraz Explorer 🐧. Quisiera hacer una reserva en su restaurante Del Sole, por favor.`;
        if (categoryText === 'education') return `Hola, quisiera solicitar una entrevista para el ${business.name}. Lo vi en Huaraz Explorer 🐧.`;
        if (categoryText === 'exchange' || categoryText === 'services') return `Hola, quisiera consultar el tipo de cambio del día en ${business.name}. Lo vi en Huaraz Explorer 🐧.`;
        if (categoryText === 'health') return `Hola, quisiera agendar una cita en ${business.name}. Lo vi en Huaraz Explorer 🐧.`;
        return `Hola, quisiera hacer una reserva o consulta en ${business.name}. Lo vi en Huaraz Explorer 🐧.`;
    };
    const whatsappMessage = encodeURIComponent(getWhatsappMessage());

    const getMenuTitle = () => {
        if (categoryText === 'education') return { prefix: 'NUESTRA PROPUESTA ', highlight: 'EDUCATIVA', subtitle: 'Conoce nuestro modelo de enseñanza' };
        if (categoryText === 'exchange' || categoryText === 'services') return { prefix: 'NUESTROS ', highlight: 'SERVICIOS', subtitle: 'Conoce nuestras tasas y opciones' };
        if (categoryText === 'health') return { prefix: 'NUESTRAS ', highlight: 'ESPECIALIDADES', subtitle: 'Conoce nuestros servicios médicos' };
        return { prefix: 'Nuestra ', highlight: 'Carta', subtitle: 'Consulta nuestros platos y especialidades' };
    };
    const menuTitle = getMenuTitle();

    // Cerebro del Widget
    const getWidgetContent = () => {
        switch (business.id) {
            case 'la-carpa-rosa': return { bgColor: '#831843', icon: 'fa-fire', badge: 'Sabor Casero', titlePrefix: 'DISFRUTA NUESTRAS ', titleHighlight: 'PARRILLAS', description: 'Asegura tu mesa en La Carpa Rosa y vive una experiencia acogedora con los mejores cortes.', buttonText: 'RESERVAR MESA' };
            case 'cumbre-rataquenua': return { bgColor: '#0f172a', icon: 'fa-mountain', badge: 'Vista Panorámica', titlePrefix: 'CENA EN LA ', titleHighlight: 'CUMBRE', description: 'Haz tu reserva ahora y disfruta de la mejor vista de Huaraz y la Cordillera Blanca.', buttonText: 'RESERVAR CON VISTA' };
            case 'del-sole-huaraz': return { bgColor: '#9a3412', icon: 'fa-utensils', badge: 'Atención Extendida', titlePrefix: 'SABOR Y ', titleHighlight: 'TRADICIÓN', description: 'Reserva tu mesa de manera rápida y segura en una zona estratégica de Huaraz.', buttonText: 'RESERVAR AHORA' };
            case 'casa-huayaney': return { bgColor: '#064e3b', icon: 'fa-money-bill-wave', badge: 'Tasa Preferencial', titlePrefix: 'CAMBIA CON ', titleHighlight: 'SEGURIDAD', description: 'Cotiza el mejor tipo de cambio de dólares y euros hoy mismo en el centro de Huaraz.', buttonText: 'COTIZAR CAMBIO' };
            case 'nobel-ingenieros': return { bgColor: '#172554', icon: 'fa-user-graduate', badge: 'Matrícula Abierta', titlePrefix: 'FORJA EL ', titleHighlight: 'FUTURO', description: 'Únete a la institución que forma a los líderes e ingenieros del mañana en Huaraz.', buttonText: 'SOLICITAR ENTREVISTA' };
            case 'policlinico-doctor-d': return { bgColor: '#164e63', icon: 'fa-stethoscope', badge: 'Atención Integral', titlePrefix: 'CUIDAMOS TU ', titleHighlight: 'SALUD', description: 'Agenda tu consulta médica con nuestros especialistas y tecnología de vanguardia.', buttonText: 'AGENDAR CITA' };
            default:
                if (categoryText === 'education') return { bgColor: '#1e3a8a', icon: 'fa-book', badge: 'Inscripción Estratégica', titlePrefix: 'FORJA TU ', titleHighlight: 'FUTURO', description: 'Solicita más información de nuestra propuesta.', buttonText: 'CONTACTAR' };
                if (categoryText === 'health') return { bgColor: '#0f766e', icon: 'fa-heartbeat', badge: 'Salud y Bienestar', titlePrefix: 'TU SALUD ES ', titleHighlight: 'PRIMERO', description: 'Agenda tu cita con nuestros profesionales.', buttonText: 'RESERVAR CITA' };
                return { bgColor: '#2A4D69', icon: 'fa-calendar-check', badge: 'Reserva Inmediata', titlePrefix: 'ASEGURA TU ', titleHighlight: 'LUGAR', description: 'Vive la mejor experiencia separando tu espacio ahora.', buttonText: 'RESERVAR AHORA' };
        }
    };
    const widget = getWidgetContent();

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative font-['Plus_Jakarta_Sans']">

            {/* HERO SECTION */}
            <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden bg-black">
                <img src={business.photos?.[0] || 'https://via.placeholder.com/800x600?text=Imagen+No+Disponible'} alt={business.name} className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-16 left-8 right-8 text-white max-w-5xl mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-[#2A4D69] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-md shadow-2xl">
                            {t(`category.${business.category}` as any) || business.category}
                        </span>
                        {isSponsored && (
                            <span className="bg-[#F58220] text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(245,130,32,0.3)]">
                                {t('business.sponsored')}
                            </span>
                        )}
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                        {business.name}
                    </h1>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10 space-y-16 pb-48">

                {/* Acciones Rápidas */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="space-y-3 text-center lg:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1">Ubicación Estratégica</p>
                        <p className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">{business.address}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {business.phone && (
                            <a href={`tel:${business.phone}`} className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-[#2A4D69] border border-slate-100 dark:border-slate-700 active:scale-95 transition-all shadow-sm">
                                <i className="fas fa-phone text-xl md:text-2xl"></i>
                            </a>
                        )}
                        {business.whatsapp && (
                            <a
                                href={`https://wa.me/${business.whatsapp}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => logClick(`Detalle - ${business.name}`)}
                                className="w-16 h-16 md:w-20 md:h-20 bg-green-50 dark:bg-green-900/20 rounded-[2rem] flex items-center justify-center text-green-500 border border-green-100 dark:border-green-900/40 active:scale-95 transition-all shadow-sm"
                            >
                                <i className="fab fa-whatsapp text-3xl md:text-4xl"></i>
                            </a>
                        )}
                        <a href={mapUrl} target="_blank" rel="noreferrer" className="bg-[#2A4D69] text-white px-10 md:px-14 py-6 md:py-8 rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl flex items-center gap-4 active:scale-95 transition-all">
                            Ver Mapa <i className="fas fa-location-arrow"></i>
                        </a>
                    </div>
                </div>

                {/* Reseña Destacada */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 md:p-20 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-full bg-[#F58220]"></div>
                    <i className="fas fa-quote-left absolute top-10 right-10 text-slate-50 dark:text-slate-800 text-8xl -z-10"></i>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold text-2xl md:text-3xl italic relative z-10 whitespace-pre-wrap">
                        "{business.description}"
                    </p>
                </div>

                {/* LA CARTA / SERVICIOS */}
                {hasMenu && (
                    <div className="space-y-10 animate-fadeIn">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
                            <div className="space-y-2">
                                <h3 className="text-4xl md:text-6xl font-black text-[#2A4D69] dark:text-white uppercase italic tracking-tighter">
                                    {menuTitle.prefix}
                                    <span className="text-[#F58220]">{menuTitle.highlight}</span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">{menuTitle.subtitle}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 px-8 py-3 rounded-full border border-slate-200 shadow-inner flex items-center gap-3">
                                <i className="fas fa-book-open text-[#F58220] text-xs"></i>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{business.menuImages?.length} páginas</span>
                            </div>
                        </div>
                        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12 px-4 snap-x">
                            {business.menuImages?.map((page, idx) => (
                                <div key={idx} onClick={() => openLightbox(idx, 'menu')} className="relative flex-shrink-0 w-72 md:w-96 aspect-[3/4.2] rounded-[3rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] border-2 border-slate-200 dark:border-slate-800 cursor-pointer group hover:scale-[1.03] transition-all duration-700 snap-center">
                                    <img src={page} className="w-full h-full object-cover" alt={`Página ${idx + 1}`} />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2A4D69]/30 transition-all flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#2A4D69] opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl">
                                            <i className="fas fa-search-plus text-2xl"></i>
                                        </div>
                                    </div>
                                    <div className="absolute top-8 left-8">
                                        <span className="bg-black/80 backdrop-blur-xl text-white text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-2xl border border-white/10">Pág. {idx + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* HORARIOS Y CAJA VIP (El famoso cuadrado) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4">
                            <i className="fas fa-clock text-[#F58220] text-xl"></i> {t('business.schedule')}
                        </h3>
                        <ul className="space-y-6">
                            {business.schedule && Object.entries(business.schedule).map(([day, hours]) => (
                                <li key={day} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                                    <span className="text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-[0.2em]">{day}</span>
                                    <span className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">{hours}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div 
                        className="lg:col-span-3 p-12 md:p-20 rounded-[4rem] shadow-2xl text-white relative overflow-hidden group transition-colors duration-500"
                        style={{ backgroundColor: widget.bgColor }}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-[2s]"></div>
                        <div className="relative z-10 space-y-8">
                            
                            <div className="inline-flex items-center gap-4 bg-white/10 px-6 py-2.5 rounded-full border border-white/10">
                                <i className={`fas ${widget.icon} text-[#F58220]`}></i>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{widget.badge}</span>
                            </div>
                            
                            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
                                {widget.titlePrefix}
                                <span className="text-[#F58220]">{widget.titleHighlight}</span>
                            </h3>
                            
                            <p className="text-lg font-bold text-white/60 leading-relaxed max-w-sm italic">
                                {widget.description}
                            </p>
                            
                            <a
                                href={`https://wa.me/${business.whatsapp}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => logClick(`Detalle - ${business.name}`)}
                                className="relative inline-flex items-center justify-center gap-5 px-12 py-7 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.3em] shadow-[0_20px_40px_rgba(37,211,102,0.4)] hover:shadow-[0_30px_60px_rgba(37,211,102,0.6
