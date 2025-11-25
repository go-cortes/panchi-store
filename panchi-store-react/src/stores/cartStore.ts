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
  // Endpoint singular (API tP1BBSGu): GET /product/{product_id}
  const tries: Array<() => Promise<any>> = [
    () => api.get(`/product/${id}`), // API tP1BBSGu usa endpoints singulares
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
  if ((import.meta as any).env?.DEV && lastErr) {
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

function isRateLimitError(e: any): boolean {
  return e?.response?.status === 429
}

function mapCartResponse(cartData: any): Cart {
  // La estructura de Xano es: { id: 123, items: [{ id: 456, qty: 1, product: {...} }] }
  // También puede venir como: { items: [...] } o dentro de data
  const cartItems = cartData?.items ?? cartData?._cart_item_of_cart ?? []
  
  console.log('[cartStore] Carrito recibido:', JSON.stringify(cartData, null, 2))
  console.log('[cartStore] Items encontrados:', cartItems.length)
  
  const items: CartItem[] = cartItems
    .map((item: any) => {
      // Extraer el producto de la propiedad anidada product (estructura de Xano)
      const productData = item.product ?? item._product
      
      if (!productData) {
        // Si no hay producto anidado, crear un producto básico con la información disponible
        // NO hacer peticiones individuales para evitar 429
        const productId = item.product_id ?? item.productId ?? 0
        const priceFromItem = item.price_snapshot ?? item.price ?? item.precio ?? 0
        
        if (productId > 0) {
          // Crear un producto básico temporal con la información disponible
          const basicProduct: Product = {
            id: Number(productId),
            name: `Producto #${productId}`, // Nombre temporal
            description: '',
            price: Number(priceFromItem),
            stock: 0,
            brand: '',
            category: '',
            images: [],
          }
          
          console.log('[cartStore] Item sin producto anidado, usando producto básico para ID:', productId)
          
          const cartItem: CartItem = {
            product: basicProduct,
            qty: Number(item.qty ?? item.quantity ?? 0),
            price_snapshot: Number(priceFromItem),
          }
          
          return cartItem
        } else {
          console.warn('[cartStore] Item sin producto y sin product_id:', item)
          return null
        }
      }
      
      // Normalizar el producto
      const product = normalizeProduct(productData)
      
      // Crear el CartItem
      // Xano devuelve qty directamente en el item
      // price_snapshot puede venir en el item o usar el precio del producto
      // Intentar múltiples campos posibles para el precio
      const priceFromItem = item.price_snapshot ?? item.price ?? item.precio ?? item.product_price
      const finalPrice = Number(priceFromItem ?? product.price ?? 0)
      
      const cartItem: CartItem = {
        product,
        qty: Number(item.qty ?? item.quantity ?? 0),
        price_snapshot: finalPrice,
      }
      
      console.log('[cartStore] Item mapeado:', {
        productId: product.id,
        productName: product.name,
        qty: cartItem.qty,
        price_snapshot: cartItem.price_snapshot,
      })
      
      return cartItem
    })
    .filter((item: CartItem | null): item is CartItem => item !== null && item.product.id > 0)
  
  // Calcular subtotal
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price_snapshot, 0)
  
  console.log('[cartStore] Carrito mapeado:', {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.qty, 0),
    subtotal,
  })
  
  return { items, subtotal }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  async fetch() {
    // Verificar qué token se está usando
    const token = localStorage.getItem('auth_token')
    const userRaw = localStorage.getItem('auth_user')
    const user = userRaw ? JSON.parse(userRaw) : null
    
    // Si no hay token, usar carrito local
    if (!token) {
      if ((import.meta as any).env?.DEV) {
        console.log('[cartStore] No hay token, usando carrito local')
      }
      const local = loadLocal()
      set({ items: local.items, subtotal: local.subtotal })
      return
    }
    
    try {
      if ((import.meta as any).env?.DEV) {
        console.log('[cartStore] Fetching cart for user:', {
          userId: user?.id,
          userEmail: user?.email,
          userRole: user?.role,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        })
      }
      
      const res = await api.get<unknown, { data: ApiResponse<any> | any }>('/cart')
      
      // Xano puede devolver la estructura directamente o dentro de data
      // Estructura esperada: { id: 123, items: [...] } o { data: { id: 123, items: [...] } }
      const cartData = res.data?.data ?? res.data ?? null
      
      console.log('[cartStore] Respuesta completa de GET /cart:', JSON.stringify(res.data, null, 2))
      console.log('[cartStore] CartData extraído:', cartData)
      console.log('[cartStore] Cart ID (si existe):', cartData?.id)
      console.log('[cartStore] User ID del carrito (si existe):', cartData?.user_id ?? cartData?.userId ?? cartData?.user?.id)
      
      if (cartData) {
        // Verificar que tenga items (estructura de Xano)
        if (cartData.items && Array.isArray(cartData.items) && cartData.items.length > 0) {
          console.log('[cartStore] Items encontrados en cartData.items:', cartData.items.length)
          // Log del primer item para ver su estructura
          console.log('[cartStore] Estructura del primer item:', JSON.stringify(cartData.items[0], null, 2))
          
        // Mapear directamente la respuesta - UNA SOLA PETICIÓN
        const cart = mapCartResponse(cartData)
          
          console.log('[cartStore] Carrito final a guardar:', {
            itemsCount: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.qty, 0),
            subtotal: cart.subtotal,
          })
          
          set({ items: cart.items, subtotal: cart.subtotal })
          saveLocal(cart) // Guardar en localStorage como respaldo
        } else {
          // Si el carrito viene sin items, intentar obtenerlos por separado
          console.log('[cartStore] Carrito sin items en la respuesta, intentando obtener items por separado...')
          const cartId = cartData.id
          
          if (cartId) {
            try {
              // Intentar obtener todos los cart_items y filtrar por cart_id
              // Xano típicamente usa /cart_item sin parámetros y devuelve todos los items
              console.log('[cartStore] Obteniendo todos los cart_items para filtrar por cart_id:', cartId)
              
              const itemsRes = await api.get('/cart_item')
              const itemsData = itemsRes.data?.data ?? itemsRes.data
              
              console.log('[cartStore] Respuesta de GET /cart_item:', JSON.stringify(itemsData, null, 2))
              
              let cartItems: any[] = []
              
              if (Array.isArray(itemsData)) {
                // Filtrar por cart_id Y user_id para asegurar que solo obtenemos items del usuario actual
                const currentUserId = user?.id
                cartItems = itemsData.filter((item: any) => {
                  const itemCartId = item.cart_id ?? item.cartId ?? item.cart?.id
                  const itemUserId = item.user_id ?? item.userId ?? item.user?.id ?? item.cart?.user_id
                  
                  // Debe coincidir con el cart_id Y (si hay user_id) con el user_id actual
                  const matchesCartId = itemCartId === cartId || Number(itemCartId) === Number(cartId)
                  const matchesUserId = !currentUserId || !itemUserId || itemUserId === currentUserId || Number(itemUserId) === Number(currentUserId)
                  
                  const matches = matchesCartId && matchesUserId
                  
                  if ((import.meta as any).env?.DEV && matches) {
                    console.log('[cartStore] Item encontrado para cart_id', cartId, 'user_id', currentUserId, ':', item)
                  }
                  return matches
                })
                console.log('[cartStore] Items filtrados por cart_id', cartId, 'y user_id', currentUserId, ':', cartItems.length, 'de', itemsData.length, 'totales')
              } else if (itemsData && Array.isArray(itemsData.items)) {
                cartItems = itemsData.items.filter((item: any) => {
                  const itemCartId = item.cart_id ?? item.cartId ?? item.cart?.id
                  return itemCartId === cartId || Number(itemCartId) === Number(cartId)
                })
              }
              
              if (cartItems.length > 0) {
                // Construir el carrito con los items obtenidos
                const cartWithItems = {
                  ...cartData,
                  items: cartItems,
                }
                
                const cart = mapCartResponse(cartWithItems)
                
                console.log('[cartStore] Carrito final a guardar (con items obtenidos por separado):', {
                  itemsCount: cart.items.length,
                  totalQuantity: cart.items.reduce((sum, item) => sum + item.qty, 0),
                  subtotal: cart.subtotal,
                })
                
                set({ items: cart.items, subtotal: cart.subtotal })
                saveLocal(cart)
              } else {
                console.log('[cartStore] No se encontraron items para este carrito (cart_id:', cartId, ')')
                console.log('[cartStore] Total de items obtenidos de /cart_item:', Array.isArray(itemsData) ? itemsData.length : 0)
                set({ items: [], subtotal: 0 })
              }
            } catch (itemsError: any) {
              console.error('[cartStore] Error al obtener items del carrito:', itemsError)
              console.error('[cartStore] Status:', itemsError?.response?.status)
              console.error('[cartStore] Response data:', itemsError?.response?.data)
              set({ items: [], subtotal: 0 })
            }
          } else {
            console.log('[cartStore] Carrito sin ID, no se pueden obtener items')
            set({ items: [], subtotal: 0 })
          }
        }
      } else {
        // Si la respuesta está vacía, usar valores por defecto
        console.log('[cartStore] Carrito vacío o sin datos')
        set({ items: [], subtotal: 0 })
      }
    } catch (e: any) {
      // Manejo especial para error 429 (Rate Limit)
      if (isRateLimitError(e)) {
        console.warn('[cartStore] Rate limit alcanzado. Por favor espere unos segundos.')
        // NO reintentar automáticamente para no bloquear la API
        // Cargar desde localStorage si está disponible
        const local = loadLocal()
        if (local.items.length > 0) {
          set({ items: local.items, subtotal: local.subtotal })
        }
        throw new Error('Por favor espere unos segundos antes de continuar.')
      }
      // Para otros errores, usar fallback local
      const local = loadLocal()
      set({ items: local.items, subtotal: local.subtotal })
    }
  },
  async add(productId, qty = 1) {
    // Asegurar que productId y qty sean enteros (Integer) como requiere el endpoint
    const productIdInt = Number.parseInt(String(productId), 10)
    const qtyInt = Number.parseInt(String(qty), 10)
    
    // Validar que los valores sean válidos
    if (isNaN(productIdInt) || productIdInt <= 0) {
      throw new Error('ID de producto inválido')
    }
    if (isNaN(qtyInt) || qtyInt <= 0) {
      throw new Error('Cantidad inválida')
    }
    
    // Verificar qué token se está usando al agregar
    const token = localStorage.getItem('auth_token')
    const userRaw = localStorage.getItem('auth_user')
    const user = userRaw ? JSON.parse(userRaw) : null
    
    // Log para debug en desarrollo
    if ((import.meta as any).env?.DEV) {
      console.log('[cartStore] Agregando al carrito:', { productId: productIdInt, qty: qtyInt })
      console.log('[cartStore] Usuario actual:', {
        userId: user?.id,
        userEmail: user?.email,
        userRole: user?.role,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      })
    }
    
    // POST /cart_item (singular) con payload exacto: { productId: Integer, qty: Integer }
    const payload = {
      productId: productIdInt,
      qty: qtyInt,
    }
    
    try {
      
      // POST /cart_item con payload exacto: { productId: Integer, qty: Integer }
      // Asegurar que axios serialice correctamente el JSON
      const res = await api.post<unknown, { data: ApiResponse<any> }>('/cart_item', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      // La respuesta puede venir como cart completo o como cart_item
      // Xano estructura: { id: 123, items: [{ id: 456, qty: 1, product: {...} }] }
      const responseData = res.data?.data ?? res.data ?? null
      
      console.log('[cartStore] Respuesta después de agregar:', JSON.stringify(res.data, null, 2))
      
      if (responseData) {
        // Si viene el carrito completo con items (estructura de Xano), mapearlo
        if (responseData.items && Array.isArray(responseData.items) && responseData.items.length > 0) {
          console.log('[cartStore] Carrito completo recibido después de agregar:', responseData)
          const cart = mapCartResponse(responseData)
          set({ items: cart.items, subtotal: cart.subtotal })
          saveLocal(cart)
        } else if (responseData._cart_item_of_cart || responseData.items) {
          // Formato alternativo con _cart_item_of_cart
          const cart = mapCartResponse(responseData)
          set({ items: cart.items, subtotal: cart.subtotal })
          saveLocal(cart)
        } else {
          // Si solo viene el item creado (con cart_id), obtener los items del carrito directamente
          console.log('[cartStore] Respuesta solo contiene el item creado:', responseData)
          const cartId = responseData.cart_id ?? responseData.cartId
          
          if (cartId) {
            console.log('[cartStore] Obteniendo items del carrito cart_id:', cartId)
            try {
              // Obtener todos los cart_items y filtrar por cart_id
              const itemsRes = await api.get('/cart_item')
              const itemsData = itemsRes.data?.data ?? itemsRes.data
              
              console.log('[cartStore] Todos los cart_items obtenidos:', Array.isArray(itemsData) ? itemsData.length : 0)
              
              if (Array.isArray(itemsData)) {
                // Filtrar por cart_id Y user_id para asegurar que solo obtenemos items del usuario actual
                const currentUserId = user?.id
                const cartItems = itemsData.filter((item: any) => {
                  const itemCartId = item.cart_id ?? item.cartId ?? item.cart?.id
                  const itemUserId = item.user_id ?? item.userId ?? item.user?.id ?? item.cart?.user_id
                  
                  // Debe coincidir con el cart_id Y (si hay user_id) con el user_id actual
                  const matchesCartId = itemCartId === cartId || Number(itemCartId) === Number(cartId)
                  const matchesUserId = !currentUserId || !itemUserId || itemUserId === currentUserId || Number(itemUserId) === Number(currentUserId)
                  
                  return matchesCartId && matchesUserId
                })
                
                console.log('[cartStore] Items del carrito', cartId, 'para usuario', currentUserId, ':', cartItems.length, 'de', itemsData.length, 'totales')
                
                if (cartItems.length > 0) {
                  // Obtener el carrito completo para tener todos los datos
                  const cartRes = await api.get('/cart')
                  const cartData = cartRes.data?.data ?? cartRes.data ?? {}
                  
                  // Construir el carrito con los items obtenidos
                  const cartWithItems = {
                    ...cartData,
                    items: cartItems,
                  }
                  
                  const cart = mapCartResponse(cartWithItems)
                  
                  console.log('[cartStore] Carrito actualizado después de agregar:', {
                    itemsCount: cart.items.length,
                    totalQuantity: cart.items.reduce((sum, item) => sum + item.qty, 0),
                    subtotal: cart.subtotal,
                  })
                  
                  set({ items: cart.items, subtotal: cart.subtotal })
                  saveLocal(cart)
                } else {
                  console.log('[cartStore] No se encontraron items, recargando carrito completo...')
                  await new Promise(resolve => setTimeout(resolve, 500))
                  await get().fetch()
                }
              } else {
                console.log('[cartStore] Respuesta de /cart_item no es un array, recargando carrito completo...')
                await new Promise(resolve => setTimeout(resolve, 500))
                await get().fetch()
              }
            } catch (itemsError: any) {
              console.error('[cartStore] Error al obtener items después de agregar:', itemsError)
              console.log('[cartStore] Recargando carrito completo como fallback...')
              await new Promise(resolve => setTimeout(resolve, 500))
              await get().fetch()
            }
          } else {
            console.log('[cartStore] Item creado sin cart_id, recargando carrito completo...')
            await new Promise(resolve => setTimeout(resolve, 500))
            await get().fetch()
          }
        }
      } else {
        // Si la respuesta está vacía, recargar el carrito completo
        console.log('[cartStore] Respuesta vacía, recargando carrito completo...')
        await new Promise(resolve => setTimeout(resolve, 500))
        await get().fetch()
      }
    } catch (e: any) {
      // Manejo especial para error 400 (Bad Request)
      if (e?.response?.status === 400) {
        const errorMessage = e?.response?.data?.message || e?.response?.data?.error?.message || 'Error al agregar producto al carrito. Verifica que el producto exista y esté disponible.'
        const fullErrorData = e?.response?.data
        
        console.error('[cartStore] Error 400 al agregar al carrito:', errorMessage)
        console.error('[cartStore] Payload enviado:', JSON.stringify({ productId: productIdInt, qty: qtyInt }))
        console.error('[cartStore] Respuesta completa del servidor:', JSON.stringify(fullErrorData, null, 2))
        console.error('[cartStore] Headers enviados:', {
          'Content-Type': 'application/json',
          'Authorization': e?.config?.headers?.Authorization ? 'Bearer [token presente]' : 'No encontrado',
        })
        
        // Si el error menciona "Unsupported parameter reference", es un problema de configuración en Xano
        if (errorMessage.includes('Unsupported parameter reference')) {
          console.error('[cartStore] ⚠️ Este error generalmente indica un problema en la configuración del endpoint en Xano.')
          console.error('[cartStore] Verifica que las Input Variables en Xano usen exactamente: productId y qty')
        }
        
        throw new Error(errorMessage)
      }
      
      // Manejo especial para error 429 (Rate Limit)
      if (isRateLimitError(e)) {
        console.warn('[cartStore] Rate limit alcanzado al agregar producto. Por favor espere unos segundos.')
        throw new Error('Por favor espere unos segundos antes de continuar.')
      }
      
      // Fallback local solo para errores de autenticación/not found
      if (!shouldFallback(e)) throw e
      
      // Para fallback local, intentar obtener el producto (solo si es necesario)
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
        updatedItems.push({ product, qty, price_snapshot: product.price })
      }
      
      const subtotal = updatedItems.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
      const updatedCart: Cart = { items: updatedItems, subtotal }
      saveLocal(updatedCart)
      set(updatedCart)
    }
  },
  async update(productId, qty) {
    try {
      const res = await api.patch<unknown, { data: ApiResponse<any> }>(`/cart_item/${productId}`, { qty })
      
      // La respuesta puede venir como cart completo
      // Xano estructura: { id: 123, items: [{ id: 456, qty: 1, product: {...} }] }
      const responseData = res.data?.data ?? res.data ?? null
      
      console.log('[cartStore] Respuesta después de actualizar:', JSON.stringify(res.data, null, 2))
      
      if (responseData) {
        // Si viene el carrito completo con items (estructura de Xano), mapearlo
        if (responseData.items && Array.isArray(responseData.items)) {
          console.log('[cartStore] Carrito completo recibido después de actualizar:', responseData)
          const cart = mapCartResponse(responseData)
          set({ items: cart.items, subtotal: cart.subtotal })
          saveLocal(cart)
        } else if (responseData._cart_item_of_cart || responseData.items) {
          // Formato alternativo
          const cart = mapCartResponse(responseData)
          set({ items: cart.items, subtotal: cart.subtotal })
          saveLocal(cart)
        } else {
          // Si solo viene el item, recargar el carrito completo
          await get().fetch()
        }
      } else {
        // Si la respuesta está vacía, recargar el carrito completo
        await get().fetch()
      }
    } catch (e: any) {
      // Manejo especial para error 429 (Rate Limit)
      if (isRateLimitError(e)) {
        console.warn('[cartStore] Rate limit alcanzado al actualizar cantidad. Por favor espere unos segundos.')
        throw new Error('Por favor espere unos segundos antes de continuar.')
      }
      
      // Fallback local
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
      await api.delete(`/cart_item/${productId}`)
      // Después de eliminar, recargar el carrito completo usando fetch optimizado
      await get().fetch()
    } catch (e: any) {
      // Manejo especial para error 429 (Rate Limit)
      if (isRateLimitError(e)) {
        console.warn('[cartStore] Rate limit alcanzado al eliminar producto. Por favor espere unos segundos.')
        throw new Error('Por favor espere unos segundos antes de continuar.')
      }
      
      // Fallback local
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
    
    if (items.length === 0) {
      throw new Error('El carrito está vacío')
    }
    
    // Obtener información del usuario actual
    const userRaw = localStorage.getItem('auth_user')
    const user = userRaw ? JSON.parse(userRaw) : null
    
    try {
      // Preparar items para la orden simulada
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name || `Producto #${item.product.id}`,
        quantity: item.qty,
        price: item.price_snapshot,
        subtotal: item.qty * item.price_snapshot,
      }))

      // Crear orden SIMULADA en Xano con status "Pendiente"
      // El admin gestionará estos pedidos
      const orderPayload = {
        status: 'Pendiente', // Status inicial - el admin lo gestionará
        total: subtotal,
        items: orderItems,
        user_id: user?.id || null, // Asociar al usuario si está autenticado
        created_at: new Date().toISOString(),
      }

      console.log('[cartStore] Creando pedido simulado:', orderPayload)

      // Intentar diferentes endpoints para crear orden
      const endpoints = ['/order', '/orders', '/me/orders']
      let orderRes = null
      
      for (const endpoint of endpoints) {
        try {
          orderRes = await api.post(endpoint, orderPayload)
          console.log('[cartStore] Orden creada exitosamente en:', endpoint)
          break
        } catch (err: any) {
          if (err?.response?.status !== 404) {
            console.warn('[cartStore] Error en endpoint', endpoint, ':', err?.response?.status)
            // Continuar con el siguiente endpoint
          }
          continue
        }
      }

      // Si no funcionó con api, intentar con apiUpload
      if (!orderRes) {
        for (const endpoint of endpoints) {
          try {
            orderRes = await apiUpload.post(endpoint, orderPayload)
            console.log('[cartStore] Orden creada exitosamente en (apiUpload):', endpoint)
            break
          } catch (err: any) {
            if (err?.response?.status !== 404) {
              console.warn('[cartStore] Error en endpoint (apiUpload)', endpoint, ':', err?.response?.status)
            }
            continue
          }
        }
      }

      let orderId: string
      let total: number = subtotal

      if (orderRes) {
        // Orden creada exitosamente en Xano
        const orderData = orderRes?.data?.data ?? orderRes?.data ?? {}
        orderId = orderData?.id ?? `ORD-${Date.now()}`
        total = orderData?.total ?? subtotal
        
        console.log('[cartStore] Pedido simulado creado con ID:', orderId)
      } else {
        // Si no se pudo crear en Xano, crear un pedido simulado local
        // Esto permite que funcione incluso si el endpoint no está configurado
        orderId = `ORD-SIM-${Date.now()}`
        console.log('[cartStore] Pedido simulado creado localmente con ID:', orderId)
        
        // Guardar en localStorage como respaldo
        try {
          const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]')
          localOrders.push({
            id: orderId,
            status: 'Pendiente',
            total: subtotal,
            items: orderItems,
            created_at: new Date().toISOString(),
          })
          localStorage.setItem('local_orders', JSON.stringify(localOrders))
        } catch (e) {
          console.warn('[cartStore] No se pudo guardar orden local:', e)
        }
      }

      // Limpiar carrito después de crear el pedido
      const cleared: Cart = { items: [], subtotal: 0 }
      saveLocal(cleared)
      set(cleared)

      return { orderId, total }
    } catch (orderError: any) {
      console.error('[cartStore] Error creando pedido simulado:', orderError)
      
      // Incluso si falla, crear un pedido simulado local y limpiar el carrito
      const orderId = `ORD-SIM-${Date.now()}`
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name || `Producto #${item.product.id}`,
        quantity: item.qty,
        price: item.price_snapshot,
        subtotal: item.qty * item.price_snapshot,
      }))
      
      try {
        const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]')
        localOrders.push({
          id: orderId,
          status: 'Pendiente',
          total: subtotal,
          items: orderItems,
          created_at: new Date().toISOString(),
        })
        localStorage.setItem('local_orders', JSON.stringify(localOrders))
      } catch (e) {
        console.warn('[cartStore] No se pudo guardar orden local:', e)
      }
      
      // Limpiar carrito
      const cleared: Cart = { items: [], subtotal: 0 }
      saveLocal(cleared)
      set(cleared)
      
      return { orderId, total: subtotal }
    }
  },
}))