import React from 'react';
import { FaCamera, FaUser, FaCreditCard, FaBell, FaLock, FaStar } from 'react-icons/fa';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border ${active ? 'bg-green-50 text-green-700 border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
  >
    <Icon className={active ? 'text-green-700' : 'text-gray-600'} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const SidebarPerfil = ({
  initials = 'JP',
  name = 'Juan Pérez',
  email = 'juan.perez@email.com',
  rating = 4.8,
  sales = 156,
  activeTab = 'personal',
  onChangeTab,
  onEditPhoto,
}) => {
  const items = [
    { key: 'personal', label: 'Información Personal', icon: FaUser },
    { key: 'pagos', label: 'Métodos de Pago', icon: FaCreditCard },
    { key: 'notificaciones', label: 'Notificaciones', icon: FaBell },
    { key: 'seguridad', label: 'Seguridad', icon: FaLock },
  ];

  return (
    <aside className="lg:sticky lg:top-24 space-y-4">
      {/* Card perfil */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative w-24 h-24 mx-auto">
          <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
          <button
            onClick={onEditPhoto}
            className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-50"
            aria-label="Editar foto"
            title="Editar foto"
          >
            <FaCamera className="text-gray-700" />
          </button>
        </div>
        <div className="text-center mt-3">
          <h3 className="text-gray-900 font-semibold">{name}</h3>
          <p className="text-gray-600 text-sm">{email}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-green-700">
              <FaStar />
              <span className="font-semibold">{rating}</span>
            </div>
            <p className="text-xs text-gray-600">Calificación</p>
          </div>
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-center">
            <div className="text-green-700 font-semibold">{sales}</div>
            <p className="text-xs text-gray-600">Ventas</p>
          </div>
        </div>
      </div>

      {/* Navegación vertical (desktop) */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm p-4 border border-gray-100 space-y-2">
        {items.map(it => (
          <NavItem key={it.key} icon={it.icon} label={it.label} active={activeTab === it.key} onClick={() => onChangeTab(it.key)} />
        ))}
      </div>

      {/* Tabs horizontales (mobile) */}
      <div className="lg:hidden bg-white rounded-xl shadow-sm p-2 border border-gray-100 flex items-center justify-between">
        {items.map(it => (
          <button
            key={it.key}
            onClick={() => onChangeTab(it.key)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-sm ${activeTab === it.key ? 'bg-green-50 text-green-700 border border-green-600' : 'text-gray-700 border border-transparent'}`}
          >
            <it.icon />
            <span>{it.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default React.memo(SidebarPerfil);