import React, { useMemo, useState, useEffect, useContext } from 'react';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import EncabezadoReportes from '../../components/reportes/EncabezadoReportes';
import FiltrosReportes from '../../components/reportes/FiltrosReportes';
import TarjetasMetricas from '../../components/reportes/TarjetasMetricas';
import GraficoEvolucionVentas from '../../components/reportes/GraficoEvolucionVentas';
import TopProductos from '../../components/reportes/TopProductos';
import TablaVentasDetallada from '../../components/reportes/TablaVentasDetallada';
import GraficoVentasPorCategoria from '../../components/reportes/GraficoVentasPorCategoria';
import ToastContainerCustom from '../../components/notifications/ToastContainer';
import { useNotification } from '../../contexts/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import { listOrdersByAgricultor, listOrdersByUser, getOrderItems } from '../../api/orders.js'
import { getPerfilPublicByAuth } from '../../api/users.js'

const COLORS = ['#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9']

const ReportesEstadisticas = () => {
  const { showSuccess, showInfo } = useNotification();
  const { user } = useContext(AuthContext)

  // Filtros
  const [period, setPeriod] = useState('30d');
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-29');
  const [category, setCategory] = useState('todas');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([])
  const [rows, setRows] = useState([])
  const [topItems, setTopItems] = useState([])
  const [categories, setCategories] = useState([])

  // Gráfico principal
  const [chartPeriod, setChartPeriod] = useState('30D');

  // Métricas principales calculadas (mock + derivadas)
  const metrics = useMemo(() => {
    const parse = (s) => new Date(s)
    const ini = parse(startDate)
    const fin = parse(endDate)
    const inRange = (d) => {
      const dt = new Date(d)
      return dt >= ini && dt <= fin
    }
    const ords = orders.filter(o => !o.creadoEn || inRange(o.creadoEn))
    const ingresos = ords.reduce((acc,o)=> acc + Number(o.total || 0), 0)
    const completados = ords.filter(o => o.estado === 'ENTREGADO').length
    const productosVendidos = (rows || []).reduce((acc,r)=> acc + (r._countItems || 0), 0)
    const ticketProm = ords.length ? (ingresos / ords.length) : 0
    const formatS = (n) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    return {
      ingresosTotales: formatS(ingresos),
      pedidosCompletados: completados,
      productosVendidos,
      ticketPromedio: formatS(ticketProm),
      compIngresos: '',
      compPedidos: '',
      compProductos: '',
      compTicket: ''
    }
  }, [orders, rows, startDate, endDate])

  const mapCat = (n) => {
    const s = (n||'').toLowerCase()
    if (s.includes('papa') || s.includes('yuca')) return 'tuberculos'
    if (s.includes('lechuga') || s.includes('zanahoria') || s.includes('tomate') || s.includes('cebolla')) return 'verduras'
    if (s.includes('fresa') || s.includes('arándano') || s.includes('palta') || s.includes('naranja') || s.includes('limón')) return 'frutas'
    if (s.includes('maíz') || s.includes('choclo') || s.includes('trigo')) return 'granos'
    return 'otros'
  }

  const filteredRows = useMemo(() => {
    const ini = new Date(startDate)
    const fin = new Date(endDate)
    return rows.filter(r => {
      const d = new Date(r.fecha)
      const inRange = d >= ini && d <= fin
      if (!inRange) return false
      if (category === 'todas') return true
      try {
        const cats = (r.productos || '').split(',').map(p => mapCat(p))
        return cats.includes(category)
      } catch { return true }
    })
  }, [rows, startDate, endDate, category])

  const evolutionData = useMemo(() => {
    const ini = new Date(startDate)
    const fin = new Date(endDate)
    const ords = orders.filter(o => {
      const d = new Date(o.creadoEn || Date.now())
      return d >= ini && d <= fin
    })
    const byDay = {}
    for (const o of ords) {
      const d = new Date(o.creadoEn || Date.now()).toISOString().slice(0,10)
      byDay[d] = (byDay[d] || 0) + Number(o.total || 0)
    }
    return Object.entries(byDay).sort(([a],[b])=> a.localeCompare(b)).map(([fecha,total])=> ({ fecha, total }))
  }, [orders, startDate, endDate])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (!user?.id) { setLoading(false); return }
      const r = await listOrdersByAgricultor(user.id, { size: 50 })
      let ords = r.ok ? (Array.isArray(r.data) ? r.data : []) : []
      if (!r.ok || ords.length === 0) {
        const ru = await listOrdersByUser(undefined)
        ords = ru.ok ? (Array.isArray(ru.data) ? ru.data : []) : []
      }
      setOrders(ords)
      const itemsMap = {}
      for (const o of ords) {
        const it = await getOrderItems(o.id)
        itemsMap[o.id] = it.ok ? it.data : []
      }
      // Tabla detallada rows
      const rr = []
      for (const o of ords) {
        const its = itemsMap[o.id] || []
        const productosStr = its.map(it => `${it.nombreProducto} (${it.cantidad})`).join(', ')
        let clienteNombre = '—'
        try {
          if (o.usuarioAuthId) {
            const bp = await getPerfilPublicByAuth(o.usuarioAuthId)
            clienteNombre = bp.ok && bp.data ? (bp.data.nombres || '—') : '—'
          }
        } catch {}
        rr.push({
          fecha: new Date(o.creadoEn || Date.now()).toISOString().slice(0,10),
          pedido: o.id,
          cliente: clienteNombre,
          productos: productosStr,
          total: `S/ ${Number(o.total || 0).toFixed(2)}`,
          _countItems: its.reduce((acc,it)=> acc + Number(it.cantidad || 0), 0)
        })
      }
      setRows(rr)
      // Top productos
      const agg = {}
      for (const oid of Object.keys(itemsMap)) {
        for (const it of itemsMap[oid]) {
          const k = it.nombreProducto || '—'
          if (!agg[k]) agg[k] = { name: k, quantity: 0, revenue: 0 }
          agg[k].quantity += Number(it.cantidad || 0)
          agg[k].revenue += Number(it.precioUnitario || 0) * Number(it.cantidad || 0)
        }
      }
      const totalRev = Object.values(agg).reduce((acc,a)=> acc + a.revenue, 0) || 1
      const top = Object.values(agg)
        .sort((a,b)=> b.revenue - a.revenue)
        .slice(0,5)
        .map((a,idx)=> ({ rank: idx+1, name: a.name, quantity: a.quantity, unit: 'u', revenue: `S/ ${a.revenue.toFixed(2)}`, percentage: `${((a.revenue/totalRev)*100).toFixed(1)}%` }))
      setTopItems(top)
      // Categorías (heurística por nombre)
      const catAgg = {}
      for (const a of Object.values(agg)) {
        const c = mapCat(a.name)
        if (!catAgg[c]) catAgg[c] = 0
        catAgg[c] += a.revenue
      }
      const cats = Object.entries(catAgg).map(([raw,val],i)=> ({ label: raw[0].toUpperCase()+raw.slice(1), value: `S/ ${val.toFixed(2)}`, color: COLORS[i % COLORS.length] }))
      setCategories(cats)
      setLoading(false)
    }
    load()
  }, [user?.id])

  useEffect(() => {
    const now = new Date()
    const fmt = (d) => d.toISOString().slice(0,10)
    if (period === 'hoy') { setStartDate(fmt(now)); setEndDate(fmt(now)) }
    else if (period === '7d') { const d = new Date(now); d.setDate(d.getDate()-6); setStartDate(fmt(d)); setEndDate(fmt(now)) }
    else if (period === '30d') { const d = new Date(now); d.setDate(d.getDate()-29); setStartDate(fmt(d)); setEndDate(fmt(now)) }
    else if (period === 'mes') { const d = new Date(now.getFullYear(), now.getMonth(), 1); setStartDate(fmt(d)); setEndDate(fmt(now)) }
    else if (period === 'mes_pasado') { const d1 = new Date(now.getFullYear(), now.getMonth()-1, 1); const d2 = new Date(now.getFullYear(), now.getMonth(), 0); setStartDate(fmt(d1)); setEndDate(fmt(d2)) }
  }, [period])

  const handleReset = () => {
    setPeriod('30d');
    setStartDate('2025-09-01');
    setEndDate('2025-09-29');
    setCategory('todas');
  };

  const handleApply = async () => {
    console.log('[reportes] aplicar filtros', { period, startDate, endDate, category })
    await (async () => {
      setLoading(true)
      if (!user?.id) { setLoading(false); return }
      const r = await listOrdersByAgricultor(user.id, { size: 50 })
      console.log('[reportes] listOrdersByAgricultor status', r.status, 'len', (Array.isArray(r.data)?r.data.length:0))
      let ords = r.ok ? (Array.isArray(r.data) ? r.data : []) : []
      if (!r.ok || ords.length === 0) {
        const ru = await listOrdersByUser(undefined)
        console.log('[reportes] fallback listOrdersByUser status', ru.status, 'len', (Array.isArray(ru.data)?ru.data.length:0))
        ords = ru.ok ? (Array.isArray(ru.data) ? ru.data : []) : []
      }
      setOrders(ords)
      const itemsMap = {}
      for (const o of ords) {
        const it = await getOrderItems(o.id)
        console.log('[reportes] items pedido', o.id, 'len', (Array.isArray(it.data)?it.data.length:0))
        itemsMap[o.id] = it.ok ? it.data : []
      }
      const rr = []
      for (const o of ords) {
        const its = itemsMap[o.id] || []
        const productosStr = its.map(it => `${it.nombreProducto} (${it.cantidad})`).join(', ')
        let clienteNombre = '—'
        try {
          if (o.usuarioAuthId) {
            const bp = await getPerfilPublicByAuth(o.usuarioAuthId)
            clienteNombre = bp.ok && bp.data ? (bp.data.nombres || '—') : '—'
          }
        } catch {}
        rr.push({
          fecha: new Date(o.creadoEn || Date.now()).toISOString().slice(0,10),
          pedido: o.id,
          cliente: clienteNombre,
          productos: productosStr,
          total: `S/ ${Number(o.total || 0).toFixed(2)}`,
          _countItems: its.reduce((acc,it)=> acc + Number(it.cantidad || 0), 0)
        })
      }
      setRows(rr)
      const agg = {}
      for (const oid of Object.keys(itemsMap)) {
        for (const it of itemsMap[oid]) {
          const k = it.nombreProducto || '—'
          if (!agg[k]) agg[k] = { name: k, quantity: 0, revenue: 0 }
          agg[k].quantity += Number(it.cantidad || 0)
          agg[k].revenue += Number(it.precioUnitario || 0) * Number(it.cantidad || 0)
        }
      }
      const totalRev = Object.values(agg).reduce((acc,a)=> acc + a.revenue, 0) || 1
      const top = Object.values(agg)
        .sort((a,b)=> b.revenue - a.revenue)
        .slice(0,5)
        .map((a,idx)=> ({ rank: idx+1, name: a.name, quantity: a.quantity, unit: 'u', revenue: `S/ ${a.revenue.toFixed(2)}`, percentage: `${((a.revenue/totalRev)*100).toFixed(1)}%` }))
      setTopItems(top)
      const catAgg = {}
      for (const a of Object.values(agg)) {
        const c = mapCat(a.name)
        if (!catAgg[c]) catAgg[c] = 0
        catAgg[c] += a.revenue
      }
      const cats = Object.entries(catAgg).map(([raw,val],i)=> ({ label: raw[0].toUpperCase()+raw.slice(1), value: `S/ ${val.toFixed(2)}`, color: COLORS[i % COLORS.length] }))
      setCategories(cats)
      setLoading(false)
      console.log('[reportes] órdenes cargadas', { length: ords.length })
      console.log('[reportes] filas detalladas', { length: rr.length })
      console.log('[reportes] top productos', top)
      console.log('[reportes] categorías', cats)
    })()
    showSuccess('Filtros aplicados correctamente.')
  };

  const handleExportPDF = () => {
    try {
      const win = window.open('', 'PRINT', 'height=600,width=800')
      if (!win) return
      const summary = `
        <div style="font-family: Arial, sans-serif;">
          <h2>Reporte de Ventas — Agricultor</h2>
          <div style="margin:8px 0;">Periodo: ${startDate} a ${endDate} · Categoría: ${category}</div>
          <div style="display:flex;gap:16px;margin:8px 0;">
            <div>Ingresos Totales: ${metrics.ingresosTotales}</div>
            <div>Pedidos Completados: ${metrics.pedidosCompletados}</div>
            <div>Productos Vendidos: ${metrics.productosVendidos}</div>
            <div>Ticket Promedio: ${metrics.ticketPromedio}</div>
          </div>
        </div>
      `
      const tblRows = filteredRows.map(r => `<tr><td>${r.fecha}</td><td>#${r.pedido}</td><td>${r.cliente}</td><td>${r.productos}</td><td>${r.total}</td></tr>`).join('')
      const tbl = `
        <table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse;">
          <thead><tr><th>Fecha</th><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th></tr></thead>
          <tbody>${tblRows}</tbody>
        </table>
      `
      const cats = categories.map(c => `<tr><td>${c.label}</td><td>${c.value}</td></tr>`).join('')
      const catsTbl = `
        <h3>Ventas por Categoría</h3>
        <table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse;">
          <thead><tr><th>Categoría</th><th>Ingresos</th></tr></thead>
          <tbody>${cats}</tbody>
        </table>
      `
      const tops = topItems.map(t => `<tr><td>${t.rank}</td><td>${t.name}</td><td>${t.quantity}</td><td>${t.revenue}</td><td>${t.percentage}</td></tr>`).join('')
      const topTbl = `
        <h3>Top 5 Productos</h3>
        <table border="1" cellspacing="0" cellpadding="4" style="width:100%;border-collapse:collapse;">
          <thead><tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Ingresos</th><th>%</th></tr></thead>
          <tbody>${tops}</tbody>
        </table>
      `
      win.document.write(`<html><head><title>Reporte</title></head><body>${summary}${topTbl}${catsTbl}${tbl}</body></html>`)
      win.document.close()
      win.focus()
      win.print()
      win.close()
    } catch (e) { console.log('export pdf error', e) }
  };

  const handleExportExcel = () => {
    try {
      const header = `<tr><th>Fecha</th><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th></tr>`
      const body = filteredRows.map(r => `<tr><td>${r.fecha}</td><td>${r.pedido}</td><td>${r.cliente}</td><td>${r.productos}</td><td>${r.total}</td></tr>`).join('')
      const topHeader = `<tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Ingresos</th><th>%</th></tr>`
      const topBody = topItems.map(t => `<tr><td>${t.rank}</td><td>${t.name}</td><td>${t.quantity}</td><td>${t.revenue}</td><td>${t.percentage}</td></tr>`).join('')
      const catHeader = `<tr><th>Categoría</th><th>Ingresos</th></tr>`
      const catBody = categories.map(c => `<tr><td>${c.label}</td><td>${c.value}</td></tr>`).join('')
      const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"><title>Reporte</title></head>
        <body>
          <table><tr><td><b>Periodo:</b></td><td>${startDate} a ${endDate}</td></tr><tr><td><b>Categoría:</b></td><td>${category}</td></tr></table>
          <h3>Resumen</h3>
          <table border="1" cellspacing="0" cellpadding="4">
            <tr><td>Ingresos Totales</td><td>${metrics.ingresosTotales}</td></tr>
            <tr><td>Pedidos Completados</td><td>${metrics.pedidosCompletados}</td></tr>
            <tr><td>Productos Vendidos</td><td>${metrics.productosVendidos}</td></tr>
            <tr><td>Ticket Promedio</td><td>${metrics.ticketPromedio}</td></tr>
          </table>
          <h3>Top 5 Productos</h3>
          <table border="1" cellspacing="0" cellpadding="4">${topHeader}${topBody}</table>
          <h3>Ventas por Categoría</h3>
          <table border="1" cellspacing="0" cellpadding="4">${catHeader}${catBody}</table>
          <h3>Ventas Detalladas</h3>
          <table border="1" cellspacing="0" cellpadding="4">${header}${body}</table>
        </body></html>`
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_agricultor_${startDate}_${endDate}.xls`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) { console.log('export excel error', e) }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EncabezadoReportes onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} />

        <FiltrosReportes
          period={period}
          startDate={startDate}
          endDate={endDate}
          category={category}
          onPeriodChange={setPeriod}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onCategoryChange={setCategory}
          onReset={handleReset}
          onApply={handleApply}
        />

        <TarjetasMetricas metrics={metrics} />

        {/* Main grid: gráfico principal + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <GraficoEvolucionVentas periodSelected={chartPeriod} onChangePeriod={setChartPeriod} loading={loading} data={evolutionData} />
          </div>
          <div>
            <TopProductos items={topItems} loading={loading} />
          </div>
        </div>

        {/* Sección: Ventas por Categoría */}
        <GraficoVentasPorCategoria data={categories} loading={loading} />

        {/* Sección adicional: Tabla de ventas detalladas */}
        <div className="mt-4">
          <TablaVentasDetallada rows={filteredRows} loading={loading} />
        </div>
      </main>

      <ToastContainerCustom />
    </div>
  );
};

export default ReportesEstadisticas;
