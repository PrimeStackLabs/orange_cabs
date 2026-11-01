import axios from 'axios';

const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

export const API_BASE_URL = isLocalHost
  ? 'http://localhost:5000/api'
  : import.meta.env.VITE_API_URL || 'https://api.orangecab.in/api';
export const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
