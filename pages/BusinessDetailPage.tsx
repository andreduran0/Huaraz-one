
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { AdLevel } from '../types';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { businesses } = useAppContext();
  const t = useTranslations();
  const business = businesses.find(b => b.id === id);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!business) {
    return <div className="p-8 text-center">Negocio no encontrado.</div>;
  }

  const isSponsored = business.adLevel !== AdLevel.NONE;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % business.photos.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + business.photos.length) % business.photos.length);
  };

  const handleAddPhoto = () => {
    alert("Próximamente: Podrás subir fotos directamente desde aquí.");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-full relative">
        {/* Image Header */}
        <div 
            className="w-full h-64 relative cursor-pointer group"
            onClick={() => openLightbox(0)}
        >
            <img 
                src={business.photos[0]} 
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white w-full pointer-events-none">
                <h1 className="text-3xl font-bold shadow-black drop-shadow-md">{business.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                     <span className="bg-brand-blue px-2 py-0.5 rounded text-xs font-bold uppercase">
                        {t(`category.${business.category}` as any)}
                     </span>
                     {isSponsored && (
                        <span className="bg-brand-accent text-black px-2 py-0.5 rounded text-xs font-bold uppercase flex items-center gap-1">
                            <i className="fas fa-star text-[10px]"></i> {t('business.sponsored')}
                        </span>
                     )}
                </div>
            </div>
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                <i className="fas fa-expand-arrows-alt mr-1"></i> Ver fotos
            </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {business.description}
                </p>
            </div>

            {/* Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <i className="fas fa-map-marker-alt text-brand-blue text-lg mt-1"></i>
                    <div>
                        <h3 className="font-semibold text-sm text-gray-500 uppercase mb-1">{t('business.contact')}</h3>
                        <p>{business.address}</p>
                    </div>
                </div>
                
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-start gap-3">
                    <i className="fas fa-clock text-brand-blue text-lg mt-1"></i>
                    <div>
                        <h3 className="font-semibold text-sm text-gray-500 uppercase mb-1">{t('business.schedule')}</h3>
                        <ul className="text-sm space-y-1">
                            {Object.entries(business.schedule).map(([day, hours]) => (
                                <li key={day}><span className="font-medium">{day}:</span> {hours}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-2 divide-x dark:divide-gray-700">
                    {business.phone && (
                        <a href={`tel:${business.phone}`} className="p-4 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <i className="fas fa-phone text-brand-blue mb-1 text-xl"></i>
                            <span className="text-sm font-medium">{t('business.call')}</span>
                        </a>
                    )}
                    {business.whatsapp && (
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="p-4 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <i className="fab fa-whatsapp text-green-500 mb-1 text-xl"></i>
                            <span className="text-sm font-medium">{t('business.whatsapp')}</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Map Link Button */}
            <a 
                href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-4 bg-brand-blue text-white rounded-xl text-center font-bold text-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <i className="fas fa-location-arrow"></i>
                Obtener Ruta
            </a>

            {/* Photo Gallery Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <i className="fas fa-images text-brand-orange"></i>
                        {t('business.photos')}
                    </h3>
                    <button 
                        onClick={handleAddPhoto}
                        className="text-xs bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1"
                    >
                        <i className="fas fa-camera"></i>
                        <span>Agregar foto</span>
                    </button>
                </div>
                
                {business.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {business.photos.map((photo, index) => (
                            <div 
                                key={index} 
                                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
                                onClick={() => openLightbox(index)}
                            >
                                <img 
                                    src={photo} 
                                    alt={`${business.name} ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group">
                                    <i className="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 text-2xl drop-shadow-md transition-opacity"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500">
                        No hay fotos adicionales disponibles.
                    </div>
                )}
            </div>
            
            <div className="h-16"></div> {/* Spacer for bottom nav */}
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fadeIn">
                <button 
                    onClick={closeLightbox}
                    className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
                >
                    <i className="fas fa-times text-2xl"></i>
                </button>

                <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50"
                >
                    <i className="fas fa-chevron-left text-2xl"></i>
                </button>

                <div className="w-full h-full max-w-4xl max-h-screen p-4 flex items-center justify-center">
                    <img 
                        src={business.photos[currentImageIndex]} 
                        alt={`${business.name} full view`} 
                        className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                    />
                </div>

                <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-50"
                >
                    <i className="fas fa-chevron-right text-2xl"></i>
                </button>

                <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm font-medium">
                    {currentImageIndex + 1} / {business.photos.length}
                </div>
            </div>
        )}
    </div>
  );
};

export default BusinessDetailPage;
