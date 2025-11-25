import { useMemo, useState } from 'react'
import blogPosts from '../data/blogs'

function Blogs() {
  const [categoria, setCategoria] = useState('todos')
  const [expandedId, setExpandedId] = useState(null)

  const posts = useMemo(() => {
    if (categoria === 'todos') return blogPosts
    return blogPosts.filter(p => p.categoria === categoria)
  }, [categoria])

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  // Seleccionar categoría y hacer scroll al contenedor de posts
  function selectCategoria(value, scrollId) {
    setCategoria(value)
    if (scrollId) {
      // Espera al repaint para asegurar que el filtro se aplica
      setTimeout(() => {
        const el = document.getElementById(scrollId)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-section py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#8B4513' }}>
                <i className="bi bi-book me-2" style={{ color: '#CD853F' }}></i>
                Blog de Mascotas
              </h1>
              <p className="lead text-muted">Consejos, cuidados y todo lo que necesitas saber para el bienestar de tu mascota</p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-5">
        <div className="container">
          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="btn-group" role="group">
                {[
                  ['todos', 'Todos los artículos', 'grid-3x3-gap'],
                  ['Salud', 'Salud', 'heart-pulse-fill'],
                  ['Alimentación', 'Alimentación', 'cup-hot'],
                  ['Juguetes', 'Juguetes', 'controller'],
                  ['Consejos', 'Consejos', 'lightbulb'],
                ].map(([value, label, icon]) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn ${categoria === value ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCategoria(value)}
                  >
                    <i className={`bi bi-${icon} me-2`}></i>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de posts */}
          <div className="row" id="blogs-container">
            {posts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="card">
                  <div className="card-body">
                    <i className="bi bi-search fs-1 text-muted mb-3"></i>
                    <h4 className="text-muted">No se encontraron artículos</h4>
                    <p className="text-muted">No hay artículos disponibles en la categoría "{categoria}".</p>
                    <button className="btn btn-primary" onClick={() => setCategoria('todos')}>
                      <i className="bi bi-arrow-left me-2"></i>Ver todos los artículos
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              posts.map(post => {
                const fecha = new Date(post.fecha).toLocaleDateString('es-ES')
                const expandido = expandedId === post.id
                return (
                  <div className="col-lg-6 col-md-6 mb-4" key={post.id}>
                    <div className="card h-100 shadow-sm">
                      <img
                        src={post.imagen}
                        className="card-img-top"
                        alt={post.titulo}
                        style={{ height: 250, objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <span className="badge bg-primary me-2">{post.categoria}</span>
                            <small className="text-muted">{fecha}</small>
                          </div>
                        </div>
                        <h5 className="card-title" style={{ color: '#8B4513' }}>{post.titulo}</h5>
                        <p className="card-text text-muted flex-grow-1">{post.resumen}</p>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <small className="text-muted">Por: {post.autor}</small>
                          <button className="btn btn-outline-primary btn-sm" onClick={() => toggleExpand(post.id)}>
                            {expandido ? 'Cerrar' : 'Leer más'} <i className={`bi bi-${expandido ? 'x-lg' : 'arrow-right'}`}></i>
                          </button>
                        </div>
                      </div>
                      {expandido && (
                        <div className="card-body border-top">
                          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contenido }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Categorías destacadas */}
          <div className="row mt-5">
            <div className="col-12 text-center mb-4">
              <h3 className="fw-bold" style={{ color: '#8B4513' }}>
                <i className="bi bi-tags me-2" style={{ color: '#A0522D' }}></i>
                Categorías del Blog
              </h3>
              <p className="text-muted">Explora contenido especializado por categorías</p>
            </div>
          </div>

          <div className="row g-4">
            {[
              { icon: 'heart-pulse-fill', nombre: 'Salud', desc: 'Consejos de salud, vacunas y cuidados veterinarios' },
              { icon: 'cup-hot', nombre: 'Alimentación', desc: 'Guías de nutrición y dietas para mascotas' },
              { icon: 'controller', nombre: 'Juguetes', desc: 'Ideas y reseñas de juguetes para diversión segura' },
              { icon: 'lightbulb', nombre: 'Consejos', desc: 'Tips prácticos para dueños de mascotas' },
            ].map(cat => (
              <div className="col-lg-3 col-md-6" key={cat.nombre}>
                <div className="card text-center h-100 feature-card">
                  <div className="card-body">
                    <i className={`bi bi-${cat.icon} text-primary fs-1 mb-3`}></i>
                    <h5 className="fw-bold">{cat.nombre}</h5>
                    <p className="text-muted small">{cat.desc}</p>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => selectCategoria(cat.nombre, 'blogs-container')}>
                      Ver Artículos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Blogs