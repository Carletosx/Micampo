import React, { useEffect, useState } from 'react';
import { FaCamera } from 'react-icons/fa';

const ModalCambiarFoto = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (file) {
      onSave(file);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Actualizar foto de perfil</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">Sin imagen</span>
            )}
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer">
            <FaCamera />
            <span>Seleccionar imagen</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} className="px-3 py-2 rounded-md border border-green-600 text-green-700 bg-white hover:bg-green-50">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModalCambiarFoto);