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
    id: '5',
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
    description: 'La Carpa Rosa es un espacio gastronómico en el corazón de Huaraz que combina sabor, calidez y una experiencia acogedora. Destaca por su propuesta de cocina peruana con énfasis en parrillas, caldos reconfortantes y platos preparados al momento con ese toque casero que conquista. Es el lugar ideal para compartir con amigos o en familia en un ambiente íntimo y agradable, donde la iluminación cálida y la buena música crean momentos especiales.',
    address: 'Jr. Teófilo Castillo 539, Huaraz',
    lat: -9.4280, lng: -77.4270, 
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
    googleMapsQuery: 'JR.teofilo castillo 539,Huaraz,Peru'
  }, // <--- ¡AQUÍ ESTABA EL ERROR! Faltaba esta pequeña pero destructiva coma.
  {
    id: 'encuentro-de-los-andes',
    name: 'Encuentro de los Andes',
    category: BusinessCategory.RESTAURANT,
    description: 'Sumérgete en la tradición y disfruta de los auténticos sabores andinos que hemos preparado especialmente para ti.\n\n¡Una experiencia gastronómica que honra nuestras raíces!\n¡Te esperamos para compartir esta fecha especial!',
    address: 'Av. Luzuriaga N·702 (Segundo piso Serpost) - Huaraz',
    lat: -9.3320, lng: -77.5955,
    phone: '+51 920 784 431', 
    whatsapp: '51920784431',
    photos: [
      'https://i.imgur.com/Uk4Hsz5.jpeg',
      'https://i.imgur.com/IWcEyPs.jpeg',
      'https://i.imgur.com/K3yMslb.jpeg',
      'https://i.imgur.com/jMkMfRT.jpeg',
      'https://i.imgur.com/t2KWtH5.jpeg',
      'https://i.imgur.com/0z1xYwP.jpeg',
      'https://i.imgur.com/jsXCVce.jpeg',
      'https://i.imgur.com/97AH2FD.jpeg',
      'https://i.imgur.com/ECNAZ0r.jpeg',
      'https://i.imgur.com/fcJi0gv.jpeg',
      'https://i.imgur.com/d93aboS.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/97AH2FD.jpeg',
      'https://i.imgur.com/jsXCVce.jpeg',
      'https://i.imgur.com/ECNAZ0r.jpeg'     
    ],
    schedule: { 
      'Lunes - Domingo': '7:00 AM - 12:00 AM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-encuentro-andes',
    status: 'approved', 
    ownerUserId: 'u7',
    googleMapsQuery: 'Av. Luzuriaga 702 Huaraz'
  },
  {
    id: '8',
    name: 'Norabuena pollos y parillas',
    category: BusinessCategory.RESTAURANT,
    description: '¡El verdadero sabor a la brasa en el corazón de Huaraz! En Norabuena Pollos y Parrillas te esperamos con los pollos más jugosos, doraditos y con esa sazón inconfundible que nos caracteriza. Disfruta también de nuestras contundentes parrillas, carnes seleccionadas y guarniciones generosas. Un ambiente familiar y atención de primera, justo frente al histórico monumento de Pumacayán. ¡Tu antojo de un buen pollo a la brasa se cumple aquí!',
    address: 'Jr.Ramón Castilla 1ra.Cuadra -Frente al monumento pumacayan ,Huaraz',
    lat: -9.5020, 
    lng: -77.4655,
    phone: '+51 930811600', 
    whatsapp: '51930811600',
    photos: [
      'https://i.imgur.com/O6f4j0e.jpeg',
      'https://i.imgur.com/Rj1BovP.jpeg',
      'https://i.imgur.com/swW2iCB.jpeg',
      'https://i.imgur.com/2ZMLDYb.jpeg',
      'https://i.imgur.com/yaCbzmw.jpeg',
      'https://i.imgur.com/urYuVVz.jpeg',
      'https://i.imgur.com/me8ec0a.png',
      'https://i.imgur.com/Cvx0nZl.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/aB4OnKu.jpeg',
      'https://i.imgur.com/NYCp4CN.jpeg',
      'https://i.imgur.com/jJLu1Cl.jpeg',
      'https://i.imgur.com/tJesKoY.jpeg',
      'https://i.imgur.com/7mwJlNr.jpeg'
    ],
    schedule: { 
      'Lunes- Sábado': '12:00 AM - 11:45 PM',
      'Domingo': '12:00 AM - 12:45 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-1',
    status: 'approved', 
    ownerUserId: 'u8',
    googleMapsQuery: 'Jr.Ramón Castilla 1ra .cuadra - frente al monumento de pumacayan'
  },
  {
    id: 'chifa-gran-muralla-2',
    name: 'Chifa la Gran Muralla 2 - Huaraz',
    category: BusinessCategory.RESTAURANT,
    description: 'Descubre la verdadera fusión peruano-china en el corazón de Huaraz. En Chifa La Gran Muralla 2 te ofrecemos platillos generosos con ese inconfundible sabor a wok: desde el clásico Arroz Chaufa y Tallarín Saltado, hasta nuestras especialidades de la casa. El ambiente ideal para compartir en familia, con amigos o recargar energías después de un intenso día de trekking por la Cordillera Blanca. ¡Tradición, rapidez y excelente sabor garantizados!',
    address: 'Jr. San Martin 746, Huaraz',
    lat: -9.5020, 
    lng: -77.4915,
    phone: '+51 953604939', 
    whatsapp: '51953604939',
    photos: [
      'https://i.imgur.com/b1wtWbn.jpeg',
      'https://i.imgur.com/zAXoJmG.jpeg',
      'https://i.imgur.com/B3n05vg.jpeg',
      'https://i.imgur.com/aEI048s.jpeg',
      'https://i.imgur.com/aCvCeGC.jpeg',
      'https://i.imgur.com/lIUScrV.jpeg',
      'https://i.imgur.com/dKm8vtU.jpeg',
      'https://i.imgur.com/12wn8WU.jpeg',
      'https://i.imgur.com/2RObRKw.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/1bgG7sf.jpeg',
      'https://i.imgur.com/zU64hB1.jpeg',
      'https://i.imgur.com/DklUbHd.jpeg',
      'https://i.imgur.com/V3yIilM.jpeg',
      'https://i.imgur.com/9EoyOiE.jpeg',
      'https://i.imgur.com/mL2f57t.jpeg',
      'https://i.imgur.com/9gOJ7Kq.jpeg',
      'https://i.imgur.com/lpB1UC8.jpeg',
      'https://i.imgur.com/47d2Jr7.jpeg',
      'https://i.imgur.com/a5ATN6a.jpeg',
      'https://i.imgur.com/75xjv1i.jpeg'
    ],
    schedule: { 
      'Lunes - Domingo': '12:00 PM - 10:30 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-gran-muralla-2',
    status: 'approved', 
    ownerUserId: 'u9',
    googleMapsQuery: 'Jr. San Martin 746 Huaraz',
  },
];
