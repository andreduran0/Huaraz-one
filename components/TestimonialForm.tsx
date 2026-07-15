import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAppContext } from '../context/AppContext';

interface TestimonialFormProps {
  businessId: string;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ businessId }) => {
  const { language } = useAppContext();
  const t = (es: string, en: string) => language === 'es' ? es : en;

  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  // 👇 NUEVOS ESTADOS PARA LAS ESTRELLAS 👇
  const [rating, setRating] = useState(5); 
  const [hover, setHover] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([
          { 
            business_id: businessId, 
            user_name: userName, 
            comment: comment,
            rating: rating, // 👈 AQUÍ ENVIAMOS EL PUNTAJE A LA BASE DE DATOS
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // Mostrar pantalla de éxito y resetear formulario
      setSubmitted(true);
      setUserName('');
      setComment('');
      setRating(5); // 👈 Volvemos a poner las 5 estrellas por defecto
    } catch (error) {
      console.error("Error al enviar testimonio:", error);
      alert(t("Hubo un error. Intenta nuevamente.", "There was an error. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl text-center space-y-4 animate-fadeIn shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-2xl mb-2">
          <i className="fas fa-check"></i>
        </div>
        <h4 className="font-black text-emerald-800 uppercase tracking-tight text-xl italic">
          {t("¡Gracias por tu opinión!", "Thank you for your review!")}
        </h4>
        <p className="text-emerald-600 text-sm font-medium leading-relaxed max-w-xs mx-auto">
          {t(
              "Tu comentario ha sido enviado y está en revisión por nuestro equipo antes de ser publicado.", 
              "Your comment has been submitted and is under review by our team before being published."
          )}
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-700 transition-colors"
        >
          {t("Escribir otro mensaje", "Write another message")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 space-y-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#2A4D69] flex items-center justify-center text-white shadow-md">
          <i className="fas fa-pen text-sm"></i>
        </div>
        <h4 className="font-black text-slate-800 uppercase italic tracking-tight text-xl">
          {t("Deja tu reseña", "Leave your review")}
        </h4>
      </div>
      
      <div className="relative z-10 space-y-4">
          <input 
            type="text" 
            placeholder={t("Tu nombre o apodo", "Your name or nickname")} 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 focus:border-[#2A4D69] focus:ring-1 focus:ring-[#2A4D69] outline-none text-sm font-medium transition-all bg-white"
            required
            disabled={isSubmitting}
          />

          {/* 👇 SELECTOR DE ESTRELLAS INTERACTIVO 👇 */}
          <div className="w-full p-4 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {t("Califica tu experiencia", "Rate your experience")}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <i 
                    className={`fas fa-star text-3xl transition-colors ${
                      star <= (hover || rating) 
                        ? 'text-[#F58220] opacity-100' // Color naranja Huaraz Explorer
                        : 'text-slate-200 opacity-50'
                    }`}
                  ></i>
                </button>
              ))}
            </div>
          </div>
          {/* 👆 FIN DEL SELECTOR 👆 */}

          <textarea 
            placeholder={t("¿Qué te pareció este lugar? Cuéntanos tu experiencia...", "What did you think of this place? Tell us your experience...")} 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-2xl border border-slate-200 focus:border-[#2A4D69] focus:ring-1 focus:ring-[#2A4D69] outline-none resize-none text-sm font-medium transition-all bg-white"
            required
            disabled={isSubmitting}
          />

          <button 
            type="submit" 
            disabled={isSubmitting || !userName.trim() || !comment.trim()}
            className="w-full bg-[#2A4D69] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95 shadow-[0_10px_20px_rgba(42,77,105,0.2)]"
          >
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              t("Enviar para revisión", "Submit for review")
            )}
          </button>
      </div>
      
      <p className="text-center text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] mt-4 relative z-10">
        {t("Huaraz Explorer validará este comentario", "Huaraz Explorer will validate this comment")}
      </p>
    </form>
  );
};

export default TestimonialForm;
