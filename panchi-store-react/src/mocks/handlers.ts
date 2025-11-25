import { http, HttpResponse } from 'msw'
import { products, users, favoritesByUser, cartsByUser } from './seeds'
import type { Product, Cart, CartItem } from '../types/contracts'

function authUser(req: Request) {
  const auth = (req.headers?.get('authorization') || '').replace('Bearer ', '')
  const token = auth?.trim()
  if (!token) return null
  // token is user id encoded as string for simplicity: "uid:<id>"
  const match = token.match(/^uid:(\d+)$/)
  const uid = match ? Number(match[1]) : null
  if (!uid) return null
  return users.find(u => u.id === uid) || null
}

function formatOk<T>(data: T) {
  return HttpResponse.json({ data })
}

function formatErr(code: string, message: string, status = 400) {
  return HttpResponse.json({ error: { code, message } }, { status })
}

export const handlers = [
  // AUTH
  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json()
    const { email, password } = body || {}
    const creds = [
      { email: 'admin@panchi.test', pass: 'Admin123!' },
      { email: 'cliente@panchi.test', pass: 'Cliente123!' },
      { email: 'admin@tienda.cl', pass: 'Admin1234' },
    ]
    const found = creds.find(c => c.email === email && c.pass === password)
    if (!found) return formatErr('UNAUTHORIZED', 'Credenciales inválidas', 401)
    const user = users.find(u => u.email === found.email)!
    const token = `uid:${user.id}`
    return formatOk({ token, user })
  }),

  http.post('*/auth/register', async ({ request }) => {
    const body = await request.json()
    const { email, password, name } = body || {}
    if (!email || !password || !name) {
      return formatErr('VALIDATION_ERROR', 'Faltan campos requeridos')
    }
    const exists = users.find(u => u.email === email)
    if (exists) return formatErr('BAD_REQUEST', 'Email ya registrado')
    const id = users.length + 1
    const user = { id, email, name, role: 'cliente' as const }
    users.push(user)
    const token = `uid:${id}`
    return formatOk({ id, email, role: 'cliente' })
  }),

  // PRODUCTS
  http.get('*/products', async ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() || ''
    const category = url.searchParams.get('category')
    const brand = url.searchParams.get('brand')
    const minPrice = Number(url.searchParams.get('minPrice') || 0)
    const maxPrice = Number(url.searchParams.get('maxPrice') || Number.MAX_SAFE_INTEGER)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 12)
    const sort = url.searchParams.get('sort') || ''

    let list = [...products]
    if (q) {
      list = list.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(q))
    }
    if (category) list = list.filter(p => p.category === category)
    if (brand) list = list.filter(p => p.brand === brand)
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice)

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)

    const total = list.length
    const start = (page - 1) * limit
    const slice = list.slice(start, start + limit)
    return HttpResponse.json({ data: slice, page, total })
  }),

  http.get('*/products/:id', async ({ params }) => {
    const id = Number(params.id)
    const prod = products.find(p => p.id === id)
    if (!prod) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado', 404)
    return formatOk(prod)
  }),

  http.post('*/products', async ({ request }) => {
    const contentType = request.headers.get('content-type') || ''
    let data: Partial<Product> | null = null
    if (contentType.includes('multipart/form-data')) {
      const form = await (request as any).formData?.() // msw soporta request.formData() en browser
      if (!form) return formatErr('BAD_REQUEST', 'multipart inválido')
      const images: string[] = []
      for (const v of form.getAll('images')) {
        if (typeof v === 'string') images.push(v)
        else images.push((v as File).name)
      }
      data = {
        name: String(form.get('name') || ''),
        description: String(form.get('description') || ''),
        price: Number(form.get('price') || 0),
        stock: Number(form.get('stock') || 0),
        brand: String(form.get('brand') || ''),
        category: String(form.get('category') || ''),
        images,
      }
    } else {
      const body = await request.json()
      const imagesUrls: string[] = body?.imagesUrls || []
      data = {
        name: body?.name,
        description: body?.description,
        price: Number(body?.price || 0),
        stock: Number(body?.stock || 0),
        brand: body?.brand,
        category: body?.category,
        images: imagesUrls,
      }
    }
    if (!data || !data.name || !data.price || !data.brand || !data.category) {
      return formatErr('VALIDATION_ERROR', 'Campos requeridos faltantes')
    }
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1
    const prod: Product = { id, images: [], stock: 0, description: '', ...data } as Product
    prod.created_at = new Date().toISOString()
    products.push(prod)
    return formatOk(prod)
  }),

  http.patch('*/products/:id', async ({ request, params }) => {
    const id = Number(params.id)
    const idx = products.findIndex(p => p.id === id)
    if (idx < 0) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado', 404)
    const body = await request.json()
    const updated = { ...products[idx], ...body }
    updated.updated_at = new Date().toISOString()
    products[idx] = updated
    return formatOk(updated)
  }),

  http.delete('*/products/:id', async ({ params }) => {
    const id = Number(params.id)
    const idx = products.findIndex(p => p.id === id)
    if (idx < 0) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado', 404)
    products.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // FAVORITES
  http.get('*/me/favorites', async ({ request }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const set = favoritesByUser.get(user.id) || new Set<number>()
    const list = products.filter(p => set.has(p.id))
    return formatOk(list)
  }),

  http.post('*/me/favorites', async ({ request }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const body = await request.json()
    const productId = Number(body?.productId)
    const exists = products.find(p => p.id === productId)
    if (!exists) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado', 404)
    const set = favoritesByUser.get(user.id) || new Set<number>()
    set.add(productId)
    favoritesByUser.set(user.id, set)
    return formatOk({ productId })
  }),

  http.delete('*/me/favorites/:productId', async ({ request, params }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const productId = Number(params.productId)
    const set = favoritesByUser.get(user.id) || new Set<number>()
    set.delete(productId)
    favoritesByUser.set(user.id, set)
    return new HttpResponse(null, { status: 204 })
  }),

  // CART
  http.get('*/me/cart', async ({ request }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const cart = cartsByUser.get(user.id) || { items: [], subtotal: 0 }
    return formatOk(cart)
  }),

  http.post('*/me/cart/items', async ({ request }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const body = await request.json()
    const productId = Number(body?.productId)
    const qty = Number(body?.qty || 1)
    const prod = products.find(p => p.id === productId)
    if (!prod) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado', 404)
    const cart = cartsByUser.get(user.id) || { items: [], subtotal: 0 }
    const idx = cart.items.findIndex(i => i.product.id === productId)
    if (idx >= 0) cart.items[idx].qty += qty
    else cart.items.push({ product: prod, qty, price_snapshot: prod.price })
    cart.subtotal = cart.items.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
    cartsByUser.set(user.id, cart)
    return formatOk(cart)
  }),

  http.patch('*/me/cart/items/:productId', async ({ request, params }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const productId = Number(params.productId)
    const body = await request.json()
    const qty = Number(body?.qty || 0)
    const cart = cartsByUser.get(user.id) || { items: [], subtotal: 0 }
    const idx = cart.items.findIndex(i => i.product.id === productId)
    if (idx < 0) return formatErr('ERROR_CODE_NOT_FOUND', 'Producto no encontrado en carrito', 404)
    if (qty <= 0) cart.items.splice(idx, 1)
    else cart.items[idx].qty = qty
    cart.subtotal = cart.items.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
    cartsByUser.set(user.id, cart)
    return formatOk(cart)
  }),

  http.delete('*/me/cart/items/:productId', async ({ request, params }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const productId = Number(params.productId)
    const cart = cartsByUser.get(user.id) || { items: [], subtotal: 0 }
    const idx = cart.items.findIndex(i => i.product.id === productId)
    if (idx >= 0) cart.items.splice(idx, 1)
    cart.subtotal = cart.items.reduce((s, i) => s + i.qty * i.price_snapshot, 0)
    cartsByUser.set(user.id, cart)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/me/cart/checkout', async ({ request }) => {
    const user = authUser(request)
    if (!user) return formatErr('UNAUTHORIZED', 'No autenticado', 401)
    const cart = cartsByUser.get(user.id) || { items: [], subtotal: 0 }
    const total = cart.subtotal
    const orderId = `ORD-${Date.now()}`
    cartsByUser.set(user.id, { items: [], subtotal: 0 })
    return formatOk({ orderId, total })
  }),
]