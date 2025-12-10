import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'

const ModalEditarResena = ({ open, review, onClose, onSave }) => {
  const [calificacion, setCalificacion] = useState(review?.calificacion || 5)
  const [comentario, setComentario] = useState(review?.comentario || '')

  useEffect(()=>{ setCalificacion(review?.calificacion || 5); setComentario(review?.comentario || '') }, [review])

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar reseña</h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Calificación</label>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} onClick={()=> setCalificacion(i+1)} className={`w-6 h-6 cursor-pointer ${i < calificacion ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Comentario</label>
          <textarea className="w-full border border-gray-300 rounded-md p-2 h-28" value={comentario} onChange={(e)=> setComentario(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={()=> onSave({ calificacion, comentario })}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}

export default ModalEditarResena
