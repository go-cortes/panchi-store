import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { apiUpload } from '../api/api'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState({}) // Track de usuarios que se están actualizando

  async function cargarUsuarios() {
    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminUsuarios] base:', api.defaults.baseURL, 'uploadBase:', apiUpload.defaults.baseURL, 'trying GET /users')
      }
      
      // Intentar diferentes endpoints comunes para obtener usuarios
      let res = null
      const endpoints = ['/users', '/user', '/auth/users']
      
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
        throw new Error('No se pudo conectar al endpoint de usuarios')
      }

      const raw = res.data?.data ?? res.data
      const list = Array.isArray(raw) 
        ? raw.map((u) => ({
            id: u.id,
            email: u.email ?? '',
            name: u.name ?? u.nombre ?? u.username ?? '',
            role: u.role ?? (u.is_admin ? 'admin' : 'cliente'),
            blocked: u.blocked ?? false,
            created_at: u.created_at,
            updated_at: u.updated_at,
          }))
        : []
      setUsuarios(list)
    } catch (e) {
      console.error('Error cargando usuarios:', e)
      setError('No se pudo cargar el listado de usuarios. Verifica que el endpoint /users exista en Xano.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function toggleBlocked(usuario) {
    if (!confirm(`¿${usuario.blocked ? 'Desbloquear' : 'Bloquear'} a ${usuario.email}?`)) {
      return
    }

    setUpdating({ ...updating, [usuario.id]: true })
    
    try {
      const nuevoEstado = !usuario.blocked
      
      // Intentar diferentes endpoints para actualizar usuario
      const endpoints = [`/users/${usuario.id}`, `/user/${usuario.id}`, `/auth/users/${usuario.id}`]
      
      let actualizado = false
      for (const endpoint of endpoints) {
        try {
          await api.patch(endpoint, { blocked: nuevoEstado })
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
            await apiUpload.patch(endpoint, { blocked: nuevoEstado })
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
        throw new Error('No se pudo actualizar el usuario')
      }

      // Actualizar estado local
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id 
          ? { ...u, blocked: nuevoEstado }
          : u
      ))
    } catch (e) {
      console.error('Error actualizando usuario:', e)
      alert(`No se pudo ${usuario.blocked ? 'desbloquear' : 'bloquear'} al usuario: ${e?.message || 'Error desconocido'}`)
    } finally {
      setUpdating({ ...updating, [usuario.id]: false })
    }
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Admin: Usuarios</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary" 
            onClick={cargarUsuarios}
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
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-2">
            <small className="text-muted">
              Asegúrate de que en Xano tengas configurada la tabla <code>users</code> o <code>auth_users</code> 
              con el campo <code>blocked</code> (booleano) y que el endpoint esté disponible.
            </small>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {usuarios.length === 0 ? (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No hay usuarios registrados aún.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.name || '-'}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td>
                        {u.blocked ? (
                          <span className="badge bg-danger">
                            <i className="bi bi-lock-fill me-1"></i>
                            Bloqueado
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Activo
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => toggleBlocked(u)}
                          disabled={updating[u.id]}
                          title={u.blocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
                        >
                          {updating[u.id] ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            <>
                              {u.blocked ? (
                                <>
                                  <i className="bi bi-unlock me-1"></i>
                                  Desbloquear
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-lock me-1"></i>
                                  Bloquear
                                </>
                              )}
                            </>
                          )}
                        </button>
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

export default AdminUsuarios

