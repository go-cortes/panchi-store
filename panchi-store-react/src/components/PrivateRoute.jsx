import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

function PrivateRoute({ children }) {
  const { token, restore } = useAuthStore()
  const location = useLocation()
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    if (!token) {
      setRestoring(true)
      restore()
      // breve desacople para evitar parpadeo
      setTimeout(() => setRestoring(false), 50)
    }
  }, [token, restore])

  if (!token && restoring) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" aria-label="Cargando" />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login-usuario" state={{ from: location }} replace />
  }
  return children
}

export default PrivateRoute