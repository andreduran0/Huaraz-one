import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AdLevel } from '../types';
import { createClient } from '@supabase/supabase-js';

// 👇 EL ESPÍA BLINDADO 👇
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

    // 👇 MENSAJES DE WHATSAPP VIP 👇
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

    // 👇 EL CEREBRO DEL CUADRO DE RESERVAS (COLOR Y TEXTO) 👇
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
                <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110" />
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
                        <p className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">{business.address}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {business.phone && (
                            <a href={`tel:${business.phone}`} className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-[#2A4D69] border border-slate-100 dark:border-slate-700 active:scale-95 transition-all shadow-sm">
                                <i className="fas fa-phone text-xl md:text-2xl"></i>
                            </a>
                        )}
                        {business.whatsapp &&
