import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { reservarStock } from '../../api/inventory';
import { NotificationContext } from '../../contexts/NotificationContext';

const ModalReservarStock = ({ isOpen, producto, onClose, onSave }) => {
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useContext(NotificationContext) || { showSuccess: () => {}, showError: () => {} };

  if (!isOpen || !producto) return null;

  const stockDisponible = (producto.stockActual || 0) - (producto.stockReservado || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cantidadNum = parseFloat(cantidad);
    
    if (!cantidad || cantidadNum <= 0) {
      showError('Ingresa una cantidad válida');
      return;
    }

    if (cantidadNum > stockDisponible) {
      showError(`No hay suficiente stock disponible. Disponible: ${stockDisponible} kg`);
      return;
    }

    setLoading(true);
    try {
      const result = await reservarStock(producto.id, {
        cantidad: cantidadNum,
        descripcion: descripcion.trim() || 'Reserva manual',
      });

      if (result.ok) {
        showSuccess('Stock reservado correctamente');
        setCantidad('');
        setDescripcion('');
        onSave();
        onClose();
      } else if (result.unauthorized) {
        showError('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else {
        showError(result.data?.message || 'Error al reservar el stock');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Reservar Stock</h2>
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

          {/* Info de Stock */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm space-y-1">
            <p><strong>Stock Actual:</strong> {producto.stockActual || 0} kg</p>
            <p><strong>Stock Reservado:</strong> {producto.stockReservado || 0} kg</p>
            <p className="text-green-700 font-medium"><strong>Stock Disponible:</strong> {stockDisponible} kg</p>
          </div>

          {/* Cantidad a Reservar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad a Reservar (kg) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              max={stockDisponible}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={`Máximo: ${stockDisponible} kg`}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Reserva para orden #123 del cliente Juan Pérez"
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          {cantidad && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-700">
              <p>Después de la reserva:</p>
              <p><strong>Stock Reservado:</strong> {(producto.stockReservado || 0) + parseFloat(cantidad)} kg</p>
              <p><strong>Stock Disponible:</strong> {stockDisponible - parseFloat(cantidad)} kg</p>
            </div>
          )}

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
              disabled={loading || !cantidad}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Reservando...' : 'Reservar Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReservarStock;
