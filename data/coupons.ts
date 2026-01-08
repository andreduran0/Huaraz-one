import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    id: 'c1',
    businessId: '1', // Cumbre
    title: 'Pisco Sour de Bienvenida',
    description: 'Disfruta de un Pisco Sour de cortesía por persona al consumir platos de fondo en nuestro restaurante con la mejor vista de Huaraz.',
    code: 'CUMBREVISTA',
    expiryDate: '2026-12-31',
  },
  {
    id: 'c2',
    businessId: '4', // Andino Club Hotel
    title: 'Desayuno Buffet Gratis',
    description: 'Muestra este cupón al realizar tu reserva directa y obtén desayuno buffet incluido para dos personas.',
    code: 'ANDINOBFAST',
    expiryDate: '2025-12-31',
  },
  {
    id: 'c3',
    businessId: '9', // Lava Veloz (Asumiendo que existe en el directorio o premium)
    title: '10% de Descuento en Lavado',
    description: 'Obtén un 10% de descuento en tu servicio de lavado al mostrar este cupón. Válido para pagos en efectivo.',
    code: 'LAVADO10',
    expiryDate: '2024-12-31',
  },
   {
    id: 'c4',
    businessId: '10', // Hostal Churup (Asumiendo ID correcto)
    title: 'Welcome Drink Gratis',
    description: 'Recibe una bebida de bienvenida al realizar tu check-in en nuestro hostal.',
    code: 'CHURUPDRINK',
    expiryDate: '2025-10-31',
  },
];