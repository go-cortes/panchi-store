// Filtros de productos para la tienda de mascotas

// Variables globales para filtros
let productosFiltrados = [];
let productosMostrados = 12; // Mostrar 12 productos como en el mockup (3x4)

// Inicialización de la página de productos
document.addEventListener('DOMContentLoaded', function() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    // Filtrar productos por categoría si se especifica
    if (categoria) {
        productosFiltrados = productos.filter(producto => 
            producto.categoria.toLowerCase() === categoria.toLowerCase()
        );
    } else {
        productosFiltrados = [...productos];
    }
    
    mostrarProductos();
    actualizarContadorCarrito();
    
    // Mostrar mensaje si no hay productos en la categoría
    if (categoria && productosFiltrados.length === 0) {
        mostrarMensaje(`No se encontraron productos en la categoría "${categoria}"`, 'info');
    }
});

// Configurar event listeners para filtros (removido para simplificar según mockup)

// Configurar vista (removido para simplificar según mockup)

// Filtrar productos (removido para simplificar según mockup)

/**
 * MOSTRAR LOS PRODUCTOS FILTRADOS
 * 
 * Esta función se encarga de mostrar los productos en la página.
 * Muestra exactamente 12 productos en un grid de 3x4 como en el mockup.
 */
function mostrarProductos() {
    // Obtener referencias a los elementos del DOM
    const container = document.getElementById('products-container'); // Contenedor principal
    
    // Limpiar el contenedor antes de mostrar nuevos productos
    container.innerHTML = '';
    
    // Mostrar exactamente 12 productos (3x4 grid como en el mockup)
    const productosAMostrar = productosFiltrados.slice(0, 12);
    
    // Crear y mostrar cada producto
    productosAMostrar.forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        container.appendChild(tarjetaProducto);
    });
}

/**
 * CREAR TARJETA DE PRODUCTO
 * 
 * Esta función crea el HTML completo de una tarjeta de producto.
 * Diseño simplificado según el mockup.
 */
function crearTarjetaProducto(producto) {
    // Crear el contenedor principal de la tarjeta
    const columna = document.createElement('div');
    
    // Asignar clases de Bootstrap para el layout responsivo (3x4 grid)
    columna.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    
    // Formatear el precio como moneda chilena
    const precioFormateado = formatearPrecio(producto.precio);
    
    // Crear el HTML completo de la tarjeta usando template literals
    columna.innerHTML = `
        <div class="card h-100 shadow-sm">
            <!-- Imagen del producto con fallback -->
            <img src="${producto.imagen}" 
                 class="card-img-top" 
                 alt="${producto.nombre}"
                 style="height: 200px; object-fit: cover;"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
            
            <!-- Cuerpo de la tarjeta -->
            <div class="card-body d-flex flex-column">
                <h5 class="card-title" style="color: #8B4513;">${producto.nombre}</h5>
                <p class="card-text text-muted small">${producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}</p>
                
                <!-- Sección inferior (precio y botón) -->
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h5 mb-0 fw-bold" style="color: #8B4513;">${precioFormateado}</span>
                    </div>
                    <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id})" style="background: linear-gradient(45deg, #8B4513, #A0522D); border: none; color: white;">
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return columna;
}

/**
 * FORMATEAR PRECIO COMO MONEDA CHILENA
 * 
 * Convierte un número en formato de moneda chilena.
 * Ejemplo: 29990 → "$29.990"
 */
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CL');
}

/**
 * CARGAR MÁS PRODUCTOS (PAGINACIÓN)
 * 
 * Esta función se ejecuta cuando el usuario hace clic en "Cargar más".
 * Aumenta la cantidad de productos mostrados y actualiza la vista.
 */
function cargarMasProductos() {
    // Aumentar la cantidad de productos a mostrar
    productosMostrados += 6;
    
    // Actualizar la vista con más productos
    mostrarProductos();
    
    // Actualizar el contador de resultados
    actualizarContador();
}

/**
 * ACTUALIZAR CONTADOR DE RESULTADOS
 * 
 * Actualiza el número que muestra cuántos productos se encontraron
 * después de aplicar los filtros.
 */
function actualizarContador() {
    const contador = document.getElementById('results-count');
    contador.textContent = productosFiltrados.length;
}

/**
 * LIMPIAR TODOS LOS FILTROS
 * 
 * Esta función resetea todos los filtros a su estado inicial
 * y muestra todos los productos nuevamente.
 */
function clearFilters() {
    // Limpiar el campo de búsqueda
    document.getElementById('search-input').value = '';
    
    // Resetear todos los dropdowns a su valor por defecto
    document.getElementById('category-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('pet-type-filter').value = '';
    
    // Resetear la paginación
    productosMostrados = 6;
    
    // Aplicar los filtros (que ahora están vacíos, así que muestra todos)
    filtrarProductos();
}

/**
 * AGREGAR PRODUCTO AL CARRITO
 * 
 * Esta función maneja el evento de agregar un producto al carrito.
 * Funcionalidad completa con localStorage y contador.
 */
function agregarAlCarrito(productoId) {
    // Buscar el producto por su ID
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        mostrarMensaje('Producto no encontrado', 'error');
        return;
    }
    
    // Obtener carrito actual
    let carritoItems = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carritoItems.find(item => item.id === productoId);
    
    if (itemExistente) {
        // Si ya existe, aumentar la cantidad
        itemExistente.cantidad += 1;
    } else {
        // Si no existe, agregarlo al carrito
        carritoItems.push({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion || 'Producto de calidad para tu mascota',
            precio: producto.precio,
            cantidad: 1,
            imagen: producto.imagen
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoItems));
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar mensaje de confirmación
    mostrarMensaje(`¡${producto.nombre} agregado al carrito!`, 'success');
}

/**
 * ACTUALIZAR CONTADOR DEL CARRITO
 * 
 * Actualiza el contador del carrito en la navbar.
 */
function actualizarContadorCarrito() {
    const carritoItems = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
    
    // Actualizar en todas las páginas
    const contadores = document.querySelectorAll('#cart-count, .badge.bg-secondary');
    contadores.forEach(contador => {
        contador.textContent = totalItems;
    });
}

/**
 * MOSTRAR MENSAJE TEMPORAL
 * 
 * Esta función muestra un mensaje temporal al usuario.
 * Es idéntica a la función del script principal.
 */
function mostrarMensaje(mensaje, tipo = 'info') {
    // Crear elemento div para el mensaje
    const mensajeElement = document.createElement('div');
    
    // Asignar clases de Bootstrap según el tipo
    mensajeElement.className = `alert alert-${tipo === 'success' ? 'success' : tipo === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    
    // Posicionar en la esquina superior derecha
    mensajeElement.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    
    // Crear el contenido HTML del mensaje
    mensajeElement.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Agregar el mensaje al body
    document.body.appendChild(mensajeElement);
    
    // Remover automáticamente después de 3 segundos
    setTimeout(() => {
        if (mensajeElement.parentNode) {
            mensajeElement.remove();
        }
    }, 3000);
}

