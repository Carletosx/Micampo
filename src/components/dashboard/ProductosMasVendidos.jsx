import React from 'react';

const ProductoCard = ({ producto }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
    <img
      src={producto.imagen}
      alt={producto.nombre}
      className="w-16 h-16 rounded-md object-cover"
    />
    <div className="flex-1">
      <p className="font-semibold text-gray-800">{producto.nombre}</p>
      <p className="text-xs text-gray-500">{producto.ventas} ventas este mes</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">Total</p>
      <p className="font-semibold text-gray-800">{producto.total}</p>
    </div>
  </div>
);

const ProductosMasVendidos = () => {
  const productos = [
    {
      nombre: 'Papa Blanca Premium',
      ventas: 45,
      total: 'S/ 1,230',
      imagen: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=160&q=80'
    },
    {
      nombre: 'Tomates Cherry Orgánicos',
      ventas: 36,
      total: 'S/ 980',
      imagen: 'https://images.unsplash.com/photo-1570275752599-385e0b72abdf?auto=format&fit=crop&w=160&q=80'
    },
    {
      nombre: 'Lechuga Orgánica',
      ventas: 28,
      total: 'S/ 620',
      imagen: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=160&q=80'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Más Vendidos</h3>
      <div className="space-y-3">
        {productos.map((prod, idx) => (
          <ProductoCard key={idx} producto={prod} />
        ))}
      </div>
    </div>
  );
};

export default ProductosMasVendidos;