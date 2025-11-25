import axios from 'axios'
import type { ApiError } from '../types/contracts'

const useMocks = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'
// Base URL para productos (GET /product)
const baseURL = useMocks ? '' : (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:tP1BBSGu')
// Base URL para upload de imágenes (POST /upload/image)
const uploadBaseURL = useMocks ? '' : (import.meta.env.VITE_UPLOAD_BASE || 'https://x8ki-letl-twmt.n7.xano.io/api:UJ0_Qj9c')
const withCred = (import.meta.env.VITE_WITH_CREDENTIALS === 'true')

export const api = axios.create(useMocks ? {} : { baseURL, withCredentials: withCred })
export const apiUpload = axios.create(useMocks ? {} : { baseURL: uploadBaseURL, withCredentials: withCred })

function attachInterceptors(client: typeof api) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    config.headers = config.headers || {}
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Accept'] = 'application/json'
    const isFormData = (typeof FormData !== 'undefined') && (config.data instanceof FormData)
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
  })

  client.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status
      const payload: ApiError | undefined = error?.response?.data
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

export default api