/* ============================================
   DATOS DE PRODUCTOS - MUNDO MASCOTA (VERSIÓN ACTUALIZADA)
   ============================================
   
   Este archivo contiene los datos de productos actualizados de la tienda.
   Es una versión mejorada del archivo products.js con productos adicionales
   y mejor organización de la información.
   
   ESTRUCTURA DE CADA PRODUCTO:
   - id: número único que identifica al producto
   - nombre: título del producto
   - precio: costo en pesos chilenos (sin puntos ni símbolos)
   - descripcion: texto que describe el producto
   - imagen: URL de la imagen del producto
   - categoria: tipo de producto (alimento, juguete, accesorio, etc.)
   - tipo: tipo de mascota (perro, gato, ambos)
   
   DIFERENCIAS CON LA VERSIÓN ANTERIOR:
   - Productos adicionales para mayor variedad
   - Mejor organización de categorías
   - Imágenes optimizadas para mejor rendimiento
   - Descripciones más detalladas
   ============================================ */

// Constante que contiene el arreglo de productos para mascotas con imágenes específicas
// 'const' significa que no se puede reasignar, pero sí se pueden modificar los elementos
const productos = [
    // ============================================
    // PRODUCTO 1: ALIMENTO PREMIUM PARA PERROS
    // ============================================
    {
        id: 1, // Identificador único del producto
        nombre: "Alimento Premium para Perros", // Título del producto
        precio: 29990, // Precio en pesos chilenos (sin formato)
        descripcion: "Alimento balanceado con proteínas de alta calidad, ideal para perros adultos de todas las razas.",
        imagen: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop&crop=center", // Imagen de comida para perros
        categoria: "alimento", // Tipo de producto
        tipo: "perro" // Tipo de mascota
    },
    
    // ============================================
    // PRODUCTO 2: JUGUETE INTERACTIVO PARA GATOS
    // ============================================
    {
        id: 2,
        nombre: "Juguete Interactivo para Gatos",
        precio: 15990,
        descripcion: "Juguete con plumas y sonidos que estimula el instinto de caza de tu gato.",
        imagen: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=200&fit=crop&crop=center", // Imagen de juguete para gatos
        categoria: "juguete",
        tipo: "gato"
    },
    
    // ============================================
    // PRODUCTO 3: CAMA ORTOPÉDICA PARA MASCOTAS
    // ============================================
    {
        id: 3,
        nombre: "Cama Ortopédica para Mascotas",
        precio: 45990,
        descripcion: "Cama ergonómica con memoria que proporciona máximo confort para perros y gatos.",
        imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop&crop=center", // Imagen de cama para mascotas
        categoria: "accesorio",
        tipo: "ambos" // Sirve para perros y gatos
    },
    
    // ============================================
    // PRODUCTO 4: KIT DE HIGIENE COMPLETO
    // ============================================
    {
        id: 4,
        nombre: "Kit de Higiene Completo",
        precio: 22990,
        descripcion: "Incluye champú, cepillo, peine y toallitas húmedas para el cuidado diario de tu mascota.",
        imagen: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=200&fit=crop&crop=center", // Imagen de productos de higiene
        categoria: "higiene",
        tipo: "ambos"
    },
    
    // ============================================
    // PRODUCTO 5: SNACKS NATURALES PARA PERROS
    // ============================================
    {
        id: 5,
        nombre: "Snacks Naturales para Perros",
        precio: 12990,
        descripcion: "Snacks saludables hechos con ingredientes naturales, perfectos para el entrenamiento.",
        imagen: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=200&fit=crop&crop=center", // Imagen de snacks para perros
        categoria: "alimento",
        tipo: "perro"
    },
    
    // ============================================
    // PRODUCTO 6: RASCADOR PARA GATOS
    // ============================================
    {
        id: 6,
        nombre: "Rascador para Gatos",
        precio: 18990,
        descripcion: "Rascador de cartón con catnip incluido para mantener las uñas de tu gato en perfecto estado.",
        imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=200&fit=crop&crop=center", // Imagen de rascador para gatos
        categoria: "accesorio",
        tipo: "gato"
    },
    
    // ============================================
    // PRODUCTO 7: CHAMPÚ ANTIALÉRGICO
    // ============================================
    {
        id: 7,
        nombre: "Champú Antialérgico",
        precio: 12990,
        descripcion: "Champú hipoalergénico para mascotas con piel sensible, sin fragancias artificiales.",
        imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center", // Imagen de champú para mascotas
        categoria: "higiene",
        tipo: "ambos"
    },
    
    // ============================================
    // PRODUCTO 8: PELOTA INTERACTIVA
    // ============================================
    {
        id: 8,
        nombre: "Pelota Interactiva",
        precio: 8990,
        descripcion: "Pelota con sonido que se mueve sola, perfecta para mantener activo a tu perro.",
        imagen: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=200&fit=crop&crop=center", // Imagen de pelota para perros
        categoria: "juguete",
        tipo: "perro"
    },
    
    // ============================================
    // PRODUCTO 9: ARNÉS REFLECTANTE
    // ============================================
    {
        id: 9,
        nombre: "Arnés Reflectante",
        precio: 24990,
        descripcion: "Arnés cómodo y seguro con tiras reflectantes para paseos nocturnos.",
        imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop&crop=center", // Imagen de arnés para perros
        categoria: "accesorio",
        tipo: "perro"
    },
    
    // ============================================
    // PRODUCTO 10: SWEATER PARA GATOS
    // ============================================
    {
        id: 10,
        nombre: "Sweater para Gatos",
        precio: 15990,
        descripcion: "Sweater cálido y cómodo para gatos, disponible en varios colores y tallas.",
        imagen: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop&crop=center", // Imagen de gato con ropa
        categoria: "ropa",
        tipo: "gato"
    },
    
    // ============================================
    // PRODUCTO 11: VITAMINAS PARA MASCOTAS
    // ============================================
    {
        id: 11,
        nombre: "Vitamina para Mascotas",
        precio: 19990,
        descripcion: "Complejo vitamínico para fortalecer el sistema inmunológico de tu mascota.",
        imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=center", // Imagen de suplementos/medicinas
        categoria: "medicina",
        tipo: "ambos"
    },
    
    // ============================================
    // PRODUCTO 12: COMEDERO AUTOMÁTICO
    // ============================================
    {
        id: 12,
        nombre: "Comedero Automático",
        precio: 45990,
        descripcion: "Comedero programable que distribuye la comida en horarios específicos.",
        imagen: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=300&h=200&fit=crop&crop=center", // Imagen de comedero automático
        categoria: "accesorio",
        tipo: "ambos"
    }
];

