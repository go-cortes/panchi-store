// Contenido del blog
const blogPosts = [
    {
        id: 1,
        titulo: "Cuidados Básicos para Perros en Invierno",
        resumen: "Consejos esenciales para mantener a tu perro saludable durante los meses más fríos del año.",
        contenido: `
            <h3>Protección contra el frío</h3>
            <p>Durante el invierno, es importante proteger a tu perro del frío extremo. Si tu perro tiene pelo corto o es de raza pequeña, considera usar ropa abrigada para mascotas cuando salgan a pasear.</p>
            
            <h3>Alimentación adecuada</h3>
            <p>En invierno, los perros pueden necesitar más calorías para mantener su temperatura corporal. Consulta con tu veterinario sobre ajustar la cantidad de comida si es necesario.</p>
            
            <h3>Ejercicio en interiores</h3>
            <p>Cuando hace demasiado frío para salir, asegúrate de que tu perro haga ejercicio en casa. Los juguetes interactivos y los juegos de búsqueda son excelentes opciones.</p>
            
            <h3>Hidratación</h3>
            <p>Aunque haga frío, tu perro sigue necesitando agua fresca. Asegúrate de que siempre tenga acceso a agua limpia y a temperatura ambiente.</p>
        `,
        imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=center",
        fecha: "2024-01-15",
        categoria: "Salud",
        autor: "Dr. María González"
    },
    {
        id: 2,
        titulo: "Alimentación Natural para Gatos: Guía Completa",
        resumen: "Descubre cómo preparar una dieta natural y balanceada para tu gato en casa.",
        contenido: `
            <h3>Beneficios de la alimentación natural</h3>
            <p>La alimentación natural para gatos puede ofrecer varios beneficios, incluyendo mejor digestión, pelaje más brillante y mayor energía.</p>
            
            <h3>Ingredientes esenciales</h3>
            <p>Una dieta natural para gatos debe incluir proteínas de alta calidad (carne, pescado), grasas saludables, y una pequeña cantidad de carbohidratos.</p>
            
            <h3>Recetas básicas</h3>
            <p>Pollo hervido con arroz integral, salmón con calabaza, o pavo con zanahorias son excelentes opciones para comenzar.</p>
            
            <h3>Precauciones importantes</h3>
            <p>Siempre consulta con tu veterinario antes de cambiar la dieta de tu gato. Algunos alimentos humanos pueden ser tóxicos para los felinos.</p>
        `,
        imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop&crop=center",
        fecha: "2024-01-10",
        categoria: "Alimentación",
        autor: "Nutricionista Veterinaria Ana Martínez"
    },
    {
        id: 3,
        titulo: "Juguetes DIY para Mascotas: Divertidos y Económicos",
        resumen: "Crea juguetes caseros seguros y divertidos para tu mascota sin gastar mucho dinero.",
        contenido: `
            <h3>Juguetes para perros</h3>
            <p>Una botella de plástico limpia con algunos agujeros y golosinas en el interior puede mantener a tu perro entretenido por horas.</p>
            
            <h3>Juguetes para gatos</h3>
            <p>Una caja de cartón con agujeros de diferentes tamaños se convierte en el juguete perfecto para tu gato. También puedes hacer una pelota con papel de aluminio.</p>
            
            <h3>Materiales seguros</h3>
            <p>Siempre usa materiales no tóxicos y evita objetos pequeños que puedan ser ingeridos. Supervisa a tu mascota mientras juega.</p>
            
            <h3>Rotación de juguetes</h3>
            <p>Cambia los juguetes regularmente para mantener el interés de tu mascota. Guarda algunos y rótalos cada semana.</p>
        `,
        imagen: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&crop=center",
        fecha: "2024-01-05",
        categoria: "Juguetes",
        autor: "Entrenadora de Mascotas Carlos Ruiz"
    },
    {
        id: 4,
        titulo: "Cómo Adiestrar a tu Perro: Técnicas Básicas",
        resumen: "Aprende las técnicas fundamentales para adiestrar a tu perro de manera efectiva y positiva.",
        contenido: `
            <h3>Refuerzo positivo</h3>
            <p>El refuerzo positivo es la base del adiestramiento moderno. Premia las conductas deseadas con golosinas, elogios o caricias.</p>
            
            <h3>Comandos básicos</h3>
            <p>Comienza con comandos simples como "siéntate", "quieto" y "ven". Sé consistente con las palabras y gestos que uses.</p>
            
            <h3>Sesiones cortas</h3>
            <p>Las sesiones de adiestramiento deben ser cortas (10-15 minutos) y frecuentes. Es mejor hacer varias sesiones cortas que una larga.</p>
            
            <h3>Paciencia y constancia</h3>
            <p>Cada perro aprende a su ritmo. Sé paciente y no te desanimes si no ve resultados inmediatos. La constancia es clave.</p>
        `,
        imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop&crop=center",
        fecha: "2024-01-01",
        categoria: "Consejos",
        autor: "Entrenador Profesional Laura Fernández"
    }
];

// Variable para almacenar el filtro actual
let filtroActual = 'todos';

// Función para cargar los posts del blog
function cargarBlogPosts(categoria = 'todos') {
    const container = document.getElementById('blogs-container');
    if (!container) return;

    // Filtrar posts por categoría
    let postsFiltrados = blogPosts;
    if (categoria !== 'todos') {
        postsFiltrados = blogPosts.filter(post => post.categoria === categoria);
    }

    let html = '';
    
    if (postsFiltrados.length === 0) {
        html = `
            <div class="col-12 text-center py-5">
                <div class="card">
                    <div class="card-body">
                        <i class="bi bi-search fs-1 text-muted mb-3"></i>
                        <h4 class="text-muted">No se encontraron artículos</h4>
                        <p class="text-muted">No hay artículos disponibles en la categoría "${categoria}".</p>
                        <button class="btn btn-primary" onclick="cargarBlogPosts('todos')">
                            <i class="bi bi-arrow-left me-2"></i>Ver todos los artículos
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        postsFiltrados.forEach(post => {
            const fecha = new Date(post.fecha).toLocaleDateString('es-ES');
            html += `
                <div class="col-lg-6 col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${post.imagen}" class="card-img-top" alt="${post.titulo}" style="height: 250px; object-fit: cover;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
                        <div class="card-body d-flex flex-column">
                            <div class="mb-2">
                                <span class="badge bg-primary me-2">${post.categoria}</span>
                                <small class="text-muted">${fecha}</small>
                            </div>
                            <h5 class="card-title" style="color: #8B4513;">${post.titulo}</h5>
                            <p class="card-text text-muted flex-grow-1">${post.resumen}</p>
                            <div class="mt-auto">
                                <small class="text-muted">Por: ${post.autor}</small>
                                <button class="btn btn-outline-primary btn-sm float-end" onclick="mostrarPostCompleto(${post.id})">
                                    Leer más <i class="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
    filtroActual = categoria;
    
    // Actualizar el estado de los botones de filtro
    actualizarBotonesFiltro(categoria);
}

// Función para filtrar por categoría
function filtrarPorCategoria(categoria) {
    cargarBlogPosts(categoria);
    
    // Actualizar el estado visual de todos los botones de filtro
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Marcar el botón activo
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Función para actualizar el estado de los botones de filtro
function actualizarBotonesFiltro(categoria) {
    // Remover la clase active de todos los botones
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Solo agregar la clase active al botón correspondiente si se está filtrando
    if (categoria !== 'todos') {
        const botones = document.querySelectorAll('.btn-group .btn');
        botones.forEach(boton => {
            if (categoria === 'Salud' && boton.textContent.includes('Salud')) {
                boton.classList.add('active');
            } else if (categoria === 'Alimentación' && boton.textContent.includes('Alimentación')) {
                boton.classList.add('active');
            } else if (categoria === 'Juguetes' && boton.textContent.includes('Juguetes')) {
                boton.classList.add('active');
            } else if (categoria === 'Consejos' && boton.textContent.includes('Consejos')) {
                boton.classList.add('active');
            }
        });
    }
}

// Función para mostrar el post completo
function mostrarPostCompleto(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    // Crear modal para mostrar el post completo
    const modalHtml = `
        <div class="modal fade" id="postModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${post.titulo}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <img src="${post.imagen}" class="img-fluid rounded mb-3" alt="${post.titulo}">
                        <div class="mb-3">
                            <span class="badge bg-primary me-2">${post.categoria}</span>
                            <small class="text-muted">Por: ${post.autor} - ${new Date(post.fecha).toLocaleDateString('es-ES')}</small>
                        </div>
                        <div class="post-content">
                            ${post.contenido}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente si hay uno
    const existingModal = document.getElementById('postModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Agregar el modal al body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('postModal'));
    modal.show();
}

// Función para asegurar que el blog siempre esté visible
function asegurarBlogVisible() {
    const container = document.getElementById('blogs-container');
    if (container && container.children.length === 0) {
        cargarBlogPosts(filtroActual);
    }
}

// Observer para detectar cambios en el DOM
function configurarObserver() {
    const container = document.getElementById('blogs-container');
    if (!container) return;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && container.children.length === 0) {
                // Si el contenedor se vacía, recargar el blog
                setTimeout(() => {
                    if (container.children.length === 0) {
                        cargarBlogPosts(filtroActual);
                    }
                }, 100);
            }
        });
    });

    observer.observe(container, { childList: true });
}

// Cargar posts cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarBlogPosts('todos');
    configurarObserver();
    
    // Verificar periódicamente que el blog esté visible (menos frecuente)
    setInterval(asegurarBlogVisible, 5000);
});

// Función para recargar el blog si es necesario
function recargarBlog() {
    cargarBlogPosts(filtroActual);
}

// Función para manejar la visibilidad del blog en navegación
function manejarVisibilidadBlog() {
    // Verificar si estamos en la página de blog
    if (window.location.pathname.includes('blogs.html')) {
        const container = document.getElementById('blogs-container');
        if (container && container.children.length === 0) {
            cargarBlogPosts(filtroActual);
        }
    }
}

// Escuchar cambios en la URL (para navegación SPA)
window.addEventListener('popstate', manejarVisibilidadBlog);

// Verificar visibilidad cuando la página se vuelve visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        manejarVisibilidadBlog();
    }
});
