import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { listProducts } from '../../api/products.js';
import { API_ORIGIN } from '../../api/config.js';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';

// Componente para mostrar estrellas de calificación
const RatingStars = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
        </span>
      ))}
    </div>
  );
};

// Componente para tarjeta de producto
const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);
  const [favoriteToast, setFavoriteToast] = useState(false);
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Crear objeto de producto para el carrito
    const productToAdd = {
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagenUrl || PLACEHOLDER_IMG,
      quantity: 1
    };
    
    // Añadir al carrito
    addToCart(productToAdd);
    
    // Mostrar notificación mejorada
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Crear objeto de producto para favoritos
    const productToFavorite = {
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      image: producto.imagenUrl || PLACEHOLDER_IMG,
      category: producto.categoria
    };
    
    // Añadir/quitar de favoritos
    const isAdded = toggleFavorite(productToFavorite);
    setIsAddedToFavorites(isAdded);
    
    // Mostrar notificación
    setFavoriteToast(true);
    setTimeout(() => setFavoriteToast(false), 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {producto.descuento && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {producto.descuento} Descuento
        </div>
      )}
      {showToast && (
        <div className="fixed top-20 right-4 bg-white text-green-600 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center transform transition-all duration-500 ease-in-out animate-bounce">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <FaCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">¡Producto añadido!</p>
            <p className="text-xs text-gray-500">{producto.nombre} se ha agregado al carrito</p>
          </div>
        </div>
      )}
      <Link to={`/product/${producto.id}`} className="block">
        <div className="relative">
          <img 
            src={(producto.imagenUrl && producto.imagenUrl.startsWith('/uploads/')) ? `${API_ORIGIN}${producto.imagenUrl}` : (producto.imagenUrl || PLACEHOLDER_IMG)} 
            alt={producto.nombre} 
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMG;
            }}
          />
          <button 
            className="absolute top-2 left-2 hover:scale-110 transition-transform" 
            onClick={handleToggleFavorite}
          >
            {isFavorite(producto.id) ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-500 hover:text-red-500" />
            )}
          </button>
        </div>
        <div className="p-4">
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded inline-block mb-2">
            Nuevo
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
          <p className="text-sm text-gray-600">{producto.categoria}</p>
          <div className="flex items-center mt-1">
            <RatingStars rating={producto.calificacion} />
            <span className="text-xs text-gray-500 ml-1">({producto.calificacion})</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div>
              <span className="text-gray-500 text-sm">S/</span>
              <span className="text-lg font-bold text-gray-800">{Number(producto.precio).toFixed(2)}</span>
              <span className="text-gray-500 text-sm">/kg</span>
            </div>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </Link>
      
      {favoriteToast && (
        <div className="fixed top-20 right-4 bg-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center transform transition-all duration-500 ease-in-out animate-bounce">
          <div className={`${isAddedToFavorites ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} p-2 rounded-full mr-3`}>
            {isAddedToFavorites ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-medium">{isAddedToFavorites ? '¡Añadido a favoritos!' : 'Eliminado de favoritos'}</p>
            <p className="text-xs text-gray-500">{producto.nombre}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CatalogPage = () => {
  const [categoriaActual, setCategoriaActual] = useState('');
  const [subcategoriaActual, setSubcategoriaActual] = useState('');
  const [precioRango, setPrecioRango] = useState([0, 50]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: 30, totalPages: 1 });

  const cargarPagina = async (page = 0) => {
    const { ok, data, page: pInfo } = await listProducts({ page, size: pageInfo.size, maxPrecio: precioRango[1] });
    if (ok && Array.isArray(data)) {
      const activos = data.filter((p) => p.activo);
      setProductosFiltrados(activos);
      if (pInfo) setPageInfo(pInfo);
    }
  };
  useEffect(() => { cargarPagina(0); }, [precioRango]);
  
  // Categorías disponibles
  const categorias = [
    { id: 'plantas-medicinales', nombre: 'Plantas Aromáticas Y Medicinales', cantidad: 19 },
    { id: 'hortalizas', nombre: 'Hortalizas y Verduras', cantidad: 24 },
    { id: 'cereales', nombre: 'Cereales Y Granos', cantidad: 15 },
    { id: 'frutas', nombre: 'Frutas', cantidad: 19 },
    { id: 'legumbres', nombre: 'Legumbres', cantidad: 22 },
    { id: 'semillas', nombre: 'Semillas Y Plantines', cantidad: 24 }
  ];

  // Clasificación por estrellas
  const clasificaciones = [
    { estrellas: 5, cantidad: 50 },
    { estrellas: 4, cantidad: 25 },
    { estrellas: 3, cantidad: 15 },
    { estrellas: 2, cantidad: 10 },
    { estrellas: 1, cantidad: 5 }
  ];

  // Etiquetas
  const etiquetas = [
    { id: 'nuevos', nombre: 'Nuevos Artículos', cantidad: 11 },
    { id: 'oferta', nombre: 'Artículos En Oferta', cantidad: 10 },
    { id: 'destacados', nombre: 'Elementos Destacados', cantidad: 19 },
    { id: 'tendencias', nombre: 'Tendencias', cantidad: 20 },
    { id: 'descuento', nombre: 'Artículos Con Descuento', cantidad: 31 }
  ];

  // Tiendas
  const tiendas = [
    { id: 'lindele', nombre: 'Lindele', cantidad: 10 },
    { id: 'turkee', nombre: 'Turkee', cantidad: 15 },
    { id: 'foodbox', nombre: 'Foodbox', cantidad: 19 },
    { id: 'recettas', nombre: 'Recettas', cantidad: 20 },
    { id: 'fabindia', nombre: 'Fabindia', cantidad: 25 }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner de sección */}
      <div 
        className="bg-cover bg-center py-16 relative"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="container mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-2">SECCIÓN DE AGRICULTURA</h1>
          <div className="flex justify-center items-center">
            <Link to="/" className="text-white hover:text-green-300">Hogar</Link>
            <span className="mx-2">&gt;</span>
            <span>Sección De Agricultura</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar con filtros */}
          <div className="w-full md:w-1/4">
            {/* Categoría */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Categoría</h3>
              <ul className="space-y-2">
                {categorias.map((cat) => (
                  <li key={cat.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{cat.nombre}</span>
                    <span className="text-gray-500 text-sm">({cat.cantidad})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rango de precios */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Gama de precios</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">S/0 - S/50</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={precioRango[1]} 
                onChange={(e) => setPrecioRango([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Clasificación */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Clasificación</h3>
              <ul className="space-y-2">
                {clasificaciones.map((clas) => (
                  <li key={clas.estrellas} className="flex justify-between items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < clas.estrellas ? 
                            <FaStar className="text-yellow-400" /> : 
                            <FaRegStar className="text-gray-300" />
                          }
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">({clas.cantidad})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Etiquetas */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Etiquetas</h3>
              <ul className="space-y-2">
                {etiquetas.map((etiqueta) => (
                  <li key={etiqueta.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{etiqueta.nombre}</span>
                    <span className="text-gray-500 text-sm">({etiqueta.cantidad})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tiendas */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 uppercase">Tiendas</h3>
              <ul className="space-y-2">
                {tiendas.map((tienda) => (
                  <li key={tienda.id} className="flex justify-between items-center">
                    <span className="text-gray-700">{tienda.nombre}</span>
                    <span className="text-gray-500 text-sm">({tienda.cantidad})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full md:w-3/4">
            {/* Encabezado de resultados */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <p className="text-gray-600 mb-4 md:mb-0">Mostrando 1-12 De 120 Resultados</p>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">Ordenar Por Característica</span>
                <select className="border rounded-md p-2 bg-white">
                  <option>Más reciente</option>
                  <option>Precio: bajo a alto</option>
                  <option>Precio: alto a bajo</option>
                  <option>Popularidad</option>
                </select>
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-10">
              <div className="text-sm text-gray-600">Página {pageInfo.number + 1} de {pageInfo.totalPages}</div>
              <div className="inline-flex gap-2">
                <button disabled={pageInfo.number === 0} onClick={() => cargarPagina(pageInfo.number - 1)} className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50">Anterior</button>
                <button disabled={pageInfo.number + 1 >= pageInfo.totalPages} onClick={() => cargarPagina(pageInfo.number + 1)} className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
