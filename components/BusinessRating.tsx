import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Asegúrate de tener tus variables de entorno configuradas
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
        // 1. Buscamos en la tabla de reseñas ('reviews')
        // Filtramos por el ID del negocio y SOLO las que tengan status 'approved'
        const { data, error } = await supabase
          .from('reviews') // Cambia 'reviews' si tu tabla se llama distinto (ej. 'comentarios')
          .select('rating')
          .eq('business_id', businessId)
          .eq('status', 'approved');

        if (error) {
          throw error;
        }

        // 2. Lógica Matemática: Promediamos si hay reseñas
        if (data && data.length > 0) {
          const totalScore = data.reduce((suma, review) => suma + review.rating, 0);
          const averageScore = totalScore / data.length;
          
          // Redondeamos a un decimal (ej. 4.5, 4.8)
          setRating(Number(averageScore.toFixed(1)));
        } else {
          // Si no hay datos, o la longitud es 0, lo dejamos en null para que diga "Nuevo"
          setRating(null);
        }

      } catch (error) {
        console.error("Error al calcular el rating:", error);
        setRating(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateRating();
  }, [businessId]);

  // Si está cargando, mostramos una estrella en gris tenue para que no brinque la pantalla
  if (loading) {
    return (
      <div className="flex items-center text-slate-300 font-black text-lg animate-pulse">
        <i className="fas fa-star mr-1"></i>
        <span>...</span>
      </div>
    );
  }

  // EL RENDERIZADO FINAL: La inteligencia artificial decide qué mostrar
  return (
    <div className="flex items-center text-[#F58220] font-black text-lg whitespace-nowrap">
      <i className="fas fa-star mr-1"></i>
      {/* Si rating tiene un número, lo muestra. Si es null, dice "Nuevo" */}
      <span>{rating !== null ? rating : 'Nuevo'}</span>
    </div>
  );
};

export default BusinessRating;
