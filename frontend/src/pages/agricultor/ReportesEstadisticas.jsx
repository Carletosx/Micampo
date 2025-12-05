import React, { useMemo, useState } from 'react';
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

const MOCK_TOP5 = [
  { rank: 1, name: 'Papa Blanca', quantity: 245, unit: 'kg', revenue: 'S/ 2,250', percentage: '20.6%' },
  { rank: 2, name: 'Tomates Cherry', quantity: 180, unit: 'kg', revenue: 'S/ 1,900', percentage: '22.5%' },
  { rank: 3, name: 'Lechuga Orgánica', quantity: 210, unit: 'u', revenue: 'S/ 1,650', percentage: '18.1%' },
  { rank: 4, name: 'Choclo Fresco', quantity: 150, unit: 'kg', revenue: 'S/ 1,200', percentage: '12.3%' },
  { rank: 5, name: 'Zanahoria', quantity: 175, unit: 'kg', revenue: 'S/ 1,050', percentage: '11.5%' },
];

const MOCK_ROWS = [
  { fecha: '2025-09-01', pedido: 1451, cliente: 'Juan Pérez', productos: 'Papa Blanca (45kg), Zanahoria (20kg)', total: 'S/ 560' },
  { fecha: '2025-09-03', pedido: 1452, cliente: 'María Gómez', productos: 'Tomates Cherry (30kg)', total: 'S/ 320' },
  { fecha: '2025-09-05', pedido: 1453, cliente: 'Ana Flores', productos: 'Lechuga Orgánica (50u)', total: 'S/ 400' },
  { fecha: '2025-09-07', pedido: 1454, cliente: 'Carlos Ruiz', productos: 'Choclo Fresco (40kg), Papa Blanca (20kg)', total: 'S/ 580' },
  { fecha: '2025-09-10', pedido: 1455, cliente: 'Pedro Sánchez', productos: 'Zanahoria (35kg)', total: 'S/ 210' },
  { fecha: '2025-09-12', pedido: 1456, cliente: 'Lucía Ramos', productos: 'Tomates Cherry (25kg), Lechuga Orgánica (35u)', total: 'S/ 550' },
  { fecha: '2025-09-15', pedido: 1457, cliente: 'Miguel Castillo', productos: 'Papa Blanca (60kg)', total: 'S/ 600' },
  { fecha: '2025-09-18', pedido: 1458, cliente: 'Rosa Medina', productos: 'Choclo Fresco (35kg)', total: 'S/ 280' },
];

const MOCK_CATEGORIES = [
  { label: 'Tubérculos', value: 'S/ 3,450', color: '#84cc16' },
  { label: 'Verduras', value: 'S/ 2,900', color: '#22c55e' },
  { label: 'Frutas', value: 'S/ 1,800', color: '#10b981' },
  { label: 'Granos', value: 'S/ 1,300', color: '#14b8a6' },
];

const ReportesEstadisticas = () => {
  const { showSuccess, showInfo } = useNotification();

  // Filtros
  const [period, setPeriod] = useState('30d');
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-29');
  const [category, setCategory] = useState('todas');
  const [loading, setLoading] = useState(false);

  // Gráfico principal
  const [chartPeriod, setChartPeriod] = useState('30D');

  // Métricas principales calculadas (mock + derivadas)
  const metrics = useMemo(() => ({
    ingresosTotales: 'S/ 8,450',
    pedidosCompletados: 128,
    productosVendidos: 23,
    ticketPromedio: 'S/ 66',
    compIngresos: '↑ 12.5% vs período anterior',
    compPedidos: '↑ 18% vs período anterior',
    compProductos: '↑ 5 productos vs período anterior',
    compTicket: '↓ 3.2% vs período anterior',
  }), [period, startDate, endDate, category]);

  const handleReset = () => {
    setPeriod('30d');
    setStartDate('2025-09-01');
    setEndDate('2025-09-29');
    setCategory('todas');
  };

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess('Filtros aplicados correctamente.');
    }, 700);
  };

  const handleExportPDF = () => {
    showInfo('Exportación a PDF en preparación…');
  };

  const handleExportExcel = () => {
    showSuccess('Reporte exportado a Excel.');
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
            <GraficoEvolucionVentas periodSelected={chartPeriod} onChangePeriod={setChartPeriod} loading={loading} />
          </div>
          <div>
            <TopProductos items={MOCK_TOP5} loading={loading} />
          </div>
        </div>

        {/* Sección: Ventas por Categoría */}
        <GraficoVentasPorCategoria data={MOCK_CATEGORIES} loading={loading} />

        {/* Sección adicional: Tabla de ventas detalladas */}
        <div className="mt-4">
          <TablaVentasDetallada rows={MOCK_ROWS} loading={loading} />
        </div>
      </main>

      <ToastContainerCustom />
    </div>
  );
};

export default ReportesEstadisticas;