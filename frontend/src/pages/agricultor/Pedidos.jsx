import React, { useEffect, useState, useContext } from 'react'
import NavbarAgricultor from '../../components/layout/NavbarAgricultor'
import { AuthContext } from '../../context/AuthContext'
import { listOrdersByUser, listOrdersByAgricultor, getOrderItems, getOrder, getOrderTotals, getOrderHistory, updateOrderStatus } from '../../api/orders.js'
import { getPerfilPublicByAuth } from '../../api/users.js'
import { useNotification } from '../../contexts/NotificationContext'

const accionesPorEstado = {
  PENDIENTE: [{ k: 'CONFIRMADO', label: 'Confirmar' }, { k: 'CANCELADO', label: 'Cancelar' }],
  CONFIRMADO: [{ k: 'EN_PREPARACION', label: 'Preparar' }],
  EN_PREPARACION: [{ k: 'EN_CAMINO', label: 'Despachar' }],
  EN_CAMINO: [{ k: 'ENTREGADO', label: 'Entregar' }]
}

const PedidosAgricultor = () => {
  const { user } = useContext(AuthContext)
  const { showSuccess, showError } = useNotification()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailOrder, setDetailOrder] = useState(null)
  const [detailItems, setDetailItems] = useState([])
  const [detailTotals, setDetailTotals] = useState(null)
  const [detailHistory, setDetailHistory] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailBuyer, setDetailBuyer] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [estadoFilter, setEstadoFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (user?.id) {
        const ra = await listOrdersByAgricultor(user.id, { estado: estadoFilter || undefined })
        console.log('listOrdersByAgricultor:', ra)
        if (ra.ok && Array.isArray(ra.data) && ra.data.length > 0) {
          setOrders(ra.data)
        } else if (estadoFilter) {
          const rb = await listOrdersByAgricultor(user.id)
          setOrders(rb.ok && Array.isArray(rb.data) ? rb.data : [])
        } else {
          const ru = await listOrdersByUser(undefined)
          console.log('fallback listOrdersByUser:', ru)
          setOrders(ru.ok && Array.isArray(ru.data) ? ru.data : [])
        }
      } else {
        const ru = await listOrdersByUser(undefined)
        console.log('listOrders (sin id agricultor):', ru)
        setOrders(ru.ok && Array.isArray(ru.data) ? ru.data : [])
      }
      setLoading(false)
    }
    load()
  }, [user?.id, estadoFilter])

  const cambiarEstado = async (id, estado) => {
    setUpdatingId(id)
    const prev = orders
    setOrders(o => o.map(p => p.id === id ? { ...p, estado } : p))
    const r = await updateOrderStatus(id, { estado })
    if (r.ok) {
      showSuccess('Estado actualizado')
      if (user?.id) {
        const ra = await listOrdersByAgricultor(user.id)
        if (ra.ok && Array.isArray(ra.data) && ra.data.length > 0) {
          setOrders(ra.data)
        } else {
          const ru = await listOrdersByUser(undefined)
          setOrders(ru.ok && Array.isArray(ru.data) ? ru.data : prev)
        }
      } else {
        const ru = await listOrdersByUser(undefined)
        setOrders(ru.ok && Array.isArray(ru.data) ? ru.data : prev)
      }
    } else {
      showError('No autorizado o error al actualizar')
      setOrders(prev)
    }
    setUpdatingId(null)
  }

  const steps = ['PENDIENTE','CONFIRMADO','EN_PREPARACION','EN_CAMINO','ENTREGADO']
  const siguientePaso = (estado) => {
    const i = steps.indexOf(estado)
    if (i < 0) return null
    if (estado === 'ENTREGADO' || estado === 'CANCELADO') return null
    return steps[i + 1] || null
  }

  const abrirDetalle = async (id) => {
    setDetailLoading(true)
    const o = await getOrder(id)
    const it = await getOrderItems(id)
    const tt = await getOrderTotals(id)
    const hh = await getOrderHistory(id)
    let bp = null
    if (o.ok && o.data && o.data.usuarioAuthId) {
      const b = await getPerfilPublicByAuth(o.data.usuarioAuthId)
      bp = b.ok ? b.data : null
    }
    setDetailOrder(o.ok ? o.data : null)
    setDetailItems(it.ok ? it.data : [])
    setDetailTotals(tt.ok ? tt.data : null)
    setDetailHistory(hh.ok ? hh.data : [])
    setDetailBuyer(bp)
    setDetailLoading(false)
  }
  const cerrarDetalle = () => {
    setDetailOrder(null)
    setDetailItems([])
    setDetailTotals(null)
    setDetailHistory([])
    setDetailBuyer(null)
    setDetailLoading(false)
  }

  return (
    <div>
      <NavbarAgricultor />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Pedidos de mis productos</h1>
        {loading ? (
          <div className="text-gray-600">Cargando...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-md border border-gray-200 p-6 text-center text-gray-600">No hay pedidos para mostrar.</div>
        ) : (
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-end p-3 border-b gap-2">
              <label className="text-sm text-gray-700">Estado</label>
              <select value={estadoFilter} onChange={(e)=> setEstadoFilter(e.target.value)} className="px-3 py-2 border rounded-md bg-white text-sm">
                <option value="">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="EN_PREPARACION">En preparación</option>
                <option value="EN_CAMINO">En camino</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left">#</th>
                  <th className="py-2 px-3 text-left">Fecha</th>
                  <th className="py-2 px-3 text-left">Estado</th>
                  <th className="py-2 px-3 text-left">Total</th>
                  <th className="py-2 px-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t border-gray-200">
                    <td className="py-2 px-3">#{o.id}</td>
                    <td className="py-2 px-3">{new Date(o.creadoEn || Date.now()).toLocaleString()}</td>
                    <td className="py-2 px-3">{o.estado}</td>
                    <td className="py-2 px-3">S/ {Number(o.total || 0).toFixed(2)}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded border bg-white hover:bg-gray-100" onClick={()=> abrirDetalle(o.id)}>Ver</button>
                        {(() => {
                          const nxt = siguientePaso(o.estado)
                          return nxt ? (
                            <button disabled={updatingId===o.id} className={`px-2 py-1 rounded ${updatingId===o.id?'bg-green-300':'bg-green-600 hover:bg-green-700'} text-white`} onClick={()=> cambiarEstado(o.id, nxt)}>Siguiente paso</button>
                          ) : (
                            <span className="text-sm text-gray-600">Proceso completado</span>
                          )
                        })()}
                        {o.estado === 'PENDIENTE' && (
                          <button disabled={updatingId===o.id} className={`px-2 py-1 rounded ${updatingId===o.id?'bg-red-200 text-red-500':'bg-red-100 text-red-700 hover:bg-red-200'} border`} onClick={()=> cambiarEstado(o.id, 'CANCELADO')}>Cancelar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t p-4">
              <div className="text-xs text-gray-600">Secuencia: PENDIENTE → CONFIRMADO → EN_PREPARACION → EN_CAMINO → ENTREGADO</div>
            </div>
            {orders.filter(o=>o.open).map(o => (
              <div key={`d-${o.id}`} className="border-t p-3">
                <div className="text-sm font-semibold text-gray-800 mb-2">Items</div>
                {(o.items || []).map(it => (
                  <div key={it.id} className="text-sm text-gray-700 flex justify-between">
                    <span>{it.nombreProducto} x {it.cantidad}</span>
                    <span>S/ {Number(it.precioUnitario || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-xl flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pedido #{detailOrder.id}</h3>
              <button className="text-gray-600 hover:text-gray-800" onClick={cerrarDetalle}>✕</button>
            </div>
            <div className="p-4 space-y-4">
              {detailLoading ? (
                <div className="text-gray-600">Cargando...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Comprador</div>
                      <div className="text-sm text-gray-700">{detailBuyer?.nombres || '—'}</div>
                      <div className="text-xs text-gray-500">{detailBuyer?.email || ''}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Pedido</div>
                      <div className="text-sm text-gray-700">#{detailOrder.id} — {detailOrder.estado}</div>
                      <div className="text-xs text-gray-500">{new Date(detailOrder.creadoEn || Date.now()).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Estado</div>
                      <div className="text-sm text-gray-700">{detailOrder.estado}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">Total</div>
                      <div className="text-sm text-gray-700">S/ {Number((detailTotals && detailTotals.total) || detailOrder.total || 0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Items</div>
                    <div className="mt-2 space-y-2">
                      {detailItems.map(it => (
                        <div key={it.id} className="flex items-center justify-between text-sm">
                          <span>{it.nombreProducto} x {it.cantidad}</span>
                          <span className="text-gray-700">S/ {Number(it.precioUnitario || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Historial</div>
                    <div className="mt-2 space-y-1">
                      {detailHistory.map((h, idx) => (
                        <div key={idx} className="text-xs text-gray-600">{h.estado} — {new Date(h.timestamp).toLocaleString()} {h.nota ? `· ${h.nota}` : ''}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={cerrarDetalle} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PedidosAgricultor
