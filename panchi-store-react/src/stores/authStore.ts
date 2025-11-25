import { create } from 'zustand'
import api, { apiUpload } from '../api/api'
import type { User } from '../types/contracts'

interface AuthState {
  user: User | null
  token: string | null
  role: 'cliente' | 'admin' | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  restore: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null,
  async login(email, password) {
    const endpointCandidates: string[] = []
    const envEndpoint = import.meta.env.VITE_LOGIN_ENDPOINT
    if (envEndpoint) endpointCandidates.push(envEndpoint)
    endpointCandidates.push('/auth/login', '/authorization/login')

    const clients = [api, apiUpload]
    if (import.meta.env.DEV) {
      console.info('[auth.login] bases:', clients.map(c => c.defaults.baseURL))
      console.info('[auth.login] endpoints:', endpointCandidates)
    }

    let res: any | null = null
    let lastErr: any = null
    for (const endpoint of endpointCandidates) {
      for (const client of clients) {
        try {
          res = await client.post(endpoint, { email, password })
          if (import.meta.env.DEV) {
            console.info('[auth.login] success on', client.defaults.baseURL, endpoint)
          }
          break
        } catch (e: any) {
          lastErr = e
          const status = e?.response?.status
          const code = e?.response?.data?.code ?? e?.response?.data?.error?.code
          if (import.meta.env.DEV) {
            console.warn('[auth.login] fail on', client.defaults.baseURL, endpoint, 'status:', status, 'code:', code)
          }
          // continuar si es not-found
          if (status === 404 || code === 'ERROR_CODE_NOT_FOUND') {
            continue
          } else {
            throw e
          }
        }
      }
      if (res) break
    }

    if (!res) {
      throw lastErr || new Error('LOGIN_FAILED')
    }

    const raw = res.data
    const data = raw?.data ?? raw

    const token = data?.token ?? data?.authToken ?? data?.access_token ?? data?.jwt

    let user: User | null = null
    if (data?.user) {
      user = data.user as User
      // Validar si el usuario está bloqueado
      if ((data.user as any)?.blocked === true) {
        throw new Error('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
      }
    } else if (data?.usuario) {
      user = data.usuario as User
      // Validar si el usuario está bloqueado
      if ((data.usuario as any)?.blocked === true) {
        throw new Error('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
      }
    } else if (data?.email) {
      // Validar si el usuario está bloqueado
      if (data?.blocked === true) {
        throw new Error('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
      }
      user = {
        id: data.id ?? 0,
        email: data.email,
        name: data.name ?? data.nombre ?? data.username ?? '',
        role: (data.role ?? 'cliente') as 'cliente' | 'admin',
      }
    }

    // Nuevo: si el backend no devuelve el usuario o no trae rol, intenta /me
    const meCandidates: string[] = []
    const envMe = import.meta.env.VITE_ME_ENDPOINT
    if (envMe) meCandidates.push(envMe)
    meCandidates.push('/auth/me', '/authorization/me', '/me')

    if (!user || !user.role) {
      for (const meEndpoint of meCandidates) {
        for (const client of clients) {
          try {
            const meRes = await client.get(meEndpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
            const meRaw = meRes.data
            const meData = meRaw?.data ?? meRaw
            const adminAllowList = (import.meta.env.VITE_ADMIN_EMAILS || '')
              .split(',')
              .map((s) => s.trim().toLowerCase())
              .filter(Boolean)
            if (!adminAllowList.includes('admin@gmail.com')) adminAllowList.push('admin@gmail.com')
            if (!adminAllowList.includes('admin@tienda.cl')) adminAllowList.push('admin@tienda.cl')
            const emailLower = String(meData?.email || '').toLowerCase()
            // Validar si el usuario está bloqueado antes de continuar
            if (meData?.blocked === true) {
              throw new Error('Tu cuenta está bloqueada. Por favor, contacta al administrador.')
            }
            
            const roleCandidate: 'cliente' | 'admin' = (
              meData?.role
                ? (String(meData.role).toLowerCase() === 'admin' ? 'admin' : 'cliente')
                : (meData?.is_admin
                    ? 'admin'
                    : (adminAllowList.includes(emailLower) ? 'admin' : 'cliente'))
            )
            user = {
              id: meData?.id ?? user?.id ?? 0,
              email: meData?.email ?? user?.email ?? email,
              name: meData?.name ?? meData?.nombre ?? meData?.username ?? user?.name ?? '',
              role: roleCandidate,
            }
            if (import.meta.env.DEV) {
              console.info('[auth.me] success on', client.defaults.baseURL, meEndpoint)
            }
            break
          } catch (e: any) {
            const status = e?.response?.status
            const code = e?.response?.data?.code ?? e?.response?.data?.error?.code
            if (import.meta.env.DEV) {
              console.warn('[auth.me] fail on', client.defaults.baseURL, meEndpoint, 'status:', status, 'code:', code)
            }
            if (status === 404 || code === 'ERROR_CODE_NOT_FOUND') {
              continue
            }
          }
        }
        if (user && user.role) break
      }
    }

    if (!token || !user) {
      throw new Error('LOGIN_RESPONSE_INVALID')
    }

    try {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    } catch {}
    set({ token, user, role: user.role })
  },
  async register(email, password, name) {
    await api.post('/auth/register', { email, password, name })
  },
  logout() {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    } catch {}
    set({ token: null, user: null, role: null })
  },
  restore() {
    const token = localStorage.getItem('auth_token')
    const userRaw = localStorage.getItem('auth_user')
    const user = userRaw ? (JSON.parse(userRaw) as User) : null

    // Derivar rol cuando no viene en storage, usando allowlist
    const adminAllowList = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (!adminAllowList.includes('admin@gmail.com')) adminAllowList.push('admin@gmail.com')
    if (!adminAllowList.includes('admin@tienda.cl')) adminAllowList.push('admin@tienda.cl')
    const emailLower = String(user?.email || '').toLowerCase()
    const roleCandidate: 'cliente' | 'admin' | null = (
      user?.role
        ? (String(user.role).toLowerCase() === 'admin' ? 'admin' : 'cliente')
        : (adminAllowList.includes(emailLower) ? 'admin' : null)
    )

    const finalUser = user ? { ...user, role: roleCandidate ?? user.role ?? null } : null

    set({ token, user: finalUser, role: finalUser?.role ?? null })
  },
}))