import { useState } from 'react'

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function ProductCard({ producto, onAdd, onRemove, onAddToFavorites, onRemoveFromFavorites, isFavorite = false, showRemoveFavorite = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Función auxiliar para obtener todas las imágenes del producto
  function getAllProductImages(product) {
    if (!product) {
      return []
    }
    
    // Lista de posibles nombres de campos de imagen (en orden de prioridad)
    const imageFieldNames = ['images', 'image', 'imagen', 'photos', 'photo', 'imagenes']
    
    // Buscar el campo de imagen en el producto
    let imageData = null
    
    for (const field of imageFieldNames) {
      if (product[field] !== undefined && product[field] !== null) {
        imageData = product[field]
        break
      }
    }
    
    if (!imageData) {
      return []
    }
    
    // Si es un Array: extraer todas las URLs
    if (Array.isArray(imageData)) {
      if (imageData.length === 0) {
        return []
      }
      
      return imageData.map((item) => {
        if (item && typeof item === 'object') {
          return item.url || item.path || ''
        }
        if (typeof item === 'string') {
          return item
        }
        return ''
      }).filter(url => url !== '')
    }
    
    // Si es un Objeto: devolver como array con un solo elemento
    if (typeof imageData === 'object') {
      const url = imageData.url || imageData.path || ''
      return url ? [url] : []
    }
    
    // Si es un string, devolver como array con un solo elemento
    if (typeof imageData === 'string') {
      return [imageData]
    }
    
    return []
  }

  // Función auxiliar para obtener la URL de la imagen actual
  function getProductImage(product) {
    const images = getAllProductImages(product)
    if (images.length === 0) {
      return 'https://via.placeholder.com/400x250/F5F5DC/8B4513?text=Sin+imagen'
    }
    return images[currentImageIndex] || images[0] || 'https://via.placeholder.com/400x250/F5F5DC/8B4513?text=Sin+imagen'
  }

  const id = producto?.id
  const nombre = producto?.nombre ?? producto?.name
  const descripcion = producto?.descripcion ?? producto?.description
  const precio = producto?.precio ?? producto?.price
  const categoria = producto?.categoria ?? producto?.category
  const tipo = producto?.tipo ?? producto?.brand ?? ''
  
  // Obtener todas las imágenes
  const allImages = getAllProductImages(producto)
  const hasMultipleImages = allImages.length > 1
  const placeholderImage = 'https://via.placeholder.com/400x250/F5F5DC/8B4513?text=Sin+imagen'

  // Funciones para navegar entre imágenes
  const goToPreviousImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const goToNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
        {/* Contenedor de imagen con navegación */}
        <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden' }}>
          <img
            src={getProductImage(producto)}
            alt={nombre}
            className="card-img-top"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
            onError={(e) => { 
              e.currentTarget.src = placeholderImage
            }}
          />
          {/* Flechas de navegación (solo si hay múltiples imágenes) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPreviousImage}
                className="btn btn-sm"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                title="Imagen anterior"
              >
                <i className="bi bi-chevron-left" style={{ color: '#8B4513', fontSize: '1.2rem' }}></i>
              </button>
              <button
                onClick={goToNextImage}
                className="btn btn-sm"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                title="Siguiente imagen"
              >
                <i className="bi bi-chevron-right" style={{ color: '#8B4513', fontSize: '1.2rem' }}></i>
              </button>
              {/* Indicador de imagen actual */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  zIndex: 10
                }}
              >
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

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