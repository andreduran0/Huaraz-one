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
    businessId: '1',
    businessName: 'Cumbre - Mirador Rataquenua',
    title: 'Mozo / Azafata de Tiempo Completo',
    description: 'Buscamos personal con experiencia en atención al cliente, proactivo y con excelente presencia para nuestro restaurante de altura.',
    salary: 'S/ 1,200 + Propinas',
    whatsappContact: '51937511052'
  },
  {
    id: 'job-2',
    businessId: 'nobel-ingenieros',
    businessName: 'Colegio Nobel Ingenieros',
    title: 'Profesor de Matemáticas (Secundaria)',
    description: 'Únete a nuestro equipo docente. Requerimos profesional titulado con pasión por la enseñanza y metodología innovadora.',
    salary: 'A tratar según experiencia',
    whatsappContact: '51929866812'
  },
  {
    id: 'job-3',
    businessId: 'policlinico-doctor-d',
    businessName: 'Policlínico Doctor D',
    title: 'Recepcionista / Atención al Paciente',
    description: 'Se busca personal para recepción. Trato amable, manejo de herramientas de oficina y disponibilidad inmediata.',
    salary: 'S/ 1,100',
    whatsappContact: '51954758684'
  }
];
