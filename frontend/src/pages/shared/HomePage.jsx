import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '../../api/products';
import ProductCard from '../../components/product/ProductCard';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';
import { motion } from 'framer-motion';
import heroBuyer from '../../assets/images/buyer/fondo-home-buyer.jpg';
import catAgricultura from '../../assets/images/categories/agricultura.jpg';
import catGanaderia from '../../assets/images/categories/ganaderia.jpg';
import catProductos from '../../assets/images/categories/productos-derivados.jpg';
import catServicios from '../../assets/images/categories/servicios.jpg';
import agricultor from '../../assets/images/buyer/agricultor.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const res = await listProducts({ size: 12, sort: 'createdAt,desc' });
        if (!mounted) return;
        const items = res?.data || res || [];
        console.log('📦 Featured products loaded:', items);
        setFeaturedProducts(items.slice(0, 12));
      } catch (e) {
        console.error('Error cargando productos destacados', e);
        // Fallback: mostrar productos vacíos para que se vea al menos la grilla
        setFeaturedProducts([]);
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    };
    loadFeatured();
    return () => { mounted = false; };
  }, []);

  const { addToCart } = useCart();

  const handleAdd = (product) => {
    const normalized = {
      id: product.id || product.productoId || product._id,
      name: product.nombre || product.name,
      price: product.precioUnitario ?? product.price ?? 0,
      unidad: product.unidad || product.unit || '',
      image: product.imagenUrl || product.image || '/src/assets/images/products/placeholder.jpg'
    };
    addToCart({ id: normalized.id, name: normalized.name, price: normalized.price, image: normalized.image });
    toast.success(`${normalized.name || 'Producto'} agregado al carrito`);
  };

  // Productos destacados (mock data)
  const mockProducts = [
    { id: 1, nombre: 'Tomate Orgánico Premium', precioUnitario: 8.50, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-1.jpg', organico: true, rating: 4.8, reviews: 24 },
    { id: 2, nombre: 'Lechuga Fresca', precioUnitario: 5.00, unidad: 'unidad', imagenUrl: '/src/assets/images/products/apple-organic-2.jpg', organico: true, rating: 4.9, reviews: 18 },
    { id: 3, nombre: 'Brócoli Verde', precioUnitario: 6.75, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-3.jpg', organico: true, rating: 4.7, reviews: 15 },
    { id: 4, nombre: 'Zanahoria Dulce', precioUnitario: 4.25, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-1.jpg', organico: false, rating: 4.6, reviews: 22 },
    { id: 5, nombre: 'Papa Andina', precioUnitario: 3.50, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-2.jpg', organico: false, rating: 4.5, reviews: 30 },
    { id: 6, nombre: 'Cebolla Blanca', precioUnitario: 4.00, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-3.jpg', organico: false, rating: 4.4, reviews: 12 },
    { id: 7, nombre: 'Espinaca Orgánica', precioUnitario: 7.50, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-1.jpg', organico: true, rating: 4.9, reviews: 20 },
    { id: 8, nombre: 'Choclo Fresco', precioUnitario: 5.75, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-2.jpg', organico: true, rating: 4.7, reviews: 16 },
    { id: 9, nombre: 'Pimiento Rojo', precioUnitario: 6.50, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-3.jpg', organico: true, rating: 4.8, reviews: 19 },
    { id: 10, nombre: 'Nabo Blanco', precioUnitario: 4.75, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-1.jpg', organico: false, rating: 4.5, reviews: 11 },
    { id: 11, nombre: 'Remolacha Roja', precioUnitario: 5.25, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-2.jpg', organico: true, rating: 4.7, reviews: 14 },
    { id: 12, nombre: 'Rabanito Picante', precioUnitario: 3.75, unidad: 'kg', imagenUrl: '/src/assets/images/products/apple-organic-3.jpg', organico: false, rating: 4.3, reviews: 9 }
  ];

  // Categorías (imágenes desde assets)
  const categories = [
    { id: 1, name: 'Agricultura', image: catAgricultura },
    { id: 2, name: 'Ganadería', image: catGanaderia },
    { id: 3, name: 'Productos y Derivados', image: catProductos },
    { id: 4, name: 'Insumos y Servicios Agropecuarios', image: catServicios }
  ];

  // Estadísticas
  const stats = {
    products: 3753,
    farms: 23,
    categories: 51,
    clients: 54
  };

  // Renderizar estrellas según calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  const heroText = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: 0.15 * i, duration: 0.6 } })
  };

  const productsContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };

  const productItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
  };

  const categoryVariants = {
    hover: { scale: 1.03, y: -6, boxShadow: '0 10px 20px rgba(0,0,0,0.08)' },
    tap: { scale: 0.99 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="text-white py-16 relative" style={{ backgroundImage: `url(${heroBuyer})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        {/* imagen decorativa removida según solicitud */}
        <div className="container relative z-20 mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={heroText} className="text-4xl font-bold mb-4">Compra Fácil, Segura Y Con Total Transparencia.</motion.h1>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={heroText} className="text-lg mb-8">"Conecta directamente con los agricultores y recibe productos frescos del campo a tu mesa"</motion.p>
            <div className="flex flex-wrap gap-4">
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ scale: 1.02 }} className="inline-block">
                <Link to="/catalog" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  COMPRA AHORA
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block">
                <button className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium flex items-center backdrop-blur-sm hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +51 982 303 0123
                </button>
              </motion.div>
            </div>
          </div>
          {/* Right column image removed to avoid PNG overlay above buttons */}
          <div className="md:w-1/2">
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <motion.div key={category.id} className="relative overflow-hidden rounded-lg shadow-md" whileHover="hover" whileTap="tap" variants={categoryVariants}>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-32 object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-center px-2">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Artículos Destacados</h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" animate="visible" variants={productsContainer}>
            {mockProducts.map((p) => (
              <motion.div key={p.id} variants={productItem}>
                <ProductCard product={p} onAdd={handleAdd} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-700 to-green-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold mb-4 text-center md:text-left text-white">OFERTA DE 40% DE DESCUENTO EN TODOS NUESTROS ARTÍCULOS.</motion.h2>
              <p className="text-green-50 mb-6 text-center md:text-left">Por compras realizadas en la plataforma Organic Digital Market, ahora mismo. No te pierdas descuentos de esta magnitud en productos de calidad.</p>
              <div className="flex justify-center md:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.products}</p>
                  <p className="text-sm text-green-50">PRODUCTOS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.farms}</p>
                  <p className="text-sm text-green-50">GRANJAS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.categories}</p>
                  <p className="text-sm text-green-50">CATEGORÍAS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{stats.clients}</p>
                  <p className="text-sm text-green-50">CLIENTES</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <Link to="/catalog" className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg hover:shadow-xl transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  COMPRA AHORA
                </Link>
              </div>
            </div>
            <div className="md:w-1/3">
                <motion.img 
                  src={agricultor}
                  alt="Agricultor cosechando" 
                  className="w-full h-auto object-contain"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                />
              </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Entrega Gratuita</h3>
              <p className="text-gray-600 text-sm">En todos los pedidos superiores a S/ 50.00</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Pago Seguro</h3>
              <p className="text-gray-600 text-sm">100% transacciones seguras</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">30 Días De Devolución De Dinero</h3>
              <p className="text-gray-600 text-sm">Para productos no satisfactorios</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Atención Al Cliente 24/7</h3>
              <p className="text-gray-600 text-sm">Soporte dedicado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;