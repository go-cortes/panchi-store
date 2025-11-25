import axios from 'axios'

// --- CONEXIÓN A LA API tP1BBSGu (La que me acabas de pasar) ---
const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:tP1BBSGu'

export type CreateProductInput = {
  name: string
  description: string
  price: number
  stock: number
  brand: string
  category: string
  images?: File[]
}

// 1. OBTENER PRODUCTOS (GET)
export async function getProducts() {
  // Usamos SINGULAR "/product" tal como viene en tu enlace
  const url = `${API_URL}/product` 
  
  console.log('[getProducts] Leyendo de:', url)

  try {
    const res = await axios.get(url)
    // Xano a veces devuelve la lista directa o dentro de 'items'
    return res?.data?.data ?? res?.data
  } catch (error) {
    console.error('[getProducts] Error cargando productos:', error)
    throw error
  }
}

// 2. CREAR PRODUCTO (POST)
export async function createProduct(payload: CreateProductInput) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description || '')
  formData.append('price', String(Number(payload.price)))
  formData.append('stock', String(Number(payload.stock)))
  formData.append('brand', payload.brand)
  formData.append('category', payload.category)

  // Enviamos las imágenes
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      if (file instanceof File) {
        // Usamos 'image' como nombre del campo
        formData.append('image', file)
      }
    })
  }

  // Usamos SINGULAR "/product" tal como viene en tu enlace
  const url = `${API_URL}/product`

  console.log('[createProduct] Enviando a:', url)

  try {
    const res = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res?.data?.data ?? res?.data
  } catch (error: any) {
    console.error('[createProduct] Error:', error.response?.data || error.message)
    throw error
  }
}

// 3. EDITAR (PATCH)
export async function updateProduct(id: number, payload: CreateProductInput) {
  const formData = new FormData()
  // Rellenamos datos igual que en create...
  formData.append('name', payload.name)
  formData.append('description', payload.description || '')
  formData.append('price', String(Number(payload.price)))
  formData.append('stock', String(Number(payload.stock)))
  formData.append('brand', payload.brand)
  formData.append('category', payload.category)

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file) => {
      if (file instanceof File) formData.append('image', file)
    })
  }
  
  const url = `${API_URL}/product/${id}` // Singular con ID
  try {
    const res = await axios.patch(url, formData)
    return res?.data?.data ?? res?.data
  } catch (error) {
    console.error('[updateProduct] Error:', error)
    throw error
  }
}

// 4. BORRAR (DELETE)
export async function deleteProduct(id: number) {
  const url = `${API_URL}/product/${id}` // Singular con ID
  try {
    await axios.delete(url)
  } catch (error) {
    console.error('[deleteProduct] Error:', error)
    throw error
  }
}

export async function uploadImages(files: File[]) { return [] }
