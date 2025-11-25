import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'

function LoginUsuario() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [loginError, setLoginError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { email: 'pepe@gmail.com', password: '1234Pepe' }
  })

  async function onSubmit({ email, password }) {
    setLoginError('')
    try {
      await login(email, password)
      const to = (location.state && location.state.from && location.state.from.pathname) || '/'
      navigate(to, { replace: true })
    } catch (e) {
      const errorMessage = e?.message || 'Credenciales inválidas'
      setLoginError(errorMessage)
      // Mostrar alerta también para usuarios bloqueados
      if (errorMessage.includes('bloqueada')) {
        alert(errorMessage)
      }
    }
  }

  return (
    <div className="container py-5 mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-lg" style={{ maxWidth: 560, width: '100%', borderRadius: '1rem' }}>
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: '#fff', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
          <h1 className="h4 mb-0">Acceso Cliente</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body p-4">
            {loginError && (
              <div className={`alert ${loginError.includes('bloqueada') ? 'alert-warning' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                <i className={`bi ${loginError.includes('bloqueada') ? 'bi-exclamation-triangle' : 'bi-x-circle'} me-2`}></i>
                {loginError}
                <button type="button" className="btn-close" onClick={() => setLoginError('')} aria-label="Cerrar"></button>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-bold">Correo</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                style={{ border: '0', boxShadow: '0 0 0 0.1rem rgba(139, 69, 19, 0.1)', padding: '0.75rem' }}
                {...register('email', { required: 'Correo requerido' })} 
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <input 
                type="password" 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                style={{ border: '0', boxShadow: '0 0 0 0.1rem rgba(139, 69, 19, 0.1)', padding: '0.75rem' }}
                {...register('password', { required: 'Contraseña requerida' })} 
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
            <div className="text-muted small">
              <p className="text-center text-sm text-gray-500">
                Tip: puedes usar <span className="font-semibold">pepe@gmail.com</span> / <span className="font-semibold">1234Pepe</span>
              </p>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end" style={{ borderTop: '1px solid rgba(139, 69, 19, 0.1)' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-box-arrow-in-right me-2"></i>}
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginUsuario