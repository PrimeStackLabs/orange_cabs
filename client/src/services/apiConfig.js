/**
 * Centralized API configuration for SKB Tour and Travels.
 * Supports VITE_API_URL and VITE_API_BASE_URL with fallback to the deployed Render backend.
 */
const rawUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://skb-tours-and-travels.onrender.com/api';

export const API_BASE =
  rawUrl === '/api' || rawUrl.endsWith('/api')
    ? rawUrl
    : `${rawUrl.replace(/\/$/, '')}/api`;

export default API_BASE;

