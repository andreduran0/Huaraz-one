
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
    <div className="bg-white min-h-screen pb-32 font-['Plus_Jakarta_Sans'] overflow-x-hidden">
      
      {/* 1. HERO SECTION - NEON & WHITE CLEAN STYLE */}
      <section className="relative bg-white pt-24 pb-40 rounded-b-[4rem] px-6 text-center border-b border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Glow Backgrounds - Suaves sobre blanco */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full mb-2">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tradiciones Huaracinas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Calendario <br /> <span className="text-[#39FF14] drop-shadow-[0_2px_10px_rgba(57,255,20,0.3)]">Festivo</span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto text-sm font-bold tracking-wide uppercase">
                Vive la cultura de Ancash en máxima fidelidad.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-24 max-w-4xl relative z-20">
        
        {/* 2. CALENDAR CARD */}
        <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100">
          
          {/* Header Calendario */}
          <div className="p-10 flex items-center justify-between border-b border-slate-50 bg-[#39FF14]/5">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Filtro de Tiempo</p>
                <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter">
                {t(`month.${currentDate.getMonth()}` as any)} <span className="text-[#39FF14]">{currentDate.getFullYear()}</span>
                </h2>
            </div>
            <div className="flex gap-4">
              <button onClick={handlePrevMonth} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-black hover:bg-[#39FF14] hover:border-[#39FF14] transition-all flex items-center justify-center shadow-sm active:scale-90">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button onClick={handleNextMonth} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-black hover:bg-[#39FF14] hover:border-[#39FF14] transition-all flex items-center justify-center shadow-sm active:scale-90">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Grid Calendario */}
          <div className="p-10">
            <div className="grid grid-cols-7 mb-8 text-center">
              {daysOfWeek.map(d => (
                <div key={d} className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {blanks.map(b => <div key={`b-${b}`} className="aspect-square"></div>)}
              {days.map(day => {
                const dateKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const hasEvent = events.some(e => e.date === dateKey);
                const isSelected = selectedDate === dateKey;
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-lg relative transition-all group ${
                      isSelected 
                      ? 'bg-[#39FF14] text-black shadow-[0_15px_35px_rgba(57,255,20,0.4)] scale-110 z-10' 
                      : 'bg-slate-50 text-slate-400 hover:bg-[#39FF14]/10 hover:text-black border border-slate-100'
                    }`}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <span className="absolute bottom-4 w-2 h-2 rounded-full bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,1)] animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. EVENT LIST SECTION */}
        <div className="mt-24 space-y-10">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-4xl font-black text-black uppercase tracking-tighter italic">
                {selectedDate ? 'Foco en' : 'Eventos de'} <span className="text-[#39FF14]">{selectedDate ? 'el Día' : 'este Mes'}</span>
            </h3>
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-all"
                >
                    Reiniciar <i className="fas fa-redo-alt ml-2"></i>
                </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {(selectedDate ? selectedEvents : monthEvents).map((event, idx) => (
                <div 
                    key={idx} 
                    className="group bg-white p-10 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row gap-10 items-start hover:border-[#39FF14] transition-all duration-500 relative overflow-hidden"
                >
                    {/* Event Sidebar Decor */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-[#39FF14]"></div>

                    <div className="flex-shrink-0 w-28 h-28 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border border-slate-100 shadow-inner group-hover:bg-[#39FF14] transition-all duration-500">
                        <span className="text-5xl font-black text-black italic leading-none">
                        {event.date.split('-')[2]}
                        </span>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 group-hover:text-black">
                        {t(`month.${parseInt(event.date.split('-')[1]) - 1}` as any).substring(0, 3)}
                        </span>
                    </div>

                    <div className="flex-grow space-y-5">
                        <div className="flex flex-wrap gap-3">
                            <span className="bg-black text-[#39FF14] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {event.type}
                            </span>
                            {event.time && (
                                <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                    <i className="far fa-clock mr-2 text-[#39FF14]"></i> {event.time}
                                </span>
                            )}
                        </div>
                        
                        <h4 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-tight">
                            {event.title}
                        </h4>
                        
                        <p className="text-slate-500 text-base leading-relaxed font-medium">
                            {event.description}
                        </p>

                        {event.location && (
                        <div className="flex items-center gap-4 pt-2">
                            <div className="w-10 h-10 rounded-2xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] text-sm">
                                <i className="fas fa-location-dot"></i>
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                {event.location}
                            </span>
                        </div>
                        )}
                    </div>

                    <button className="md:self-center w-16 h-16 rounded-[1.8rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black hover:bg-[#39FF14] transition-all active:scale-90">
                        <i className="fas fa-share-alt text-lg"></i>
                    </button>
                </div>
            ))}

            {(selectedDate ? selectedEvents : monthEvents).length === 0 && (
                <div className="py-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <i className="fas fa-calendar-day text-slate-200 text-5xl"></i>
                    </div>
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm italic">Sin eventos registrados para hoy</p>
                </div>
            )}
          </div>
        </div>

        {/* 4. PROMO BOX - NEON GREEN STYLE */}
        <div className="mt-24 bg-[#39FF14] rounded-[4rem] p-16 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(57,255,20,0.3)]">
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 blur-[100px] pointer-events-none"></div>
             <h3 className="text-4xl font-black text-black uppercase italic tracking-tighter mb-5">¡Vive la fiesta <br/> en primera fila!</h3>
             <p className="text-black/60 text-lg font-bold mb-12 max-w-md mx-auto leading-relaxed">Suscríbete para recibir alertas de las próximas fiestas patronales en tu email.</p>
             <button className="bg-black text-white px-16 py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Unirse a la Red <i className="fas fa-bolt ml-3 text-[#39FF14]"></i>
             </button>
        </div>

      </div>

      <div className="py-32 text-center opacity-40">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] italic">Huaraz Explorer Network • White & Neon v5.0</p>
      </div>
    </div>
  );
};

export default CalendarPage;
