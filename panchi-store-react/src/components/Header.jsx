import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'

function Header() {
  const navigate = useNavigate()
  const { user, token, restore, logout } = useAuthStore()
  const { items, fetch } = useCartStore()
  const { list: favoritesList, fetch: fetchFavorites } = useFavoritesStore()

  useEffect(() => {
    // Cargar contadores desde el inicio, con o sin sesión (usa fallbacks)
    restore()
    fetch().catch(() => {})
    fetchFavorites().catch(() => {})
  }, [])

  useEffect(() => {
    // Si hay sesión, sincroniza con servidor
    // IMPORTANTE: Limpiar carrito local cuando cambia el token/usuario
    // para asegurar que cada usuario vea solo su carrito
    if (token) {
      // Limpiar carrito local antes de cargar el del servidor
      // Esto asegura que no se mezclen carritos de diferentes usuarios
      const currentUser = user?.id
      const lastUserId = localStorage.getItem('last_cart_user_id')
      
      if (lastUserId && lastUserId !== String(currentUser)) {
        // El usuario cambió, limpiar carrito local
        console.log('[Header] Usuario cambió, limpiando carrito local')
        localStorage.removeItem('local_cart')
        useCartStore.setState({ items: [], subtotal: 0 })
      }
      
      // Guardar el ID del usuario actual
      if (currentUser) {
        localStorage.setItem('last_cart_user_id', String(currentUser))
      }
      
      fetch().catch(() => {})
      fetchFavorites().catch(() => {})
    } else {
      // Si no hay token, limpiar también
      localStorage.removeItem('last_cart_user_id')
    }
  }, [token, user?.id])

  function handleLogout() {
    // Limpiar todo el estado antes de hacer logout
    try {
      // Limpiar carrito local
      localStorage.removeItem('local_cart')
      localStorage.removeItem('last_cart_user_id')
      
      // Limpiar favoritos local
      localStorage.removeItem('local_favorites')
      
      // Limpiar estado de stores (resetear a valores iniciales)
      useCartStore.setState({ items: [], subtotal: 0 })
      useFavoritesStore.setState({ list: [] })
      
      console.log('[Header] Estado limpiado en logout')
    } catch (e) {
      console.error('Error limpiando estado en logout:', e)
    }
    
    // Limpiar auth
    logout()
    
    // Redirigir a login
    navigate('/login-usuario', { replace: true })
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-3 text-decoration-none" to="/">
          {/* Círculo del Logo con Huella de Pata Real */}
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle shadow-sm position-relative"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#8B4513',
              border: '3px solid #fff',
              flexShrink: 0,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* SVG de Huella de Pata Real - Diseño Preciso */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                fill: '#FFFFFF'
              }}
            >
              {/* Almohadilla principal grande (abajo, forma de corazón/óvalo) */}
              <ellipse cx="10" cy="15" rx="4.5" ry="5" fill="white"/>
              
              {/* Dedo superior izquierdo */}
              <ellipse cx="5" cy="6" rx="2.2" ry="3.5" fill="white"/>
              
              {/* Dedo superior derecho */}
              <ellipse cx="15" cy="6" rx="2.2" ry="3.5" fill="white"/>
              
              {/* Dedo medio izquierdo */}
              <ellipse cx="7.5" cy="5" rx="1.8" ry="3" fill="white"/>
              
              {/* Dedo medio derecho */}
              <ellipse cx="12.5" cy="5" rx="1.8" ry="3" fill="white"/>
            </svg>
          </div>

          {/* Texto del Logo - Tipografía moderna */}
          <div className="d-flex flex-column">
            <span 
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '1.8rem',
                color: '#FFFFFF',
                lineHeight: '1',
                letterSpacing: '1px',
                fontWeight: '600'
              }}
            >
              Panchi
            </span>
            <span 
              className="text-uppercase fw-bold" 
              style={{ 
                fontSize: '0.75rem', 
                letterSpacing: '2px',
                color: 'rgba(255, 255, 255, 0.85)'
              }}
            >
              Store
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/blogs">
                Blog
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">
                Contacto
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/registro">
                Registrarse
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                <i className="bi bi-cart-fill me-1"></i>
                Carrito
                <span className="badge bg-secondary ms-1">
                  {items?.reduce((sum, item) => sum + item.qty, 0) || 0}
                </span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favoritos">
                <i className="bi bi-heart-fill me-1"></i>
                Favoritos
                <span className="badge bg-danger ms-1">{favoritesList?.length || 0}</span>
              </NavLink>
            </li>

            {user?.role === 'admin' && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-gear-fill me-1"></i>
                  Admin
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/admin/productos">Productos</Link></li>
                  <li><Link className="dropdown-item" to="/admin/productos/nuevo">Crear producto</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/admin/usuarios">Usuarios</Link></li>
                  <li><Link className="dropdown-item" to="/admin/ordenes">Órdenes</Link></li>
                </ul>
              </li>
            )}

            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/mis-pedidos">
                    <i className="bi bi-bag-check me-2"></i>
                    Mis pedidos
                  </Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login-usuario">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Ingresar
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header