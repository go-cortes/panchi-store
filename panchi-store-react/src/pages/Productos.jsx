import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import api, { apiUpload } from '../api/api'
import { buildImageUrl } from '../utils/imageUtils'

function Productos() {
  const [categoria, setCategoria] = useState('todas')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const cart = useCartStore()
  const favorites = useFavoritesStore()
  const debounceRef = useRef(null)
  const [all, setAll] = useState([])

  useEffect(() => {
    // Cargar favoritos al iniciar
    favorites.fetch().catch(() => {})
  }, [])

  useEffect(() => {
    // Debounce del término de búsqueda
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQ(q)
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q])

  useEffect(() => {
    // Cada vez que cambia categoría o búsqueda, reiniciar paginación y lista
    setPage(1)
    setProductos([])
  }, [categoria, debouncedQ])

  // Cargar todos los productos desde Xano y normalizar campos
  useEffect(() => {
    let mounted = true
    async function loadAll() {
      setLoading(true)
      setError('')
      try {
        if (import.meta.env.DEV) {
          console.info('[Productos] base:', api.defaults.baseURL, 'uploadBase:', apiUpload.defaults.baseURL, 'trying GET /products')
        }
        const res = await api.get('/products')
        const raw = res.data?.data ?? res.data
        const list = Array.isArray(raw)
          ? raw.map((x) => ({
              id: x.id,
              name: x.name ?? x.nombre ?? '',
              description: x.description ?? x.descripcion ?? '',
              price: Number(x.price ?? 0),
              stock: Number(x.stock ?? 0),
              brand: x.brand ?? x.marca ?? '',
              category: x.category ?? x.categoria ?? '',
              images: Array.isArray(x.image)
                ? x.image.map((img) => buildImageUrl(typeof img === 'string' ? img : (img?.url || img?.path || '')))
                : Array.isArray(x.images)
                ? x.images.map((img) => buildImageUrl(typeof img === 'string' ? img : (img?.url || img?.path || '')))
                : x.imagen
                ? [buildImageUrl(x.imagen)]
                : [],
            }))
          : []
        if (mounted) setAll(list)
      } catch (e) {
        try {
          if (import.meta.env.DEV) {
            const status = e?.response?.status
            console.warn('[Productos] GET /products failed, status:', status, 'trying GET /product')
          }
          const res = await api.get('/product')
          const raw = res.data?.data ?? res.data
          const list = Array.isArray(raw)
            ? raw.map((x) => ({
                id: x.id,
                name: x.name ?? x.nombre ?? '',
                description: x.description ?? x.descripcion ?? '',
                price: Number(x.price ?? 0),
                stock: Number(x.stock ?? 0),
                brand: x.brand ?? x.marca ?? '',
                category: x.category ?? x.categoria ?? '',
                images: Array.isArray(x.image)
                  ? x.image.map((img) => img?.url || img?.path || img)
                  : Array.isArray(x.images)
                  ? x.images
                  : x.imagen
                  ? [x.imagen]
                  : [],
              }))
            : []
          if (mounted) setAll(list)
        } catch (e2) {
          try {
            if (import.meta.env.DEV) {
              const status = e2?.response?.status
              console.warn('[Productos] GET /product failed on base, status:', status, 'trying uploadBase GET /product')
            }
            const res = await apiUpload.get('/product')
            const raw = res.data?.data ?? res.data
            const list = Array.isArray(raw)
              ? raw.map((x) => ({
                  id: x.id,
                  name: x.name ?? x.nombre ?? '',
                  description: x.description ?? x.descripcion ?? '',
                  price: Number(x.price ?? 0),
                  stock: Number(x.stock ?? 0),
                  brand: x.brand ?? x.marca ?? '',
                  category: x.category ?? x.categoria ?? '',
                  images: Array.isArray(x.image)
                    ? x.image.map((img) => img?.url || img?.path || img)
                    : Array.isArray(x.images)
                    ? x.images
                    : x.imagen
                    ? [x.imagen]
                    : [],
                }))
              : []
            if (mounted) setAll(list)
          } catch (e3) {
            console.error(e3)
            setError('No se pudieron cargar los productos')
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadAll()
    return () => {
      mounted = false
    }
  }, [])

  // Filtro local por categoría y texto de búsqueda
  const filtered = useMemo(() => {
    let r = all
    if (categoria && categoria !== 'todas') {
      r = r.filter((p) => String(p.category || '').toLowerCase() === String(categoria).toLowerCase())
    }
    if (debouncedQ) {
      const term = debouncedQ.toLowerCase()
      r = r.filter(
        (p) =>
          String(p.name || '').toLowerCase().includes(term) ||
          String(p.description || '').toLowerCase().includes(term)
      )
    }
    return r
  }, [all, categoria, debouncedQ])

  // Paginación local ("Cargar más")
  useEffect(() => {
    setTotal(filtered.length)
    const next = filtered.slice(0, limit * page)
    setProductos(next)
  }, [filtered, page, limit])

  async function addToCart(producto) {
    try {
      const id = producto?.id || producto?.productoId || producto?.productId
      if (!id) throw new Error('Producto sin id')
      await cart.add(Number(id), 1)
    } catch (e) {
      console.error('No se pudo agregar al carrito', e)
    }
  }

  async function addToFavorites(producto) {
    try {
      const id = producto?.id || producto?.productoId || producto?.productId
      if (!id) throw new Error('Producto sin id')
      await favorites.add(Number(id))
    } catch (e) {
      console.error('No se pudo agregar a favoritos', e)
    }
  }

  async function removeFromFavorites(producto) {
    try {
      const id = producto?.id || producto?.productoId || producto?.productId
      if (!id) throw new Error('Producto sin id')
      await favorites.remove(Number(id))
    } catch (e) {
      console.error('No se pudo quitar de favoritos', e)
    }
  }

  function isProductFavorite(producto) {
    const id = producto?.id || producto?.productoId || producto?.productId
    return favorites.list.some(fav => fav.id === Number(id))
  }

  function limpiarFiltros() {
    setCategoria('todas')
    setQ('')
    setPage(1)
    setProductos([])
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0" style={{ color: '#8B4513' }}>Productos</h1>
        <div>
          <button className="btn btn-outline-secondary btn-sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Filtrar por categoría</label>
          <div className="d-flex flex-wrap gap-2">
            {[
              ['todas', 'Todas'],
              ['alimento', 'Alimento'],
              ['juguete', 'Juguetes'],
              ['accesorio', 'Accesorios'],
              ['higiene', 'Higiene'],
              ['ropa', 'Ropa'],
              ['medicina', 'Medicina'],
            ].map(([value, label]) => (
              <button
                key={value}
                className={`btn btn-sm ${categoria === value ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setCategoria(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Buscar productos</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o descripción"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Listado */}
      <div className="row g-4">
        {productos.map(p => (
          <ProductCard 
            key={p.id} 
            producto={p} 
            onAdd={addToCart}
            onAddToFavorites={addToFavorites}
            onRemoveFromFavorites={removeFromFavorites}
            isFavorite={isProductFavorite(p)}
          />
        ))}
      </div>

      {/* Cargar más */}
      {productos.length < total && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-secondary"
            disabled={loading}
            onClick={() => setPage(p => p + 1)}
          >
            Cargar más
          </button>
        </div>
      )}
      {loading && (
        <div className="text-center mt-3 text-muted">Cargando...</div>
      )}
      {error && (
        <div className="alert alert-danger mt-3" role="alert">{error}</div>
      )}
    </div>
  )
}

export default Productos