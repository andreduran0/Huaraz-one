
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { businesses as businessData } from '../data/businesses';
import { coupons as couponData } from '../data/coupons';
import { Business, Coupon } from '../types';

type Language = 'es' | 'en';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  businesses: Business[];
  updateBusiness: (updatedBusiness: Business) => void;
  coupons: Coupon[];
  heroImages: string[];
  setHeroImages: (images: string[]) => void;
}
const DEFAULT_HERO_IMAGES = [
  "https://www.lalotravel.com/wp-content/uploads/2025/02/portada-tours-laguna-llanganuco.jpg", 
  "https://i.imgur.com/cnfE46t.jpeg", 
  "https://content.r9cdn.net/rimg/dimg/17/1d/38963bbb-city-58607-173326d42bf.jpg?width=1366&height=768&xhint=2671&yhint=1747&crop=true",
  "https://bananomeridiano.com/wp-content/uploads/2019/10/trekking-santa-cruz-huaraz.jpg",
  "https://bananomeridiano.com/wp-content/uploads/2022/03/laguna-paron-huaraz.jpg", 
  "https://pamelatours.com/wp-content/uploads/2019/10/laguna69.jpg",
  "https://www.antamina.com/wp-content/uploads/2020/02/carnaval-huaraz-rompecalle-9.jpg"
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('huaraz_explorer_businesses');
    return saved ? JSON.parse(saved) : businessData;
  });
  const [coupons] = useState<Coupon[]>(couponData);
  const [heroImages, setHeroImagesState] = useState<string[]>(() => {
    const saved = localStorage.getItem('huaraz_explorer_hero_images');
    return saved ? JSON.parse(saved) : DEFAULT_HERO_IMAGES;
  });

  useEffect(() => {
    localStorage.setItem('huaraz_explorer_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('huaraz_explorer_hero_images', JSON.stringify(heroImages));
  }, [heroImages]);

  const updateBusiness = (updatedBusiness: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
  };

  const setHeroImages = (images: string[]) => {
    setHeroImagesState(images);
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      businesses, 
      updateBusiness, 
      coupons, 
      heroImages, 
      setHeroImages 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
