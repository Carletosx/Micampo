import { useState, useEffect } from 'react'
import { SkeletonCard } from '../../components/ui/Skeleton'

const Direcciones = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t) }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Direcciones</h1>
        {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6"><SkeletonCard /><SkeletonCard /></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dirección principal</h2>
            <p className="text-sm text-gray-700">Aún no has agregado direcciones.</p>
            <button className="mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Agregar dirección</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Dirección de envío</h2>
            <p className="text-sm text-gray-700">Aún no has agregado direcciones.</p>
            <button className="mt-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">Agregar dirección</button>
          </div>
        </div>)}
      </div>
    </div>
  )
}

export default Direcciones
