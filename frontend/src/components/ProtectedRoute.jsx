import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Si el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir a la página principal
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Si el usuario está autenticado y tiene el rol requerido (o no se requiere rol), mostrar el contenido
  return children;
};

export default ProtectedRoute;