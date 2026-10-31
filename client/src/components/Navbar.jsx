import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  ChevronRight,
  Shield,
  Clock
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Our Fleet', path: '/fleet' },
    { name: 'Contact', path: '/contact' }
  ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md py-3 shadow-[0_4px_25px_rgba(0,0,0,0.06)] border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Identity & Logo */}
          <Link to="/" aria-label="Orange Cabs home" className="group flex items-center transition-transform duration-200 hover:scale-[1.01]">
            <img
              src="/images/orange-cabs-premium-logo.png"
              alt="Orange Cabs — Premium Chauffeur & Mobility"
              className="h-12 w-36 object-contain sm:h-14 sm:w-44"
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                    active
                      ? 'text-brandRed font-semibold'
                      : 'text-charcoal hover:text-brandRed hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brandRed"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Book Your Ride CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="btn-primary text-xs sm:text-sm font-semibold !py-2.5 !px-6 shadow-glow-red"
            >
              <span>Book Your Ride</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => openBookingModal()}
              className="btn-primary text-xs !py-2 !px-3.5"
            >
              Book Now
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl transition-colors text-charcoal bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-gray-200 shadow-2xl px-5 pt-3 pb-6 space-y-4"
          >
            <div className="flex flex-col divide-y divide-gray-100">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`py-3 text-sm font-semibold flex items-center justify-between ${
                      active ? 'text-brandRed' : 'text-charcoal hover:text-brandRed'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-brandRed' : 'text-gray-300'}`} />
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="tel:+919742588995"
                className="w-full py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-200 text-charcoal text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-accentOrange" />
                <span>Call Hotline: +91 97425 88995</span>
              </a>

              <a
                href="https://wa.me/919742588995?text=Hello%20Orange%20Cab,%20I%20would%20like%20to%20book%20a%20ride."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600 text-transparent" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full btn-primary text-sm py-3 justify-center"
              >
                <span>Book Your Ride</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
