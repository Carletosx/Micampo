import React, { useState, useEffect } from 'react';
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

const PerfilConfiguracion = () => {
  const { showSuccess } = useNotification();
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

  const handleSavePhoto = (file) => {
    if (file) {
      showSuccess('Foto actualizada correctamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAgricultor />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EncabezadoPerfil />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SidebarPerfil
              initials="JP"
              name="Juan Pérez"
              email="juan.perez@email.com"
              rating={4.8}
              sales={156}
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