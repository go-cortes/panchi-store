import api, { apiUpload } from './api'

export type XanoImage = {
  access: 'public' | 'private'
  path: string
  name: string
  type: 'image'
  size: number
  mime: string
  meta?: { width?: number; height?: number }
}

export type CreateProductInput = {
  name: string
  description: string
  price: number
  stock: number
  brand: string
  category: string
  images?: (XanoImage | string)[] // Soporta objetos XanoImage o strings (URLs)
}

export async function uploadImages(files: File[]): Promise<XanoImage[]> {
  if (!files?.length) return []
  const fd = new FormData()
  files.forEach((f) => fd.append('content', f))
  // Usar la ruta correcta de Xano para subir imágenes
  const uploadPath = import.meta.env.VITE_UPLOAD_IMAGE_PATH || '/upload/image'
  const altUploadPaths = (import.meta.env.VITE_UPLOAD_IMAGE_ALT_PATHS || '/upload/images')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const pathsToTry = [uploadPath, ...altUploadPaths]
  if (import.meta.env.DEV) {
    console.info('[uploadImages] base:', apiUpload.defaults.baseURL, 'paths:', pathsToTry)
  }

  let lastError: any = null
  for (const p of pathsToTry) {
    try {
      const res = await apiUpload.post(p, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const data = res?.data?.data ?? res?.data ?? {}
      
      // Xano puede devolver las imágenes en diferentes formatos
      let images: any[] = []
      if (Array.isArray(data)) {
        images = data
      } else if (data?.images && Array.isArray(data.images)) {
        images = data.images
      } else if (data?.uploaded_images && Array.isArray(data.uploaded_images)) {
        images = data.uploaded_images
      } else if (data?.image && Array.isArray(data.image)) {
        images = data.image
      }
      
      // Normalizar cada imagen para asegurar que tenga el formato XanoImage
      const normalizedImages: XanoImage[] = images.map((img: any) => {
        // Si ya tiene el formato correcto, devolverlo
        if (img && typeof img === 'object' && img.path) {
          return {
            access: img.access || 'public',
            path: img.path,
            name: img.name || img.path?.split('/').pop() || 'image.jpg',
            type: img.type || 'image',
            size: img.size || 0,
            mime: img.mime || 'image/jpeg',
            meta: img.meta || {}
          }
        }
        // Si es solo un path, construir objeto
        if (typeof img === 'string') {
          return {
            access: 'public',
            path: img,
            name: img.split('/').pop() || 'image.jpg',
            type: 'image',
            size: 0,
            mime: 'image/jpeg',
            meta: {}
          }
        }
        return null
      }).filter((img): img is XanoImage => img !== null)
      
      if (import.meta.env.DEV) {
        console.info('[uploadImages] éxito en', p, 'imágenes normalizadas:', normalizedImages.length)
      }
      
      return normalizedImages
    } catch (err: any) {
      lastError = err
      if (import.meta.env.DEV) {
        const status = err?.response?.status
        const errorData = err?.response?.data
        console.warn('[uploadImages] fallo en', p, 'status:', status, 'error:', errorData)
      }
    }
  }
  throw lastError ?? new Error('Image upload failed')
}

export async function createProduct(payload: CreateProductInput) {
  // Normalizar imágenes: Xano espera objetos completos XanoImage, no solo paths
  const imagesArray = payload.images
    ? payload.images.map(img => {
        // Si ya es un objeto XanoImage completo, usarlo tal cual
        if (typeof img === 'object' && img !== null && 'path' in img) {
          return {
            access: (img as any).access || 'public',
            path: (img as any).path || '',
            name: (img as any).name || (img as any).path?.split('/').pop() || 'image.jpg',
            type: (img as any).type || 'image',
            size: (img as any).size || 0,
            mime: (img as any).mime || 'image/jpeg',
            meta: (img as any).meta || {}
          }
        }
        // Si es un string (path), construir objeto mínimo
        if (typeof img === 'string' && img) {
          return {
            access: 'public',
            path: img,
            name: img.split('/').pop() || 'image.jpg',
            type: 'image',
            size: 0,
            mime: 'image/jpeg',
            meta: {}
          }
        }
        return null
      }).filter(Boolean)
    : []

  const body = {
    name: payload.name,
    description: payload.description,
    price: Number(payload.price),
    stock: Number(payload.stock),
    brand: payload.brand,
    category: payload.category,
    images: imagesArray, // Campo 'images' como array de objetos XanoImage completos
  }
  const productPath = import.meta.env.VITE_PRODUCT_CREATE_PATH || '/product'
  const altProductPaths = (import.meta.env.VITE_PRODUCT_CREATE_ALT_PATHS || '/products')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const pathsToTry = [productPath, ...altProductPaths]
  if (import.meta.env.DEV) {
    console.info('[createProduct] base:', api.defaults.baseURL, 'paths:', pathsToTry)
  }

  let lastError: any = null
  for (const p of pathsToTry) {
    try {
      const res = await api.post(p, body)
      return res?.data?.data ?? res?.data
    } catch (err: any) {
      lastError = err
      if (import.meta.env.DEV) {
        const status = err?.response?.status
        const msg = err?.response?.data || err?.message
        console.warn('[createProduct] fallo en', p, 'status:', status, 'mensaje:', msg)
      }
    }
  }
  throw lastError ?? new Error('Product create failed')
}