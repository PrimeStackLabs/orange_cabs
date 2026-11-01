import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { BookingModalProvider } from './context/BookingModalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import CorporateQuotePopup from './components/CorporateQuotePopup';
import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FleetPage from './pages/FleetPage';
import ContactPage from './pages/ContactPage';
import CorporateTravelPage from './pages/CorporateTravelPage';
import AirportTransportationPage from './pages/AirportTransportationPage';
import OutstationBookingPage from './pages/OutstationBookingPage';
import BookCabPage from './pages/BookCabPage';
import TrackBookingPage from './pages/TrackBookingPage';

function AdminPortalRedirect() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const adminUrl = import.meta.env.DEV
      ? `${window.location.protocol}//${hostname}:5174/login`
      : '/admin/login';

    window.location.replace(adminUrl);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center bg-[#101010] text-white">
      <div className="space-y-3">
        <div className="w-8 h-8 border-2 border-brandRed border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium">Opening the Orange Cabs Centralized Admin Console...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <BookingModalProvider>
        <div className="site-luxury-theme relative min-h-screen flex flex-col bg-[#FFF9F2] text-[#171717] selection:bg-brandRed selection:text-white">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#171717',
                color: '#FFFFFF',
                border: '1px solid rgba(244, 91, 11, 0.4)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
                borderRadius: '16px',
                fontSize: '14px'
              }
            }}
          />

          <Preloader />
          <Navbar />
          <CorporateQuotePopup />

          <main className="flex-1">
            <Routes>
              {/* Core Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Dedicated Vertical Pages */}
              <Route path="/corporate" element={<CorporateTravelPage />} />
              <Route path="/services/corporate" element={<CorporateTravelPage />} />
              <Route path="/airport" element={<AirportTransportationPage />} />
              <Route path="/services/airport" element={<AirportTransportationPage />} />
              <Route path="/outstation" element={<OutstationBookingPage />} />
              <Route path="/services/outstation" element={<OutstationBookingPage />} />

              {/* Dedicated Booking & Tracking Pages */}
              <Route path="/book" element={<BookCabPage />} />
              <Route path="/track" element={<TrackBookingPage />} />
              <Route path="/my-bookings" element={<TrackBookingPage />} />

              {/* Admin Portal Redirect */}
              <Route path="/admin/*" element={<AdminPortalRedirect />} />

              {/* Catch-all to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <FloatingWidgets />
        </div>
      </BookingModalProvider>
    </BrowserRouter>
  );
}

export default App;
