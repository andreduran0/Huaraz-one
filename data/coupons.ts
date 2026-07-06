import { Coupon } from '../types';

export const coupons: Coupon[] = [
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
