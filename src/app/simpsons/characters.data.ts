export interface Character {
  id: number;
  name: string;
  occupation: string;
  status: 'Vivo' | 'Fallecido';
  gender: 'Masculino' | 'Femenino';
  image: string;
  color: string;
  age?: number;
  phrases?: string[];
}

// Datos de ejemplo para mostrar el diseño sin depender de una API.
export const CHARACTERS: Character[] = [
  { id: 1, name: 'Homero Simpson', occupation: 'Inspector de seguridad', status: 'Vivo', gender: 'Masculino', image: '/characters/homer.svg', color: '#a9dffc', age: 39, phrases: ['¡D’oh!', '¡Mmm... rosquillas!'] },
  { id: 2, name: 'Marge Simpson', occupation: 'Ama de casa', status: 'Vivo', gender: 'Femenino', image: '/characters/marge.svg', color: '#d9c0f5' },
  { id: 3, name: 'Bart Simpson', occupation: 'Estudiante de primaria', status: 'Vivo', gender: 'Masculino', image: '/characters/bart.svg', color: '#ffe17d' },
  { id: 4, name: 'Lisa Simpson', occupation: 'Estudiante y saxofonista', status: 'Vivo', gender: 'Femenino', image: '/characters/lisa.svg', color: '#f8bddd' },
  { id: 5, name: 'Maggie Simpson', occupation: 'Ocupación no disponible', status: 'Vivo', gender: 'Femenino', image: '/characters/maggie.svg', color: '#b7ead8' },
  { id: 6, name: 'Ned Flanders', occupation: 'Dueño del Zurditorium', status: 'Vivo', gender: 'Masculino', image: '/characters/ned.svg', color: '#bce5a4' },
  { id: 7, name: 'Abuelo Simpson', occupation: 'Jubilado', status: 'Vivo', gender: 'Masculino', image: '/characters/homer.svg', color: '#c4d9f6' },
  { id: 8, name: 'Milhouse Van Houten', occupation: 'Estudiante de primaria', status: 'Vivo', gender: 'Masculino', image: '/characters/bart.svg', color: '#d9c0f5' },
  { id: 9, name: 'Sr. Burns', occupation: 'Dueño de la planta nuclear', status: 'Vivo', gender: 'Masculino', image: '/characters/ned.svg', color: '#f8bddd' },
  { id: 10, name: 'Moe Szyslak', occupation: 'Cantinero', status: 'Vivo', gender: 'Masculino', image: '/characters/homer.svg', color: '#b7ead8' },
  { id: 11, name: 'Krusty el Payaso', occupation: 'Presentador de televisión', status: 'Vivo', gender: 'Masculino', image: '/characters/bart.svg', color: '#ffe17d' },
  { id: 12, name: 'Edna Krabappel', occupation: 'Maestra de primaria', status: 'Fallecido', gender: 'Femenino', image: '', color: '#d9c0f5' },
];
