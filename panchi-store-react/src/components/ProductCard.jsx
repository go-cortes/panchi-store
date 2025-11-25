import { buildImageUrl } from '../utils/imageUtils'

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function ProductCard({ producto, onAdd, onRemove, onAddToFavorites, onRemoveFromFavorites, isFavorite = false, showRemoveFavorite = false }) {
  const id = producto?.id
  const nombre = producto?.nombre ?? producto?.name
  const descripcion = producto?.descripcion ?? producto?.description
  const precio = producto?.precio ?? producto?.price
  const categoria = producto?.categoria ?? producto?.category
  const tipo = producto?.tipo ?? producto?.brand ?? ''
  // Normalizar imágenes: puede venir como array de objetos XanoImage, array de strings, o string simple
  const imagesRaw = producto?.images ?? producto?.image ?? producto?.imagen ?? []
  const imagesArray = Array.isArray(imagesRaw)
    ? imagesRaw.map(img => {
        const path = typeof img === 'string' ? img : (img?.url || img?.path || '')
        return buildImageUrl(path)
      })
    : (imagesRaw ? [buildImageUrl(imagesRaw)] : [])
  const validImages = imagesArray.filter(Boolean)
  const primeraImagen = validImages[0] || ''

  // Placeholder si no hay imagen
  const placeholderImage = 'https://via.placeholder.com/400x250/F5F5DC/8B4513?text=Sin+imagen'

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
        {/* Mostrar primera imagen o placeholder */}
        <img
          src={primeraImagen || placeholderImage}
            alt={nombre}
            className="card-img-top"
          style={{ 
            width: '100%', 
            height: '250px', 
            objectFit: 'cover'
          }}
          onError={(e) => { 
            e.currentTarget.src = placeholderImage
          }}
          />

        {/* Body */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ color: '#8B4513' }}>{nombre}</h5>
          <p className="card-text text-muted" style={{ fontSize: '0.95rem' }}>{descripcion}</p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold" style={{ color: '#A0522D' }}>{formatearPrecio(precio)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-2">
              <button className="btn btn-primary btn-sm rounded-pill flex-fill fw-semibold" onClick={() => onAdd && onAdd(producto)}>
                <i className="bi bi-cart-plus me-1"></i> Agregar
              </button>
              {!showRemoveFavorite ? (
                <button 
                  className={`btn btn-sm rounded-pill ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => isFavorite ? onRemoveFromFavorites && onRemoveFromFavorites(producto) : onAddToFavorites && onAddToFavorites(producto)}
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  style={{ width: '40px', height: '40px', padding: 0 }}
                >
                  <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              ) : (
                <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => onRemove && onRemove(producto)}>
                  <i className="bi bi-heartbreak me-1"></i>
                  Quitar
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="card-footer d-flex gap-2 align-items-center">
          <span className="badge bg-secondary text-capitalize">{categoria}</span>
          {tipo && <span className="badge bg-info text-dark text-capitalize">{tipo}</span>}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;