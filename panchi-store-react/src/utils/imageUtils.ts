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





