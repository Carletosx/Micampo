import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder, getOrderTotals, getOrderHistory, getOrderItems } from '../../api/orders.js'

const TimelineStep = ({ label, active }) => (
  <div className="flex items-center">
    <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-600' : 'bg-gray-300'}`}></div>
    <span className={`ml-2 text-xs ${active ? 'text-green-700 font-medium' : 'text-gray-600'}`}>{label}</span>
  </div>
)

const PedidoDetalle = () => {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [totales, setTotales] = useState({ subtotal: 0, envio: 0, descuento: 0, total: 0 })
  const [historial, setHistorial] = useState([])
  useEffect(() => {
    const load = async () => {
      const r = await getOrder(id)
      if (r.ok) setPedido(r.data)
      const t = await getOrderTotals(id)
      if (t.ok) setTotales(t.data)
      const h = await getOrderHistory(id)
      if (h.ok) setHistorial(h.data)
      const it = await getOrderItems(id)
      if (it.ok) setPedido(prev => ({ ...(prev || {}), items: it.data }))
    }
    load()
  }, [id])

  const steps = ['PENDIENTE','CONFIRMADO','EN_PREPARACION','EN_CAMINO','ENTREGADO']
  const activeIndex = pedido ? steps.indexOf(pedido.estado || 'PENDIENTE') : 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Pedido #{id}</h1>
        <Link to="/comprador/ordenes" className="text-sm text-primary-600">Volver a mis ordenes</Link>
      </div>
      <div className="bg-white border rounded p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {steps.map((s, idx) => (<TimelineStep key={s} label={s} active={idx <= activeIndex} />))}
          </div>
          <div className="text-sm text-gray-700">Estado: <span className="font-medium">{pedido?.estado || 'PENDIENTE'}</span></div>
        </div>
        <div className="mt-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Historial</h3>
          <div className="space-y-1">
            {historial.map((ev, i) => (
              <div key={i} className="text-xs text-gray-600 flex justify-between">
                <span>{new Date(ev.timestamp || Date.now()).toLocaleString()}</span>
                <span className="font-medium">{ev.estado}</span>
                {ev.nota && <span className="text-gray-500">{ev.nota}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border rounded p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Productos</h2>
          <div className="divide-y">
            {(pedido?.items || []).map(it => (
              <div key={it.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800">{it.nombreProducto}</div>
                  <div className="text-xs text-gray-600">Cantidad: {it.cantidad}</div>
                </div>
                <div className="text-sm text-gray-800">S/ {Number(it.precioUnitario || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Totales</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>S/ {Number(totales.subtotal || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>S/ {Number(totales.envio || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Descuento</span><span>S/ {Number(totales.descuento || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span>S/ {Number(totales.total || 0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PedidoDetalle
