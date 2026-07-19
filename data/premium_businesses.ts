import { Business, AdLevel, BusinessCategory } from '../types';

export const premiumBusinesses: Business[] = [
   {
    id: '22',
    name: 'Hotel los Inkas',
    category: BusinessCategory.HOTEL, // Asegúrate de que HOTEL esté en tu enum BusinessCategory
    description: 'Hotel los Inkas Huaraz ofrece alojamiento cómodo y atención personalizada en un ambiente tranquilo y seguro. Habitaciones equipadas, WiFi gratuito y excelente ubicación. Contáctanos para reservar y mayor información.',
    address: 'Jr. Federico Sal y Rosas 305 - Huaraz',
    lat: -9.5300, 
    lng: -77.5200,
    phone: '+51 935 260 190', 
    whatsapp: '51935260190',
    photos: [
      'https://i.imgur.com/QAW2TPJ.jpeg',
      'https://i.imgur.com/YZkzYJL.jpeg',
      'https://i.imgur.com/F3TAAUa.jpeg',
      'https://i.imgur.com/PCKEWw7.jpeg',
      'https://i.imgur.com/BMWOpwY.jpeg',
      'https://i.imgur.com/ksVDWYy.jpeg',
      'https://i.imgur.com/BN9AG5e.jpeg',
      'https://i.imgur.com/b0BZZCt.jpeg',
      'https://i.imgur.com/zDrmMy2.jpeg',
      'https://i.imgur.com/n4pqRJu.jpeg',
     'https://i.imgur.com/1smYCth.jpeg',
      'https://i.imgur.com/7Jk23Jl.jpeg',
      'https://i.imgur.com/x1eIC7k.jpeg',
      'https://i.imgur.com/40f4728.jpeg',
      'https://i.imgur.com/n3YGCea.jpeg',
      'https://i.imgur.com/7InFGXj.jpeg',
      'https://i.imgur.com/2dHtnA7.jpeg',
      'https://i.imgur.com/tGJTIZp.jpeg',
      'https://i.imgur.com/wFpZGkJ.jpeg',
      'https://i.imgur.com/C7mdWhV.jpeg',
      'https://i.imgur.com/THXfoxn.jpeg',
      'https://i.imgur.com/8xyZcX6.jpeg',
      'https://i.imgur.com/yYvD4aX.jpeg',
      'https://i.imgur.com/Hk3xyLB.jpeg',
     'https://i.imgur.com/SP0gvGq.jpeg',
      'https://i.imgur.com/XSCLcfj.jpeg',
      'https://i.imgur.com/8k5D2XJ.jpeg',
      'https://i.imgur.com/LGa0Mgd.jpeg',
      'https://i.imgur.com/3zYZUnE.jpeg',
      'https://i.imgur.com/PvkSIf2.jpeg',
      'https://i.imgur.com/LGa0Mgd.jpeg',
      'https://i.imgur.com/8k5D2XJ.jpeg',
      'https://i.imgur.com/XSCLcfj.jpeg',
      'https://i.imgur.com/5tsUB68.jpeg',
      'https://i.imgur.com/FycEy5o.jpeg',
      'https://i.imgur.com/UiiK7oS.jpeg',
      'https://i.imgur.com/txdzn3c.jpeg',
      'https://i.imgur.com/GmrqKv7.jpeg',
      'https://i.imgur.com/UIh0ayu.jpeg',
      'https://i.imgur.com/flbBEx3.jpeg',
      'https://i.imgur.com/y6AzFxG.jpeg',
      'https://i.imgur.com/N8oDAKR.jpeg',
      'https://i.imgur.com/f7EKuAg.jpeg',
      'https://i.imgur.com/8IQuSIm.jpeg',
      'https://i.imgur.com/Ljua81V.jpeg',
      'https://i.imgur.com/fhQQ8JS.jpeg',
     'https://i.imgur.com/Pu9Vuw3.jpeg',
     'https://i.imgur.com/tZCSa8s.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/F3TAAUa.jpeg',
      'https://i.imgur.com/1smYCth.jpeg',
      'https://i.imgur.com/tGJTIZp.jpeg',
      'https://i.imgur.com/3zYZUnE.jpeg',
      'https://i.imgur.com/5tsUB68.jpeg',
      'https://i.imgur.com/y6AzFxG.jpeg'
    ],
    schedule: { 
      'Lunes - Domingo': '24 horas'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-22',
    status: 'approved', 
    ownerUserId: 'u22',
    googleMapsQuery: 'Jr. Federico Sal y Rosas 305 - Huaraz',
  },
  {
    id: '24',
    name: 'Hakuna Matata Restobar',
    category: BusinessCategory.RESTAURANT,
    description: 'Hakuna Matata es un restobar con alma ochentera y noventera, con la mejor música y eventos que llevan el alma del rock a los huaracinos. Tomarte una cerveza o un cóctel aquí es una vitrina hacia una nueva forma de disfrutar. Un local que propone una nueva especialidad en restauración con los mejores platos de Huaraz y una carta de presentación con shows en vivo infaltables donde podrás escuchar la música de nuestra región.',
    address: 'Pasaje Jesús Morales 977 - Huaraz - Ancash. (Referencia: a media cuadra de la Av. Gamarra con 28 de Julio, frente al CETPRO Teófilo Méndez Ramos).',
    lat: -9.5850,
    lng: -77.4945,
    phone: '+51 967477268',
    whatsapp: '51967477268',
    photos: [
      'https://i.imgur.com/1wmfoyB.jpeg',
      'https://i.imgur.com/pkO1HxJ.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/9g77qWL.jpeg',
      'https://i.imgur.com/C4Dwt5t.jpeg'
    ],
    schedule: {
      'Lunes - Sábado': '10:00 A.M - 11:00 P.M'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-24',
    status: 'approved',
    ownerUserId: 'u24',
    googleMapsQuery: 'Pasaje Jesús Morales 977 - Huaraz - Ancash',
  },
  {
    id: '23',
    name: 'EITZA - Pasta-Grill',
    category: BusinessCategory.RESTAURANT,
    // Usamos comillas invertidas (`) para permitir saltos de línea en la descripción
    description: `Eitza es una palabra de origen quechua que significa carne.
Nacimos en el corazón de los Andes, en Huaraz, con el propósito de ofrecer una experiencia gastronómica alrededor de los mejores cortes de carne de la ciudad. Nuestra propuesta combina parrilla, pastas, coctelería y una cuidada selección de vinos, todo en un ambiente cálido y elegante. Recibimos a viajeros, montañistas y amantes de la buena mesa que buscan calidad, excelente atención y sabores memorables. En Eitza, cada visita es una invitación a disfrutar la esencia de los Andes a través de una cocina que celebra el buen comer.`,
    address: 'Jirón Pedro Campos, Huaraz, Perú', // Ojo: en tu borrador decía Ramón Castilla en la dirección pero Pedro Campos en Google Maps. Lo unifiqué a Pedro Campos para que no haya errores de navegación.
    lat: -9.5070, 
    lng: -77.4645,
    phone: '+51 965 260 764', 
    whatsapp: '51965260764',
    photos: [
      'https://i.imgur.com/RHc9N2T.jpeg',
      'https://i.imgur.com/QR3WjrA.jpeg',
      'https://i.imgur.com/LJBl7UF.jpeg',
      'https://i.imgur.com/eYS42vB.jpeg',
      'https://i.imgur.com/psC6dPP.jpeg',
      'https://i.imgur.com/pHuVDF6.jpeg',
      'https://i.imgur.com/Q1Ds5Ci.jpeg',
      'https://i.imgur.com/cTz0sSK.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/E8JlBTE.jpeg',
      'https://i.imgur.com/oE9erns.jpeg',
      'https://i.imgur.com/vbbl5Fs.jpeg',
      'https://i.imgur.com/wjwiMvf.jpeg',
      'https://i.imgur.com/MUQWkSL.jpeg',
      'https://i.imgur.com/W26W8Zy.jpeg',
      'https://i.imgur.com/IFvt4w5.jpeg',
      'https://i.imgur.com/DYszvOh.jpeg',
      'https://i.imgur.com/RoCE5DY.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '12:00 PM - 11:00 PM',
      'Domingo': '1:00 PM - 10:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-23',
    status: 'approved', 
    ownerUserId: 'u23',
    googleMapsQuery: 'Jirón Pedro Campos, Huaraz, Perú'
  },
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
  {
    id: 'el-tio-enrique',
    name: 'El Tío Enrique - Resto Pub Suizo-Alemán',
    category: BusinessCategory.RESTAURANT,
    description: 'En El Tío Enrique te invitamos a explorar nuevos sabores con nuestras auténticas recetas suizo-alemanas y 58 variedades de cervezas. Vivirás experiencias únicas, rodeado del espíritu de las montañas y buenos momentos. ¡Descubre la aventura en cada plato y en cada brindis!',
    address: 'Jirón Simón Bolívar 572 - 2do piso, Huaraz',
    lat: -9.5290, 
    lng: -77.5280,
    phone: '+51 942441725', 
    whatsapp: '51942441725',
    photos: [
      'https://i.imgur.com/Xvktmxq.jpeg',
      'https://i.imgur.com/PfNzYlC.jpeg',
      'https://i.imgur.com/suo6VOf.jpeg',
      'https://i.imgur.com/BdcVhM5.jpeg',
      'https://i.imgur.com/fQ9k4Ff.jpeg',
      'https://i.imgur.com/Gf9GIDS.jpeg',
      'https://i.imgur.com/5KuG2pr.jpeg',
      'https://i.imgur.com/SW4aCx4.jpeg',
      'https://i.imgur.com/zxLZTWh.jpeg',
      'https://i.imgur.com/kK7OQcO.jpeg',
      'https://i.imgur.com/rhcCTdr.jpeg',
      'https://i.imgur.com/teCtTjV.jpeg',
      'https://i.imgur.com/7guu8lM.jpeg',
      'https://i.imgur.com/3JFztYC.jpeg',
      'https://i.imgur.com/dDCvNlL.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/1q6jtuI.jpeg',
      'https://i.imgur.com/7a8YUij.jpeg',
      'https://i.imgur.com/RVRmvPn.jpeg',
      'https://i.imgur.com/m7MzBmJ.jpeg',
      'https://i.imgur.com/UT7IlZJ.jpeg',
      'https://i.imgur.com/xtrZR2b.jpeg',
      'https://i.imgur.com/RooqYXW.jpeg'
    ],
    schedule: { 
      'Lunes - Jueves': '4:00 PM - 12:00 AM',
      'Viernes - Sábado': '4:00 PM - 1:00 AM',
      'Domingo': '5:00 PM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-tio-enrique',
    status: 'approved', 
    ownerUserId: 'u10',
    googleMapsQuery: 'Jirón Simon Bolivar 572 Huaraz',
  },
  {
    id: '47-ronnin-sushi-bar', // Usamos este ID para que la URL sea más profesional
    name: '47 RONNIN Sushi Bar',
    category: BusinessCategory.RESTAURANT,
    description: '47 RONNIN Sushi Bar es cocina japonesa con alma peruana, donde los sabores se encuentran con la tradición y la fusión cobra vida en cada plato. Una experiencia auténtica y llena de identidad.',
    address: 'Jr. Víctor Cordero 866 (Entre el Parque de las Banderas y la Av. Gamarra), Huaraz',
    lat: -9.5080, lng: -77.4955,
    phone: '+51 919589738', 
    whatsapp: '51919589738',
    photos: [
      'https://i.imgur.com/sjKRvJw.jpeg',
      'https://i.imgur.com/AW8ebUO.jpeg',
       'https://i.imgur.com/nrO4bgb.jpeg',
       'https://i.imgur.com/FURGgt1.jpeg',
      'https://i.imgur.com/3SV1XGc.jpeg',
      'https://i.imgur.com/PbLFKJs.jpeg',
      'https://i.imgur.com/QWE7Sdi.jpeg',
      'https://i.imgur.com/sJn7exu.jpeg',
      'https://i.imgur.com/K7g8s99.jpeg',
      'https://i.imgur.com/TkEZ1Fr.jpeg',
      'https://i.imgur.com/TXDxDrB.jpeg',
      'https://i.imgur.com/EWTQxbw.jpeg',
      'https://i.imgur.com/62QpcfB.jpeg',
      'https://i.imgur.com/YbhjIuo.jpeg',
      'https://i.imgur.com/EP7kphs.jpeg',
      'https://i.imgur.com/UYNwkA5.jpeg',
      'https://i.imgur.com/Tx5cXIL.jpeg',
      'https://i.imgur.com/Ij22xnD.jpeg',
      'https://i.imgur.com/Vt3Xs7b.jpeg',
      'https://i.imgur.com/JO8jxG7.jpeg',
      'https://i.imgur.com/Y86qTMb.jpeg',
      'https://i.imgur.com/iIQZZu9.jpeg',
      'https://i.imgur.com/P3u61uQ.jpeg',
      'https://i.imgur.com/XK1eh6L.jpeg',
      'https://i.imgur.com/JW9RPdA.jpeg',
      'https://i.imgur.com/uXEfyNB.jpeg',
      'https://i.imgur.com/h4WkHfK.jpeg',
      'https://i.imgur.com/QI6Ll4k.jpeg',
      'https://i.imgur.com/EXJ8tzz.jpeg',
      'https://i.imgur.com/3oCZ7YL.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/eN2vFdo.jpeg',
      'https://i.imgur.com/h5EypaQ.jpeg',
      'https://i.imgur.com/zNkEYyJ.jpeg',
      'https://i.imgur.com/gn61G95.jpeg',
      'https://i.imgur.com/oyEEgFB.jpeg',
      'https://i.imgur.com/ecH3o8I.jpeg'
    ],
    schedule: { 
      'Martes - Sábado': '5:00 PM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-47-ronnin',
    status: 'approved', 
    ownerUserId: 'u11', // Corregido el 'u1'1 que tenías
    googleMapsQuery: '47 RONNIN Sushi Bar Huaraz',
  },
 {
    id: 'vermiel-emolienteria',
    name: 'Vermiel - Emolientería',
    category: 'emolienteria' as BusinessCategory,
    description: 'Descubre la evolución de una tradición peruana en Vermiel. El refugio perfecto para abrigarte del clima andino con nuestras exclusivas fusiones de emoliente, hierbas medicinales e infusiones naturales. Acompaña tus bebidas calientes con deliciosos complementos en un ambiente cálido y acogedor. El lugar ideal para recargar energías y compartir una buena charla al caer la tarde.',
    address: 'Jr. Leonisa Lescano #635, Huaraz',
    lat: -9.7020, 
    lng: -77.4925,
    phone: '+51 990 312 326', 
    whatsapp: '51990312326',
    photos: [
      'https://i.imgur.com/Dk35w9S.jpeg',
      'https://i.imgur.com/eMZsflh.jpeg',
      'https://i.imgur.com/fpU0u9t.jpeg',
      'https://i.imgur.com/7FpLWdE.jpeg',
      'https://i.imgur.com/hMVHC73.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/4ohWXx9.jpeg',
      'https://i.imgur.com/wdzSszI.jpeg',
      'https://i.imgur.com/EdY4qCb.jpeg',
      'https://i.imgur.com/unpLF75.jpeg',
      'https://i.imgur.com/3qod57b.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '9:00 AM - 11:00 PM',
      'Domingo': '4:00 PM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-vermiel',
    status: 'approved', 
    ownerUserId: 'u12',
    googleMapsQuery: 'Jr. Leonisa Lescano 635 Huaraz',
  },
  {
    id: 'chilli-heaven',
    name: 'Chilli Heaven',
    category: BusinessCategory.RESTAURANT,
    description: 'Lo mejor de la comida de la India, Tailandia y México en el corazón de Huaraz. Sabores auténticos, especias seleccionadas y una experiencia gastronómica internacional única que solo podrás encontrar en Chilli Heaven.',
    address: 'Parque Ginebra, Huaraz, Perú',
    lat: -9.5920, lng: -77.4935,
    phone: '+51 923665019', 
    whatsapp: '51923665019',
    photos: [
      'https://i.imgur.com/6410rSL.jpeg',
      'https://i.imgur.com/t97TtnM.jpeg',
      'https://i.imgur.com/1FRetTe.jpeg',
      'https://i.imgur.com/ZygAfZP.jpeg',
      'https://i.imgur.com/IgZtXrW.jpeg',
      'https://i.imgur.com/HCa8JV5.jpeg',
      'https://i.imgur.com/i4V9THE.jpeg',
      'https://i.imgur.com/KLegv01.jpeg',
      'https://i.imgur.com/X7D3n07.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/ZygAfZP.jpeg',
      'https://i.imgur.com/IgZtXrW.jpeg',
      'https://i.imgur.com/ZJbEYMq.jpeg',
      'https://i.imgur.com/HCa8JV5.jpeg',
      'https://i.imgur.com/yyT3O8l.jpeg',
      'https://i.imgur.com/KLegv01.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '5:00 PM - 10:30 PM', // Nota: Ajusté a PM, asumiendo que es cena.
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-chilli-heaven',
    status: 'approved', 
    ownerUserId: 'u13',
    googleMapsQuery: 'Chilli Heaven Parque Ginebra Huaraz',
  },
  {
    id: 'tortas-camucha',
    name: 'Tortas Camucha',
    category: BusinessCategory.BAKERY,
    description: 'Tortas Camucha es el legado vivo de una pasión que comenzó en 1971. Fundada por la matriarca Camucha, esta pastelería artesanal ha transformado recetas familiares en piezas maestras de sabor durante más de 50 años. Hoy, combinamos nuestra rica herencia con una visión moderna, manteniendo el compromiso de ofrecer productos frescos, elegantes y con el toque casero inconfundible que nos convirtió en un referente de la tradición huaracina.',
    address: 'Jr. Gabino Uribe 638 - Belén | Jr. Huaylas esq. con Jr. Tereza Gonzales de Fanning 516',
    lat: -9.5720, lng: -77.4955,
    phone: '+51 943 691 598 / +51 968 945 835',
    whatsapp: '51968945835',
    photos: [
      'https://i.imgur.com/D9rhQKy.jpeg',
      'https://i.imgur.com/ov9gmzB.jpeg',
      'https://i.imgur.com/YrO3IgD.jpeg',
       'https://i.imgur.com/FnmlXMh.jpeg',
      'https://i.imgur.com/1D6QHY6.jpeg',
      'https://i.imgur.com/xe828vR.jpeg',
      'https://i.imgur.com/tM3ffd8.jpeg',
      'https://i.imgur.com/doUzLtN.jpeg',
      'https://i.imgur.com/i2enMGM.jpeg',
      'https://i.imgur.com/1RRmIAn.jpeg',
      'https://i.imgur.com/dPB0StD.jpeg',
      'https://i.imgur.com/eE9O2bd.jpeg',
      'https://i.imgur.com/NxAQy5J.jpeg',
      'https://i.imgur.com/rag57mn.jpeg',
      'https://i.imgur.com/lyuW64C.jpeg',
      'https://i.imgur.com/3FtNt83.jpeg',
      'https://i.imgur.com/az8Mvrk.jpeg',
      'https://i.imgur.com/EFl0gVs.jpeg',
      'https://i.imgur.com/BrUOZ2s.jpeg',
      'https://i.imgur.com/GbYplAL.jpeg',
      'https://i.imgur.com/xnPH1Ob.jpeg',
      'https://i.imgur.com/oQEZ2oz.jpeg',
      'https://i.imgur.com/niPTFGb.jpeg',
      'https://i.imgur.com/gkPWa4F.jpeg',
      'https://i.imgur.com/DxPLBGx.jpeg',
      'https://i.imgur.com/zKzZsnx.jpeg',
      'https://i.imgur.com/dqtTNR2.jpeg',
      'https://i.imgur.com/BrUOZ2s.jpeg',
      'https://i.imgur.com/5Ojxt7Y.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/nq1OCfk.jpeg',
      'https://i.imgur.com/UwqggPI.jpeg',
      'https://i.imgur.com/oUYyfiE.jpeg',
      'https://i.imgur.com/UGyZeL7.jpeg',
      'https://i.imgur.com/pGguPzj.jpeg',
      'https://i.imgur.com/kmqTAcb.jpeg',
    ],
    schedule: { 
      'Lunes - Sábado': '8:00 AM - 2:00 PM y 3:00 PM - 8:45 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-tortas-camucha',
    status: 'approved', 
    ownerUserId: 'u14',
    googleMapsQuery: 'Tortas Camucha Jr Gabino Uribe 638 Huaraz',
  },
  {
    id: 'qorianka-chocolateria', // ID optimizado para una URL profesional
    name: 'Qorianka - Chocolatería',
    category: 'chocolateria' as BusinessCategory, // ⚠️ Asegúrate de tener SHOP, CAFE o RESTAURANT en tu archivo types.ts
    description: 'Descubre la magia del auténtico cacao peruano en Qorianka. Te ofrecemos los más exquisitos chocolates artesanales, bombones, chocotejas y postres elaborados con insumos de primera calidad. Ya sea para recargar energías tras una ruta por la Cordillera Blanca, disfrutar de una bebida caliente o llevar el mejor recuerdo de Huaraz, cada bocado es una experiencia de altura.',
    address: 'Jr. Damaso Antunez 726 - Belén, Huaraz',
    lat: -9.5720, lng: -77.4954,
    phone: '+51 997 023 217', 
    whatsapp: '51997023217',
    photos: [
      'https://i.imgur.com/1pUiYY9.jpeg',
       'https://i.imgur.com/qWamu9d.jpeg',
       'https://i.imgur.com/9KBlyuH.jpeg',
       'https://i.imgur.com/voxuxnE.jpeg',
       'https://i.imgur.com/ZYnPe8v.jpeg',
       'https://i.imgur.com/T834wXj.jpeg',
       'https://i.imgur.com/7SkQ4K0.jpeg',
      'https://i.imgur.com/LSUqLd0.jpeg',
      'https://i.imgur.com/FlCwQLH.jpeg',
      'https://i.imgur.com/gGWIygP.jpeg',
      'https://i.imgur.com/gTIOvzr.jpeg',
      'https://i.imgur.com/E4Ko3qe.jpeg',
      'https://i.imgur.com/osq5QaU.jpeg',
      'https://i.imgur.com/rvvqBdo.jpeg',
      'https://i.imgur.com/FnXosrZ.jpeg',
      'https://i.imgur.com/1tNVhg2.jpeg',
      'https://i.imgur.com/EVJD215.jpeg',
      'https://i.imgur.com/x5CEghT.jpeg'
    ],
    menuImages: [ // Se mantiene como menuImages para que tu web no colapse
      'https://i.imgur.com/qwAUdVM.jpeg',
      'https://i.imgur.com/V4nm99h.jpeg',
      'https://i.imgur.com/aA1PUcL.jpeg',
      'https://i.imgur.com/FlCwQLH.jpeg',
      'https://i.imgur.com/7Z6REY9.jpeg',
      'https://i.imgur.com/gGWIygP.jpeg',
      'https://i.imgur.com/gTIOvzr.jpeg',
      'https://i.imgur.com/E4Ko3qe.jpeg',
      'https://i.imgur.com/Nxzyqdy.jpeg',
      'https://i.imgur.com/osq5QaU.jpeg',
      'https://i.imgur.com/JkANycf.jpeg'
    ],
    schedule: { 
      'Lunes - Domingo': '8:00 AM - 8:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-qorianka',
    status: 'approved', 
    ownerUserId: 'u15',
    googleMapsQuery: 'Jr. Damaso Antunez 726 Huaraz',
  },
  {
    id: '17', // 
    name: 'Fusión Delicius',
    category: BusinessCategory.RESTAURANT,
    description: 'Fusión Delicius es una destacada opción gastronómica en el corazón de Huaraz, reconocida por su excelente combinación de comida criolla, pastas, hamburguesas y parrillas de primera. Nos diferenciamos por ofrecer una propuesta diseñada para todos los gustos, con una atención cercana, amable y una cuidadosa selección de insumos frescos. Aquí no se sirven platos por cantidad, sino experiencias construidas con dedicación, sazón y total respeto por quienes nos visitan.',
    address: 'Jr. 28 de Julio N° 487 (Frente a Dollarcity), Huaraz',
    lat: -9.5040, 
    lng: -77.1955,
    phone: '+51 932 287 593', 
    whatsapp: '51932287593',
    photos: [
      'https://i.imgur.com/M11AyDV.jpeg',
      'https://i.imgur.com/g1hZAD2.jpeg',
      'https://i.imgur.com/oyOWKx2.jpeg',
      'https://i.imgur.com/ckzLXCA.jpeg',
      'https://i.imgur.com/DfqqECL.jpeg',
      'https://i.imgur.com/8jCSU0m.jpeg',
      'https://i.imgur.com/L6ItpjF.jpeg',
      'https://i.imgur.com/xFrYwDJ.jpeg',
      'https://i.imgur.com/OLDT4Ou.jpeg',
      'https://i.imgur.com/KZbfqLJ.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/pevfPOE.jpeg',
      'https://i.imgur.com/oVhHHhf.jpeg',
      'https://i.imgur.com/QkorRhD.jpeg',
      'https://i.imgur.com/fjiaNEO.jpeg',
      'https://i.imgur.com/sVXKINv.jpeg', // Se removió el duplicado de esta línea
      'https://i.imgur.com/nvZJKVD.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '10:00 AM - 11:00 PM',
      'Domingo': '4:00 PM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-fusion-delicius',
    status: 'approved', 
    ownerUserId: 'u17',
    googleMapsQuery: 'Jr 28 de Julio 487 Huaraz',
  },
  {
    id: '18',
    name: 'Taramo - Grill & Bar',
    category: BusinessCategory.RESTAURANT,
    description: 'Descubre el auténtico sabor de las brasas en Taramo - Grill & Bar. Somos especialistas en parrillas, ofreciendo cortes de carne seleccionados y cocinados a la perfección para resaltar su máxima jugosidad. Acompaña tu cena con nuestra excelente selección de bebidas y piqueos en un ambiente moderno, cálido y perfecto para compartir momentos inolvidables con amigos o familia.',
    address: 'Jr. Daniel Villazan N· 162',
    lat: -9.5020, 
    lng: -77.4985,
    phone: '+51 910562501', 
    whatsapp: '51910562501',
    photos: [
      'https://i.imgur.com/JpMYPI4.jpeg',
      'https://i.imgur.com/4xeEhwm.jpeg',
      'https://i.imgur.com/JjCUUOW.jpeg',
      'https://i.imgur.com/LE0pARp.jpeg',
      'https://i.imgur.com/x6Hr0WV.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/VamtQix.jpeg',
      'https://i.imgur.com/iJaJxB3.jpeg'
    ],
    schedule: { 
      'Lunes - Sábado': '6:00 PM - 11:00 PM',
      'Domingo': '6:00 AM - 11:00 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-17',
    status: 'approved', 
    ownerUserId: 'u18',
    googleMapsQuery: 'Jr. Daniel Villazan 162 Huaraz',
  },
  {
    id: '19',
    name: 'Catamares - Cevicheria & Restaurante',
    category: BusinessCategory.RESTAURANT, 
    description: `Somos una cevichería especializada en pescados y mariscos frescos, preparada con ingredientes de la más alta calidad y el auténtico sabor Chimbotano. 
Nuestro compromiso es brindar una experiencia única, combinando frescura, sabor y excelente atención en un ambiente acogedor. Lo que nos diferencia es nuestro compromiso con la frescura, la calidad y el sabor auténtico. Seleccionamos cuidadosamente nuestros pescados y mariscos para garantizar platos preparados al momento, conservando todo su sabor natural.

✅ Pescados y mariscos frescos todos los días.
✅ Preparación al momento.
✅ Porciones generosas.
✅ Sazón peruana auténtica.
✅ Atención rápida y personalizada.
✅ Excelente relación calidad-precio.
✅ Ambiente acogedor para familias y amigos.`,
    address: 'AV. Agustín Gamarra N.º 625 ref: media cuadra de la alameda Grau ',
    lat: -9.1020,
    lng: -77.4055,
    phone: '+51 998 127 329', 
    whatsapp: '51998127329',
    photos: [
      'https://i.imgur.com/2kNzfRP.jpeg',
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
      'https://i.imgur.com/vgxt5zL.jpeg',
      'https://i.imgur.com/y0OIWHy.jpeg',
      'https://i.imgur.com/cn2US1E.jpeg',
      'https://i.imgur.com/aR6Ajhl.jpeg',
      'https://i.imgur.com/nbDtNBT.jpeg',
      'https://i.imgur.com/45U25AE.jpeg',
      'https://i.imgur.com/Uuc6foX.jpeg'
    ],
    schedule: { 
      'Martes - Sábado': '10:00 AM - 5:30 PM',
      'Domingo': '10:00 AM - 5:30 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-1',
    status: 'approved', 
    ownerUserId: 'u19',
    googleMapsQuery: 'AV. Agustín Gamarra N.º 625 ref: media cuadra de la alameda Grau '
  },
  {
    id: '20',
    name: 'La ruta del taco',
    category: BusinessCategory.RESTAURANT,
    description: `Nuestros tacos mexicanos están preparados con tortillas suaves y calientes, rellenas con ingredientes seleccionados y sazonados al auténtico estilo mexicano. 
Cada taco combina sabores intensos, carnes jugosas, vegetales frescos y salsas especiales que transportan a las calles de México en cada bocado. 
Desde opciones clásicas hasta creaciones únicas de la casa, ofrecemos una experiencia llena de tradición, sabor y calidad para los verdaderos amantes de la comida mexicana.

En qué nos diferenciamos: 
Nos diferenciamos de las demás taquerías por ofrecer una combinación única de autenticidad, calidad y creatividad. Utilizamos ingredientes frescos, tortillas seleccionadas y recetas con el verdadero sabor mexicano, cuidando cada detalle desde la preparación hasta la presentación. Nuestras porciones son generosas, nuestras salsas tienen personalidad propia y cada taco está pensado para brindar una experiencia llena de sabor. Además, mantenemos una atención cercana y un ambiente acogedor que hace que nuestros clientes siempre quieran volver.

🌮 Ingredientes frescos y de calidad.
🔥 Preparación al momento.
🌶️ Salsas artesanales exclusivas de la casa.
🥩 Porciones abundantes y bien servidas.
🇲🇽 Sabor auténtico inspirado en México.
⭐ Atención rápida y personalizada.
💯 Excelente relación calidad-precio.`,
    address: 'AV. Agustín Gamarra N.º 625 ref: media cuadra de la alameda Grau ',
    lat: -9.60078,
    lng: -77.4945,
    phone: '+51 998 127 329', 
    whatsapp: '51998127329',
    photos: [
      'https://i.imgur.com/LaMi8MY.jpeg',
      'https://i.imgur.com/zpgrBnO.jpeg',
      'https://i.imgur.com/jvH3qwz.jpeg',
      'https://i.imgur.com/CcO17cd.jpeg',
       'https://i.imgur.com/tqFep2S.jpeg',
      'https://i.imgur.com/OpEENZs.jpeg',
      'https://i.imgur.com/M2aABe1.jpeg',
      'https://i.imgur.com/3WsCu7R.jpeg',
       'https://i.imgur.com/QrTmY92.jpeg',
      'https://i.imgur.com/48RAsbU.jpeg',
      'https://i.imgur.com/nlSxCOt.jpeg',
      'https://i.imgur.com/PXtsPnT.jpeg',
       'https://i.imgur.com/gWSgjr0.jpeg'
  
    ],
    menuImages: [
      'https://i.imgur.com/6vM4z72.jpeg',
      'https://i.imgur.com/At6o4E0.jpeg'
    ],
    schedule: { 
      'Martes - Sábado': '5:00 PM - 12:00 AM',
      'Domingo': '5:00 PM - 12:00 AM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=huaraz-20',
    status: 'approved', 
    ownerUserId: 'u20',
    googleMapsQuery: 'AV. Agustín Gamarra N.º 625 ref: media cuadra de la alameda Grau'
  },
  {
    id: '21',
    name: 'Las Agüero',
    category: BusinessCategory.RESTAURANT,
    description: 'Las Agüero | comer bien, vivir mejor. ¡Bienvenidos a nuestro mundo de postres saludables y comida sana! Vive el bienestar en cada bocado y aroma.',
    address: 'Jirón Garino Uribe, Huaraz, Perú',
    lat: -9.5050,
    lng: -77.4255,
    phone: '+51 983 182 747',
    whatsapp: '51983 182 747',
    photos: [
      'https://i.imgur.com/n9lBIzu.jpeg',
      'https://i.imgur.com/ItVUAHf.jpeg'
    ],
    menuImages: [
      'https://i.imgur.com/ETUxhc9.jpeg',
      'https://i.imgur.com/ItVUAHf.jpeg',
      'https://i.imgur.com/6k7gjHA.jpeg'
    ],
    schedule: {
      'Lunes - Viernes': '8:00 AM - 8:00 PM',
      'Sabado': '8:30 AM - 9:00 PM',
     'Domingo': ' 9:00 AM - 9:30 PM'
    },
    adLevel: AdLevel.PREMIUM,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=las-aguero',
    status: 'approved',
    ownerUserId: 'u21',
    googleMapsQuery: 'Jirón Garino Uribe, Huaraz, Perú'
  },
];
