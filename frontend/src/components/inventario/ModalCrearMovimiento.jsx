import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { crearMovimiento } from '../../api/inventory';
import { NotificationContext } from '../../contexts/NotificationContext';

const ModalCrearMovimiento = ({ isOpen, producto, onClose, onSave }) => {
  const [tipo, setTipo] = useState('ENTRADA');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useContext(NotificationContext) || { showSuccess: () => {}, showError: () => {} };

  if (!isOpen || !producto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cantidad || cantidad <= 0) {
      showError('Ingresa una cantidad válida');
      return;
    }

    if (!descripcion.trim()) {
      showError('Ingresa una descripción');
      return;
    }

    setLoading(true);
    try {
      const result = await crearMovimiento(producto.id, {
        tipo,
        cantidad: parseInt(cantidad),
        descripcion: descripcion.trim(),
      });

      if (result.ok) {
        showSuccess(`Movimiento ${tipo.toLowerCase()} registrado correctamente`);
        setCantidad('');
        setDescripcion('');
        setTipo('ENTRADA');
        onSave();
        onClose();
      } else if (result.unauthorized) {
        showError('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else {
        showError(result.data?.message || 'Error al registrar el movimiento');
      }
    } catch (err) {
      showError('Error de conexión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCantidad('');
    setDescripcion('');
    setTipo('ENTRADA');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Registrar Movimiento</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <input
              type="text"
              value={producto.nombre || ''}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              disabled={loading}
            >
              <option value="ENTRADA">Entrada (Aumenta stock)</option>
              <option value="SALIDA">Salida (Disminuye stock)</option>
              <option value="AJUSTE">Ajuste (Corrección)</option>
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad (kg) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej: 50"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Recolección de cosecha del 9 de diciembre"
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              disabled={loading}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <p><strong>Stock Actual:</strong> {producto.stockActual || 0} kg</p>
            {tipo === 'ENTRADA' && (
              <p className="mt-1 text-green-700">Después: {(producto.stockActual || 0) + (parseFloat(cantidad) || 0)} kg</p>
            )}
            {tipo === 'SALIDA' && (
              <p className="mt-1 text-orange-700">Después: {(producto.stockActual || 0) - (parseFloat(cantidad) || 0)} kg</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Registrar Movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearMovimiento;
