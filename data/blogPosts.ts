
export interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: 'trekking' | 'food' | 'tips' | 'culture';
  readTime: string;
  youtubeId?: string; // IMPORTANTE: Solo pon el código final del video
}

export const blogPosts: BlogPost[] = [
  {
    id: 'laguna-69-guia-video',
    title: 'Guía Completa: Laguna 69 en Video',
    excerpt: 'Mira nuestra travesía en video y prepárate para la caminata más icónica de Huaraz.',
    author: 'Huaraz Explorer Team',
    date: '2025-05-15',
    category: 'trekking',
    readTime: '8 min',
    image: 'https://pamelatours.com/wp-content/uploads/2019/10/laguna69.jpg',
    youtubeId: '9n4NqXfWl-I', // Ejemplo de ID de video
    content: `
# Preparándote para la Laguna 69

En el video de arriba te mostramos el camino real. Aquí algunos puntos clave:

*   **Aclimatación**: Mínimo 2 días en Huaraz antes de ir.
*   **Equipo**: Lleva capas, el clima cambia rápido arriba.
*   **Hidratación**: Bebe mucha agua para evitar el mal de montaña.

Disfruta el video y suscríbete para más rutas.
    `
  },
  {
    id: 'mejor-epoca-huaraz',
    title: '¿Cuál es la mejor época para visitar Huaraz?',
    excerpt: 'Descubre cuándo viajar para encontrar cielos despejados y los nevados en todo su esplendor.',
    author: 'Huaraz Explorer Team',
    date: '2025-05-10',
    category: 'tips',
    readTime: '5 min',
    image: 'https://bananomeridiano.com/wp-content/uploads/2022/03/laguna-paron-huaraz.jpg',
    content: `
# La Mejor Época para tu Aventura en Huaraz

Huaraz tiene dos estaciones muy marcadas.

## El Verano Andino (Mayo a Septiembre)
Es la temporada ideal para el montañismo y el trekking. 
*   **Clima**: Días soleados con cielos de un azul intenso.
    `
  }
];
