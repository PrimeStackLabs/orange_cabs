import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Repeat,
  Navigation,
  Check,
  Phone
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

const POPULAR_ROUTES = [
  {
    destination: 'Mysore',
    distance: '145 km',
    duration: '2.5 - 3 Hours',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹2,499',
    innovaFare: '₹3,799',
    highway: 'Bangalore-Mysore Expressway (NH 275)'
  },
  {
    destination: 'Coorg (Madikeri)',
    distance: '250 km',
    duration: '5 - 5.5 Hours',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹4,199',
    innovaFare: '₹6,299',
    highway: 'Via Mysore Expressway & Kushalnagar'
  },
  {
    destination: 'Ooty (Nilgiris)',
    distance: '280 km',
    duration: '6 - 6.5 Hours',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹4,799',
    innovaFare: '₹7,199',
    highway: 'Via Bandipur Tiger Reserve & 36 Hairpin Bends'
  },
  {
    destination: 'Chikmagalur',
    distance: '240 km',
    duration: '4.5 - 5 Hours',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹3,999',
    innovaFare: '₹5,999',
    highway: 'Via Hassan 4-Lane Highway (NH 75)'
  },
  {
    destination: 'Tirupati Balaji',
    distance: '250 km',
    duration: '4.5 - 5 Hours',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹4,299',
    innovaFare: '₹6,499',
    highway: 'Via Kolar & Chittoor Highway'
  },
  {
    destination: 'Chennai Central',
    distance: '345 km',
    duration: '6 - 7 Hours',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    sedanFare: '₹5,799',
    innovaFare: '₹8,699',
    highway: 'Via Hosur, Krishnagiri & Vellore (NH 48)'
  }
];

export default function OutstationBookingPage() {
  const { openBookingModal } = useBookingModal();

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">Intercity Outstation &amp; One-Way Drop</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Intercity Highway Journeys
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transparent per-km tariffs, verified hill &amp; highway chauffeurs, sanitized vehicles, and zero surge pricing across South India.
          </p>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-red mb-3">Popular Travel Corridors</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Popular Outstation Destinations
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Fixed rate quotes and instant chauffeur dispatch for all major vacation hill stations, pilgrim towns, and interstate metros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {POPULAR_ROUTES.map((route, idx) => (
              <div key={idx} className="luxury-card overflow-hidden flex flex-col group">
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  <img
                    src={route.image}
                    alt={route.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-pill-red !bg-white/95 !border-none !text-brandRed shadow-sm">
                      {route.distance}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-4 px-3 py-1 rounded-xl bg-black/80 text-white font-medium text-xs backdrop-blur-md">
                    {route.duration}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-charcoal">
                      Bangalore to {route.destination}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{route.highway}</p>

                    <div className="grid grid-cols-2 gap-3 py-3 mt-3 border-y border-gray-100 text-xs">
                      <div>
                        <span className="text-gray-400 block font-medium">Sedan (Dzire):</span>
                        <strong className="text-charcoal font-bold text-sm">{route.sedanFare}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-medium">Innova Crysta:</span>
                        <strong className="text-brandRed font-bold text-sm">{route.innovaFare}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Fixed Toll Tracking
                    </span>

                    <button
                      onClick={() => openBookingModal({
                        pickup: 'Bangalore City',
                        drop: route.destination,
                        serviceType: 'Outstation Travel'
                      })}
                      className="btn-primary text-xs font-bold !py-2.5 !px-5"
                    >
                      <span>Book Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 24/7 Hotline CTA */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
            Planning a Multi-City Outstation Itinerary?
          </h2>
          <p className="text-sm text-gray-600">
            Customize multi-day tours with night stay allowances, driver accommodation assistance, and transparent kilometer logs.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+919742588995"
              className="btn-primary text-xs sm:text-sm !py-3 !px-7 shadow-glow-red"
            >
              <Phone className="w-4 h-4" />
              <span>Call Outstation Desk: +91 97425 88995</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
