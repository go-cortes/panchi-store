import { useRef } from 'react'

function Contacto() {
  const formRef = useRef(null)

  function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(formRef.current)
    const data = Object.fromEntries(fd.entries())
    console.log('Contacto enviado:', data)
    alert('¡Gracias! Hemos recibido tu mensaje. Te contactaremos pronto.')
    formRef.current.reset()
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row g-5">
        {/* Columna Izquierda - Información de Contacto */}
        <div className="col-lg-5">
          <div className="mb-4">
            <h1 className="display-5 fw-bold mb-3" style={{ color: '#8B4513' }}>Hablemos</h1>
            <p className="lead text-muted">
              Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos o servicios. 
              No dudes en contactarnos, estamos encantados de asistirte.
            </p>
          </div>

          <div className="d-flex flex-column gap-4">
            {/* Dirección */}
            <div className="d-flex align-items-start gap-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-geo-alt-fill fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#8B4513' }}>Dirección</h5>
                <p className="text-muted mb-0">
                  Av. Principal 123, Santiago, Chile
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="d-flex align-items-start gap-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-telephone-fill fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#8B4513' }}>Teléfono</h5>
                <p className="text-muted mb-0">
                  <a href="tel:+56912345678" className="text-decoration-none text-muted">+56 9 1234 5678</a>
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="d-flex align-items-start gap-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-envelope-fill fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#8B4513' }}>Email</h5>
                <p className="text-muted mb-0">
                  <a href="mailto:contacto@panchistore.cl" className="text-decoration-none text-muted">contacto@panchistore.cl</a>
                </p>
              </div>
            </div>

            {/* Horario */}
            <div className="d-flex align-items-start gap-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                <i className="bi bi-clock-fill fs-4"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#8B4513' }}>Horario de Atención</h5>
                <p className="text-muted mb-0">
                  Lunes a Viernes: 9:00 AM - 7:00 PM<br />
                  Sábados: 10:00 AM - 5:00 PM<br />
                  Domingos: Cerrado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="col-lg-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h2 className="h4 fw-bold mb-4" style={{ color: '#8B4513' }}>Envíanos un mensaje</h2>
            
            <form ref={formRef} onSubmit={onSubmit}>
                    <div className="mb-3">
                <label htmlFor="nombre" className="form-label fw-semibold">Nombre completo</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0" 
                  id="nombre" 
                  name="nombre" 
                  placeholder="Tu nombre"
                  style={{ padding: '0.75rem' }}
                  required 
                />
                    </div>

                    <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                <input 
                  type="email" 
                  className="form-control bg-light border-0" 
                  id="email" 
                  name="email" 
                  placeholder="tu@email.com"
                  style={{ padding: '0.75rem' }}
                  required 
                />
                    </div>

                    <div className="mb-3">
                <label htmlFor="asunto" className="form-label fw-semibold">Asunto</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0" 
                  id="asunto" 
                  name="asunto" 
                  placeholder="¿Sobre qué quieres consultar?"
                  style={{ padding: '0.75rem' }}
                  required 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="mensaje" className="form-label fw-semibold">Mensaje</label>
                <textarea 
                  className="form-control bg-light border-0" 
                  id="mensaje" 
                  name="mensaje" 
                  rows={5} 
                  placeholder="Escribe tu mensaje aquí..."
                  style={{ padding: '0.75rem', resize: 'vertical' }}
                  required
                ></textarea>
                    </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill fw-bold">
                  <i className="bi bi-send-fill me-2"></i>
                  Enviar mensaje
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

      {/* FAQs Section */}
      <section className="py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="fw-bold h3" style={{ color: '#8B4513' }}>
                <i className="bi bi-question-circle me-2"></i>
                Preguntas Frecuentes
              </h2>
              <p className="text-muted">Encuentra respuestas a las preguntas más comunes sobre el cuidado de mascotas</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                  <h2 className="accordion-header" id="faq1">
                    <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                      ¿Qué tipo de productos para mascotas ofrecen?
                    </button>
                  </h2>
                  <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body bg-light">
                      Ofrecemos una amplia gama de productos especializados: alimentos premium, juguetes, accesorios, productos de higiene, ropa para mascotas, suplementos vitamínicos y comederos automáticos. Todos nuestros productos están seleccionados por su calidad y seguridad.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                  <h2 className="accordion-header" id="faq2">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                      ¿Ofrecen asesoría nutricional para mascotas?
                    </button>
                  </h2>
                  <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body bg-light">
                      Sí, contamos con especialistas en nutrición animal que pueden asesorarte sobre la mejor alimentación para tu mascota según su edad, raza, tamaño y necesidades específicas. Puedes contactarnos para una consulta personalizada.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                  <h2 className="accordion-header" id="faq3">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                      ¿Los productos son seguros para mi mascota?
                    </button>
                  </h2>
                  <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body bg-light">
                      Absolutamente. Todos nuestros productos están certificados y cumplen con los más altos estándares de seguridad para mascotas. Trabajamos únicamente con marcas reconocidas y productos que han pasado rigurosos controles de calidad.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                  <h2 className="accordion-header" id="faq4">
                    <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
                      ¿Puedo obtener consejos de cuidado para mi mascota?
                    </button>
                  </h2>
                  <div id="collapse4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body bg-light">
                      Por supuesto. Nuestro equipo de especialistas está disponible para brindarte consejos sobre cuidado, alimentación, ejercicio y bienestar general de tu mascota. También publicamos regularmente artículos informativos en nuestro blog.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contacto
