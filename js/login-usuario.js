// Login de Usuario JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const formularioLogin = document.getElementById('formularioLogin');
    
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            iniciarSesion();
        });
    }
});

// Credenciales genéricas para usuarios
const credencialesUsuarios = [
    { correo: 'usuario@panchistore.cl', contrasena: 'usuario123', nombre: 'Usuario Demo' },
    { correo: 'cliente@panchistore.cl', contrasena: 'cliente123', nombre: 'Cliente Demo' },
    { correo: 'test@panchistore.cl', contrasena: 'test123', nombre: 'Usuario Test' },
    { correo: 'demo@panchistore.cl', contrasena: 'demo123', nombre: 'Usuario Demo' }
];

function iniciarSesion() {
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    
    // Validar campos
    if (!correo || !contrasena) {
        mostrarAlerta('Por favor, completa todos los campos.', 'warning');
        return;
    }
    
    // Buscar usuario en las credenciales
    const usuario = credencialesUsuarios.find(u => 
        u.correo === correo && u.contrasena === contrasena
    );
    
    if (usuario) {
        // Login exitoso
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('usuarioNombre', usuario.nombre);
        localStorage.setItem('usuarioCorreo', usuario.correo);
        
        mostrarAlerta(`¡Bienvenido ${usuario.nombre}!`, 'success');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } else {
        // Login fallido
        mostrarAlerta('Credenciales incorrectas. Usa: usuario@panchistore.cl / usuario123', 'danger');
    }
}

function mostrarAlerta(mensaje, tipo) {
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Crear nueva alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insertar alerta después del formulario
    const formulario = document.getElementById('formularioLogin');
    formulario.parentNode.insertBefore(alerta, formulario.nextSibling);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

// Función para mostrar credenciales de prueba
function mostrarCredenciales() {
    const credenciales = credencialesUsuarios.map(u => 
        `<strong>Email:</strong> ${u.correo}<br><strong>Contraseña:</strong> ${u.contrasena}`
    ).join('<br><br>');
    
    const modalHtml = `
        <div class="modal fade" id="modalCredenciales" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Credenciales de Prueba</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Puedes usar cualquiera de estas credenciales para iniciar sesión:</p>
                        <div class="alert alert-info">
                            ${credenciales}
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
    const existingModal = document.getElementById('modalCredenciales');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('modalCredenciales'));
    modal.show();
}
