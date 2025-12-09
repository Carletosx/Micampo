import API_BASE from './config.js'

const authHeader = () => {
  const ss = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const t = ss || ls
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export const getPerfil = async () => {
  const res = await fetch(`${API_BASE}/users/perfil`, { headers: { Accept: 'application/json', ...authHeader() } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updatePerfil = async (payload) => {
  const res = await fetch(`${API_BASE}/users/perfil`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const listFincas = async (page = 0, size = 10) => {
  const res = await fetch(`${API_BASE}/users/fincas?page=${page}&size=${size}`, { headers: { Accept: 'application/json', ...authHeader() } })
  const data = await res.json().catch(() => null)
  const items = data && data.content ? data.content : []
  return { ok: res.ok, unauthorized: res.status === 401, data: items }
}

export const createFinca = async (payload) => {
  const res = await fetch(`${API_BASE}/users/fincas`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updateFinca = async (id, payload) => {
  const res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const deleteFinca = async (id) => {
  const res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  return { ok: res.ok, unauthorized: res.status === 401 }
}

export default { getPerfil, updatePerfil, listFincas, createFinca, updateFinca, deleteFinca }
