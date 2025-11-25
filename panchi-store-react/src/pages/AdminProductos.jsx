import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../api/product'
import { buildImageUrl } from '../utils/imageUtils'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function cargar() {
    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminProductos] Cargando productos usando getProducts()')
      }
      const raw = await getProducts() // Usar función centralizada
      const list = Array.isArray(raw) ? raw.map((x) => ({
        id: x.id,
        name: x.name ?? x.nombre ?? '',
        description: x.description ?? x.descripcion ?? '',
        price: Number(x.price ?? 0),
        stock: Number(x.stock ?? 0),
        brand: x.brand ?? x.marca ?? '',
        category: x.category ?? x.categoria ?? '',
        images: Array.isArray(x.image)
          ? x.image.map((img) => buildImageUrl(typeof img === 'string' ? img : (img?.url || img?.path || '')))
          : (Array.isArray(x.images) 
              ? x.images.map((img) => buildImageUrl(typeof img === 'string' ? img : (img?.url || img?.path || '')))
              : (x.imagen ? [buildImageUrl(x.imagen)] : [])),
      })) : []
      setProductos(list)
    } catch (e) {
      if (import.meta.env.DEV) {
        const status = e?.response?.status
        console.error('[AdminProductos] Error al cargar productos:', { status, error: e })
      }
      setError('No se pudo cargar el listado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminProductos] Eliminando producto usando deleteProduct()')
      }
      await deleteProduct(id) // Usar función centralizada
      await cargar()
    } catch (e) {
      if (import.meta.env.DEV) {
        const status = e?.response?.status
        console.error('[AdminProductos] Error al eliminar producto:', { status, error: e })
      }
      alert('No se pudo eliminar')
    }
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Admin: Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo producto
        </Link>
      </div>

      {loading && (
        <div className="text-center text-muted">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td className="text-capitalize">{p.category}</td>
                  <td>{p.brand}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td className="text-end">
                    <div className="btn-group">
                      <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button onClick={() => eliminar(p.id)} className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProductos