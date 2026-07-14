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
        
        {/* TARJETAS DE PLANES (Limpias, sin mencionar Octorate) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12 text-left items-center">
          
          <PlanCard
            title="Plan Flex"
            price="S/ 80"
            subtitle="Mensual (Tras prueba gratuita)"
            features={[
              "7 días de prueba gratuita sin compromiso.",
              "Vitrina Digital completa: Mapa interactivo, Calendario y Cuponera.",
              "Guía 24/7 incluido para soporte constante.",
              "IA Arkaiko: Modelo transaccional por comisiones de venta."
            ]}
          />

          <PlanCard
            title="Plan Fundador"
            price="S/ 400"
            subtitle="Anual (Pago Único)"
            features={[
              "Presencia física en 600 mapas A1 (Distribución estratégica en la región).",
              "Vitrina Digital Pro: Mapa interactivo, Calendario y Cuponera.",
              "Guía 24/7 y acceso prioritario a la Bolsa de Trabajo.",
              "IA Arkaiko: Modelo híbrido (Pago fijo anual + comisión por venta)."
            ]}
            isPremium
          />

        </div>
        
        {/* NOTA DE COMISIONES (TRANSPARENCIA) */}
        <div className="mt-12 mb-16 max-w-3xl mx-auto text-center">
          <p className="text-slate-500 text-xs font-bold leading-relaxed">
            <span className="text-[#2A4D69] uppercase">Transparencia:</span> Todos nuestros modelos incluyen nuestro ecosistema de IA generadora de ventas. Solo cobramos una comisión si concretamos una reserva a través de la plataforma: <strong className="text-[#F58220]">5% (Restaurantes) • 10% (Hoteles) • 15% (Agencias de Tour)</strong>.
          </p>
        </div>

        {/* MÓDULO SEPARADO: OCTORATE (Exclusivo Hoteles) */}
        <div className="bg-[#2A4D69] rounded-[3rem] p-10 md:p-12 text-left shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3 space-y-4">
                    <span className="bg-[#F58220] text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Servicio Adicional</span>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">¿Tienes un Hotel o Alojamiento?</h3>
                    <p className="text-white/80 leading-relaxed font-medium text-sm">
                        Evita el overbooking y el estrés operativo. Además de Huaraz Explorer, te ofrecemos la <strong>gestión e integración completa con Octorate (Channel Manager)</strong> para que sincronices tus reservas de Airbnb, Booking y Expedia en una sola pantalla.
                    </p>
                </div>
                <div className="md:w-1/3 w-full text-center md:text-right">
                    <button className="w-full md:w-auto bg-white text-[#2A4D69] font-black uppercase tracking-[0.2em] text-xs px-8 py-5 rounded-[2rem] hover:bg-slate-100 transition-all shadow-lg hover:scale-105">
                        COTIZAR INTEGRACIÓN
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OnboardingPage;
