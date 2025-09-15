// Perfil de Usuario JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!authManager.isLoggedIn()) {
        // Si no está logueado, redirigir al login
        window.location.href = 'login-usuario.html';
        return;
    }

    // Cargar información del usuario
    cargarInformacionUsuario();
    cargarEstadisticas();
    cargarPedidosRecientes();
    cargarListaDeseos();
    actualizarContadorCarrito();
});

function cargarInformacionUsuario() {
    const usuario = authManager.getUserInfo();
    
    // Actualizar elementos del perfil
    document.getElementById('usuario-nombre').textContent = usuario.nombre;
    document.getElementById('usuario-correo').textContent = usuario.correo;
    document.getElementById('info-nombre').textContent = usuario.nombre;
    document.getElementById('info-correo').textContent = usuario.correo;
    
    // Información adicional del usuario (simulada)
    const infoAdicional = {
        telefono: '+569 1234 5678',
        fecha: '15 de Enero, 2024',
        direccion: 'Av. Principal 123, Santiago, Chile'
    };
    
    document.getElementById('info-telefono').textContent = infoAdicional.telefono;
    document.getElementById('info-fecha').textContent = infoAdicional.fecha;
    document.getElementById('info-direccion').textContent = infoAdicional.direccion;
}

function cargarEstadisticas() {
    // Obtener estadísticas del localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const totalPedidos = pedidos.length;
    const totalGastado = pedidos.reduce((sum, pedido) => sum + (pedido.total || 0), 0);
    
    // Actualizar elementos
    document.getElementById('total-pedidos').textContent = totalPedidos;
    document.getElementById('total-gastado').textContent = '$' + totalGastado.toLocaleString();
}

function cargarPedidosRecientes() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const container = document.getElementById('pedidos-recientes');
    
    if (pedidos.length === 0) {
        // Mostrar mensaje de no hay pedidos
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
                <h6 class="text-muted">No tienes pedidos recientes</h6>
                <p class="text-muted">¡Explora nuestros productos y haz tu primer pedido!</p>
                <a href="productos.html" class="btn btn-primary">Ver Productos</a>
            </div>
        `;
    } else {
        // Mostrar pedidos recientes (últimos 3)
        const pedidosRecientes = pedidos.slice(-3).reverse();
        let html = '';
        
        pedidosRecientes.forEach(pedido => {
            const fecha = new Date(pedido.fecha || Date.now()).toLocaleDateString('es-ES');
            const estado = pedido.estado || 'Pendiente';
            const estadoClass = {
                'Pendiente': 'warning',
                'Procesando': 'info',
                'Enviado': 'primary',
                'Entregado': 'success',
                'Cancelado': 'danger'
            }[estado] || 'secondary';
            
            html += `
                <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                    <div>
                        <h6 class="mb-1">Pedido #${pedido.id || 'N/A'}</h6>
                        <small class="text-muted">${fecha}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${estadoClass} mb-1">${estado}</span>
                        <div class="fw-bold">$${(pedido.total || 0).toLocaleString()}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
}

function cargarListaDeseos() {
    const listaDeseos = JSON.parse(localStorage.getItem('listaDeseos') || '[]');
    const container = document.getElementById('lista-deseos');
    const contador = document.getElementById('wishlist-count');
    
    contador.textContent = listaDeseos.length;
    
    if (listaDeseos.length === 0) {
        // Mostrar mensaje de lista vacía
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-heart fs-1 text-muted mb-3"></i>
                <h6 class="text-muted">Tu lista de deseos está vacía</h6>
                <p class="text-muted">¡Agrega productos que te gusten a tu lista de deseos!</p>
                <a href="productos.html" class="btn btn-outline-primary">Explorar Productos</a>
            </div>
        `;
    } else {
        // Mostrar productos en la lista de deseos
        let html = '';
        
        listaDeseos.forEach(producto => {
            html += `
                <div class="d-flex align-items-center border-bottom py-3">
                    <img src="${producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW48L3RleHQ+PC9zdmc+'}" 
                         alt="${producto.nombre}" 
                         class="rounded me-3" 
                         style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${producto.nombre}</h6>
                        <small class="text-muted">$${(producto.precio || 0).toLocaleString()}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="quitarDeListaDeseos(${producto.id})">
                            <i class="bi bi-heart-fill"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = carrito.length;
    }
}

function editarPerfil() {
    // Crear modal de edición de perfil
    const modalHtml = `
        <div class="modal fade" id="modalEditarPerfil" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Perfil</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formularioEditarPerfil">
                            <div class="mb-3">
                                <label for="editNombre" class="form-label">Nombre Completo</label>
                                <input type="text" class="form-control" id="editNombre" value="${authManager.getUserInfo().nombre}">
                            </div>
                            <div class="mb-3">
                                <label for="editCorreo" class="form-label">Correo Electrónico</label>
                                <input type="email" class="form-control" id="editCorreo" value="${authManager.getUserInfo().correo}">
                            </div>
                            <div class="mb-3">
                                <label for="editTelefono" class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="editTelefono" value="+569 1234 5678">
                            </div>
                            <div class="mb-3">
                                <label for="editDireccion" class="form-label">Dirección</label>
                                <textarea class="form-control" id="editDireccion" rows="2">Av. Principal 123, Santiago, Chile</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarPerfil()">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente
    const existingModal = document.getElementById('modalEditarPerfil');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('modalEditarPerfil'));
    modal.show();
}

function guardarPerfil() {
    const nombre = document.getElementById('editNombre').value;
    const correo = document.getElementById('editCorreo').value;
    const telefono = document.getElementById('editTelefono').value;
    const direccion = document.getElementById('editDireccion').value;
    
    if (!nombre || !correo) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }
    
    // Actualizar información en localStorage
    localStorage.setItem('usuarioNombre', nombre);
    localStorage.setItem('usuarioCorreo', correo);
    
    // Actualizar la información en la página
    cargarInformacionUsuario();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarPerfil'));
    modal.hide();
    
    // Mostrar mensaje de éxito
    authManager.mostrarMensaje('Perfil actualizado exitosamente', 'success');
}

function agregarAlCarrito(productoId) {
    // Obtener productos del localStorage
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar mensaje
    authManager.mostrarMensaje('Producto agregado al carrito', 'success');
}

function quitarDeListaDeseos(productoId) {
    let listaDeseos = JSON.parse(localStorage.getItem('listaDeseos') || '[]');
    listaDeseos = listaDeseos.filter(item => item.id !== productoId);
    localStorage.setItem('listaDeseos', JSON.stringify(listaDeseos));
    
    // Recargar lista de deseos
    cargarListaDeseos();
    
    // Mostrar mensaje
    authManager.mostrarMensaje('Producto removido de la lista de deseos', 'info');
}
