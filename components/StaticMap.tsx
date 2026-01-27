
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
        default: 
            return { icon: 'fa-location-dot', color: 'bg-slate-600', text: 'text-white', ring: 'ring-slate-200' };
    }
};

export default function StaticMap({ 
    businesses, 
    isEditable, 
    onBusinessMove, 
    activeCategory = 'all',
    imageUrl = "https://i.imgur.com/uweRYKK.jpeg" 
}: InteractiveMapProps) {
    const navigate = useNavigate();
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

    const centerOnCoords = useCallback((lat: number, lng: number, zoom = 1.2) => {
        if (!mapRef.current) return;
        const container = mapRef.current;
        const { width: cw, height: ch } = container.getBoundingClientRect();
        const { x, y } = latLngToPixels(lat, lng);
        
        const newScale = zoom;
        setTransform({
            scale: newScale,
            x: (cw / 2) - (x * newScale),
            y: (ch / 2) - (y * newScale)
        });
    }, []);

    const setInitialView = useCallback(() => {
        if (!mapRef.current) return;
        const container = mapRef.current;
        const { width: cw, height: ch } = container.getBoundingClientRect();
        if (cw === 0 || ch === 0) return;

        // Si solo hay un negocio (Cumbre), centrar directamente en él
        if (businesses.length === 1) {
            centerOnCoords(businesses[0].lat, businesses[0].lng, 1.4);
        } else {
            const initialScale = Math.min(cw, ch) / 800; 
            const initialX = (cw - VIRTUAL_WIDTH * initialScale) / 2;
            const initialY = (ch - VIRTUAL_HEIGHT * initialScale) / 2;
            setTransform({ scale: initialScale, x: initialX, y: initialY });
        }
    }, [businesses, centerOnCoords]);

    useEffect(() => {
        setInitialView();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                null,
                { enableHighAccuracy: true }
            );
        }
        window.addEventListener('resize', setInitialView);
        return () => window.removeEventListener('resize', setInitialView);
    }, [setInitialView]);

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
        const isTouch = 'touches' in e;
        if (isTouch && e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            if (lastTouchDist.current !== null) {
                const delta = dist / lastTouchDist.current;
                setTransform(prev => ({ ...prev, scale: Math.min(Math.max(0.1, prev.scale * delta), 15) }));
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

    const handleMarkerClick = (e: React.MouseEvent | React.TouchEvent, business: Business) => {
        e.stopPropagation();
        if (isEditable) {
            setDraggedBusinessId(business.id);
        } else {
            setActiveBusiness(business);
            centerOnCoords(business.lat, business.lng, Math.max(transform.scale, 1.4));
        }
    };

    return (
        <div
            ref={mapRef}
            className="w-full h-full overflow-hidden relative bg-[#F8FAFC] select-none touch-none"
            onWheel={(e) => {
                const delta = e.deltaY < 0 ? 1.1 : 0.9;
                setTransform(prev => ({ ...prev, scale: Math.min(Math.max(0.1, prev.scale * delta), 15) }));
            }}
            onMouseDown={(e) => { isPanning.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }}
            onTouchStart={(e) => { isPanning.current = true; lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        >
            <style>
                {`
                .user-pulse {
                    width: 22px;
                    height: 22px;
                    background: #3b82f6;
                    border: 4px solid white;
                    border-radius: 50%;
                    position: relative;
                    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4);
                }
                .user-pulse::after {
                    content: '';
                    position: absolute;
                    inset: -12px;
                    border-radius: 50%;
                    background: #3b82f6;
                    opacity: 0.3;
                    animation: pulse-out 2.5s infinite;
                }
                @keyframes pulse-out {
                    0% { transform: scale(0.5); opacity: 0.6; }
                    100% { transform: scale(3); opacity: 0; }
                }
                .camera-transition {
                    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .marker-label {
                    text-shadow: 0 1px 4px rgba(0,0,0,0.1);
                }
                `}
            </style>

            <div
                className="relative origin-top-left will-change-transform camera-transition"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    width: `${VIRTUAL_WIDTH}px`,
                    height: `${VIRTUAL_HEIGHT}px`,
                }}
            >
                <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90" alt="Terrain Map" />

                {/* Marcador de Usuario */}
                {userPos && (
                    <div className="absolute z-50 transition-all duration-1000" style={{ 
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
                            className={`absolute flex items-center justify-center transition-all duration-300 ${isActive ? 'z-[100]' : 'z-10'}`}
                            style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -100%)' }}
                        >
                            <div 
                                onClick={(e) => handleMarkerClick(e, business)}
                                className={`
                                    relative cursor-pointer transition-all duration-300 flex flex-col items-center
                                    ${isActive ? 'scale-125' : 'scale-100'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center border-[3px] border-white shadow-2xl
                                    ${style.color} ${style.text} ring-4 ${style.ring}
                                    hover:scale-110 active:scale-90 transition-transform
                                `}>
                                    <i className={`fas ${style.icon} text-lg`}></i>
                                </div>
                                <div className={`w-1.5 h-4 ${style.color} -mt-1.5 rounded-full shadow-lg border-x-[1.5px] border-white/30`}></div>

                                {isActive && (
                                    <div className="absolute top-16 bg-white/95 backdrop-blur-xl text-[#2A4D69] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-2xl border border-white marker-label">
                                        {business.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Card - Estilo Ultra-Limpio */}
            {activeBusiness && (
                <div className="absolute bottom-10 left-6 right-6 md:left-10 md:w-[420px] z-[100] animate-fadeIn">
                    <div className="bg-white rounded-[3rem] shadow-[0_30px_90px_rgba(0,0,0,0.12)] overflow-hidden border border-slate-100/50">
                        <div className="relative h-44">
                            <img src={activeBusiness.photos[0]} className="w-full h-full object-cover" alt={activeBusiness.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveBusiness(null); }} 
                                className="absolute top-6 right-6 w-11 h-11 bg-white/40 backdrop-blur-2xl rounded-full text-slate-800 flex items-center justify-center border border-white/40 hover:bg-white transition-all shadow-sm"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-10 pt-0 -mt-8 relative z-10">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                                <span className="bg-[#2A4D69]/5 text-[#2A4D69] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    {activeBusiness.category}
                                </span>
                                <h4 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mt-4 leading-none">
                                    {activeBusiness.name}
                                </h4>
                                <div className="flex items-center gap-3 text-slate-400 mt-5">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                        <i className="fas fa-location-dot text-brand-orange text-xs"></i>
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider line-clamp-1">{activeBusiness.address}</p>
                                </div>
                                <button 
                                    onClick={() => navigate(`/business/${activeBusiness.id}`)}
                                    className="w-full mt-8 bg-[#2A4D69] text-white py-6 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.25em] shadow-[0_15px_40px_rgba(42,77,105,0.2)] hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    Visitar Perfil <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls - Floating UI */}
            <div className="absolute top-10 right-6 flex flex-col gap-4 z-50">
                <div className="flex flex-col bg-white/80 backdrop-blur-xl rounded-[1.8rem] shadow-2xl border border-white p-1.5 gap-1">
                    <button 
                        onClick={() => setTransform(prev => ({...prev, scale: Math.min(prev.scale * 1.4, 15)}))} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button 
                        onClick={() => setTransform(prev => ({...prev, scale: Math.max(prev.scale / 1.4, 0.1)}))} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                </div>
                <button 
                    onClick={() => {
                        if (userPos) centerOnCoords(userPos.lat, userPos.lng, 1.5);
                    }} 
                    className="w-16 h-16 bg-blue-500 text-white rounded-[1.8rem] flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all active:scale-90"
                    title="Mi ubicación"
                >
                    <i className="fas fa-location-crosshairs text-xl"></i>
                </button>
                <button 
                    onClick={setInitialView} 
                    className="w-16 h-16 bg-[#2A4D69] text-white rounded-[1.8rem] flex items-center justify-center shadow-[0_10px_30px_rgba(42,77,105,0.3)] hover:opacity-90 transition-all"
                    title="Restablecer vista"
                >
                    <i className="fas fa-expand text-xl"></i>
                </button>
            </div>
        </div>
    );
}
