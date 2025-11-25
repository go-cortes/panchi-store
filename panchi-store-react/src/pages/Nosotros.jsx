function Nosotros() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#8B4513' }}>
                <i className="bi bi-heart-pulse-fill me-2" style={{ color: '#A0522D' }}></i>
                Sobre Nosotros
              </h1>
              <p className="lead text-muted">Conoce nuestra pasión por las mascotas y el equipo que hace posible el cuidado de tus compañeros peludos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4" style={{ color: '#8B4513' }}>
                <i className="bi bi-paw me-2" style={{ color: '#A0522D' }}></i>
                Nuestra Historia
              </h2>
              <p className="lead text-muted mb-4">
                Mundo Mascota nació en 2020 con la visión de ser el mejor aliado para el cuidado y bienestar 
                de las mascotas chilenas, ofreciendo productos de calidad y consejos especializados.
              </p>
              <p className="text-muted mb-4">
                Desde nuestros inicios, nos hemos enfocado en entender las necesidades reales de perros, gatos 
                y otras mascotas. Nuestro equipo está formado por amantes de los animales que comparten la misma 
                pasión por brindar la mejor calidad de vida a nuestros compañeros peludos.
              </p>
              <p className="text-muted">
                Hoy, somos la tienda de mascotas más confiable de Chile, con miles de clientes satisfechos 
                y un catálogo especializado que abarca desde alimentos premium hasta accesorios de última generación.
              </p>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&w=800&h=500&fit=crop&crop=center&q=80"
                alt="Portada tienda de mascotas - Mundo Mascota"
                className="img-fluid rounded shadow"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&w=800&h=500&fit=crop&crop=center&q=80' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    <i className="bi bi-bullseye fs-2"></i>
                  </div>
                  <h4 className="fw-bold text-primary mb-3">Misión</h4>
                  <p className="text-muted">
                    Brindar productos de calidad y servicios especializados para el cuidado y bienestar 
                    de las mascotas, facilitando a sus dueños el acceso a todo lo necesario para una 
                    vida feliz y saludable de sus compañeros peludos.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    <i className="bi bi-eye fs-2"></i>
                  </div>
                  <h4 className="fw-bold text-success mb-3">Visión</h4>
                  <p className="text-muted">
                    Ser la tienda de mascotas líder en Chile, reconocida por nuestra especialización, 
                    calidad de productos y compromiso con el bienestar animal, estableciendo nuevos 
                    estándares en el cuidado de mascotas.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card h-100 text-center">
                <div className="card-body p-4">
                  <div className="feature-icon bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                    <i className="bi bi-heart fs-2"></i>
                  </div>
                  <h4 className="fw-bold text-warning mb-3">Valores</h4>
                  <p className="text-muted">
                    Amor por los animales, integridad, especialización, excelencia en el servicio 
                    y compromiso con el bienestar de las mascotas. Estos valores guían cada 
                    decisión y acción en nuestra empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold" style={{ color: '#8B4513' }}>
                <i className="bi bi-people-fill me-2" style={{ color: '#A0522D' }}></i>
                Nuestro Equipo
              </h2>
              <p className="text-muted">Conoce a los amantes de las mascotas que hacen posible el cuidado de tus compañeros peludos</p>
            </div>
          </div>

          <div className="row g-4">
            {[
              {
                nombre: 'María González',
                cargo: 'CEO & Fundadora',
                img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
                redes: ['linkedin', 'twitter'],
              },
              {
                nombre: 'Carlos Rodríguez',
                cargo: 'Especialista en Productos',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
                redes: ['linkedin', 'github'],
              },
              {
                nombre: 'Ana Martínez',
                cargo: 'Especialista en Comunicación',
                img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
                redes: ['linkedin', 'instagram'],
              },
            ].map((p) => (
              <div className="col-lg-4 col-md-6" key={p.nombre}>
                <div className="card text-center h-100">
                  <div className="card-body p-4">
                    <img
                      src={p.img}
                      alt={p.nombre}
                      className="rounded-circle mb-3"
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <h5 className="fw-bold" style={{ color: '#8B4513' }}>{p.nombre}</h5>
                    <p className="fw-bold" style={{ color: '#A0522D' }}>{p.cargo}</p>
                    <p className="text-muted small">
                      {p.cargo.includes('Productos')
                        ? 'Experto en nutrición animal y productos para mascotas. Responsable de la selección y evaluación de productos de calidad.'
                        : p.cargo.includes('Comunicación')
                        ? 'Especialista en comunicación sobre cuidado animal y bienestar de mascotas. Dirige las estrategias de educación y concienciación.'
                        : 'Veterinaria con más de 10 años de experiencia en cuidado animal. Lidera la visión estratégica enfocada en el bienestar de las mascotas.'}
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      {p.redes.map((r) => (
                        <a key={r} href="#" className={`btn btn-outline-${r === 'instagram' ? 'danger' : r === 'github' ? 'dark' : r === 'twitter' ? 'info' : 'primary'} btn-sm`}>
                          <i className={`bi bi-${r}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}>
        <div className="container">
          <div className="row text-center">
            {[
              { icon: 'people', cantidad: '15,000+', texto: 'Mascotas Felices' },
              { icon: 'box', cantidad: '2,500+', texto: 'Productos Especializados' },
              { icon: 'truck', cantidad: '35,000+', texto: 'Envíos a Hogares' },
              { icon: 'star', cantidad: '4.9/5', texto: 'Satisfacción de Dueños' },
            ].map((s) => (
              <div className="col-lg-3 col-md-6 mb-4" key={s.icon}>
                <div className="feature-icon bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ color: '#8B4513' }}>
                  <i className={`bi bi-${s.icon} fs-2`}></i>
                </div>
                <h3 className="fw-bold">{s.cantidad}</h3>
                <p className="mb-0">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Nosotros