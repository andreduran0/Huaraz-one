import BusinessRating from './BusinessRating';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { Business, AdLevel } from '../types';
import { getSupabase } from '../services/supabase';

interface BusinessCardProps {
  business: Business;
}

const cleanText = (val?: string | null): string => {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return '';
  }
  return trimmed;
};

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations();

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const trackingId = (business as any)?.supabaseId || (business as any)?.id || null;

  const registrarEvento = async (
    label: string,
    eventType: 'detail_view' | 'detail_reserve_click' | 'promotion_click' | 'arkaiko_reserve_click'
  ) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const validBusinessId = trackingId && UUID_REGEX.test(trackingId) ? trackingId : null;

      const { error } = await supabase.from('clicks_log').insert([
        {
          business_name: label,
          business_id: validBusinessId,
          event_type: eventType,
        },
      ]);

      if (error) console.error('Error en clicks_log (BusinessCard):', error);
    } catch (error) {
      console.error('Error silencioso del espía:', error);
    }
  };

  const handleDetailOpen = () => {
    void registrarEvento(business.name, 'detail_view');
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void registrarEvento(`Telefono - ${business.name}`, 'detail_reserve_click');
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    void registrarEvento(`WhatsApp - ${business.name}`, 'detail_reserve_click');

    const whatsappUrl = `https://wa.me/${business.whatsapp}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const isSponsored = business.adLevel !== AdLevel.NONE;
  const safeAddress = cleanText(business.address);

  const categoryLabel = (() => {
    const rawCategory = String(business.category || '').toLowerCase();
    const bizName = String(business.name || '').toLowerCase();

    if (
      bizName.includes('chasing') ||
      rawCategory.includes('tour') ||
      rawCategory.includes('agency') ||
      rawCategory.includes('agencia')
    ) {
      return 'Agencia de Turismo';
    }

    const fallbackCategories: Record<string, string> = {
      restaurant: 'Restaurante',
      polleria: 'Pollería',
      cevicheria: 'Cevichería',
      restobar: 'Restobar',
      sushi_bar: 'Sushi Bar',
      panaderia: 'Panadería',
      emolienteria: 'Emolientería',
      torteria: 'Tortería',
      postres: 'Postres',
      hotel: 'Hotel',
      tourist_spot: 'Lugar Turístico',
      tour_agency: 'Agencia de Turismo',
      agencia_turismo: 'Agencia de Turismo',
      chocolateria: 'Chocolatería'
    };

    const translated = t(`category.${business.category}` as any);
    if (!translated || translated.startsWith('category.')) {
      return fallbackCategories[rawCategory] || business.category;
    }
    return translated;
  })();

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">

      {/* 📸 FOTO SUPERIOR CLICKEABLE */}
      <Link to={`/business/${business.id}`} onClick={handleDetailOpen} className="block relative">
        <div className="h-48 w-full relative">
          <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />

          {/* ETIQUETA DE PATROCINADO */}
          {isSponsored && (
            <div className="absolute top-4 left-4 bg-[#F58220] text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-md">
              {t('business.sponsored')}
            </div>
          )}
        </div>
      </Link>

      {/* 📄 CONTENIDO INFERIOR */}
      <div className="p-6 flex flex-col flex-grow">

        {/* TEXTOS CLICKEABLES */}
        <Link to={`/business/${business.id}`} onClick={handleDetailOpen} className="block flex-grow">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-2xl font-black text-[#2A4D69] leading-tight">
              {business.name}
            </h3>
            <BusinessRating businessId={trackingId || business.id} />
          </div>

          {/* CATEGORÍA Y DIRECCIÓN GRIS (SIN "NULL") */}
          <p className="text-slate-500 font-bold text-sm mb-6">
            {safeAddress ? `${categoryLabel} • ${safeAddress}` : categoryLabel}
          </p>

          {/* LA LÍNEA SEPARADORA FINA */}
          <div className="w-full h-px bg-slate-100 mb-6"></div>
        </Link>

        {/* 🔘 BOTONES DE ACCIÓN */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-4">

            {/* BOTÓN TELÉFONO CIRCULAR */}
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                onClick={handlePhoneClick}
                className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-[#2A4D69] hover:bg-slate-50 transition-colors active:scale-90"
              >
                <i className="fas fa-phone"></i>
              </a>
            )}

            {/* BOTÓN WHATSAPP CIRCULAR VERDE */}
            {business.whatsapp && (
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-12 h-12 rounded-full border-2 border-green-100 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors active:scale-90"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </button>
            )}

          </div>

          {/* TEXTO VER DETALLES SUBRAYADO */}
          <Link
            to={`/business/${business.id}`}
            onClick={handleDetailOpen}
            className="text-[#2A4D69] font-black text-sm underline decoration-2 underline-offset-4 hover:text-[#1a3346]"
          >
            Ver Detalles
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BusinessCard;
