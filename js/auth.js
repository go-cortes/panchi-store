// Sistema de Autenticación de Usuarios
class AuthManager {
    constructor() {
        this.usuarioLogueado = localStorage.getItem('usuarioLogueado') === 'true';
        this.usuarioNombre = localStorage.getItem('usuarioNombre') || '';
        this.usuarioCorreo = localStorage.getItem('usuarioCorreo') || '';
    }

    // Verificar si el usuario está logueado
    isLoggedIn() {
        return this.usuarioLogueado;
    }

    // Obtener información del usuario
    getUserInfo() {
        return {
            nombre: this.usuarioNombre,
            correo: this.usuarioCorreo,
            logueado: this.usuarioLogueado
        };
    }

    // Cerrar sesión
    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('usuarioLogueado');
            localStorage.removeItem('usuarioNombre');
            localStorage.removeItem('usuarioCorreo');
            
            this.usuarioLogueado = false;
            this.usuarioNombre = '';
            this.usuarioCorreo = '';
            
            // Mostrar mensaje de confirmación
            this.mostrarMensaje('Sesión cerrada exitosamente', 'success');
            
            // Redirigir al inicio después de 1 segundo
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    }

    // Mostrar mensaje
    mostrarMensaje(mensaje, tipo) {
        // Remover mensajes existentes
        const mensajesExistentes = document.querySelectorAll('.alert-auth');
        mensajesExistentes.forEach(mensaje => mensaje.remove());
        
        // Crear nuevo mensaje
        const mensajeElement = document.createElement('div');
        mensajeElement.className = `alert alert-${tipo} alert-dismissible fade show alert-auth position-fixed`;
        mensajeElement.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        mensajeElement.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Agregar al body
        document.body.appendChild(mensajeElement);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                mensajeElement.remove();
            }
        }, 4000);
    }

    // Actualizar navbar con estado de login
    actualizarNavbar() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        // Buscar el elemento de login/logout existente
        let loginElement = document.querySelector('.nav-item-login');
        
        if (this.isLoggedIn()) {
            // Usuario logueado - mostrar opciones de usuario
            if (!loginElement) {
                loginElement = document.createElement('li');
                loginElement.className = 'nav-item dropdown nav-item-login';
                navbar.appendChild(loginElement);
            }
            
            loginElement.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>
                    ${this.usuarioNombre}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="pages/perfil.html">
                        <i class="bi bi-person me-2"></i>Mi Perfil
                    </a></li>
                    <li><a class="dropdown-item" href="pages/carrito.html">
                        <i class="bi bi-cart me-2"></i>Mi Carrito
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="authManager.logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </a></li>
                </ul>
            `;
        } else {
            // Usuario no logueado - mostrar opciones de login
            if (!loginElement) {
                loginElement = document.createElement('li');
                loginElement.className = 'nav-item nav-item-login';
                navbar.appendChild(loginElement);
            }
            
            loginElement.innerHTML = `
                <a class="nav-link" href="pages/login-usuario.html">
                    <i class="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                </a>
            `;
        }
    }

    // Inicializar el sistema de autenticación
    init() {
        // Actualizar navbar en todas las páginas
        this.actualizarNavbar();
        
        // Agregar listener para cambios en localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'usuarioLogueado') {
                this.usuarioLogueado = e.newValue === 'true';
                this.actualizarNavbar();
            }
        });
    }
}

// Crear instancia global
const authManager = new AuthManager();

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    authManager.init();
});

// Función global para cerrar sesión (para usar en onclick)
function cerrarSesionUsuario() {
    authManager.logout();
}
