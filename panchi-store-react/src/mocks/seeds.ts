import type { Product, User, Cart } from '../types/contracts'

export const users: User[] = [
  { id: 1, email: 'admin@panchi.test', name: 'Admin', role: 'admin' },
  { id: 2, email: 'cliente@panchi.test', name: 'Cliente', role: 'cliente' },
  { id: 3, email: 'admin@tienda.cl', name: 'Gonzalo', role: 'admin' },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Alimento Premium para Perros',
    description: 'Alimento balanceado con ingredientes naturales para perros adultos.',
    price: 19990,
    stock: 20,
    brand: 'PetCare',
    category: 'alimento',
    images: [
      'https://images.unsplash.com/photo-1596495577886-d6c4007f92bc?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 2,
    name: 'Arena para Gatos Ultra Aglomerante',
    description: 'Arena de alta calidad con control de olores por 7 días.',
    price: 14990,
    stock: 35,
    brand: 'CatComfort',
    category: 'higiene',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 3,
    name: 'Juguete Mordedor Resistente',
    description: 'Juguete de goma reforzada para perros con mordida fuerte.',
    price: 9990,
    stock: 50,
    brand: 'StrongPaws',
    category: 'juguete',
    images: [
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 4,
    name: 'Collar Ajustable Reflectante',
    description: 'Collar de nylon con cinta reflectante para paseos nocturnos.',
    price: 12990,
    stock: 40,
    brand: 'NightWalk',
    category: 'accesorio',
    images: [
      'https://images.unsplash.com/photo-1556227701-88b36db7d423?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 5,
    name: 'Snacks Naturales para Perros',
    description: 'Snacks saludables hechos con ingredientes naturales, perfectos para entrenamiento.',
    price: 12990,
    stock: 60,
    brand: 'HealthyBites',
    category: 'alimento',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 6,
    name: 'Rascador para Gatos con Catnip',
    description: 'Rascador de cartón con catnip para mantener uñas saludables.',
    price: 18990,
    stock: 25,
    brand: 'CatFun',
    category: 'accesorio',
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 7,
    name: 'Shampoo Hipoalergénico para Mascotas',
    description: 'Shampoo suave para piel sensible, sin fragancias artificiales.',
    price: 12990,
    stock: 45,
    brand: 'SoftCare',
    category: 'higiene',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 8,
    name: 'Pelota Interactiva con Sonido',
    description: 'Pelota que emite sonido y se mueve sola para perros activos.',
    price: 8990,
    stock: 70,
    brand: 'PlayTime',
    category: 'juguete',
    images: [
      'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 9,
    name: 'Arnés Reflectante Ajustable',
    description: 'Arnés cómodo y seguro con superficie reflectante.',
    price: 24990,
    stock: 30,
    brand: 'SafeWalk',
    category: 'accesorio',
    images: [
      'https://images.unsplash.com/photo-1556227701-88b36db7d423?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 10,
    name: 'Cama Ortopédica para Mascotas',
    description: 'Cama acolchada ideal para articulaciones, fácil de limpiar.',
    price: 34990,
    stock: 15,
    brand: 'DreamPet',
    category: 'accesorio',
    images: [
      'https://images.unsplash.com/photo-1596495577886-d6c4007f92bc?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 11,
    name: 'Alimento Premium para Gatos',
    description: 'Receta rica en proteínas y baja en granos para gatos.',
    price: 21990,
    stock: 22,
    brand: 'CatDelight',
    category: 'alimento',
    images: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=480&h=320&fit=crop&crop=center',
    ],
  },
  {
    id: 12,
    name: 'Acondicionador Hidratante para Pelaje',
    description: 'Acondicionador hidratante que deja el pelaje suave y brillante.',
    price: 10990,
    stock: 33,
    brand: 'SoftCare',
    category: 'higiene',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&h=320&fit=crop&crop=center',
    ],
  },
]

export const favoritesByUser = new Map<number, Set<number>>()
export const cartsByUser = new Map<number, Cart>()