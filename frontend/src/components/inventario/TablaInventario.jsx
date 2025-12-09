import React, { useMemo, useState } from 'react';
import { FaSearch, FaSortUp, FaSortDown } from 'react-icons/fa';
import FilasProductoInventario from './FilasProductoInventario';

const calcularEstado = (producto) => {
  const stockActual = producto.stockActual || 0;
  const stockMinimo = producto.stockMinimo || 0;
  const margen = Math.max(stockMinimo * 0.5, 1); // 50% por encima del mínimo
  if (stockActual <= stockMinimo) return 'critico';
  if (stockActual <= stockMinimo + margen) return 'bajo';
  return 'disponible';
};

const TablaInventario = ({
  productos,
  onEditarProducto,
  onActualizarStock,
  onVerDetalles,
  onCrearMovimiento,
  onReservarStock,
  onConfirmarVenta,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortDir, setSortDir] = useState('asc');
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [pagina, setPagina] = useState(1);

  const categorias = useMemo(() => {
    const set = new Set(productos.map(p => p.categoria));
    return Array.from(set);
  }, [productos]);

  const productosDecorados = useMemo(() => {
    return productos.map(p => ({ ...p, estado: calcularEstado(p) }));
  }, [productos]);

  const filtrados = useMemo(() => {
    return productosDecorados.filter(p => {
      const matchNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === 'todos' ? true : p.estado === filtroEstado;
      const matchCategoria = filtroCategoria === 'todas' ? true : p.categoria === filtroCategoria;
      return matchNombre && matchEstado && matchCategoria;
    });
  }, [productosDecorados, busqueda, filtroEstado, filtroCategoria]);

  const ordenados = useMemo(() => {
    const arr = [...filtrados];
    arr.sort((a, b) => {
      let A = a[sortBy];
      let B = b[sortBy];
      if (sortBy === 'valorTotal') {
        const precioA = a.precio || a.precioUnitario || 0;
        const precioB = b.precio || b.precioUnitario || 0;
        A = a.stockActual * precioA;
        B = b.stockActual * precioB;
      }
      if (typeof A === 'string') {
        A = A.toLowerCase();
        B = B.toLowerCase();
      }
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtrados, sortBy, sortDir]);

  const totalPaginas = Math.max(1, Math.ceil(ordenados.length / itemsPorPagina));
  const paginaAjustada = Math.min(pagina, totalPaginas);
  const inicio = (paginaAjustada - 1) * itemsPorPagina;
  const visibles = ordenados.slice(inicio, inicio + itemsPorPagina);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => sortBy === col ? (sortDir === 'asc' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
            className="pl-9 pr-3 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPagina(1); }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="todos">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="bajo">Stock Bajo</option>
            <option value="critico">Stock Crítico</option>
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => { setFiltroCategoria(e.target.value); setPagina(1); }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={itemsPorPagina}
            onChange={(e) => { setItemsPorPagina(Number(e.target.value)); setPagina(1); }}
            className="px-3 py-2 border rounded-md"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Imagen</th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('nombre')}>
                Nombre <SortIcon col="nombre" />
              </th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('categoria')}>
                Categoría <SortIcon col="categoria" />
              </th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('stockActual')}>
                Stock Actual <SortIcon col="stockActual" />
              </th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('stockMinimo')}>
                Stock Mínimo <SortIcon col="stockMinimo" />
              </th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('precioUnitario')}>
                Precio Unitario <SortIcon col="precioUnitario" />
              </th>
              <th className="px-3 py-2 text-left cursor-pointer" onClick={() => toggleSort('valorTotal')}>
                Valor Total <SortIcon col="valorTotal" />
              </th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map(p => (
              <FilasProductoInventario
                key={p.id}
                producto={p}
                estado={p.estado}
                onEditar={onEditarProducto}
                onActualizarStock={onActualizarStock}
                onVerDetalles={onVerDetalles}
                onCrearMovimiento={onCrearMovimiento}
                onReservarStock={onReservarStock}
                onConfirmarVenta={onConfirmarVenta}
              />
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="9" className="px-3 py-6 text-center text-gray-500">No hay productos para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Mostrando {visibles.length} de {ordenados.length} productos
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            disabled={paginaAjustada === 1}
            onClick={() => setPagina(p => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span className="px-2">Página {paginaAjustada} de {totalPaginas}</span>
          <button
            className="px-3 py-1 border rounded-md disabled:opacity-50"
            disabled={paginaAjustada >= totalPaginas}
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaInventario;