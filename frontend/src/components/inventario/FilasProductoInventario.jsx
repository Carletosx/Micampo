import React from 'react';
import { FaPencilAlt, FaSync, FaEye, FaFileAlt, FaLock, FaCheck } from 'react-icons/fa';

const BadgeEstado = ({ estado }) => {
  const map = {
    disponible: 'bg-green-100 text-green-700',
    bajo: 'bg-yellow-100 text-yellow-700',
    critico: 'bg-red-100 text-red-700',
  };
  const label = {
    disponible: 'Disponible',
    bajo: 'Stock Bajo',
    critico: 'Stock Crítico',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${map[estado]}`}>{label[estado]}</span>
  );
};

const FilasProductoInventario = ({
  producto,
  estado,
  onEditar,
  onActualizarStock,
  onVerDetalles,
  onCrearMovimiento,
  onReservarStock,
  onConfirmarVenta,
}) => {
  const rowHighlight = estado === 'critico' ? 'bg-red-50' : '';
  const precio = producto.precio || producto.precioUnitario || 0;
  const unidad = producto.unidad || 'kg';
  const stockActual = producto.stockActual || 0;
  const stockMinimo = producto.stockMinimo || 0;
  
  return (
    <tr className={`hover:bg-gray-50 ${rowHighlight}`}>
      <td className="px-3 py-2">
        <img src={producto.imagen || producto.imagenUrl} alt={producto.nombre} className="w-10 h-10 rounded object-cover border" />
      </td>
      <td className="px-3 py-2 text-sm text-gray-800">{producto.nombre}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{producto.categoria}</td>
      <td className="px-3 py-2 text-sm text-gray-800">{stockActual} {unidad}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{stockMinimo}</td>
      <td className="px-3 py-2 text-sm text-gray-800">S/ {precio.toFixed(2)}</td>
      <td className="px-3 py-2 text-sm font-medium text-gray-800">S/ {(stockActual * precio).toFixed(2)}</td>
      <td className="px-3 py-2"><BadgeEstado estado={estado} /></td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            title="Editar"
            onClick={() => onEditar(producto)}
            className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded"
          >
            <FaPencilAlt size={14} />
          </button>
          <button
            title="Actualizar stock"
            onClick={() => onActualizarStock(producto)}
            className="text-green-600 hover:text-green-700 p-1.5 hover:bg-green-50 rounded"
          >
            <FaSync size={14} />
          </button>
          <button
            title="Registrar movimiento"
            onClick={() => onCrearMovimiento(producto)}
            className="text-orange-600 hover:text-orange-700 p-1.5 hover:bg-orange-50 rounded"
          >
            <FaFileAlt size={14} />
          </button>
          <button
            title="Reservar stock"
            onClick={() => onReservarStock(producto)}
            className="text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded"
          >
            <FaLock size={14} />
          </button>
          <button
            title="Confirmar venta"
            onClick={() => onConfirmarVenta(producto)}
            className="text-purple-600 hover:text-purple-700 p-1.5 hover:bg-purple-50 rounded"
          >
            <FaCheck size={14} />
          </button>
          <button
            title="Ver detalles"
            onClick={() => onVerDetalles(producto)}
            className="text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded"
          >
            <FaEye size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FilasProductoInventario;