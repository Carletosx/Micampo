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

export const createOrder = async (body) => {
  console.log('createOrder request:', body)
  let res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) })
  let text = await res.text().catch(() => '')
  let data = null
  try { data = text ? JSON.parse(text) : null } catch (_) { data = { raw: text } }
  if (res.status === 401 && (await tryRefresh())) {
    res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) })
    text = await res.text().catch(() => '')
    try { data = text ? JSON.parse(text) : null } catch (_) { data = { raw: text } }
  }
  console.log('createOrder response:', { status: res.status, data })
  return { ok: res.ok, status: res.status, data }
}

export const listOrdersByUser = async (usuarioAuthId) => {
  const query = usuarioAuthId ? `?usuarioAuthId=${usuarioAuthId}` : ''
  let res = await fetch(`${API_BASE}/orders${query}`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders${query}`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  const items = data && data.content ? data.content : []
  return { ok: res.ok, status: res.status, data: items }
}

export const listOrdersByAgricultor = async (agricultorAuthId, opts = {}) => {
  const params = new URLSearchParams()
  if (agricultorAuthId) params.set('agricultorAuthId', agricultorAuthId)
  if (opts.estado) params.set('estado', opts.estado)
  if (opts.page != null) params.set('page', String(opts.page))
  if (opts.size != null) params.set('size', String(opts.size))
  const qs = params.toString() ? `?${params.toString()}` : ''
  let res = await fetch(`${API_BASE}/orders${qs}`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders${qs}`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  const items = data && data.content ? data.content : []
  return { ok: res.ok, status: res.status, data: items }
}

export const getOrder = async (id) => {
  let res = await fetch(`${API_BASE}/orders/${id}`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders/${id}`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  return { ok: res.ok, status: res.status, data }
}

export const getOrderTotals = async (id) => {
  let res = await fetch(`${API_BASE}/orders/${id}/totales`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => null)
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders/${id}/totales`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => null) }
  return { ok: res.ok, status: res.status, data }
}

export const getOrderHistory = async (id) => {
  let res = await fetch(`${API_BASE}/orders/${id}/historial`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => [])
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders/${id}/historial`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => []) }
  return { ok: res.ok, status: res.status, data }
}

export const getOrderItems = async (id) => {
  let res = await fetch(`${API_BASE}/orders/${id}/items`, { headers: { Accept: 'application/json', ...authHeader() } })
  let data = await res.json().catch(() => [])
  if (res.status === 401 && (await tryRefresh())) { res = await fetch(`${API_BASE}/orders/${id}/items`, { headers: { Accept: 'application/json', ...authHeader() } }); data = await res.json().catch(() => []) }
  return { ok: res.ok, status: res.status, data }
}

export default { createOrder, listOrdersByUser, listOrdersByAgricultor, getOrder, getOrderTotals, getOrderHistory, getOrderItems }
