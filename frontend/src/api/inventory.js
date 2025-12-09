import API_BASE from './config.js'

const authHeader = () => {
  const ss = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null
  const ls = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const t = ss || ls
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Crear/inicializar inventario para un producto (con stock inicial)
export const inicializarInventario = async (productoId, stockInicial = 0, stockMinimo = 0) => {
  const res = await fetch(`${API_BASE}/inventory/${productoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ stockActual: stockInicial, stockMinimo })
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Obtener inventario de un producto
export const getInventario = async (productoId) => {
  const res = await fetch(`${API_BASE}/inventory/${productoId}`, {
    headers: { Accept: 'application/json', ...authHeader() }
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Actualizar stock y stock mínimo
export const actualizarInventario = async (productoId, stockActual, stockMinimo) => {
  const res = await fetch(`${API_BASE}/inventory/${productoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ stockActual, stockMinimo })
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Listar movimientos de un producto
export const listarMovimientos = async (productoId) => {
  const res = await fetch(`${API_BASE}/inventory/${productoId}/movimientos`, {
    headers: { Accept: 'application/json', ...authHeader() }
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Crear movimiento (ENTRADA, SALIDA, AJUSTE)
export const crearMovimiento = async (productoId, movimiento) => {
  // movimiento puede ser un objeto {tipo, cantidad, descripcion} o parámetros individuales
  const body = typeof movimiento === 'object' 
    ? { tipo: movimiento.tipo, cantidad: movimiento.cantidad, nota: movimiento.descripcion || '' }
    : { tipo: arguments[1], cantidad: arguments[2], nota: arguments[3] || '' }
  
  const res = await fetch(`${API_BASE}/inventory/${productoId}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Reservar stock (para pedidos)
export const reservarStock = async (productoId, data) => {
  // data puede ser {cantidad, descripcion} o solo cantidad
  const body = typeof data === 'object' 
    ? { cantidad: data.cantidad, nota: data.descripcion || '' }
    : { cantidad: data }
  
  const res = await fetch(`${API_BASE}/inventory/${productoId}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body)
  })
  const data_res = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data: data_res }
}

// Liberar stock reservado
export const liberarStock = async (productoId, cantidad) => {
  const res = await fetch(`${API_BASE}/inventory/${productoId}/liberaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ cantidad })
  })
  const data = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data }
}

// Confirmar venta (reduce stock actual)
export const confirmarVenta = async (productoId, data) => {
  // data puede ser {cantidad, descripcion} o solo cantidad
  const body = typeof data === 'object' 
    ? { cantidad: data.cantidad, nota: data.descripcion || '' }
    : { cantidad: data }
  
  const res = await fetch(`${API_BASE}/inventory/${productoId}/confirmaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body)
  })
  const data_res = await res.json().catch(() => null)
  return { ok: res.ok, unauthorized: res.status === 401, data: data_res }
}
