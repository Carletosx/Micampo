import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import useRoleRedirect from '../../hooks/useRoleRedirect';

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
          const stored = localStorage.getItem('user');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoadingOverlay visible={loading} text={'Iniciando sesión...'} />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión en AgroMarket
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/auth/register" className="font-medium text-green-600 hover:text-green-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input id="email-address" name="email" label="Correo electrónico" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} error={errors.email} />
            <Input id="password" name="password" label="Contraseña" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} error={errors.password} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
