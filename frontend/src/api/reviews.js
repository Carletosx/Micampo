import API_BASE from './config.js'

export const listReviews = async (productId) => {
  const res = await fetch(`${API_BASE}/products/${productId}/resenas`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => [])
  return { ok: res.ok, data }
}

export const fetchAuthorName = async (authUsuarioId) => {
  if (!authUsuarioId) return null
  const res = await fetch(`${API_BASE}/users/public/perfil/by-auth/${authUsuarioId}`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) return null
  const nombre = [data.nombres, data.apellidos].filter(Boolean).join(' ').trim()
  return nombre || data.email || null
}

export const createReview = async (productId, payload) => {
  const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/products/${productId}/resenas`, { method: 'POST', headers, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export const listReviewsBySeller = async (authUsuarioId) => {
  const res = await fetch(`${API_BASE}/products/resenas/by-vendedor/${authUsuarioId}`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => [])
  return { ok: res.ok, data }
}

export const updateReview = async (resenaId, { calificacion, comentario }) => {
  const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/products/resenas/${resenaId}`, { method: 'PUT', headers, body: JSON.stringify({ calificacion, comentario }) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

export const deleteReview = async (resenaId) => {
  const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}/products/resenas/${resenaId}`, { method: 'DELETE', headers })
  return { ok: res.ok }
}

export default { listReviews, listReviewsBySeller, createReview, updateReview, deleteReview, fetchAuthorName }
