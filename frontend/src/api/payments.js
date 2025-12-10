import API_BASE from './config.js'

export const createPaymentIntent = async ({ amount, currency = 'pen', pedidoId = null }) => {
  const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const body = { amount, currency, pedidoId }
  console.log('createPaymentIntent request:', body)
  const res = await fetch(`${API_BASE}/payments/intents`, { method: 'POST', headers, body: JSON.stringify(body) })
  let data = null
  const text = await res.text().catch(() => '')
  try { data = text ? JSON.parse(text) : null } catch (_) { data = { raw: text } }
  console.log('createPaymentIntent response:', { status: res.status, data })
  return { ok: res.ok, data }
}

export default { createPaymentIntent }
