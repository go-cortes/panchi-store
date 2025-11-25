import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

function Registro() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()
  const [error, setError] = useState(null)
  const [ok, setOk] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit({ name, email, password }) {
    setError(null)
    setOk('')
    try {
      await registerUser(email, password, name)
      setOk('¡Registro exitoso! Ahora puedes iniciar sesión.')
      reset()
      setTimeout(() => navigate('/login-usuario', { replace: true }), 1000)
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e?.response?.data?.message || 'No se pudo registrar'
      setError(msg)
    }
  }

  return (
    <div className="container py-5 mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow-lg" style={{ maxWidth: 560, width: '100%', borderRadius: '1rem' }}>
        <div className="card-header" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: '#fff', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
          <h1 className="h4 mb-0">Registro</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {ok && <div className="alert alert-success" role="alert">{ok}</div>}

            <div className="mb-3">
              <label className="form-label fw-bold">Nombre</label>
              <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register('name', { required: 'Nombre requerido' })} />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Correo</label>
              <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email', { required: 'Correo requerido' })} />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} {...register('password', { required: 'Contraseña requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
          </div>
          <div className="card-footer d-flex justify-content-end gap-2" style={{ borderTop: '1px solid rgba(139, 69, 19, 0.1)' }}>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/login-usuario')}>Ya tengo cuenta</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-person-plus me-2"></i>}
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registro