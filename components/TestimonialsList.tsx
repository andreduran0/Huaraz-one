import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAppContext } from '../context/AppContext';

interface TestimonialsListProps {
  businessId: string;
}

const TestimonialsList: React.FC<TestimonialsListProps> = ({ businessId }) => {
  const { language } = useAppContext();
  const t = (es: string, en: string) => language === 'es' ? es : en;
  
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('business_id', businessId)
          .eq('status', 'approved') // ¡Aquí está la magia de tu curaduría!
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error("Error cargando testimonios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <i className="fas fa-spinner fa-spin text-2xl text-[#2A4D69]"></i>
      </div>
    );
  }

  // Si no hay comentarios aprobados, no mostramos nada para no dejar espacios vacíos
  if (testimonials.length === 0) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center gap-4 px-4">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {t('Experiencias', 'Experiences')} <span className="text-[#F58220]">{t('Verificadas', 'Verified')}</span>
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
            {testimonials.map((testimonio) => (
                <div key={testimonio.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group hover:shadow-xl transition-all">
                    <i className="fas fa-quote-right absolute top-8 right-8 text-slate-100 dark:text-slate-800 text-4xl -z-10 group-hover:scale-110 transition-transform"></i>
                    
                    {/* Estrellas Curadas (Fijas en 5 para dar la mejor imagen, ya que tú las apruebas) */}
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i key={star} className="fas fa-star text-yellow-400 text-sm"></i>
                        ))}
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mb-6">
                        "{testimonio.comment}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#2A4D69] dark:text-white font-black uppercase">
                            {testimonio.user_name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">{testimonio.user_name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                                {t('Viajero Verificado', 'Verified Traveler')}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default TestimonialsList;
