import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function Carrito() {
  const navigate = useNavigate()
  const { items, subtotal, fetch, update, remove, checkout } = useCartStore()
  const [processing, setProcessing] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch().catch(() => {})
  }, [])

  async function handleQtyChange(productId, qty) {
    const value = Math.max(0, Number(qty || 0))
    await update(productId, value)
  }
  async function handleRemove(productId) {
    await remove(productId)
  }
  // Función auxiliar para obtener la URL de la imagen del producto
  function getProductImage(product) {
    // Debug: ver qué estructura tiene el producto
    console.log('Debug Producto (Carrito):', product)
    
    if (!product) {
      return ''
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
      return ''
    }
    
    // Si es un Array: devolver la propiedad .url o .path del primer elemento
    if (Array.isArray(imageData)) {
      if (imageData.length === 0) {
        console.log('Array de imágenes vacío')
        return ''
      }
      
      const firstItem = imageData[0]
      console.log('Primer elemento del array:', firstItem)
      
      // Verificar si tiene .url o .path
      if (firstItem && typeof firstItem === 'object') {
        const url = firstItem.url || firstItem.path || ''
        console.log('URL extraída del array:', url)
        return url
      }
      
      // Si el primer elemento es un string, usarlo directamente
      if (typeof firstItem === 'string') {
        console.log('Primer elemento es string:', firstItem)
        return firstItem
      }
      
      return ''
    }
    
    // Si es un Objeto: devolver la propiedad .url o .path directamente
    if (typeof imageData === 'object') {
      const url = imageData.url || imageData.path || ''
      console.log('URL extraída del objeto:', url)
      return url
    }
    
    // Si es un string, usarlo directamente
    if (typeof imageData === 'string') {
      console.log('Imagen es string:', imageData)
      return imageData
    }
    
    // Si no coincide con ningún caso, retornar string vacío
    console.log('Tipo de dato no reconocido:', typeof imageData)
    return ''
  }

  async function handleCheckout() {
    try {
      setProcessing(true)
      setMsg('')
      const { orderId, total } = await checkout()
      setMsg(`¡Pedido simulado #${orderId} creado con éxito! Total: ${formatearPrecio(total)}. El administrador gestionará tu pedido.`)
      
      // Redirigir a mis pedidos después de 3 segundos
      setTimeout(() => {
        navigate('/mis-pedidos')
      }, 3000)
    } catch (e) {
      setMsg('Error al procesar el pedido. Por favor, intenta de nuevo.')
      console.error('Error en checkout:', e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Carrito</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-cart fs-1 d-block mb-3" style={{ color: '#A0522D' }}></i>
          <p>Tu carrito está vacío. Agrega productos desde el listado.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.product.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getProductImage(i.product) || ''}
                            alt={i.product.name}
                            className="rounded"
                            style={{ width: 64, height: 64, objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                          <div>
                            <div className="fw-semibold" style={{ color: '#8B4513' }}>{i.product.name}</div>
                            <div className="small text-muted text-capitalize">{i.product.category} · {i.product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center" style={{ maxWidth: 120 }}>
                        <input
                          type="number"
                          min={0}
                          className="form-control form-control-sm text-center"
                          value={i.qty}
                          onChange={(e) => handleQtyChange(i.product.id, e.target.value)}
                        />
                      </td>
                      <td className="text-end">{formatearPrecio(i.price_snapshot)}</td>
                      <td className="text-end">{formatearPrecio(i.qty * i.price_snapshot)}</td>
                      <td className="text-end">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(i.product.id)}>
                          <i className="bi bi-trash me-1"></i> Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#8B4513' }}>Resumen</h5>
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span className="fw-bold" style={{ color: '#A0522D' }}>{formatearPrecio(subtotal)}</span>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3"
                  disabled={processing || items.length === 0}
                  onClick={handleCheckout}
                >
                  {processing ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-bag-check me-2"></i>
                  )}
                  Finalizar compra
                </button>
                {msg && (
                  <div className="alert alert-success mt-3" role="alert">{msg}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrito