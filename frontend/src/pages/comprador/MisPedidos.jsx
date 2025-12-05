import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaCreditCard, FaCheckCircle, FaList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

import FiltroPedidos from '../../components/pedidos/FiltroPedidos';
import TabsEstadoPedidos from '../../components/pedidos/TabsEstadoPedidos';
import TarjetaPedido from '../../components/pedidos/TarjetaPedido';
import ToastContainerCustom from '../../components/notifications/ToastContainer';

// Mapeo de estados para coherencia
const STATUS = {
  todos: 'todos',
  en_proceso: 'en_proceso',
  en_camino: 'en_camino',
  entregados: 'entregados',
  cancelados: 'cancelados'
};

const MisPedidos = () => {
  const { user } = useAuth();
  const { showInfo } = useNotification();

  // Datos simulados de pedidos
  const initialOrders = useMemo(() => ([
    {
      id: 1247,
      date: new Date(2025, 8, 25, 9, 30),
      dateLabel: '25 de Septiembre, 2025',
      status: STATUS.en_camino,
      vendor: { name: 'Finca Los Andes', rating: 4.8, reviews: 156, initials: 'FL' },
      items: [
        { id: 'papa', name: 'Papa Blanca Premium', quantity: 10, unit: 'kg', unitPrice: 2.5 },
        { id: 'tomate', name: 'Tomates Cherry Orgánicos', quantity: 5, unit: 'kg', unitPrice: 6.0 },
      ],
      timeline: [
        { key: 'confirmado', label: 'Pedido confirmado', dateLabel: '25 Sept, 10:30 AM', status: 'done' },
        { key: 'preparacion', label: 'En preparación', dateLabel: '25 Sept, 2:15 PM', status: 'done' },
        { key: 'camino', label: 'En camino', dateLabel: '26 Sept, 8:00 AM', status: 'current' },
        { key: 'estimada', label: 'Entrega estimada', dateLabel: '27 Sept', status: 'pending' },
      ],
      total: 55,
    },
    {
      id: 1281,
      date: new Date(2025, 7, 11, 13, 15),
      dateLabel: '11 de Agosto, 2025',
      status: STATUS.entregados,
      vendor: { name: 'AgroBio Huertos', rating: 4.6, reviews: 89, initials: 'AH' },
      items: [
        { id: 'lechuga', name: 'Lechuga Hidropónica', quantity: 8, unit: 'und', unitPrice: 1.5 },
      ],
      timeline: [
        { key: 'confirmado', label: 'Pedido confirmado', dateLabel: '11 Ago, 11:20 AM', status: 'done' },
        { key: 'preparacion', label: 'En preparación', dateLabel: '11 Ago, 12:00 PM', status: 'done' },
        { key: 'camino', label: 'En camino', dateLabel: '12 Ago, 9:10 AM', status: 'done' },
        { key: 'entregado', label: 'Entregado', dateLabel: '12 Ago, 5:45 PM', status: 'done' },
      ],
      total: 12,
    },
    {
      id: 1302,
      date: new Date(2025, 3, 3, 8, 0),
      dateLabel: '3 de Abril, 2025',
      status: STATUS.cancelados,
      vendor: { name: 'EcoCampo Perú', rating: 4.2, reviews: 34, initials: 'EP' },
      items: [
        { id: 'queso', name: 'Queso Fresco', quantity: 4, unit: 'und', unitPrice: 7.2 },
      ],
      timeline: [
        { key: 'confirmado', label: 'Pedido confirmado', dateLabel: '3 Abr, 8:10 AM', status: 'done' },
        { key: 'cancelado', label: 'Cancelado', dateLabel: '3 Abr, 10:05 AM', status: 'done' },
      ],
      total: 28.8,
    }
  ]), []);

  // Estado de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeStatus, setActiveStatus] = useState(STATUS.todos);

  // Cálculo de conteos por estado
  const counts = useMemo(() => {
    const base = { todos: 0, en_proceso: 0, en_camino: 0, entregados: 0, cancelados: 0 };
    initialOrders.forEach(o => {
      base.todos += 1;
      base[o.status] += 1;
    });
    return base;
  }, [initialOrders]);

  // Filtro por rango de fecha
  const cutoff = useMemo(() => {
    if (dateRange === 'all') return null;
    const days = Number(dateRange);
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }, [dateRange]);

  // Filtrado y orden
  const visibleOrders = useMemo(() => {
    let list = [...initialOrders];

    // Estado
    if (activeStatus !== STATUS.todos) {
      list = list.filter(o => o.status === activeStatus);
    }

    // Fecha
    if (cutoff) {
      list = list.filter(o => o.date >= cutoff);
    }

    // Búsqueda por número o producto
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(o => {
        const idMatch = String(o.id).includes(q);
        const itemMatch = o.items.some(it => it.name.toLowerCase().includes(q));
        return idMatch || itemMatch;
      });
    }

    // Orden
    list.sort((a, b) => {
      return sortOrder === 'asc' ? a.date - b.date : b.date - a.date;
    });

    return list;
  }, [initialOrders, activeStatus, cutoff, searchTerm, sortOrder]);

  // Acciones
  const handleTrack = (order) => showInfo(`Rastreo para pedido #${order.id} próximamente.`);
  const handleInvoice = (order) => showInfo(`Factura del pedido #${order.id} disponible próximamente.`);
  const handleHelp = (order) => showInfo('Soporte contactará en breve.');

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Stepper contextual */}
      <div className="bg-green-600 bg-opacity-80 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center text-white text-sm">
            <Link to="/catalog" className="flex items-center opacity-90">
              <FaList className="mr-2" /> Catálogo
            </Link>
            <span className="mx-3 opacity-70">→</span>
            <Link to="/cart" className="flex items-center opacity-90">
              <FaShoppingCart className="mr-2" /> Carrito
            </Link>
            <span className="mx-3 opacity-70">→</span>
            <Link to="/checkout" className="flex items-center opacity-90">
              <FaCreditCard className="mr-2" /> Pago
            </Link>
            <span className="mx-3 opacity-70">→</span>
            <div className="flex items-center font-semibold">
              <FaCheckCircle className="mr-2" /> Mis Pedidos
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mis Pedidos</h1>
        <p className="text-sm text-gray-600 mb-4">Historial completo de tus compras realizadas</p>

        {/* Filtros */}
        <FiltroPedidos
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Tabs */}
        <TabsEstadoPedidos active={activeStatus} counts={counts} onChange={setActiveStatus} />

        {/* Listado */}
        <div className="space-y-4">
          {visibleOrders.map(order => (
            <TarjetaPedido
              key={order.id}
              order={order}
              onTrack={handleTrack}
              onInvoice={handleInvoice}
              onHelp={handleHelp}
            />
          ))}
          {visibleOrders.length === 0 && (
            <div className="bg-white rounded-md shadow-sm p-6 text-center text-sm text-gray-600">
              No se encontraron pedidos con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>

      <ToastContainerCustom />
    </div>
  );
};

export default MisPedidos;