import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../stores/cartStore'
import { useFavoritesStore } from '../stores/favoritesStore'
import { getProducts } from '../api/product'

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
    // Cargar favoritos al iniciar con un pequeño delay para evitar rate limiting
    // Solo cargar si el usuario está autenticado
    const token = localStorage.getItem('auth_token')
    if (token) {
      setTimeout(() => {
        favorites.fetch().catch(() => {})
      }, 500) // Delay de 500ms para evitar rate limiting
    }
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
          console.info('[Productos] Solicitando productos...')
        }
        const raw = await getProducts() // Usar función centralizada de products.ts
        if (import.meta.env.DEV) {
          console.log('[Productos] Datos raw:', raw)
          console.log('[Productos] Es array?', Array.isArray(raw))
        }
        const list = Array.isArray(raw)
          ? raw.map((x) => {
              if (import.meta.env.DEV) {
                console.log('[Productos] Procesando producto:', x)
              }
              return {
                id: x.id,
                name: x.name ?? x.nombre ?? '',
                description: x.description ?? x.descripcion ?? '',
                price: Number(x.price ?? 0),
                stock: Number(x.stock ?? 0),
                brand: x.brand ?? x.marca ?? '',
                category: x.category ?? x.categoria ?? '',
                // Pasar las imágenes tal como vienen del backend
                // El backend usa 'image' (singular) como array de objetos con .url
                // Mantener el campo original 'image' para que ProductCard lo procese correctamente
                image: x.image ?? x.images ?? x.imagen ?? [],
              }
            })
          : []
        if (mounted) {
          setAll(list)
          if (import.meta.env.DEV) {
            console.info('[Productos] Productos cargados:', list.length, 'productos')
            console.log('[Productos] Lista final:', list)
          }
        }
      } catch (e) {
        const status = e?.response?.status
        let errorMessage = e?.response?.data?.message ?? e?.message ?? 'Error desconocido'
        
        // Manejo especial para rate limiting (429)
        if (status === 429 || e?.isRateLimit) {
          errorMessage = 'Demasiadas solicitudes a la API. Por favor, espera unos segundos y recarga la página. Tu plan de Xano permite 10 solicitudes cada 20 segundos.'
        }
        
        if (import.meta.env.DEV) {
          console.error('[Productos] Error al cargar productos:', {
            status,
            message: errorMessage,
            error: e,
            response: e?.response,
            data: e?.response?.data
          })
        }
        setError(`No se pudieron cargar los productos: ${errorMessage}`)
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
    // Usar optional chaining y valor por defecto para evitar errores si favorites.list es undefined
    return (favorites.list || []).some(fav => fav.id === Number(id))
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
      {loading && (
        <div className="text-center mt-3 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Cargando productos...
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && productos.length === 0 && (
        <div className="alert alert-info mt-3" role="alert">
          No se encontraron productos. {all.length === 0 ? 'La base de datos está vacía o no se pudo conectar con la API.' : 'Intenta ajustar los filtros de búsqueda.'}
        </div>
      )}
      {!loading && !error && productos.length > 0 && (
        <>
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
                Cargar más ({productos.length} de {total})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Productos