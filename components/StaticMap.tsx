
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Business, BusinessCategory, AdLevel } from '../types';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveMapProps {
    imageUrl: string;
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

export default function StaticMap({ imageUrl, businesses, isEditable, onBusinessMove }: InteractiveMapProps) {
    const t = useTranslations();
    const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
    const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
    const [imgDimensions, setImgDimensions] = useState<{width: number, height: number} | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [draggedBusinessId, setDraggedBusinessId] = useState<string | null>(null);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastTouchDist = useRef<number | null>(null);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImgDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    };

    const setInitialView = useCallback(() => {
        if (!mapRef.current || !imgDimensions) return;
        const container = mapRef.current;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        const { width: imageWidth, height: imageHeight } = imgDimensions;
        if (containerWidth === 0 || containerHeight === 0) return;

        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const initialScale = Math.max(scaleX, scaleY) * 1.1; 
        const initialX = (containerWidth - imageWidth * initialScale) / 2;
        const initialY = (containerHeight - imageHeight * initialScale) / 2;
        setTransform({ scale: initialScale, x: initialX, y: initialY });
    }, [imgDimensions]);

    useEffect(() => {
        setInitialView();
    }, [setInitialView]);

    const latLngToPixels = (lat: number, lng: number) => {
        if (!imgDimensions) return { x: 0, y: 0 };
        const x = ((lng - MAP_BOUNDS.left) / (MAP_BOUNDS.right - MAP_BOUNDS.left)) * imgDimensions.width;
        const y = ((lat - MAP_BOUNDS.top) / (MAP_BOUNDS.bottom - MAP_BOUNDS.top)) * imgDimensions.height;
        return { x, y };
    };

    const pixelsToLatLng = (x: number, y: number) => {
        if (!imgDimensions) return { lat: 0, lng: 0 };
        // FIX: Corrected variable usage from MAP_BOTTOM_BOUND to MAP_BOUNDS.bottom and MAP_TOP_BOUND to MAP_BOUNDS.top.
        // Also removed redundant/incorrect local assignments for a clean return statement.
        const lng = (x / imgDimensions.width) * (MAP_BOUNDS.right - MAP_BOUNDS.left) + MAP_BOUNDS.left;
        const lat = (y / imgDimensions.height) * (MAP_BOUNDS.bottom - MAP_BOUNDS.top) + MAP_BOUNDS.top;
        return { lat, lng };
    };

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
        const isTouch = 'touches' in e;
        
        // Handle Pinch to Zoom
        if (isTouch && e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            
            if (lastTouchDist.current !== null) {
                const delta = dist / lastTouchDist.current;
                const newScale = Math.min(Math.max(0.2, transform.scale * delta), 5);
                
                // Zoom relative to center between fingers
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

        if (draggedBusinessId && isEditable && onBusinessMove && imgDimensions && mapRef.current) {
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
    }, [draggedBusinessId, isEditable, transform, imgDimensions]);

    const handleMarkerDown = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.stopPropagation();
        if (isEditable) {
            setDraggedBusinessId(id);
            setActiveBusiness(null);
        } else {
            const business = businesses.find(b => b.id === id);
            if (business) {
                setActiveBusiness(business);
                // Center slightly below to show the card
                if (mapRef.current) {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const rect = mapRef.current.getBoundingClientRect();
                    // Smooth transition to business location logic could be added here
                }
            }
        }
    };

    const handleMapDown = (e: React.MouseEvent | React.TouchEvent) => {
        const isTouch = 'touches' in e;
        if (isTouch && e.touches.length === 2) return; // Let pinch handle it

        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        isPanning.current = true;
        lastPos.current = { x: clientX, y: clientY };
        
        // Only clear active business if it wasn't a marker tap
        // (Handled by marker down propagation stop)
        if (!isEditable) setActiveBusiness(null);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleFactor = 1.1;
        const newScale = e.deltaY < 0 ? transform.scale * scaleFactor : transform.scale / scaleFactor;
        const clampedScale = Math.min(Math.max(0.2, newScale), 5); 
        
        if (mapRef.current) {
            const rect = mapRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const newX = mouseX - (mouseX - transform.x) * (clampedScale / transform.scale);
            const newY = mouseY - (mouseY - transform.y) * (clampedScale / transform.scale);
            setTransform({ scale: clampedScale, x: newX, y: newY });
        }
    };

    return (
        <div
            ref={mapRef}
            className={`w-full h-full overflow-hidden relative bg-[#f3f4f6] dark:bg-gray-900 select-none touch-none ${isEditable ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
            onWheel={handleWheel}
            onMouseDown={handleMapDown}
            onTouchStart={handleMapDown}
        >
            <style>
                {`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
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
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    draggable={false}
                    onLoad={handleImageLoad}
                />
                
                {imgDimensions && businesses.map((business) => {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const isPremium = business.adLevel === AdLevel.PREMIUM;
                    const isActive = activeBusiness?.id === business.id;
                    const isTouristSpot = business.category === BusinessCategory.TOURIST_SPOT;
                    const isDraggingThis = draggedBusinessId === business.id;
                    
                    return (
                        <div 
                            key={business.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-75 ${isActive || isDraggingThis ? 'z-50' : 'z-10'}`}
                            style={{ left: `${x}px`, top: `${y}px` }}
                        >
                            {/* Larger touch target for mobile */}
                            <div 
                                className="absolute inset-0 -m-4 cursor-pointer z-0" 
                                onMouseDown={(e) => handleMarkerDown(e, business.id)}
                                onTouchStart={(e) => handleMarkerDown(e, business.id)}
                            />

                            <div className={`relative group pointer-events-none`}>
                                <div className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b shadow-sm ${
                                    isPremium ? 'bg-brand-orange border-white' : 
                                    isTouristSpot ? 'bg-emerald-500 border-white' : 'bg-brand-dark-blue border-white'
                                }`}></div>

                                <button
                                    className={`
                                        relative w-10 h-10 rounded-xl flex items-center justify-center shadow-xl border-2 transition-transform
                                        ${isPremium ? 'bg-brand-orange border-brand-accent' : 
                                          isTouristSpot ? 'bg-emerald-500 border-white' : 'bg-brand-dark-blue border-white'}
                                        ${isActive || isDraggingThis ? 'scale-125 -translate-y-2' : 'hover:scale-110'}
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
            </div>

            {/* Business Bottom Card (Mobile Friendly) */}
            {activeBusiness && !isEditable && (
                <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700 z-[60] animate-slideUp overflow-hidden">
                    <div className="flex">
                        <div className="w-24 h-24 shrink-0 bg-gray-100 dark:bg-gray-700">
                            <img src={activeBusiness.photos[0]} className="w-full h-full object-cover" alt={activeBusiness.name} />
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{activeBusiness.name}</h4>
                                    <p className="text-[10px] text-gray-500 truncate">{activeBusiness.address}</p>
                                </div>
                                <button onClick={() => setActiveBusiness(null)} className="text-gray-300 hover:text-red-500 p-1">
                                    <i className="fas fa-times-circle text-lg"></i>
                                </button>
                            </div>
                            <Link 
                                to={`/business/${activeBusiness.id}`} 
                                className="w-full bg-brand-dark-blue hover:bg-brand-blue text-white text-xs py-2 rounded-lg transition-colors font-bold text-center mt-2 flex items-center justify-center gap-2"
                            >
                                <span>DETALLES</span>
                                <i className="fas fa-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Optimized Zoom Controls for Mobile */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-50">
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.min(p.scale * 1.5, 5) }))} 
                    className="w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-brand-dark-blue dark:text-white border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                >
                    <i className="fas fa-plus text-lg"></i>
                </button>
                <button 
                    onClick={() => setTransform(p => ({ ...p, scale: Math.max(p.scale / 1.5, 0.2) }))} 
                    className="w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-brand-dark-blue dark:text-white border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
                >
                    <i className="fas fa-minus text-lg"></i>
                </button>
                <button 
                    onClick={setInitialView} 
                    className="w-14 h-14 bg-brand-orange rounded-2xl shadow-xl flex items-center justify-center text-white active:scale-95 transition-transform"
                >
                    <i className="fas fa-compress-arrows-alt text-lg"></i>
                </button>
            </div>

            {isEditable && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark-blue px-6 py-2 rounded-full font-bold shadow-2xl z-50 animate-bounce flex items-center gap-2 border-2 border-white text-sm">
                    <i className="fas fa-mouse-pointer"></i>
                    ARRASTRA LOS MARCADORES
                </div>
            )}
        </div>
    );
}
