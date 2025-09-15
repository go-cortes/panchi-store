// Lógica principal de la tienda de mascotas
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosDestacados();
});

// Cargar productos destacados
function cargarProductosDestacados() {
    const listaProductos = document.getElementById('lista-productos');
    
    if (!listaProductos) {
        console.error('No se encontró el contenedor de productos');
        return;
    }
    
    listaProductos.innerHTML = '';
    
    productos.forEach(producto => {
        const tarjetaProducto = crearTarjetaProducto(producto);
        listaProductos.appendChild(tarjetaProducto);
    });
}

// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const columna = document.createElement('div');
    columna.className = 'col-lg-3 col-md-6 mb-4';
    
    const precioFormateado = formatearPrecio(producto.precio);
    
    const iconoTipo = producto.tipo === 'perro' ? 'bi-dog' : 
                     producto.tipo === 'gato' ? 'bi-cat' : 'bi-heart-pulse-fill';
    
    const colorTipo = producto.tipo === 'perro' ? '#8B4513' : 
                     producto.tipo === 'gato' ? '#A0522D' : '#CD853F';
    
    columna.innerHTML = `
        <div class="card h-100">
            <div class="position-relative">
                <img src="${producto.imagen}" 
                     class="card-img-top" 
                     alt="${producto.nombre}"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
                
                <div class="position-absolute top-0 end-0 m-2">
                    <span class="badge rounded-pill" style="background: ${colorTipo}; color: white;">
                        <i class="bi ${iconoTipo} me-1"></i>
                        ${producto.tipo.charAt(0).toUpperCase() + producto.tipo.slice(1)}
                    </span>
                </div>
                
                <div class="position-absolute top-0 start-0 m-2">
                    <span class="badge rounded-pill" style="background: #CD853F; color: white;">
                        <i class="bi bi-tag me-1"></i>
                        ${producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
                    </span>
                </div>
            </div>
            
            <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold" style="color: #8B4513;">${producto.nombre}</h5>
                <p class="card-text text-muted flex-grow-1">${producto.descripcion}</p>
                
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h4 mb-0" style="color: #8B4513; font-weight: 700;">${precioFormateado}</span>
                        <div class="d-flex">
                            <i class="bi bi-star-fill text-warning me-1"></i>
                            <i class="bi bi-star-fill text-warning me-1"></i>
                            <i class="bi bi-star-fill text-warning me-1"></i>
                            <i class="bi bi-star-fill text-warning me-1"></i>
                            <i class="bi bi-star-fill text-warning"></i>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-producto w-100" 
                            onclick="agregarAlCarrito(${producto.id})"
                            style="background: linear-gradient(45deg, #8B4513, #A0522D); border: none; color: white;">
                        <i class="bi bi-cart-plus me-2"></i>
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return columna;
}

// Formatear precio como moneda chilena
function formatearPrecio(precio) {
    return '$' + precio.toLocaleString('es-CL');
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
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

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carritoItems = JSON.parse(localStorage.getItem('carrito') || '[]');
    const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
    
    // Actualizar en todas las páginas
    const contadores = document.querySelectorAll('#cart-count, .badge.bg-secondary');
    contadores.forEach(contador => {
        contador.textContent = totalItems;
    });
}

// Inicializar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosDestacados();
    actualizarContadorCarrito();
});

// Mostrar mensaje temporal al usuario
function mostrarMensaje(mensaje, tipo = 'info') {
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `alert alert-${tipo === 'success' ? 'success' : tipo === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    mensajeElement.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    
    mensajeElement.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(mensajeElement);
    
    setTimeout(() => {
        if (mensajeElement.parentNode) {
            mensajeElement.remove();
        }
    }, 3000);
}