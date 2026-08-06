import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'chilli-heaven',
    businessId: 'chilli-heaven', // ⚠️ IMPORTANTE: Reemplaza esto con el ID real de Chilli Heaven
    title: 'Combo Especial: Burrito + Bebida 1/2 Litro',
    description: '¡Calma tu hambre con el mejor sabor! Elige tu burrito favorito (Vegetarian with Tofu, Chicken o Beef) acompañado de un refrescante vaso de 1/2 litro (limonada o maracuyá) por solo S/ 28. Válido presentando este cupón digital.',
    code: 'CHILLIBURRITO28',
    expiryDate: '2026-08-31', 
  },
  {
    id: 'chilli-heaven',
    businessId: 'chilli-heaven', // ⚠️ IMPORTANTE: Reemplaza esto con el ID real de Chilli Heaven
    title: '15% de Descuento en Thai & Indian Curries',
    description: 'Viaja por los sabores de Asia sin salir de Huaraz. Obtén un 15% de descuento exclusivo en nuestra selección de auténticos Thai Curries e Indian Curries. ¡Una explosión de especias que no te puedes perder!',
    code: 'CURRY15OFF',
    expiryDate: '2026-08-31', 
  },
  {
    id: 'c25-1',
    businessId: '25', // Pizzería Mi Chef Monchi
    title: 'Cortesía VIP: Elige tu acompañamiento ideal',
    description: '¡Mejora tu experiencia en Pizzería Mi Chef Monchi! Por ser usuario de Huaraz Explorer, recibe una cortesía especial a tu elección con tu consumo: un delicioso postre crepé de frutas, una porción de pan al ajo artesanal o una bebida refrescante. Válido presentando este cupón digital.',
    code: 'MONCHIVIP',
    expiryDate: '2026-08-31', // Puedes ajustar esta fecha de vencimiento según coordines con Monchi
  },
  {
    id: 'c4',
    businessId: 'el-tio-enrique',
    title: 'Combo Suizo-Alemán: Salchicha Especial + Cerveza (500ml) a S/ 35',
    description: '¡El verdadero sabor europeo te espera en El Tío Enrique! Elige uno de nuestros 4 deliciosos hot dogs especiales: Finas Hierbas, Ternera (Bratwurst), Suiza (Cervelat) o Artesanal (Hauswurst), y acompáñalo con medio litro de auténtica cerveza alemana. Todo por solo S/ 35. Válido presentando este cupón digital.',
    code: 'TIOENRIQUE35',
    expiryDate: '2026-08-31', // Puedes ajustar esta fecha según lo que coordines con el negocio
  },
  {
    id: 'c-malibu-2',
    businessId: '26', 
    title: 'Happy Hour: Calientitos Frutados 2x20',
    description: '¡La opción perfecta para abrigarte en las tardes huaracinas! Disfruta de 2 deliciosos calientitos frutados por solo S/ 20.00. Promoción válida todos los días en el horario de 4:00 p. m. a 8:00 p. m. durante todo agosto.',
    code: 'MALIBUCALIENTITO',
    expiryDate: '2026-08-31', 
  },
  {
    id: 'c-malibu-3',
    businessId: '26', 
    title: 'Martes y Miércoles: Cerveza Artesanal 2x20',
    description: '¡Tus previos a mitad de semana se viven en Malibú! Todos los martes y miércoles llévate 2 Cervezas Artesanales Emperador por solo S/ 20.00. Presenta este cupón digital al momento de pedir.',
    code: 'MALIBUEMP2X20',
    expiryDate: '2026-08-31', 
  },
  {
    id: 'c-malibu-1',
    businessId: '26', 
    title: 'Cerveza Artesanal Emperador a S/ 10.00',
    description: '¡Refréscate mientras disfrutas del mejor ambiente rockero de Huaraz! Presenta este cupón en Malibú Resto Bar y llévate una Cerveza Artesanal Emperador por solo S/ 10.00. Ideal para acompañar tus noches de buena música.',
    code: 'MALIBUROCK10',
    expiryDate: '2026-08-31', 
  },
  {
    id: 'c24-1',
    businessId: '24', // Hakuna Matata Restobar
    title: 'Promo Final Mundial: Pilsen 630ml a S/ 12',
    description: '¡Vive la Gran Final del Mundial 2026 (España vs Argentina) en pantalla gigante! Disfruta del partido desde la ceremonia de clausura con una cerveza Pilsen Callao (630ml) bien helada por solo S/ 12. Válido este domingo 19 de julio desde las 12:30 PM presentando este cupón digital.',
    code: 'HAKUNAPILSEN',
    expiryDate: '2026-07-19', 
  },
  {
    id: 'c24-2',
    businessId: '24', // Hakuna Matata Restobar
    title: 'Especial Final: Chanchito al Cilindro a S/ 30',
    description: '¡El mejor sabor para acompañar la Gran Final del Mundial 2026! Disfruta del España vs Argentina en pantalla gigante con un riquísimo chanchito al cilindro por solo S/ 30. Te esperamos este domingo 19 de julio desde las 12:30 PM. Válido presentando este cupón digital.',
    code: 'HAKUNACHANCHO',
    expiryDate: '2026-07-19', 
  },
  {
    id: 'c24-3',
    businessId: '24', // Hakuna Matata Restobar
    title: 'Una Noche Mágica: Tributo a Coldplay y Michael Bublé',
    description: '¡Disfruta de una noche inolvidable con la mejor música en vivo! Ven a disfrutar de un espectacular tributo a Coldplay por Marvin Kallet y a Michael Bublé por Nano Schwan. Además, disfruta de un set especial de salsa y juerga para bailar toda la noche. Válido este sábado 25 de julio desde las 8:00 PM presentando este cupón digital para un shot de cortesía.',
    code: 'HAKUNAMAGICA',
    expiryDate: '2026-07-25', 
  },
  {
    id: 'c24-4',
    businessId: '24', // Hakuna Matata Restobar
    title: 'Noche de Pachanga: ¡Celebra Fiestas Patrias!',
    description: '¡Ven a celebrar Fiestas Patrias como se debe! Este martes 28 de julio disfruta de una Noche de Pachanga inolvidable con la banda LUHUANA completa y bandas invitadas. Presenta este cupón digital al ingresar y recibe un shot pisquero de cortesía para brindar por el Perú.',
    code: 'HAKUNAPACHANGA',
    expiryDate: '2026-07-28', 
  },
  {
    id: 'c23',
    businessId: '23', // EITZA - Pasta-Grill
    title: 'Cortesía: Pan al ajo GRATIS',
    description: '¡Disfruta de la mejor experiencia gastronómica! Exclusivo para la comunidad de Huaraz Explorer: presenta este cupón digital al momento de tu visita y recibe una deliciosa porción de pan al ajo totalmente de cortesía.',
    code: 'EITZAEXPLORER',
    expiryDate: '2026-08-31', // Le puse fecha hasta fines de agosto, puedes ajustarla si deseas
  },
  {
    id: '18',
    businessId: '18', // Táramo
    title: 'Los Famosos 10 Soles: 3er plato de Alitas',
    description: '¡Julio se celebra así! Paga 2 platos de alitas y llévate el tercer plato por solo S/ 10. Válido presentando este cupón digital en Táramo Bar x Parrilla.',
    code: 'TARAMOALITASJULIO',
    expiryDate: '2026-07-31',
  },
  {
    id: '18',
    businessId: '18', // Táramo
    title: '¡Salud, Perú!: 3 Calientitos a S/ 28',
    description: '¡Brindemos con Pisco en estas Fiestas Patrias! Disfruta de 3 calientitos por solo S/ 28. Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOCALIENTITOS',
    expiryDate: '2026-07-31',
  },
  {
    id: '18',
    businessId: '18', // Táramo
    title: 'La Tercera es la Vencida: Parrilla a S/ 15',
    description: '¡Viva el Perú! Paga 2 platos de parrilla y llévate el tercer plato por solo S/ 15. Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOPARRILLA',
    expiryDate: '2026-07-31',
  },
  {
    id: 'c18',
    businessId: '18', // Táramo
    title: 'Sabe a Perú: Mixtura a S/ 35',
    description: '¡Orgullosos de ser peruanos! Disfruta de 2 anticuchos de corazón + mollejitas + rachi por solo S/ 35. Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOSABEAPERU',
    expiryDate: '2026-07-31',
  },
  {
    id: 'c19',
    businessId: '20', // La ruta del taco
    title: '¡Plato de tacos GRATIS por 5 shots de tequila!',
    description: '¡Empieza la fiesta al mejor estilo mexicano! Por el consumo de 5 shots de tequila, te regalamos un delicioso plato de tacos. Válido presentando este cupón digital en nuestro local.',
    code: 'RUTATACOTEQUILA',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c18',
    businessId: '19', // Catamares
    title: '10% de Descuento por el Día del Padre',
    description: '¡Celebra a papá con los mejores sabores del mar! Obtén un 10% de descuento en todo tu consumo presentando este cupón digital. El mejor regalo para compartir en familia.',
    code: 'CATAMARESPAPA',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c2',
    businessId: 'nobel-ingenieros', // Colegio Nobel
    title: 'S/ 30 de Descuento en Matrícula o Pensión',
    description: 'Obtén S/ 30 de descuento directo en tu matrícula o en la pensión del mes. Presenta este cupón digital en nuestra secretaría para hacer válido tu beneficio exclusivo de Huaraz Explorer.',
    code: 'NOBEL30',
    expiryDate: '2026-04-30',
  },
  {
    id: 'c3',
    businessId: 'la-carpa-rosa', // La Carpa Rosa
    title: 'Promo Cócteles: 2 x S/ 25',
    description: '¡Refresca tu tarde o noche! Disfruta de nuestra promoción especial de 2 cócteles por solo 25 soles. Válido presentando este cupón digital al momento de hacer tu pedido en el local. ¡Salud!',
    code: 'CARPA2X25',
    expiryDate: '2026-04-30',
  },
  {
    id: 'c4',
    businessId: 'el-tio-enrique', // El Tío Enrique
    title: 'Promo Cerveza Antepasado: 2 x S/ 30',
    description: 'Disfruta de la cultura cervecera con nuestra promoción exclusiva: llévate 2 cervezas Antepasado por solo S/ 30. Válido presentando este cupón digital en El Tío Enrique Restopub.',
    code: 'ANTEPASADO2X30',
    expiryDate: '2026-04-30',
  },
 {
    id: 'c9',
    businessId: 'chifa-gran-muralla-2',
    title: '¡El 6to come GRATIS!',
    description: '¡Disfruta de la mejor comida oriental en grupo! Trae a 5 amigos y tu consumo es totalmente GRATIS. Válido mostrando este cupón digital en el local.',
    code: 'MURALLA6TO',
    expiryDate: '2026-06-30', 
  },
  {
    id: 'c9',
    businessId: 'chifa-gran-muralla-2',
    title: '¡Cumpleañero no paga!',
    description: 'Celebra tu día especial con nosotros. ¡El cumpleañero come GRATIS! Válido el mismo día de tu cumpleaños presentando DNI físico y mostrando este cupón.',
    code: 'MURALLACUMPLE',
    expiryDate: '2026-06-30', 
  },
  {
    id: 'c9',
    businessId: 'chifa-gran-muralla-2',
    title: 'Gaseosa de cortesía con tu Menú',
    description: 'De lunes a viernes, por la compra de cualquier menú, llévate una gaseosa pequeña totalmente de cortesía. Válido mostrando este cupón digital al momento de pedir.',
    code: 'MURALLAMENU',
    expiryDate: '2026-06-30', 
  },
  {
    id: 'c10',
    businessId: '47-ronnin-sushi-bar', // 47 RONNIN
    title: 'Promo Martes: Makis a S/ 25',
    description: '¡Todos los martes son de 47 RONNIN! Disfruta de una selección especial de nuestros mejores makis por solo S/ 25.00. Válido presentando este cupón digital en el local para consumo en salón.',
    code: 'RONNINMARTES25',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c11',
    businessId: '47-ronnin-sushi-bar', // 47 RONNIN
    title: 'Miércoles Nikkei: Maki de 6 piezas GRATIS',
    description: '¡Corta la semana con el mejor sushi! Por la compra de 2 makis (de 12 piezas cada uno), llévate totalmente GRATIS 1 maki adicional de 6 piezas. Válido presentando este cupón digital en el local.',
    code: 'RONNINMIERCOLES',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c13',
    businessId: 'qorianka-chocolateria',
    title: '¡10% de Descuento por el Día de la Madre!',
    description: 'Engríe a mamá en su día con los detalles más dulces. Obtén un 10% de descuento exclusivo en nuestras cajas de chocolates y productos seleccionados por el Día de la Madre. Válido presentando este cupón digital en nuestro local.',
    code: 'MAMAQORIANKA10',
    expiryDate: '2026-05-31', 
  },
  {
    id: 'c12',
    businessId: 'tortas-camucha',
    title: 'Cualquier Combo a S/ 10.00 (Mañana y Noche)',
    description: '¡Disfruta del toque casero de Camucha en cualquier momento del día! Elige cualquiera de nuestros 8 súper combos (Tamal, Empanada, Sándwich de pollo, Papa rellena, Salchicha huachana y más) que incluyen jugo, café o infusión y pan por solo S/ 10.00. Disponibles para empezar tu mañana con energía o para darte tu gustito por las noches. Válido presentando este cupón digital en el local.',
    code: 'CAMUCHA10',
    expiryDate: '2026-06-30', 
  },
  {
    id: 'c14',
    businessId: 'vermiel-emolienteria',
    title: 'Match Fresh: Choco Fruit de Fresa con Roll de Zapallo',
    description: 'Disfruta de nuestra combination preferida: un refrescante Choco Fruit de fresa acompañado de un delicioso roll de zapallo por solo S/ 21.00. (Válido en vaso alto).',
    code: 'VERMIEL21',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c15',
    businessId: 'vermiel-emolienteria',
    title: 'Match Tradición: Emoliente con Empanada Anticuchera',
    description: 'La combinación clásica de la casa: nuestro emoliente tradicional acompañado de una empanada anticuchera por solo S/ 16.50. (Válido en vaso alto).',
    code: 'VERMIEL165',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c16',
    businessId: 'vermiel-emolienteria',
    title: 'Duo Morning: Frutado con Croissant de Jamón y Queso',
    description: 'Ideal para empezar el día: elige un frutado de maracuyá o fresa con un crujiente croissant de jamón y queso por solo S/ 17.00.',
    code: 'VERMIEL17',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c17',
    businessId: 'vermiel-emolienteria',
    title: 'Duo Delizia: Frutado con Croissant de Pollo',
    description: 'Un dúo irresistible: elige un frutado de maracuyá o fresa acompañado de un croissant de pollo por solo S/ 15.00.',
    code: 'VERMIEL15',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c1',
    businessId: '1', // Cumbre - Mirador Rataquenua
    title: '10% de Descuento en toda la carta',
    description: 'Obtén un descuento especial del 10% en todos nuestros platos de la carta. Disfruta de la mejor vista de Huaraz con este beneficio exclusivo.',
    code: 'CUMBRE10',
    expiryDate: '2026-06-30', 
  },
  {
    id: 'c17',
    businessId: '17', 
    title: 'Temporada de Caldo de Gallina de Corral',
    description: 'Disfruta de nuestro delicioso Caldo de Gallina de Corral, servido con el sabor auténtico y tradicional. ¡Pruébalo a solo S/ 18!',
    code: 'FUSIONCALDO',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c17',
    businessId: '17',
    title: 'Lunes de Cilindro: Chancho y Pollo',
    description: '¡Todos los lunes son de cilindro en Fusion Delicious! Ven y disfruta de nuestras carnes recién salidas del cilindro, desde S/ 17 soles.',
    code: 'FUSIONCILINDRO',
    expiryDate: '2026-06-30',
  }
];
