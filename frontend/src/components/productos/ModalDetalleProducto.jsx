import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/paths.js'
import { getProductDetail, updateProductDetail, uploadProductVideo } from '../../api/productDetails.js'
import { API_ORIGIN } from '../../api/config.js'

export default function ModalDetalleProducto({ isOpen, producto, onClose, onSaved, notify }) {
  const [form, setForm] = useState({ descripcionLarga: '', informacionAdicional: '', videoUrl: '' })
  const defaultRows = [
    { etiqueta: 'Origen', valor: '', fixed: true },
    { etiqueta: 'Temporada', valor: '', fixed: true },
    { etiqueta: 'Almacenamiento', valor: '', fixed: true },
    { etiqueta: 'Certificación', valor: '', fixed: true },
    { etiqueta: 'Peso', valor: '', fixed: true },
  ]
  const [infoRows, setInfoRows] = useState(defaultRows)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      if (!producto) return
      const { ok, data } = await getProductDetail(producto.id)
      if (ok && data) {
        setForm({ descripcionLarga: data.descripcionLarga || '', informacionAdicional: data.informacionAdicional || '', videoUrl: data.videoUrl || '' })
        try {
          const parsed = data.informacionAdicional ? JSON.parse(data.informacionAdicional) : []
          if (Array.isArray(parsed) && parsed.length) setInfoRows(parsed)
          else setInfoRows(defaultRows)
        } catch { setInfoRows(defaultRows) }
      } else {
        setInfoRows(defaultRows)
        setForm({ descripcionLarga: '', informacionAdicional: '', videoUrl: '' })
      }
    }
    load()
  }, [producto])

  if (!isOpen || !producto) return null

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, informacionAdicional: JSON.stringify(infoRows) }
    const { ok, unauthorized } = await updateProductDetail(producto.id, payload)
    setSaving(false)
    if (unauthorized) { notify?.('Tu sesión expiró. Inicia sesión nuevamente.', 'error'); navigate(ROUTES.LOGIN); return }
    if (ok) { notify?.('Información actualizada', 'success'); onSaved?.(form); onClose?.() } else notify?.('No se pudo actualizar', 'error')
  }

  const toEmbed = (url) => {
    if (!url) return ''
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
        let id = ''
        if (u.hostname.includes('youtu.be')) id = u.pathname.replace('/', '')
        else id = u.searchParams.get('v') || ''
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (u.hostname.includes('vimeo.com')) {
        const parts = u.pathname.split('/').filter(Boolean)
        const id = parts.pop()
        return id ? `https://player.vimeo.com/video/${id}` : null
      }
      return null
    } catch { return null }
  }

  const handleVideoFile = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type !== 'video/mp4') { notify?.('Solo se admite MP4', 'error'); return }
    if (f.size > 50 * 1024 * 1024) { notify?.('El video supera 50MB', 'error'); return }
    setUploadingVideo(true)
    const { ok, data } = await uploadProductVideo(f)
    setUploadingVideo(false)
    if (ok && data?.url) setForm((prev) => ({ ...prev, videoUrl: data.url }))
    else notify?.('No se pudo subir el video', 'error')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información adicional</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Descripción larga</label>
            <textarea className="w-full border border-gray-200 rounded-md px-3 py-2" rows={4} value={form.descripcionLarga} onChange={(e) => setField('descripcionLarga', e.target.value)} placeholder="Describe el producto en detalle" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Información adicional</label>
            <div className="space-y-2">
              {infoRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  {row.fixed ? (
                    <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-700 select-none">{row.etiqueta}</div>
                  ) : (
                    <input className="border border-gray-200 rounded-md px-3 py-2" placeholder="Etiqueta (ej. Origen)" value={row.etiqueta} onChange={(e) => setInfoRows((prev) => prev.map((r, i) => i===idx ? { ...r, etiqueta: e.target.value } : r))} />
                  )}
                  <input className="border border-gray-200 rounded-md px-3 py-2" placeholder="Valor" value={row.valor} onChange={(e) => setInfoRows((prev) => prev.map((r, i) => i===idx ? { ...r, valor: e.target.value } : r))} />
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" onClick={() => setInfoRows((prev) => [...prev, { etiqueta: '', valor: '' }])} className="px-3 py-2 text-sm rounded-md border border-gray-300">Añadir fila</button>
                {infoRows.length > defaultRows.length && (
                  <button type="button" onClick={() => setInfoRows((prev) => {
                    const last = prev[prev.length - 1]
                    return last?.fixed ? prev : prev.slice(0, -1)
                  })} className="px-3 py-2 text-sm rounded-md border border-gray-300">Quitar última</button>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Video (URL)</label>
            <input className="w-full border border-gray-200 rounded-md px-3 py-2" value={form.videoUrl} onChange={(e) => setField('videoUrl', e.target.value)} placeholder="https://... (YouTube, Vimeo)" />
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <div>
                <label className="text-xs text-gray-500">o subir MP4 (máx 50MB)</label>
                <input type="file" accept="video/mp4" className="w-full" onChange={handleVideoFile} />
                {uploadingVideo && <p className="text-xs text-gray-500 mt-1">Subiendo video...</p>}
              </div>
              {form.videoUrl && (
                <div>
                  {form.videoUrl.endsWith('.mp4') || form.videoUrl.startsWith('/uploads/') ? (
                    <video className="w-full h-40 rounded" src={form.videoUrl.startsWith('/uploads/') ? `${API_ORIGIN}${form.videoUrl}` : form.videoUrl} controls />
                  ) : (
                    toEmbed(form.videoUrl) ? (
                      <iframe title="video" className="w-full h-40 rounded" src={toEmbed(form.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <p className="text-xs text-red-600">Enlace inválido. Usa https://youtu.be/ID o https://www.youtube.com/watch?v=ID o Vimeo.</p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  )
}
