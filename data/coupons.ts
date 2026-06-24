import { Coupon } from '../types';

export const coupons: Coupon[] = [
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
    businessId: 'chifa-gran-muralla-2', // Chifa
    title: 'Triple Promo: Cumpleañero Gratis, 6to Gratis y Menú + Gaseosa',
    description: '¡Disfruta de la mejor comida oriental con tres promociones exclusivas! 1) Trae a 5 amigos y tu consumo es GRATIS. 2) ¡El cumpleañero no paga! (presentando DNI). 3) De lunes a viernes, todo menú incluye una gaseosa pequeña de cortesía. Válido mostrando este cupón.',
    code: 'MURALLATRIPLET',
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
    id: '18',
    businessId: '18', // Táramo
    title: 'Triple Junio 1: Alitas para Todos',
    description: '¡Para compartir, disfrutar y repetir! Pagan 2 platos de alitas y el tercer plato te sale a menos del 50% de descuento (a solo S/ 9). Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOALITAS',
    expiryDate: '2026-06-30',
  },
  {
    id: '18',
    businessId: '18', // Táramo
    title: 'Triple Junio 2: Churrísimo a S/ 15',
    description: 'Sabor que se siente como en casa. Disfruta de 250 gr de churrasco + papas fritas a solo S/ 15. Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOCHURRASCO',
    expiryDate: '2026-06-30',
  },
  {
    id: 'c18',
    businessId: '18', // Táramo
    title: 'Triple Junio 3: Combatiendo el Frío',
    description: 'Calor que abraza y sabores que alegran. Llévate 3 calientitos con toque cítrico a solo S/ 25. Válido presentando este cupón digital en Táramo.',
    code: 'TARAMOCALIENTITOS',
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
