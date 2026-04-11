import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'c1',
    businessId: '1', // Cumbre - Mirador Rataquenua
    title: '10% de Descuento en toda la carta',
    description: 'Obtén un descuento especial del 10% en todos nuestros platos de la carta. Disfruta de la mejor vista de Huaraz con este beneficio exclusivo.',
    code: 'CUMBRE10',
    expiryDate: '2026-06-30', // Le puse junio para que no te salga vencido (estamos 9 de abril)
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
    businessId: '10', // El Tío Enrique
    title: 'Promo Cerveza Antepasado: 12 x S/ 30',
    description: 'Disfruta de la cultura cervecera con nuestra promoción exclusiva: llévate 12 cervezas Antepasado por solo S/ 30. Válido presentando este cupón digital en El Tío Enrique Restopub.',
    code: 'ANTEPASADO12X30',
    expiryDate: '2026-04-30',
  },
];
