
import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'c1',
    businessId: '1',
    title: '1/4 de Pollo Gratis',
    description: 'Por la compra de 1 pollo a la brasa, llévate 1/4 de pollo adicional completamente gratis.',
    code: 'FOGON25',
    expiryDate: '2024-12-31',
  },
  {
    id: 'c2',
    businessId: '4',
    title: 'Pisco Sour de Cortesía',
    description: 'Disfruta de un Pisco Sour gratis por cada ceviche de trucha que pidas.',
    code: 'MARPISCO',
    expiryDate: '2024-11-30',
  },
  {
    id: 'c3',
    businessId: '9',
    title: '10% de Descuento en Lavado',
    description: 'Obtén un 10% de descuento en tu servicio de lavado al mostrar este cupón. Válido para pagos en efectivo.',
    code: 'LAVADO10',
    expiryDate: '2024-12-31',
  },
   {
    id: 'c4',
    businessId: '11',
    title: 'Upgrade de Habitación',
    description: 'Reserva una habitación estándar y recibe un upgrade a una con vista a la montaña, sujeto a disponibilidad.',
    code: 'ANDINOVIEW',
    expiryDate: '2024-10-31',
  },
];