import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/shared/HomePage';
import AboutPage from './pages/shared/AboutPage';
import ContactPage from './pages/shared/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CatalogPage from './pages/comprador/CatalogPage';
import ProductDetailPage from './pages/comprador/ProductDetailPage';
import CartPage from './pages/comprador/CartPage';
import FavoritesPage from './pages/comprador/FavoritesPage';
import DashboardPage from './pages/comprador/DashboardPage';
import PagoEnLinea from './pages/comprador/PagoEnLinea';
import ConfirmacionPedido from './pages/comprador/ConfirmacionPedido';
import DashboardAgricultor from './pages/agricultor/DashboardAgricultor';
import GestionInventario from './pages/agricultor/GestionInventario';
import MisProductos from './pages/agricultor/MisProductos';
import GestionPedidos from './pages/agricultor/GestionPedidos';
import PerfilConfiguracion from './pages/agricultor/PerfilConfiguracion';
import ReportesEstadisticas from './pages/agricultor/ReportesEstadisticas';

// Context Providers
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppBody = () => {
  const location = useLocation();
  const isAgricultorRoute = location.pathname.startsWith('/agricultor');

  return (
    <>
      {/* Context Providers */}
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="flex flex-col min-h-screen">
                {!isAgricultorRoute && <Navbar />}
                <main className="flex-grow">
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Rutas de autenticación */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />

                    {/* Comprador */}
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<PagoEnLinea />} />
                    <Route path="/comprador/confirmacion-pedido" element={<ConfirmacionPedido />} />

                    {/* Dashboard comprador protegido */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Agricultor - rutas públicas */}
                    <Route path="/agricultor/dashboard" element={<DashboardAgricultor />} />
                    <Route path="/agricultor/inventario" element={<GestionInventario />} />
                    <Route path="/agricultor/productos" element={<MisProductos />} />
                    <Route path="/agricultor/pedidos" element={<GestionPedidos />} />
                    <Route path="/agricultor/reportes" element={<ReportesEstadisticas />} />
                    <Route path="/agricultor/perfil" element={<PerfilConfiguracion />} />
                  </Routes>
                </main>
                {!isAgricultorRoute && <Footer />}
              </div>
            </FavoritesProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppBody />
    </Router>
  );
}

export default App;