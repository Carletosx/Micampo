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

import { listProducts } from '../../api/products';
import { getInventario } from '../../api/inventory';

const DashboardAgricultor = () => {
  const { user } = useContext(AuthContext);
  const nombreAgricultor = (user?.displayName || (user?.email || '').split('@')[0] || '').split(' ')[0];

  const [stats, setStats] = useState({
    publicados: 0,
    nuevosSemana: 0,
    pedidosMes: 0,
    incrementoPedidos: 0,
    ingresosMes: 'S/ 0',
    incrementoIngresos: 0,
    calificacion: 0,
    reseñas: 0,
  });
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Cargar productos
        const productsResult = await listProducts({ size: 100 });
        console.log('📦 Productos result:', productsResult);
        if (productsResult.ok && productsResult.data) {
          const totalProductos = productsResult.data.length;
          console.log('✅ Total productos:', totalProductos);
          
          // Cargar inventarios para alertas (con fallback y tipos seguros)
          const productosConInventario = await Promise.all(
            productsResult.data.map(async (producto) => {
              try {
                const invResult = await getInventario(producto.id);
                if (invResult.ok && invResult.data) {
                  // Normalizar valores y usar fallback si falta stockMinimo en inventario
                  const stockActual = Number(invResult.data.stockActual ?? producto.stock ?? 0);
                  const stockMinimo = Number(invResult.data.stockMinimo ?? producto.stockMin ?? 0);
                  const estado = (typeof stockActual === 'number' && typeof stockMinimo === 'number')
                    ? (stockActual <= stockMinimo ? 'critico' : (stockActual <= Math.ceil(stockMinimo * 1.5) ? 'bajo' : 'disponible'))
                    : 'disponible';

                  return {
                    ...producto,
                    stockActual,
                    stockMinimo,
                    estado
                  };
                }
              } catch (e) {
                console.log(`Error cargando inventario para ${producto.id}:`, e);
              }

              // Fallback si no hay inventario
              const stockActualFallback = Number(producto.stock ?? 0);
              const stockMinimoFallback = Number(producto.stockMin ?? 0);
              return {
                ...producto,
                stockActual: stockActualFallback,
                stockMinimo: stockMinimoFallback,
                estado: stockActualFallback <= stockMinimoFallback ? 'critico' : (stockActualFallback <= Math.ceil(stockMinimoFallback * 1.5) ? 'bajo' : 'disponible')
              };
            })
          );

          console.log('📊 Productos con inventario (normalizado):', productosConInventario);

          // Filtrar alertas (productos con stock bajo o crítico)
          const productosAlerta = productosConInventario
            .filter(p => p && p.estado && (p.estado === 'bajo' || p.estado === 'critico'))
            .sort((a, b) => {
              const prioridad = { critico: 2, bajo: 1, disponible: 0 };
              return (prioridad[b.estado] || 0) - (prioridad[a.estado] || 0);
            })
            .slice(0, 5);

          console.log('🚨 Alertas detectadas:', productosAlerta);
          setAlertas(productosAlerta);
          setStats(prev => ({
            ...prev,
            publicados: totalProductos,
            nuevosSemana: 3, // Placeholder - se podría calcular desde fecha de creación
          }));
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-600">Cargando estadísticas...</div>
            </div>
          ) : (
            <TarjetasEstadisticas data={stats} />
          )}
        </div>

        {/* Gráfico de ventas (placeholder) */}
        <div className="mt-6">
          <GraficoVentas />
        </div>

        {/* Layout principal + sidebar derecho */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pedidos Recientes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <PedidosRecientes />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <AlertasInventario alertas={alertas} />
            <ProductosMasVendidos />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAgricultor;
