
import { Business, AdLevel, BusinessCategory } from '../types';

export const premiumBusinesses: Business[] = [
  {
    id: '1',
    name: 'Cumbre - Mirador Rataquenua',
    category: BusinessCategory.RESTAURANT,
    description: 'Restaurante ubicado en el mirador de Rataquenua. Disfruta de una vista panorámica inigualable de Huaraz y la Cordillera Blanca junto a una experiencia gastronómica de altura con platos regionales y fusión.',
    address: 'Mirador de Rataquenua, Huaraz',
    lat: -9.5020, lng: -77.4955,
    phone: '+51 937 511 052', 
    whatsapp: '51937511052',
    photos: [
      'https://i.imgur.com/UYGAUFo.png', // Imagen Principal (Hero)
      'https://i.imgur.com/D71gIL8.jpeg', // Vista Nocturna/Ambiente
      'https://i.imgur.com/RFp35tk.jpeg', // Experiencia/Plato
      'https://i.imgur.com/BjB7oO5.jpeg', // Paisaje
      'https://i.imgur.com/QL9W5eh.png',  // Nueva foto añadida
      'https://i.imgur.com/KfueoI2.png',  // Nueva foto añadida
      'https://i.imgur.com/me8ec0a.png',  // Nueva foto añadida
      'https://i.imgur.com/yuSQkZR.jpeg', // Nueva foto añadida
      'https://i.imgur.com/X7D3n07.jpeg'  // Nueva foto añadida
    ],
    menuImages: [
      'https://i.imgur.com/ShOgyni.jpeg', // Carta Pág 1
      'https://i.imgur.com/czMNuCu.jpeg', // Carta Pág 2
      'https://i.imgur.com/fwjErEv.jpeg', // Carta Pág 3
      'https://i.imgur.com/tJesKoY.jpeg', // Carta Pág 4
      'https://i.imgur.com/7mwJlNr.jpeg', // Carta Pág 5
      'https://i.imgur.com/d3K0vND.jpeg'  // Carta Pág 6
    ],
    schedule: { 
      'Martes - Sábado': '11:30 AM - 9:00 PM',
      'Domingo': '11:00 AM - 8:30 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-1',
    status: 'approved', 
    ownerUserId: 'u1',
    googleMapsQuery: 'Mirador de Rataquenua Huaraz',
  }
];
