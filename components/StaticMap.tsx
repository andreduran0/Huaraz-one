import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Business, BusinessCategory, AdLevel } from '../types';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveMapProps {
    imageUrl?: string;
    businesses: Business[];
    isEditable?: boolean;
    onBusinessMove?: (id: string, lat: number, lng: number) => void;
}

const MAP_BOUNDS = {
    top: -9.4800,    
    bottom: -9.5800, 
    left: -77.5600,  
    right: -77.4800, 
};

const VIRTUAL_WIDTH = 3000;
const VIRTUAL_HEIGHT = 3000;

const getCategoryStyles = (category: BusinessCategory) => {
    switch (category) {
        case BusinessCategory.RESTAURANT: 
        case BusinessCategory.POLLERIA: 
            return { icon: 'fa-utensils', color: 'bg-brand-orange', border: 'border-orange-200' };
        case BusinessCategory.HOTEL: 
            return { icon: 'fa-bed', color: 'bg-brand-blue', border: 'border-blue-200' };
        // Fixed typo: TOURIT_SPOT -> TOURIST_SPOT
        case BusinessCategory.TOURIST_SPOT: 
            return { icon: 'fa-camera-retro', color: 'bg-emerald-500', border: 'border-emerald-200' };
        default: 
            return { icon: 'fa-map-marker-alt', color: 'bg-brand-dark-blue', border: 'border-slate-300' };
    }
};

export default function StaticMap({ businesses, isEditable, onBusinessMove, imageUrl = "https://i.imgur.com/uweRYKK.jpeg" }: InteractiveMapProps) {
    const t = useTranslations();
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
    const [draggedBusinessId, setDraggedBusinessId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    
    const mapRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastTouchDist = useRef<number | null>(null);

    const setInitialView = useCallback(() => {
        if (!mapRef.current) return;
        const container = mapRef.current;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        if (containerWidth === 0 || containerHeight === 0) return;

        const initialScale = Math.min(containerWidth, containerHeight) / 1000; 
        const initialX = (containerWidth - VIRTUAL_WIDTH * initialScale) / 2;
        const initialY = (containerHeight - VIRTUAL_HEIGHT * initialScale) / 2;
        setTransform({ scale: initialScale, x: initialX, y: initialY });
    }, []);

    useEffect(() => {
        setInitialView();
    }, [setInitialView]);

    const latLngToPixels = (lat: number, lng: number) => {
        const x = ((lng - MAP_BOUNDS.left) / (MAP_BOUNDS.right - MAP_BOUNDS.left)) * VIRTUAL_WIDTH;
        const y = ((lat - MAP_BOUNDS.top) / (MAP_BOUNDS.bottom - MAP_BOUNDS.top)) * VIRTUAL_HEIGHT;
        return { x, y };
    };

    const pixelsToLatLng = (x: number, y: number) => {
        const lng = (x / VIRTUAL_WIDTH) * (MAP_BOUNDS.right - MAP_BOUNDS.left) + MAP_BOUNDS.left;
        const lat = (y / VIRTUAL_HEIGHT) * (MAP_BOUNDS.bottom - MAP_BOUNDS.top) + MAP_BOUNDS.top;
        return { lat, lng };
    };

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
        const isTouch = 'touches' in e;
        
        if (isTouch && e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            
            if (lastTouchDist.current !== null) {
                const delta = dist / lastTouchDist.current;
                const newScale = Math.min(Math.max(0.1, transform.scale * delta), 10);
                const rect = mapRef.current!.getBoundingClientRect();
                const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
                const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
                const newX = midX - (midX - transform.x) * (newScale / transform.scale);
                const newY = midY - (midY - transform.y) * (newScale / transform.scale);
                setTransform({ scale: newScale, x: newX, y: newY });
            }
            lastTouchDist.current = dist;
            return;
        }

        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;

        if (draggedBusinessId && isEditable && onBusinessMove && mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const contentX = (clientX - rect.left - transform.x) / transform.scale;
            const contentY = (clientY - rect.top - transform.y) / transform.scale;
            const { lat, lng } = pixelsToLatLng(contentX, contentY);
            onBusinessMove(draggedBusinessId, lat, lng);
            return;
        }

        if (isPanning.current) {
            const dx = clientX - lastPos.current.x;
            const dy = clientY - lastPos.current.y;
            setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
            lastPos.current = { x: clientX, y: clientY };
        }
    };

    const handleGlobalUp = () => {
        isPanning.current = false;
        setDraggedBusinessId(null);
        lastTouchDist.current = null;
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('touchmove', handleGlobalMove, { passive: false });
        window.addEventListener('touchend', handleGlobalUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, [draggedBusinessId, isEditable, transform]);

    const handleMarkerDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.stopPropagation();
        if (isEditable) {
            setDraggedBusinessId(id);
            setActiveBusiness(null);
        } else {
            const business = businesses.find(b => b.id === id);
            if (business) {
                setActiveBusiness(business);
            }
        }
    };

    const handleMapDown = (e: React.MouseEvent | React.TouchEvent) => {
        const isTouch = 'touches' in e;
        if (isTouch && e.touches.length === 2) return;

        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        isPanning.current = true;
        lastPos.current = { x: clientX, y: clientY };
        
        if (!isEditable) setActiveBusiness(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleFactor = 1.1;
        const newScale = e.deltaY < 0 ? transform.scale * scaleFactor : transform.scale / scaleFactor;
        const clampedScale = Math.min(Math.max(0.1, newScale), 10); 
        
        if (mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
            const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);
            setTransform({ scale: clampedScale, x: newX, y: newY });
        }
    };

    const filteredBusinesses = filter === 'all' 
        ? businesses 
        : businesses.filter(b => b.category === filter);

    return (
        <div
            ref={mapRef}
            className={`w-full h-full overflow-hidden relative bg-[#f1f5f9] dark:bg-gray-950 select-none touch-none ${isEditable ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
            onWheel={handleWheel}
            onMouseDown={handleMapDown}
            onTouchStart={handleMapDown}
        >
            <style>
                {`
                @keyframes marker-appear {
                    0% { transform: translate(-50%, -80%) scale(0.5); opacity: 0; }
                    60% { transform: translate(-50%, -105%) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
                }
                .marker-animate { animation: marker-appear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                
                @keyframes bounce-small {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .marker-hover:hover { animation: bounce-small 0.6s ease infinite; }

                @keyframes ripple {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .marker-ripple::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 9999px;
                    border: 4px solid currentColor;
                    animation: ripple 2s infinite;
                }
                `}
            </style>
            
            <div
                className="relative origin-top-left will-change-transform"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    width: `${VIRTUAL_WIDTH}px`,
                    height: `${VIRTUAL_HEIGHT}px`,
                }}
            >
                {/* Background Map Image with nicer tint */}
                <img 
                    src={imageUrl} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000" 
                    alt="Huaraz Map"
                    style={{ filter: 'contrast(1.05) saturate(1.1)' }}
                />

                {filteredBusinesses.map((business) => {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const isActive = activeBusiness?.id === business.id;
                    const isDraggingThis = draggedBusinessId === business.id;
                    const style = getCategoryStyles(business.category);
                    const isPremium = business.adLevel === AdLevel.PREMIUM;
                    const isCumbre = business.id === '1';
                    
                    return (
                        <div 
                            key={business.id}
                            className={`absolute marker-animate ${isActive || isDraggingThis ? 'z-[100]' : (isPremium ? 'z-40' : 'z-10')}`}
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -100%)' }}
                        >
                            {/* Interactive Zone */}
                            <div 
                                className="absolute inset-x-[-20px] top-[-60px] bottom-0 cursor-pointer z-[110]" 
                                onMouseDown={(e) => handleMarkerDown(e, business.id)}
                                onTouchStart={(e) => handleMarkerDown(e, business.id)}
                            />

                            <div className={`relative flex flex-col items-center marker-hover transition-transform duration-300 ${isActive ? 'scale-125' : ''}`}>
                                
                                {/* Pin Body */}
                                <div className={`
                                    relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 border-white
                                    ${style.color} text-white transition-all
                                    ${isCumbre ? 'w-20 h-20 marker-ripple ring-8 ring-brand-orange/20' : ''}
                                `}>
                                    <i className={`fas ${style.icon} ${isCumbre ? 'text-3xl' : 'text-xl'}`}></i>
                                    
                                    {/* Premium Star */}
                                    {isPremium && (
                                        <div className="absolute -top-1 -right-1 bg-brand-accent w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                            <i className="fas fa-star text-brand-dark-blue text-[8px]"></i>
                                        </div>
                                    )}
                                </div>

                                {/* Pin Tail */}
                                <div className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] -mt-1 shadow-xl
                                    ${style.color === 'bg-brand-orange' ? 'border-t-brand-orange' : 
                                      style.color === 'bg-brand-blue' ? 'border-t-brand-blue' : 
                                      style.color === 'bg-emerald-500' ? 'border-t-emerald-500' : 'border-t-brand-dark-blue'}
                                `}></div>

                                {/* Shadow */}
                                <div className="w-4 h-1 bg-black/20 rounded-full blur-[2px] mt-1"></div>
                                
                                {/* Mini Label for important places */}
                                {(isPremium || transform.scale > 1.5) && (
                                    <div className="absolute top-full mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-3 py-1 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 pointer-events-none">
                                        <p className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-brand-dark-blue dark:text-white">
                                            {business.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FLOATING UI CONTROLS */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl shadow-2xl p-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'all' ? 'bg-brand-dark-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        Todos
                    </button>
                    {Object.values(BusinessCategory).map(cat => (
                         <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat ? 'bg-brand-dark-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {t(`category.${cat}` as any)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ZOOM CONTROLS - Modern glass look */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-[100]">
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale * 1.5, 10) }))} 
                    className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center text-brand-dark-blue dark:text-white border border-white/20 dark:border-gray-800 active:scale-90 transition-all"
                >
                    <i className="fas fa-plus"></i>
                </button>
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale / 1.5, 0.1) }))} 
                    className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center text-brand-dark-blue dark:text-white border border-white/20 dark:border-gray-800 active:scale-90 transition-all"
                >
                    <i className="fas fa-minus"></i>
                </button>
                <button 
                    onClick={setInitialView} 
                    className="w-16 h-16 bg-brand-orange text-white rounded-3xl shadow-2xl flex items-center justify-center active:scale-90 transition-all shadow-orange-500/30"
                >
                    <i className="fas fa-expand-arrows-alt"></i>
                </button>
            </div>

            {/* SELECTED BUSINESS CARD - Modern Ticket Slide-up */}
            {activeBusiness && !isEditable && (
                <div 
                    className="absolute bottom-10 left-6 right-6 md:left-auto md:right-10 md:w-[450px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] z-[150] animate-slideUp overflow-hidden border border-gray-100 dark:border-gray-800"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <div className="flex h-44">
                        <div className="w-1/3 h-full relative overflow-hidden group">
                            <img src={activeBusiness.photos[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={activeBusiness.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            {/* Fixed "Cannot find name 'isPremium'" by checking activeBusiness property directly */}
                            {activeBusiness.adLevel === AdLevel.PREMIUM && (
                                <div className="absolute top-3 left-3 bg-brand-orange text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest border border-white/20">Premium</div>
                            )}
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-4">
                                <div className="min-w-0 flex-grow">
                                    <p className="text-[9px] text-brand-orange font-black uppercase tracking-[0.3em] mb-1">
                                        {t(`category.${activeBusiness.category}` as any)}
                                    </p>
                                    <h4 className="font-black text-2xl text-brand-dark-blue dark:text-white truncate uppercase italic tracking-tighter leading-none mb-2">{activeBusiness.name}</h4>
                                    <p className="text-[10px] text-gray-400 truncate font-bold uppercase tracking-widest flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt"></i> {activeBusiness.address}
                                    </p>
                                </div>
                                <button onClick={() => setActiveBusiness(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <i className="fas fa-times-circle text-2xl"></i>
                                </button>
                            </div>
                            <Link 
                                to={`/business/${activeBusiness.id}`} 
                                className="w-full bg-brand-dark-blue hover:bg-brand-blue text-white text-[11px] py-4 rounded-2xl transition-all font-black text-center mt-4 flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest active:scale-95"
                            >
                                <span>Ver detalles</span>
                                <i className="fas fa-arrow-right text-[9px]"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
