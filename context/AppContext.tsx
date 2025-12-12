
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { businesses as businessData } from '../data/businesses';
import { coupons as couponData } from '../data/coupons';
import { Business, Coupon } from '../types';

type Language = 'es' | 'en';

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  businesses: Business[];
  coupons: Coupon[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');
  const [businesses] = useState<Business[]>(businessData);
  const [coupons] = useState<Coupon[]>(couponData);

  return (
    <AppContext.Provider value={{ language, setLanguage, businesses, coupons }}>
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