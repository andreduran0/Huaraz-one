
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Business, BusinessCategory, AdLevel } from '../types';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveMapProps {
    imageUrl: string;
    businesses: Business[];
}

/**
 * Límites del mapa (GPS) centrados en el casco urbano de Huaraz.
 */
const MAP_BOUNDS = {
    top: -9.4800,    
    bottom: -9.5800, 
    left: -77.5600,  
    right: -77.4800, 
};

const getCategoryIcon = (category: BusinessCategory) => {
    switch (category) {
        case BusinessCategory.RESTAURANT: return 'fa-utensils';
        case BusinessCategory.POLLERIA: return 'fa-drumstick-bite';
        case BusinessCategory.CEVICHERIA: return 'fa-fish';
        case BusinessCategory.HOTEL: return 'fa-bed';
        case BusinessCategory.LAUNDRY: return 'fa-tshirt';
        case BusinessCategory.DENTIST: return 'fa-tooth';
        case BusinessCategory.BAKERY: return 'fa-bread-slice';
        case BusinessCategory.TOURIST_SPOT: return 'fa-camera-retro';
        default: return 'fa-map-marker-alt';
    }
};

export default function StaticMap({ imageUrl, businesses }: InteractiveMapProps) {
    const t = useTranslations();
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
    const [imgDimensions, setImgDimensions] = useState<{width: number, height: number} | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setLoadError(true);
        setImageLoaded(true); 
        setImgDimensions({ width: 1000, height: 800 }); 
    };

    const setInitialView = useCallback(() => {
        if (!mapRef.current || !imgDimensions) return;
        const container = mapRef.current;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        const { width: imageWidth, height: imageHeight } = imgDimensions;

        if (containerWidth === 0 || containerHeight === 0) return;

        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const initialScale = Math.max(scaleX, scaleY) * 1.2; 
        
        const initialX = (containerWidth - imageWidth * initialScale) / 2;
        const initialY = (containerHeight - imageHeight * initialScale) / 2;

        setTransform({ scale: initialScale, x: initialX, y: initialY });
    }, [imgDimensions]);

    useEffect(() => {
        setInitialView();
        const container = mapRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver(setInitialView);
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [setInitialView]);

    const handleWheel = (e: React.WheelEvent) => {
        if (loadError) return;
        e.preventDefault();
        const scaleFactor = 1.1;
        const newScale = e.deltaY < 0 ? transform.scale * scaleFactor : transform.scale / scaleFactor;
        const clampedScale = Math.min(Math.max(0.1, newScale), 5); 
        
        if (mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
            const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);
            setTransform({ scale: clampedScale, x: newX, y: newY });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (loadError) return;
        e.preventDefault(); 
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging.current = false; };
    
    useEffect(() => {
      window.addEventListener('mouseup', handleMouseUp);
      return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const latLngToPixels = (lat: number, lng: number) => {
        if (!imgDimensions) return { x: 0, y: 0 };
        const x = ((lng - MAP_BOUNDS.left) / (MAP_BOUNDS.right - MAP_BOUNDS.left)) * imgDimensions.width;
        const y = ((lat - MAP_BOUNDS.top) / (MAP_BOUNDS.bottom - MAP_BOUNDS.top)) * imgDimensions.height;
        return { x, y };
    };

    const handleMarkerClick = (e: React.MouseEvent, business: Business) => {
        e.stopPropagation();
        setActiveBusiness(business);
    };

    return (
        <div
            ref={mapRef}
            className="w-full h-full overflow-hidden relative bg-[#f3f4f6] dark:bg-gray-900 select-none cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
        >
            <style>
                {`
                @keyframes marker-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 130, 32, 0.7); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(245, 130, 32, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 130, 32, 0); }
                }
                .animate-marker-pulse {
                    animation: marker-pulse 2s infinite;
                }
                `}
            </style>

            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-100 dark:bg-gray-800">
                    <i className="fas fa-spinner fa-spin text-4xl text-brand-orange"></i>
                </div>
            )}
            
            <div
                className="relative origin-top-left will-change-transform"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    width: imgDimensions ? `${imgDimensions.width}px` : '100%',
                    height: imgDimensions ? `${imgDimensions.height}px` : '100%',
                }}
            >
                <img
                    src={imageUrl}
                    alt="City Map"
                    className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-90 transition-opacity duration-500"
                    draggable={false}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                
                {/* Marcadores Mejorados */}
                {!loadError && imgDimensions && businesses.map((business) => {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const isPremium = business.adLevel === AdLevel.PREMIUM;
                    const isActive = activeBusiness?.id === business.id;
                    const isTouristSpot = business.category === BusinessCategory.TOURIST_SPOT;
                    
                    return (
                        <div 
                            key={business.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${isActive ? 'z-50' : 'z-10'}`}
                            style={{ left: `${x}px`, top: `${y}px` }}
                        >
                            <div className="relative group">
                                {/* Puntero de marcador */}
                                <div className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b shadow-sm ${
                                    isPremium ? 'bg-brand-orange border-white' : 
                                    isTouristSpot ? 'bg-emerald-500 border-white' : 'bg-brand-dark-blue border-white'
                                }`}></div>

                                <button
                                    onClick={(e) => handleMarkerClick(e, business)}
                                    className={`
                                        relative w-10 h-10 rounded-xl flex items-center justify-center shadow-xl border-2 transition-transform active:scale-90
                                        ${isPremium ? 'bg-brand-orange border-brand-accent animate-marker-pulse' : 
                                          isTouristSpot ? 'bg-emerald-500 border-white' : 'bg-brand-dark-blue border-white'}
                                        ${isActive ? 'scale-125 -translate-y-1' : 'hover:scale-110'}
                                    `}
                                >
                                    <i className={`fas ${getCategoryIcon(business.category)} text-sm text-white`}></i>
                                    
                                    {isPremium && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full border border-white flex items-center justify-center">
                                            <i className="fas fa-star text-[6px] text-brand-dark-blue"></i>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
                
                {/* Popup Detalle Mejorado */}
                {!loadError && activeBusiness && (
                    <div
                        className="absolute bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 w-56 transform -translate-x-1/2 -translate-y-[calc(100%+60px)] z-[100] border border-gray-100 dark:border-gray-700 animate-fadeIn overflow-hidden"
                        style={{ 
                            left: `${latLngToPixels(activeBusiness.lat, activeBusiness.lng).x}px`, 
                            top: `${latLngToPixels(activeBusiness.lat, activeBusiness.lng).y}px` 
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                         {/* Mini header con foto si existe */}
                         <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <img 
                                src={activeBusiness.photos[0]} 
                                className="w-full h-full object-cover" 
                                alt={activeBusiness.name} 
                            />
                         </div>

                         <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex-1 leading-tight mr-2">
                                    {activeBusiness.name}
                                </h4>
                                <button 
                                    onClick={() => setActiveBusiness(null)} 
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <i className="fas fa-times-circle"></i>
                                </button>
                            </div>
                            
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 truncate">
                                <i className="fas fa-map-marker-alt mr-1"></i> {activeBusiness.address}
                            </p>

                            <Link 
                                to={`/business/${activeBusiness.id}`} 
                                className="block w-full text-center bg-brand-dark-blue hover:bg-brand-blue text-white text-[11px] py-2 rounded-lg transition-colors font-bold tracking-wide"
                            >
                                EXPLORAR SITIO
                            </Link>
                         </div>
                    </div>
                )}
            </div>

            {/* Controles de Zoom fijos */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50">
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale * 1.5, 5) }))}
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-brand-dark-blue dark:text-white hover:bg-gray-100 transition-colors"
                >
                    <i className="fas fa-plus"></i>
                </button>
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale / 1.5, 0.2) }))}
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-brand-dark-blue dark:text-white hover:bg-gray-100 transition-colors"
                >
                    <i className="fas fa-minus"></i>
                </button>
                <button 
                    onClick={setInitialView}
                    className="w-12 h-12 bg-brand-orange rounded-full shadow-lg flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
                >
                    <i className="fas fa-compress-arrows-alt"></i>
                </button>
            </div>
        </div>
    );
}
