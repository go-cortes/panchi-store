import { Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

function AdminRoute({ children }) {
  const { token, user, restore } = useAuthStore()
  const location = useLocation()

  // Restaurar sesión sin actualizar estado durante render
  useEffect(() => {
    restore()
  }, [restore])

  const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('auth_token')

  // Mientras hay token en localStorage pero aún no se aplicó al store, muestra loading
  if (!token && hasLocalToken) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" aria-label="Cargando" />
      </div>
    )
  }

  // Si no hay token ni en store ni en localStorage, enviar al login admin
  if (!token) {
    return <Navigate to="/login-admin" state={{ from: location }} replace />
  }

  // Validar rol admin
  if (!user || user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute