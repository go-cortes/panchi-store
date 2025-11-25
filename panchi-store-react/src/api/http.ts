export async function xpost<T = any>(url: string, body?: any, opts: RequestInit = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['X-Requested-With'] = 'XMLHttpRequest'

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body ?? {}),
    credentials: 'include',
    ...opts,
  })

  let data: any = {}
  try {
    data = await res.json()
  } catch (_) {
    data = {}
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || (typeof data === 'string' ? data : 'Request failed')
    const err: any = new Error(msg)
    ;(err as any).status = res.status
    ;(err as any).data = data
    throw err
  }
  return data as T
}

export async function xform<T = any>(url: string, form: FormData, opts: RequestInit = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers as Record<string, string> | undefined || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['X-Requested-With'] = 'XMLHttpRequest'

  const res = await fetch(url, { method: 'POST', body: form, credentials: 'include', headers, ...opts })

  let data: any = {}
  try {
    data = await res.json()
  } catch (_) {
    data = {}
  }
  if (!res.ok) {
    const msg = data?.message || 'Request failed'
    const err: any = new Error(msg)
    ;(err as any).status = res.status
    ;(err as any).data = data
    throw err
  }
  return data as T
}