
import React, { useState, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { events } from '../data/events';

const CalendarPage: React.FC = () => {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthEvents = useMemo(() => {
      const monthPrefix = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return events
        .filter(e => e.date.startsWith(monthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date));
  }, [currentDate]);

  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  return (
    <div className="bg-[#050505] min-h-screen pb-32 font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      
      {/* 1. HERO SECTION - DARK & NEON */}
      <section className="relative bg-[#0A0A0A] pt-24 pb-40 rounded-b-[4rem] px-6 text-center border-b border-[#39FF14]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow Backgrounds */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#39FF14]/10 border border-[#39FF14]/30 px-5 py-2 rounded-full mb-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <span className="text-[10px] font-black text-[#39FF14] uppercase tracking-[0.2em]">Tradiciones Huaracinas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              Calendario <br /> <span className="text-[#39FF14]">Festivo</span>
            </h1>
            <p className="text-gray-500 max-w-md mx-auto text-sm font-medium tracking-wide uppercase">
                Descubre el alma de Huaraz a través de sus fiestas y celebraciones milenarias.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-24 max-w-4xl relative z-20">
        
        {/* 2. CALENDAR CARD */}
        <div className="bg-[#0D0D0D] rounded-[3rem] shadow-2xl overflow-hidden border border-[#39FF14]/20">
          
          {/* Header Calendario */}
          <div className="p-8 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-transparent via-[#39FF14]/5 to-transparent">
            <div>
                <p className="text-[10px] font-black text-[#39FF14] uppercase tracking-[0.4em] mb-1">Selecciona Fecha</p>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                {t(`month.${currentDate.getMonth()}` as any)} <span className="text-gray-600">{currentDate.getFullYear()}</span>
                </h2>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrevMonth} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all flex items-center justify-center shadow-lg">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button onClick={handleNextMonth} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all flex items-center justify-center shadow-lg">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Grid Calendario */}
          <div className="p-8">
            <div className="grid grid-cols-7 mb-6 text-center">
              {daysOfWeek.map(d => (
                <div key={d} className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
              {days.map(day => {
                const dateKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const hasEvent = events.some(e => e.date === dateKey);
                const isSelected = selectedDate === dateKey;
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-base relative transition-all group ${
                      isSelected 
                      ? 'bg-[#39FF14] text-black shadow-[0_0_25px_rgba(57,255,20,0.5)] scale-110 z-10' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <span className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-[#39FF14] shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. EVENT LIST SECTION */}
        <div className="mt-20 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                {selectedDate ? 'Detalles del' : 'Eventos de'} <span className="text-[#39FF14]">{selectedDate ? 'Día' : 'Mes'}</span>
            </h3>
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#39FF14] transition-colors"
                >
                    Ver todo el mes <i className="fas fa-redo-alt ml-1"></i>
                </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {(selectedDate ? selectedEvents : monthEvents).map((event, idx) => (
                <div 
                    key={idx} 
                    className="group bg-[#0D0D0D] p-8 rounded-[2.5rem] shadow-xl border border-white/5 flex flex-col md:flex-row gap-8 items-start hover:border-[#39FF14]/30 transition-all duration-500 relative overflow-hidden"
                >
                    {/* Event Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex-shrink-0 w-24 h-24 bg-[#050505] rounded-3xl flex flex-col items-center justify-center border border-white/10 shadow-inner group-hover:border-[#39FF14]/40 transition-colors">
                        <span className="text-4xl font-black text-[#39FF14] italic">
                        {event.date.split('-')[2]}
                        </span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">
                        {t(`month.${parseInt(event.date.split('-')[1]) - 1}` as any).substring(0, 3)}
                        </span>
                    </div>

                    <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-[#39FF14]/10 text-[#39FF14] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#39FF14]/20">
                                {event.type}
                            </span>
                            {event.time && (
                                <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                                    <i className="far fa-clock mr-1 text-[#39FF14]"></i> {event.time}
                                </span>
                            )}
                        </div>
                        
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-[#39FF14] transition-colors">
                            {event.title}
                        </h4>
                        
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            {event.description}
                        </p>

                        {event.location && (
                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-8 h-8 rounded-xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] text-xs">
                                <i className="fas fa-location-dot"></i>
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                {event.location}
                            </span>
                        </div>
                        )}
                    </div>

                    <button className="absolute bottom-8 right-8 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-all active:scale-95">
                        <i className="fas fa-share-alt"></i>
                    </button>
                </div>
            ))}

            {(selectedDate ? selectedEvents : monthEvents).length === 0 && (
                <div className="py-24 text-center bg-[#0D0D0D] rounded-[3.5rem] border border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-700">
                        <i className="fas fa-calendar-times text-4xl"></i>
                    </div>
                    <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs italic">No hay eventos para esta fecha</p>
                </div>
            )}
          </div>
        </div>

        {/* 4. NEWSLETTER / PROMO BOX */}
        <div className="mt-20 bg-gradient-to-br from-[#0D0D0D] to-[#050505] rounded-[3.5rem] p-12 border border-[#39FF14]/20 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/10 blur-[100px] pointer-events-none"></div>
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">¿No quieres perderte <span className="text-[#39FF14]">nada?</span></h3>
             <p className="text-gray-400 text-sm font-medium mb-10 max-w-md mx-auto leading-relaxed">Suscríbete para recibir alertas de las fiestas patronales y eventos culturales de Huaraz directamente en tu correo.</p>
             <button className="bg-[#39FF14] text-black px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all">
                Activar Alertas Festivas <i className="fas fa-bolt ml-2"></i>
             </button>
        </div>

      </div>

      <div className="py-20 text-center">
         <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.5em] italic">Huaraz Explorer Network • Event Calendar 2026</p>
      </div>
    </div>
  );
};

export default CalendarPage;
