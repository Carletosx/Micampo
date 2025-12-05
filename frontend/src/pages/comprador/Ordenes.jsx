import React from 'react'
import { SkeletonCard } from '../../components/ui/Skeleton'

const Ordenes = () => {
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])
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
            <div className="p-5 grid grid-cols-5 items-center text-sm">
              <div className="font-medium text-gray-800">#0001</div>
              <div className="text-gray-600">2025-12-01</div>
              <div className="text-green-700">Entregado</div>
              <div className="text-gray-800">S/ 0.00</div>
              <div>
                <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">Ver</button>
              </div>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  )
}

export default Ordenes
