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
    id: 'job-4',
    businessId: '24',
    businessName: 'Hakuna Matata Restobar',
    title: 'Barman',
    description: 'Buscamos barman con experiencia para unirse a nuestro equipo. Encargado de la preparación de bebidas y atención en barra. Disponibilidad para trabajar en horario nocturno y fines de semana.',
    salary: 'A tratar',
    whatsappContact: '51967477268'
  },
  {
    id: 'job-5',
    businessId: '24',
    businessName: 'Hakuna Matata Restobar',
    title: 'Ayudante de Cocina (Experiencia en Parrillas)',
    description: 'Se requiere ayudante de cocina proactivo. Es indispensable contar con experiencia comprobada en el manejo de parrillas y cilindro. Trabajo dinámico y en equipo.',
    salary: 'A tratar',
    whatsappContact: '51967477268'
  },
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
