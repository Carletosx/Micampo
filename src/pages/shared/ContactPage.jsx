import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaArrowRight } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de envío de formulario
    setTimeout(() => {
      setFormStatus('success');
      setIsSubmitting(false);
      // Resetear el formulario después de 3 segundos
      setTimeout(() => {
        setFormStatus(null);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-12 mb-16 shadow-2xl fade-in">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 opacity-20">
            <FaEnvelope className="text-white text-6xl" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-20">
            <FaPhone className="text-white text-6xl" />
          </div>
          <div className="absolute top-1/2 right-20 opacity-10">
            <FaMapMarkerAlt className="text-white text-8xl" />
          </div>
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contáctanos</h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a conectar con agricultores locales
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Formulario de Contacto */}
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 fade-in">
          <h2 className="text-2xl font-semibold mb-6 relative inline-block">
            Envíanos un mensaje
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
          </h2>
          
          {formStatus === 'success' ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md animate-pulse">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-800">¡Mensaje enviado!</h3>
                  <p className="text-green-700">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-primary-500 outline-none transition-colors bg-gray-50 rounded-t-md group-hover:bg-gray-100"
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-primary-500 outline-none transition-colors bg-gray-50 rounded-t-md group-hover:bg-gray-100"
                    placeholder="Correo electrónico"
                  />
                </div>
              </div>
              <div className="group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-primary-500 outline-none transition-colors bg-gray-50 rounded-t-md group-hover:bg-gray-100"
                  placeholder="Asunto"
                />
              </div>
              <div className="group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-primary-500 outline-none transition-colors bg-gray-50 rounded-t-md group-hover:bg-gray-100"
                  placeholder="Tu mensaje"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Enviar mensaje
                    <FaArrowRight className="ml-2" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
        
        {/* Información de Contacto */}
        <div className="space-y-8 fade-in">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-6 relative inline-block">
              Información de contacto
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Dirección</h3>
                  <p className="text-gray-600">Av. Arequipa 265, Lima, Perú</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">contacto@agromarket.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <FaPhone className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Teléfono</h3>
                  <p className="text-gray-600">+51 982 303 0123</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <FaWhatsapp className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600">+51 982 303 0123</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-gray-900 mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="bg-gradient-to-br from-purple-600 to-pink-500 text-white p-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-semibold mb-6 relative inline-block">
              Horario de atención
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Lunes - Viernes</span>
                <span className="font-medium">8:00 AM - 6:00 PM</span>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sábados</span>
                <span className="font-medium">9:00 AM - 2:00 PM</span>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Domingos</span>
                <span className="font-medium text-red-500">Cerrado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <div className="mb-16 fade-in">
        <h2 className="text-2xl font-semibold mb-6 relative inline-block">
          Encuéntranos
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
        </h2>
        
        <div className="bg-white rounded-xl shadow-lg p-2 hover:shadow-xl transition-all duration-300">
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center p-8">
                <FaMapMarkerAlt className="text-primary-500 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">Mapa de ubicación</h3>
                <p className="text-gray-600">Aquí se mostraría un mapa interactivo con nuestra ubicación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="mb-16 fade-in">
        <h2 className="text-2xl font-semibold mb-6 relative inline-block">
          Preguntas frecuentes
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-400"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">¿Cómo puedo registrarme como agricultor?</h3>
            <p className="text-gray-600">Para registrarte como agricultor, debes crear una cuenta en nuestra plataforma seleccionando la opción "Vendedor" y completar el formulario con tus datos.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">¿Cuánto tiempo tarda la entrega?</h3>
            <p className="text-gray-600">Los tiempos de entrega varían según tu ubicación, pero generalmente realizamos entregas en 24-48 horas después de confirmar tu pedido.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">¿Cómo garantizan la calidad de los productos?</h3>
            <p className="text-gray-600">Trabajamos directamente con agricultores certificados y realizamos controles de calidad en todos los productos antes de su distribución.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">¿Puedo cancelar mi pedido?</h3>
            <p className="text-gray-600">Puedes cancelar tu pedido dentro de las primeras 2 horas después de realizarlo. Para hacerlo, contacta con nuestro servicio de atención al cliente.</p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-10 text-center shadow-2xl transform transition-all duration-300 hover:scale-[1.01] fade-in">
        <h2 className="text-3xl font-semibold mb-6 text-white drop-shadow-md">¿Listo para unirte a nuestra comunidad?</h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
          Forma parte de AgroMarket y disfruta de productos frescos directamente de los agricultores locales.
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
      
      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;