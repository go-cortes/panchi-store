// Admin Panel JavaScript
let usuarios = [];
let productos = [];
let ordenes = [];
let empleados = [];
let paginaActual = 1;
let totalPaginas = 1;
let seccionActual = 'customers';

// Verificar login
if (localStorage.getItem('adminLogueado') !== 'true') {
    window.location.href = 'login.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    mostrarUsuarios();
    cargarOrdenes();
    cargarEmpleados();
    actualizarSidebar();
});

// Cargar datos desde localStorage
function cargarDatos() {
    // Cargar usuarios
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuariosGuardados.length === 0) {
        usuarios = [
            { id: 1, nombre: 'María González', correo: 'maria@email.com', telefono: '+56912345678', region: 'metropolitana', comuna: 'santiago', fechaRegistro: '2024-01-15', status: 'Activo' },
            { id: 2, nombre: 'Carlos Rodríguez', correo: 'carlos@email.com', telefono: '+56987654321', region: 'valparaiso', comuna: 'valparaiso', fechaRegistro: '2024-01-20', status: 'Activo' },
            { id: 3, nombre: 'Ana Martínez', correo: 'ana@email.com', telefono: '+56911223344', region: 'metropolitana', comuna: 'lascondes', fechaRegistro: '2024-02-01', status: 'Inactivo' },
            { id: 4, nombre: 'Luis Pérez', correo: 'luis@email.com', telefono: '+56955667788', region: 'araucania', comuna: 'temuco', fechaRegistro: '2024-02-10', status: 'Activo' },
            { id: 5, nombre: 'Carmen Silva', correo: 'carmen@email.com', telefono: '+56999887766', region: 'nuble', comuna: 'chillan', fechaRegistro: '2024-02-15', status: 'Activo' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } else {
        usuarios = usuariosGuardados;
    }

    // Cargar productos
    const productosGuardados = JSON.parse(localStorage.getItem('productosAdmin') || '[]');
    if (productosGuardados.length === 0) {
        productos = [
            { id: 1, nombre: 'Alimento Premium para Perros', precio: 29990, categoria: 'alimento', stock: 50, descripcion: 'Alimento balanceado con proteínas de alta calidad' },
            { id: 2, nombre: 'Juguete Interactivo para Gatos', precio: 15990, categoria: 'juguete', stock: 30, descripcion: 'Juguete con plumas y sonidos' },
            { id: 3, nombre: 'Cama Ortopédica para Mascotas', precio: 45990, categoria: 'accesorio', stock: 25, descripcion: 'Cama ergonómica con memoria' },
            { id: 4, nombre: 'Kit de Higiene Completo', precio: 22990, categoria: 'higiene', stock: 40, descripcion: 'Incluye champú, cepillo y peine' },
            { id: 5, nombre: 'Snacks Naturales para Perros', precio: 12990, categoria: 'alimento', stock: 60, descripcion: 'Snacks saludables hechos con ingredientes naturales' }
        ];
        localStorage.setItem('productosAdmin', JSON.stringify(productos));
    } else {
        productos = productosGuardados;
    }
}

// Mostrar usuarios en la tabla
function mostrarUsuarios() {
    const tbody = document.getElementById('usuariosTableBody');
    if (!tbody) return;

    let html = '';
    usuarios.forEach(usuario => {
        const statusClass = usuario.status === 'Activo' ? 'success' : 'danger';
        
        html += `
            <tr>
                <td>${usuario.fechaRegistro}</td>
                <td>USR${usuario.id.toString().padStart(4, '0')}</td>
                <td>${usuario.nombre}</td>
                <td><span class="badge bg-${statusClass}">${usuario.status}</span></td>
                <td>${usuario.correo}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarUsuario(${usuario.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${usuario.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Mostrar productos en la tabla
function mostrarProductos() {
    const tbody = document.getElementById('productosTableBody');
    if (!tbody) return;

    let html = '';
    productos.forEach(producto => {
        const stockClass = producto.stock > 20 ? 'success' : producto.stock > 10 ? 'warning' : 'danger';
        
        html += `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toLocaleString()}</td>
                <td><span class="badge bg-${stockClass}">${producto.stock}</span></td>
                <td>${producto.categoria}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProducto(${producto.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${producto.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Mostrar formulario de usuario
function mostrarFormularioUsuario() {
    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    document.getElementById('formularioUsuario').reset();
    modal.show();
}

// Guardar usuario
function guardarUsuario() {
    const nombre = document.getElementById('nombreCompleto').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const telefono = document.getElementById('telefono').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    if (!nombre || !correo || !contrasena) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Verificar si el correo ya existe
    const usuarioExistente = usuarios.find(u => u.correo === correo);
    if (usuarioExistente) {
        alert('Ya existe un usuario con este correo electrónico');
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        telefono: telefono,
        region: region,
        comuna: comuna,
        fechaRegistro: new Date().toISOString().split('T')[0],
        status: 'Activo'
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Cerrar modal y actualizar tabla
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalUsuario'));
    modal.hide();
    mostrarUsuarios();
    
    // Limpiar formulario
    document.getElementById('formularioUsuario').reset();
    
    alert('Usuario registrado exitosamente');
}

// Editar usuario
function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        // Llenar formulario con datos del usuario
        document.getElementById('nombreCompleto').value = usuario.nombre;
        document.getElementById('correo').value = usuario.correo;
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('region').value = usuario.region || '';
        document.getElementById('comuna').value = usuario.comuna || '';
        
        // Guardar el ID para actualización
        document.getElementById('formularioUsuario').setAttribute('data-usuario-id', id);
        
        mostrarFormularioUsuario();
    }
}

// Eliminar usuario
function eliminarUsuario(id) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        usuarios = usuarios.filter(u => u.id !== id);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        mostrarUsuarios();
        alert('Usuario eliminado exitosamente');
    }
}

// Mostrar formulario de producto
function mostrarFormularioProducto() {
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    document.getElementById('formularioProducto').reset();
    modal.show();
}

// Guardar producto
function guardarProducto() {
    const nombre = document.getElementById('nombreProducto').value;
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const categoria = document.getElementById('categoriaProducto').value;
    const stock = parseInt(document.getElementById('stockProducto').value);
    const descripcion = document.getElementById('descripcionProducto').value;

    if (!nombre || !precio || !categoria || !stock) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        stock: stock,
        descripcion: descripcion
    };

    productos.push(nuevoProducto);
    localStorage.setItem('productosAdmin', JSON.stringify(productos));
    
    // Cerrar modal y actualizar tabla
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
    modal.hide();
    mostrarProductos();
    
    // Limpiar formulario
    document.getElementById('formularioProducto').reset();
    
    alert('Producto agregado exitosamente');
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('nombreProducto').value = producto.nombre;
        document.getElementById('precioProducto').value = producto.precio;
        document.getElementById('categoriaProducto').value = producto.categoria;
        document.getElementById('stockProducto').value = producto.stock;
        document.getElementById('descripcionProducto').value = producto.descripcion;
        
        document.getElementById('formularioProducto').setAttribute('data-producto-id', id);
        
        mostrarFormularioProducto();
    }
}

// Eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productosAdmin', JSON.stringify(productos));
        mostrarProductos();
        alert('Producto eliminado exitosamente');
    }
}

// Cambiar sección
function mostrarSeccion(seccion) {
    seccionActual = seccion;
    
    // Cambiar el enlace activo
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion-contenido').forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const seccionElement = document.getElementById(seccion + 'Section');
    if (seccionElement) {
        seccionElement.style.display = 'block';
    }
    
    // Cargar datos específicos de la sección
    switch(seccion) {
        case 'customers':
            mostrarUsuarios();
            break;
        case 'inventory':
            mostrarProductos();
            break;
        case 'dashboard':
            mostrarDashboard();
            break;
    }
}

// Mostrar dashboard
function mostrarDashboard() {
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) {
        const totalUsuarios = usuarios.length;
        const totalProductos = productos.length;
        const usuariosActivos = usuarios.filter(u => u.status === 'Activo').length;
        const stockBajo = productos.filter(p => p.stock < 10).length;
        
        dashboardSection.innerHTML = `
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="card text-white" style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${totalUsuarios}</h4>
                                    <p class="card-text">Total Usuarios</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="bi bi-people fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white" style="background: linear-gradient(135deg, #A0522D 0%, #CD853F 100%);">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${usuariosActivos}</h4>
                                    <p class="card-text">Usuarios Activos</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="bi bi-person-check fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white" style="background: linear-gradient(135deg, #CD853F 0%, #D2691E 100%);">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${totalProductos}</h4>
                                    <p class="card-text">Total Productos</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="bi bi-box fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white" style="background: linear-gradient(135deg, #D2691E 0%, #FF8C00 100%);">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h4 class="card-title">${stockBajo}</h4>
                                    <p class="card-text">Stock Bajo</p>
                                </div>
                                <div class="align-self-center">
                                    <i class="bi bi-exclamation-triangle fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Actualizar sidebar
function actualizarSidebar() {
    // Agregar clases CSS para el logo
    const style = document.createElement('style');
    style.textContent = `
        .logo-container {
            display: inline-block;
            width: 40px;
            height: 40px;
            position: relative;
        }
        .logo-circle {
            width: 40px;
            height: 40px;
            background: #8B4513;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .logo-square {
            width: 22px;
            height: 22px;
            background: #CD853F;
            border-radius: 3px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
        .logo-dot {
            width: 4px;
            height: 4px;
            background: #2F1B14;
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);
}

// ===== FUNCIONES DE ÓRDENES =====
function cargarOrdenes() {
    const ordenesGuardadas = JSON.parse(localStorage.getItem('ordenes') || '[]');
    if (ordenesGuardadas.length === 0) {
        ordenes = [
            { id: 1, cliente: 'María González', fecha: '2024-01-15', estado: 'entregado', total: 45990, productos: ['Cama Ortopédica', 'Kit de Higiene'] },
            { id: 2, cliente: 'Carlos Rodríguez', fecha: '2024-01-16', estado: 'enviado', total: 29990, productos: ['Alimento Premium'] },
            { id: 3, cliente: 'Ana Martínez', fecha: '2024-01-17', estado: 'procesando', total: 15990, productos: ['Juguete Interactivo'] },
            { id: 4, cliente: 'Luis Pérez', fecha: '2024-01-18', estado: 'pendiente', total: 22990, productos: ['Kit de Higiene'] },
            { id: 5, cliente: 'Carmen Silva', fecha: '2024-01-19', estado: 'cancelado', total: 12990, productos: ['Snacks Naturales'] }
        ];
        localStorage.setItem('ordenes', JSON.stringify(ordenes));
    } else {
        ordenes = ordenesGuardadas;
    }
    mostrarOrdenes();
}

function mostrarOrdenes() {
    const tbody = document.getElementById('ordenesTableBody');
    if (!tbody) return;

    let html = '';
    ordenes.forEach(orden => {
        const estadoClass = {
            'pendiente': 'warning',
            'procesando': 'info',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'danger'
        }[orden.estado] || 'secondary';

        html += `
            <tr>
                <td>#ORD${orden.id.toString().padStart(4, '0')}</td>
                <td>${orden.cliente}</td>
                <td>${new Date(orden.fecha).toLocaleDateString('es-ES')}</td>
                <td><span class="badge bg-${estadoClass}">${orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</span></td>
                <td>$${orden.total.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetalleOrden(${orden.id})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="actualizarEstadoOrden(${orden.id})">
                        <i class="bi bi-check"></i> Actualizar
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function verDetalleOrden(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    const modalHtml = `
        <div class="modal fade" id="modalDetalleOrden" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalle de Orden #ORD${orden.id.toString().padStart(4, '0')}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Información del Cliente</h6>
                                <p><strong>Nombre:</strong> ${orden.cliente}</p>
                                <p><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleDateString('es-ES')}</p>
                                <p><strong>Estado:</strong> <span class="badge bg-${orden.estado === 'entregado' ? 'success' : 'warning'}">${orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</span></p>
                            </div>
                            <div class="col-md-6">
                                <h6>Productos</h6>
                                <ul>
                                    ${orden.productos.map(producto => `<li>${producto}</li>`).join('')}
                                </ul>
                                <h6>Total: $${orden.total.toLocaleString()}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remover modal existente
    const existingModal = document.getElementById('modalDetalleOrden');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('modalDetalleOrden'));
    modal.show();
}

function actualizarEstadoOrden(ordenId) {
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return;

    const estados = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    const estadoActual = estados.indexOf(orden.estado);
    const nuevoEstado = estados[estadoActual + 1] || estados[0];

    orden.estado = nuevoEstado;
    localStorage.setItem('ordenes', JSON.stringify(ordenes));
    mostrarOrdenes();
    alert(`Estado de la orden #ORD${orden.id.toString().padStart(4, '0')} actualizado a: ${nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1)}`);
}

function aplicarFiltrosOrdenes() {
    const estado = document.getElementById('filtroEstadoOrdenes').value;
    const fecha = document.getElementById('filtroFechaOrdenes').value;
    const busqueda = document.getElementById('buscarOrdenes').value.toLowerCase();

    let ordenesFiltradas = ordenes;

    if (estado) {
        ordenesFiltradas = ordenesFiltradas.filter(o => o.estado === estado);
    }

    if (fecha) {
        ordenesFiltradas = ordenesFiltradas.filter(o => o.fecha === fecha);
    }

    if (busqueda) {
        ordenesFiltradas = ordenesFiltradas.filter(o => 
            o.cliente.toLowerCase().includes(busqueda) || 
            o.id.toString().includes(busqueda)
        );
    }

    mostrarOrdenesFiltradas(ordenesFiltradas);
}

function mostrarOrdenesFiltradas(ordenesFiltradas) {
    const tbody = document.getElementById('ordenesTableBody');
    if (!tbody) return;

    let html = '';
    ordenesFiltradas.forEach(orden => {
        const estadoClass = {
            'pendiente': 'warning',
            'procesando': 'info',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'danger'
        }[orden.estado] || 'secondary';

        html += `
            <tr>
                <td>#ORD${orden.id.toString().padStart(4, '0')}</td>
                <td>${orden.cliente}</td>
                <td>${new Date(orden.fecha).toLocaleDateString('es-ES')}</td>
                <td><span class="badge bg-${estadoClass}">${orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}</span></td>
                <td>$${orden.total.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetalleOrden(${orden.id})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="actualizarEstadoOrden(${orden.id})">
                        <i class="bi bi-check"></i> Actualizar
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ===== FUNCIONES DE REPORTES =====
function generarReporte(tipo = null) {
    const tipoReporte = tipo || document.getElementById('tipoReporte').value;
    const fechaInicio = document.getElementById('fechaInicioReporte').value;
    const fechaFin = document.getElementById('fechaFinReporte').value;

    let contenido = '';

    switch(tipoReporte) {
        case 'ventas':
            contenido = generarReporteVentas(fechaInicio, fechaFin);
            break;
        case 'productos':
            contenido = generarReporteProductos();
            break;
        case 'usuarios':
            contenido = generarReporteUsuarios();
            break;
        case 'inventario':
            contenido = generarReporteInventario();
            break;
        default:
            contenido = '<div class="alert alert-warning">Selecciona un tipo de reporte</div>';
    }

    document.getElementById('contenidoReporte').innerHTML = contenido;
}

function generarReporteVentas(fechaInicio, fechaFin) {
    const totalVentas = ordenes.reduce((sum, orden) => sum + orden.total, 0);
    const totalOrdenes = ordenes.length;
    const ordenesEntregadas = ordenes.filter(o => o.estado === 'entregado').length;

    return `
        <div class="row">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Total Ventas</h5>
                        <h3 class="text-success">$${totalVentas.toLocaleString()}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Total Órdenes</h5>
                        <h3 class="text-primary">${totalOrdenes}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Entregadas</h5>
                        <h3 class="text-success">${ordenesEntregadas}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Promedio por Orden</h5>
                        <h3 class="text-info">$${Math.round(totalVentas / totalOrdenes).toLocaleString()}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generarReporteProductos() {
    const productosMasVendidos = productos.sort((a, b) => b.stock - a.stock).slice(0, 5);
    
    return `
        <div class="card">
            <div class="card-header">
                <h5>Productos con Mayor Stock</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosMasVendidos.map(producto => `
                                <tr>
                                    <td>${producto.nombre}</td>
                                    <td>$${producto.precio.toLocaleString()}</td>
                                    <td><span class="badge bg-${producto.stock > 20 ? 'success' : producto.stock > 10 ? 'warning' : 'danger'}">${producto.stock}</span></td>
                                    <td>${producto.categoria}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function generarReporteUsuarios() {
    const usuariosActivos = usuarios.filter(u => u.status === 'Activo').length;
    const usuariosInactivos = usuarios.filter(u => u.status === 'Inactivo').length;
    
    return `
        <div class="row">
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Usuarios Activos</h5>
                        <h3 class="text-success">${usuariosActivos}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Usuarios Inactivos</h5>
                        <h3 class="text-warning">${usuariosInactivos}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generarReporteInventario() {
    const stockBajo = productos.filter(p => p.stock < 10).length;
    const stockAlto = productos.filter(p => p.stock > 20).length;
    const totalProductos = productos.length;
    
    return `
        <div class="row">
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Total Productos</h5>
                        <h3 class="text-primary">${totalProductos}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Stock Bajo</h5>
                        <h3 class="text-danger">${stockBajo}</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Stock Alto</h5>
                        <h3 class="text-success">${stockAlto}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== FUNCIONES DE EMPLEADOS =====
function cargarEmpleados() {
    const empleadosGuardados = JSON.parse(localStorage.getItem('empleados') || '[]');
    if (empleadosGuardados.length === 0) {
        empleados = [
            { id: 1, nombre: 'María González', cargo: 'CEO', email: 'maria@panchistore.cl', telefono: '+56912345678', estado: 'activo' },
            { id: 2, nombre: 'Carlos Rodríguez', cargo: 'Especialista en Productos', email: 'carlos@panchistore.cl', telefono: '+56987654321', estado: 'activo' },
            { id: 3, nombre: 'Ana Martínez', cargo: 'Especialista en Comunicación', email: 'ana@panchistore.cl', telefono: '+56911223344', estado: 'activo' }
        ];
        localStorage.setItem('empleados', JSON.stringify(empleados));
    } else {
        empleados = empleadosGuardados;
    }
    mostrarEmpleados();
}

function mostrarEmpleados() {
    const tbody = document.getElementById('empleadosTableBody');
    if (!tbody) return;

    let html = '';
    empleados.forEach(empleado => {
        const estadoClass = empleado.estado === 'activo' ? 'success' : 'danger';
        
        html += `
            <tr>
                <td>${empleado.nombre}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.email}</td>
                <td>${empleado.telefono}</td>
                <td><span class="badge bg-${estadoClass}">${empleado.estado.charAt(0).toUpperCase() + empleado.estado.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarEmpleado(${empleado.id})">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarEmpleado(${empleado.id})">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function mostrarFormularioEmpleado() {
    alert('Funcionalidad de empleados en desarrollo');
}

function editarEmpleado(id) {
    alert(`Editar empleado ${id} - Funcionalidad en desarrollo`);
}

function eliminarEmpleado(id) {
    if (confirm('¿Eliminar este empleado?')) {
        empleados = empleados.filter(e => e.id !== id);
        localStorage.setItem('empleados', JSON.stringify(empleados));
        mostrarEmpleados();
        alert('Empleado eliminado exitosamente');
    }
}

// Navegación
function irInicio() {
    window.location.href = '../index.html';
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('adminLogueado');
        window.location.href = 'login.html';
    }
}
