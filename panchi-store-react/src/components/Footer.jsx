import { Link } from 'react-router-dom'
import logo from '../assets/petstore-logo.svg'

function Footer() {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3">
            <h5 className="d-flex align-items-center gap-2">
              <img src={logo} alt="Logo Panchi Store" className="brand-logo" />
              <span>Panchi Store</span>
            </h5>
            <p className="text-muted">
              Tu tienda de confianza para el cuidado y bienestar de tus mascotas.
            </p>
          </div>
          <div className="col-lg-3">
            <h6>Categorías</h6>
            <ul className="list-unstyled">
              <li><Link to="/productos?categoria=alimento" className="text-muted text-decoration-none">🍖 Alimentos</Link></li>
              <li><Link to="/productos?categoria=juguete" className="text-muted text-decoration-none">🎾 Juguetes</Link></li>
              <li><Link to="/productos?categoria=accesorio" className="text-muted text-decoration-none">🛏️ Accesorios</Link></li>
              <li><Link to="/productos?categoria=higiene" className="text-muted text-decoration-none">🧴 Higiene</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6>Contacto</h6>
            <ul className="list-unstyled contact-info">
              <li><i className="bi bi-geo-alt me-2"></i><a href="https://maps.google.com/?q=Av+Principal+123+Santiago" target="_blank" className="text-muted text-decoration-none" rel="noreferrer">Av. Principal 123, Santiago</a></li>
              <li><i className="bi bi-telephone me-2"></i><a href="tel:+56912345678" className="text-muted text-decoration-none">+56 9 1234 5678</a></li>
              <li><i className="bi bi-envelope me-2"></i><a href="mailto:contacto@panchistore.cl" className="text-muted text-decoration-none">contacto@panchistore.cl</a></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6>Redes Sociales</h6>
            <div className="d-flex gap-3">
              <a href="https://facebook.com/panchistore" target="_blank" className="text-muted" rel="noreferrer" title="Síguenos en Facebook"><i className="bi bi-facebook fs-4"></i></a>
              <a href="https://instagram.com/panchistore" target="_blank" className="text-muted" rel="noreferrer" title="Síguenos en Instagram"><i className="bi bi-instagram fs-4"></i></a>
              <a href="https://twitter.com/panchistore" target="_blank" className="text-muted" rel="noreferrer" title="Síguenos en Twitter"><i className="bi bi-twitter fs-4"></i></a>
              <a href="https://youtube.com/@panchistore" target="_blank" className="text-muted" rel="noreferrer" title="Suscríbete a nuestro canal"><i className="bi bi-youtube fs-4"></i></a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">&copy; 2024 Panchi Store. Todos los derechos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/login-admin" className="text-muted text-decoration-none me-3">Admin Login</Link>
            <Link to="/registro" className="text-muted text-decoration-none">Registrarse</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer