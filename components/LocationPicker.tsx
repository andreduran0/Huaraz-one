
import React, { useState, useRef, useEffect } from 'react';
import { Business } from '../types';

interface LocationPickerProps {
    imageUrl: string;
    business: Business;
    onLocationChange: (lat: number, lng: number) => void;
}

const MAP_BOUNDS = {
    top: -9.4800,    
    bottom: -9.5800, 
    left: -77.5600,  
    right: -77.4800, 
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ imageUrl, business, onLocationChange }) => {
    const [imgDimensions, setImgDimensions] = useState<{width: number, height: number} | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImgDimensions({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
    };

    const latLngToPixels = (lat: number, lng: number) => {
        if (!imgDimensions) return { x: 0, y: 0 };
        const x = ((lng - MAP_BOUNDS.left) / (MAP_BOUNDS.right - MAP_BOUNDS.left)) * imgDimensions.width;
        const y = ((lat - MAP_BOUNDS.top) / (MAP_BOUNDS.bottom - MAP_BOUNDS.top)) * imgDimensions.height;
        return { x, y };
    };

    const pixelsToLatLng = (x: number, y: number) => {
        if (!imgDimensions) return { lat: 0, lng: 0 };
        const lng = (x / imgDimensions.width) * (MAP_BOUNDS.right - MAP_BOUNDS.left) + MAP_BOUNDS.left;
        const lat = (y / imgDimensions.height) * (MAP_BOUNDS.bottom - MAP_BOUNDS.top) + MAP_BOUNDS.top;
        return { lat, lng };
    };

    const handleUpdate = (e: React.MouseEvent | React.TouchEvent) => {
        if (!imgDimensions || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        // Coordenadas relativas al contenedor del mapa
        let x = (clientX - rect.left);
        let y = (clientY - rect.top);

        // Convertir a coordenadas de la imagen original (naturalWidth/naturalHeight)
        const scaleX = imgDimensions.width / rect.width;
        const scaleY = imgDimensions.height / rect.height;
        
        const { lat, lng } = pixelsToLatLng(x * scaleX, y * scaleY);
        onLocationChange(lat, lng);
    };

    const pos = latLngToPixels(business.lat, business.lng);
    // Convertir de nuevo a porcentajes para que el marcador se vea bien en el contenedor responsive
    const leftPercent = imgDimensions ? (pos.x / imgDimensions.width) * 100 : 0;
    const topPercent = imgDimensions ? (pos.y / imgDimensions.height) * 100 : 0;

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                <i className="fas fa-info-circle mr-2"></i>
                Haz clic o arrastra sobre el mapa para mover a <strong>{business.name}</strong>.
            </div>

            <div 
                ref={containerRef}
                className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-crosshair border-2 border-gray-200 dark:border-gray-700"
                onMouseDown={(e) => { setIsDragging(true); handleUpdate(e); }}
                onMouseMove={(e) => isDragging && handleUpdate(e)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={(e) => { setIsDragging(true); handleUpdate(e); }}
                onTouchMove={(e) => isDragging && handleUpdate(e)}
                onTouchEnd={() => setIsDragging(false)}
            >
                <img 
                    src={imageUrl} 
                    alt="Editor de mapa" 
                    className="w-full h-full object-fill pointer-events-none"
                    onLoad={handleImageLoad}
                />
                
                {imgDimensions && (
                    <div 
                        className="absolute w-8 h-8 -ml-4 -mt-8 flex items-center justify-center pointer-events-none transition-all duration-75"
                        style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    >
                        <i className="fas fa-map-marker-alt text-3xl text-red-600 drop-shadow-lg"></i>
                        <div className="absolute -bottom-1 w-2 h-2 bg-black/30 rounded-full blur-[1px]"></div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Latitud</label>
                    <input 
                        type="number" 
                        value={business.lat.toFixed(6)} 
                        onChange={(e) => onLocationChange(parseFloat(e.target.value), business.lng)}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 border rounded font-mono text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Longitud</label>
                    <input 
                        type="number" 
                        value={business.lng.toFixed(6)} 
                        onChange={(e) => onLocationChange(business.lat, parseFloat(e.target.value))}
                        className="w-full p-2 bg-gray-50 dark:bg-gray-700 border rounded font-mono text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
