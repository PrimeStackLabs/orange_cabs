import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';

// Trimmed Admin Views strictly supporting the 5-page scope
import DashboardView from './pages/DashboardView';
import BookingsView from './pages/BookingsView';
import VehiclesView from './pages/VehiclesView';
import DriversView from './pages/DriversView';
import ServicesView from './pages/ServicesView';
import EnquiriesView from './pages/EnquiriesView';
import ContentView from './pages/ContentView';
import SettingsView from './pages/SettingsView';
import LogsView from './pages/LogsView';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminAuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#242424',
              border: '1px solid rgba(217, 35, 50, 0.2)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              borderRadius: '16px',
              fontSize: '13px'
            }
          }}
        />

        <Routes>
          {/* Public login */}
          <Route
            path="/login"
            element={
              <PublicLoginRoute>
                <AdminLogin />
              </PublicLoginRoute>
            }
          />

          {/* Protected layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="bookings" element={<BookingsView />} />
            <Route path="vehicles" element={<VehiclesView />} />
            <Route path="drivers" element={<DriversView />} />
            <Route path="services" element={<ServicesView />} />
            <Route path="enquiries" element={<EnquiriesView />} />
            <Route path="content" element={<ContentView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="logs" element={<LogsView />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

const PublicLoginRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (admin) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  return children;
};

export default App;
