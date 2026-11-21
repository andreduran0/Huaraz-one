import BusinessRating from './BusinessRating';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
import { Business, AdLevel } from '../types';
import { getSupabase } from '../services/supabase'; // Cambia a '../services/supabaseClient' si así se llama tu archivo en services/[cite: 3]

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations();

  const registrarEvento = async (
    label: string,
    eventType: 'detail_view' | 'detail_reserve_click' | 'promotion_click' | 'arkaiko_reserve_click'
  ) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;

      const businessId = (business as any)?.id || null;
      await supabase.from('clicks_log').insert([
        {
          business_name: label,
          business_id: businessId,
          event_type: eventType,
        },
      ]);
    } catch (error) {
      console.error('Error silencioso del espía:', error);
    }
  };

  // 👇 CLIC EN FICHA / VER DETALLES 👇
  const handleDetailOpen = () => {
    void registrarEvento(business.name, 'detail_view');
  };

  // 👇 CLIC EN BOLITA TELÉFONO 👇
  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void registrarEvento(`Telefono - ${business.name}`, 'detail_reserve_click');
  };

  // 👇 FUNCIÓN ESPÍA BLINDADA WHATSAPP 👇
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que al darle al WhatsApp te mande a "Ver Detalles"

    void registrarEvento(`WhatsApp - ${business.name}`, 'detail_reserve_click');

    const whatsappUrl = `https://wa.me/${business.whatsapp}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  // 👆 FIN DEL ESPÍA 👆

  const isSponsored = business.adLevel !== AdLevel.NONE;

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
            {/* NUEVA ESTRELLA AUTÓNOMA AQUÍ AL LADO DEL NOMBRE */}
            <BusinessRating businessId={business.id} />
          </div>

          {/* CATEGORÍA Y DIRECCIÓN GRIS */}
          <p className="text-slate-500 font-bold text-sm mb-6">
            {(() => {
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
            })()} • {business.address}
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
