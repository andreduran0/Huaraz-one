import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const PlanCard: React.FC<{
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  isPremium?: boolean;
}> = ({ title, price, subtitle, features, isPremium }) => {
  const t = useTranslations();
  
  const handleSelectPlan = () => {
    // Aquí puedes enlazar al formulario de recolección de datos (País, Rubro, etc.)
    alert(`Iniciando registro para el ${title}`);
  };

  return (
    <div className={`border rounded-[2rem] p-8 flex flex-col shadow-sm transition-all duration-300 hover:shadow-xl ${isPremium ? 'border-[#2A4D69] bg-white scale-105 z-10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
      {isPremium && (
        <span className="text-center bg-[#F58220] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full -mt-12 mx-auto shadow-md">
          Plan Estrella
        </span>
      )}
      
      <h3 className="text-2xl font-black text-[#2A4D69] text-center mt-4 uppercase italic">
        {title}
      </h3>
      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] text-center mt-1">
        {subtitle}
      </p>
      
      <div className="text-center my-8">
        <p className="text-5xl font-black text-slate-800 tracking-tighter">
          {price}
        </p>
      </div>

      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start text-sm font-bold text-slate-600 leading-relaxed">
            <i className="fas fa-check-circle text-[#F58220] mr-3 mt-1 text-lg"></i>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleSelectPlan}
        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all ${
          isPremium 
            ? 'bg-[#2A4D69] text-white hover:bg-[#1a3346] shadow-lg hover:shadow-xl' 
            : 'bg-white text-[#2A4D69] border-2 border-[#2A4D69] hover:bg-slate-50'
        }`}
      >
        SELECCIONAR PLAN
      </button>
    </div>
  );
};

const OnboardingPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto text-center py-20 px-6 font-['Plus_Jakarta_Sans']">
        
        {/* CABECERA */}
        <div className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-[#2A4D69] uppercase italic tracking-tighter">
            Únete a Huaraz Explorer
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
            Elige la modalidad que mejor impulse tu negocio
          </p>
        </div>
        
        {/* TARJETAS DE PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12 text-left items-center">
          
          {/* PLAN FLEX MENSUAL */}
          <PlanCard
            title="Plan Flex"
            price="S/ 80"
            subtitle="Mensual (Tras prueba gratuita)"
            features={[
              "7 días de prueba gratuita sin compromiso.",
              "Vitrina Digital completa: Mapa interactivo, Calendario y Cuponera.",
              "Guía 24/7 incluido para soporte.",
              "IA Arkaiko: Modelo transaccional por comisiones.",
              "Gestión Octorate (Airbnb/Booking) disponible como servicio extra."
            ]}
          />

          {/* PLAN FUNDADOR ANUAL */}
          <PlanCard
            title="Plan Fundador"
            price="S/ 400"
            subtitle="Anual (Pago Único)"
            features={[
              "Presencia física en 600 mapas A1 (Distribución estratégica en la región).",
              "Vitrina Digital Pro: Mapa interactivo, Calendario y Cuponera.",
              "Guía 24/7 y acceso prioritario a la Bolsa de Trabajo.",
              "IA Arkaiko: Modelo híbrido (Pago fijo anual + comisión por venta).",
              "Gestión Octorate (Airbnb/Booking) disponible como servicio extra."
            ]}
            isPremium
          />

        </div>
        
        {/* NOTA DE COMISIONES (TRANSPARENCIA) */}
        <div className="mt-16 bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-3xl mx-auto">
          <p className="text-slate-500 text-xs md:text-sm font-bold leading-relaxed">
            <i className="fas fa-info-circle text-[#2A4D69] mr-2"></i>
            <span className="text-[#2A4D69] font-black uppercase">Transparencia de Comisiones:</span> Todos nuestros modelos incluyen nuestro ecosistema de IA generadora de ventas. Solo cobramos una comisión por venta concretada a través de la plataforma: <strong className="text-[#F58220]">5% (Restaurantes) • 10% (Hoteles) • 15% (Agencias de Tour)</strong>. Tú conservas el control total.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
