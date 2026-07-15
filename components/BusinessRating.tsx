import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface BusinessRatingProps {
  businessId: string;
}

const BusinessRating: React.FC<BusinessRatingProps> = ({ businessId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndCalculateRating = async () => {
      try {
        // 👇 AQUÍ ESTÁ LA MAGIA: APUNTAMOS A LA TABLA CORRECTA 👇
        const { data, error } = await supabase
          .from('testimonials') 
          .select('rating')
          .eq('business_id', businessId)
          .eq('status', 'approved');

        // Espía para la consola
        console.log(`🔍 Buscando estrellas para: ${businessId}`, data);
        if (error) console.error(`❌ Error al leer Supabase:`, error);

        // Lógica matemática
        if (data && data.length > 0) {
          const totalScore = data.reduce((suma, review) => suma + review.rating, 0);
          const averageScore = totalScore / data.length;
          setRating(Number(averageScore.toFixed(1))); // Redondea a 1 decimal
        } else {
          setRating(null); // Si no hay, muestra "Nuevo"
        }

      } catch (error) {
        console.error("Error crítico en el componente:", error);
        setRating(null);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchAndCalculateRating();
    }
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex items-center text-slate-300 font-black text-lg animate-pulse">
        <i className="fas fa-star mr-1"></i>
        <span>...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-[#F58220] font-black text-lg whitespace-nowrap">
      <i className="fas fa-star mr-1"></i>
      <span>{rating !== null ? rating : 'Nuevo'}</span>
    </div>
  );
};

export default BusinessRating;
