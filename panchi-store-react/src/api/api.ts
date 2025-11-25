import axios from 'axios'
import type { ApiError } from '../types/contracts'

const useMocks = (import.meta as any).env?.DEV && (import.meta as any).env?.VITE_USE_MOCKS === 'true'

// URLs CORRECTAS hardcodeadas - FORZADAS directamente en el código
// IGNORANDO variables de entorno para asegurar funcionamiento en producción
// API UJ0_Qj9c: Para autenticación, upload de imágenes y usuarios
const API_AUTH_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:UJ0_Qj9c'

// API tP1BBSGu: Para productos, carrito, favoritos y órdenes
// HARDCODEADO - NO usar import.meta.env
const API_PRODUCTS_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:tP1BBSGu'

// Base URL principal (para productos, carrito, favoritos, órdenes)
// HARDCODEADO - Ignorar variables de entorno
const baseURL = useMocks ? '' : API_PRODUCTS_URL

// Base URL para autenticación y upload de imágenes
// HARDCODEADO - Ignorar variables de entorno
const authBaseURL = useMocks ? '' : API_AUTH_URL
const uploadBaseURL = useMocks ? '' : API_AUTH_URL

// Log para debug: verificar qué URL se está usando
if ((import.meta as any).env?.DEV) {
  console.log('[api.ts] ✅ baseURL configurada (productos/carrito/favoritos/órdenes):', baseURL)
  console.log('[api.ts] ✅ authBaseURL configurada (autenticación/upload):', authBaseURL)
  console.log('[api.ts] ✅ uploadBaseURL configurada:', uploadBaseURL)
  console.log('[api.ts] API Productos (tP1BBSGu):', API_PRODUCTS_URL)
  console.log('[api.ts] API Auth/Upload (UJ0_Qj9c):', API_AUTH_URL)
}
const withCred = ((import.meta as any).env?.VITE_WITH_CREDENTIALS === 'true')

// API principal: productos, carrito, favoritos, órdenes
export const api = axios.create(useMocks ? {} : { baseURL, withCredentials: withCred })

// API para upload de imágenes y autenticación
export const apiUpload = axios.create(useMocks ? {} : { baseURL: uploadBaseURL, withCredentials: withCred })

// API para autenticación específicamente
export const apiAuth = axios.create(useMocks ? {} : { baseURL: authBaseURL, withCredentials: withCred })

function attachInterceptors(client: typeof api) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (!config.headers) {
      config.headers = {} as any
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Accept'] = 'application/json'
    
    // IMPORTANTE: No establecer Content-Type para FormData
    // Axios lo detecta automáticamente y establece el boundary correcto
    const isFormData = (typeof FormData !== 'undefined') && (config.data instanceof FormData)
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    
    // Log para debug en desarrollo
    if ((import.meta as any).env?.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} -> ${config.baseURL}`)
      if (token) {
        console.log('[API Request] ✅ Token de autorización encontrado y agregado al header')
      } else {
        console.warn('[API Request] ⚠️ No se encontró token de autorización en localStorage')
      }
      if (isFormData) {
        console.log('[API Request] FormData detectado, Content-Type será establecido automáticamente por Axios')
      }
      if (config.data && !isFormData) {
        console.log('[API Request] Payload:', JSON.stringify(config.data))
      }
    }
    
    return config
  })

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status
      const payload: ApiError | undefined = error?.response?.data
      
      // Manejo de rate limiting (429)
      if (status === 429) {
        const rateLimitMessage = (error?.response?.data as any)?.message || payload?.error?.message || 'Demasiadas solicitudes. Por favor, espera unos segundos.'
        if ((import.meta as any).env?.DEV) {
          console.warn('[API] Rate limit alcanzado (429):', rateLimitMessage)
        }
        // Agregar mensaje más amigable al error
        const rateLimitError: any = new Error(rateLimitMessage)
        rateLimitError.status = 429
        rateLimitError.isRateLimit = true
        rateLimitError.response = error.response
        return Promise.reject(rateLimitError)
      }
      
      // Manejo de autenticación (401)
      if (status === 401 || payload?.error?.code === 'UNAUTHORIZED') {
        try {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        } catch {}
        if (location.pathname !== '/login-usuario') {
          location.href = '/login-usuario'
        }
      }
      return Promise.reject(error)
    }
  )
}

attachInterceptors(api)
attachInterceptors(apiUpload)
attachInterceptors(apiAuth)

export default api