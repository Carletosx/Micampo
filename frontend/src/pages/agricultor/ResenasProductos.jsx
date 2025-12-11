import React, { useEffect, useState, useContext, useMemo } from 'react'
import NavbarAgricultor from '../../components/layout/NavbarAgricultor'
import { AuthContext } from '../../context/AuthContext'
import { listReviewsBySeller } from '../../api/reviews.js'
import { assignMissingVendor } from '../../api/products.js'
import { useSearchParams } from 'react-router-dom'

const ResenasProductos = () => {
  const { user } = useContext(AuthContext)
  const [sp] = useSearchParams()
  const vendedorParam = sp.get('vendedor') ? Number(sp.get('vendedor')) : null
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState([])
  const [syncing, setSyncing] = useState(false)
  const [syncInfo, setSyncInfo] = useState(null)
  const [sortKey, setSortKey] = useState('count')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)

  const getAuthIdFromToken = () => {
    try {
      const t = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null)
      if (!t) return null
      const payload = JSON.parse(atob(t.split('.')[1]))
      return payload?.usuarioId ? Number(payload.usuarioId) : null
    } catch { return null }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const fallbackId = getAuthIdFromToken()
      const authId = user?.id || vendedorParam || fallbackId
      if (authId) {
        const r = await listReviewsBySeller(authId)
        if (r.ok && Array.isArray(r.data)) {
          if (r.data.length === 0) {
            const a = await assignMissingVendor()
            if (a.ok) {
              const r2 = await listReviewsBySeller(authId)
              if (r2.ok && Array.isArray(r2.data)) {
                const rows = r2.data.map(rv => ({ id: rv.id, productoId: rv.productoId, productoNombre: rv.productoNombre || '-', calificacion: rv.calificacion, comentario: rv.comentario, autor: rv.autorNombre || (rv.autorAuthId ? `Usuario ${rv.autorAuthId}` : 'Invitado') }))
                setItems(rows)
              } else setItems([])
            } else setItems([])
          } else {
            const rows = r.data.map(rv => ({ id: rv.id, productoId: rv.productoId, productoNombre: rv.productoNombre || '-', calificacion: rv.calificacion, comentario: rv.comentario, autor: rv.autorNombre || (rv.autorAuthId ? `Usuario ${rv.autorAuthId}` : 'Invitado') }))
            setItems(rows)
          }
        } else setItems([])
      } else {
        setItems([])
      }
      setLoading(false)
    }
    load()
  }, [user?.id, vendedorParam])

  const grouped = useMemo(() => {
    const f = (query || '').toLowerCase()
    const g = {}
    items.forEach(it => {
      const pid = it.productoId
      if (!g[pid]) g[pid] = { productoId: pid, productoNombre: it.productoNombre || '-', reseñas: [], count: 0, sum: 0 }
      g[pid].reseñas.push(it)
      g[pid].count += 1
      g[pid].sum += Number(it.calificacion || 0)
    })
    let arr = Object.values(g).map(x => ({ ...x, promedio: x.count ? Math.round(x.sum / x.count) : 0 }))
    if (f) arr = arr.filter(x => {
      const hn = x.productoNombre.toLowerCase().includes(f)
      const hr = x.reseñas.some(r => (r.autor || '').toLowerCase().includes(f) || (r.comentario || '').toLowerCase().includes(f))
      return hn || hr
    })
    arr.sort((a, b) => {
      let va = a.count, vb = b.count
      if (sortKey === 'avg') { va = a.promedio; vb = b.promedio }
      if (sortKey === 'name') { va = a.productoNombre.toLowerCase(); vb = b.productoNombre.toLowerCase() }
      if (sortKey === 'name') return sortDir === 'asc' ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0)
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [items, query, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(grouped.length / pageSize))
  const currentPage = Math.min(page, totalPages - 1)
  const pageItems = grouped.slice(currentPage * pageSize, currentPage * pageSize + pageSize)

  const toggleExpanded = (pid) => {
    setExpanded(prev => (prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]))
  }

  const handleSync = async () => {
    setSyncing(true)
    setSyncInfo(null)
    const res = await assignMissingVendor()
    const fallbackId = getAuthIdFromToken()
    const authId = user?.id || vendedorParam || fallbackId
    if (authId) {
      const r = await listReviewsBySeller(authId)
      if (r.ok && Array.isArray(r.data)) setItems(r.data.map(rv => ({ id: rv.id, productoId: rv.productoId, productoNombre: rv.productoNombre || '-', calificacion: rv.calificacion, comentario: rv.comentario, autor: rv.autorNombre || (rv.autorAuthId ? `Usuario ${rv.autorAuthId}` : 'Invitado') })))
    }
    setSyncInfo(res?.data || null)
    setSyncing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor nombre={user?.displayName || ''} rol="Agricultor" />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Reseñas de mis productos</h1>
          <div className="flex gap-2">
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Buscar producto, autor o comentario" className="border border-gray-300 rounded px-3 py-2 text-sm w-64" />
            <button disabled={syncing} className={`px-3 py-2 rounded text-sm ${syncing ? 'bg-gray-300 text-gray-700' : 'bg-green-600 text-white'}`} onClick={handleSync}>{syncing ? 'Sincronizando...' : 'Sincronizar reseñas'}</button>
            <select value={sortKey} onChange={e=> { setSortKey(e.target.value); setPage(0) }} className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="count">Ordenar por cantidad</option>
              <option value="avg">Ordenar por promedio</option>
              <option value="name">Ordenar por nombre</option>
            </select>
            <select value={sortDir} onChange={e=> { setSortDir(e.target.value); setPage(0) }} className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select value={pageSize} onChange={e=> { setPageSize(Number(e.target.value)); setPage(0) }} className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>
        </div>
        {!user?.id && (
          <p className="text-sm text-gray-600 mb-3">No has iniciado sesión. Puedes ver reseñas pasando el parámetro <code>?vendedor=AUTH_ID</code> en la URL.</p>
        )}
        {syncInfo && (
          <div className="mb-3 text-xs text-gray-700">{typeof syncInfo.actualizados === 'number' ? `Productos actualizados: ${syncInfo.actualizados}` : ''}</div>
        )}
        {loading ? (
          <div className="text-gray-600">Cargando...</div>
        ) : grouped.length === 0 ? (
          <div className="text-gray-600">Aún no hay reseñas.</div>
        ) : (
          <div className="space-y-3">
            {pageItems.map(gr => (
              <div key={gr.productoId} className="border border-gray-200 rounded">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-gray-800">{gr.productoNombre}</div>
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{gr.count} reseñas</span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Promedio {gr.promedio}</span>
                  </div>
                  <button className="text-xs text-blue-700" onClick={()=> toggleExpanded(gr.productoId)}>{expanded.includes(gr.productoId) ? 'Colapsar' : 'Ver detalles'}</button>
                </div>
                {expanded.includes(gr.productoId) && (
                  <div className="p-3">
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="py-2 px-3 text-left">Autor</th>
                            <th className="py-2 px-3 text-left">Calificación</th>
                            <th className="py-2 px-3 text-left">Comentario</th>
                            <th className="py-2 px-3 text-left">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gr.reseñas.map((it, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="py-2 px-3">{it.autor}</td>
                              <td className="py-2 px-3">{[...Array(5)].map((_, i) => (<svg key={i} className={`w-3 h-3 inline ${i < it.calificacion ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>))}</td>
                              <td className="py-2 px-3">{it.comentario}</td>
                              <td className="py-2 px-3">
                                {user?.id && (
                                  <button className="text-xs text-red-600" onClick={async ()=>{
                                    if (!confirm('¿Eliminar esta reseña?')) return
                                    const { deleteReview } = await import('../../api/reviews.js')
                                    const res = await deleteReview(it.id)
                                    if (res.ok) {
                                      const r = await listReviewsBySeller(user.id)
                                      if (r.ok) setItems(r.data.map(rv=>({ id: rv.id, productoId: rv.productoId, productoNombre: rv.productoNombre || '-', calificacion: rv.calificacion, comentario: rv.comentario, autor: rv.autorNombre || (rv.autorAuthId ? `Usuario ${rv.autorAuthId}` : 'Invitado') })))
                                    }
                                  }}>Eliminar</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-600">Página {currentPage + 1} de {totalPages}</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-gray-200 text-sm" disabled={currentPage === 0} onClick={()=> setPage(p=> Math.max(0, p-1))}>Anterior</button>
                <button className="px-3 py-1 rounded bg-gray-200 text-sm" disabled={currentPage >= totalPages - 1} onClick={()=> setPage(p=> Math.min(totalPages - 1, p+1))}>Siguiente</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResenasProductos
