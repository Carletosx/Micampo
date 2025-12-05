import API_BASE from './config.js'

const authHeader = () => {
  const ss = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const t = ss || ls
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const listProducts = async (params = {}) => {
  const { page = 0, size = 30, includeInactive = false, ...rest } = params
  const q = new URLSearchParams({ page, size, includeInactive, ...rest })
  const res = await fetch(`${API_BASE}/products?${q.toString()}`, { headers: { Accept: 'application/json', ...authHeader() } })
  const data = await res.json().catch(() => null)
  const items = data && Array.isArray(data) ? data : (data && data.content ? data.content : null)
  const pageInfo = data && data.totalPages !== undefined ? { totalPages: data.totalPages, totalElements: data.totalElements, number: data.number, size: data.size, last: data.last, first: data.first } : null
  return { ok: res.ok, unauthorized: res.status === 401, data: items, page: pageInfo }
}

export const createProduct = async (payload) => {
  const res = await fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updateProduct = async (id, payload) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  return { ok: res.ok, unauthorized: res.status === 401 }
}

export const pauseProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}/pausar`, { method: 'PATCH', headers: { ...authHeader() } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const activateProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}/activar`, { method: 'PATCH', headers: { ...authHeader() } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const getProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { headers: { Accept: 'application/json', ...authHeader() } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}
