import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { apiUpload } from '../api/api'

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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return fecha
  }
}

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState({}) // Track de órdenes que se están actualizando

  async function cargarOrdenes() {
    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminOrdenes] base:', api.defaults.baseURL, 'uploadBase:', apiUpload.defaults.baseURL, 'trying GET /orders')
      }
      
      // Intentar diferentes endpoints comunes para obtener órdenes
      let res = null
      const endpoints = ['/orders', '/order', '/me/orders']
      
      for (const endpoint of endpoints) {
        try {
          res = await api.get(endpoint)
          break
        } catch (e) {
          if (e?.response?.status !== 404) {
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
            if (e?.response?.status !== 404) {
              throw e
            }
            continue
          }
        }
      }

      if (!res) {
        throw new Error('No se pudo conectar al endpoint de órdenes')
      }

      const raw = res.data?.data ?? res.data
      const list = Array.isArray(raw) 
        ? raw.map((o) => ({
            id: o.id,
            status: o.status ?? 'Pendiente',
            total: Number(o.total ?? 0),
            items: Array.isArray(o.items) ? o.items : [],
            created_at: o.created_at,
            updated_at: o.updated_at,
            user_id: o.user_id,
            user_email: o.user_email ?? o.user?.email ?? '',
          }))
        : []
      setOrdenes(list)
    } catch (e) {
      console.error('Error cargando órdenes:', e)
      setError('No se pudo cargar el listado de órdenes. Verifica que el endpoint /orders exista en Xano.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  async function cambiarEstado(orden, nuevoEstado) {
    if (!confirm(`¿Cambiar estado de la orden #${orden.id} a "${nuevoEstado}"?`)) {
      return
    }

    setUpdating({ ...updating, [orden.id]: true })
    
    try {
      // Intentar diferentes endpoints para actualizar orden
      const endpoints = [`/orders/${orden.id}`, `/order/${orden.id}`, `/me/orders/${orden.id}`]
      
      let actualizado = false
      for (const endpoint of endpoints) {
        try {
          await api.patch(endpoint, { status: nuevoEstado })
          actualizado = true
          break
        } catch (e) {
          if (e?.response?.status !== 404) {
            throw e
          }
          continue
        }
      }

      if (!actualizado) {
        // Intentar con apiUpload
        for (const endpoint of endpoints) {
          try {
            await apiUpload.patch(endpoint, { status: nuevoEstado })
            actualizado = true
            break
          } catch (e) {
            if (e?.response?.status !== 404) {
              throw e
            }
            continue
          }
        }
      }

      if (!actualizado) {
        throw new Error('No se pudo actualizar la orden')
      }

      // Actualizar estado local
      setOrdenes(ordenes.map(o => 
        o.id === orden.id 
          ? { ...o, status: nuevoEstado }
          : o
      ))
    } catch (e) {
      console.error('Error actualizando orden:', e)
      alert(`No se pudo cambiar el estado de la orden: ${e?.message || 'Error desconocido'}`)
    } finally {
      setUpdating({ ...updating, [orden.id]: false })
    }
  }

  function getStatusBadgeClass(status) {
    const statusLower = String(status || '').toLowerCase()
    if (statusLower === 'enviado') return 'bg-success'
    if (statusLower === 'rechazado') return 'bg-danger'
    if (statusLower === 'pendiente') return 'bg-warning'
    return 'bg-secondary'
  }

  function getStatusLabel(status) {
    const statusLower = String(status || '').toLowerCase()
    const labels = {
      'pendiente': 'Pendiente',
      'enviado': 'Enviado',
      'rechazado': 'Rechazado',
    }
    return labels[statusLower] || status
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Admin: Órdenes</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={cargarOrdenes}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Productos
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center text-muted">
          <div className="spinner-border" role="status"></div>
          <p className="mt-2">Cargando órdenes...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-2">
            <small className="text-muted">
              Asegúrate de que en Xano tengas configurada la tabla <code>orders</code> con los campos:
              <code>status</code>, <code>total</code>, <code>items</code>, <code>created_at</code>, 
              y que el endpoint esté disponible.
            </small>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {ordenes.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No hay órdenes registradas aún.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map(orden => (
                    <tr key={orden.id}>
                      <td><strong>#{orden.id}</strong></td>
                      <td>
                        {orden.user_email || `Usuario #${orden.user_id || '-'}`}
                      </td>
                      <td>
                        <small>{orden.items?.length || 0} producto(s)</small>
                      </td>
                      <td className="fw-bold" style={{ color: '#8B4513' }}>
                        {formatearPrecio(orden.total)}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(orden.status)}`}>
                          {getStatusLabel(orden.status)}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatearFecha(orden.created_at)}
                        </small>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          {orden.status !== 'Enviado' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => cambiarEstado(orden, 'Enviado')}
                              disabled={updating[orden.id]}
                              title="Marcar como Enviado"
                            >
                              {updating[orden.id] ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i>
                                  Enviado
                                </>
                              )}
                            </button>
                          )}
                          {orden.status !== 'Rechazado' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => cambiarEstado(orden, 'Rechazado')}
                              disabled={updating[orden.id]}
                              title="Rechazar orden"
                            >
                              {updating[orden.id] ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-1"></i>
                                  Rechazar
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminOrdenes

