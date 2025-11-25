/**
 * Convierte un path de Xano (ej: "/vault/xxxx/archivo.jpg") en una URL completa
 * @param path - Path relativo de Xano o URL completa
 * @returns URL completa para acceder a la imagen
 */
export const buildImageUrl = (path: string | null | undefined): string => {
  if (!path) return ''
  
  // Si ya es una URL completa (http:// o https://), devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Si es un path relativo de Xano (empieza con /), construir la URL completa
  if (path.startsWith('/')) {
    return `https://x8ki-letl-twmt.n7.xano.io${path}`
  }
  
  // Si no empieza con /, asumir que es un path relativo y agregar el prefijo
  return `https://x8ki-letl-twmt.n7.xano.io/${path}`
}

/**
 * Obtiene la URL de la primera imagen de un producto, manejando diferentes formatos:
 * - Array de objetos: product.images[0].url
 * - Objeto único: product.image.url
 * - Detecta automáticamente el nombre de la variable (image, imagen, photos, images, etc.)
 * @param producto - Objeto del producto
 * @returns URL de la imagen o string vacío si no hay imagen
 */
export const getProductImageUrl = (producto: any): string => {
  if (!producto) return ''
  
  // Lista de posibles nombres de variables de imagen (en orden de prioridad)
  const imageFieldNames = ['images', 'image', 'imagen', 'photos', 'photo', 'imagenes']
  
  // Buscar el campo de imagen en el producto
  let imageData = null
  for (const fieldName of imageFieldNames) {
    if (producto[fieldName] !== undefined && producto[fieldName] !== null) {
      imageData = producto[fieldName]
      break
    }
  }
  
  if (!imageData) return ''
  
  // Si es un array, tomar el primer elemento
  if (Array.isArray(imageData)) {
    if (imageData.length === 0) return ''
    const firstItem = imageData[0]
    // Si el primer elemento es un objeto con .url, usar esa URL
    if (firstItem && typeof firstItem === 'object' && firstItem.url) {
      return firstItem.url || ''
    }
    // Si el primer elemento es un string, usarlo directamente
    if (typeof firstItem === 'string') {
      return firstItem
    }
    return ''
  }
  
  // Si es un objeto, usar directamente .url
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url || ''
  }
  
  // Si es un string, usarlo directamente
  if (typeof imageData === 'string') {
    return imageData
  }
  
  return ''
}

/**
 * Obtiene todas las URLs de imágenes de un producto, manejando diferentes formatos
 * @param producto - Objeto del producto
 * @returns Array de URLs de imágenes
 */
export const getProductImageUrls = (producto: any): string[] => {
  if (!producto) return []
  
  // Lista de posibles nombres de variables de imagen (en orden de prioridad)
  const imageFieldNames = ['images', 'image', 'imagen', 'photos', 'photo', 'imagenes']
  
  // Buscar el campo de imagen en el producto
  let imageData = null
  for (const fieldName of imageFieldNames) {
    if (producto[fieldName] !== undefined && producto[fieldName] !== null) {
      imageData = producto[fieldName]
      break
    }
  }
  
  if (!imageData) return []
  
  // Si es un array, mapear todos los elementos
  if (Array.isArray(imageData)) {
    return imageData
      .map(item => {
        if (item && typeof item === 'object' && item.url) {
          return item.url || ''
        }
        if (typeof item === 'string') {
          return item
        }
        return ''
      })
      .filter(Boolean)
  }
  
  // Si es un objeto único, retornar un array con una sola URL
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url ? [imageData.url] : []
  }
  
  // Si es un string, retornar un array con ese string
  if (typeof imageData === 'string') {
    return [imageData]
  }
  
  return []
}





