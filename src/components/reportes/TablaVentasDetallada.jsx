import React from 'react';

const Row = ({ r }) => (
  <tr className="border-b last:border-0">
    <td className="px-3 py-2 text-sm text-gray-700">{r.fecha}</td>
    <td className="px-3 py-2 text-sm text-gray-700">#{r.pedido}</td>
    <td className="px-3 py-2 text-sm text-gray-700">{r.cliente}</td>
    <td className="px-3 py-2 text-sm text-gray-700">{r.productos}</td>
    <td className="px-3 py-2 text-sm font-semibold text-emerald-700">{r.total}</td>
  </tr>
);

const TablaVentasDetallada = ({ rows = [], title = 'Ventas Detalladas', loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-2 text-xs text-gray-500">Fecha</th>
              <th className="px-3 py-2 text-xs text-gray-500">Pedido</th>
              <th className="px-3 py-2 text-xs text-gray-500">Cliente</th>
              <th className="px-3 py-2 text-xs text-gray-500">Productos</th>
              <th className="px-3 py-2 text-xs text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_,i) => (
                <tr key={i}>
                  <td className="px-3 py-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-3 py-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-3 py-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-3 py-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-3 py-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                </tr>
              ))
            ) : (
              rows.map((r, idx) => <Row key={idx} r={r} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(TablaVentasDetallada);