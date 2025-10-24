import React from 'react';
import { FaPencilAlt, FaSync, FaEye } from 'react-icons/fa';

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
}) => {
  const rowHighlight = estado === 'critico' ? 'bg-red-50' : '';
  return (
    <tr className={`hover:bg-gray-50 ${rowHighlight}`}>
      <td className="px-3 py-2">
        <img src={producto.imagen} alt={producto.nombre} className="w-10 h-10 rounded object-cover border" />
      </td>
      <td className="px-3 py-2 text-sm text-gray-800">{producto.nombre}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{producto.categoria}</td>
      <td className="px-3 py-2 text-sm text-gray-800">{producto.stockActual} {producto.unidad}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{producto.stockMinimo}</td>
      <td className="px-3 py-2 text-sm text-gray-800">S/ {producto.precioUnitario.toFixed(2)}</td>
      <td className="px-3 py-2 text-sm font-medium text-gray-800">S/ {(producto.stockActual * producto.precioUnitario).toFixed(2)}</td>
      <td className="px-3 py-2"><BadgeEstado estado={estado} /></td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <button
            title="Editar"
            onClick={() => onEditar(producto)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaPencilAlt />
          </button>
          <button
            title="Actualizar stock"
            onClick={() => onActualizarStock(producto)}
            className="text-green-600 hover:text-green-700"
          >
            <FaSync />
          </button>
          <button
            title="Ver detalles"
            onClick={() => onVerDetalles(producto)}
            className="text-blue-600 hover:text-blue-700"
          >
            <FaEye />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FilasProductoInventario;