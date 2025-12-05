export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  CATALOG: '/catalog',
  FAVORITES: '/favorites',
  PRODUCT_DETAIL: '/product/:productId',
  CART: '/cart',
  CHECKOUT: '/checkout',
  COMPRADOR_CONFIRMACION: '/comprador/confirmacion-pedido',
  COMPRADOR_ORDENES: '/comprador/ordenes',
  COMPRADOR_DIRECCIONES: '/comprador/direcciones',
  COMPRADOR_METODOS_PAGO: '/comprador/metodos-pago',
  DASHBOARD: '/dashboard',
  COMPRADOR_PERFIL: '/comprador/perfil',
  ADMIN_DASHBOARD: '/admin/dashboard',
  AGRICULTOR: {
    DASHBOARD: '/agricultor/dashboard',
    INVENTARIO: '/agricultor/inventario',
    PRODUCTOS: '/agricultor/productos',
    PEDIDOS: '/agricultor/pedidos',
    REPORTES: '/agricultor/reportes',
    PERFIL: '/agricultor/perfil'
  }
}

export default ROUTES
