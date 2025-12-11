import React from 'react';
import { listDirecciones } from '../../api/users.js'

const DireccionCard = ({ id, titulo, direccion, referencia, telefono, selected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`w-full text-left border rounded-md p-4 mb-3 hover:bg-gray-50 ${selected === id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-gray-900">{titulo}</h3>
      {selected === id && <span className="text-xs text-green-600">Seleccionado</span>}
    </div>
    <p className="text-sm text-gray-600 mt-1">{direccion}</p>
    {referencia && <p className="text-sm text-gray-500">{referencia}</p>}
    {telefono && <p className="text-sm text-gray-500">{telefono}</p>}
  </button>
);

const SeccionDireccion = ({ selected, onSelect }) => {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState([])
  React.useEffect(() => {
    const load = async () => {
      const r = await listDirecciones()
      if (r.ok && Array.isArray(r.data)) setItems(r.data)
      setLoading(false)
    }
    load()
  }, [])
  const formatDireccion = (d) => {
    const parts = [d.linea1, d.linea2, d.distrito, d.provincia, d.departamento].filter(Boolean)
    return parts.join(', ')
  }
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Dirección de Entrega</h2>
        <a href="/comprador/direcciones" className="text-sm text-green-600 hover:text-green-700">+ Nueva Dirección</a>
      </div>
      {loading ? (
        <div className="text-sm text-gray-600">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">Aún no has agregado direcciones. Crea una nueva en tu perfil.</div>
      ) : (
        items.map(d => (
          <DireccionCard key={d.id} id={String(d.id)} titulo={(d.tipo || '')} direccion={formatDireccion(d)} referencia={d.referencia || ''} telefono={''} selected={selected} onSelect={onSelect} />
        ))
      )}
    </section>
  );
};

export default SeccionDireccion;
