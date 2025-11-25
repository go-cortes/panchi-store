function Home() {
  return (
    <>
      <section className="hero-section py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="p-4 rounded-5" style={{ background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' }}>
                <h1 className="display-4 fw-bold mb-4" style={{ color: '#fff' }}>
                Todo lo que tu mascota necesita
              </h1>
                <p className="lead mb-4" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                En Panchi Store encontrarás los mejores productos para el cuidado y bienestar de tu compañero peludo. 
                Desde alimentos premium hasta juguetes y accesorios de calidad, todo en un solo lugar.
              </p>
                <a href="/productos" className="btn btn-light btn-lg fw-bold" style={{ color: '#8B4513' }}>
                Ver Productos
              </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&w=800&h=500&fit=crop&crop=center&q=80"
                  alt="Portada de tienda de mascotas"
                  className="img-fluid rounded-5 shadow"
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&w=800&h=500&fit=crop&crop=center&q=80' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'linear-gradient(135deg, #F5F5DC 0%, #F0E68C 100%)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#8B4513' }}>
              <i className="bi bi-star-fill me-2" style={{ color: '#CD853F' }}></i>
              Productos Destacados
            </h2>
            <p className="lead text-muted">Los favoritos de nuestros clientes peludos</p>
          </div>
          <div id="lista-productos" className="row g-4"></div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#8B4513' }}>
              <i className="bi bi-heart-pulse-fill me-2" style={{ color: '#CD853F' }}></i>
              ¿Por qué elegirnos?
            </h2>
            <p className="lead text-muted">Cuidamos a tu mascota como si fuera nuestra</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <i className="bi bi-truck display-4 mb-3"></i>
                <h4>Envío Gratis</h4>
                <p className="text-muted">Envío gratuito en compras superiores a $50.000 para que tu mascota no espere</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <i className="bi bi-shield-check display-4 mb-3"></i>
                <h4>Garantía 30 Días</h4>
                <p className="text-muted">Garantía de satisfacción por 30 días en todos nuestros productos</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-card p-4">
                <i className="bi bi-headset display-4 mb-3"></i>
                <h4>Soporte 24/7</h4>
                <p className="text-muted">Atención al cliente disponible las 24 horas del día para cualquier emergencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home