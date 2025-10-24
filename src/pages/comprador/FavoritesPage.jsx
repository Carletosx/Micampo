import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';

const FavoritesPage = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };
    
    addToCart(productToAdd);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaHeart className="text-red-500 mr-2" /> Mis Productos Favoritos
        </h1>
        {favorites.length > 0 && (
          <button 
            onClick={clearFavorites}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <FaTrash className="mr-1" /> Eliminar todos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FaHeart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No tienes productos favoritos</h2>
          <p className="text-gray-500 mb-6">Explora nuestro catálogo y añade productos a tus favoritos</p>
          <Link 
            to="/catalog" 
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                  }}
                />
                <button 
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors">{product.name}</h3>
                </Link>
                {product.category && (
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-gray-500 text-sm">S/</span>
                    <span className="text-lg font-bold text-gray-800">{product.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">/kg</span>
                  </div>
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;