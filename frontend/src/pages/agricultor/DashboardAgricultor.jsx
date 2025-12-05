import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import BannerBienvenida from '../../components/dashboard/BannerBienvenida';
import TarjetasEstadisticas from '../../components/dashboard/TarjetasEstadisticas';
import GraficoVentas from '../../components/dashboard/GraficoVentas';
import AlertasInventario from '../../components/dashboard/AlertasInventario';
import PedidosRecientes from '../../components/dashboard/PedidosRecientes';
import ProductosMasVendidos from '../../components/dashboard/ProductosMasVendidos';

const DashboardAgricultor = () => {
  const nombreAgricultor = 'Juan';
  const nombrePerfil = 'Juan Pérez - Agricultor';

  return (
    <>
      <NavbarAgricultor nombre={"Juan Pérez"} rol={"Agricultor"} />
      <div className="container mx-auto px-4 py-6">
        {/* Banner de bienvenida */}
        <BannerBienvenida nombre={nombreAgricultor} />

        {/* Tarjetas de estadísticas */}
        <div className="mt-6">
          <TarjetasEstadisticas
            data={{
              publicados: 45,
              nuevosSemana: 3,
              pedidosMes: 128,
              incrementoPedidos: 18,
              ingresosMes: 'S/ 8,450',
              incrementoIngresos: 12,
              calificacion: 4.8,
              reseñas: 156,
            }}
          />
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
            <AlertasInventario />
            <ProductosMasVendidos />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAgricultor;