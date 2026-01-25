
export interface Event {
  date: string; // Format YYYY-MM-DD
  title: string;
  description: string;
  type: 'religious' | 'cultural' | 'civic' | 'carnival';
  time?: string;
  location?: string;
}

export const events: Event[] = [
  // --- CARNAVAL HUARACINO 2026 ---
  {
    date: '2026-01-17',
    title: 'Lanzamiento del Carnaval Huaracino 2026',
    description: 'Presentación oficial del carnaval y de las bellas candidatas que aspiran a la corona de soberana del carnaval.',
    type: 'carnival',
    time: '10:00 a. m.',
    location: 'Plaza de Armas de Huaraz'
  },
  {
    date: '2026-01-30',
    title: 'Elección y Coronación de la Reina del Carnaval',
    description: 'Noche de gala, elegancia y simpatía donde se elegirá a la soberana del Carnaval Huaracino 2026.',
    type: 'carnival',
    time: '06:00 p. m.',
    location: 'Coliseo Cerrado de Huaraz'
  },
  {
    date: '2026-02-01',
    title: 'Gran Rompecalle del Carnaval Huaracino',
    description: 'Inicio explosivo de las celebraciones. Comparsas de todos los barrios recorren la ciudad con música y danzas.',
    type: 'carnival',
    time: '09:00 a. m.',
    location: 'Concentración: Plazuela de Belén'
  },
  {
    date: '2026-02-08',
    title: 'Misa de Cruces',
    description: 'Tradicional celebración religiosa de las cruces de los diversos barrios y comunidades de Huaraz.',
    type: 'religious',
    time: '11:00 a. m.',
    location: 'Templos y Parroquias de la ciudad'
  },
  {
    date: '2026-02-14',
    title: 'Entrada Triunfal del Rey Momo',
    description: 'El "Ño Carnavalón" hace su ingreso triunfal a Huaraz, marcando el inicio de la semana central de fiesta.',
    type: 'carnival',
    time: '02:00 p. m.',
    location: 'Principales calles y Plaza de Armas'
  },
  {
    date: '2026-02-15',
    title: 'Corso de Carros Alegóricos',
    description: 'Desfile de la creatividad huaracina. Carros decorados, reinas y delegaciones de instituciones y barrios.',
    type: 'carnival',
    time: '04:00 p. m.',
    location: 'Av. Luzuriaga (Frontis del Hotel Huascarán)'
  },
  {
    date: '2026-02-16',
    title: 'Lunes de Carnaval - Visita de Cruces',
    description: 'Día dedicado a la visita de las cruces en los barrios tradicionales. Música de banda y compartir comunitario.',
    type: 'religious',
    time: 'Todo el día',
    location: 'Barrios: Soledad, Belén, San Francisco, Huarupampa'
  },
  {
    date: '2026-02-17',
    title: 'Martes de Carnaval (Día Central)',
    description: 'Día de juego con agua, talco y serpentinas. Encuentro general de barrios y alegría total en las calles.',
    type: 'carnival',
    time: 'Todo el día',
    location: 'Toda la ciudad de Huaraz'
  },
  {
    date: '2026-02-17',
    title: 'Encuentro de Cruces y Velorio del Rey Momo',
    description: 'Tras el juego, las cruces se concentran y por la noche se inicia el velorio del Rey Momo con testamentos satíricos.',
    type: 'carnival',
    time: '06:00 p. m.',
    location: 'Plaza de Armas y Locales Barriales'
  },
  {
    date: '2026-02-18',
    title: 'Lectura de Testamento y Entierro del Rey Momo',
    description: 'Cierre del carnaval. Lectura del testamento jocoso del Rey Momo y su entierro simbólico en el río Quillcay.',
    type: 'carnival',
    time: '02:00 p. m.',
    location: 'Río Quillcay (Puente Comercio)'
  },

  // --- OTRAS FESTIVIDADES ---
  {
    date: '2026-03-29',
    title: 'Domingo de Ramos',
    description: 'Inicio de la Semana Santa Huaracina con la bendición de palmas y procesión.',
    type: 'religious',
  },
  {
    date: '2026-04-03',
    title: 'Viernes Santo',
    description: 'Solemne procesión del Cristo Yacente y la Virgen Dolorosa.',
    type: 'religious',
  },
  {
    date: '2026-05-01',
    title: 'Fiesta del Señor de la Soledad',
    description: 'Festividad del Patrón de Huaraz. Danzas típicas y ferias gastronómicas.',
    type: 'religious',
    location: 'Santuario de la Soledad'
  },
  {
    date: '2026-07-25',
    title: 'Aniversario de Huaraz',
    description: 'Celebración por la creación política de la provincia con desfiles y serenata.',
    type: 'civic',
  },
];
