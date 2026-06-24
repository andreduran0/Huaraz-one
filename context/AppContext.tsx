
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { businesses as businessData } from '../data/businesses';
import { coupons as couponData } from '../data/coupons';
import { blogPosts as initialBlogPosts, BlogPost } from '../data/blogPosts';
import { Business, Coupon } from '../types';

type Language = 'es' | 'en';

interface SocialLinks {
  instagram: string;
  tiktok: string;
  youtube: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  businesses: Business[];
  addBusiness: (business: Business) => void;
  updateBusiness: (updatedBusiness: Business) => void;
  deleteBusiness: (id: string) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  coupons: Coupon[];
  heroImages: string[];
  setHeroImages: (images: string[]) => void;
  socialLinks: SocialLinks;
  updateSocialLinks: (links: SocialLinks) => void;
  lastSync: number;
}

const DEFAULT_HERO_IMAGES = [
   "https://i.imgur.com/j92MFOS.jpeg", 
    "https://i.imgur.com/atYSlat.jpeg",
  "https://i.imgur.com/Ub8hD9l.jpeg", 
  "https://i.imgur.com/cnfE46t.jpeg", 
  "https://i.imgur.com/M1m2fRS.jpeg", 
  "https://i.imgur.com/HDLq4qK.jpeg",
  "https://i.imgur.com/8Q4f1qU.jpeg"
];

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/'
};

// Claves estables para evitar pérdida de datos entre versiones
const STORAGE_KEYS = {
  BUSINESSES: 'hz_explorer_biz_stable',
  BLOG_POSTS: 'hz_explorer_blog_stable',
  HERO_IMAGES: 'hz_explorer_hero_stable',
  LANGUAGE: 'hz_explorer_lang_stable',
  SOCIAL_LINKS: 'hz_explorer_social_stable'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastSync, setLastSync] = useState(Date.now());
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved === 'es' || saved === 'en') ? saved : 'es';
  });
  
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!saved) return businessData;
    
    try {
      const savedBiz: Business[] = JSON.parse(saved);
      
      // Crear un mapa de los negocios guardados (negocios de usuarios)
      const savedMap = new Map(savedBiz.map(b => [b.id, b]));
      
      // Los negocios del código (businessData) SIEMPRE tienen prioridad y deben estar presentes
      // Identificamos cuáles son del sistema (están en businessData)
      const systemIds = new Set(businessData.map(b => b.id));
      
      // Negocios que el usuario pudo haber añadido manualmente (no están en el código)
      const userAddedBiz = savedBiz.filter(b => !systemIds.has(b.id));
      
      // El estado final es: Negocios del código + Negocios añadidos por el usuario
      return [...businessData, ...userAddedBiz];
    } catch (e) {
      return businessData;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    if (!saved) return initialBlogPosts;
    
    try {
      const savedPosts: BlogPost[] = JSON.parse(saved);
      const systemIds = new Set(initialBlogPosts.map(p => p.id));
      const userAddedPosts = savedPosts.filter(p => !systemIds.has(p.id));
      return [...initialBlogPosts, ...userAddedPosts];
    } catch (e) {
      return initialBlogPosts;
    }
  });

  const [coupons] = useState<Coupon[]>(couponData);
  
  const [heroImages, setHeroImagesState] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HERO_IMAGES);
    return saved ? JSON.parse(saved) : DEFAULT_HERO_IMAGES;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS);
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_LINKS;
  });

  // Guardado automático y actualización de timestamp de sincronización
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(blogPosts));
    localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(heroImages));
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(socialLinks));
    setLastSync(Date.now());
  }, [businesses, blogPosts, heroImages, language, socialLinks]);

  const addBusiness = (business: Business) => {
    setBusinesses(prev => [business, ...prev]);
  };

  const updateBusiness = (updatedBusiness: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const setHeroImages = (images: string[]) => {
    setHeroImagesState(images);
  };

  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
  };

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      businesses, 
      addBusiness,
      updateBusiness, 
      deleteBusiness,
      blogPosts,
      addBlogPost,
      deleteBlogPost,
      coupons, 
      heroImages, 
      setHeroImages,
      socialLinks,
      updateSocialLinks,
      lastSync
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
