import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAdd }) => {
  const name = product.nombre || product.name || 'Producto';
  const price = product.precioUnitario ?? product.price ?? 0;
  const unit = product.unidad || product.unit || '';
  const image = product.imagenUrl || product.image || '/src/assets/images/products/placeholder.jpg';
  const rating = product.rating ?? 4.5;
  const reviews = product.reviews ?? 0;
  const organic = product.organico || product.organic || false;

  const imgRef = useRef(null);

  const handleAddClick = () => {
    // dispatch a global event to animate image to cart
    try {
      const rect = imgRef.current?.getBoundingClientRect();
      window.dispatchEvent(new CustomEvent('fly-to-cart', { detail: { src: image, rect } }));
    } catch (e) {
      // ignore
    }
    if (onAdd) onAdd(product);
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative">
        {organic && <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">ORGÁNICO</span>}
        <img ref={imgRef} src={image} alt={name} className="w-full h-44 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="text-primary-600 font-bold">S/ {Number(price).toFixed(2)} <span className="text-gray-500 text-sm font-normal">/ {unit}</span></div>
          <div className="text-sm text-gray-500">{rating.toFixed(1)} ★ <span className="ml-1 text-xs">({reviews})</span></div>
        </div>
          <div className="flex items-center justify-between">
          <Link to={`/product/${product.id || product.productoId || product._id || ''}`} className="text-sm text-gray-700 hover:text-primary-600">Ver detalles</Link>
          <button onClick={handleAddClick} className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700 transition-colors">Agregar</button>
        </div>
      </div>
    </motion.div>
  );
  
};

export default ProductCard;
