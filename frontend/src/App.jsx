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
import PerfilComprador from './pages/comprador/PerfilComprador';
import Ordenes from './pages/comprador/Ordenes';
import Direcciones from './pages/comprador/Direcciones';
import MetodosPago from './pages/comprador/MetodosPago';
import CuentaLayout from './pages/comprador/CuentaLayout';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import ROUTES from './routes/paths';

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
                  <ErrorBoundary>
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path={ROUTES.HOME} element={<HomePage />} />
                    <Route path={ROUTES.ABOUT} element={<AboutPage />} />
                    <Route path={ROUTES.CONTACT} element={<ContactPage />} />

                    {/* Rutas de autenticación */}
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTES.AUTH_REGISTER} element={<RegisterPage />} />
                    <Route path={ROUTES.AUTH_LOGIN} element={<LoginPage />} />

                    {/* Comprador */}
                    <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
                    <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
                    <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                    <Route path={ROUTES.CART} element={<CartPage />} />
                    <Route path={ROUTES.CHECKOUT} element={<PagoEnLinea />} />
                    <Route path={ROUTES.COMPRADOR_CONFIRMACION} element={<ConfirmacionPedido />} />

                    {/* Dashboard comprador protegido */}
                    <Route
                      path={ROUTES.DASHBOARD}
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Comprador - layout con menú fijo y rutas hijas */}
                    <Route
                      path="/comprador"
                      element={
                        <ProtectedRoute requiredRole="COMPRADOR">
                          <CuentaLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="perfil" element={<PerfilComprador />} />
                      <Route path="ordenes" element={<Ordenes />} />
                      <Route path="direcciones" element={<Direcciones />} />
                      <Route path="metodos-pago" element={<MetodosPago />} />
                    </Route>

                    {/* Admin protegido */}
                    <Route
                      path={ROUTES.ADMIN_DASHBOARD}
                      element={
                        <ProtectedRoute requiredRole="ADMIN">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Agricultor - rutas públicas */}
                    <Route path={ROUTES.AGRICULTOR.DASHBOARD} element={<DashboardAgricultor />} />
                    <Route path={ROUTES.AGRICULTOR.INVENTARIO} element={<GestionInventario />} />
                    <Route path={ROUTES.AGRICULTOR.PRODUCTOS} element={<MisProductos />} />
                    <Route path={ROUTES.AGRICULTOR.PEDIDOS} element={<GestionPedidos />} />
                    <Route path={ROUTES.AGRICULTOR.REPORTES} element={<ReportesEstadisticas />} />
                    <Route path={ROUTES.AGRICULTOR.PERFIL} element={<PerfilConfiguracion />} />
                  </Routes>
                  </ErrorBoundary>
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
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable theme="colored" style={{ zIndex: 9999 }} />
      <Router>
        <AppBody />
      </Router>
    </>
  );
}

export default App;
