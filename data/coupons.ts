
import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'c1',
    businessId: '1', // Cumbre
    title: '10% de Descuento en toda la carta',
    description: 'Obtén un descuento especial del 10% en todos nuestros platos de la carta. Disfruta de la mejor vista de Huaraz con este beneficio exclusivo.',
    code: 'CUMBRE10',
    expiryDate: '2026-03-28',
  },
  {
    id: 'c2',
    businessId: '4', // Andino Club Hotel
    title: 'Desayuno Buffet Gratis',
    description: 'Muestra este cupón al realizar tu reserva directa y obtén desayuno buffet incluido para dos personas en nuestra histórica terraza.',
    code: 'ANDINOBFAST',
    expiryDate: '2026-02-15',
  },
];
