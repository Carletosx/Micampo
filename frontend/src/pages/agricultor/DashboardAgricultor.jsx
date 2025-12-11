import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import BannerBienvenida from '../../components/dashboard/BannerBienvenida';
import TarjetasEstadisticas from '../../components/dashboard/TarjetasEstadisticas';
import GraficoVentas from '../../components/dashboard/GraficoVentas';
import AlertasInventario from '../../components/dashboard/AlertasInventario';
import PedidosRecientes from '../../components/dashboard/PedidosRecientes';
import ProductosMasVendidos from '../../components/dashboard/ProductosMasVendidos';
import { listOrdersByAgricultor, listOrdersByUser, getOrderItems } from '../../api/orders.js'
import { listProducts, getProduct } from '../../api/products.js'
import { listReviewsBySeller } from '../../api/reviews.js'

import { getInventario } from '../../api/inventory';

const DashboardAgricultor = () => {
  const { user } = useContext(AuthContext);
  const nombreAgricultor = (user?.displayName || (user?.email || '').split('@')[0] || '').split(' ')[0];
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ publicados: 0, nuevosSemana: 0, pedidosMes: 0, incrementoPedidos: 0, ingresosMes: 'S/ 0.00', incrementoIngresos: 0, calificacion: 4.8, reseñas: 0 })
  const [chartData, setChartData] = useState([])
  const [topItems, setTopItems] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let ords = []
      if (user?.id) {
        const r = await listOrdersByAgricultor(user.id, { size: 50 })
        ords = r.ok && Array.isArray(r.data) ? r.data : []
        if (!r.ok || ords.length === 0) {
          const ru = await listOrdersByUser(undefined)
          ords = ru.ok && Array.isArray(ru.data) ? ru.data : []
        }
      }
      setOrders(ords)
      const now = new Date()
      const month = now.getMonth()
      const year = now.getFullYear()
      const inMonth = (d) => { const dt = new Date(d || Date.now()); return dt.getMonth() === month && dt.getFullYear() === year }
      const pedidosMes = ords.filter(o => inMonth(o.creadoEn)).length
      const ingresosMesNumber = ords.filter(o => inMonth(o.creadoEn)).reduce((acc,o)=> acc + Number(o.total || 0), 0)
      const ingresosMes = `S/ ${ingresosMesNumber.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
      // Productos publicados y nuevos semana
      const lp = await listProducts({ size: 200 })
      const pItems = lp.ok && Array.isArray(lp.data) ? lp.data : []
      const msp = pItems.filter(p => Number(p.vendedorAuthId||0) === Number(user?.id || 0))
      const publicados = msp.filter(p => p.activo).length
      const d7 = new Date(now); d7.setDate(d7.getDate()-7)
      const nuevosSemana = msp.filter(p => { const d = new Date(p.creadoEn || now); return d >= d7 }).length
      // Calificación promedio por reseñas
      let calificacion = 4.8, reseñas = 0
      try {
        const rv = await listReviewsBySeller(user.id)
        const arr = rv.ok && Array.isArray(rv.data) ? rv.data : []
        reseñas = arr.length
        const sum = arr.reduce((acc,r)=> acc + Number(r.calificacion || 0), 0)
        calificacion = reseñas ? Number((sum / reseñas).toFixed(1)) : 4.8
      } catch {}
      setStats(s => ({ ...s, pedidosMes, ingresosMes, publicados, nuevosSemana, calificacion, reseñas }))
      const byDay = {}
      for (const o of ords) {
        const d = new Date(o.creadoEn || Date.now()).toISOString().slice(0,10)
        byDay[d] = (byDay[d] || 0) + Number(o.total || 0)
      }
      const cdata = Object.entries(byDay).sort(([a],[b])=> a.localeCompare(b)).map(([fecha,total])=> ({ fecha, total }))
      setChartData(cdata)
      const itemsMap = {}
      for (const o of ords) {
        const it = await getOrderItems(o.id)
        itemsMap[o.id] = it.ok ? it.data : []
      }
      const ordsWithCounts = ords
        .map(o => ({ ...o, _itemsCount: (itemsMap[o.id] || []).length }))
        .sort((a,b) => new Date(b.creadoEn || Date.now()) - new Date(a.creadoEn || Date.now()))
      setRecentOrders(ordsWithCounts.slice(0, 3))
      const agg = {}
      for (const oid of Object.keys(itemsMap)) {
        for (const it of itemsMap[oid]) {
          const k = it.nombreProducto || '—'
          if (!agg[k]) agg[k] = { name: k, quantity: 0, revenue: 0, productoId: it.productoId }
          agg[k].quantity += Number(it.cantidad || 0)
          agg[k].revenue += Number(it.precioUnitario || 0) * Number(it.cantidad || 0)
        }
      }
      const totalRev = Object.values(agg).reduce((acc,a)=> acc + a.revenue, 0) || 1
      let top = Object.values(agg)
        .sort((a,b)=> b.revenue - a.revenue)
        .slice(0,3)
      // imagenes para top usando listado de productos (evita 500 de detalle)
      const imgMap = {}
      for (const p of pItems) { if (p && p.id != null) imgMap[p.id] = p.imagenUrl || null }
      const enriched = []
      for (const t of top) {
        const img = (t.productoId && imgMap[t.productoId]) ? imgMap[t.productoId] : 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=160&q=80'
        enriched.push({ name: t.name, quantity: t.quantity, revenue: `S/ ${t.revenue.toFixed(2)}`, imagen: img })
      }
      top = enriched
      setTopItems(top)
      setLoading(false)
      console.log('[dashboard] órdenes', ords.length)
      console.log('[dashboard] chartData', cdata.length)
      console.log('[dashboard] topItems', top)
    }
    load()
  }, [user?.id])

  

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const productsResult = await listProducts({ size: 100 });
        if (productsResult.ok && productsResult.data) {
          const totalProductos = productsResult.data.length;
          const productosConInventario = await Promise.all(
            productsResult.data.map(async (producto) => {
              try {
                const invResult = await getInventario(producto.id);
                if (invResult.ok && invResult.data) {
                  const stockActual = Number(invResult.data.stockActual ?? producto.stock ?? 0);
                  const stockMinimo = Number(invResult.data.stockMinimo ?? producto.stockMin ?? 0);
                  const estado = (stockActual <= stockMinimo ? 'critico' : (stockActual <= Math.ceil(stockMinimo * 1.5) ? 'bajo' : 'disponible'))
                  return { ...producto, stockActual, stockMinimo, estado };
                }
              } catch (e) {}
              const stockActualFallback = Number(producto.stock ?? 0);
              const stockMinimoFallback = Number(producto.stockMin ?? 0);
              const estadoFallback = stockActualFallback <= stockMinimoFallback ? 'critico' : (stockActualFallback <= Math.ceil(stockMinimoFallback * 1.5) ? 'bajo' : 'disponible')
              return { ...producto, stockActual: stockActualFallback, stockMinimo: stockMinimoFallback, estado: estadoFallback };
            })
          );
          const productosAlerta = productosConInventario
            .filter(p => p && p.estado && (p.estado === 'bajo' || p.estado === 'critico'))
            .sort((a, b) => {
              const prioridad = { critico: 2, bajo: 1, disponible: 0 };
              return (prioridad[b.estado] || 0) - (prioridad[a.estado] || 0);
            })
            .slice(0, 5);
          setAlertas(productosAlerta);
          setStats(prev => ({ ...prev, publicados: totalProductos }));
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      }
    };
    cargarDatos();
  }, []);

  return (
    <>
      <NavbarAgricultor />
      <div className="container mx-auto px-4 py-6">
        {/* Banner de bienvenida */}
        <BannerBienvenida nombre={nombreAgricultor} />

        {/* Tarjetas de estadísticas */}
        <div className="mt-6">
          <TarjetasEstadisticas data={stats} />
        </div>

        {/* Gráfico de ventas (placeholder) */}
        <div className="mt-6">
          <GraficoVentas data={chartData} loading={loading} />
        </div>

        {/* Layout principal + sidebar derecho */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pedidos Recientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <PedidosRecientes items={recentOrders} />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <AlertasInventario alertas={alertas} />
            <ProductosMasVendidos items={topItems} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAgricultor;
