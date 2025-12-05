import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaHome, FaChevronRight, FaHeart, FaPlay } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

// Datos de ejemplo para el producto
const productData = {
  id: '1',
  name: 'Manzana Orgánica Fresca',
  sku: '374829',
  weight: '1kg',
  price: 50.00,
  salePrice: 30.00,
  description: 'Manzanas orgánicas cultivadas sin pesticidas ni químicos, con sabor dulce y textura crujiente. Ideales para consumo directo o preparaciones culinarias.',
  longDescription: 'Nuestras manzanas orgánicas son cultivadas siguiendo estrictos estándares de agricultura ecológica, sin el uso de pesticidas, herbicidas ni fertilizantes químicos. Cada manzana es cuidadosamente seleccionada para garantizar la mejor calidad, sabor y frescura.\n\nBeneficios:\n- Ricas en antioxidantes y fibra dietética\n- Cultivadas en suelos libres de químicos\n- Apoyan a pequeños agricultores locales\n- Certificación orgánica verificada\n- Sabor natural y auténtico\n\nEstas manzanas son perfectas para consumo directo, ensaladas de frutas, jugos naturales, o como ingrediente en diversas preparaciones culinarias. Su dulzura natural y textura crujiente las convierten en el snack perfecto para cualquier momento del día.',
  stock: 'Disponible',
  rating: 4.5,
  reviews: 28,
  nutritionalInfo: {
    calories: '52 kcal por 100g',
    protein: '0.3g',
    carbs: '14g',
    fiber: '2.4g',
    sugar: '10g',
    fat: '0.2g'
  },
  origin: 'Valle de Mala, Lima - Perú',
  certification: 'Certificado Orgánico USDA',
  season: 'Disponible todo el año',
  storageInfo: 'Conservar en refrigeración entre 2°C y 4°C para mantener su frescura por hasta 3 semanas',
  images: [
    '/src/assets/images/products/apple-organic-1.jpg',
    '/src/assets/images/products/apple-organic-2.jpg',
    '/src/assets/images/products/apple-organic-3.jpg'
  ],
  tags: ['Frutas', 'Orgánico', 'Producto Local', 'Sin Pesticidas']
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  // Función para decrementar la cantidad
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Función para incrementar la cantidad
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Función para añadir al carrito
  const handleAddToCart = () => {
    const productToAdd = {
      id: productData.id,
      name: productData.name,
      price: productData.salePrice || productData.price,
      image: productData.images[0],
      quantity: quantity
    };
    
    addToCart(productToAdd);
    
    // Mostrar notificación
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner con título */}
      <div className="bg-green-600 bg-opacity-80 py-12 relative">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/src/assets/images/products/fruits-bg.jpg')",
            opacity: 0.3
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold text-white text-center">DETALLES DEL PRODUCTO</h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center mt-2 text-white">
            <Link to="/" className="flex items-center">
              <FaHome className="mr-1" />
              Hogar
            </Link>
            <FaChevronRight className="mx-2" />
            <span>Detalles Del Producto</span>
          </div>
        </div>
      </div>
      
      {/* Toast de notificación */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-white text-green-600 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center transform transition-all duration-500 ease-in-out animate-bounce">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">¡Producto añadido!</p>
            <p className="text-xs text-gray-500">Se ha agregado al carrito correctamente</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Columna izquierda - Imágenes */}
            <div className="md:w-1/2 p-6">
              <div className="relative bg-gray-50 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Orgánico</span>
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Producto Local</span>
                <img 
                  src={productData.images[selectedImage]} 
                  alt={productData.name} 
                  className="w-full h-auto max-h-80 object-contain rounded-lg transition-all duration-300 transform hover:scale-105"
                />
              </div>
              
              {/* Miniaturas */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Vistas del producto:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {productData.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`border-2 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedImage === index ? 'border-green-500 shadow-md' : 'border-gray-200'}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <div className="relative p-2 bg-white rounded-lg">
                        <img 
                          src={image} 
                          alt={`${productData.name} - vista ${index + 1}`} 
                          className="w-full h-24 object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity rounded-lg"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Columna derecha - Información */}
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold text-gray-800">{productData.name}</h2>
              
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span>SKU: {productData.sku}</span>
                <span className="mx-2">•</span>
                <span>Peso: {productData.weight}</span>
              </div>
              
              {/* Estrellas de calificación */}
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < productData.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">({productData.reviews} Reseñas)</span>
              </div>
              
              {/* Precios */}
              <div className="mt-4 flex items-center">
                <span className="text-xl font-bold text-red-500">${productData.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-gray-500 line-through">${productData.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500">/kg</span>
              </div>
              
              {/* Descripción corta */}
              <p className="mt-4 text-gray-600">{productData.description}</p>
              
              {/* Etiquetas */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">Etiquetas:</span>
                <div className="flex flex-wrap mt-1">
                  {productData.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stock */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">En Stock:</span>
                <span className="ml-2 text-green-600">{productData.stock}</span>
              </div>
              
              {/* Cantidad */}
              <div className="mt-4">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center mt-1">
                  <button 
                    onClick={decrementQuantity}
                    className="bg-gray-200 px-3 py-1 rounded-l"
                  >
                    −
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly
                    className="w-12 text-center border-t border-b border-gray-200 py-1"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="bg-gray-200 px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  className="bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-green-700 transition-colors w-full sm:w-auto"
                  onClick={handleAddToCart}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  AÑADIR A LA CESTA
                </button>
                <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors w-full sm:w-auto">
                  <FaHeart className="mr-2" />
                  AÑADIR A LOS DESEOS
                </button>
              </div>
            </div>
          </div>
          
          {/* Pestañas */}
          <div className="border-t border-gray-200 mt-8">
            <div className="flex border-b">
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'descripcion' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('descripcion')}
              >
                DESCRIPCIONES
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'informacion' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('informacion')}
              >
                INFORMACIÓN ADICIONAL
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'resenas' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('resenas')}
              >
                RESEÑAS ({productData.reviews})
              </button>
            </div>
            
            {/* Contenido de las pestañas */}
            <div className="p-6">
              {activeTab === 'descripcion' && (
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/3 pr-6">
                    <p className="text-gray-600 mb-4">{productData.longDescription}</p>
                    <p className="text-gray-600">{productData.longDescription}</p>
                  </div>
                  <div className="md:w-1/3 mt-4 md:mt-0">
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src="/src/assets/images/products/grapes.jpg" 
                        alt="Producto en detalle" 
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white bg-opacity-75 rounded-full p-3">
                          <FaPlay className="text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'informacion' && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Información Adicional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-600 font-medium">Peso</td>
                            <td className="py-3 text-gray-600">{productData.weight}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-600 font-medium">Origen</td>
                            <td className="py-3 text-gray-600">{productData.origin}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-600 font-medium">Certificación</td>
                            <td className="py-3 text-gray-600">{productData.certification}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-600 font-medium">Temporada</td>
                            <td className="py-3 text-gray-600">{productData.season}</td>
                          </tr>
                          <tr>
                            <td className="py-3 text-gray-600 font-medium">Almacenamiento</td>
                            <td className="py-3 text-gray-600">{productData.storageInfo}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-md mb-3 text-green-700">Información Nutricional</h4>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600 font-medium">Calorías</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.calories}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600 font-medium">Proteínas</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.protein}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600 font-medium">Carbohidratos</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.carbs}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600 font-medium">Fibra</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.fiber}</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600 font-medium">Azúcares</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.sugar}</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-600 font-medium">Grasas</td>
                            <td className="py-2 text-gray-600">{productData.nutritionalInfo.fat}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'resenas' && (
                <div>
                  <h3 className="font-medium text-lg mb-3">Reseñas de Clientes</h3>
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center mb-3">
                      <img 
                        src="/src/assets/images/avatar.jpg" 
                        alt="Usuario" 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h4 className="font-medium">María García</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">Hace 2 días</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">Excelente producto, muy fresco y de gran calidad. Lo recomiendo totalmente.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-3">Añadir una reseña</h3>
                    <form>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tu calificación</label>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="review">Tu reseña</label>
                        <textarea 
                          id="review"
                          className="w-full border border-gray-300 rounded-md p-2 h-32"
                          placeholder="Escribe tu opinión sobre este producto..."
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="name">Nombre</label>
                          <input 
                            type="text" 
                            id="name"
                            className="w-full border border-gray-300 rounded-md p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                          <input 
                            type="email" 
                            id="email"
                            className="w-full border border-gray-300 rounded-md p-2"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        ENVIAR
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;