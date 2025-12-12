
export interface Event {
  date: string; // Format YYYY-MM-DD
  title: string;
  description: string;
  type: 'religious' | 'cultural' | 'civic';
}

export const events: Event[] = [
  {
    date: '2026-02-14',
    title: 'Carnavales Huaracinos',
    description: 'La fiesta más colorida con pasacalles, cortamontes y el tradicional Ño Carnavalón. ¡Prepárate para el agua y talco!',
    type: 'cultural',
  },
  {
    date: '2026-03-29',
    title: 'Domingo de Ramos',
    description: 'Inicio de la Semana Santa Huaracina con la tradicional procesión del Señor de Ramos.',
    type: 'religious',
  },
  {
    date: '2026-04-03',
    title: 'Viernes Santo',
    description: 'Solemne procesión del Cristo Yacente y la Virgen Dolorosa por las calles principales de Huaraz.',
    type: 'religious',
  },
  {
    date: '2026-05-01',
    title: 'Fiesta del Señor de la Soledad',
    description: 'Día central del Patrón Jurado de Huaraz. Misas, procesiones y fuegos artificiales en el barrio de la Soledad.',
    type: 'religious',
  },
  {
    date: '2026-05-02',
    title: 'Octava de la Soledad',
    description: 'Continuación de la fiesta patronal con danzas típicas como los Shacshas y Atahualpas.',
    type: 'cultural',
  },
  {
    date: '2026-06-24',
    title: 'Día del Campesino',
    description: 'Celebración andina con ferias gastronómicas y presentaciones de música vernacular.',
    type: 'civic',
  },
  {
    date: '2026-07-25',
    title: 'Aniversario de Huaraz',
    description: 'Desfile cívico militar, serenata y actividades culturales por la fundación de la ciudad.',
    type: 'civic',
  },
  {
    date: '2026-07-28',
    title: 'Fiestas Patrias',
    description: 'Celebración de la Independencia del Perú. Ideal para hacer trekking aprovechando el feriado largo.',
    type: 'civic',
  },
  {
    date: '2026-10-08',
    title: 'Combate de Angamos',
    description: 'Feriado nacional con actividades cívicas.',
    type: 'civic',
  },
  {
    date: '2026-11-01',
    title: 'Todos los Santos',
    description: 'Tradicional visita a los cementerios y consumo de "Guaguas" de pan.',
    type: 'cultural',
  },
];
