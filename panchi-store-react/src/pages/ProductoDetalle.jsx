import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()
  const { add: addFav } = useFavoritesStore()

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        if (import.meta.env.DEV) {
          console.info('[ProductoDetalle] base:', api.defaults.baseURL, 'trying GET /product/:id')
        }
            const res = await api.get(`/product/${id}`) // Endpoint singular (API UJ0_Qj9c)
        const p = res.data?.data ?? res.data
        if (mounted) setProducto(p)
      } catch (e) {
        if (import.meta.env.DEV) {
          const status = e?.response?.status
          console.error('[ProductoDetalle] Error al cargar producto:', { status, error: e })
        }
        // No hay más fallbacks, solo mostrar error
        if (mounted) {
          setProducto(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="container py-5 mt-5 text-center text-muted">
        <p>Producto no encontrado.</p>
      </div>
    )
  }

  // Función auxiliar para obtener la URL de la imagen del producto
  function getProductImage(product) {
    // Debug: ver qué estructura tiene el producto
    console.log('Debug Producto:', product)
    
    if (!product) {
      return 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
    }
    
    // Lista de posibles nombres de campos de imagen (en orden de prioridad)
    const imageFieldNames = ['images', 'image', 'imagen', 'photos', 'photo', 'imagenes']
    
    // Buscar el campo de imagen en el producto
    let imageData = null
    let fieldName = null
    
    for (const field of imageFieldNames) {
      if (product[field] !== undefined && product[field] !== null) {
        imageData = product[field]
        fieldName = field
        console.log(`Campo de imagen encontrado: "${field}"`, imageData)
        break
      }
    }
    
    if (!imageData) {
      console.log('No se encontró campo de imagen en el producto')
      return 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
    }
    
    // Si es un Array: devolver la propiedad .url o .path del primer elemento
    if (Array.isArray(imageData)) {
      if (imageData.length === 0) {
        console.log('Array de imágenes vacío')
        return 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
      }
      
      const firstItem = imageData[0]
      console.log('Primer elemento del array:', firstItem)
      
      // Verificar si tiene .url o .path
      if (firstItem && typeof firstItem === 'object') {
        const url = firstItem.url || firstItem.path || ''
        console.log('URL extraída del array:', url)
        return url || 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
      }
      
      // Si el primer elemento es un string, usarlo directamente
      if (typeof firstItem === 'string') {
        console.log('Primer elemento es string:', firstItem)
        return firstItem
      }
      
      return 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
    }
    
    // Si es un Objeto: devolver la propiedad .url o .path directamente
    if (typeof imageData === 'object') {
      const url = imageData.url || imageData.path || ''
      console.log('URL extraída del objeto:', url)
      return url || 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
    }
    
    // Si es un string, usarlo directamente
    if (typeof imageData === 'string') {
      console.log('Imagen es string:', imageData)
      return imageData
    }
    
    // Si no coincide con ningún caso, retornar placeholder
    console.log('Tipo de dato no reconocido:', typeof imageData)
    return 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
  }

  // Función auxiliar para obtener todas las URLs de imágenes (para el carousel)
  function getProductImages(product) {
    // Debug: ver qué estructura tiene el producto
    console.log('Debug Producto (todas las imágenes):', product)
    
    if (!product) {
      return []
    }
    
    // Lista de posibles nombres de campos de imagen (en orden de prioridad)
    const imageFieldNames = ['images', 'image', 'imagen', 'photos', 'photo', 'imagenes']
    
    // Buscar el campo de imagen en el producto
    let imageData = null
    let fieldName = null
    
    for (const field of imageFieldNames) {
      if (product[field] !== undefined && product[field] !== null) {
        imageData = product[field]
        fieldName = field
        console.log(`Campo de imagen encontrado: "${field}"`, imageData)
        break
      }
    }
    
    if (!imageData) {
      console.log('No se encontró campo de imagen en el producto')
      return []
    }
    
    // Si es un Array: mapear todos los elementos y extraer .url o .path
    if (Array.isArray(imageData)) {
      const urls = imageData
        .map((item, index) => {
          if (item && typeof item === 'object') {
            const url = item.url || item.path || ''
            console.log(`URL ${index} extraída del array:`, url)
            return url
          }
          if (typeof item === 'string') {
            console.log(`URL ${index} es string:`, item)
            return item
          }
          return ''
        })
        .filter(Boolean)
      
      console.log('Todas las URLs extraídas:', urls)
      return urls
    }
    
    // Si es un Objeto único: retornar un array con una sola URL
    if (typeof imageData === 'object') {
      const url = imageData.url || imageData.path || ''
      console.log('URL extraída del objeto único:', url)
      return url ? [url] : []
    }
    
    // Si es un string, retornar un array con ese string
    if (typeof imageData === 'string') {
      console.log('Imagen es string:', imageData)
      return [imageData]
    }
    
    // Si no coincide con ningún caso, retornar array vacío
    console.log('Tipo de dato no reconocido:', typeof imageData)
    return []
  }

  const nombre = producto?.nombre ?? producto?.name
  const descripcion = producto?.descripcion ?? producto?.description
  const precio = producto?.precio ?? producto?.price
  // Obtener todas las imágenes usando la función auxiliar
  const images = getProductImages(producto)
  const hasMultipleImages = images.length > 1
  const imagen = images[0] || ''
  const categoria = producto?.categoria ?? producto?.category
  const brand = producto?.brand ?? ''
  const stock = producto?.stock ?? 0

  const carouselId = `producto-carousel-${producto?.id}`
  const placeholderImage = 'https://via.placeholder.com/500x500/F5F5DC/8B4513?text=Sin+imagen'
  const displayImage = imagen || placeholderImage

  function agregarCarrito() {
    add(producto.id, 1).catch(() => {})
  }
  function agregarFavorito() {
    addFav(producto.id).catch(() => {})
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row g-4">
        <div className="col-md-6">
          {hasMultipleImages && images.length > 1 ? (
            <div 
              id={carouselId} 
              className="carousel slide rounded-4 overflow-hidden shadow-lg" 
              data-bs-ride="carousel"
              style={{ position: 'relative' }}
            >
              <div className="carousel-inner">
                {images.map((img, idx) => (
                  <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                    <img
                      src={img || placeholderImage}
                      alt={`${nombre} ${idx + 1}`}
                      className="d-block w-100 img-fluid"
                      style={{ height: '500px', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = placeholderImage }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Flecha Anterior - Visible y funcional */}
              <button 
                className="carousel-control-prev" 
                type="button" 
                data-bs-target={`#${carouselId}`} 
                data-bs-slide="prev"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '15px',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'rgba(139, 69, 19, 0.9)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  opacity: 1,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 1)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 0.9)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                }}
              >
                <span 
                  className="carousel-control-prev-icon" 
                  aria-hidden="true"
                  style={{ 
                    filter: 'invert(1)',
                    width: '20px',
                    height: '20px'
                  }}
                ></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              
              {/* Flecha Siguiente - Visible y funcional */}
              <button 
                className="carousel-control-next" 
                type="button" 
                data-bs-target={`#${carouselId}`} 
                data-bs-slide="next"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '15px',
                  transform: 'translateY(-50%)',
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'rgba(139, 69, 19, 0.9)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  opacity: 1,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 1)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 0.9)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                }}
              >
                <span 
                  className="carousel-control-next-icon" 
                  aria-hidden="true"
                  style={{ 
                    filter: 'invert(1)',
                    width: '20px',
                    height: '20px'
                  }}
                ></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
              
              {/* Indicadores mejorados */}
              <div 
                className="carousel-indicators" 
                style={{ 
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  margin: 0,
                  padding: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '20px'
                }}
              >
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-bs-target={`#${carouselId}`}
                    data-bs-slide-to={idx}
                    className={idx === 0 ? 'active' : ''}
                    aria-current={idx === 0 ? 'true' : undefined}
                    aria-label={`Imagen ${idx + 1}`}
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: idx === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)', 
                      border: 'none', 
                      margin: '0 4px',
                      opacity: 1
                    }}
                  ></button>
                ))}
              </div>
            </div>
          ) : (
            <img 
              src={displayImage} 
              alt={nombre} 
              className="img-fluid rounded-4 shadow-lg" 
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = placeholderImage }}
            />
          )}
        </div>
        <div className="col-md-6">
          <h1 className="mb-3" style={{ color: '#8B4513' }}>{nombre}</h1>
          <p className="text-muted">{descripcion}</p>
          <div className="d-flex align-items-center gap-3 my-3">
            <span className="badge bg-secondary text-capitalize">{categoria}</span>
            {brand && <span className="badge bg-info text-dark text-capitalize">{brand}</span>}
          </div>
          <p className="fs-4 fw-bold" style={{ color: '#A0522D' }}>{formatearPrecio(precio)}</p>
          <p className="text-muted">Stock: {stock}</p>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary btn-lg rounded-pill fw-bold" onClick={agregarCarrito}>
              <i className="bi bi-cart-plus me-2"></i>
              Agregar al carrito
            </button>
            <button className="btn btn-outline-danger btn-lg rounded-pill fw-bold" onClick={agregarFavorito}>
              <i className="bi bi-heart me-2"></i>
              Agregar a favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle