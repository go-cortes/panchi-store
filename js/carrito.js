// Carrito de compras - Panchi Store

let carritoItems = [];
let descuento = 0;
let cuponAplicado = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    mostrarCarrito();
    configurarEventos();
    actualizarContadorCarrito();
});

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carritoItems = JSON.parse(carritoGuardado);
    } else {
        // Datos de ejemplo si no hay carrito guardado
        carritoItems = [
            {
                id: 1,
                nombre: "Producto #1",
                descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipisicing elit",
                precio: 8000,
                cantidad: 1,
                imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop&crop=center"
            },
            {
                id: 2,
                nombre: "Producto #2", 
                descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipisicing elit",
                precio: 6000,
                cantidad: 1,
                imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop&crop=center"
            },
            {
                id: 3,
                nombre: "Producto #3",
                descripcion: "Pink lorem ipsum dolor sit amet, consectetur adipisicing elit", 
                precio: 10000,
                cantidad: 1,
                imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop&crop=center"
            }
        ];
        guardarCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carritoItems));
}

// Mostrar los items del carrito
function mostrarCarrito() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    if (carritoItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
                <h4 class="text-muted">Tu carrito está vacío</h4>
                <p class="text-muted">¡Agrega algunos productos para comenzar tu compra!</p>
                <a href="productos.html" class="btn btn-primary">
                    <i class="bi bi-arrow-right"></i> Ver Productos
                </a>
            </div>
        `;
        document.getElementById('cart-total').textContent = '$ 0';
        return;
    }

    let html = '';
    let subtotal = 0;

    carritoItems.forEach(item => {
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;

        html += `
            <div class="row mb-3 p-3 border rounded">
                <div class="col-2">
                    <img src="${item.imagen}" 
                         class="img-fluid rounded" 
                         alt="${item.nombre}"
                         style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <div class="col-6">
                    <h6 class="mb-1">${item.nombre}</h6>
                    <p class="text-muted small mb-0">${item.descripcion}</p>
                </div>
                <div class="col-2">
                    <span class="fw-bold">$ ${item.precio.toLocaleString()}</span>
                </div>
                <div class="col-2">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <input type="number" class="form-control text-center" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${item.id}, this.value)">
                        <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-sm btn-outline-danger mt-1" onclick="eliminarItem(${item.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Calcular total con descuento
    const totalConDescuento = subtotal - descuento;
    document.getElementById('cart-total').textContent = `$ ${totalConDescuento.toLocaleString()}`;
}

// Configurar eventos
function configurarEventos() {
    // Aplicar cupón
    document.getElementById('apply-coupon').addEventListener('click', function() {
        const codigo = document.getElementById('coupon-code').value.trim().toUpperCase();
        
        if (!codigo) {
            alert('Por favor ingresa un código de cupón');
            return;
        }

        // Códigos de descuento válidos
        const cupones = {
            'DESCUENTO10': 0.10,
            'DESCUENTO20': 0.20,
            'DESCUENTO50': 0.50,
            'BIENVENIDO': 0.15
        };

        if (cupones[codigo]) {
            const subtotal = carritoItems.reduce((total, item) => total + (item.precio * item.cantidad), 0);
            descuento = Math.round(subtotal * cupones[codigo]);
            cuponAplicado = true;
            
            mostrarCarrito();
            alert(`¡Cupón aplicado! Descuento: $${descuento.toLocaleString()}`);
            
            // Deshabilitar el botón y campo
            document.getElementById('apply-coupon').disabled = true;
            document.getElementById('coupon-code').disabled = true;
        } else {
            alert('Código de cupón no válido');
        }
    });

    // Proceder al pago
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (carritoItems.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const total = carritoItems.reduce((total, item) => total + (item.precio * item.cantidad), 0) - descuento;
        
        // Simular proceso de pago
        if (confirm(`¿Proceder al pago por un total de $${total.toLocaleString()}?`)) {
            // Limpiar carrito después del pago
            carritoItems = [];
            descuento = 0;
            cuponAplicado = false;
            guardarCarrito();
            mostrarCarrito();
            actualizarContadorCarrito();
            
            alert('¡Pago procesado exitosamente! Gracias por tu compra.');
            
            // Redirigir a productos
            setTimeout(() => {
                window.location.href = 'productos.html';
            }, 2000);
        }
    });
}

// Cambiar cantidad de un item
function cambiarCantidad(itemId, cambio) {
    const item = carritoItems.find(i => i.id === itemId);
    if (item) {
        item.cantidad = Math.max(1, item.cantidad + cambio);
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// Actualizar cantidad desde el input
function actualizarCantidad(itemId, nuevaCantidad) {
    const item = carritoItems.find(i => i.id === itemId);
    if (item) {
        item.cantidad = Math.max(1, parseInt(nuevaCantidad));
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// Eliminar item del carrito
function eliminarItem(itemId) {
    if (confirm('¿Eliminar este producto del carrito?')) {
        carritoItems = carritoItems.filter(item => item.id !== itemId);
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// Actualizar contador del carrito en la navbar
function actualizarContadorCarrito() {
    const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
    
    // Actualizar en todas las páginas
    const contadores = document.querySelectorAll('#cart-count, .badge.bg-secondary');
    contadores.forEach(contador => {
        contador.textContent = totalItems;
    });
}

// Función para agregar producto al carrito (desde otras páginas)
function agregarAlCarrito(productoId) {
    // Buscar el producto en la lista de productos disponibles
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
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
    guardarCarrito();
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar mensaje de confirmación
    alert(`¡${producto.nombre} agregado al carrito!`);
}
