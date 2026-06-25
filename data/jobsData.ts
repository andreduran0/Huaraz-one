export interface JobOffer {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  salary: string;
  whatsappContact: string;
}

export const jobsData: JobOffer[] = [
  {
    id: 'job-1',
    businessId: '21',
    businessName: 'Las Agüero',
    title: 'Ayudante de Repostería (Turno Mañana)',
    description: 'Se requiere ayudante de repostería para cubrir el turno de la mañana. Interesados enviar su CV actualizado al número de WhatsApp.',
    salary: 'A tratar',
    whatsappContact: '51983182747'
  },
  {
    id: 'job-2',
    businessId: 'vermiel-emolientes',
    businessName: 'Vermiel Emolientes',
    title: 'Caja y Atención al Cliente',
    description: 'Buscamos personal para el área de caja y atención al cliente. Buscamos personas proactivas, amables y con vocación de servicio.',
    salary: 'A tratar',
    whatsappContact: '51950641540'
  },
  {
    id: 'job-3',
    businessId: 'vermiel-emolientes',
    businessName: 'Vermiel Emolientes',
    title: 'Producción de Postres',
    description: 'Se busca personal para el área de producción de postres. Es indispensable contar con conocimientos básicos en repostería.',
    salary: 'A tratar',
    whatsappContact: '51976393160'
  }
];
