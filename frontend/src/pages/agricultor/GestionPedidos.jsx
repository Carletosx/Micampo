import React, { useMemo, useState } from 'react';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import EncabezadoPedidos from '../../components/pedidos-agricultor/EncabezadoPedidos';
import TarjetasResumenPedidos from '../../components/pedidos-agricultor/TarjetasResumenPedidos';
import BarraBusquedaFiltrosPedidos from '../../components/pedidos-agricultor/BarraBusquedaFiltrosPedidos';
import TabsEstadoPedidos from '../../components/pedidos-agricultor/TabsEstadoPedidos';
import TarjetaPedidoAgricultor from '../../components/pedidos-agricultor/TarjetaPedidoAgricultor';
import ModalDetallePedido from '../../components/pedidos-agricultor/ModalDetallePedido';
import ModalCambiarEstado from '../../components/pedidos-agricultor/ModalCambiarEstado';
import ToastContainerCustom from '../../components/notifications/ToastContainer';
import { useNotification } from '../../contexts/NotificationContext';

const MOCK_ORDERS = [
  {
    id: 1247,
    client: { name: 'María García Rodríguez', email: 'maria.garcia@email.com', phone: '987 654 321' },
    status: 'pendiente',
    total: 245.00,
    timeAgo: 'Hace 2 horas',
    createdAt: new Date(),
    urgent: true,
    products: [
      { name: 'Papa Blanca Premium', qty: 10, unit: 'kg', price: 25.0 },
      { name: 'Tomates Cherry Orgánicos', qty: 12, unit: 'kg', price: 60.0 },
    ],
    shipping: { address: 'Av. Los Olivos 123, Lima', estimatedDelivery: '14 Sep, 5:00 PM' },
    payment: { method: 'Tarjeta de crédito' },
    notes: 'Entregar en portería'
  },
  {
    id: 1246,
    client: { name: 'Juan Torres', email: 'juan.torres@email.com', phone: '944 112 223' },
    status: 'en_proceso',
    total: 180.00,
    timeAgo: 'Hace 1 hora',
    createdAt: new Date(),
    products: [
      { name: 'Lechuga Orgánica', qty: 8, unit: 'u', price: 32.0 },
      { name: 'Zanahoria', qty: 15, unit: 'kg', price: 75.0 },
    ],
    shipping: { address: 'Jr. Primavera 42, Arequipa', estimatedDelivery: '13 Sep, 3:00 PM' },
    payment: { method: 'Transferencia' },
  },
  {
    id: 1245,
    client: { name: 'Ana Flores', email: 'ana.flores@email.com', phone: '912 334 556' },
    status: 'entregado',
    total: 320.00,
    timeAgo: 'Ayer',
    createdAt: new Date(Date.now() - 86400000),
    products: [
      { name: 'Paltas Hass', qty: 20, unit: 'kg', price: 200.0 },
      { name: 'Naranjas', qty: 15, unit: 'kg', price: 75.0 },
    ],
    shipping: { address: 'Calle Las Magnolias 540, Trujillo', estimatedDelivery: '12 Sep, 4:00 PM' },
    payment: { method: 'Efectivo' },
  },
  {
    id: 1244,
    client: { name: 'Carlos Ruiz', email: 'carlos.ruiz@email.com', phone: '901 223 455' },
    status: 'enviado',
    total: 95.00,
    timeAgo: 'Hace 3 horas',
    createdAt: new Date(),
    urgent: false,
    products: [
      { name: 'Yuca amarilla', qty: 12, unit: 'kg', price: 60.0 },
      { name: 'Plátanos', qty: 8, unit: 'kg', price: 40.0 },
    ],
    shipping: { address: 'Psj. Los Cedros 10, Chiclayo', estimatedDelivery: '14 Sep, 10:00 AM' },
    payment: { method: 'Tarjeta de débito' },
  },
  {
    id: 1243,
    client: { name: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', phone: '908 334 221' },
    status: 'pendiente',
    total: 48.50,
    timeAgo: 'Hace 20 min',
    createdAt: new Date(),
    urgent: true,
    products: [
      { name: 'Cebolla roja', qty: 10, unit: 'kg', price: 30.0 },
      { name: 'Limones', qty: 6, unit: 'kg', price: 18.5 },
    ],
    shipping: { address: 'Av. Central 765, Lima', estimatedDelivery: '13 Sep, 6:00 PM' },
    payment: { method: 'Yape' },
    notes: 'Cliente solicita llamadas antes de entregar'
  },
  {
    id: 1242,
    client: { name: 'Lucía Ramos', email: 'lucia.ramos@email.com', phone: '933 442 120' },
    status: 'cancelado',
    total: 75.00,
    timeAgo: 'Hoy',
    createdAt: new Date(),
    products: [
      { name: 'Papa amarilla', qty: 10, unit: 'kg', price: 50.0 },
      { name: 'Ajo', qty: 2, unit: 'kg', price: 25.0 },
    ],
    shipping: { address: 'Av. Perú 321, Cusco', estimatedDelivery: '15 Sep, 11:00 AM' },
    payment: { method: 'Tarjeta de crédito' },
  },
  {
    id: 1241,
    client: { name: 'Miguel Castillo', email: 'miguel.castillo@email.com', phone: '945 110 222' },
    status: 'en_proceso',
    total: 510.00,
    timeAgo: 'Hace 5 horas',
    createdAt: new Date(),
    products: [
      { name: 'Arándanos', qty: 20, unit: 'kg', price: 300.0 },
      { name: 'Fresas', qty: 15, unit: 'kg', price: 210.0 },
    ],
    shipping: { address: 'Av. La Marina 210, Lima', estimatedDelivery: '16 Sep, 9:00 AM' },
    payment: { method: 'Transferencia' },
  },
  {
    id: 1240,
    client: { name: 'Rosa Medina', email: 'rosa.medina@email.com', phone: '944 223 989' },
    status: 'enviado',
    total: 120.00,
    timeAgo: 'Hace 1 día',
    createdAt: new Date(Date.now() - 86400000),
    products: [
      { name: 'Tomates', qty: 10, unit: 'kg', price: 60.0 },
      { name: 'Lechuga', qty: 12, unit: 'u', price: 60.0 },
    ],
    shipping: { address: 'Calle Rosa Pineda 25, Piura', estimatedDelivery: '13 Sep, 7:00 PM' },
    payment: { method: 'Efectivo' },
  },
  {
    id: 1239,
    client: { name: 'Alberto Quispe', email: 'alberto.quispe@email.com', phone: '921 654 333' },
    status: 'entregado',
    total: 60.00,
    timeAgo: 'Hace 3 días',
    createdAt: new Date(Date.now() - (3 * 86400000)),
    products: [
      { name: 'Zapallo', qty: 8, unit: 'kg', price: 60.0 },
    ],
    shipping: { address: 'Av. Colonial 455, Lima', estimatedDelivery: '10 Sep, 1:00 PM' },
    payment: { method: 'Tarjeta de débito' },
  },
];

const PAGE_SIZE = 6;

const GestionPedidos = () => {
  const { showSuccess, showError, showInfo } = useNotification();

  // Estado base
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState('todos');

  // Filtros
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('30dias'); // 'hoy' | 'semana' | 'mes' | 'personalizado'
  const [amount, setAmount] = useState('todos');  // 'lt50' | '50-100' | '100-500' | 'gt500'

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Modales
  const [detailOrder, setDetailOrder] = useState(null);
  const [changeState, setChangeState] = useState({ order: null, target: null });

  // Helpers
  const matchesPeriod = (date) => {
    const now = new Date();
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    if (period === 'hoy') return date.toDateString() === now.toDateString();
    if (period === 'semana') return diffDays <= 7;
    if (period === 'mes') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    if (period === '30dias') return diffDays <= 30;
    return true; // 'personalizado' o cualquiera: sin filtro extra
  };

  const matchesAmount = (total) => {
    if (amount === 'lt50') return total < 50;
    if (amount === '50-100') return total >= 50 && total <= 100;
    if (amount === '100-500') return total > 100 && total <= 500;
    if (amount === 'gt500') return total > 500;
    return true;
  };

  // Conteos por estado para tabs
  const counts = useMemo(() => ({
    todos: orders.length,
    pendiente: orders.filter(o => o.status === 'pendiente').length,
    en_proceso: orders.filter(o => o.status === 'en_proceso').length,
    enviado: orders.filter(o => o.status === 'enviado').length,
    entregado: orders.filter(o => o.status === 'entregado').length,
    cancelado: orders.filter(o => o.status === 'cancelado').length,
  }), [orders]);

  // Estadísticas para tarjetas superiores
  const stats = useMemo(() => {
    const now = new Date();
    const sameMonth = (d) => d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

    const pendientes = orders.filter(o => o.status === 'pendiente').length;
    const enProceso = orders.filter(o => o.status === 'en_proceso').length;
    const completadosMes = orders.filter(o => o.status === 'entregado' && sameMonth(o.createdAt)).length;
    const ingresosMesNumber = orders
      .filter(o => o.status === 'entregado' && sameMonth(o.createdAt))
      .reduce((acc, o) => acc + o.total, 0);

    const ingresosMes = `S/ ${ingresosMesNumber.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

    return { pendientes, enProceso, completadosMes, ingresosMes };
  }, [orders]);

  // Filtrado y ordenado
  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();

    let res = orders.filter(o => {
      const byStatus = activeTab === 'todos' ? true : o.status === activeTab;
      const byQuery =
        !q ||
        o.id.toString().includes(q) ||
        o.client.name.toLowerCase().includes(q) ||
        o.client.email.toLowerCase().includes(q) ||
        o.client.phone.toLowerCase().includes(q);
      const byPeriod = matchesPeriod(o.createdAt);
      const byAmount = matchesAmount(o.total);

      return byStatus && byQuery && byPeriod && byAmount;
    });

    res = res.sort((a, b) => b.createdAt - a.createdAt);
    return res;
  }, [orders, activeTab, query, period, amount]);

  // Paginación calculada
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageOrders = filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);

  // Acciones
  const handleResetFilters = () => {
    setQuery('');
    setPeriod('30dias');
    setAmount('todos');
    setActiveTab('todos');
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleOpenDetails = (order) => setDetailOrder(order);
  const handleCloseDetails = () => setDetailOrder(null);

  const handleOpenChangeStatus = (order, target) => setChangeState({ order, target });
  const handleCloseChange = () => setChangeState({ order: null, target: null });

  const handleConfirmStatus = (order, newStatus) => {
    try {
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status: newStatus } : o)));
      showSuccess(`Estado actualizado a "${newStatus}" para el pedido #${order.id}`);
      handleCloseChange();
    } catch (e) {
      showError('Ocurrió un error al actualizar el estado.');
    }
  };

  const handleContactClient = (order) => {
    showInfo(`Contactando al cliente de pedido #${order.id}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Encabezado */}
        <EncabezadoPedidos
          titulo="Gestión de Pedidos"
          subtitulo="Administra y da seguimiento a todos tus pedidos"
        />

        {/* Tarjetas de resumen */}
        <TarjetasResumenPedidos stats={stats} />

        {/* Barra de búsqueda y filtros */}
        <BarraBusquedaFiltrosPedidos
          query={query}
          onQueryChange={(v) => { setQuery(v); setCurrentPage(1); }}
          period={period}
          onPeriodChange={(v) => { setPeriod(v); setCurrentPage(1); }}
          amount={amount}
          onAmountChange={(v) => { setAmount(v); setCurrentPage(1); }}
          onReset={handleResetFilters}
        />

        {/* Tabs de estado */}
        <TabsEstadoPedidos
          active={activeTab}
          counts={counts}
          onChange={handleTabChange}
        />

        {/* Listado de pedidos */}
        <div className="space-y-3" id={`panel-${activeTab}`} role="region" aria-label="Listado de pedidos">
          {pageOrders.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
              No se encontraron pedidos con los filtros seleccionados.
            </div>
          )}
          {pageOrders.map(order => (
            <TarjetaPedidoAgricultor
              key={order.id}
              order={order}
              onViewDetails={handleOpenDetails}
              onChangeStatus={handleOpenChangeStatus}
              onContact={handleContactClient}
            />
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {pageOrders.length} de {filteredOrders.length} pedidos
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={`px-3 py-2 text-sm rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={`px-3 py-2 text-sm rounded-md border ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Modales */}
        <ModalDetallePedido order={detailOrder} onClose={handleCloseDetails} />
        <ModalCambiarEstado
          order={changeState.order}
          targetStatus={changeState.target}
          onConfirm={handleConfirmStatus}
          onClose={handleCloseChange}
        />
      </main>

      {/* Contenedor de toasts */}
      <ToastContainerCustom />
    </div>
  );
};

export default GestionPedidos;