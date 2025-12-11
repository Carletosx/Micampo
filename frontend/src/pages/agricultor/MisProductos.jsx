import React, { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes/paths.js';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor.jsx';
import EncabezadoProductos from '../../components/productos/EncabezadoProductos.jsx';
import BarraBusquedaFiltros from '../../components/productos/BarraBusquedaFiltros.jsx';
import TarjetasResumenProductos from '../../components/productos/TarjetasResumenProductos.jsx';
import TarjetaProducto from '../../components/productos/TarjetaProducto.jsx';
import ModalNuevoProducto from '../../components/productos/ModalNuevoProducto.jsx';
import ModalEliminarProducto from '../../components/productos/ModalEliminarProducto.jsx';
import ModalDetalleProducto from '../../components/productos/ModalDetalleProducto.jsx';
import ConfirmModal from '../../components/ui/ConfirmModal.jsx';
import { listProducts, createProduct, updateProduct, deleteProduct, pauseProduct, activateProduct } from '../../api/products.js';
import { inicializarInventario } from '../../api/inventory.js';
import { NotificationContext } from '../../contexts/NotificationContext';

const mockProductosInicial = [
  { id: 1, nombre: 'Papa Blanca Premium', categoria: 'Tubérculos', estado: 'activo', descripcion: 'Papa blanca de primera calidad, cultivada orgánicamente en los Andes peruanos', precio: 2.5, unidad: 'kg', stock: 150, stockMin: 50, imagen: '' },
  { id: 2, nombre: 'Tomates Cherry Orgánicos', categoria: 'Verduras', estado: 'activo', descripcion: 'Tomates cherry frescos, dulces y jugosos, perfectos para ensaladas', precio: 6.0, unidad: 'kg', stock: 12, stockMin: 20, imagen: '' },
  { id: 3, nombre: 'Lechuga Hidropónica', categoria: 'Verduras', estado: 'activo', descripcion: 'Lechuga fresca de cultivo hidropónico, crujiente y lista para consumir', precio: 3.0, unidad: 'unidad', stock: 8, stockMin: 10, imagen: '' },
  { id: 4, nombre: 'Choclo Fresco', categoria: 'Granos', estado: 'activo', descripcion: 'Choclo tierno y dulce, ideal para humitas y sopas', precio: 1.8, unidad: 'unidad', stock: 80, stockMin: 30, imagen: '' },
  { id: 5, nombre: 'Zanahoria Orgánica', categoria: 'Verduras', estado: 'inactivo', descripcion: 'Zanahoria dulce y crocante, libre de pesticidas', precio: 2.2, unidad: 'kg', stock: 0, stockMin: 10, imagen: '' },
  { id: 6, nombre: 'Manzana Roja', categoria: 'Frutas', estado: 'activo', descripcion: 'Manzana fresca y jugosa, cosechada en temporada', precio: 5.5, unidad: 'kg', stock: 40, stockMin: 20, imagen: '' },
  { id: 7, nombre: 'Plátano Orgánico', categoria: 'Frutas', estado: 'activo', descripcion: 'Plátano dulce y maduro, ideal para snacks saludables', precio: 4.0, unidad: 'kg', stock: 60, stockMin: 25, imagen: '' },
  { id: 8, nombre: 'Quinoa Andina', categoria: 'Granos', estado: 'activo', descripcion: 'Quinoa de altura, rica en proteínas y fibra', precio: 9.0, unidad: 'kg', stock: 25, stockMin: 15, imagen: '' },
  { id: 9, nombre: 'Palta Hass', categoria: 'Frutas', estado: 'activo', descripcion: 'Palta cremosa y sabrosa, perfecta para tostadas y ensaladas', precio: 12.0, unidad: 'kg', stock: 10, stockMin: 12, imagen: '' },
  { id: 10, nombre: 'Papa Nativa', categoria: 'Tubérculos', estado: 'activo', descripcion: 'Variedad andina con alto valor nutricional y gran sabor', precio: 3.2, unidad: 'kg', stock: 90, stockMin: 40, imagen: '' },
];

export default function MisProductos() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({ number: 0, size: 30, totalPages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoEliminando, setProductoEliminando] = useState(null);
  const [productoDetalleAbierto, setProductoDetalleAbierto] = useState(null);
  const [productoPausando, setProductoPausando] = useState(null);

  const categoriasOptions = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return Array.from(set);
  }, [productos]);

  const cargarPagina = async (page = 0) => {
    setLoading(true);
    const { ok, data, unauthorized, page: pInfo } = await listProducts({ includeInactive: 'true', page, size: pageInfo.size });
    if (unauthorized) {
      addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
      navigate(ROUTES.LOGIN);
    } else if (ok && Array.isArray(data)) {
      const normalized = data.map((p) => ({ ...p, estado: p.activo ? 'activo' : 'inactivo' }));
      setProductos(normalized);
      if (pInfo) setPageInfo(pInfo);
    } else {
      addNotification('No se pudo cargar productos', 'error');
    }
    setLoading(false);
  };

  useEffect(() => { cargarPagina(0); }, []);

  const esStockBajo = (p) => p.stockMin > 0 && p.stock <= p.stockMin;

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchNombre = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategoria = categoryFilter === 'todas' || p.categoria === categoryFilter;
      const matchEstado =
        statusFilter === 'todos' ||
        (statusFilter === 'activo' && p.estado === 'activo') ||
        (statusFilter === 'inactivo' && p.estado === 'inactivo') ||
        (statusFilter === 'stock_bajo' && esStockBajo(p));
      return matchNombre && matchCategoria && matchEstado;
    });
  }, [productos, searchQuery, categoryFilter, statusFilter]);

  const total = productos.length;
  const activos = productos.filter((p) => p.estado === 'activo').length;
  const inactivos = productos.filter((p) => p.estado === 'inactivo').length;
  const stockBajo = productos.filter(esStockBajo).length;

  const abrirNuevo = () => { setProductoEditando(null); setModalNuevoAbierto(true); };
  const abrirEditar = (p) => { setProductoEditando(p); setModalNuevoAbierto(true); };
  const confirmarEliminar = (p) => setProductoEliminando(p);

  const pausarProducto = (p) => setProductoPausando(p);
  const confirmarPausa = async () => {
    if (!productoPausando) return;
    const { ok: okApi, unauthorized } = await pauseProduct(productoPausando.id);
    if (unauthorized) {
      addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
      navigate(ROUTES.LOGIN);
      return;
    }
    if (okApi) {
      setProductos((prev) => prev.map((it) => (it.id === productoPausando.id ? { ...it, estado: 'inactivo', activo: false } : it)));
      addNotification('Producto pausado', 'success');
    } else addNotification('No se pudo pausar el producto', 'error');
    setProductoPausando(null);
  };

  const cerrarModales = () => { setModalNuevoAbierto(false); setProductoEditando(null); setProductoEliminando(null); };

  const guardarProducto = async (payload) => {
    if (productoEditando) {
      const { ok, unauthorized } = await updateProduct(productoEditando.id, payload);
      if (unauthorized) {
        addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
        navigate(ROUTES.LOGIN);
      } else if (ok) {
        setProductos((prev) => prev.map((p) => (p.id === productoEditando.id ? { ...p, ...payload } : p)));
        addNotification('Producto actualizado', 'success');
      } else addNotification('No se pudo actualizar el producto', 'error');
    } else {
      const { ok, data, unauthorized } = await createProduct(payload);
      if (unauthorized) {
        addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
        navigate(ROUTES.LOGIN);
      } else if (ok) {
        const nuevo = data || { id: Date.now(), ...payload };
        
        // Inicializar inventario automáticamente con los valores del producto
        const stockInicial = Number(payload.stock) || 0;
        let stockMinimo = Number(payload.stockMin) || 0;
        
        // Si no ingresó stockMin, calcular 20% del stock
        if (stockMinimo === 0 || isNaN(stockMinimo)) {
          stockMinimo = Math.max(Math.ceil(stockInicial * 0.2), 5);
        }
        
        const invResult = await inicializarInventario(nuevo.id, stockInicial, stockMinimo);
        if (!invResult.ok) {
          addNotification('Producto creado pero no se pudo inicializar el inventario', 'warning');
        }
        
        setProductos((prev) => [nuevo, ...prev]);
        addNotification('Producto creado', 'success');
      } else addNotification('No se pudo crear el producto', 'error');
    }
    setModalNuevoAbierto(false); setProductoEditando(null);
  };

  const eliminarProducto = async (p) => {
    const { ok, unauthorized } = await deleteProduct(p.id);
    if (unauthorized) {
      addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
      navigate(ROUTES.LOGIN);
    } else if (ok) {
      setProductos((prev) => prev.filter((it) => it.id !== p.id));
      addNotification('Producto eliminado', 'success');
    } else addNotification('No se pudo eliminar el producto', 'error');
    setProductoEliminando(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <EncabezadoProductos />
        <BarraBusquedaFiltros
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          categoriasOptions={categoriasOptions}
          onNuevoProducto={abrirNuevo}
        />

        <TarjetasResumenProductos total={total} activos={activos} stockBajo={stockBajo} inactivos={inactivos} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (<div className="col-span-full text-center text-gray-500">Cargando productos...</div>) : productosFiltrados.map((p) => (
            <TarjetaProducto
              key={p.id}
              producto={p}
              onEditar={abrirEditar}
              onPausar={pausarProducto}
              onActivar={async (prod) => {
                const { ok: okApi, unauthorized } = await activateProduct(prod.id)
                if (unauthorized) {
                  addNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'error');
                  navigate(ROUTES.LOGIN);
                  return;
                }
                if (okApi) {
                  setProductos((prev) => prev.map((it) => (it.id === prod.id ? { ...it, estado: 'activo', activo: true } : it)))
                  addNotification('Producto activado', 'success')
                } else addNotification('No se pudo activar el producto', 'error')
              }}
              onEliminar={confirmarEliminar}
              onDetalles={(prod) => setProductoDetalleAbierto(prod)}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Página {pageInfo.number + 1} de {pageInfo.totalPages}</div>
          <div className="flex gap-2">
            <button disabled={pageInfo.number === 0} onClick={() => cargarPagina(pageInfo.number - 1)} className="px-3 py-2 text-sm rounded border border-gray-300 disabled:opacity-50">Anterior</button>
            <button disabled={pageInfo.number + 1 >= pageInfo.totalPages} onClick={() => cargarPagina(pageInfo.number + 1)} className="px-3 py-2 text-sm rounded border border-gray-300 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>

      <ModalNuevoProducto
        isOpen={modalNuevoAbierto}
        producto={productoEditando}
        onClose={cerrarModales}
        onSave={guardarProducto}
      />

      <ModalEliminarProducto
        isOpen={!!productoEliminando}
        producto={productoEliminando}
        onClose={() => setProductoEliminando(null)}
        onConfirm={eliminarProducto}
      />

      <ModalDetalleProducto
        isOpen={!!productoDetalleAbierto}
        producto={productoDetalleAbierto}
        onClose={() => setProductoDetalleAbierto(null)}
        notify={addNotification}
        onSaved={() => {}}
      />

      <ConfirmModal
        isOpen={!!productoPausando}
        title="Pausar producto"
        message={`¿Deseas pausar "${productoPausando?.nombre || ''}"?`}
        confirmText="Pausar"
        onCancel={() => setProductoPausando(null)}
        onConfirm={confirmarPausa}
      />
    </div>
  );
}
