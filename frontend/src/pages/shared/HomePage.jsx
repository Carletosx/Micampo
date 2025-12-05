import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Productos destacados (datos de ejemplo)
  const featuredProducts = [
    {
      id: 1,
      name: 'Manzana Orgánica Fresca',
      price: 5.90,
      unit: 'kg',
      image: '/src/assets/images/products/apple.jpg',
      rating: 4.5,
      reviews: 12,
      organic: true
    },
    {
      id: 2,
      name: 'Fresa Orgánica Fresca',
      price: 9.90,
      unit: 'kg',
      image: '/src/assets/images/products/strawberry.jpg',
      rating: 4.8,
      reviews: 24,
      organic: true
    },
    {
      id: 3,
      name: 'Brócoli Orgánico Fresco',
      price: 3.50,
      unit: 'kg',
      image: '/src/assets/images/products/broccoli.jpg',
      rating: 4.2,
      reviews: 18,
      organic: true
    },
    {
      id: 4,
      name: 'Tomate Orgánico Fresco',
      price: 4.90,
      unit: 'kg',
      image: '/src/assets/images/products/tomato.jpg',
      rating: 4.6,
      reviews: 32,
      organic: true
    },
    {
      id: 5,
      name: 'Mora Orgánica Fresca',
      price: 12.90,
      unit: 'kg',
      image: '/src/assets/images/products/blackberry.jpg',
      rating: 4.7,
      reviews: 15,
      organic: true
    },
    {
      id: 6,
      name: 'Sandía Orgánica Fresca',
      price: 8.90,
      unit: 'kg',
      image: '/src/assets/images/products/watermelon.jpg',
      rating: 4.4,
      reviews: 28,
      organic: true
    }
  ];

  // Categorías
  const categories = [
    { id: 1, name: 'Agricultura', image: '/src/assets/images/categories/agriculture.jpg' },
    { id: 2, name: 'Ganadería', image: '/src/assets/images/categories/livestock.jpg' },
    { id: 3, name: 'Productos y Derivados', image: '/src/assets/images/categories/products.jpg' },
    { id: 4, name: 'Insumos y Servicios Agropecuarios', image: '/src/assets/images/categories/services.jpg' }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-4">Compra Fácil, Segura Y Con Total Transparencia.</h1>
            <p className="text-lg mb-8">"Conecta directamente con los agricultores y recibe productos frescos del campo a tu mesa"</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                COMPRA AHORA
              </Link>
              <button className="border border-white text-white px-6 py-3 rounded-md font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +51 982 303 0123
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/src/assets/images/hero-basket.svg" 
              alt="Canasta de productos frescos" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <div key={category.id} className="relative overflow-hidden rounded-lg shadow-md group">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-center px-2">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Artículos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  {product.organic && (
                    <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">ORGÁNICO</span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-sm">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.reviews} reseñas)</span>
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-primary-600 font-bold">S/ {product.price.toFixed(2)} <span className="text-gray-500 text-sm font-normal">/ {product.unit}</span></p>
                    <button className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="py-12 bg-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4 text-center md:text-left">OFERTA DE 40% DE DESCUENTO EN TODOS NUESTROS ARTÍCULOS.</h2>
              <p className="text-gray-700 mb-6 text-center md:text-left">Por compras realizadas en la plataforma Organic Digital Market, ahora mismo. No te pierdas descuentos de esta magnitud en productos de calidad.</p>
              <div className="flex justify-center md:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stats.products}</p>
                  <p className="text-sm text-gray-600">PRODUCTOS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stats.farms}</p>
                  <p className="text-sm text-gray-600">GRANJAS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stats.categories}</p>
                  <p className="text-sm text-gray-600">CATEGORÍAS</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{stats.clients}</p>
                  <p className="text-sm text-gray-600">CLIENTES</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <Link to="/catalog" className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  COMPRA AHORA
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 relative">
                <div className="absolute -top-10 -right-10 bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
                  40%
                </div>
                <img 
                  src="/src/assets/images/discount-basket.svg" 
                  alt="Oferta especial" 
                  className="rounded-lg w-full h-auto"
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