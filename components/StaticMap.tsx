import React, { useState, useEffect, useCallback } from 'react';
import { Business, BusinessCategory } from '../types';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
// 1. Importamos los componentes de Mapbox
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // ¡Muy importante para que no se rompa visualmente!

interface InteractiveMapProps {
    businesses: Business[];
    isEditable?: boolean;
    onBusinessMove?: (id: string, lat: number, lng: number) => void;
    activeCategory?: string;
}

// 2. TUS CREDENCIALES DE MAPBOX (Reemplaza estas strings con tus datos reales)
const MAPBOX_TOKEN = "pk.eyJ1IjoiaHVhcm"+FjaXRvIiwiYSI6ImNtcmN6azJrMTA4enQyem9qZXRzajY3cmoifQ.KQ45D0-vjHfZTsVBJikVDw"; 
const MAPBOX_STYLE = "mapbox://styles/huaracito/cmrd02j7q007o01qia3mv0i52";

// Centro de Huaraz por defecto
const INITIAL_VIEW_STATE = {
    longitude: -77.5287,
    latitude: -9.5297,
    zoom: 14,
    pitch: 0,
    bearing: 0
};

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
        case BusinessCategory.CHOCOLATERIA:
            return { icon: 'fa-mug-hot', color: 'bg-[#7B3F00]', text: 'text-white', ring: 'ring-[#D2691E]/40' };
        default: 
            return { icon: 'fa-location-dot', color: 'bg-slate-600', text: 'text-white', ring: 'ring-slate-200' };
    }
};

export default function InteractiveMap({ 
    businesses, 
    isEditable, 
    onBusinessMove, 
    activeCategory = 'all'
}: InteractiveMapProps) {
    const navigate = useNavigate();
    const t = useTranslations();
    
    // Estado nativo de Mapbox para controlar la cámara
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
    const [userPos, setUserPos] = useState<{lat: number, lng: number} | null>(null);

    // Geolocalización del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                null,
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // Funciones para botones personalizados
    const handleZoom = (delta: number) => {
        setViewState(prev => ({
            ...prev,
            zoom: Math.min(Math.max(prev.zoom + delta, 2), 20)
        }));
    };

    const handleResetView = () => {
        setViewState(INITIAL_VIEW_STATE);
        setActiveBusiness(null);
    };

    const handleLocateUser = () => {
        if (userPos) {
            setViewState(prev => ({
                ...prev,
                longitude: userPos.lng,
                latitude: userPos.lat,
                zoom: 16
            }));
        }
    };

    return (
        <div className="w-full h-full relative bg-[#050505] overflow-hidden">
            <style>
                {`
                .user-pulse {
                    width: 24px; height: 24px;
                    background: #39FF14;
                    border: 4px solid white; border-radius: 50%;
                    position: relative;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.6);
                }
                .user-pulse::after {
                    content: ''; position: absolute; inset: -15px;
                    border-radius: 50%; background: #39FF14; opacity: 0.3;
                    animation: pulse-out 2.5s infinite;
                }
                @keyframes pulse-out {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(4); opacity: 0; }
                }
                .marker-label { text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
                `}
            </style>

            {/* --- MAPBOX CONTAINER --- */}
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle={MAPBOX_STYLE}
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
                // Desactivar arrastre del mapa si estamos editando un marcador (opcional para UX)
                dragPan={!isEditable} 
            >
                {/* Marcador del Usuario */}
                {userPos && (
                    <Marker longitude={userPos.lng} latitude={userPos.lat} anchor="center">
                        <div className="user-pulse"></div>
                    </Marker>
                )}

                {/* Marcadores de Negocios */}
                {businesses.map((business) => {
                    const isActive = activeBusiness?.id === business.id;
                    const style = getCategoryStyles(business.category);
                    
                    return (
                        <Marker
                            key={business.id}
                            longitude={business.lng}
                            latitude={business.lat}
                            anchor="bottom"
                            // Mapbox nos da el drag & drop gratis:
                            draggable={isEditable}
                            onDragEnd={(e) => {
                                if (isEditable && onBusinessMove) {
                                    onBusinessMove(business.id, e.lngLat.lat, e.lngLat.lng);
                                }
                            }}
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                if (!isEditable) {
                                    setActiveBusiness(business);
                                    // Centramos la cámara al hacer click
                                    setViewState(prev => ({
                                        ...prev,
                                        longitude: business.lng,
                                        latitude: business.lat,
                                        zoom: Math.max(prev.zoom, 15.5) // Hace zoom al lugar si está muy lejos
                                    }));
                                }
                            }}
                            style={{ zIndex: isActive ? 100 : 10 }}
                        >
                            <div className={`
                                relative cursor-pointer transition-all duration-300 flex flex-col items-center
                                ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'}
                            `}>
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
                        </Marker>
                    );
                })}
            </Map>

            {/* --- UI SUPERPUESTA: MODAL DE DETALLES --- */}
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

            {/* --- UI SUPERPUESTA: BOTONES DE CONTROL --- */}
            <div className="absolute top-10 right-6 flex flex-col gap-4 z-50">
                <div className="flex flex-col bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 p-2 gap-2">
                    <button 
                        onClick={() => handleZoom(1)} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button 
                        onClick={() => handleZoom(-1)} 
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                </div>
                <button 
                    onClick={handleLocateUser} 
                    className="w-16 h-16 bg-[#39FF14] text-black rounded-[2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(57,255,20,0.3)] hover:scale-105 transition-all active:scale-90"
                    title="Mi ubicación"
                >
                    <i className="fas fa-location-crosshairs text-xl"></i>
                </button>
                <button 
                    onClick={handleResetView} 
                    className="w-16 h-16 bg-[#2A4D69] text-white rounded-[2rem] flex items-center justify-center shadow-xl hover:opacity-90 transition-all active:scale-90"
                    title="Restablecer vista"
                >
                    <i className="fas fa-expand text-xl"></i>
                </button>
            </div>
        </div>
    );
}
