import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <LoadingOverlay visible={loading} text={activeTab === 'comprador' ? 'Registrando comprador...' : 'Registrando vendedor...'} />
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img src={logoOrganic} alt="Organic Logo" className="h-12" />
          </div>
          
          <h2 className="text-center text-2xl font-bold text-green-600 mb-2">
            ¡Crear Una Cuenta!
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Registra Tu Cuenta Gratis
          </p>
          
          {/* Tabs para seleccionar tipo de usuario */}
          <div className="flex mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-center ${activeTab === 'vendedor' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('vendedor')}
            >
              Vendedor
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center ${activeTab === 'comprador' ? 'bg-green-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('comprador')}
            >
              Comprador
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <Input id="nombre" name="nombre" label="Nombre" placeholder="Introduce Tu Nombre" value={formData.nombre} onChange={handleChange} disabled={loading} error={errors.nombre} className="mb-4" />
            
            <Input id="email" name="email" label="Correo electrónico" type="email" placeholder="Introduce Tu Correo Electrónico" value={formData.email} onChange={handleChange} disabled={loading} error={errors.email} className="mb-4" />
            
            <Input id="password" name="password" label="Contraseña" type="password" placeholder="Ingresa Su Contraseña" value={formData.password} onChange={handleChange} disabled={loading} error={errors.password} className="mb-6" />
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  Estoy de acuerdo con el&nbsp;
                  <a href="#" className="text-green-600 hover:underline">Términos y condiciones</a>.
                </label>
              </div>
            </div>
            
            <Button type="submit" loading={loading} className="w-full">{loading ? 'Registrando...' : 'CREAR UNA CUENTA COMO COMPRADOR'}</Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya Tienes Una Cuenta? <Link to="/auth/login" className="text-green-600 hover:underline">Acceso</Link>.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © Copyright 2023 ProOrganic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
