import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usamos la misma configuración segura que usaste para el espía de clics
const supabaseUrl = import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

interface BusinessRatingProps {
  businessId: string;
}

const BusinessRating: React.FC<BusinessRatingProps> = ({ businessId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        // Va directo a la base de datos a preguntar solo por este negocio
        const { data, error } = await supabase
          .from('businesses')
          .select('rating')
          .eq('id', businessId)
          .single();

        if (!error && data && data.rating && data.rating > 0) {
          setRating(data.rating);
        }
      } catch (error) {
        console.error("Error obteniendo la estrella:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [businessId]);

  if (loading) {
    return <div className="text-gray-300 text-sm">...</div>; // Muestra unos puntitos mientras carga
  }

  return (
    <div className="flex items-center gap-1 text-[#F58220] font-bold text-lg shrink-0">
      <i className="fas fa-star"></i> 
      {rating ? <span>{rating.toFixed(1)}</span> : <span>Nuevo</span>}
    </div>
  );
};

export default BusinessRating;
