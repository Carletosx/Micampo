import { useState, useEffect } from 'react'
import { SkeletonCard } from '../../components/ui/Skeleton'

const MetodosPago = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Métodos de pago</h1>
        {loading ? <SkeletonCard /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-700">No tienes métodos de pago guardados.</p>
          <button className="mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Agregar método de pago</button>
        </div>)}
      </div>
    </div>
  )
}

export default MetodosPago
