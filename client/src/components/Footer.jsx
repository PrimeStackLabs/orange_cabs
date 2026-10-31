import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

export default function Footer() {
  const { openBookingModal } = useBookingModal();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Fleet', path: '/fleet' },
    { name: 'Corporate Travel', path: '/corporate' },
    { name: 'Track My Booking', path: '/track' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const serviceLinks = [
    { name: 'Corporate Employee Transportation', path: '/services' },
    { name: 'Kempegowda Airport VIP Transfers', path: '/airport' },
    { name: 'Outstation Intercity Travel', path: '/outstation' },
    { name: 'One-Way Express Drop', path: '/outstation' },
    { name: 'Wedding & Event Transportation', path: '/services' },
    { name: 'VIP Chauffeur Services', path: '/services' }
  ];

  return (
    <footer className="bg-[#101010] text-white border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brandRed/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-accentOrange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          
          {/* Column 1: Logo & Company Description (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" aria-label="Orange Cabs home" className="inline-flex items-center rounded-xl bg-white p-2 transition-opacity hover:opacity-90">
              <img
                src="/images/orange-cabs-premium-logo.png"
                alt="Orange Cabs — Premium Chauffeur & Mobility"
                className="h-16 w-52 object-contain"
              />
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Orange Cabs is South India’s trusted luxury automotive transportation partner. Delivering punctual airport chauffeur services, corporate employee mobility, and premium intercity travel with verified chauffeurs and an immaculate fleet.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Police Verified Chauffeurs</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openBookingModal()}
                className="btn-accent text-xs font-bold !py-2 !px-4"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Booking Dispatch</span>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentOrange font-heading">
              Company
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-accentOrange group-hover:translate-x-0.5 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentOrange font-heading">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-brandRed group-hover:translate-x-0.5 transition-all" />
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accentOrange font-heading">
              Contact & Support
            </h4>
            
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accentOrange shrink-0 mt-1" />
                <span>Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, India</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accentOrange shrink-0" />
                <a href="tel:+919742588995" className="hover:text-white transition-colors font-medium text-white">
                  +91 97425 88995
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accentOrange shrink-0" />
                <a href="mailto:info@orangecab.in" className="hover:text-white transition-colors">
                  info@orangecab.in
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-accentOrange shrink-0" />
                <span>24 Hours / 7 Days a Week</span>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Connect With Us</span>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/919742588995"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.06.8.82-2.98-.19-.31a8.19 8.19 0 0 1-1.28-4.48c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.01-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.47-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.18-.06-.11-.23-.17-.48-.3" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-pink-600 text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-sky-600 text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; 2026 Orange Cabs. All Rights Reserved.
          </div>
          <div className="text-gray-400">
            Designed and Developed by <span className="text-gray-300 font-medium">bookmywebsite.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
