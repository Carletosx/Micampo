import React, { useEffect } from 'react';
import { FaLeaf, FaHandshake, FaUsers, FaSeedling, FaArrowDown, FaMountain, FaSun, FaWater } from 'react-icons/fa';

const AboutPage = () => {
  useEffect(() => {
    // Efecto de aparición gradual para elementos con la clase 'fade-in'
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section con gradiente y elementos decorativos */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-12 mb-16 shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 opacity-20">
            <FaLeaf className="text-white text-6xl" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <FaSeedling className="text-white text-6xl" />
          </div>
          <div className="absolute top-1/2 right-20 opacity-10">
            <FaMountain className="text-white text-8xl" />
          </div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-center text-white mb-6 drop-shadow-lg">
            Sobre AgroMarket
          </h1>
          <p className="text-2xl text-center text-white max-w-3xl mx-auto leading-relaxed drop-shadow">
            Conectamos agricultores locales con consumidores conscientes para crear un sistema alimentario más justo, sostenible y saludable.
          </p>
          
          <div className="flex justify-center mt-10">
            <FaArrowDown className="text-white text-3xl animate-bounce" />
          </div>
        </div>
      </div>

      {/* Nuestra Misión */}
      <div className="mb-16 fade-in">
        <h2 className="text-3xl font-semibold text-center mb-8 relative">
          <span className="inline-block relative">
            Nuestra Misión
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
          </span>
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-l-4 border-primary-500">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            En AgroMarket, nuestra misión es transformar la forma en que los alimentos llegan a tu mesa. Creemos en un sistema alimentario donde:
          </p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Los agricultores reciben una compensación justa por su trabajo</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Los consumidores tienen acceso a alimentos frescos, locales y de temporada</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Las prácticas agrícolas sostenibles son la norma, no la excepción</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span>Las comunidades locales prosperan a través de conexiones directas entre productores y consumidores</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Nuestros Valores */}
      <div className="mb-16 fade-in">
        <h2 className="text-3xl font-semibold text-center mb-10 relative">
          <span className="inline-block relative">
            Nuestros Valores
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-6 text-center">
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <FaLeaf className="text-5xl text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Sostenibilidad</h3>
              <p className="text-gray-700">
                Promovemos prácticas agrícolas que respetan y regeneran nuestro planeta.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-secondary-400 to-secondary-600 p-6 text-center">
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <FaHandshake className="text-5xl text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-secondary-700">Comercio Justo</h3>
              <p className="text-gray-700">
                Garantizamos precios justos para agricultores y valor para consumidores.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-center">
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-5xl text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Comunidad</h3>
              <p className="text-gray-700">
                Fortalecemos las economías locales y creamos conexiones significativas.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 text-center">
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <FaSeedling className="text-5xl text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-700">Calidad</h3>
              <p className="text-gray-700">
                Ofrecemos productos frescos, nutritivos y cultivados con cuidado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestra Historia */}
      <div className="mb-16 fade-in">
        <h2 className="text-3xl font-semibold text-center mb-8 relative">
          <span className="inline-block relative">
            Nuestra Historia
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
          </span>
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-10 -mr-10 bg-primary-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 -mb-20 -ml-20 bg-secondary-100 rounded-full opacity-20"></div>
          <div className="relative z-10">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              AgroMarket nació en 2023 cuando un grupo de estudiantes de CERTUS identificó la necesidad de crear un puente entre pequeños agricultores y consumidores urbanos. Lo que comenzó como un proyecto académico se ha convertido en una plataforma en crecimiento que:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg border-l-4 border-primary-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl font-bold text-primary-700 mr-2">100+</span>
                  <span className="text-primary-700">Agricultores locales</span>
                </div>
                <p className="text-gray-700">Conectamos a más de 100 agricultores locales con miles de consumidores</p>
              </div>
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-lg border-l-4 border-secondary-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl font-bold text-secondary-700 mr-2">500+</span>
                  <span className="text-secondary-700">Productos frescos</span>
                </div>
                <p className="text-gray-700">Ofrecemos más de 500 productos frescos y de temporada</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl font-bold text-blue-700 mr-2">-30%</span>
                  <span className="text-blue-700">Huella de carbono</span>
                </div>
                <p className="text-gray-700">Reducimos la huella de carbono al acortar las cadenas de suministro</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl font-bold text-green-700 mr-2">100%</span>
                  <span className="text-green-700">Economía local</span>
                </div>
                <p className="text-gray-700">Apoyamos la economía local y las prácticas agrícolas sostenibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Únete a Nosotros */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-10 text-center shadow-2xl transform transition-all duration-300 hover:scale-[1.01] fade-in">
        <h2 className="text-3xl font-semibold mb-6 text-white drop-shadow-md">Únete a Nuestra Comunidad</h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Ya sea que seas un agricultor buscando llegar a más clientes o un consumidor en busca de alimentos frescos y locales, hay un lugar para ti en AgroMarket.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-white text-primary-700 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
            Registrarse como Agricultor
          </button>
          <button className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
            Comprar Productos Locales
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;