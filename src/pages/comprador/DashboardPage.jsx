import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Datos de ejemplo para el dashboard
  const recentOrders = [
    { id: 1, date: '2023-11-15', total: 125.90, status: 'Entregado' },
    { id: 2, date: '2023-11-10', total: 89.50, status: 'En proceso' },
    { id: 3, date: '2023-11-05', total: 210.75, status: 'Pendiente' },
  ];

  const favoriteProducts = [
    { id: 1, name: 'Manzana Orgánica', price: 5.90, image: '/src/assets/images/products/apple.jpg' },
    { id: 2, name: 'Fresa Orgánica', price: 9.90, image: '/src/assets/images/products/strawberry.jpg' },
    { id: 3, name: 'Brócoli Orgánico', price: 3.50, image: '/src/assets/images/products/broccoli.jpg' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Dashboard</h1>
      
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Pedidos Totales</h3>
          <p className="text-3xl font-bold text-primary-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Productos Favoritos</h3>
          <p className="text-3xl font-bold text-primary-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Gastado</h3>
          <p className="text-3xl font-bold text-primary-600">S/ 1,250.90</p>
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    S/ {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 
                        order.status === 'En proceso' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
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
      
      {/* Productos Favoritos */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Productos Favoritos</h2>
          <Link to="/comprador/favoritos" className="text-primary-600 hover:text-primary-700">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-gray-500 text-sm">S/</span>
                    <span className="text-lg font-bold text-gray-800">{product.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">/kg</span>
                  </div>
                  <Link to={`/comprador/catalogo/producto/${product.id}`} className="text-primary-600 hover:text-primary-700">
                    Ver producto
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;