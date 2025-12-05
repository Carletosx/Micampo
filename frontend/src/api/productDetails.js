import API_BASE from './config.js'
import { } from './products.js'

const authHeader = () => {
  const ss = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const t = ss || ls
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const getProductDetail = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}/detalle`, { headers: { Accept: 'application/json', ...authHeader() } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updateProductDetail = async (id, payload) => {
  const res = await fetch(`${API_BASE}/products/${id}/detalle`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const uploadProductVideo = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${API_BASE}/files/upload/video`, { method: 'POST', body: fd })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export default { getProductDetail, updateProductDetail }
