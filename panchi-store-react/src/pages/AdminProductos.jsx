import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { apiUpload } from '../api/api'
import { buildImageUrl } from '../utils/imageUtils'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const base = import.meta.env.VITE_PRODUCTS_API_URL || import.meta.env.VITE_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:tP1BBSGu'

  async function cargar() {
    setLoading(true)
    setError(null)
    try {
      if (import.meta.env.DEV) {
        console.info('[AdminProductos] base:', api.defaults.baseURL, 'uploadBase:', apiUpload.defaults.baseURL, 'trying GET /products')
      }
      const res = await api.get('/products')
      const raw = res.data?.data ?? res.data
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
      try {
        if (import.meta.env.DEV) {
          const status = e?.response?.status
          console.warn('[AdminProductos] GET /products failed, status:', status, 'trying GET /product')
        }
        const res = await api.get('/product')
        const raw = res.data?.data ?? res.data
        const list = Array.isArray(raw) ? raw.map((x) => ({
          id: x.id,
          name: x.name ?? x.nombre ?? '',
          description: x.description ?? x.descripcion ?? '',
          price: Number(x.price ?? 0),
          stock: Number(x.stock ?? 0),
          brand: x.brand ?? x.marca ?? '',
          category: x.category ?? x.categoria ?? '',
          images: Array.isArray(x.image)
            ? x.image.map((img) => (img?.url || img?.path || img))
            : (Array.isArray(x.images) ? x.images : (x.imagen ? [x.imagen] : [])),
        })) : []
        setProductos(list)
      } catch (e2) {
        try {
          if (import.meta.env.DEV) {
            const status = e2?.response?.status
            console.warn('[AdminProductos] GET /product failed on main base, status:', status, 'trying uploadBase GET /product')
          }
          const res = await apiUpload.get('/product')
          const raw = res.data?.data ?? res.data
          const list = Array.isArray(raw) ? raw.map((x) => ({
            id: x.id,
            name: x.name ?? x.nombre ?? '',
            description: x.description ?? x.descripcion ?? '',
            price: Number(x.price ?? 0),
            stock: Number(x.stock ?? 0),
            brand: x.brand ?? x.marca ?? '',
            category: x.category ?? x.categoria ?? '',
            images: Array.isArray(x.image)
              ? x.image.map((img) => (img?.url || img?.path || img))
              : (Array.isArray(x.images) ? x.images : (x.imagen ? [x.imagen] : [])),
          })) : []
          setProductos(list)
        } catch (e3) {
          setError('No se pudo cargar el listado')
        }
      }
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
        console.info('[AdminProductos] DELETE /products/:id on base:', api.defaults.baseURL)
      }
      await api.delete(`/products/${id}`)
      await cargar()
    } catch (e) {
      try {
        if (import.meta.env.DEV) {
          const status = e?.response?.status
          console.warn('[AdminProductos] DELETE /products/:id failed, status:', status, 'trying /product/:id')
        }
        await api.delete(`/product/${id}`)
        await cargar()
      } catch (e2) {
        try {
          if (import.meta.env.DEV) {
            const status = e2?.response?.status
            console.warn('[AdminProductos] DELETE /product/:id failed on base, status:', status, 'trying uploadBase')
          }
          await apiUpload.delete(`/product/${id}`)
          await cargar()
        } catch (e3) {
          alert('No se pudo eliminar')
        }
      }
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