import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Añadir una nueva notificación (acepta objeto o message+type)
  const addNotification = useCallback((notification, type) => {
    const id = Date.now();

    let newNotification;
    if (typeof notification === 'string') {
      newNotification = {
        id,
        type: type || 'info',
        message: notification,
        timestamp: new Date()
      };
    } else {
      newNotification = {
        id,
        ...notification,
        timestamp: new Date()
      };
    }

    setNotifications(prev => [...prev, newNotification]);

    try {
      const msg = newNotification.message || (typeof notification === 'string' ? notification : '');
      const t = (newNotification.type || type || 'info').toLowerCase();
      const autoClose = (typeof notification === 'object' && notification?.duration) ? notification.duration : newNotification.duration || 3000;
      const opts = { autoClose, closeOnClick: true, pauseOnHover: true, hideProgressBar: false };
      if (msg) {
        if (t === 'success') toast.success(msg, opts);
        else if (t === 'error') toast.error(msg, opts);
        else if (t === 'warning') toast.warn(msg, opts);
        else toast.info(msg, opts);
      }
    } catch {}

    const duration = (typeof notification === 'object' && notification?.duration) ? notification.duration : newNotification.duration;
    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [setNotifications]);

  // Eliminar una notificación por ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, [setNotifications]);

  // Mostrar un toast de éxito
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }, [addNotification]);

  // Mostrar un toast de error
  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: options.duration || 5000,
      ...options
    });
  }, [addNotification]);

  // Mostrar un toast informativo
  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      duration: options.duration || 3000,
      ...options
    });
  }, [addNotification]);

  // Mostrar un toast de advertencia
  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: options.duration || 4000,
      ...options
    });
  }, [addNotification]);

  const value = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }), [notifications, addNotification, removeNotification, showSuccess, showError, showInfo, showWarning]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
