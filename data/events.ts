export interface Event {
  date: string; // Format YYYY-MM-DD
  title: string;
  description: string;
  type: 'religious' | 'cultural' | 'civic' | 'carnival' | 'sports' | 'entertainment';
  time?: string;
  location?: string;
}

export const events: Event[] = [
  // --- CARNAVAL HUARACINO 2026 ---
  {
    date: '2026-01-17',
    title: 'Lanzamiento del Carnaval Huaracino 2026',
    description: 'Presentación oficial del carnaval y de las bellas candidatas que aspiran a la corona de soberana del carnaval.',
    type: 'carnival',
    time: '10:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-01-30',
    title: 'Elección y Coronación de la Reina del Carnaval',
    description: 'Noche de gala, elegancia y simpatía donde se elegirá a la soberana del Carnaval Huaracino 2026.',
    type: 'carnival',
    time: '06:00 p. m.',
    location: 'Coliseo Cerrado de Huaraz'
  },
  {
    date: '2026-02-01',
    title: 'Gran Rompecalle del Carnaval Huaracino',
    description: 'Inicio explosivo de las celebraciones. Comparsas de todos los barrios recorren la ciudad con música y danzas.',
    type: 'carnival',
    time: '09:00 a. m.',
    location: 'Concentración: Plazuela de Belén'
  },
  {
    date: '2026-02-08',
    title: 'Misa de Cruces',
    description: 'Tradicional celebración religiosa de las cruces de los diversos barrios y comunidades de Huaraz.',
    type: 'religious',
    time: '11:00 a. m.',
    location: 'Templos y Parroquias de la ciudad'
  },
  {
    date: '2026-02-14',
    title: 'Entrada Triunfal del Rey Momo',
    description: 'El "Ño Carnavalón" hace su ingreso triunfal a Huaraz, marcando el inicio de la semana central de fiesta.',
    type: 'carnival',
    time: '02:00 p. m.',
    location: 'Principales calles y Plaza de Armas'
  },
  {
    date: '2026-02-15',
    title: 'Corso de Carros Alegóricos',
    description: 'Desfile de la creatividad huaracina. Carros decorados, reinas y delegaciones de instituciones y barrios.',
    type: 'carnival',
    time: '04:00 p. m.',
    location: 'Av. Luzuriaga (Frontis del Hotel Huascarán)'
  },
  {
    date: '2026-02-16',
    title: 'Lunes de Carnaval - Visita de Cruces',
    description: 'Día dedicado a la visita de las cruces en los barrios tradicionales. Música de banda y compartir comunitario.',
    type: 'religious',
    time: 'Todo el día',
    location: 'Barrios: Soledad, Belén, San Francisco, Huarupampa'
  },
  {
    date: '2026-02-17',
    title: 'Martes de Carnaval (Día Central)',
    description: 'Día de juego con agua, talco y serpentinas. Encuentro general de barrios y alegría total en las calles.',
    type: 'carnival',
    time: 'Todo el día',
    location: 'Toda la ciudad de Huaraz'
  },
  {
    date: '2026-02-17',
    title: 'Encuentro de Cruces y Velorio del Rey Momo',
    description: 'Tras el juego, las cruces se concentran y por la noche se inicia el velorio del Rey Momo con testamentos satíricos.',
    type: 'carnival',
    time: '06:00 p. m.',
    location: 'Plaza de Armas y Locales Barriales'
  },
  {
    date: '2026-02-18',
    title: 'Lectura de Testamento y Entierro del Rey Momo',
    description: 'Cierre del carnaval. Lectura del testamento jocoso del Rey Momo y su entierro simbólico en el río Quillcay.',
    type: 'carnival',
    time: '02:00 p. m.',
    location: 'Río Quillcay (Puente Comercio)'
  },

  // --- SEMANA SANTA ---
  {
    date: '2026-03-29',
    title: 'Domingo de Ramos',
    description: 'Inicio de la Semana Santa Huaracina con la bendición de palmas y procesión.',
    type: 'religious',
  },
  {
    date: '2026-04-03',
    title: 'Viernes Santo',
    description: 'Solemne procesión del Cristo Yacente y la Virgen Dolorosa.',
    type: 'religious',
  },

  // --- FESTIVIDAD SEÑOR DE LA SOLEDAD (MAYO 2026) ---
  {
    date: '2026-05-01',
    title: 'Inicio de Recorridos Procesionales',
    description: 'Primer día de recorridos procesionales en honor al Señor de la Soledad, Patrón de Huaraz.',
    type: 'religious',
    location: 'Santuario de la Soledad / Calles de Huaraz'
  },
  {
    date: '2026-05-02',
    title: 'Recorridos Procesionales',
    description: 'Continuación de los recorridos procesionales de la sagrada imagen por la ciudad.',
    type: 'religious',
    location: 'Calles de Huaraz'
  },
  {
    date: '2026-05-03',
    title: 'Día Central - Señor de la Soledad',
    description: 'Día principal de la festividad con solemne Misa central y la procesión principal.',
    type: 'religious',
    location: 'Santuario de la Soledad'
  },
  {
    date: '2026-05-08',
    title: 'Ingreso de Danzantes y Misa',
    description: 'Tradicional ingreso de las agrupaciones de danzantes rindiendo homenaje, seguido de la misa.',
    type: 'cultural',
    location: 'Santuario de la Soledad'
  },
  {
    date: '2026-05-09',
    title: 'Víspera de Octava',
    description: 'Celebración eucarística de víspera en honor al patrón de la ciudad.',
    type: 'religious',
    location: 'Santuario de la Soledad'
  },
  {
    date: '2026-05-10',
    title: 'Octava del Señor de la Soledad',
    description: 'Tradicional Misa de Octava y procesión de la imagen por las principales calles de Huaraz.',
    type: 'religious',
    location: 'Calles de Huaraz'
  },
  {
    date: '2026-05-11',
    title: 'Celebración Eucarística',
    description: 'Continuación de los actos litúrgicos de la festividad.',
    type: 'religious',
    location: 'Santuario de la Soledad'
  },
  {
    date: '2026-05-12',
    title: 'Colocación y Despedida',
    description: 'Misa y procesión final de despedida que marca el cierre de las festividades del Señor de la Soledad.',
    type: 'religious',
    location: 'Santuario de la Soledad'
  },

  // --- OTRAS FESTIVIDADES ---
  {
    date: '2026-07-25',
    title: 'Aniversario de Huaraz',
    description: 'Celebración por la creación política de la provincia con desfiles y serenata.',
    type: 'civic',
  },

  // --- EVENTOS DEPORTIVOS Y ENTRETENIMIENTO (JUNIO 2026) ---
  {
    date: '2026-06-13',
    title: 'VIBRANDES 2026 - Trail Running',
    description: 'Inicio oficial de la temporada de deportes de montaña en Huaraz. Únete a la competencia de trail running con recorridos de 6k, 12k y 21k.',
    type: 'sports',
    time: '06:00 a. m.',
    location: 'Centro de Convenciones El Bosque'
  },
  {
    date: '2026-06-13',
    title: 'Rock en Vivo: Banda Dosis',
    description: 'Cierre épico del sábado con la banda Dosis tocando en vivo. Disfruta del mejor rock local acompañado de las pizzas del Chef Monchi.',
    type: 'entertainment',
    time: '08:00 p. m.',
    location: 'Mallibu Resto Bar'
  },
    // --- EVENTOS PARA HOY Y MAÑANA (JUNIO 2026) ---
  {
    date: '2026-06-20',
    title: 'Chela Fest - 2da Edición',
    description: 'Festival con más de 9 cervezas invitadas, 7 bandas en vivo incluyendo a Órbita, Alba, Los Renegados, Reina Bastarda, Revolt, Coky Kaya y Dosis. Incluye juegos, actividades y parrilla.',
    type: 'entertainment',
    time: 'Desde el mediodía',
    location: 'Táramo Grill & Bar'
  },
  {
    date: '2026-06-20',
    title: '3 Aniversario Vermiel',
    description: 'Celebración por el tercer aniversario con la presentación en vivo de Nicole Villanueva y Chesberry (banda completa).',
    type: 'entertainment',
    time: '09:00 p. m.',
    location: 'Jr. Julián de Morales #632, frente al parque del Periodista'
  },
  {
    date: '2026-06-21',
    title: 'Día del Padre en Catamares',
    description: '¡Celebra a papá con los mejores sabores del mar! Disfruta de una experiencia única con deliciosos platos marinos, el auténtico sabor chimbotano, promociones especiales y un ambiente espectacular para compartir en familia.',
    type: 'entertainment',
    time: '10:00 a. m. - 05:30 p. m.',
    location: 'Catamares - Mirador de Rataquenua, Huaraz'
  },
  {
    date: '2026-06-27',
    title: 'Degustación Gratuita de Café Filtrado',
    description: 'Descubre nuevos aromas y sabores en una experiencia única. Ven y disfruta de nuestra degustación gratuita de café de especialidad preparado en filtrado.',
    type: 'entertainment',
    time: '10:00 a. m. - 05:00 p. m.',
    location: 'Muruwa Café, Huaraz'
  },
  {
    date: '2026-06-27',
    title: 'Festival Un Viaje a los Andes',
    description: 'Gran festival por feriado largo con 2 escenarios en vivo. Presentación estelar de A.CHAL, Laguna Pai, Skillbea, Hit La Rosa, Cementerio Club, Cuarteto Intercontinental, Los Ficus y Turmanye. Invitado especial: DJ HJ. Entradas a la venta en Teleticket.',
    type: 'entertainment',
    time: '10:00 a. m.',
    location: 'Parque Perú- Huaraz'
  },
  // --- EVENTOS JULIO 2026 ---
  {
    date: '2026-07-02',
    title: 'Ponencia: Glaciares y Deportes',
    description: 'En el marco del Festival de los Glaciares y el Ultra Trail Cordillera Blanca. Ponencia a cargo de Pascal Egli: "Glaciares y deportes: entre riesgos y sostenibilidad". Un espacio para despertar, reflexionar y actuar sobre el impacto del deporte en nuestros glaciares. Ingreso libre.',
    type: 'cultural',
    time: '03:00 p. m. - 06:00 p. m.',
    location: 'CCA Sala Alpamayo - Huaraz'
  },
  {
    date: '2026-07-02',
    title: 'Inka Frut Presenta: Coky Kaya',
    description: '¡Mucho más que música! Celebra el Día Internacional del Reggae con la presentación en vivo de Coky Kaya. Una noche para disfrutar de las raíces, historia y buenas vibras de este género musical.',
    type: 'entertainment',
    time: '07:00 p. m.',
    location: 'Inka Frut (Parque Ginebra - Huaraz)'
  },
  // --- ANIVERSARIO DE HUARAZ (JULIO 2026) ---
  {
    date: '2026-07-09',
    title: 'Feria de la Mujer Emprendedora Ancashina',
    description: 'Espacio dedicado a promover los emprendimientos locales liderados por mujeres ancashinas. Disponible hasta el 10 de julio.',
    type: 'cultural',
    time: '12:00 m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-11',
    title: 'Juego de Patos Patrios',
    description: 'Tradicional actividad recreativa en el marco de las celebraciones por el aniversario de la provincia.',
    type: 'entertainment',
    time: '09:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-11',
    title: 'Concurso de Desfile Escolar',
    description: 'Participación de instituciones educativas de nivel inicial, primario y secundario. Continúa el 12 de julio.',
    type: 'civic',
    time: '08:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-14',
    title: 'Festival Artístico y Aniversario del Centro Cultural',
    description: 'Celebración artística doble por el 169° aniversario de creación política de la provincia y el XIV aniversario del Centro Cultural de Huaraz.',
    type: 'entertainment',
    time: '04:00 p. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-14',
    title: 'Campaña de Esterilización de Mascotas',
    description: 'Jornada de salud animal para perros y gatos. Continúa el 15 de julio.',
    type: 'civic',
    time: '09:00 a. m.',
    location: 'Clínica Veterinaria'
  },
  {
    date: '2026-07-18',
    title: 'Matrimonio Civil Comunitario',
    description: 'Ceremonia especial "Uniendo vidas, fortaleciendo hogares" para formalizar uniones en la comunidad.',
    type: 'civic',
    time: '10:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-19',
    title: 'Maratón 10k: Unidos todos somos Huaraz',
    description: 'Competencia deportiva que recorrerá las calles de la ciudad fomentando el deporte y la unidad.',
    type: 'sports',
    time: '09:00 a. m.',
    location: 'Puente Mullaca - Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-20',
    title: 'Pasacalle de Identidad Huaracina',
    description: 'Colorido recorrido organizado por la MPHZ para celebrar y mostrar las costumbres y danzas tradicionales.',
    type: 'cultural',
    time: '02:00 p. m.',
    location: 'Concentración: Central UNASAM / Llegada: Plazuela de Belén'
  },
  {
    date: '2026-07-21',
    title: 'Festival Gastronómico: Sabores del Ande',
    description: 'Exhibición y venta de los mejores platos típicos de la región. Disponible hasta el 22 de julio.',
    type: 'cultural',
    time: '09:00 a. m.',
    location: 'Parque de la Amistad Internacional'
  },
  {
    date: '2026-07-23',
    title: 'Festival de Talentos',
    description: 'Presentación artística de representantes de los diferentes centros poblados y distritos de la provincia.',
    type: 'entertainment',
    time: '04:00 p. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-24',
    title: 'Serenata a la Provincia de Huaraz',
    description: 'Gran celebración de víspera con espectáculo en el cielo y la presentación de bandas de músicos.',
    type: 'entertainment',
    time: '07:00 p. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-25',
    title: 'Día Central: Actos Protocolares y Desfile',
    description: 'Misa Te Deum (Sagrario San Sebastián), Izamiento del Pabellón Nacional, Sesión Solemne y el gran desfile cívico institucional por el 169° aniversario.',
    type: 'civic',
    time: '08:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-25',
    title: 'Festival por el Día del Rock Huaracino',
    description: 'Cierre del día central con lo mejor de la escena rockera local en vivo.',
    type: 'entertainment',
    time: '02:00 p. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-26',
    title: 'Feria Macroregional',
    description: 'Importante encuentro comercial y cultural que reúne a productores y artesanos. Se extenderá hasta el 04 de agosto.',
    type: 'cultural',
    time: '09:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-07-26',
    title: 'Serenata Peruana',
    description: 'Noche de música tradicional para continuar celebrando el mes patrio y el aniversario local.',
    type: 'entertainment',
    time: '07:00 p. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  // --- EVENTOS HAKUNA MATATA (JULIO 2026) ---
  {
    date: '2026-07-19',
    title: 'Gran Final Mundial 2026 en Pantalla Gigante',
    description: 'Vive la transmisión en vivo de la final del Mundial (España vs Argentina) desde la ceremonia de clausura. Disfruta del partido en pantalla gigante con chanchito al cilindro y promociones en cervezas.',
    type: 'sports',
    time: '12:30 p. m.',
    location: 'Hakuna Matata Restobar (Psje. Jesús Morales 977)'
  },
  {
    date: '2026-07-25',
    title: 'Una Noche Mágica: Tributo a Coldplay y Michael Bublé',
    description: 'Espectacular noche de música en vivo con tributos a Coldplay (Marvin Kallet) y Michael Bublé (Nano Schwan). Además, un set especial de salsa y juerga para bailar toda la noche.',
    type: 'entertainment',
    time: '08:00 p. m.',
    location: 'Hakuna Matata Restobar (Psje. Jesús Morales 977)'
  },
  {
    date: '2026-07-28',
    title: 'Noche de Pachanga: Fiestas Patrias',
    description: '¡Celebra las Fiestas Patrias como se debe! Gran Noche de Pachanga con la presentación estelar de la banda LUHUANA completa y otras bandas invitadas.',
    type: 'entertainment',
    time: '09:00 p. m.', 
    location: 'Hakuna Matata Restobar (Psje. Jesús Morales 977)'
  },
  // --- EVENTOS JULIO 2026 (CIERRE DE FIESTAS PATRIAS) ---
  {
    date: '2026-07-31',
    title: 'Festival de Parrillas: Malibú x Monchis',
    description: 'Gran cierre de Fiestas Patrias con los mejores cortes (picaña, lomo fino, bife ancho). El Chef Monchi te enseñará los secretos de la parrilla. Disfruta de promociones exclusivas (Parrilla + Cerveza a S/ 25), música con DJ Diego Wolf en vivo y cervezas artesanales Emperador.',
    type: 'entertainment',
    time: 'Desde el mediodía hasta la medianoche',
    location: 'Malibú (Pasaje Wamashraju 144, a espaldas del Parque Ginebra)'
  },
  // --- EVENTOS AGOSTO 2026 ---
  {
    date: '2026-08-22',
    title: 'Rock vs Salsa: Adolescentes de Venezuela',
    description: '¡Increíble duelo musical con más de 6 horas de show! Presentación estelar de los Adolescentes de Venezuela frente a la Banda "Projects", además de bandas invitadas. Preventa de entradas a S/ 50 hasta el 15 de agosto. Reservas al 967 477 268.',
    type: 'entertainment',
    time: '08:00 p. m.',
    location: 'Hakuna Matata Restobar (Psje. Jesús Morales 977, Huaraz)'
  },
  {
    date: '2026-08-08',
    title: 'Noche del Rock de los 2000: Tributo a PXNDX',
    description: '¡Revive los himnos más emblemáticos de los 2000! Gran tributo a PXNDX a cargo del grupo Libélula, con la presentación de la banda invitada Loveless. Disfruta del mejor ambiente rockero de Huaraz con cervezas artesanales Emperador a solo S/ 10.00 y la deliciosa comida a cargo de Pizzería Mi Chef Monchi.',
    type: 'entertainment',
    time: 'Desde las 08:00 p. m.',
    location: 'Malibú Resto Bar (Pasaje Wamashraju 144, a espaldas del Parque Ginebra)'
  },
  {
    date: '2026-08-06',
    title: 'Fin de Semana de Activación con DJ Wolf',
    description: '¡Tu fin de semana empieza aquí! Todos los jueves, viernes y sábados disfruta de las mejores mezclas en vivo y un ambiente increíble a cargo de DJ Wolf. La mejor fiesta, tragos y música te esperan en Malibú.',
    type: 'entertainment',
    time: 'Noches (Jueves, Viernes y Sábados)',
    location: 'Malibú Resto Bar (Pasaje Wamashraju 144, a espaldas del Parque Ginebra)'
  },
  {
    date: '2026-08-15',
    title: 'Rock Tonight: Over-One Rock',
    description: '¡Noche de puro rock en Hakuna Matata! Disfruta de la mejor música en vivo a cargo de la banda Over-One. El ambiente perfecto para tu fin de semana y lo mejor de todo: ¡Entrada Libre!',
    type: 'entertainment',
    time: '08:00 p. m.',
    location: 'Hakuna Matata Restobar (Psje. Jesús Morales 977, Huaraz)'
  }
];
