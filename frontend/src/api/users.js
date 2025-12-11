import API_BASE from './config.js'

const authHeader = () => {
  const ss = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const t = ss || ls
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const tryRefresh = async () => {
  const rt = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('refreshToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('refreshToken') : null)
  if (!rt) return false
  const res = await fetch(`${API_BASE}/auth/autenticacion/refrescar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tokenRefresco: rt }) })
  const data = await res.json().catch(() => null)
  console.log('refresh status', res.status, 'data', data)
  if (!res.ok || !data?.accessToken) return false
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('accessToken', data.accessToken)
  if (data.refreshToken && typeof sessionStorage !== 'undefined') sessionStorage.setItem('refreshToken', data.refreshToken)
  return true
}

export const getPerfil = async () => {
  let res = await fetch(`${API_BASE}/users/perfil`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/perfil`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updatePerfil = async (payload) => {
  let res = await fetch(`${API_BASE}/users/perfil`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/perfil`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) }); data = await res.json().catch(() => null) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const listFincas = async (page = 0, size = 10) => {
  let res = await fetch(`${API_BASE}/users/fincas?page=${page}&size=${size}`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/fincas?page=${page}&size=${size}`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  console.log('listFincas status', res.status, 'data', data)
  const items = data && data.content ? data.content : []
  return { ok: res.ok, unauthorized: res.status === 401, data: items }
}

export const createFinca = async (payload) => {
  console.log('createFinca payload', payload)
  let res = await fetch(`${API_BASE}/users/fincas`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/fincas`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) }); data = await res.json().catch(() => null) }
  console.log('createFinca status', res.status, 'data', data)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updateFinca = async (id, payload) => {
  console.log('updateFinca', id, 'payload', payload)
  let res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) }); data = await res.json().catch(() => null) }
  console.log('updateFinca status', res.status, 'data', data)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const deleteFinca = async (id) => {
  let res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/fincas/${id}`, { method: 'DELETE', headers: { ...authHeader() } }) }
  return { ok: res.ok, unauthorized: res.status === 401 }
}

export const getFincasPublicByAuth = async (authUsuarioId) => {
  const res = await fetch(`${API_BASE}/users/public/fincas/by-auth/${authUsuarioId}`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => [])
  return { ok: res.ok, data }
}

export const getTiendasPublic = async () => {
  const res = await fetch(`${API_BASE}/users/public/tiendas`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => [])
  return { ok: res.ok, data }
}

export const getPerfilPublicByAuth = async (authUsuarioId) => {
  const res = await fetch(`${API_BASE}/users/public/perfil/by-auth/${authUsuarioId}`, { headers: { Accept: 'application/json' } })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, data }
}

const getAuthIdFromToken = () => {
  try {
    const t = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
    if (!t) return null
    const payload = JSON.parse(atob(t.split('.')[1]))
    return payload?.usuarioId ? Number(payload.usuarioId) : null
  } catch { return null }
}

export const listDirecciones = async () => {
  const authId = getAuthIdFromToken()
  if (!authId) return { ok: false, unauthorized: true, data: [] }
  let res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => [])
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => []) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const getDireccionById = async (id) => {
  const authId = getAuthIdFromToken()
  if (!authId) return { ok: false, unauthorized: true, data: null }
  let res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const createDireccion = async (payload) => {
  const authId = getAuthIdFromToken()
  if (!authId) return { ok: false, unauthorized: true, data: null }
  let res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) }); data = await res.json().catch(() => null) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const updateDireccion = async (id, payload) => {
  const authId = getAuthIdFromToken()
  if (!authId) return { ok: false, unauthorized: true, data: null }
  let res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(payload) }); data = await res.json().catch(() => null) }
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

export const deleteDireccion = async (id) => {
  const authId = getAuthIdFromToken()
  if (!authId) return { ok: false, unauthorized: true }
  let res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/users/usuarios/${authId}/direcciones/${id}`, { method: 'DELETE', headers: { ...authHeader() } }) }
  return { ok: res.ok, unauthorized: res.status === 401 }
}

export default { getPerfil, updatePerfil, listFincas, createFinca, updateFinca, deleteFinca, getFincasPublicByAuth, getTiendasPublic, getPerfilPublicByAuth, listDirecciones, createDireccion, updateDireccion, deleteDireccion }
