import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

function LoginAdmin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { email: 'admin@gmail.com', password: '1234Admin' }
  })

  async function onSubmit({ email, password }) {
    try {
      await login(email, password)
      const to = (location.state && location.state.from && location.state.from.pathname) || '/admin/productos'
      navigate(to, { replace: true })
    } catch (e) {
      alert('Credenciales inválidas')
    }
  }

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: 560 }}>
      <div className="card">
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: '#fff' }}>
          <h1 className="h4 mb-0">Acceso Administrador</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body p-4">
            <div className="mb-3">
              <label className="form-label fw-bold">Correo</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email', { required: 'Correo requerido' })} />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} {...register('password', { required: 'Contraseña requerida' })} />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
            <p className="text-center text-sm text-gray-500">
              Tip: en desarrollo puedes usar <span className="font-semibold">admin@gmail.com</span> / <span className="font-semibold">1234Admin</span>
            </p>
          </div>
          <div className="card-footer d-flex justify-content-end">
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

export default LoginAdmin