// --- CONFIGURACIÓN DE SUPABASE (VERSIÓN SEGURA) ---
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const logClick = async (businessName: string) => {
  // Evitamos enviar datos si estamos usando las llaves de mentira
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return; 
  
  try {
    await supabase.from('clicks_log').insert([{ business_name: businessName }]);
    console.log(`Clic registrado para: ${businessName}`);
  } catch (err) {
    console.error("Error al registrar clic en Supabase:", err);
  }
};
// ---------------------------------------------------

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const t = useTranslations();
  const navigate = useNavigate();
  const categoryKey = `category.${business.category}` as keyof typeof messages.es;
  const isPremium = business.adLevel === AdLevel.PREMIUM;

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que al hacer clic en los botones se abra el detalle
  };

  // --- NUEVA FUNCIÓN PARA EL BOTÓN DE WHATSAPP ---
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que la etiqueta <a> navegue inmediatamente
    e.stopPropagation(); // Evita que se abra el detalle del negocio
    
    // 1. Registramos el clic
    logClick(business.name);
    
    // 2. Abrimos WhatsApp en una pestaña nueva
    const whatsappUrl = `https://wa.me/${business.whatsapp}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  // -----------------------------------------------

  return (
    <div 
      onClick={() => navigate(`/business/${business.id}`)}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={business.photos[0]} 
          alt={business.name}
          className="w-full h-full object-cover"
        />
        {isPremium && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#f59e0b] text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              PATROCINADO
            </span>
          </div>
        )}
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-2xl font-extrabold text-[#2A4D69] dark:text-white leading-tight">
              {business.name}
            </h3>
            <p className="text-slate-400 text-sm font-bold mt-1">
              {t(categoryKey)} • {business.address}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[#f59e0b] font-black text-lg shrink-0">
            <i className="fas fa-star"></i> 4.8
          </div>
        </div>
        
        <div className="border-t border-slate-50 dark:border-slate-800 pt-6 flex items-center justify-between">
          <div className="flex gap-3" onClick={handleContactClick}>
             {business.phone && (
               <a 
                 href={`tel:${business.phone}`}
                 className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 text-[#2A4D69] dark:text-white flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                 <i className="fas fa-phone"></i>
               </a>
             )}
             {business.whatsapp && (
               <a 
                 href={`https://wa.me/${business.whatsapp}`}
                 onClick={handleWhatsAppClick} // <-- ¡EL HACK EN ACCIÓN!
                 target="_blank"
                 rel="noreferrer"
                 className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 text-green-500 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
               >
                 <i className="fab fa-whatsapp text-2xl"></i>
               </a>
             )}
          </div>
          <div className="text-[#2A4D69] dark:text-white font-black text-sm border-b-2 border-[#2A4D69] dark:border-white">
             Ver Detalles
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;