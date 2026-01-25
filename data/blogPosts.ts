
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: 'trekking' | 'food' | 'tips' | 'culture';
  readTime: string;
  youtubeId?: string; // Nuevo campo para el ID del video de YouTube
}

export const blogPosts: BlogPost[] = [
  {
    id: 'mejor-epoca-huaraz',
    title: '¿Cuál es la mejor época para visitar Huaraz?',
    excerpt: 'Descubre cuándo viajar para encontrar cielos despejados y los nevados en todo su esplendor.',
    author: 'Huaraz Explorer Team',
    date: '2025-05-10',
    category: 'tips',
    readTime: '5 min',
    image: 'https://bananomeridiano.com/wp-content/uploads/2022/03/laguna-paron-huaraz.jpg',
    youtubeId: 'dQw4w9WgXcQ', // Ejemplo: ID de un video tuyo
    content: `
# La Mejor Época para tu Aventura en Huaraz

Huaraz, la capital del trekking en el Perú, tiene dos estaciones muy marcadas. Elegir la correcta dependerá de qué actividades planeas realizar.

## El Verano Andino (Mayo a Septiembre)
Es la temporada ideal para el montañismo y el trekking. 
*   **Clima**: Días soleados con cielos de un azul intenso.
*   **Ventajas**: Visibilidad perfecta de los nevados (Huascarán, Alpamayo).
*   **Desventajas**: Las noches son muy frías, llegando incluso a temperaturas bajo cero.

## La Temporada de Lluvias (Octubre a Abril)
Aunque llueve, tiene un encanto especial.
*   **Clima**: Mañanas nubladas con lluvias por la tarde.
*   **Ventajas**: Paisajes mucho más verdes, menos turistas y precios más bajos.

### Recomendación Pro
Si buscas el equilibrio perfecto, intenta viajar en **Mayo o Junio**. El paisaje aún está verde por las lluvias pasadas y el cielo ya está despejado.
    `
  },
  {
    id: 'guia-gastronomica-huaraz',
    title: '5 Platos Típicos que no puedes perderte',
    excerpt: 'Desde la Llunca hasta el Cuy Chactado, un recorrido por los sabores de Ancash.',
    author: 'Chef Local',
    date: '2025-06-15',
    category: 'food',
    readTime: '7 min',
    image: 'https://i.imgur.com/UYGAUFo.png',
    content: `
# Sabores de la Cordillera: Guía Gastronómica

La cocina huaracina es robusta, caliente y llena de historia. Aquí te presentamos los imperdibles:

1.  **Picante de Cuy**: El plato estrella de las festividades.
2.  **Llunca Kashki**: Una sopa de trigo resbalado con gallina de corral, ideal para el frío.
3.  **Puchero**: Un caldo potente con diversas carnes y legumbres.
4.  **Charqui**: Carne de llama o res deshidratada, un snack milenario.
5.  **Cebiche de Chocho**: El superalimento de los Andes transformado en un ceviche vegetal delicioso.

**¿Dónde comer?** Te recomendamos visitar negocios patrocinados como **Cumbre** para una experiencia fusión increíble.
    `
  }
];
