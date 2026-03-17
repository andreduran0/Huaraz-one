import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'c1',
    businessId: '1', // Cumbre - Mirador Rataquenua
    title: '10% de Descuento en toda la carta',
    description: 'Obtén un descuento especial del 10% en todos nuestros platos de la carta. Disfruta de la mejor vista de Huaraz con este beneficio exclusivo.',
    code: 'CUMBRE10',
    expiryDate: '2026-03-28',
  },
  {
    id: 'c2',
    businessId: 'nobel-ingenieros', // Conectado exactamente con el ID del colegio
    title: 'S/ 30 de Descuento en Matrícula o Pensión',
    description: 'Obtén S/ 30 de descuento directo en tu matrícula o en la pensión del mes. Presenta este cupón digital en nuestra secretaría para hacer válido tu beneficio exclusivo de Huaraz Explorer.',
    code: 'NOBEL30',
    expiryDate: '2026-04-30', // Le puse fecha hasta fines de abril para que tengan tiempo
  },
];
