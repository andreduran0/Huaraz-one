export enum AdLevel {
  NONE = 'none',
  ESTANDAR = 'estandar',
  PREMIUM = 'premium',
}

export enum BusinessCategory {
  RESTAURANT = 'restaurant',
  PIZZERIA = 'pizzeria',
  PANADERIA = 'panaderia',
  POLLERIA = 'polleria',
  CEVICHERIA = 'cevicheria',
  RESTOBAR = 'restobar',
  LAUNDRY = 'laundry',
  HOTEL = 'hotel',
  DENTIST = 'dentist',
  BAKERY = 'bakery', // Esta la usaremos para Panaderías
  TOURIST_SPOT = 'tourist_spot',
  EDUCATION = 'education',
  HEALTH = 'health',
  EXCHANGE = 'exchange',
  CHOCOLATERIA = 'chocolateria',
  // --- NUEVAS CATEGORÍAS ---
  SUSHI_BAR = 'sushi_bar',
  EMOLIENTERIA = 'emolienteria',
  TORTERIA = 'torteria',
  POSTRES = 'postres'
}
export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  whatsapp?: string;
  photos: string[];
rating?: number; 
  review_count?: number;
  menuImages?: string[]; // Campo para las páginas de la carta/menú
  schedule: { [key: string]: string };
  adLevel: AdLevel;
  adStartDate?: string;
  adEndDate?: string;
  qrCodeUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  ownerUserId: string;
  googleMapsQuery?: string;
}

export interface Coupon {
  id: string;
  businessId: string;
  title: string;
  description: string;
  code: string;
  expiryDate: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    isLoading?: boolean;
    sources?: GroundingSource[];
}
