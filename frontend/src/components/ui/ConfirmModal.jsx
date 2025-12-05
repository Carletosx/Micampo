import React from 'react'

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">{cancelText}</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-md bg-orange-600 hover:bg-orange-700 text-white">{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
