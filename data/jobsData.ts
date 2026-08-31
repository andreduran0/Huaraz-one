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
    id: 'job-5',
    businessId: '25', 
    businessName: 'Pizzería Mi Chef Monchi',
    title: 'Ayudante de Cocina',
    description: 'Buscamos un ayudante de cocina proactivo para unirse a nuestro equipo. Sus funciones incluirán el apoyo en la preparación de ingredientes, asistencia en el armado de pizzas y shawarmas, y mantenimiento del orden y limpieza del área de trabajo.',
    salary: 'A tratar',
    whatsappContact: '51948262095' 
  },
  {
    id: 'hotel-los-inkas', // ID único para este trabajo
    businessId: 'hotel-los-inkas', // ⚠️ Reemplaza con el ID del hotel en tu base de datos si lo tienes
    businessName: 'Hotel Los Inkas',
    title: 'Personal de Limpieza',
    description: 'Buscamos personal de limpieza con experiencia en habitaciones y áreas comunes. Requisitos: compromiso, responsabilidad, honestidad, actitud proactiva y capacidad para trabajar en equipo. Ofrecemos un ambiente laboral seguro, respetuoso y trato amable.',
    salary: 'A tratar',
    whatsappContact: '51935260190' 
  },
  {
    id: 'encuentro-de-los-andes',
    businessId: 'encuentro-de-los-andes', // ⚠️ Reemplaza con el ID del restaurante
    businessName: 'Encuentro de los Andes',
    title: 'Mesero/a',
    description: 'Buscamos personal para atención al cliente como mesero/a. Orientado al buen trato, proactivo y dinámico para brindar la mejor experiencia andina a nuestros visitantes.',
    salary: 'A tratar',
    whatsappContact: '51920784431' // ⚠️ Reemplaza con el número de contacto
  },
  {
    id: 'encuentro-de-los-andes',
    businessId: 'encuentro-de-los-andes', // ⚠️ Reemplaza con el ID del restaurante
    businessName: 'Encuentro de los Andes',
    title: 'Cocinero con Experiencia',
    description: 'Se requiere cocinero con experiencia comprobada para elaboración de platos regionales y criollos. Pasión por la gastronomía local y capacidad para trabajar en equipo.',
    salary: 'A tratar',
    whatsappContact: '51920784431' // ⚠️ Reemplaza con el número de contacto
  },
  {
    id: 'job-4',
    businessId: '25', // Usamos el ID 25 que ya le asignamos a la pizzería
    businessName: 'Pizzería Mi Chef Monchi',
    title: 'Ayudante de Barra',
    description: 'Buscamos un ayudante de barra proactivo y dinámico para unirse a nuestro equipo. Ideal para personas con ganas de aprender, apoyar en la preparación de bebidas y brindar una excelente atención al cliente.',
    salary: 'A tratar',
    whatsappContact: '51948262095' // Este es el WhatsApp oficial de Monchi que registramos antes
  },
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
