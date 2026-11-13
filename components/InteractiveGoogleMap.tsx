import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useNavigate } from 'react-router-dom';
import { Business, BusinessCategory } from '../types';
import { useAppContext } from '../context/AppContext';

interface InteractiveGoogleMapProps {
  businesses: Business[];
  activeCategory?: string;
}

const HUARAZ_CENTER = { lat: -9.5298, lng: -77.5287 };
const DEFAULT_ZOOM = 15;

const getCategoryPinStyle = (category: BusinessCategory | string) => {
  switch (category) {
    case BusinessCategory.RESTAURANT:
    case BusinessCategory.POLLERIA:
    case BusinessCategory.CEVICHERIA:
      return { borderColor: '#F58220', ringClass: 'ring-[#F58220]', icon: 'fa-utensils' };
    case BusinessCategory.HOTEL:
      return { borderColor: '#2A4D69', ringClass: 'ring-[#2A4D69]', icon: 'fa-bed' };
    case BusinessCategory.TOURIST_SPOT:
      return { borderColor: '#059669', ringClass: 'ring-[#059669]', icon: 'fa-mountain-sun' };
    case BusinessCategory.BAKERY:
    case 'chocolateria':
      return { borderColor: '#7B3F00', ringClass: 'ring-[#7B3F00]', icon: 'fa-cookie-bite' };
    case BusinessCategory.HEALTH:
      return { borderColor: '#DC2626', ringClass: 'ring-red-600', icon: 'fa-stethoscope' };
    case BusinessCategory.EDUCATION:
      return { borderColor: '#4F46E5', ringClass: 'ring-indigo-600', icon: 'fa-graduation-cap' };
    default:
      return { borderColor: '#2A4D69', ringClass: 'ring-[#2A4D69]', icon: 'fa-location-dot' };
  }
};

const vectorizedTourismStyle: google.maps.MapTypeStyle[] = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ lightness: 10 }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#f3f4f6' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dcfce7' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e5e7eb' }, { weight: 1 }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fef3c7' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c7d2fe' }] },
  { featureType: 'transit', stylers: [{ visibility: 'simplified' }] }
];

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  businesses,
  activeCategory = 'all'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const loaderRef = useRef<Loader | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const navigate = useNavigate();
  const { language } = useAppContext();
  const t = (es: string, en: string) => (language === 'es' ? es : en);

  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    let isCancelled = false;
    if (!mapContainerRef.current) return;

    try {
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        language: 'es',
        region: 'PE'
      });
      loaderRef.current = loader;

      loader
        .importLibrary('maps')
        .then((mapsLib) => {
          if (isCancelled || !mapContainerRef.current) return;
          const { Map } = mapsLib as google.maps.MapsLibrary;

          const map = new Map(mapContainerRef.current, {
            center: HUARAZ_CENTER,
            zoom: DEFAULT_ZOOM,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            clickableIcons: false,
            styles: vectorizedTourismStyle
          });

          map.addListener('click', () => setActiveBusiness(null));
          mapInstanceRef.current = map;
          setMapLoaded(true);
        })
        .catch((err) => {
          if (!isCancelled) setLoadError(err.message || 'Error cargando Google Maps.');
        });
    } catch (err: any) {
      if (!isCancelled) setLoadError(err?.message || 'Error inicializando Google Maps.');
    }

    return () => {
      isCancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const loader = loaderRef.current;
    if (!map || !loader || !mapLoaded) return;
    let isSubscribed = true;

    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    loader.importLibrary('marker').then((markerLib) => {
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

        pinContainer.innerHTML = `
          <div style="border-color: ${pinStyle.borderColor}; box-shadow: 0 10px 25px rgba(0,0,0,0.35);"
               class="w-12 h-12 rounded-full border-[3.5px] bg-white overflow-hidden p-0.5 flex items-center justify-center ring-2 ${pinStyle.ringClass}">
            <img src="${photoUrl}" alt="${business.name}" class="w-full h-full object-cover rounded-full pointer-events-none" />
          </div>
          <div style="background-color: ${pinStyle.borderColor};" class="w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-md border-r border-b border-white"></div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none absolute -bottom-7 bg-slate-950/90 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xl z-50">
            ${business.name}
          </div>
        `;

        pinContainer.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveBusiness(business);
          map.panTo({ lat: business.lat, lng: business.lng });
          map.setZoom(Math.max(map.getZoom() || DEFAULT_ZOOM, 16));
        });

        newMarkers.push(
          new AdvancedMarkerElement({
            map,
            position: { lat: business.lat, lng: business.lng },
            content: pinContainer,
            title: business.name
          })
        );
      });

      markersRef.current = newMarkers;
    });

    return () => {
      isSubscribed = false;
    };
  }, [businesses, mapLoaded, activeCategory]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const loader = loaderRef.current;
    if (!map || !loader || !mapLoaded || !userPos) return;
    let isSubscribed = true;

    loader.importLibrary('marker').then((markerLib) => {
      if (!isSubscribed) return;
      const { AdvancedMarkerElement } = markerLib as google.maps.MarkerLibrary;

      if (userMarkerRef.current) {
        userMarkerRef.current.position = userPos;
        userMarkerRef.current.map = map;
      } else {
        const pulseEl = document.createElement('div');
        pulseEl.innerHTML = `<div class="user-pulse"></div>`;
        userMarkerRef.current = new AdvancedMarkerElement({
          map,
          position: userPos,
          content: pulseEl,
          title: t('Tu ubicación actual', 'Your current location')
        });
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [userPos, mapLoaded]);

  const handleZoom = (delta: number) => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || DEFAULT_ZOOM) + delta);
  };

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(newPos);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(newPos);
          mapInstanceRef.current.setZoom(16);
        }
      },
      () => {
        setIsLocating(false);
        if (mapInstanceRef.current) mapInstanceRef.current.panTo(HUARAZ_CENTER);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo(HUARAZ_CENTER);
    mapInstanceRef.current.setZoom(DEFAULT_ZOOM);
    setActiveBusiness(null);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 select-none">
      <style>{`
        .user-pulse {
          width: 24px; height: 24px; background: #39FF14;
          border: 4px solid white; border-radius: 50%; position: relative;
          box-shadow: 0 0 25px rgba(57, 255, 20, 0.8);
        }
        .user-pulse::after {
          content: ''; position: absolute; inset: -15px; border-radius: 50%;
          background: #39FF14; opacity: 0.35; animation: pulse-out 2.4s infinite;
        }
        @keyframes pulse-out {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(3.8); opacity: 0; }
        }
      `}</style>

      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {loadError && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-red-900/90 text-white px-6 py-4 rounded-2xl shadow-2xl text-center max-w-md">
          <p className="text-xs font-black uppercase tracking-wider mb-1">Google Maps API</p>
          <p className="text-[11px] text-red-200">{loadError}</p>
        </div>
      )}

      <div className="absolute top-24 right-6 flex flex-col gap-3 z-20">
        <div className="flex flex-col bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-2 gap-2">
          <button onClick={() => handleZoom(1)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all shadow-sm">
            <i className="fas fa-plus text-base"></i>
          </button>
          <button onClick={() => handleZoom(-1)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2A4D69] hover:bg-[#39FF14] hover:text-black transition-all shadow-sm">
            <i className="fas fa-minus text-base"></i>
          </button>
        </div>

        <button
          onClick={handleLocateUser}
          className={`w-14 h-14 rounded-[2rem] flex items-center justify-center shadow-xl transition-all border-2 border-white/50 ${
            isLocating ? 'bg-white text-[#2A4D69] animate-pulse' : 'bg-[#39FF14] text-black hover:scale-105'
          }`}
        >
          <i className="fas fa-location-crosshairs text-xl"></i>
        </button>

        <button
          onClick={handleResetView}
          className="w-14 h-14 bg-[#2A4D69] text-white rounded-[2rem] flex items-center justify-center shadow-xl hover:bg-slate-800 transition-all border-2 border-white/20"
        >
          <i className="fas fa-expand text-lg"></i>
        </button>
      </div>

      {activeBusiness && (
        <div className="absolute bottom-10 left-4 right-4 md:left-10 md:w-[420px] z-30">
          <div className="bg-white rounded-[2.8rem] shadow-2xl overflow-hidden border border-slate-100">
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
                className="absolute top-5 right-5 w-11 h-11 bg-white/80 backdrop-blur-md rounded-full text-slate-800 flex items-center justify-center shadow-md z-20"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
              <div className="absolute top-5 left-5 z-20">
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                  <i className={`fas ${getCategoryPinStyle(activeBusiness.category).icon}`}></i>
                  {activeBusiness.category}
                </span>
              </div>
            </div>

            <div className="p-8 pt-0 -mt-8 relative z-10">
              <div className="bg-white p-6 rounded-[2.2rem] shadow-sm border border-slate-50">
                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-3">
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
                  className="w-full bg-[#2A4D69] text-white py-5 rounded-[1.8rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-[#39FF14] hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  {t('Ver Detalles / Smart Voucher', 'View Details / Smart Voucher')}
                  <i className="fas fa-arrow-right"></i>
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
