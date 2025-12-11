import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import logoOrganic from '../../assets/images/organic-logo.svg';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    tipoUsuario: 'comprador' // Por defecto, comprador
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('comprador');
  const [errors, setErrors] = useState({ nombre: '', email: '', password: '' });
  
  const { register } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData(prev => ({
      ...prev,
      tipoUsuario: tab
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nombreOk = formData.nombre.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const passOk = formData.password.trim().length >= 6;
    if (!nombreOk || !emailOk || !passOk) {
      setErrors({
        nombre: nombreOk ? '' : 'Nombre muy corto',
        email: emailOk ? '' : 'Correo inválido',
        password: passOk ? '' : 'Mínimo 6 caracteres'
      });
      addNotification('Revisa los datos del formulario', 'error');
      return;
    }
    setErrors({ nombre: '', email: '', password: '' });
    setLoading(true);
    
    try {
      const res = await register(formData);
      if (res?.success) {
        addNotification('¡Registro exitoso! Ya puedes iniciar sesión', 'success');
        navigate('/auth/login');
      } else {
        addNotification(res?.error || 'Error al registrar usuario', 'error');
      }
    } catch (error) {
      addNotification('Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <LoadingOverlay visible={loading} text={activeTab === 'comprador' ? 'Registrando comprador...' : 'Registrando vendedor...'} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full relative z-10"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg bg-opacity-95"
          whileHover={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
        >
          <motion.div
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            >
              <img src={logoOrganic} alt="Organic Logo" className="h-12 drop-shadow-lg" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                ¡Crear Una Cuenta!
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6">
                Únete a nuestra comunidad agrícola
              </p>
            </motion.div>
            
            {/* Tabs para seleccionar tipo de usuario */}
            <motion.div
              className="flex mb-6 bg-gray-100 rounded-lg p-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={() => handleTabChange('vendedor')}
                className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition ${
                  activeTab === 'vendedor'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🌱 Agricultor
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleTabChange('comprador')}
                className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition ${
                  activeTab === 'comprador'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🛒 Comprador
              </motion.button>
            </motion.div>
            
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
              >
                <Input
                  id="nombre"
                  name="nombre"
                  label="Nombre completo"
                  placeholder="Introduce tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  error={errors.nombre}
                  className="mb-4"
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Input
                  id="email"
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  error={errors.email}
                  className="mb-4"
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.4 }}
              >
                <Input
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña segura (min. 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  error={errors.password}
                  className="mb-6"
                />
              </motion.div>
              
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                    Estoy de acuerdo con los{' '}
                    <a href="#" className="text-emerald-600 hover:underline font-medium">
                      Términos y condiciones
                    </a>
                    .
                  </label>
                </div>
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Registrando...' : `Crear Cuenta Como ${activeTab === 'comprador' ? 'Comprador' : 'Agricultor'}`}
              </motion.button>
            </motion.form>
            
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Inicia sesión
                </Link>
              </p>
            </motion.div>
            
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <p className="text-xs text-gray-500">
                © 2024 AgroMarket. Todos los derechos reservados.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
