
import React, { useState, useMemo } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { events, Event } from '../data/events';

const CalendarPage: React.FC = () => {
  const t = useTranslations();
  // Iniciamos en Febrero 2026 para mostrar la semana central del Carnaval
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDate = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    
    // Si ya está seleccionado, deseleccionar para mostrar lista del mes
    if (selectedDate === fullDate) {
        setSelectedDate(null);
    } else {
        setSelectedDate(fullDate);
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filtrar eventos del mes actual para la lista general
  const monthEvents = useMemo(() => {
      const monthPrefix = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return events
        .filter(e => e.date.startsWith(monthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date));
  }, [currentDate]);

  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  const getEventForDay = (day: number) => {
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDate = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    return events.filter(e => e.date === fullDate);
  };

  return (
    <div className="pb-32 bg-gray-50 dark:bg-gray-950 min-h-screen">
      
      {/* 1. HEADER & CONTROLES */}
      <div className="relative bg-brand-dark-blue dark:bg-gray-900 pb-20 pt-12 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img src="https://www.transparenttextures.com/patterns/white-diamond.png" className="w-full h-full" alt="texture" />
        </div>

        <div className="px-6 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-3 bg-brand-orange text-white px-5 py-2 rounded-full shadow-lg">
                <i className="fas fa-calendar-star text-[10px]"></i>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('calendar.title')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                {t(`month.${currentDate.getMonth()}` as any)} <span className="text-brand-orange">{currentDate.getFullYear()}</span>
            </h1>
        </div>

        <div className="flex items-center justify-between px-8 mt-12 max-w-lg mx-auto">
            <button 
                onClick={handlePrevMonth} 
                className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all active:scale-90"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            <div className="flex flex-col items-center">
                <span className="text-brand-green font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">
                    {t('calendar.subtitle')}
                </span>
            </div>
            <button 
                onClick={handleNextMonth} 
                className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all active:scale-90"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
      </div>

      {/* 2. CALENDARIO GRID */}
      <div className="mx-6 -mt-12 bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 relative z-20 border border-gray-100 dark:border-gray-800 animate-slideUp">
        <div className="grid grid-cols-7 mb-8 text-center">
            {daysOfWeek.map(day => (
                <div key={day} className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">{day}</div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center">
            {blanks.map(blank => <div key={`blank-${blank}`} className="h-14"></div>)}
            {days.map(day => {
                const dayEvents = getEventForDay(day);
                const hasEvents = dayEvents.length > 0;
                const hasCarnival = dayEvents.some(e => e.type === 'carnival');
                const isSelected = selectedDate === `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                
                return (
                    <div key={`day-container-${day}`} className="relative flex flex-col items-center">
                        <button 
                            onClick={() => handleDateClick(day)} 
                            className={`relative h-14 w-14 flex items-center justify-center rounded-2xl font-black text-sm transition-all duration-300 active:scale-90
                                ${isSelected 
                                    ? 'bg-brand-dark-blue text-white shadow-xl scale-110 z-10' 
                                    : hasCarnival 
                                        ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                            `}
                        >
                            {day}
                            {/* Dot indicator */}
                            {hasEvents && !isSelected && (
                                <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${hasCarnival ? 'bg-brand-orange' : 'bg-brand-blue'}`}></span>
                            )}
                        </button>
                    </div>
                );
            })}
        </div>

        {/* Legend */}
        <div className="mt-10 flex justify-center gap-6 pt-6 border-t dark:border-gray-800">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Carnaval</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Religioso / Otros</span>
            </div>
        </div>
      </div>

      {/* 3. LISTA DE EVENTOS */}
      <div className="px-6 mt-16 max-w-3xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b dark:border-gray-800 pb-4">
            <h3 className="text-2xl font-black text-brand-dark-blue dark:text-white uppercase italic tracking-tighter">
                {selectedDate ? `Eventos del ${selectedDate.split('-').reverse().join('/')}` : `Programa de ${t(`month.${currentDate.getMonth()}` as any)}`}
            </h3>
            {!selectedDate && (
                <span className="text-[9px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/10 px-3 py-1 rounded-full">Próximas fechas</span>
            )}
        </div>

        {(selectedDate ? selectedEvents : monthEvents).length > 0 ? (
            (selectedDate ? selectedEvents : monthEvents).map((event, idx) => (
                <div key={`${event.date}-${idx}`} className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden animate-fadeIn">
                    <div className={`absolute top-0 left-0 w-2 h-full ${event.type === 'carnival' ? 'bg-brand-orange' : 'bg-brand-blue'}`}></div>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${event.type === 'carnival' ? 'text-brand-orange' : 'text-brand-blue'}`}>
                                    {event.date.split('-').reverse().join('/')} • {event.type === 'carnival' ? 'Carnaval Huaracino' : 'Festividad'}
                                </p>
                                <h4 className="font-black text-brand-dark-blue dark:text-white text-2xl md:text-3xl uppercase italic tracking-tighter leading-tight group-hover:text-brand-orange transition-colors">
                                    {event.title}
                                </h4>
                            </div>
                            {event.type === 'carnival' && (
                                <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange shrink-0">
                                    <i className="fas fa-mask text-xl animate-bounce"></i>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            {event.description}
                        </p>

                        <div className="pt-6 border-t dark:border-gray-800 flex flex-wrap gap-4">
                            {event.time && (
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <i className="far fa-clock text-brand-orange"></i>
                                    {event.time}
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <i className="fas fa-location-dot text-brand-blue"></i>
                                    {event.location}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-gray-800">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-calendar-day text-gray-200 text-3xl"></i>
                </div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] max-w-xs mx-auto">
                    {selectedDate ? t('calendar.noEvents') : 'No hay eventos registrados para este mes.'}
                </p>
                <button 
                    onClick={() => setSelectedDate(null)}
                    className="mt-6 text-brand-blue font-black uppercase text-[9px] tracking-widest hover:underline"
                >
                    Ver todo el mes
                </button>
            </div>
        )}
      </div>

      {/* 4. CALL TO ACTION */}
      {!selectedDate && (
          <div className="px-6 mt-16 max-w-3xl mx-auto">
              <div className="bg-brand-dark-blue rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4">¿Tienes un evento en Huaraz?</h4>
                  <p className="text-white/60 text-sm mb-8">Publica tus actividades culturales o turísticas de forma gratuita en nuestra plataforma.</p>
                  <a href="https://wa.me/51937511052" target="_blank" rel="noreferrer" className="bg-brand-orange hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all inline-flex items-center gap-3 active:scale-95">
                      Contactar Soporte <i className="fab fa-whatsapp"></i>
                  </a>
              </div>
          </div>
      )}
    </div>
  );
};

export default CalendarPage;
