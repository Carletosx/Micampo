import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import NavbarAgricultor from '../../components/layout/NavbarAgricultor';
import EncabezadoPerfil from '../../components/perfil/EncabezadoPerfil';
import SidebarPerfil from '../../components/perfil/SidebarPerfil';
import SeccionInformacionPersonal from '../../components/perfil/SeccionInformacionPersonal';
import SeccionInformacionFinca from '../../components/perfil/SeccionInformacionFinca';
import SeccionMetodosPago from '../../components/perfil/SeccionMetodosPago';
import SeccionNotificaciones from '../../components/perfil/SeccionNotificaciones';
import SeccionSeguridad from '../../components/perfil/SeccionSeguridad';
import ModalCambiarFoto from '../../components/perfil/ModalCambiarFoto';
import ToastContainerCustom from '../../components/notifications/ToastContainer';
import { useNotification } from '../../contexts/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import API_BASE, { API_ORIGIN } from '../../api/config.js';
import { updatePerfil } from '../../api/users.js';

const PerfilConfiguracion = () => {
  const { showSuccess } = useNotification();
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('personal');
  const [photoModal, setPhotoModal] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    const allowed = ['personal', 'pagos', 'notificaciones', 'seguridad'];
    if (tab && allowed.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSavePhoto = async (file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/files/upload`, { method: 'POST', body: fd });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.url) {
      const { ok } = await updatePerfil({ avatarUrl: data.url });
      if (ok) showSuccess('Foto actualizada correctamente.');
    }
  };

  const nombre = user?.displayName || (user?.email || '').split('@')[0];
  const rolLegible = user?.role === 'AGRICULTOR' ? 'Agricultor' : (user?.role || 'Usuario');
  const email = user?.email || '';
  const initials = (nombre || 'U').split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const rating = 0;
  const sales = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor nombre={nombre} rol={rolLegible} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EncabezadoPerfil />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarPerfil
              initials={initials}
              name={nombre}
              email={email}
              rating={rating}
              sales={sales}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              onEditPhoto={() => setPhotoModal(true)}
            />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'personal' && (
              <>
                <SeccionInformacionPersonal />
                <SeccionInformacionFinca />
              </>
            )}
            {activeTab === 'pagos' && <SeccionMetodosPago />}
            {activeTab === 'notificaciones' && <SeccionNotificaciones />}
            {activeTab === 'seguridad' && <SeccionSeguridad />}
          </div>
        </div>
      </main>

      {/* Modales */}
      <ModalCambiarFoto isOpen={photoModal} onClose={() => setPhotoModal(false)} onSave={handleSavePhoto} />
      <ToastContainerCustom />
    </div>
  );
};

export default PerfilConfiguracion;
