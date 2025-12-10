import React, { useEffect, useState, useContext } from 'react'
import NavbarAgricultor from '../../components/layout/NavbarAgricultor'
import { AuthContext } from '../../context/AuthContext'
import { listOrdersByUser, listOrdersByAgricultor, getOrderItems } from '../../api/orders.js'

const accionesPorEstado = {
  PENDIENTE: [{ k: 'CONFIRMADO', label: 'Confirmar' }, { k: 'CANCELADO', label: 'Cancelar' }],
  CONFIRMADO: [{ k: 'EN_PREPARACION', label: 'Preparar' }],
  EN_PREPARACION: [{ k: 'EN_CAMINO', label: 'Despachar' }],
  EN_CAMINO: [{ k: 'ENTREGADO', label: 'Entregar' }]
}

const PedidosAgricultor = () => {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let r
      if (user?.id) {
        const ra = await listOrdersByAgricultor(user.id)
        console.log('listOrdersByAgricultor:', ra)
        if (ra.ok && Array.isArray(ra.data) && ra.data.length > 0) {
          setOrders(ra.data)
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
  }, [user?.id])

  const cambiarEstado = async (id, estado) => {
    const res = await fetch(`/api/orders/${id}/estado`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) })
    if (res.ok) {
      const r = await listOrdersByUser(undefined)
      if (r.ok) setOrders(r.data.filter(o => o.agricultorAuthId === (user?.id || o.agricultorAuthId)))
    }
  }

  const toggleDetalle = async (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, open: !o.open } : o))
    const it = await getOrderItems(id)
    if (it.ok) setOrders(prev => prev.map(o => o.id === id ? { ...o, items: it.data } : o))
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
                        <button className="px-2 py-1 rounded border" onClick={()=> toggleDetalle(o.id)}>{o.open ? 'Ocultar' : 'Ver'}</button>
                        {(accionesPorEstado[o.estado] || []).map(a => (
                          <button key={a.k} className="px-2 py-1 rounded bg-green-600 text-white" onClick={()=> cambiarEstado(o.id, a.k)}>{a.label}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  )
}

export default PedidosAgricultor
