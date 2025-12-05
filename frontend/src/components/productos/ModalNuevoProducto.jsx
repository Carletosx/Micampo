import React, { useEffect, useState } from 'react';
import API_BASE, { API_ORIGIN } from '../../api/config.js';

export default function ModalNuevoProducto({ isOpen, producto, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Tubérculos',
    estado: 'activo',
    precio: 0,
    unidad: 'kg',
    stock: 0,
    stockMin: 0,
    descripcion: '',
    imagenUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || '',
        categoria: producto.categoria || 'Tubérculos',
        estado: producto.estado || 'activo',
        precio: producto.precio ?? 0,
        unidad: producto.unidad || 'kg',
        stock: producto.stock ?? 0,
        stockMin: producto.stockMin ?? 0,
        descripcion: producto.descripcion || '',
        imagenUrl: producto.imagenUrl || '',
      });
    } else {
      setForm({
        nombre: '',
        categoria: 'Tubérculos',
        estado: 'activo',
        precio: 0,
        unidad: 'kg',
        stock: 0,
        stockMin: 0,
        descripcion: '',
        imagenUrl: '',
      });
    }
    setErrors({});
  }, [producto]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (Number(form.precio) <= 0) e.precio = 'El precio debe ser positivo';
    if (Number(form.stock) < 0) e.stock = 'El stock no puede ser negativo';
    if (Number(form.stockMin) < 0) e.stockMin = 'El stock mínimo no puede ser negativo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mapCategoria = (c) => {
    const t = (c || '').toLowerCase();
    if (t === 'tubérculos' || t === 'tuberculos') return 'TUBERCULOS';
    if (t === 'verduras') return 'VERDURAS';
    if (t === 'frutas') return 'FRUTAS';
    if (t === 'granos') return 'GRANOS';
    if (t === 'lácteos' || t === 'lacteos') return 'LACTEOS';
    if (t === 'carnes') return 'CARNES';
    return null;
  };

  const handleSave = () => {
    if (!validate()) return;
    const cat = mapCategoria(form.categoria);
    if (!cat) {
      setErrors((prev) => ({ ...prev, categoria: 'Categoría no soportada' }));
      return;
    }
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: cat,
      imagenUrl: form.imagenUrl,
    };
    onSave?.(payload);
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg','image/png','image/webp'];
    const maxSize = 2 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, imagenUrl: 'Formato no permitido (jpeg, png, webp)' }));
      setUploadStatus('error');
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, imagenUrl: 'La imagen supera 2MB' }));
      setUploadStatus('error');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/files/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data?.url) {
        setField('imagenUrl', data.url);
        setUploadStatus('ok');
      } else {
        setErrors((prev) => ({ ...prev, imagenUrl: 'No se pudo subir la imagen' }));
        setUploadStatus('error');
      }
    } catch {
      setErrors((prev) => ({ ...prev, imagenUrl: 'Error al subir la imagen' }));
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Nombre</label>
            <input
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.nombre}
              onChange={(e) => setField('nombre', e.target.value)}
              placeholder="Nombre del producto"
            />
            {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Categoría</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.categoria}
              onChange={(e) => setField('categoria', e.target.value)}
            >
              {['Tubérculos','Verduras','Frutas','Granos','Lácteos','Carnes'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Estado</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.estado}
              onChange={(e) => setField('estado', e.target.value)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Precio</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.precio}
              onChange={(e) => setField('precio', e.target.value)}
              placeholder="0.00"
            />
            {errors.precio && <p className="text-red-600 text-xs mt-1">{errors.precio}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Unidad</label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.unidad}
              onChange={(e) => setField('unidad', e.target.value)}
            >
              {['kg','unidad','litro','caja'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Stock actual</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.stock}
              onChange={(e) => setField('stock', e.target.value)}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Stock mínimo</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.stockMin}
              onChange={(e) => setField('stockMin', e.target.value)}
              placeholder="0"
            />
            {errors.stockMin && <p className="text-red-600 text-xs mt-1">{errors.stockMin}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Descripción</label>
            <textarea
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={form.descripcion}
              onChange={(e) => setField('descripcion', e.target.value)}
              rows={3}
              placeholder="Descripción breve del producto"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Imagen del producto</label>
            <input type="file" accept="image/*" className="w-full" onChange={handleImageChange} />
            {uploading && <p className="text-xs text-gray-500 mt-1">Subiendo imagen...</p>}
            {!uploading && uploadStatus === 'ok' && <p className="text-xs text-green-600 mt-1">Imagen subida</p>}
            {form.imagenUrl && (
              <div className="mt-2">
                <img src={form.imagenUrl.startsWith('/uploads/') ? `${API_ORIGIN}${form.imagenUrl}` : form.imagenUrl} alt="preview" className="h-24 rounded border" />
              </div>
            )}
            {errors.imagenUrl && <p className="text-red-600 text-xs mt-1">{errors.imagenUrl}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
