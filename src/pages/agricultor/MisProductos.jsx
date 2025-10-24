import React, { useMemo, useState } from 'react';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor.jsx';
import EncabezadoProductos from '../../components/productos/EncabezadoProductos.jsx';
import BarraBusquedaFiltros from '../../components/productos/BarraBusquedaFiltros.jsx';
import TarjetasResumenProductos from '../../components/productos/TarjetasResumenProductos.jsx';
import TarjetaProducto from '../../components/productos/TarjetaProducto.jsx';
import ModalNuevoProducto from '../../components/productos/ModalNuevoProducto.jsx';
import ModalEliminarProducto from '../../components/productos/ModalEliminarProducto.jsx';

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
  const [productos, setProductos] = useState(mockProductosInicial);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoEliminando, setProductoEliminando] = useState(null);

  const categoriasOptions = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return Array.from(set);
  }, [productos]);

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

  const pausarProducto = (p) => {
    const ok = window.confirm('¿Deseas pausar este producto?');
    if (!ok) return;
    setProductos((prev) => prev.map((it) => (it.id === p.id ? { ...it, estado: 'inactivo' } : it)));
  };

  const cerrarModales = () => { setModalNuevoAbierto(false); setProductoEditando(null); setProductoEliminando(null); };

  const guardarProducto = (payload) => {
    if (productoEditando) {
      setProductos((prev) => prev.map((p) => (p.id === productoEditando.id ? { ...p, ...payload } : p)));
    } else {
      const nuevo = { id: Date.now(), ...payload };
      setProductos((prev) => [nuevo, ...prev]);
    }
    setModalNuevoAbierto(false); setProductoEditando(null);
  };

  const eliminarProducto = (p) => {
    setProductos((prev) => prev.filter((it) => it.id !== p.id));
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
          {productosFiltrados.map((p) => (
            <TarjetaProducto
              key={p.id}
              producto={p}
              onEditar={abrirEditar}
              onPausar={pausarProducto}
              onEliminar={confirmarEliminar}
            />
          ))}
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
    </div>
  );
}