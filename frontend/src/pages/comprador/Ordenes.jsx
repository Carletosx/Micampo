import { useState, useEffect, useContext } from 'react'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { listOrdersByUser } from '../../api/orders.js'
import { AuthContext } from '../../context/AuthContext'

const Ordenes = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const { user } = useContext(AuthContext)
  useEffect(() => { 
    const load = async () => {
      setLoading(true)
      const r = await listOrdersByUser(user?.id || null)
      if (r.ok) setOrders(r.data)
      setLoading(false)
    }
    load()
  }, [user?.id])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis compras</h1>
        {loading ? <SkeletonCard /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b">
            <div className="grid grid-cols-5 text-xs text-gray-500">
              <div>Pedido</div>
              <div>Fecha</div>
              <div>Estado</div>
              <div>Total</div>
              <div>Acciones</div>
            </div>
          </div>
          <div className="divide-y">
            {orders.map(o => (
              <div key={o.id} className="p-5 grid grid-cols-5 items-center text-sm">
                <div className="font-medium text-gray-800">#{o.id}</div>
                <div className="text-gray-600">{new Date(o.creadoEn || Date.now()).toLocaleDateString()}</div>
                <div className="text-gray-700">{o.estado}</div>
                <div className="text-gray-800">S/ {Number(o.total || 0).toFixed(2)}</div>
                <div>
                  <a href={`/comprador/pedidos/${o.id}`} className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">Ver</a>
                </div>
              </div>
            ))}
          </div>
        </div>)}
      </div>
    </div>
  )
}

export default Ordenes
