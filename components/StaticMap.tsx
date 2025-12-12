
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Business, BusinessCategory } from '../types';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveMapProps {
    imageUrl: string;
    businesses: Business[];
}

// Límites referenciales del mapa (GPS). 
// Nota: Estos límites aproximados permiten que los marcadores aparezcan sobre la ciudad.
// Si el nuevo mapa tiene una escala diferente, los marcadores podrían necesitar ajuste fino.
const MAP_BOUNDS = {
    top: -9.5220,    // Norte
    bottom: -9.5350, // Sur
    left: -77.5350,  // Oeste
    right: -77.5230, // Este
};

const categoryIcons: Record<BusinessCategory, string> = {
    [BusinessCategory.RESTAURANT]: 'fa-utensils',
    [BusinessCategory.POLLERIA]: 'fa-drumstick-bite',
    [BusinessCategory.CEVICHERIA]: 'fa-fish-fins',
    [BusinessCategory.LAUNDRY]: 'fa-shirt',
    [BusinessCategory.HOTEL]: 'fa-bed',
    [BusinessCategory.DENTIST]: 'fa-tooth',
    [BusinessCategory.BAKERY]: 'fa-bread-slice',
    [BusinessCategory.TOURIST_SPOT]: 'fa-camera-retro',
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
        setLoadError(false);
    };

    const handleImageError = () => {
        console.error("Error cargando la imagen:", imageUrl);
        setLoadError(true);
        setImageLoaded(true); // Stop spinner
        // Set fake dimensions so layout doesn't break entirely
        setImgDimensions({ width: 1000, height: 800 }); 
    };

    const setInitialView = useCallback(() => {
        if (!mapRef.current || !imgDimensions) return;

        const container = mapRef.current;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        const { width: imageWidth, height: imageHeight } = imgDimensions;

        if (containerWidth === 0 || containerHeight === 0) return;

        // "Contain" logic: fit the whole image in view
        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const initialScale = Math.min(scaleX, scaleY); // Usar el menor para que quepa todo
        
        // Center logic
        const initialX = (containerWidth - imageWidth * initialScale) / 2;
        const initialY = (containerHeight - imageHeight * initialScale) / 2;

        setTransform({
            scale: initialScale,
            x: initialX,
            y: initialY,
        });
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
        e.preventDefault(); // Prevent image dragging default
        e.stopPropagation();
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        if (mapRef.current) mapRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || loadError) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (mapRef.current) mapRef.current.style.cursor = 'grab';
    };
    
    useEffect(() => {
      const currentMapRef = mapRef.current;
      const handleMouseUpGlobal = () => {
          isDragging.current = false;
          if (currentMapRef) currentMapRef.style.cursor = 'grab';
      };
      window.addEventListener('mouseup', handleMouseUpGlobal);
      return () => {
          window.removeEventListener('mouseup', handleMouseUpGlobal);
      };
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

    const activeMarkerCoords = (activeBusiness && imgDimensions) 
        ? latLngToPixels(activeBusiness.lat, activeBusiness.lng) 
        : null;

    return (
        <div
            ref={mapRef}
            className={`w-full h-full overflow-hidden relative bg-gray-200 dark:bg-gray-800 select-none ${loadError ? '' : 'cursor-grab active:cursor-grabbing'}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={(e) => {
                // Basic touch support for dragging
                if(e.touches.length === 1) {
                    isDragging.current = true;
                    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            }}
            onTouchMove={(e) => {
                 if(isDragging.current && e.touches.length === 1) {
                    const dx = e.touches[0].clientX - lastPos.current.x;
                    const dy = e.touches[0].clientY - lastPos.current.y;
                    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
                    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                 }
            }}
            onTouchEnd={() => { isDragging.current = false; }}
        >
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-100 dark:bg-gray-800">
                    <div className="flex flex-col items-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-brand-orange mb-3"></i>
                        <p className="text-gray-500">Cargando mapa...</p>
                    </div>
                </div>
            )}
            
            {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-white dark:bg-gray-900 p-8 text-center">
                    <i className="fas fa-image text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Falta la imagen del mapa</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6 max-w-md">
                        No se encontró el archivo <strong>{imageUrl}</strong>.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-bold mb-2">Cómo solucionarlo:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            <li>Guarda tu imagen como <strong>mapa_huaraz_2024.jpg</strong></li>
                            <li>Muévela a la carpeta <strong>public/</strong> de tu proyecto.</li>
                            <li>Recarga esta página.</li>
                        </ol>
                    </div>
                </div>
            )}
            
            <div
                className="relative origin-top-left will-change-transform"
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                    width: imgDimensions ? `${imgDimensions.width}px` : '100%',
                    height: imgDimensions ? `${imgDimensions.height}px` : '100%',
                    opacity: loadError ? 0 : 1
                }}
            >
                <img
                    src={imageUrl}
                    alt="Mapa de Huaraz 2024"
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    draggable={false}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                
                {/* Markers */}
                {!loadError && imgDimensions && businesses.map(business => {
                    const { x, y } = latLngToPixels(business.lat, business.lng);
                    const icon = categoryIcons[business.category] || 'fa-map-marker-alt';
                    return (
                        <button
                            key={business.id}
                            onClick={(e) => handleMarkerClick(e, business)}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-teal-400 hover:bg-teal-700 hover:scale-125 transition-transform z-10"
                            style={{ left: `${x}px`, top: `${y}px` }}
                            aria-label={`Ubicación de ${business.name}`}
                        >
                            <i className={`fas ${icon} text-sm`}></i>
                        </button>
                    );
                })}
                
                {/* Active Popup */}
                {!loadError && activeBusiness && activeMarkerCoords && (
                    <div
                        className="absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-0 w-64 transform -translate-x-1/2 translate-y-4 z-40 overflow-hidden border border-gray-200 dark:border-gray-700"
                        style={{ left: `${activeMarkerCoords.x}px`, top: `${activeMarkerCoords.y}px` }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                         <div className="relative h-24 w-full">
                            <img src={activeBusiness.photos[0]} alt={activeBusiness.name} className="w-full h-full object-cover"/>
                            <button 
                                onClick={() => setActiveBusiness(null)} 
                                className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                <i className="fas fa-times text-xs"></i>
                            </button>
                         </div>
                         <div className="p-3">
                            <h4 className="font-bold text-md truncate text-gray-900 dark:text-white">{activeBusiness.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate"><i className="fas fa-map-marker-alt mr-1"></i>{activeBusiness.address}</p>
                            <Link to={`/business/${activeBusiness.id}`} className="block w-full text-center bg-brand-orange text-white text-sm py-2 rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-md">
                               Ver Detalles
                            </Link>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}
