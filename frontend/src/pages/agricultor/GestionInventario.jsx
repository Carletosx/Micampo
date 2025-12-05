import React, { useMemo, useState } from 'react';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import EncabezadoInventario from '../../components/inventario/EncabezadoInventario';
import AlertaStockCritico from '../../components/inventario/AlertaStockCritico';
import TarjetasResumenInventario from '../../components/inventario/TarjetasResumenInventario';
import TablaInventario from '../../components/inventario/TablaInventario';
import ModalActualizarStock from '../../components/inventario/ModalActualizarStock';
import ModalExportar from '../../components/inventario/ModalExportar';

const mockProductosInicial = [
  { id: 1, nombre: 'Papa Blanca', categoria: 'Tubérculos', unidad: 'kg', stockActual: 120, stockMinimo: 50, precioUnitario: 2.2, imagen: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=200&q=80' },
  { id: 2, nombre: 'Tomates Cherry', categoria: 'Frutas', unidad: 'kg', stockActual: 18, stockMinimo: 20, precioUnitario: 6.5, imagen: 'https://images.unsplash.com/photo-1546554137-5e6f2b0b75a4?w=200&q=80' },
  { id: 3, nombre: 'Lechuga Orgánica', categoria: 'Hortalizas', unidad: 'unidades', stockActual: 40, stockMinimo: 30, precioUnitario: 1.8, imagen: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=200&q=80' },
  { id: 4, nombre: 'Zanahoria', categoria: 'Hortalizas', unidad: 'kg', stockActual: 22, stockMinimo: 25, precioUnitario: 3.0, imagen: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=200&q=80' },
  { id: 5, nombre: 'Cebolla Roja', categoria: 'Hortalizas', unidad: 'kg', stockActual: 8, stockMinimo: 15, precioUnitario: 2.6, imagen: 'https://images.unsplash.com/photo-1604908176750-6a9b1f909b44?w=200&q=80' },
  { id: 6, nombre: 'Maíz Choclo', categoria: 'Granos', unidad: 'unidades', stockActual: 60, stockMinimo: 30, precioUnitario: 1.5, imagen: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=200&q=80' },
  { id: 7, nombre: 'Palta Hass', categoria: 'Frutas', unidad: 'kg', stockActual: 12, stockMinimo: 20, precioUnitario: 10.0, imagen: 'https://images.unsplash.com/photo-1604881991331-7d3f4f5e30b9?w=200&q=80' },
  { id: 8, nombre: 'Fresas', categoria: 'Frutas', unidad: 'kg', stockActual: 28, stockMinimo: 15, precioUnitario: 9.2, imagen: 'https://images.unsplash.com/photo-1439127989242-c492f64f098e?w=200&q=80' },
  { id: 9, nombre: 'Quinua', categoria: 'Granos', unidad: 'kg', stockActual: 55, stockMinimo: 20, precioUnitario: 7.0, imagen: 'https://images.unsplash.com/photo-1518674660708-3e6b8b3f4d0e?w=200&q=80' },
  { id: 10, nombre: 'Arveja', categoria: 'Legumbres', unidad: 'kg', stockActual: 18, stockMinimo: 18, precioUnitario: 5.0, imagen: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80' },
  { id: 11, nombre: 'Brócoli', categoria: 'Hortalizas', unidad: 'unidades', stockActual: 10, stockMinimo: 15, precioUnitario: 2.4, imagen: 'https://images.unsplash.com/photo-1598039013163-0f4bfa2d19f7?w=200&q=80' },
  { id: 12, nombre: 'Manzana Roja', categoria: 'Frutas', unidad: 'kg', stockActual: 75, stockMinimo: 30, precioUnitario: 6.0, imagen: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=200&q=80' },
];

const GestionInventario = () => {
  const [productos, setProductos] = useState(mockProductosInicial);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const resumen = useMemo(() => {
    const productosCount = productos.length;
    const stockBajo = productos.filter(p => {
      const margen = p.stockMinimo * 0.5;
      return p.stockActual > p.stockMinimo && p.stockActual <= p.stockMinimo + margen;
    }).length;
    const stockCritico = productos.filter(p => p.stockActual <= p.stockMinimo).length;
    const valorTotal = productos.reduce((acc, p) => acc + p.stockActual * p.precioUnitario, 0);
    return { productosCount, stockBajo, stockCritico, valorTotal };
  }, [productos]);

  const abrirActualizarStock = (producto) => {
    setProductoSeleccionado(producto);
    setIsUpdateOpen(true);
  };

  const guardarStock = (productoActualizado) => {
    setProductos(prev => prev.map(p => p.id === productoActualizado.id ? productoActualizado : p));
    setIsUpdateOpen(false);
    setProductoSeleccionado(null);
  };

  const exportarInventario = (formato) => {
    console.log('Exportar en formato:', formato);
    setIsExportOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAgricultor />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <EncabezadoInventario
          onExport={() => setIsExportOpen(true)}
          onActualizarStock={() => setIsUpdateOpen(true)}
        />

        <div className="mb-4">
          <AlertaStockCritico
            texto={`${resumen.stockCritico} productos requieren atención inmediata`}
            subtexto="Tienes productos con stock crítico que necesitan reposición"
            onVerAlertas={() => {}}
          />
        </div>

        <div className="mb-4">
          <TarjetasResumenInventario
            productos={resumen.productosCount}
            stockBajo={resumen.stockBajo}
            stockCritico={resumen.stockCritico}
            valorTotal={Math.round(resumen.valorTotal)}
          />
        </div>

        <TablaInventario
          productos={productos}
          onEditarProducto={(p) => console.log('Editar', p)}
          onActualizarStock={(p) => abrirActualizarStock(p)}
          onVerDetalles={(p) => console.log('Ver detalles', p)}
        />
      </div>

      <ModalActualizarStock
        isOpen={isUpdateOpen}
        producto={productoSeleccionado || productos[0]}
        onClose={() => { setIsUpdateOpen(false); setProductoSeleccionado(null); }}
        onSave={guardarStock}
      />

      <ModalExportar
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={exportarInventario}
      />
    </div>
  );
};

export default GestionInventario;
