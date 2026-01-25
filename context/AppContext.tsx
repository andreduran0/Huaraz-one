
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
}

const DEFAULT_HERO_IMAGES = [
  "https://www.lalotravel.com/wp-content/uploads/2025/02/portada-tours-laguna-llanganuco.jpg", 
  "https://i.imgur.com/cnfE46t.jpeg", 
  "https://bananomeridiano.com/wp-content/uploads/2022/03/laguna-paron-huaraz.jpg", 
  "https://pamelatours.com/wp-content/uploads/2019/10/laguna69.jpg",
  "https://www.antamina.com/wp-content/uploads/2020/02/carnaval-huaraz-rompecalle-9.jpg"
];

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/'
};

const STORAGE_KEYS = {
  BUSINESSES: 'huaraz_explorer_businesses_v11',
  BLOG_POSTS: 'huaraz_explorer_blog_v11',
  HERO_IMAGES: 'huaraz_explorer_hero_images_v11',
  LANGUAGE: 'huaraz_explorer_lang_v11',
  SOCIAL_LINKS: 'huaraz_explorer_social_v11'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved === 'es' || saved === 'en') ? saved : 'es';
  });
  
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return saved ? JSON.parse(saved) : businessData;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    return saved ? JSON.parse(saved) : initialBlogPosts;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_IMAGES, JSON.stringify(heroImages));
  }, [heroImages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(socialLinks));
  }, [socialLinks]);

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
      updateSocialLinks
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
