import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrdersByUser } from '../../api/orders.js'
import { AuthContext } from '../../context/AuthContext'

const DashboardPage = () => {
  const { user } = React.useContext(AuthContext)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const load = async () => {
      const authId = user?.id || null
      const r = await listOrdersByUser(authId)
      if (r.ok) setOrders(r.data)
    }
    load()
  }, [user?.id])

  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Dashboard</h1>
      
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Pedidos Totales</h3>
          <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Gastado</h3>
          <p className="text-3xl font-bold text-primary-600">S/ {orders.reduce((acc, o) => acc + (Number(o.total || 0)), 0).toFixed(2)}</p>
        </div>
      </div>
      
      {/* Pedidos Recientes */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Pedidos Recientes</h2>
          <Link to="/comprador/pedidos" className="text-primary-600 hover:text-primary-700">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.creadoEn || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    S/ {Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.estado === 'ENTREGADO' ? 'bg-green-100 text-green-800' : 
                        order.estado === 'EN_PREPARACION' ? 'bg-blue-100 text-blue-800' : 
                        order.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link to={`/comprador/pedidos/${order.id}`} className="text-primary-600 hover:text-primary-900">
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      
    </div>
  );
};

export default DashboardPage;
