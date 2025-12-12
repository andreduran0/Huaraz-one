
import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { events, Event } from '../data/events';

const CalendarPage: React.FC = () => {
  const t = useTranslations();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start Jan 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

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
    setSelectedDate(fullDate);
  };

  const getEventsForDay = (day: number) => {
    const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const fullDate = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;
    return events.filter(e => e.date === fullDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : [];

  return (
    <div className="pb-6 bg-background-light dark:bg-background-dark min-h-full">
      {/* Andean Inspired Header */}
      <div className="relative bg-brand-dark-blue dark:bg-gray-900 pb-8 pt-4 rounded-b-[2rem] shadow-lg overflow-hidden">
        {/* Decorative Manta Andina Pattern (CSS Gradient) */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-pink-500 to-purple-600"></div>
        <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-70"></div>
        
        <div className="px-4 text-center relative z-10 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{t('calendar.title')}</h1>
            <p className="text-brand-green text-sm font-medium mb-3">Descubre las tradiciones de Huaraz</p>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <p className="text-white text-sm md:text-base font-extrabold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
                    Huaraz-Ancash el mejor destino turístico del mundo
                </p>
            </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 mt-6">
            <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="fas fa-chevron-left"></i>
            </button>
            <h2 className="text-3xl font-bold text-white tracking-wide">
                {months[currentDate.getMonth()]} <span className="text-lg font-light text-gray-300">{currentDate.getFullYear()}</span>
            </h2>
            <button onClick={handleNextMonth} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mx-4 -mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 relative z-20">
        <div className="grid grid-cols-7 mb-4 text-center">
            {daysOfWeek.map(day => (
                <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {day}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center">
            {blanks.map(blank => (
                <div key={`blank-${blank}`} className="h-10"></div>
            ))}
            {days.map(day => {
                const dayEvents = getEventsForDay(day);
                const hasEvent = dayEvents.length > 0;
                const isSelected = selectedDate === `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

                return (
                    <button 
                        key={`day-${day}`} 
                        onClick={() => handleDateClick(day)}
                        className={`h-10 w-10 mx-auto flex flex-col items-center justify-center rounded-full transition-all relative
                            ${isSelected 
                                ? 'bg-brand-orange text-white shadow-md scale-110' 
                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }
                            ${hasEvent && !isSelected ? 'font-bold text-brand-dark-blue dark:text-brand-green' : ''}
                        `}
                    >
                        <span>{day}</span>
                        {hasEvent && !isSelected && (
                            <div className="absolute bottom-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        )}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 pl-2 border-l-4 border-brand-orange">
            {selectedDate ? (
                new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            ) : (
                'Selecciona una fecha'
            )}
        </h3>

        <div className="space-y-3">
            {selectedDate ? (
                selectedEvents.length > 0 ? (
                    selectedEvents.map((event, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-pink-500 animate-fade-in-up">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-brand-dark-blue dark:text-brand-blue text-lg">{event.title}</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                                    ${event.type === 'religious' ? 'bg-purple-100 text-purple-700' : 
                                      event.type === 'civic' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {event.type}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 bg-white/50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p>{t('calendar.noEvents')}</p>
                    </div>
                )
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <i className="fas fa-calendar-alt text-4xl mb-2 opacity-30"></i>
                    <p>Toca un día para ver los eventos</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
