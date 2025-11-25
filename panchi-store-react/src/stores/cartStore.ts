import { create } from 'zustand'
import api, { apiUpload } from '../api/api'
import type { Cart, CartItem, Product, ApiResponse } from '../types/contracts'

interface CartState extends Cart {
  fetch: () => Promise<void>
  add: (productId: number, qty?: number) => Promise<void>
  update: (productId: number, qty: number) => Promise<void>
  remove: (productId: number) => Promise<void>
  checkout: () => Promise<{ orderId: string; total: number }>
}

// Helpers: almacenamiento local como fallback cuando no hay sesión o backend
const LOCAL_KEY = 'local_cart'
function loadLocal(): Cart {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { items: [], subtotal: 0 }
    const cart = JSON.parse(raw) as Cart
    const subtotal = (cart.items || []).reduce((s, i) => s + i.qty * i.price_snapshot, 0)
    return { items: cart.items || [], subtotal }
  } catch {
    return { items: [], subtotal: 0 }
  }
}
function saveLocal(cart: Cart) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cart))
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
  const tries: Array<() => Promise<any>> = [
    () => api.get(`/products/${id}`),
    () => api.get(`/product/${id}`),
    () => apiUpload.get(`/product/${id}`),
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
  // Intento con base absoluta si está configurada
  try {
    const base = import.meta.env.VITE_PRODUCTS_API_URL || import.meta.env.VITE_API_URL
    if (base) {
      const res = await api.get(`${base}/products/${id}`)
      const raw = res.data?.data ?? res.data
      return normalizeProduct(raw)
    }
  } catch {}
  try {
    const base = import.meta.env.VITE_PRODUCTS_API_URL || import.meta.env.VITE_API_URL
    if (base) {
      const res = await api.get(`${base}/product/${id}`)
      const raw = res.data?.data ?? res.data
      return normalizeProduct(raw)
    }
  } catch {}
  if (import.meta.env.DEV && lastErr) {
    const status = lastErr?.response?.status
    console.warn('[cartStore] No se pudo obtener producto', id, 'status:', status)
  }
  return null
}

function shouldFallback(e: any) {
  const status = e?.response?.status
  const code = e?.response?.data?.code ?? e?.response?.data?.error?.code
  return status === 401 || status === 404 || code === 'UNAUTHORIZED' || code === 'ERROR_CODE_NOT_FOUND'
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  async fetch() {
    try {
      const res = await api.get<unknown, { data: ApiResponse<Cart> }>('/me/cart')
      const cart = res.data.data
      set({ items: cart.items, subtotal: cart.subtotal })
    } catch (e) {
      const local = loadLocal()
      set({ items: local.items, subtotal: local.subtotal })
    }
  },
  async add(productId, qty = 1) {
    try {
      const res = await api.post<unknown, { data: ApiResponse<Cart> }>('/me/cart/items', {
        productId,
        qty,
      })
      const cart = res.data.data
      set({ items: cart.items, subtotal: cart.subtotal })
    } catch (e) {
      // Fallback local
      if (!shouldFallback(e)) throw e
      const product = await fetchProductAny(productId)
      if (!product) return
      const { items } = get()
      const existingIdx = items.findIndex(i => i.product.id === productId)
      const updatedItems: CartItem[] = [...items]
      if (existingIdx >= 0) {
        updatedItems[existingIdx] = {
          ...updatedItems[existingIdx],
          qty: updatedItems[existingIdx].qty + qty,
        }
      } else {
        updatedItems.push({ product: product!, qty, price_snapshot: product!.price })
      }
      const subtotal = updatedItems.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
      const updatedCart: Cart = { items: updatedItems, subtotal }
      saveLocal(updatedCart)
      set(updatedCart)
    }
  },
  async update(productId, qty) {
    try {
      const res = await api.patch<unknown, { data: ApiResponse<Cart> }>(`/me/cart/items/${productId}`, { qty })
      const cart = res.data.data
      set({ items: cart.items, subtotal: cart.subtotal })
    } catch (e) {
      const { items } = get()
      const idx = items.findIndex(i => i.product.id === productId)
      if (idx < 0) return
      const updatedItems: CartItem[] = [...items]
      if (qty <= 0) updatedItems.splice(idx, 1)
      else updatedItems[idx] = { ...updatedItems[idx], qty }
      const subtotal = updatedItems.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
      const updatedCart: Cart = { items: updatedItems, subtotal }
      saveLocal(updatedCart)
      set(updatedCart)
    }
  },
  async remove(productId) {
    try {
      await api.delete(`/me/cart/items/${productId}`)
      const res = await api.get<unknown, { data: ApiResponse<Cart> }>('/me/cart')
      const cart = res.data.data
      set({ items: cart.items, subtotal: cart.subtotal })
    } catch (e) {
      const { items } = get()
      const updated = items.filter(i => i.product.id !== productId)
      const subtotal = updated.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
      const updatedCart: Cart = { items: updated, subtotal }
      saveLocal(updatedCart)
      set(updatedCart)
    }
  },
  async checkout() {
    const { items, subtotal } = get()
    try {
      // Primero intentar con el endpoint estándar de checkout
      const res = await api.post<unknown, { data: ApiResponse<{ orderId: string; total: number }> }>(
        '/me/cart/checkout',
        {}
      )
      const { orderId, total } = res.data.data
      set({ items: [], subtotal: 0 })
      return { orderId, total }
    } catch (e) {
      // Si falla, crear orden directamente en Xano
      try {
        // Preparar items para la orden
        const orderItems = items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.qty,
          price: item.price_snapshot,
          subtotal: item.qty * item.price_snapshot,
        }))

        // Crear orden en Xano
        const orderPayload = {
          status: 'Pendiente',
          total: subtotal,
          items: orderItems,
        }

        // Intentar diferentes endpoints para crear orden
        const endpoints = ['/orders', '/order', '/me/orders']
        let orderRes = null
        
        for (const endpoint of endpoints) {
          try {
            orderRes = await api.post(endpoint, orderPayload)
            break
          } catch (err) {
            if (err?.response?.status !== 404) {
              throw err
            }
            continue
          }
        }

        // Si no funcionó con api, intentar con apiUpload
        if (!orderRes) {
          for (const endpoint of endpoints) {
            try {
              orderRes = await apiUpload.post(endpoint, orderPayload)
              break
            } catch (err) {
              if (err?.response?.status !== 404) {
                throw err
              }
              continue
            }
          }
        }

        const orderData = orderRes?.data?.data ?? orderRes?.data ?? {}
        const orderId = orderData?.id ?? `ORD-${Date.now()}`

        // Limpiar carrito
        const cleared: Cart = { items: [], subtotal: 0 }
        saveLocal(cleared)
        set(cleared)

        return { orderId, total: subtotal }
      } catch (orderError) {
        // Si también falla crear orden, al menos limpiar carrito localmente
        console.error('Error creando orden:', orderError)
      const orderId = `ORD-${Date.now()}`
      const cleared: Cart = { items: [], subtotal: 0 }
      saveLocal(cleared)
      set(cleared)
      return { orderId, total: subtotal }
      }
    }
  },
}))