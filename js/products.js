// Datos de productos para la tienda de mascotas
const productos = [
    // Alimento para perros
    {
        id: 1,
        nombre: "Alimento Premium para Perros",
        precio: 29990,
        descripcion: "Alimento balanceado con proteínas de alta calidad, ideal para perros adultos de todas las razas.",
        imagen: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop&crop=center",
        categoria: "alimento",
        tipo: "perro"
    },
    
    // Juguete para gatos
    {
        id: 2,
        nombre: "Juguete Interactivo para Gatos",
        precio: 15990,
        descripcion: "Juguete con plumas y sonidos que estimula el instinto de caza de tu gato.",
        imagen: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=300&h=200&fit=crop&crop=center",
        categoria: "juguete",
        tipo: "gato"
    },
    
    // Cama para mascotas
    {
        id: 3,
        nombre: "Cama Ortopédica para Mascotas",
        precio: 45990,
        descripcion: "Cama ergonómica con memoria que proporciona máximo confort para perros y gatos.",
        imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop&crop=center",
        categoria: "accesorio",
        tipo: "ambos"
    },
    
    // Kit de higiene
    {
        id: 4,
        nombre: "Kit de Higiene Completo",
        precio: 22990,
        descripcion: "Incluye champú, cepillo, peine y toallitas húmedas para el cuidado diario de tu mascota.",
        imagen: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&h=200&fit=crop&crop=center",
        categoria: "higiene",
        tipo: "ambos"
    },
    
    // Snacks para perros
    {
        id: 5,
        nombre: "Snacks Naturales para Perros",
        precio: 12990,
        descripcion: "Snacks saludables hechos con ingredientes naturales, perfectos para el entrenamiento.",
        imagen: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=200&fit=crop&crop=center",
        categoria: "alimento",
        tipo: "perro"
    },
    
    // Rascador para gatos
    {
        id: 6,
        nombre: "Rascador para Gatos",
        precio: 18990,
        descripcion: "Rascador de cartón con catnip incluido para mantener las uñas de tu gato en perfecto estado.",
        imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=200&fit=crop&crop=center",
        categoria: "accesorio",
        tipo: "gato"
    },
    
    // Champú antialérgico
    {
        id: 7,
        nombre: "Champú Antialérgico",
        precio: 12990,
        descripcion: "Champú hipoalergénico para mascotas con piel sensible, sin fragancias artificiales.",
        imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center",
        categoria: "higiene",
        tipo: "ambos"
    },
    
    // Pelota interactiva
    {
        id: 8,
        nombre: "Pelota Interactiva",
        precio: 8990,
        descripcion: "Pelota con sonido que se mueve sola, perfecta para mantener activo a tu perro.",
        imagen: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=200&fit=crop&crop=center",
        categoria: "juguete",
        tipo: "perro"
    },
    
    // Arnés reflectante
    {
        id: 9,
        nombre: "Arnés Reflectante",
        precio: 24990,
        descripcion: "Arnés cómodo y seguro con tiras reflectantes para paseos nocturnos.",
        imagen: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop&crop=center",
        categoria: "accesorio",
        tipo: "perro"
    },
    
    // Sweater para gatos
    {
        id: 10,
        nombre: "Sweater para Gatos",
        precio: 15990,
        descripcion: "Sweater cálido y cómodo para gatos, disponible en varios colores y tallas.",
        imagen: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop&crop=center",
        categoria: "ropa",
        tipo: "gato"
    },
    
    // Vitaminas para mascotas
    {
        id: 11,
        nombre: "Vitamina para Mascotas",
        precio: 19990,
        descripcion: "Complejo vitamínico para fortalecer el sistema inmunológico de tu mascota.",
        imagen: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=center",
        categoria: "medicina",
        tipo: "ambos"
    },
    
    // Comedero automático
    {
        id: 12,
        nombre: "Comedero Automático",
        precio: 45990,
        descripcion: "Comedero programable que distribuye la comida en horarios específicos.",
        imagen: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUQ1Ii8+CjxyZWN0IHg9IjUwIiB5PSI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIHJ4PSIxMCIgZmlsbD0iI0EwNTIyRCIvPgo8cmVjdCB4PSI2MCIgeT0iNTAiIHdpZHRoPSIxODAiIGhlaWdodD0iMTAwIiByeD0iNSIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSI4MCIgcj0iMTUiIGZpbGw9IiM4QjQ1MTMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iODAiIHI9IjEwIiBmaWxsPSIjQ0Q4NTNGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMTUiIGZpbGw9IiM4QjQ1MTMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTAwIiByPSIxMCIgZmlsbD0iI0NEODUzRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjQTA1MjJEIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db21lZGVybyBBdXRvbcOhdGljbzwvdGV4dD4KPC9zdmc+Cg==",
        categoria: "accesorio",
        tipo: "ambos"
    }
];