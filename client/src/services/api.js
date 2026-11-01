import axios from 'axios';

const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const api = axios.create({
  baseURL: isLocalHost
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_URL || 'https://api.orangecab.in/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
