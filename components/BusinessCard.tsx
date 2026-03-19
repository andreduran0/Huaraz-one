import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {

  // 👇 AQUÍ ESTÁ LA FUNCIÓN BLINDADA (CORREGIDA PARA TYPESCRIPT) 👇
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🕵️‍♂️ Lanzamos el rastreador en "segundo plano" para que no crashee nada
    const registrarClic = async () => {
      try {
        // Truco: Silenciamos a TypeScript para leer las llaves reales sin errores
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
        // Si falla, solo lo vemos tú y yo en la consola, la página sigue viva
        console.error("Error silencioso del espía:", error);
      }
    };

    // Disparamos el espía
    registrarClic();

    // 🟢 Abrimos WhatsApp instantáneamente para que el cliente no espere
    const whatsappUrl = `https://wa.me/${business.whatsapp}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  // 👆 FIN DE LA FUNCIÓN BLINDADA 👆

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.photos[0]}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{business.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">{business.description}</p>

        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <i className="fab fa-whatsapp text-xl"></i>
          Contactar
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;