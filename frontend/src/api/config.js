const envBase = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_API_BASE : undefined
const isDev = (typeof import.meta !== 'undefined' && import.meta.env) ? !!import.meta.env.DEV : false
const defaultBase = isDev ? 'http://localhost:8080/api' : '/api'
export const API_BASE = envBase || defaultBase

export const API_ORIGIN = (() => {
  try {
    const u = new URL(API_BASE, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    return `${u.protocol}//${u.host}`.replace(/\/$/, '');
  } catch {
    return '';
  }
})();

export default API_BASE
