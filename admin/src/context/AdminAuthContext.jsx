import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { API_ORIGIN } from '../services/api';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('oc_admin_token') || null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Theme toggle
  useEffect(() => {
    const saved = localStorage.getItem('oc_admin_theme');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem('oc_admin_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setDarkMode(true);
      localStorage.setItem('oc_admin_theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  // Check auth
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/admin/me');
        if (data.success) {
          setAdmin(data.admin);
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem('oc_admin_token');
          setToken(null);
          setAdmin(null);
        } else {
          console.error('Unable to verify the admin session:', err);
          toast.error('Unable to verify your admin session. Check the API connection and sign in again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  // Real-time socket for bookings notification
  useEffect(() => {
    const socket = io(API_ORIGIN, {
      transports: ['websocket', 'polling']
    });

    socket.on('new_booking', (bookingData) => {
      toast((t) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center text-white font-bold">
            OC
          </div>
          <div>
            <p className="font-bold text-white text-xs">New Booking Received!</p>
            <p className="text-[11px] text-gray-300">
              {bookingData.bookingId} - ₹{bookingData.totalFare}
            </p>
          </div>
        </div>
      ), { duration: 5000 });

      setNotifications((prev) => [bookingData, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/admin/login', {
        email: email.trim().toLowerCase(),
        password
      });
      if (!data.success || !data.token || !data.admin) {
        throw new Error(data.message || 'Admin login failed');
      }

      localStorage.setItem('oc_admin_token', data.token);
      setToken(data.token);
      setAdmin(data.admin);
      toast.success(`Welcome back, ${data.admin.name} (${data.admin.role})!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Unable to reach the admin service');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('oc_admin_token');
    setToken(null);
    setAdmin(null);
    toast.success('Admin session ended');
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      token,
      loading,
      login,
      logout,
      darkMode,
      toggleTheme,
      notifications
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
