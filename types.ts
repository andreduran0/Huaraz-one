
export enum AdLevel {
  NONE = 'none',
  ESTANDAR = 'estandar',
  PREMIUM = 'premium',
}

export enum BusinessCategory {
  RESTAURANT = 'restaurant',
  POLLERIA = 'polleria',
  CEVICHERIA = 'cevicheria',
  LAUNDRY = 'laundry',
  HOTEL = 'hotel',
  DENTIST = 'dentist',
  BAKERY = 'bakery',
  TOURIST_SPOT = 'tourist_spot',
  EDUCATION = 'education',
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
