import { create } from 'zustand'
import api, { apiUpload } from '../api/api'
import type { Product, ApiResponse } from '../types/contracts'

interface FavoritesState {
  list: Product[]
  fetch: () => Promise<void>
  add: (productId: number) => Promise<void>
  remove: (productId: number) => Promise<void>
}

// Persistencia local como fallback cuando no hay sesión o backend
const LOCAL_KEY = 'local_favorites'
function loadLocal(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}
function saveLocal(list: Product[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {}
}

function normalizeProduct(x: any): Product {
  return {
    id: Number(x.id ?? 0),
    name: String(x.name ?? x.nombre ?? ''),
    description: String(x.description ?? x.descripcion ?? ''),
    price: Number(x.price ?? x.precio ?? 0),
    stock: Number(x.stock ?? 0),
    brand: String(x.brand ?? x.marca ?? ''),
    category: String(x.category ?? x.categoria ?? ''),
    images: Array.isArray(x.image)
      ? x.image.map((img: any) => img?.url || img?.path || img)
      : Array.isArray(x.images)
      ? x.images
      : x.imagen
      ? [x.imagen]
      : [],
    created_at: x.created_at,
    updated_at: x.updated_at,
  }
}

async function fetchProductAny(productId: number): Promise<Product | null> {
  const id = Number(productId)
  // Endpoint singular (API UJ0_Qj9c): GET /product/{product_id}
  const tries: Array<() => Promise<any>> = [
    () => api.get(`/product/${id}`), // API UJ0_Qj9c usa endpoints singulares
  ]
  let lastErr: any = null
  for (const t of tries) {
    try {
      const res = await t()
      const raw = res.data?.data ?? res.data
      return normalizeProduct(raw)
    } catch (err: any) {
      lastErr = err
    }
  }
  if (import.meta.env.DEV && lastErr) {
    const status = lastErr?.response?.status
    console.warn('[favoritesStore] No se pudo obtener producto', id, 'status:', status)
  }
  return null
}

function shouldFallback(e: any) {
  const status = e?.response?.status
  const code = e?.response?.data?.code ?? e?.response?.data?.error?.code
  return status === 401 || status === 404 || code === 'UNAUTHORIZED' || code === 'ERROR_CODE_NOT_FOUND'
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  list: [],
  async fetch() {
    try {
      const res = await api.get<unknown, { data: ApiResponse<any[]> }>('/favorite')
      // El endpoint ahora devuelve una lista donde cada objeto tiene _product anidado
      const favorites = res.data?.data ?? null
      if (Array.isArray(favorites)) {
        // Mapear directamente la respuesta, extrayendo _product de cada favorito
        const products = favorites
          .map((favorite) => {
            // Extraer los datos del producto de la propiedad anidada _product
            const productData = favorite._product ?? favorite.product ?? favorite
            // Normalizar el producto usando la función helper
            return normalizeProduct(productData)
          })
          .filter((p) => p.id > 0) // Filtrar productos inválidos
        set({ list: products })
        saveLocal(products) // Guardar en localStorage como respaldo
      } else {
        // Si la respuesta está vacía o no es un array, usar array vacío
        set({ list: [] })
      }
    } catch (e) {
      // Fallback: cargar desde localStorage
      const list = loadLocal()
      set({ list })
    }
  },
  async add(productId) {
    try {
      await api.post('/favorite', { productId })
      const prod = await fetchProductAny(productId)
      const { list } = get()
      if (!list.find(p => p.id === productId)) {
        const placeholder: Product = {
          id: Number(productId),
          name: '',
          description: '',
          price: 0,
          stock: 0,
          brand: '',
          category: '',
          images: [],
          created_at: undefined as any,
          updated_at: undefined as any,
        }
        const updated = [...list, prod ?? placeholder]
        set({ list: updated })
        saveLocal(updated)
      }
    } catch (e) {
      // Fallback local cuando no hay sesión o endpoint
      if (!shouldFallback(e)) throw e
      const prod = await fetchProductAny(productId)
      const { list } = get()
      if (!list.find(p => p.id === productId)) {
        const placeholder: Product = {
          id: Number(productId),
          name: '',
          description: '',
          price: 0,
          stock: 0,
          brand: '',
          category: '',
          images: [],
          created_at: undefined as any,
          updated_at: undefined as any,
        }
        const updated = [...list, prod ?? placeholder]
        set({ list: updated })
        saveLocal(updated)
      }
    }
  },
  async remove(productId) {
    try {
      await api.delete(`/favorite/${productId}`)
    } catch (e) {
      if (!shouldFallback(e)) throw e
      // continuar al fallback local
    }
    const { list } = get()
    const updated = list.filter(p => p.id !== productId)
    set({ list: updated })
    saveLocal(updated)
  },
}))