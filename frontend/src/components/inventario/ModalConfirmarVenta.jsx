import React, { useState, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { confirmarVenta } from '../../api/inventory';
import { NotificationContext } from '../../contexts/NotificationContext';

const ModalConfirmarVenta = ({ isOpen, producto, onClose, onSave }) => {
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useContext(NotificationContext) || { showSuccess: () => {}, showError: () => {} };

  if (!isOpen || !producto) return null;

  const stockReservado = producto.stockReservado || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cantidadNum = parseFloat(cantidad);
    
    if (!cantidad || cantidadNum <= 0) {
      showError('Ingresa una cantidad válida');
      return;
    }

    if (cantidadNum > stockReservado) {
      showError(`No hay suficiente stock reservado. Reservado: ${stockReservado} kg`);
      return;
    }

    setLoading(true);
    try {
      const result = await confirmarVenta(producto.id, {
        cantidad: cantidadNum,
        descripcion: descripcion.trim() || 'Confirmación de venta',
      });

      if (result.ok) {
        showSuccess('Venta confirmada correctamente');
        setCantidad('');
        setDescripcion('');
        onSave();
        onClose();
      } else if (result.unauthorized) {
        showError('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else {
        showError(result.data?.message || 'Error al confirmar la venta');
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
          <h2 className="text-lg font-semibold text-gray-800">Confirmar Venta</h2>
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
          <div className="bg-purple-50 border border-purple-200 rounded-md p-3 text-sm space-y-1">
            <p><strong>Stock Actual:</strong> {producto.stockActual || 0} kg</p>
            <p className="font-medium text-orange-700"><strong>Stock Reservado:</strong> {stockReservado} kg</p>
            <p><strong>Stock Mínimo:</strong> {producto.stockMinimo || 0} kg</p>
          </div>

          {/* Cantidad a Confirmar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad a Confirmar (kg) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              max={stockReservado}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={`Máximo: ${stockReservado} kg`}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={loading || stockReservado === 0}
            />
            {stockReservado === 0 && (
              <p className="text-red-600 text-xs mt-1">No hay stock reservado para confirmar</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Confirmación de pago - Orden #123 - Cliente Juan Pérez"
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              disabled={loading}
            />
          </div>

          {/* Preview */}
          {cantidad && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              <p className="font-medium mb-1">Después de confirmar:</p>
              <p><strong>Stock Actual:</strong> {(producto.stockActual || 0) - parseFloat(cantidad)} kg</p>
              <p><strong>Stock Reservado:</strong> {stockReservado - parseFloat(cantidad)} kg</p>
              <p className={`mt-1 ${((producto.stockActual || 0) - parseFloat(cantidad)) < (producto.stockMinimo || 0) ? 'text-red-800 font-medium' : 'text-green-700'}`}>
                {((producto.stockActual || 0) - parseFloat(cantidad)) < (producto.stockMinimo || 0) ? 
                  '⚠️ ALERTA: Stock caerá por debajo del mínimo' : 
                  '✓ Stock suficiente'}
              </p>
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
              disabled={loading || !cantidad || stockReservado === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalConfirmarVenta;
