import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { listProducts } from '../../api/products.js';
import { getTiendasPublic } from '../../api/users.js';
import { listReviews } from '../../api/reviews.js';
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
const ProductCard = ({ producto, rating }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);
  const [favoriteToast, setFavoriteToast] = useState(false);
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
  const stockBajo = (producto?.stockMin ?? 0) > 0 && (producto?.stock ?? 0) <= (producto?.stockMin ?? 0)
  
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
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {stockBajo && (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded border border-yellow-200">Stock Bajo</span>
        )}
      </div>
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
            <RatingStars rating={rating || 0} />
            <span className="text-xs text-gray-500 ml-1">({rating || 0})</span>
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
  const [precioRango, setPrecioRango] = useState([0, 1000]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: 30, totalPages: 1 });
  const [minStars, setMinStars] = useState(0)
  const [tiendas, setTiendas] = useState([])
  const [tiendaAuthId, setTiendaAuthId] = useState(null)
  const [ratingsMap, setRatingsMap] = useState({})

  const cargarPagina = async (page = 0) => {
    const { ok, data, page: pInfo } = await listProducts({ page, size: pageInfo.size });
    if (ok && Array.isArray(data)) {
      const activos = data.filter((p) => p.activo);
      setProductosFiltrados(activos);
      // cargar calificaciones promedio en segundo plano
      const ids = activos.map(p => p.id)
      const map = {}
      await Promise.all(ids.map(async (id) => {
        const r = await listReviews(id)
        if (r.ok && Array.isArray(r.data)) {
          const avg = r.data.length ? Math.round(r.data.reduce((s, it) => s + (it.calificacion || 0), 0) / r.data.length) : 0
          map[id] = avg
        } else map[id] = 0
      }))
      setRatingsMap(map)
      if (pInfo) setPageInfo(pInfo);
    }
  };
  useEffect(() => { cargarPagina(0); }, []);

  useEffect(() => {
    const loadTiendas = async () => {
      const r = await getTiendasPublic()
      if (r.ok && Array.isArray(r.data)) setTiendas(r.data)
    }
    loadTiendas()
  }, [])

  const visibles = productosFiltrados.filter((p) => {
    const price = Number(p.precio || 0)
    const okPrice = price >= precioRango[0] && price <= precioRango[1]
    const okCat = !categoriaActual || (p.categoria || '').toLowerCase() === categoriaActual.toLowerCase()
    const okStore = !tiendaAuthId || p.vendedorAuthId === tiendaAuthId
    const rating = ratingsMap[p.id] || 0
    const okRating = rating >= minStars
    return okPrice && okCat && okStore && okRating
  })
  
  // Categorías disponibles
  const categorias = (() => {
    const counts = {}
    productosFiltrados.forEach(p => { const c = p.categoria || 'Sin categoría'; counts[c] = (counts[c] || 0) + 1 })
    return Object.entries(counts).map(([nombre, cantidad]) => ({ id: nombre, nombre, cantidad }))
  })()

  // Clasificación por estrellas
  const clasificaciones = [5,4,3,2,1]

  // Etiquetas
  // Etiquetas eliminadas en fase piloto

  // Tiendas
  const tiendasConConteo = tiendas.map(t => {
    const count = productosFiltrados.filter(p => p.vendedorAuthId === t.authUsuarioId).length
    return { id: t.id, nombre: t.tiendaNombre || t.nombre || 'Tienda', cantidad: count, authUsuarioId: t.authUsuarioId }
  })

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
                  <li key={cat.id} className="flex justify-between items-center cursor-pointer" onClick={() => setCategoriaActual(cat.nombre)}>
                    <span className={`text-gray-700 ${categoriaActual===cat.nombre?'font-semibold':''}`}>{cat.nombre}</span>
                    <span className="text-gray-500 text-sm">({cat.cantidad})</span>
                  </li>
                ))}
                <li className="flex justify-between items-center cursor-pointer" onClick={() => setCategoriaActual('')}>
                  <span className="text-gray-700">Todas</span>
                </li>
              </ul>
            </div>

            {/* Rango de precios */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Gama de precios</h3>
              <div className="flex items-center gap-2 mb-2">
                <input type="number" min="0" className="w-24 border rounded px-2 py-1" value={precioRango[0]} onChange={(e)=> setPrecioRango([parseInt(e.target.value||'0'), precioRango[1]])} />
                <span className="text-gray-700">-</span>
                <input type="number" min="0" className="w-24 border rounded px-2 py-1" value={precioRango[1]} onChange={(e)=> setPrecioRango([precioRango[0], parseInt(e.target.value||'0')])} />
              </div>
            </div>

            {/* Disponibilidad removida en fase piloto */}

            {/* Clasificación */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 uppercase">Clasificación</h3>
              <ul className="space-y-2">
                {clasificaciones.map((est) => (
                  <li key={est} className="flex justify-between items-center cursor-pointer" onClick={()=> setMinStars(est)}>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < est ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}</span>
                      ))}
                    </div>
                    <span className={`text-xs ${minStars===est?'text-green-600':''}`}>mínimo</span>
                  </li>
                ))}
                <li className="text-gray-700 cursor-pointer" onClick={()=> setMinStars(0)}>Todas</li>
              </ul>
            </div>

            {/* Etiquetas eliminadas */}

            {/* Tiendas */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 uppercase">Tiendas</h3>
              <ul className="space-y-2">
                {tiendasConConteo.map((tienda) => (
                  <li key={tienda.authUsuarioId || tienda.id} className="flex justify-between items-center cursor-pointer" onClick={()=> setTiendaAuthId(tienda.authUsuarioId)}>
                    <span className={`text-gray-700 ${tiendaAuthId===tienda.authUsuarioId?'font-semibold':''}`}>{tienda.nombre}</span>
                    <span className="text-gray-500 text-sm">({tienda.cantidad})</span>
                  </li>
                ))}
                <li className="text-gray-700 cursor-pointer" onClick={()=> setTiendaAuthId(null)}>Todas</li>
              </ul>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full md:w-3/4">
            {/* Encabezado de resultados */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <p className="text-gray-600 mb-4 md:mb-0">Mostrando {visibles.length} resultados</p>
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
            {visibles.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">No hay productos disponibles con los filtros seleccionados</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibles.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} rating={ratingsMap[producto.id]} />
                ))}
              </div>
            )}

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
