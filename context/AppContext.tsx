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
  refreshBusinesses: () => Promise<void>;
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

const hasNonEmptyString = (val: unknown): val is string =>
  typeof val === 'string' && val.trim().length > 0;

const hasNonEmptyArray = (val: unknown): val is unknown[] =>
  Array.isArray(val) && val.length > 0;

/**
 * Fusiona un registro de Supabase con su base local (si existe) para conservar
 * una estructura ordenada y completa, usando siempre el UUID de Supabase como ID principal.
 */
const mergeSupabaseBusiness = (row: any, localMatch?: Business): Business => {
  const base: any = localMatch ? { ...localMatch } : {};

  const galleryFromDb = hasNonEmptyArray(row.gallery_urls)
    ? row.gallery_urls.filter((u: unknown) => hasNonEmptyString(u))
    : [];

  const photosFromDb = hasNonEmptyArray(row.photos)
    ? row.photos.filter((u: unknown) => hasNonEmptyString(u))
    : [];

  const coverImage = hasNonEmptyString(row.imagen_url)
    ? row.imagen_url.trim()
    : hasNonEmptyString(row.image)
    ? row.image.trim()
    : photosFromDb[0] || galleryFromDb[0] || base.image || '';

  const mergedPhotos =
    galleryFromDb.length > 0
      ? galleryFromDb
      : photosFromDb.length > 0
      ? photosFromDb
      : hasNonEmptyArray(base.photos)
      ? base.photos
      : coverImage
      ? [coverImage]
      : [];

  const menuImagesFromDb = hasNonEmptyArray(row.menuImages)
    ? row.menuImages.filter((u: unknown) => hasNonEmptyString(u))
    : hasNonEmptyArray(row.menu_images)
    ? row.menu_images.filter((u: unknown) => hasNonEmptyString(u))
    : hasNonEmptyArray(base.menuImages)
    ? base.menuImages
    : [];

  const scheduleFromDb =
    row.schedule && typeof row.schedule === 'object' && Object.keys(row.schedule).length > 0
      ? row.schedule
      : base.schedule || {};

  const merged: any = {
    ...base,
    ...row,
    // El UUID real de Supabase pasa a ser el ID oficial en toda la app
    id: String(row.id),
    legacyId: localMatch ? String(localMatch.id) : row.legacy_id || undefined,
    name: hasNonEmptyString(row.name) ? row.name.trim() : base.name || 'Negocio',
    category: hasNonEmptyString(row.category) ? row.category.trim() : base.category || 'other',
    description: hasNonEmptyString(row.description) ? row.description.trim() : base.description || '',
    address: hasNonEmptyString(row.location)
      ? row.location.trim()
      : hasNonEmptyString(row.address)
      ? row.address.trim()
      : base.address || '',
    phone: hasNonEmptyString(row.phone) ? row.phone.trim() : base.phone || '',
    whatsapp: hasNonEmptyString(row.whatsapp_number)
      ? row.whatsapp_number.trim()
      : hasNonEmptyString(row.whatsapp)
      ? row.whatsapp.trim()
      : base.whatsapp || '',
    image: coverImage,
    photos: mergedPhotos,
    menuImages: menuImagesFromDb,
    schedule: scheduleFromDb,
    adLevel: row.adLevel || row.ad_level || base.adLevel || 'NONE',
    lat: typeof row.lat === 'number' ? row.lat : base.lat,
    lng: typeof row.lng === 'number' ? row.lng : base.lng,
  };

  return merged as Business;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastSync, setLastSync] = useState(Date.now());

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'es' || saved === 'en' ? saved : 'es';
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!saved) return businessData;

    try {
      const savedBiz: Business[] = JSON.parse(saved);
      if (!Array.isArray(savedBiz) || savedBiz.length === 0) return businessData;

      const localIds = new Set(businessData.map((b) => String(b.id)));
      const localNames = new Set(businessData.map((b) => normalizeKey(b.name)));

      const extraBiz = savedBiz.filter((b) => {
        const idStr = String(b.id);
        const normName = normalizeKey(b.name);
        return !localIds.has(idStr) && !(normName && localNames.has(normName));
      });

      return [...businessData, ...extraBiz];
    } catch {
      return businessData;
    }
  });

  const syncBusinessesFromSupabase = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from('businesses').select('*');
      if (error || !Array.isArray(data) || data.length === 0) return;

      setBusinesses((prevList) => {
        const localById = new Map<string, Business>();
        const localByName = new Map<string, Business>();

        for (const item of [...businessData, ...prevList]) {
          localById.set(String(item.id), item);
          const nKey = normalizeKey(item.name);
          if (nKey && !localByName.has(nKey)) {
            localByName.set(nKey, item);
          }
        }

        const matchedLocalKeys = new Set<string>();
        const syncedFromDb: Business[] = [];

        for (const row of data) {
          if (!row || !row.id) continue;
          const rowIdStr = String(row.id);
          const rowNameKey = normalizeKey(row.name);

          const localMatch =
            localById.get(rowIdStr) ||
            (rowNameKey ? localByName.get(rowNameKey) : undefined);

          if (localMatch) {
            matchedLocalKeys.add(String(localMatch.id));
            const mKey = normalizeKey(localMatch.name);
            if (mKey) matchedLocalKeys.add(mKey);
          }

          syncedFromDb.push(mergeSupabaseBusiness(row, localMatch));
        }

        // Conserva negocios locales que aún no se han subido a Supabase
        const remainingLocal = businessData.filter((b) => {
          const bId = String(b.id);
          const bName = normalizeKey(b.name);
          return !matchedLocalKeys.has(bId) && !(bName && matchedLocalKeys.has(bName));
        });

        return [...syncedFromDb, ...remainingLocal];
      });

      setLastSync(Date.now());
    } catch (err) {
      console.error('Error sincronizando negocios desde Supabase:', err);
    }
  }, []);

  useEffect(() => {
    void syncBusinessesFromSupabase();

    const handleFocus = () => {
      void syncBusinessesFromSupabase();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [syncBusinessesFromSupabase]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
    if (!saved) return initialBlogPosts;

    try {
      const savedPosts: BlogPost[] = JSON.parse(saved);
      const systemIds = new Set(initialBlogPosts.map((p) => p.id));
      const userAddedPosts = savedPosts.filter((p) => !systemIds.has(p.id));
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
    setBusinesses((prev) => [business, ...prev]);
  };

  const updateBusiness = (updatedBusiness: Business) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updatedBusiness.id ? updatedBusiness : b))
    );
  };

  const deleteBusiness = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const addBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => [post, ...prev]);
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const setHeroImages = (images: string[]) => {
    setHeroImagesState(images);
  };

  const updateSocialLinks = (links: SocialLinks) => {
    setSocialLinks(links);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        businesses,
        refreshBusinesses: syncBusinessesFromSupabase,
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
        lastSync,
      }}
    >
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
