import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AdLevel, BusinessCategory } from '../types';
import { createClient } from '@supabase/supabase-js'; // 👈 IMPORTAMOS EL ESPÍA

// 👇 EL ESPÍA BLINDADO PARA LA PÁGINA DE DETALLES 👇
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
// 👆 FIN DEL ESPÍA 👆

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

    // Convertimos la categoría a texto simple (minúsculas) para evitar errores de enum
    const categoryText = String(business.category).toLowerCase();

    const openLightbox = (index: number, mode: 'gallery' | 'menu') => {
        setCurrentImageIndex(index);
        setLightboxMode(mode);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const currentImages = lightboxMode === 'gallery' ? business.photos : (business.menuImages || []);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    };

    const mapUrl = business.googleMapsQuery
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.googleMapsQuery)}`
        : `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`;

    // Lógica Dinámica para el mensaje de WhatsApp (Reforzada)
    const getWhatsappMessage = () => {
        if (categoryText === 'education') {
            return `Hola, quisiera solicitar una entrevista para el ${business.name}. Lo vi en Huaraz Explorer.`;
        } else if (categoryText === 'exchange' || categoryText === 'services') {
            return `Hola, quisiera consultar el tipo de cambio del día en ${business.name}. Lo vi en Huaraz Explorer.`;
        } else if (categoryText === 'health') {
            return `Hola, quisiera agendar una cita en ${business.name}. Lo vi en Huaraz Explorer.`;
        } else {
            return `Hola, quisiera hacer una reserva o consulta en ${business.name}. Lo vi en Huaraz Explorer.`;
        }
    };
    const whatsappMessage = encodeURIComponent(getWhatsappMessage());

    // Lógica Dinámica para los títulos (Reforzada)
    const getMenuTitle = () => {
        if (categoryText === 'education') {
            return { prefix: 'NUESTRA PROPUESTA ', highlight: 'EDUCATIVA', subtitle: 'Conoce nuestro modelo de enseñanza y valores' };
        } else if (categoryText === 'exchange' || categoryText === 'services') {
            return { prefix: 'NUESTROS ', highlight: 'SERVICIOS', subtitle: 'Conoce nuestras tasas y opciones de cambio' };
        } else if (categoryText === 'health') {
            return { prefix: 'NUESTRAS ', highlight: 'ESPECIALIDADES', subtitle: 'Conoce nuestros servicios médicos' };
        } else {
            return { prefix: 'Nuestra ', highlight: 'Carta', subtitle: 'Consulta nuestros platos y especialidades' };
        }
    };
    const menuTitle = getMenuTitle();

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen relative font-['Plus_Jakarta_Sans']">

            {/* HERO SECTION */}
            <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden bg-black">
                <img
                    src={business.photos[0]}
                    alt={business.name}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110"
                />
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

                {/* Tarjeta de Acciones Rápidas */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="space-y-3 text-center lg:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1">Ubicación Estratégica</p>
                        <p className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                            {business.address}
                        </p>
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
                                onClick={() => logClick(`Detalle - ${business.name}`)} // 👈 AQUÍ VIGILAMOS EL CLIC
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
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold text-2xl md:text-3xl italic relative z-10">
                        "{business.description}"
                    </p>
                </div>
                {/* SECCIÓN: LA CARTA / SERVICIOS */}
                {hasMenu && (
                    <div className="space-y-10 animate-fadeIn">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4">
                            <div className="space-y-2">
                                <h3 className="text-4xl md:text-6xl font-black text-[#2A4D69] dark:text-white uppercase italic tracking-tighter">
                                    {menuTitle.prefix}
                                    <span className="text-[#F58220]">{menuTitle.highlight}</span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                                    {menuTitle.subtitle}
                                </p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 px-8 py-3 rounded-full border border-slate-200 shadow-inner flex items-center gap-3">
                                <i className="fas fa-book-open text-[#F58220] text-xs"></i>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{business.menuImages?.length} páginas</span>
                            </div>
                        </div>
                        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12 px-4 snap-x">
                            {business.menuImages?.map((page, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openLightbox(idx, 'menu')}
                                    className="relative flex-shrink-0 w-72 md:w-96 aspect-[3/4.2] rounded-[3rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] border-2 border-slate-200 dark:border-slate-800 cursor-pointer group hover:scale-[1.03] transition-all duration-700 snap-center"
                                >
                                    <img src={page} className="w-full h-full object-cover" alt={`Página de la carta ${idx + 1}`} />
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
                {/* Horarios y Reserva */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4">
                            <i className="fas fa-clock text-[#F58220] text-xl"></i> {t('business.schedule')}
                        </h3>
                        <ul className="space-y-6">
                            {Object.entries(business.schedule).map(([day, hours]) => (
                                <li key={day} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                                    <span className="text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-[0.2em]">{day}</span>
                                    <span className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest">{hours}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 bg-[#2A4D69] p-12 md:p-20 rounded-[4rem] shadow-[0_40px_100px_rgba(42,77,105,0.25)] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-[2s]"></div>
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-4 bg-white/10 px-6 py-2.5 rounded-full border border-white/10">
                                <i className={`fas ${categoryText === 'education' ? 'fa-user-graduate' : categoryText === 'exchange' ? 'fa-money-bill-wave' : 'fa-calendar-check'} text-[#F58220]`}></i>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                                    {categoryText === 'education' ? 'Inscripción Estratégica' : categoryText === 'exchange' ? 'Atención Inmediata' : 'Reserva Inmediata'}
                                </span>
                            </div>
                            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
                                {categoryText === 'education' ? 'FORJA EL FUTURO EN ' : categoryText === 'exchange' ? 'CAMBIA CON ' : 'Asegura tu lugar en '}
                                <span className="text-[#F58220]">{categoryText === 'exchange' ? 'SEGURIDAD' : 'LA CIMA'}</span>
                            </h3>
                            <p className="text-lg font-bold text-white/60 leading-relaxed max-w-sm italic">
                                {categoryText === 'education'
                                    ? 'Únete a la institución que forma a los líderes e ingenieros del mañana en Huaraz.'
                                    : categoryText === 'exchange'
                                        ? 'Cotiza el mejor tipo de cambio de Huaraz de forma rápida y confiable.'
                                        : 'Vive la mejor experiencia de Huaraz con nuestra atención de primera.'}
                            </p>
                            <a
                                href={`https://wa.me/${business.whatsapp}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => logClick(`Detalle - ${business.name}`)} // 👈 AQUÍ VIGILAMOS EL CLIC
                                className="inline-flex bg-white text-[#2A4D69] px-12 py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] items-center gap-5 shadow-2xl hover:bg-slate-50 transition-all active:scale-95 group/btn"
                            >
                                {categoryText === 'education' ? 'SOLICITAR ENTREVISTA' : categoryText === 'exchange' ? 'Cotizar Cambio' : 'Reservar Ahora'}
                                <i className="fab fa-whatsapp text-2xl group-hover/btn:rotate-12 transition-transform"></i>
                            </a>
                        </div>
                    </div>
                </div>
                {/* GALERÍA DEL LOCAL */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between px-6">
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Galería <span className="text-slate-300">Ambiental</span></h3>
                        <div className="hidden md:block h-px flex-grow bg-slate-100 mx-10"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-2">
                        {business.photos.map((photo, index) => (
                            <div
                                key={index}
                                className="aspect-square rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:scale-[1.04] transition-all duration-700 border border-slate-100 dark:border-slate-800 relative group"
                                onClick={() => openLightbox(index, 'gallery')}
                            >
                                <img src={photo} alt={`${business.name} ${index + 1}`} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-125" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                                    <i className="fas fa-expand text-white text-2xl opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            {/* LIGHTBOX MODAL */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[200] bg-slate-950/98 flex flex-col animate-fadeIn">
                    <div className="p-8 flex items-center justify-between text-white border-b border-white/5 bg-black/20 backdrop-blur-xl">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">Visor Premium</span>
                            <span className="text-sm font-black uppercase italic tracking-tighter">{lightboxMode === 'menu' ? 'Nuestros Detalles' : 'Galería del Local'}</span>
                        </div>
                        <button
                            onClick={closeLightbox}
                            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div className="flex-grow relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
                        <button onClick={prevImage} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/30 hover:text-white w-20 h-20 rounded-full hover:bg-white/5 transition-all z-50 flex items-center justify-center hidden md:flex"><i className="fas fa-chevron-left text-5xl"></i></button>
                        <img src={currentImages[currentImageIndex]} className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_150px_rgba(0,0,0,0.8)] border border-white/5" alt="Vista ampliada" />
                        <button onClick={nextImage} className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/30 hover:text-white w-20 h-20 rounded-full hover:bg-white/5 transition-all z-50 flex items-center justify-center hidden md:flex"><i className="fas fa-chevron-right text-5xl"></i></button>
                    </div>
                    <div className="p-10 flex flex-col items-center gap-6 bg-black/40 backdrop-blur-md">
                        <div className="bg-white/5 backdrop-blur-2xl px-12 py-5 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] border border-white/10 shadow-2xl">{currentImageIndex + 1} de {currentImages.length}</div>
                        <div className="flex gap-10 md:hidden">
                            <button onClick={prevImage} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90"><i className="fas fa-chevron-left"></i></button>
                            <button onClick={nextImage} className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90"><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default BusinessDetailPage; ¿ esta bien esto ?
