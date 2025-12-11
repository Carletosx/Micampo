import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import useRoleRedirect from '../../hooks/useRoleRedirect';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  
  const { login } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { redirect } = useRoleRedirect();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passOk = password.trim().length >= 6;
    if (!emailOk || !passOk) {
      setErrors({ email: emailOk ? '' : 'Correo inválido', password: passOk ? '' : 'Mínimo 6 caracteres' });
      addNotification('Revisa los datos del formulario', 'error');
      return;
    }
    setErrors({ email: '', password: '' });
    setLoading(true);
    
    try {
      const res = await login(email, password);
      if (res?.success) {
        addNotification('¡Inicio de sesión exitoso!', 'success');
        try {
          const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
          const u = stored ? JSON.parse(stored) : null;
          redirect(u?.role);
        } catch {
          navigate('/');
        }
      } else {
        addNotification(res?.error || 'Error al iniciar sesión. Verifica tus credenciales.', 'error');
      }
    } catch (error) {
      addNotification('Error al iniciar sesión. Verifica tus credenciales.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <LoadingOverlay visible={loading} text={'Iniciando sesión...'} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95"
          whileHover={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Bienvenido a AgroMarket
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/auth/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
                Regístrate aquí
              </Link>
            </p>
          </motion.div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Input
                id="email-address"
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                error={errors.email}
              />
              <Input
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                error={errors.password}
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Recordarme
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700 transition">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </motion.div>
          </form>

          <motion.div
            className="mt-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h2.84c.58-.63 .94-1.5 .94-2.58v-.54h-3.78z" />
                <path d="M7.84 19.52c2.4 1.68 5.83 1.68 8.23 0l2.6-2.6-2.1-1.65c-1.63 1.2-3.95 1.2-5.58 0l-2.1 1.65-1.05 1.6z" />
              </svg>
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20v-7.21H5.413v-2.622h2.877V7.487c0-2.865 1.752-4.426 4.31-4.426 1.224 0 2.267.091 2.57.132v2.98h-1.762c-1.385 0-1.653.66-1.653 1.626v2.13h3.302l-4.296 2.622v7.21h-3.15z" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
