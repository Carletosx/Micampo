import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import EncabezadoInventario from '../../components/inventario/EncabezadoInventario';
import AlertaStockCritico from '../../components/inventario/AlertaStockCritico';
import TarjetasResumenInventario from '../../components/inventario/TarjetasResumenInventario';
import TablaInventario from '../../components/inventario/TablaInventario';
import ModalActualizarStock from '../../components/inventario/ModalActualizarStock';
import ModalExportar from '../../components/inventario/ModalExportar';
import ModalCrearMovimiento from '../../components/inventario/ModalCrearMovimiento';
import ModalReservarStock from '../../components/inventario/ModalReservarStock';
import ModalConfirmarVenta from '../../components/inventario/ModalConfirmarVenta';
import { listProducts } from '../../api/products';
import { getInventario, actualizarInventario } from '../../api/inventory';
import { NotificationContext } from '../../contexts/NotificationContext';
import ModalVerProducto from '../../components/inventario/ModalVerProducto';

const GestionInventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isMovimientoOpen, setIsMovimientoOpen] = useState(false);
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [isConfirmacionOpen, setIsConfirmacionOpen] = useState(false);
  const [isVerOpen, setIsVerOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const { showSuccess, showError } = useContext(NotificationContext) || { showSuccess: () => {}, showError: () => {} };
  const navigate = useNavigate();

  // Cargar productos y sus inventarios
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const result = await listProducts({ size: 100 });
        if (result.ok && result.data) {
          // Para cada producto, obtener su inventario
          const productosConInventario = await Promise.all(
            result.data.map(async (producto) => {
              try {
                const invResult = await getInventario(producto.id);
                if (invResult.ok && invResult.data) {
                  // Si existe inventario en BD, usar esos valores exactos
                  return {
                    ...producto,
                    stockActual: invResult.data.stockActual || 0,
                    stockMinimo: invResult.data.stockMinimo || 0,
                    stockReservado: invResult.data.stockReservado || 0,
                  };
                }
              } catch (e) {
                console.log(`No hay inventario para producto ${producto.id}`);
              }
             
              return {
                ...producto,
                stockActual: producto.stock || 0,
                stockMinimo: producto.stockMin || 0, // usamos el stockmin del producto
                stockReservado: 0,
              };
            })
          );
          setProductos(productosConInventario);
          setError(null);
        } else {
          setError('No se pudo cargar los productos');
          showError('Error al cargar productos');
        }
      } catch (err) {
        setError(err.message);
        showError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  const resumen = useMemo(() => {
    const productosCount = productos.length;
    const stockBajo = productos.filter(p => {
      const margen = p.stockMinimo * 0.5;
      return p.stockActual > p.stockMinimo && p.stockActual <= p.stockMinimo + margen;
    }).length;
    const stockCritico = productos.filter(p => p.stockActual <= p.stockMinimo).length;
    const precio = (p) => p.precio || p.precioUnitario || 0;
    const valorTotal = productos.reduce((acc, p) => acc + p.stockActual * precio(p), 0);
    return { productosCount, stockBajo, stockCritico, valorTotal };
  }, [productos]);

  const guardarStock = async (productoActualizado) => {
    try {
      const result = await actualizarInventario(
        productoActualizado.id,
        productoActualizado.stockActual,
        productoActualizado.stockMinimo
      );
      
      if (result.ok) {
        showSuccess('Stock actualizado correctamente');
        await recargarProductos();
      } else if (result.unauthorized) {
        showError('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else {
        showError('Error al actualizar el stock');
      }
    } catch (err) {
      showError('Error de conexión');
    } finally {
      setIsUpdateOpen(false);
      setProductoSeleccionado(null);
    }
  };

  const abrirActualizarStock = (producto) => {
    setProductoSeleccionado(producto);
    setIsUpdateOpen(true);
  };

  const abrirCrearMovimiento = (producto) => {
    setProductoSeleccionado(producto);
    setIsMovimientoOpen(true);
  };

  const abrirReservarStock = (producto) => {
    setProductoSeleccionado(producto);
    setIsReservaOpen(true);
  };

  const abrirConfirmarVenta = (producto) => {
    setProductoSeleccionado(producto);
    setIsConfirmacionOpen(true);
  };

  const abrirDetalles = (producto) => {
    setProductoSeleccionado(producto);
    setIsVerOpen(true);
  };

  const editarProducto = (producto) => {
    if (producto?.id != null) navigate(`/agricultor/productos?editId=${producto.id}`);
    else navigate('/agricultor/productos');
  };

  const recargarProductos = async () => {
    const result = await listProducts({ size: 100 });
    if (result.ok && result.data) {
      const productosConInventario = await Promise.all(
        result.data.map(async (producto) => {
          try {
            const invResult = await getInventario(producto.id);
            if (invResult.ok && invResult.data) {
              return {
                ...producto,
                stockActual: invResult.data.stockActual || 0,
                stockMinimo: invResult.data.stockMinimo || 0,
                stockReservado: invResult.data.stockReservado || 0,
              };
            }
          } catch (e) {
            console.log(`No hay inventario para producto ${producto.id}`);
          }
          return {
            ...producto,
            stockActual: producto.stock || 0,
            stockMinimo: producto.stockMin || 0,
            stockReservado: 0,
          };
        })
      );
      setProductos(productosConInventario);
    }
  };

  const exportarInventario = (formato) => {
    if (productos.length === 0) {
      showError('No hay productos para exportar');
      return;
    }
    
    let contenido = '';
    if (formato === 'csv') {
      contenido = 'Nombre,Categoría,Stock Actual,Stock Mínimo,Precio Unitario,Valor Total\n';
      productos.forEach(p => {
        const precio = p.precio || p.precioUnitario || 0;
        const valorTotal = p.stockActual * precio;
        contenido += `"${p.nombre}","${p.categoria}",${p.stockActual},${p.stockMinimo},${precio},${valorTotal}\n`;
      });
    } else if (formato === 'json') {
      contenido = JSON.stringify(productos, null, 2);
    }
    
    const blob = new Blob([contenido], { type: formato === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario.${formato}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess(`Inventario exportado en formato ${formato.toUpperCase()}`);
    setIsExportOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAgricultor />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <EncabezadoInventario
          onExport={() => setIsExportOpen(true)}
          onActualizarStock={() => {}}
        />

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Cargando inventario...</div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!loading && productos.length > 0 && (
          <>
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
              onEditarProducto={(p) => editarProducto(p)}
              onActualizarStock={(p) => abrirActualizarStock(p)}
              onVerDetalles={(p) => abrirDetalles(p)}
              onCrearMovimiento={(p) => abrirCrearMovimiento(p)}
              onReservarStock={(p) => abrirReservarStock(p)}
              onConfirmarVenta={(p) => abrirConfirmarVenta(p)}
            />
          </>
        )}

        {!loading && productos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tienes productos creados aún</p>
            <p className="text-gray-400 mt-2">Crea un producto primero para gestionar su inventario</p>
          </div>
        )}
      </div>

      {productoSeleccionado && (
        <ModalActualizarStock
          isOpen={isUpdateOpen}
          producto={productoSeleccionado}
          onClose={() => { setIsUpdateOpen(false); setProductoSeleccionado(null); }}
          onSave={guardarStock}
        />
      )}

      <ModalExportar
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={exportarInventario}
      />

      <ModalCrearMovimiento
        isOpen={isMovimientoOpen}
        producto={productoSeleccionado}
        onClose={() => { setIsMovimientoOpen(false); setProductoSeleccionado(null); }}
        onSave={recargarProductos}
      />

      <ModalReservarStock
        isOpen={isReservaOpen}
        producto={productoSeleccionado}
        onClose={() => { setIsReservaOpen(false); setProductoSeleccionado(null); }}
        onSave={recargarProductos}
      />

      <ModalConfirmarVenta
        isOpen={isConfirmacionOpen}
        producto={productoSeleccionado}
        onClose={() => { setIsConfirmacionOpen(false); setProductoSeleccionado(null); }}
        onSave={recargarProductos}
      />

      <ModalVerProducto
        isOpen={isVerOpen}
        producto={productoSeleccionado}
        onClose={() => { setIsVerOpen(false); setProductoSeleccionado(null); }}
      />
    </div>
  );
};

export default GestionInventario;
