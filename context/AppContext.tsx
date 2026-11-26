import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { businesses as businessData } from '../data/businesses';
import { coupons as couponData } from '../data/coupons';
import { blogPosts as initialBlogPosts, BlogPost } from '../data/blogPosts';
import { Business, Coupon } from '../types';
import { getSupabase } from '../services/supabase';

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
  "https://i.imgur.com/8geuuEn.jpeg",
  "https://i.imgur.com/atYSlat.jpeg",
  "https://i.imgur.com/Prryi6n.jpeg",
  "https://i.imgur.com/7JOqLFT.jpeg",
  "https://i.imgur.com/j92MFOS.jpeg",
  "https://i.imgur.com/HDLq4qK.jpeg",
  "https://i.imgur.com/8Q4f1qU.jpeg"
];

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/'
};

const STORAGE_KEYS = {
  BUSINESSES: 'hz_explorer_biz_stable',
  BLOG_POSTS: 'hz_explorer_blog_stable',
  HERO_IMAGES: 'hz_explorer_hero_stable',
  LANGUAGE: 'hz_explorer_lang_stable',
  SOCIAL_LINKS: 'hz_explorer_social_stable'
};

const normalizeKey = (value?: string | null): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

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
      const systemIds = new Set(businessData.map(b => b.id));
      const userAddedBiz = savedBiz.filter(b => !systemIds.has(b.id));
      return [...businessData, ...userAddedBiz];
    } catch {
      return businessData;
    }
  });

  // Sincronización conservadora: mantiene el orden exacto y la categoría de businessData,
  // y solo inyecta los archivos/datos editados desde /socios.
  const syncPartnerUpdates = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from('businesses').select('*');
      if (error || !Array.isArray(data) || data.length === 0) return;

      const dbById = new Map<string, any>();
      const dbByName = new Map<string, any>();

      for (const row of data) {
        if (!row) continue;
        if (row.id) dbById.set(String(row.id), row);
        const key = normalizeKey(row.name);
        if (key) dbByName.set(key, row);
      }

      setBusinesses(prev =>
        prev.map((biz: any) => {
          const match =
            dbById.get(String(biz.id)) ||
            (biz.supabaseId ? dbById.get(String(biz.supabaseId)) : undefined) ||
            dbByName.get(normalizeKey(biz.name));

          if (!match) return biz;

          const extraGallery = Array.isArray(match.gallery_urls)
            ? match.gallery_urls.filter((u: unknown) => typeof u === 'string' && u.trim().length > 0)
            : [];

          return {
            ...biz,
            // Mantiene biz.id, biz.category y su posición exacta en el listado
            supabaseId: String(match.id),
            logo_url: match.logo_url || biz.logo_url || null,
            menu_url: match.menu_url || biz.menu_url || null,
            catalog_type: match.catalog_type || biz.catalog_type || 'carta',
            opening_hours: match.opening_hours || biz.opening_hours || '',
            cultural_description: match.cultural_description || biz.cultural_description || '',
            default_message: match.default_message || biz.default_message || '',
            whatsapp: match.whatsapp_number || match.whatsapp || biz.whatsapp,
            phone: match.phone || biz.phone,
            address: match.location || biz.address,
            photos: Array.from(
  new Set([
    ...(Array.isArray(biz.photos) ? biz.photos : []),
    ...(Array.isArray(extraGallery) ? extraGallery : []),
  ])
),
          };
        })
      );
    } catch (err) {
      console.error('Error silencioso sincronizando datos de socios:', err);
    }
  }, []);

  useEffect(() => {
    void syncPartnerUpdates();
  }, [syncPartnerUpdates]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    if (!saved) return initialBlogPosts;

    try {
      const savedPosts: BlogPost[] = JSON.parse(saved);
      const systemIds = new Set(initialBlogPosts.map(p => p.id));
      const userAddedPosts = savedPosts.filter(p => !systemIds.has(p.id));
      return [...initialBlogPosts, ...userAddedPosts];
    } catch {
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
