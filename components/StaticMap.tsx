import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Business, BusinessCategory } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveMapProps {
    imageUrl?: string;
    businesses: Business[];
    isEditable?: boolean;
    onBusinessMove?: (id: string, lat: number, lng: number) => void;
    activeCategory?: string;
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
            return { icon: 'fa-utensils', color: 'bg-[#F58220]', text: 'text-white', ring: 'ring-orange-200' };
        case BusinessCategory.HOTEL: 
            return { icon: 'fa-bed', color: 'bg-[#2A4D69]', text: 'text-white', ring: 'ring-blue-200' };
        case BusinessCategory.TOURIST_SPOT: 
            return { icon: 'fa-mountain-sun', color: 'bg-emerald-600', text: 'text-white', ring: 'ring-emerald-200' };
        case BusinessCategory.EDUCATION:
            return { icon: 'fa-user-graduate', color: 'bg-indigo-600', text: 'text-white', ring: 'ring-indigo-200' };
        case BusinessCategory.HEALTH:
            return { icon: 'fa-stethoscope', color: 'bg-red-600', text: 'text-white', ring: 'ring-red-200' };
        // ¡Aquí regresamos el diseño de la Chocolatería!
        case BusinessCategory.CHOCOLATERIA:
            return { icon: 'fa-mug-hot', color: 'bg-[#7B3F00]', text: 'text-white', ring: 'ring-[#D2691E]/40' };
        default: 
            return { icon: 'fa-location-dot', color: 'bg-slate-600', text: 'text-white', ring: 'ring-slate-200' };
    }
};

export default function StaticMap({ 
    businesses, 
    isEditable, 
    onBusinessMove, 
    activeCategory = 'all',
    imageUrl = "https://i.imgur.com/g983bOh.jpeg" 
}: InteractiveMapProps) {
    const navigate = useNavigate();
    const t = useTranslations();
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
    const [userPos, setUserPos] = useState<{lat: number, lng: number} | null>(null);
    const [draggedBusinessId, setDraggedBusinessId] = useState<string | null>(null);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastTouchDist = useRef<number | null>(null);

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

    const handleZoom = useCallback((delta: number) => {
        if (!mapRef.current) return;
        
        const container = mapRef.current.getBoundingClientRect();
        const centerX = container.width / 2;
        const centerY = container.height / 2;

        setTransform(prev => {
            const newScale = Math.min(Math.max(0.2, prev.scale * delta), 8);
            const ratio = newScale / prev.scale;
            const newX = centerX - (centerX - prev.x) * ratio;
            const newY = centerY - (centerY - prev.y) * ratio;

            return { scale: newScale, x: newX, y: newY };
        });
    }, []);

    const centerOnCoords = useCallback((lat: number, lng: number, zoom = 1.2) => {
        if (!mapRef.current) return;
        const container = mapRef.current.getBoundingClientRect();
        const { x, y } = latLngToPixels(lat, lng);
        
        setTransform({
            scale: zoom,
            x: (container.width / 2) - (x * zoom),
            y: (container.height / 2) - (y * zoom)
        });
    }, []);

    const setInitialView = useCallback(() => {
        if (!mapRef.current) return;
        const container = mapRef.current.getBoundingClientRect();
        if (container.width === 0 || container.height === 0) return;

        const initialScale = Math.min(container.width, container.height) / 1000;
        const initialX = (container.width - VIRTUAL_WIDTH * initialScale) / 2;
        const initialY = (container.height - VIRTUAL_HEIGHT * initialScale) / 2;
        setTransform({ scale: initialScale, x: initialX, y: initialY });
    }, []);

    useEffect(() => {
        setInitialView();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                null,
                { enableHighAccuracy: true }
            );
        }
    }, [setInitialView]);

    const handleGlobalMove = useCallback((e: MouseEvent | TouchEvent) => {
        const isTouch = 'touches' in e;
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;

        if (isTouch && e.touches.length === 2) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            
            if (lastTouchDist.current !== null) {
                const delta = dist / lastTouchDist.current;
                handleZoom(delta);
            }
            lastTouchDist.current = dist;
            return;
        }

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
    }, [draggedBusinessId, isEditable, transform, onBusinessMove, handleZoom]);

    const handleGlobalUp = useCallback(() => {
        isPanning.current = false;
        setDraggedBusinessId(null);
        lastTouchDist.current = null;
    }, []);

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
    }, [handleGlobalMove, handleGlobalUp]);

    const handleMarkerClick = (e: React.MouseEvent | React.TouchEvent, business: Business) => {
        e.stopPropagation();
        if (isEditable) {
            setDraggedBusinessId(business.id);
        } else {
            setActiveBusiness(business);
            centerOnCoords(business.lat, business.lng, Math.max(transform.scale, 1.5));
        }
    };

    return (
        <div
            ref={mapRef}
            className="w-full h-full overflow-hidden relative bg-[#050505] select-none touch-none"
            onWheel={(e) => {
                const delta = e.deltaY < 0 ? 1.1 : 0.9;
                handleZoom(delta);
            }}
            onMouseDown={(e) => { 
                isPanning.current = true; 
                lastPos.current = { x: e.clientX, y: e.clientY }; 
            }}
            onTouchStart={(e) => { 
                isPanning.current = true; 
                lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; 
            }}
        >
            <style>
                {`
                .user-pulse {
                    width: 24px;
                    height: 24px;
                    background: #39FF14;
                    border: 4px solid white;
                    border-radius: 50%;
                    position: relative;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.6);
                }
                .user-pulse::after {
                    content: '';
                    position: absolute;
                    inset: -15px;
                    border-radius: 50%;
                    background: #39FF14;
                    opacity: 0.3;
                    animation: pulse-out 2.5s infinite;
                }
                @keyframes pulse-out {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(4); opacity: 0; }
                }
                .map-transition {
                    transition: transform 0.1s linear;
                }
                .marker-label {
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }
                `}
            </style>

            <div
                className="relative origin-top-left will-change-transform map-transition"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    width: `${VIRTUAL_WIDTH}px`,
                    height: `${VIRTUAL_HEIGHT}px`,
                }}
            >
                <img 
                    src={imageUrl} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90" 
                    alt="Terrain Map" 
                    onLoad={setInitialView}
                />

                {userPos && (
                    <div className="absolute z-50" style={{ 
                        left: `${latLngToPixels(userPos.lat, userPos.lng).x}px`, 
                        top: `${latLngToPixels(userPos.lat, userPos.lng).y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}>
                        <div className="user-pulse"></div>
                    </div>
                )}

                {businesses.map((business) => {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const isActive = activeBusiness?.id === business.id;
                    const style = getCategoryStyles(business.category);
                    
                    return (
                        <div 
                            key={business.id}
                            className={`absolute flex items-center justify-center ${isActive ? 'z-[100]' : 'z-10'}`}
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -100%)' }}
                        >
                            <div 
                                onClick={(e) => handleMarkerClick(e, business)}
                                className={`
                                    relative cursor-pointer transition-all duration-300 flex flex-col items-center
                                    ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'}
                                `}
                            >
                                <div className={`
                                    w-14 h-14 rounded-2xl flex items-center justify-center border-[4px] border-white shadow-2xl
                                    ${style.color} ${style.text} ring-4 ${style.ring}
                                    transition-transform
                                `}>
                                    <i className={`fas ${style.icon} text-xl`}></i>
                                </div>
                                <div className={`w-2 h-5 ${style.color} -mt-2 rounded-full shadow-lg border-x-[2px] border-white/40`}></div>

                                {isActive && (
                                    <div className="absolute top-18 bg-white text-[#2A4D69] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl border-2 border-[#2A4D69]/10 marker-label">
                                        {business.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {activeBusiness && (
                <div className="absolute bottom-10 left-6 right-6 md:left-10 md:w-[420px] z-[100] animate-fadeIn">
                    <div className="bg-white rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,0.25)] overflow-hidden border border-slate-100">
                        <div className="relative h-48">
                            <img src={activeBusiness.photos[0]} className="w-full h-full object-cover" alt={activeBusiness.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveBusiness(null); }} 
                                className="absolute top-6 right-6 w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full text-slate-800 flex items-center justify-center border border-white hover:bg-white transition-all shadow-lg"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-10 pt-0 -mt-10 relative z-10">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                                {/* ¡El Atajo Mágico para saltarnos el traductor solo con la chocolatería! */}
                                <span className="bg-[#2A4D69]/10 text-[#2A4D69] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                                    {activeBusiness.category === 'chocolateria' ? 'Chocolatería' : t(`category.${activeBusiness.category}` as any)}
                                </span>
                                <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                                    {activeBusiness.name}
                                </h4>
                                <p className="text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-wider flex items-center gap-2">
                                    <i className="fas fa-map-pin text-[#F58220]"></i> {activeBusiness.address}
                                </p>
                                <button 
                                    onClick={() => navigate(`/business/${activeBusiness.id}`)}
                                    className="w-full mt-8 bg-[#2A4D69] text-white py-6 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Ver Detalles <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-10 right-6 flex flex-col gap-4 z-50">
                <div className="flex flex-col bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 p-2 gap-2">
                    <button 
                        onClick={() => handleZoom(1.4)} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button 
                        onClick={() => handleZoom(0.7)} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                </div>
                <button 
                    onClick={() => {
                        if (userPos) centerOnCoords(userPos.lat, userPos.lng, 2);
                    }} 
                    className="w-16 h-16 bg-[#39FF14] text-black rounded-[2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-105 transition-all active:scale-90"
                    title="Mi ubicación"
                >
                    <i className="fas fa-location-crosshairs text-xl"></i>
                </button>
                <button 
                    onClick={setInitialView} 
                    className="w-16 h-16 bg-[#2A4D69] text-white rounded-[2rem] flex items-center justify-center shadow-xl hover:opacity-90 transition-all active:scale-90"
                    title="Restablecer vista"
                >
                    <i className="fas fa-expand text-xl"></i>
                </button>
            </div>
        </div>
    );
}
