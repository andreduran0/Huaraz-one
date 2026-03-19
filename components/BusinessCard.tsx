import React from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useTranslations } from '../hooks/useTranslations'; // 👈 Agregamos el traductor
import { Business, AdLevel } from '../types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations(); // 👈 Activamos el traductor

  // 👇 FUNCIÓN ESPÍA BLINDADA (Tuya de hace 17 horas) 👇
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que al darle al WhatsApp te mande a "Ver Detalles"

    const registrarClic = async () => {
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
          await supabase.from('clicks_log').insert([{ business_name: business.name }]);
        }
      } catch (error) {
        console.error("Error silencioso del espía:", error);
      }
    };

    registrarClic();

    const whatsappUrl = `https://wa.me/${business.whatsapp}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  // 👆 FIN DEL ESPÍA 👆

  const isSponsored = business.adLevel !== AdLevel.NONE;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">

      {/* 📸 FOTO SUPERIOR CLICKEABLE */}
      <Link to={`/business/${business.id}`} className="block relative">
        <div className="h-48 w-full relative">
          <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />

          {/* ETIQUETA DE PATROCINADO (Ahora con traductor) */}
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
        <Link to={`/business/${business.id}`} className="block flex-grow">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-2xl font-black text-[#2A4D69] leading-tight">
              {business.name}
            </h3>
            {/* LA ESTRELLITA */}
            <div className="flex items-center gap-1 text-[#F58220] font-bold text-lg shrink-0">
              <i className="fas fa-star"></i> 4.8
            </div>
          </div>

          {/* CATEGORÍA Y DIRECCIÓN GRIS (Ahora con traductor) */}
          <p className="text-slate-500 font-bold text-sm mb-6">
            {t(`category.${business.category}` as any) || business.category} • {business.address}
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
                onClick={(e) => e.stopPropagation()}
                className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-[#2A4D69] hover:bg-slate-50 transition-colors active:scale-90"
              >
                <i className="fas fa-phone"></i>
              </a>
            )}

            {/* BOTÓN WHATSAPP CIRCULAR VERDE */}
            {business.whatsapp && (
              <button
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