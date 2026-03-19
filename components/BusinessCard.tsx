import React from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {

  // 👇 LA FUNCIÓN ESPÍA QUE YA FUNCIONA PERFECTO 👇
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group flex flex-col h-full">

      {/* 👇 ZONA 1: CLICKEABLE PARA ENTRAR A VER QUÉ HAY ADENTRO 👇 */}
      <Link to={`/business/${business.id}`} className="flex-grow block relative cursor-pointer">
        <div className="relative h-56 overflow-hidden">
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase drop-shadow-md">{business.name}</h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 font-medium">{business.description}</p>
        </div>
      </Link>

      {/* 👇 ZONA 2: LOS BOTONES ORIGINALES (LLAMADA, WHATSAPP, DETALLES) 👇 */}
      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center gap-3">

          {/* BOTÓN 1: Símbolo de Llamada */}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-12 flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-[#2A4D69] dark:text-slate-300 rounded-xl flex items-center justify-center text-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-90"
              title="Llamar"
            >
              <i className="fas fa-phone"></i>
            </a>
          )}

          {/* BOTÓN 2: WhatsApp con el Espía */}
          {business.whatsapp && (
            <button
              onClick={handleWhatsAppClick}
              className="flex-grow bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] md:text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              WhatsApp
            </button>
          )}

          {/* BOTÓN 3: Ver Detalles */}
          <Link
            to={`/business/${business.id}`}
            className="flex-grow bg-[#2A4D69] hover:bg-[#1a3346] text-white font-black uppercase tracking-widest text-[10px] md:text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md"
          >
            Detalles <i className="fas fa-arrow-right"></i>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default BusinessCard;