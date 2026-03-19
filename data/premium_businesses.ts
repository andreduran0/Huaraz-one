import { Business, AdLevel, BusinessCategory } from '../types';

export const premiumBusinesses: Business[] = [
  {
    id: 'cumbre-rataquenua',
    name: 'Cumbre - Mirador Rataquenua',
    category: BusinessCategory.RESTAURANT,
    description: 'Restaurante ubicado en el mirador de Rataquenua. Disfruta de una vista panorámica inigualable de Huaraz y la Cordillera Blanca junto a una experiencia gastronómica de altura con platos regionales y fusión.',
    address: 'Mirador de Rataquenua, Huaraz',
    lat: -9.5020, lng: -77.4955,
    phone: '+51 937 511 052', 
    whatsapp: '51937511052',
    photos: [
      'https://i.imgur.com/UYGAUFo.png',
      'https://i.imgur.com/D71gIL8.jpeg',
      'https://i.imgur.com/RFp35tk.jpeg',
      'https://i.imgur.com/BjB7oO5.jpeg',
      'https://i.imgur.com/QL9W5eh.png',
      'https://i.imgur.com/KfueoI2.png',
      'https://i.imgur.com/me8ec0a.png',
      'https://i.imgur.com/yuSQkZR.jpeg',
      'https://i.imgur.com/X7D3n07.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/ShOgyni.jpeg',
      'https://i.imgur.com/czMNuCu.jpeg',
      'https://i.imgur.com/fwjErEv.jpeg',
      'https://i.imgur.com/tJesKoY.jpeg',
      'https://i.imgur.com/7mwJlNr.jpeg',
      'https://i.imgur.com/d3K0vND.jpeg'
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
  },
  {
    id: 'nobel-ingenieros',
    name: 'Colegio Nobel Ingenieros - Huaraz',
    category: BusinessCategory.EDUCATION,
    description: 'Institución Educativa líder en Huaraz, dedicada a la formación integral de estudiantes con un enfoque en ingeniería y ciencias. Nuestra propuesta educativa combina la excelencia académica con el desarrollo de valores, preparando a los líderes del mañana en un entorno moderno y estratégico.',
    address: 'Jr. Augusto B. Leguía n.º 267, Huaraz - Independencia',
    lat: -9.5260, lng: -77.5280, 
    phone: '914915067',
    whatsapp: '51929866812',
    photos: [
      'https://i.imgur.com/sWSy9U7.jpeg',
      'https://i.imgur.com/5ggUUSy.jpeg',
      'https://i.imgur.com/mvA1Qv4.jpeg',
      'https://i.imgur.com/e3RpShL.jpeg',
      'https://i.imgur.com/WXYVg0m.jpeg',
      'https://i.imgur.com/5yMkzBx.jpeg',
      'https://i.imgur.com/GxiGrB4.jpeg',
      'https://i.imgur.com/dHCJc59.jpeg',
      'https://i.imgur.com/Z00ya3W.jpeg',
      'https://i.imgur.com/YzFeoO2.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/Bo4Q31y.jpeg',
      'https://i.imgur.com/ekwynG7.jpeg',
      'https://i.imgur.com/F8QGM0R.jpeg',
      'https://i.imgur.com/N5gwaj0.jpeg',
      'https://i.imgur.com/Gk2JhpV.jpeg'
    ],
    schedule: {
      'Lunes - Viernes': '7:15 A. M. - 1:00 P. M. | 3:30 P. M. - 7:00 P. M.'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-nobel',
    status: 'approved',
    ownerUserId: 'u2',
    googleMapsQuery: 'Colegio Nobel Ingenieros Huaraz',
  },
  {
    id: 'policlinico-doctor-d',
    name: 'Policlínico Doctor D - Huaraz',
    category: BusinessCategory.HEALTH,
    description: 'Policlínico especializado en brindar atención médica integral de alta calidad en Huaraz. Contamos con un equipo de profesionales comprometidos con tu bienestar, ofreciendo servicios de diagnóstico, consulta externa y especialidades médicas con tecnología de vanguardia y calidez humana.',
    address: 'Jr. Damaso Antúnez N.º 744, Huaraz',
    lat: -9.5290, lng: -77.5270, 
    phone: '954758684',
    whatsapp: '51954758684',
    photos: [
      'https://i.imgur.com/jdi4vRu.jpeg', 
      'https://i.imgur.com/79ugdQF.jpeg'  
    ],
    menuImages: [
      'https://i.imgur.com/79ugdQF.jpeg',
      'https://i.imgur.com/2ZmoEhR.jpeg',
      'https://i.imgur.com/hsEbVpb.jpeg',
      'https://i.imgur.com/hsEbVpb.jpeg',
      'https://i.imgur.com/AasZwU8.jpeg'
    ],
    schedule: {
      'Lunes - Sábado': '7:00 A. M. - 7:00 P. M.'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-doctor-d',
    status: 'approved',
    ownerUserId: 'u3',
    googleMapsQuery: 'Jr. Damaso Antúnez 744 Huaraz',
  },
  {
    id: 'del-sole-huaraz',
    name: 'Del Sole - Huaraz',
    category: BusinessCategory.RESTAURANT,
    description: 'Restaurante ubicado en una zona estratégica de Huaraz. Disfruta de nuestra variada propuesta gastronómica con atención en horario extendido. Explora nuestra carta y solicita tu reserva de manera rápida y segura.',
    address: 'Av. Luzuriaga N° 1004 Belén ',
    lat: -9.5285, lng: -77.5276,
    phone: '961951453',
    whatsapp: '51961951453',
    photos: [
      'https://i.imgur.com/DnMZLSY.jpeg',
      'https://i.imgur.com/GOjggrc.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/BNyaQ6M.jpeg',
    ],
    schedule: {
      'Lunes - Domingo': '12:00 P. M. - 11:00 P. M.'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-sole',
    status: 'approved',
    ownerUserId: 'u4',
    googleMapsQuery: 'Av Luzuriaga 1004 Huaraz'
  },
  {
    id: 'casa-huayaney',
    name: 'Casa de Cambio Huayaney',
    category: BusinessCategory.EXCHANGE,
    description: 'Cambio de moneda seguro y con la mejor tasa del mercado en el corazón de Huaraz. Ubicación estratégica y atención confiable para turistas y locales. ¡Cambia tus dólares o euros con total tranquilidad!',
    address: 'Pasaje Comercio (1era. Tienda costado del Banco Interbank), Jirón José de Sucre S/N, Huaraz',
    lat: -9.5301, lng: -77.5288,
    phone: '943121714',
    whatsapp: '51943121714',
    photos: [
      'https://i.imgur.com/QsA2tix.jpeg',
      'https://i.imgur.com/w03Lg3j.jpeg',
      'https://i.imgur.com/aBpTQOx.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/w03Lg3j.jpeg',
      'https://i.imgur.com/L19rlcr.jpeg'
    ],
    schedule: {
      'Lunes - Domingo': '8:00 A. M. - 5:00 P. M.'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-huayaney',
    status: 'approved',
    ownerUserId: 'u5',
    googleMapsQuery: 'Jirón José de Sucre Pasaje Comercio Huaraz'
  },
  {
    id: 'la-carpa-rosa',
    name: 'La Carpa Rosa',
    category: BusinessCategory.RESTAURANT,
    description: 'La Carpa Rosa es un espacio gastronómico en el corazón de Huaraz que combina sabor, calidez y una experiencia acogedora que invita a quedarse. Este restaurante destaca por ofrecer una propuesta de cocina peruana con énfasis en parrillas, caldos reconfortantes y platos preparados al momento, con ese toque casero que conquista desde el primer bocado.\n\nEl ambiente del local es uno de sus mayores atractivos: un espacio tranquilo, familiar y cuidadosamente ambientado que transmite la sensación de estar en casa. Es el lugar ideal tanto para compartir con amigos como para disfrutar en familia o tener una cena relajada. La iluminación cálida y el concepto del espacio crean una experiencia íntima y agradable.\n\nEn su carta destacan opciones como alitas a la parrilla, bistec y chuletas jugosas, preparadas con un estilo tradicional y un sabor auténtico que resalta la cocina peruana. Cada plato refleja dedicación, sencillez y calidad, convirtiendo cada visita en una experiencia reconfortante.\n\nAdemás, La Carpa Rosa no solo es un restaurante, sino también un punto de encuentro donde se viven momentos especiales, con eventos, música y celebraciones que le dan vida al lugar y lo convierten en un espacio lleno de alegría.',
    address: 'Jr. Teófilo Castillo 555, Huaraz',
    lat: -9.5280, lng: -77.5270,
    phone: '+51 972 399 950', 
    whatsapp: '51972399950',
    photos: [
      'https://i.imgur.com/GzLTgsb.jpeg',
      'https://i.imgur.com/qKfHrvI.jpeg',
      'https://i.imgur.com/bywYCLE.jpeg',
      'https://i.imgur.com/tffGiMN.jpeg',
      'https://i.imgur.com/VwXsY4v.jpeg',
      'https://i.imgur.com/SM2HcNP.jpeg',
      'https://i.imgur.com/me8ec0a.png',
      'https://i.imgur.com/lVlo3Ao.jpeg',
      'https://i.imgur.com/X7clC6l.jpeg',
      'https://i.imgur.com/3auk61T.jpeg',
      'https://i.imgur.com/u5uRLt0.jpeg',
      'https://i.imgur.com/clrNKMZ.jpeg',
      'https://i.imgur.com/Qoq0Nai.jpeg',
      'https://i.imgur.com/5jRq1N9.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/DCqjS4k.jpeg',
      'https://i.imgur.com/0YpkPTe.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '6:00 PM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-carpa-rosa',
    status: 'approved', 
    ownerUserId: 'u6',
    googleMapsQuery: 'JR.teofilo castillo 555,Huaraz,Peru'
  }
];
