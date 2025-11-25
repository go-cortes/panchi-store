import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { apiUpload } from '../api/api'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatearFecha(fecha) {
  if (!fecha) return '-'
  try {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return fecha
  }
}

function MisPedidos() {
  const { user } = useAuthStore()
  const { items: cartItems, subtotal: cartSubtotal } = useCartStore()
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function cargarMisPedidos() {
    if (!user) {
      setError('Debes iniciar sesión para ver tus pedidos')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[MisPedidos] base:', api.defaults.baseURL, 'uploadBase:', apiUpload.defaults.baseURL, 'trying GET /me/orders')
      }
      
      // Intentar diferentes endpoints para obtener órdenes del usuario actual
      let res = null
      const endpoints = ['/order']
      
      for (const endpoint of endpoints) {
        try {
          res = await api.get(endpoint)
          break
        } catch (e) {
          if (e?.response?.status !== 404 && e?.response?.status !== 401) {
            throw e
          }
          continue
        }
      }

      if (!res) {
        // Si ningún endpoint funcionó, intentar con apiUpload
        for (const endpoint of endpoints) {
          try {
            res = await apiUpload.get(endpoint)
            break
          } catch (e) {
            if (e?.response?.status !== 404 && e?.response?.status !== 401) {
              throw e
            }
            continue
          }
        }
      }

      let list = []
      
      if (res) {
        const raw = res.data?.data ?? res.data
        list = Array.isArray(raw) ? raw : []
        
        // Si el endpoint devuelve todas las órdenes, filtrar por usuario actual
        if (user?.id) {
          list = list.filter(o => o.user_id === user.id || o.user?.id === user.id)
        }
      }
      
      // También cargar pedidos locales (simulados) si existen
      try {
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]')
        if (Array.isArray(localOrders) && localOrders.length > 0) {
          // Agregar pedidos locales a la lista
          list = [...list, ...localOrders]
        }
      } catch (e) {
        console.warn('[MisPedidos] Error cargando pedidos locales:', e)
      }
      
      const formatted = list.map((o) => ({
        id: o.id,
        status: o.status ?? 'Pendiente',
        total: Number(o.total ?? 0),
        items: Array.isArray(o.items) ? o.items : [],
        created_at: o.created_at,
        updated_at: o.updated_at,
      }))
      
      // Si hay items en el carrito, agregar el carrito actual como pedido "En Carrito"
      if (cartItems && cartItems.length > 0 && cartSubtotal > 0) {
        const cartOrder = {
          id: 'CARRITO-ACTUAL',
          status: 'En Carrito',
          total: cartSubtotal,
          items: cartItems.map(item => ({
            product_id: item.product.id,
            product_name: item.product.name || `Producto #${item.product.id}`,
            quantity: item.qty,
            price: item.price_snapshot,
            subtotal: item.qty * item.price_snapshot,
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        // Agregar el carrito al inicio de la lista
        formatted.unshift(cartOrder)
      }
      
      // Ordenar por fecha más reciente primero (excepto el carrito actual que siempre va primero)
      const cartOrderIndex = formatted.findIndex(o => o.id === 'CARRITO-ACTUAL')
      const cartOrder = cartOrderIndex >= 0 ? formatted.splice(cartOrderIndex, 1)[0] : null
      
      formatted.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA
      })
      
      // Si hay carrito actual, ponerlo primero
      if (cartOrder) {
        formatted.unshift(cartOrder)
      }
      
      setOrdenes(formatted)
    } catch (e) {
      console.error('Error cargando pedidos:', e)
      setError('No se pudieron cargar tus pedidos. Verifica que tengas órdenes registradas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarMisPedidos()
  }, [user, cartItems])

  function getStatusBadgeClass(status) {
    const statusLower = String(status || '').toLowerCase()
    if (statusLower === 'enviado') return 'bg-success'
    if (statusLower === 'rechazado') return 'bg-danger'
    if (statusLower === 'pendiente') return 'bg-warning'
    if (statusLower === 'en carrito') return 'bg-info'
    return 'bg-secondary'
  }

  function getStatusLabel(status) {
    const statusLower = String(status || '').toLowerCase()
    const labels = {
      'pendiente': 'Pendiente',
      'enviado': 'Enviado',
      'rechazado': 'Rechazado',
      'en carrito': 'En Carrito',
    }
    return labels[statusLower] || status
  }

  if (!user) {
    return (
      <div className="container py-5 mt-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Debes iniciar sesión para ver tus pedidos.
          <div className="mt-2">
            <Link to="/login-usuario" className="btn btn-primary btn-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Mis Pedidos</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={cargarMisPedidos}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
          <Link to="/productos" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Productos
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center text-muted">
          <div className="spinner-border" role="status"></div>
          <p className="mt-2">Cargando tus pedidos...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {ordenes.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No tienes pedidos registrados aún.
              <div className="mt-2">
                <Link to="/productos" className="btn btn-primary btn-sm">
                  Ver productos
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {ordenes.map(orden => (
                <div key={orden.id} className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: '#fff' }}>
                      <div>
                        <strong>{orden.id === 'CARRITO-ACTUAL' ? 'Carrito Actual' : `Orden #${orden.id}`}</strong>
                        <small className="d-block mt-1" style={{ opacity: 0.9 }}>
                          {orden.id === 'CARRITO-ACTUAL' ? 'Productos en tu carrito' : formatearFecha(orden.created_at)}
                        </small>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(orden.status)}`}>
                        {getStatusLabel(orden.status)}
                      </span>
                    </div>
                    <div className="card-body">
                      {Array.isArray(orden.items) && orden.items.length > 0 && (
                        <div className="mb-3">
                          <h6 className="mb-2">Productos:</h6>
                          <ul className="list-unstyled">
                            {orden.items.map((item, idx) => (
                              <li key={idx} className="d-flex justify-content-between align-items-center mb-2">
                                <span>
                                  {item.product_name || item.product?.name || 'Producto'} 
                                  <small className="text-muted ms-2">x{item.quantity || item.qty || 0}</small>
                                </span>
                                <span className="fw-semibold">
                                  {formatearPrecio(item.subtotal || (item.price * (item.quantity || item.qty || 0)))}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <strong>Total:</strong>
                        <strong className="fs-5" style={{ color: '#8B4513' }}>
                          {formatearPrecio(orden.total)}
                        </strong>
                      </div>
                      {orden.id === 'CARRITO-ACTUAL' && (
                        <div className="mt-3">
                          <Link to="/carrito" className="btn btn-primary w-100">
                            <i className="bi bi-cart-fill me-2"></i>
                            Ir al Carrito para Finalizar Compra
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MisPedidos





