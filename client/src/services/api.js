import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || (import.meta.env.PROD ? 'https://api.orangecab.in/api' : 'http://localhost:5000/api'),
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
