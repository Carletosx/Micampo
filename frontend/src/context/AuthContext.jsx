import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : '/api';
  const AUTH_DIRECT_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_AUTH_DIRECT_BASE) ? import.meta.env.VITE_AUTH_DIRECT_BASE : 'http://localhost:8081';

  const requestWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      let data = null;
      try {
        data = await resp.json();
      } catch {
        try {
          const text = await resp.text();
          data = text ? { mensaje: text } : null;
        } catch {
          data = null;
        }
      }
      return { resp, data };
    } finally {
      clearTimeout(id);
    }
  };

  const requestWithTimeoutRetry = async (url, options = {}, timeoutMs = 8000, retries = 1) => {
    try {
      return await requestWithTimeout(url, options, timeoutMs);
    } catch (err) {
      if (retries > 0 && (err?.name === 'AbortError' || err instanceof TypeError)) {
        return await requestWithTimeoutRetry(url, options, timeoutMs, retries - 1);
      }
      throw err;
    }
  };

  const postJsonGatewayOnly = async (relativePathAfterAuth, body, timeoutMs = 8000) => {
    const url = `${API_BASE}/auth/${relativePathAfterAuth}`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    };
    return requestWithTimeoutRetry(url, options, timeoutMs, 0);
  };

  const formatError = (data, fallback = 'Error') => {
    const raw = data?.mensaje || data?.message || data?.error || fallback;
    const detalles = data?.detalles ? `: ${data.detalles}` : '';
    if (raw === 'Correo ya registrado') return 'El correo ya está registrado';
    if (raw === 'Datos inválidos') return `Datos inválidos${detalles}`.trim();
    if (raw === 'Credenciales inválidas') return 'Credenciales inválidas';
    if (typeof raw === 'string') return raw;
    return fallback;
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const payload = { correo: email, contrasenia: password };
      console.log('POST /api/auth/autenticacion/ingreso payload:', payload);
      const t0 = performance.now();
      const { resp, data } = await postJsonGatewayOnly('autenticacion/ingreso', payload, 8000);
      const t1 = performance.now();
      console.log('Respuesta /ingreso status:', resp.status);
      console.log('Tiempo /ingreso ms:', Math.round(t1 - t0));
      console.log('Respuesta /ingreso body:', data);
      if (!resp.ok) {
        const msg = formatError(data, 'Error de inicio de sesión');
        throw new Error(msg);
      }
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.') [1]));
        const displayName = payload?.nombre || (payload?.sub || email || '').split('@')[0];
        const avatarUrl = payload?.avatarUrl || null;
        const usuario = { email: payload?.sub || email, role: payload?.rol, id: payload?.usuarioId, displayName, avatarUrl };
        setUser(usuario);
        localStorage.setItem('user', JSON.stringify(usuario));
      } catch {
        const displayName = (email || '').split('@')[0];
        const usuario = { email, role: 'DESCONOCIDO', displayName };
        setUser(usuario);
        localStorage.setItem('user', JSON.stringify(usuario));
      }
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.log('Error /ingreso:', error);
      const emsg = error?.message || '';
      const timeout = error?.name === 'AbortError' || /aborted|timed out|Failed to fetch/i.test(emsg);
      return { success: false, error: timeout ? 'Tiempo de espera agotado' : emsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const rol = (userData.tipoUsuario || 'comprador').toLowerCase() === 'vendedor' ? 'AGRICULTOR' : 'COMPRADOR';
      const payload = { nombre: userData.nombre, correo: userData.email, contrasenia: userData.password, rol };
      console.log('POST /api/auth/autenticacion/registro payload:', payload);
      const t0 = performance.now();
      const { resp, data } = await postJsonGatewayOnly('autenticacion/registro', payload, 8000);
      const t1 = performance.now();
      console.log('Respuesta /registro status:', resp.status);
      console.log('Tiempo /registro ms:', Math.round(t1 - t0));
      console.log('Respuesta /registro body:', data);
      if (!resp.ok) {
        const msg = formatError(data, 'Error de registro');
        throw new Error(msg);
      }
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        const displayName = payload?.nombre || userData?.nombre || (payload?.sub || userData.email || '').split('@')[0];
        const avatarUrl = payload?.avatarUrl || null;
        const nuevoUsuario = { email: payload?.sub || userData.email, role: payload?.rol, id: payload?.usuarioId, displayName, avatarUrl };
        setUser(nuevoUsuario);
        localStorage.setItem('user', JSON.stringify(nuevoUsuario));
      } catch {
        const displayName = userData?.nombre || (userData.email || '').split('@')[0];
        const nuevoUsuario = { email: userData.email, role: rol, displayName };
        setUser(nuevoUsuario);
        localStorage.setItem('user', JSON.stringify(nuevoUsuario));
      }
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.log('Error /registro:', error);
      const emsg = error?.message || '';
      const timeout = error?.name === 'AbortError' || /aborted|timed out|Failed to fetch/i.test(emsg);
      return { success: false, error: timeout ? 'Tiempo de espera agotado' : emsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const updateProfile = async ({ nombre, avatarUrl }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const body = JSON.stringify({ nombre, avatarUrl });
      const { resp, data } = await requestWithTimeoutRetry(`${API_BASE}/auth/autenticacion/perfil`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body
      }, 4000, 0);
      if (!resp.ok) {
        const msg = data?.mensaje || data?.message || data?.error || 'Error al actualizar perfil';
        return { success: false, error: msg };
      }
      const nuevo = {
        email: data?.correo || user?.email,
        role: data?.rol || user?.role,
        id: data?.id || user?.id,
        displayName: data?.nombre || nombre || user?.displayName,
        avatarUrl: data?.avatarUrl ?? avatarUrl ?? user?.avatarUrl
      };
      setUser(nuevo);
      localStorage.setItem('user', JSON.stringify(nuevo));
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e?.message || 'Error al actualizar perfil' };
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return { success: false, error: 'No hay token de refresco' };
    const body = JSON.stringify({ tokenRefresco: refreshToken });
    const { resp, data } = await requestWithTimeoutRetry(`${API_BASE}/auth/autenticacion/refrescar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    }, 8000, 1);
    if (!resp.ok) {
      return { success: false, error: data?.mensaje || data?.error || 'No se pudo refrescar' };
    }
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    try {
      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      const displayName = payload?.nombre || (payload?.sub || user?.email || '').split('@')[0];
      const avatarUrl = payload?.avatarUrl || user?.avatarUrl || null;
      const nuevo = { email: payload?.sub || user?.email, role: payload?.rol || user?.role, id: payload?.usuarioId || user?.id, displayName, avatarUrl };
      setUser(nuevo);
      localStorage.setItem('user', JSON.stringify(nuevo));
    } catch {}
    setIsAuthenticated(true);
    return { success: true };
  };

  // Verificar si hay un usuario en localStorage al cargar
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      requestWithTimeoutRetry(`${API_BASE}/auth/autenticacion/validar`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, 3000, 0).then(async ({ resp }) => {
        if (!resp.ok) {
          const r = await refreshAccessToken();
          if (!r.success) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      }).catch(async () => {
        const r = await refreshAccessToken();
        if (!r.success) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      });
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
