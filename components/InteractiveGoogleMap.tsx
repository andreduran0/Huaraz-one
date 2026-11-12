import React, { useEffect, useRef, useState, useCallback } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useNavigate } from 'react-router-dom';
import { Business, BusinessCategory } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface InteractiveGoogleMapProps {
  businesses: Business[];
  activeCategory?: string;
  isEditable?: boolean;
  onBusinessMove?: (id: string, lat: number, lng: number) => void;
}

// Coordenadas centrales por defecto: Huaraz, Ancash, Perú
const HUARAZ_CENTER = { lat: -9.5298, lng: -77.5287 };
const DEFAULT_ZOOM = 15;

// Paleta de colores para anillos de marcadores por categoría
const getCategoryPinStyle = (category: BusinessCategory | string) => {
  switch (category) {
    case BusinessCategory.RESTAURANT:
    case BusinessCategory.POLLERIA:
    case BusinessCategory.CEVICHERIA:
      return {
        borderColor: '#F58220',
        bgClass: 'bg-[#F58220]',
        ringClass: 'ring-[#F58220]',
        badgeText: 'text-[#F58220]',
        badgeBg: 'bg-orange-50',
        icon: 'fa-utensils',
        label: 'Gastronomía'
      };
    case BusinessCategory.HOTEL:
      return {
        borderColor: '#2A4D69',
        bgClass: 'bg-[#2A4D69]',
        ringClass: 'ring-[#2A4D69]',
        badgeText: 'text-[#2A4D69]',
        badgeBg: 'bg-blue-50',
        icon: 'fa-bed',
        label: 'Hotel & Estancia'
      };
    case BusinessCategory.TOURIST_SPOT:
      return {
        borderColor: '#059669',
        bgClass: 'bg-[#059669]',
        ringClass: 'ring-[#059669]',
        badgeText: 'text-[#059669]',
        badgeBg: 'bg-emerald-50',
        icon: 'fa-mountain-sun',
        label: 'Atractivo Turístico'
      };
    case BusinessCategory.BAKERY:
    case 'chocolateria':
      return {
        borderColor: '#7B3F00',
        bgClass: 'bg-[#7B3F00]',
        ringClass: 'ring-[#7B3F00]',
        badgeText: 'text-[#7B3F00]',
        badgeBg: 'bg-amber-50',
        icon: 'fa-cookie-bite',
        label: 'Chocolatería & Café'
      };
    case BusinessCategory.HEALTH:
      return {
        borderColor: '#DC2626',
        bgClass: 'bg-red-600',
        ringClass: 'ring-red-600',
        badgeText: 'text-red-600',
        badgeBg: 'bg-red-50',
        icon: 'fa-stethoscope',
        label: 'Medicina y Salud'
      };
    case BusinessCategory.EDUCATION:
      return {
        borderColor: '#4F46E5',
        bgClass: 'bg-indigo-600',
        ringClass: 'ring-indigo-600',
        badgeText: 'text-indigo-600',
        badgeBg: 'bg-indigo-50',
        icon: 'fa-graduation-cap',
        label: 'Educación'
      };
    default:
      return {
        borderColor: '#2A4D69',
        bgClass: 'bg-[#2A4D69]',
        ringClass: 'ring-[#2A4D69]',
        badgeText: 'text-[#2A4D69]',
        badgeBg: 'bg-slate-50',
        icon: 'fa-location-dot',
        label: 'Negocio'
      };
  }
};

// Estilo de mapa vectorizado limpio para navegación turística en Huaraz
const vectorizedTourismStyle: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ lightness: 10 }]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#f3f4f6' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dcfce7' }]
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e5e7eb' }, { weight: 1 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fef3c7' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c7d2fe' }]
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'simplified' }]
  }
];

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  businesses,
  activeCategory = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const navigate = useNavigate();
  const t = useTranslations();

  // Obtener la API key de múltiples posibles orígenes
  const apiKey =
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
    (import.meta as any).env?.REACT_APP_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' &&
      (process.env?.REACT_APP_GOOGLE_MAPS_API_KEY || process.env?.VITE_GOOGLE_MAPS_API_KEY)) ||
    '';

  // Inicializar Google Maps
  useEffect(() => {
    let isCancelled = false;

    if (!mapContainerRef.current) return;

    try {
      setOptions({
        apiKey: apiKey,
        version: 'weekly',
        language: 'es',
        region: 'PE',
        internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio']
      } as any);

      importLibrary('maps')
        .then((mapsLib) => {
          if (isCancelled || !mapContainerRef.current) return;

          const { Map } = mapsLib as google.maps.MapsLibrary;

          const map = new Map(mapContainerRef.current, {
            center: HUARAZ_CENTER,
            zoom: DEFAULT_ZOOM,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            styles: vectorizedTourismStyle
          });

          map.addListener('click', () => {
            setActiveBusiness(null);
          });

          mapInstanceRef.current = map;
          setMapLoaded(true);
        })
        .catch((err) => {
          console.error('Error importando maps library:', err);
          if (!isCancelled) {
            setLoadError(err.message || 'No se pudo cargar Google Maps.');
          }
        });
    } catch (err: any) {
      console.error('Error configurando Google Maps API:', err);
      if (!isCancelled) {
        setLoadError(err?.message || 'Error al inicializar Google Maps.');
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [apiKey]);

  // Actualizar marcadores cuando cambien los comercios o la categoría activa
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    let isSubscribed = true;

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    importLibrary('marker')
      .then((markerLib) => {
        if (!isSubscribed) return;
        const { AdvancedMarkerElement } = markerLib as google.maps.MarkerLibrary;

        const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

        businesses.forEach((business) => {
          if (!business.lat || !business.lng) return;

          const pinStyle = getCategoryPinStyle(business.category);
          const photoUrl =
            (business as any).logo ||
            (business.photos && business.photos.length > 0
              ? business.photos[0]
              : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120');

          const pinContainer = document.createElement('div');
          pinContainer.className =
            'relative flex flex-col items-center cursor-pointer select-none transition-all duration-300 transform hover:scale-125 hover:z-[999] group';
          pinContainer.style.outline = 'none';

          pinContainer.innerHTML = `
            <div style="border-color: ${pinStyle.borderColor}; box-shadow: 0 10px 25px rgba(0,0,0,0.35);" 
                 class="w-12 h-12 rounded-full border-[3.5px] bg-white overflow-hidden p-0.5 flex items-center justify-center transition-transform duration-300 ring-2 ${pinStyle.ringClass}">
              <img src="${photoUrl}" alt="${business.name}" class="w-full h-full object-cover rounded-full pointer-events-none" />
            </div>
            <div style="background-color: ${pinStyle.borderColor};" class="w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-md border-r border-b border-white"></div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -bottom-7 bg-slate-950/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xl border border-white/10 z-50">
              ${business.name}
            </div>
          `;

          pinContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            setActiveBusiness(business);
            map.panTo({ lat: business.lat, lng: business.lng });
            map.setZoom(Math.max(map.getZoom() || DEFAULT_ZOOM, 16));
          });

          const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: business.lat, lng: business.lng },
            content: pinContainer,
            title: business.name
          });

          newMarkers.push(marker);
        });

        markersRef.current = newMarkers;
      })
      .catch((err) => {
        console.error('Error importando marker library:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [businesses, mapLoaded, activeCategory]);

  // Actualizar marcador de GPS del usuario
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !userPos) return;

    let isSubscribed = true;

    importLibrary('marker')
      .then((markerLib) => {
        if (!isSubscribed) return;
        const { AdvancedMarkerElement } = markerLib as google.maps.MarkerLibrary;

        if (userMarkerRef.current) {
          userMarkerRef.current.position = userPos;
          userMarkerRef.current.map = map;
        } else {
          const pulseEl = document.createElement('div');
          pulseEl.className = 'user-pulse-container';
          pulseEl.innerHTML = `
            <div class="user-pulse"></div>
          `;

          userMarkerRef.current = new AdvancedMarkerElement({
            map: map,
            position: userPos,
            content: pulseEl,
            title: 'Tu ubicación actual'
          });
        }
      })
      .catch((err) => {
        console.error('Error importando marker library para GPS:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [userPos, mapLoaded]);

  const handleZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() || DEFAULT_ZOOM;
    map.setZoom(currentZoom + delta);
  };

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está soportada en tu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserPos(newPos);
        const map = mapInstanceRef.current;
        if (map) {
          map.panTo(newPos);
          map.setZoom(16);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('No se pudo obtener la ubicación GPS:', err);
        const map = mapInstanceRef.current;
        if (map) {
          map.panTo(HUARAZ_CENTER);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo(HUARAZ_CENTER);
    map.setZoom(DEFAULT_ZOOM);
    setActiveBusiness(null);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 select-none">
      <style>
        {`
          .user-pulse {
            width: 24px;
            height: 24px;
            background: #39FF14;
            border: 4px solid white;
            border-radius: 50%;
            position: relative;
            box-shadow: 0 0 25px rgba(57, 255, 20, 0.8);
          }
          .user-pulse::after {
            content: '';
            position: absolute;
            inset: -15px;
            border-radius: 50%;
            background: #39FF14;
            opacity: 0.35;
            animation: pulse-out 2.4s infinite;
          }
          @keyframes pulse-out {
            0% { transform: scale(0.5); opacity: 0.9; }
            100% { transform: scale(3.8); opacity: 0; }
          }
        `}
      </style>

      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {loadError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-red-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-2xl border border-red-500/30 text-center max-w-md">
          <p className="text-xs font-black uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
            <i className="fas fa-triangle-exclamation text-yellow-400"></i> Google Maps API
          </p>
          <p className="text-[11px] text-red-200">{loadError}</p>
        </div>
      )}

      {/* Controles Flotantes */}
      <div className="absolute top-24 right-6 flex flex-col gap-3 z-20">
        <div className="flex flex-col bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/30 p-2 gap-2">
          <button
            onClick={() => handleZoom(1)}
            className="w-13 h-13 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
            title="Acercar mapa"
            aria-label="Acercar mapa"
          >
            <i className="fas fa-plus text-base"></i>
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="w-13 h-13 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all border border-slate-100 shadow-sm active:scale-90"
            title="Alejar mapa"
            aria-label="Alejar mapa"
          >
            <i className="fas fa-minus text-base"></i>
          </button>
        </div>

        <button
          onClick={handleLocateUser}
          className={`w-15 h-15 rounded-[2rem] flex items-center justify-center shadow-[0_12px_35px_rgba(57,255,20,0.35)] transition-all active:scale-90 border-2 border-white/50 ${
            isLocating ? 'bg-white text-[#2A4D69] animate-pulse' : 'bg-[#39FF14] text-black hover:scale-105'
          }`}
          title="Mi Ubicación GPS"
          aria-label="Mi Ubicación GPS"
        >
          <i className="fas fa-location-crosshairs text-xl"></i>
        </button>

        <button
          onClick={handleResetView}
          className="w-15 h-15 bg-[#2A4D69] text-white rounded-[2rem] flex items-center justify-center shadow-xl hover:bg-slate-800 transition-all active:scale-90 border-2 border-white/20"
          title="Restablecer vista de Huaraz"
          aria-label="Restablecer vista de Huaraz"
        >
          <i className="fas fa-expand text-lg"></i>
        </button>
      </div>

      {/* Tarjeta Flotante Estilo Morfy */}
      {activeBusiness && (
        <div className="absolute bottom-10 left-4 right-4 md:left-10 md:w-[420px] z-30 animate-fadeIn">
          <div className="bg-white rounded-[2.8rem] shadow-[0_35px_90px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 transition-all duration-300">
            <div className="relative h-48 w-full bg-slate-100">
              <img
                src={
                  activeBusiness.photos && activeBusiness.photos.length > 0
                    ? activeBusiness.photos[0]
                    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
                }
                className="w-full h-full object-cover"
                alt={activeBusiness.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveBusiness(null);
                }}
                className="absolute top-5 right-5 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full text-slate-800 flex items-center justify-center border border-white hover:bg-white hover:scale-105 transition-all shadow-md active:scale-90 z-20"
                aria-label="Cerrar modal"
              >
                <i className="fas fa-times text-sm"></i>
              </button>

              <div className="absolute top-5 left-5 z-20">
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                  <i className={`fas ${getCategoryPinStyle(activeBusiness.category).icon}`}></i>
                  {t(`category.${activeBusiness.category}` as any) || activeBusiness.category}
                </span>
              </div>
            </div>

            <div className="p-8 pt-0 -mt-8 relative z-10">
              <div className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-50">
                <h4 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-3">
                  {activeBusiness.name}
                </h4>

                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <i className="fas fa-location-dot text-[#F58220]"></i>
                  <span className="truncate">{activeBusiness.address}</span>
                </p>

                {activeBusiness.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                    {activeBusiness.description}
                  </p>
                )}

                <button
                  onClick={() => navigate(`/business/${activeBusiness.id}`)}
                  className="w-full bg-[#2A4D69] text-white py-5 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-[#39FF14] hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                  Ver Detalles / Smart Voucher
                  <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveGoogleMap;
