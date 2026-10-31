import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Luggage,
  Check,
  Phone
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

export default function AirportTransportationPage() {
  const { openBookingModal } = useBookingModal();

  const [pickupCity, setPickupCity] = useState('Electronic City');
  const [terminal, setTerminal] = useState('Kempegowda Int. Airport - Terminal 1');

  const airportPackages = [
    {
      vehicle: 'Executive Sedan',
      models: 'Maruti Dzire / Honda City',
      image: '/images/fleet/honda-city.png',
      fare: '₹999 - ₹1,499',
      seats: '4 Passengers',
      luggage: '2 Large Bags',
      perks: ['Dual AC', 'Bottled Mineral Water', 'Fast Charger', 'Curbside Gate Pickup']
    },
    {
      vehicle: 'Toyota Innova Crysta ZX',
      models: 'Innova Crysta Captain Seats',
      image: '/images/fleet/innova-crysta.jpg',
      fare: '₹1,799 - ₹2,399',
      seats: '7 Passengers',
      luggage: '4 Large Bags',
      perks: ['Captain Executive Seats', 'Generous Boot Space', 'Zero Cancellation Guarantee', 'Flight Live Delay Sync']
    },
    {
      vehicle: 'Mercedes-Benz E-Class VIP',
      models: 'Mercedes E-Class Chauffeur',
      image: '/images/fleet/mercedes-vip.jpg',
      fare: '₹4,499 - ₹5,499',
      seats: '4 Passengers',
      luggage: '3 Large Bags',
      perks: ['Uniformed Chauffeur', 'Terminal Gate Nameboard Protocol', 'Chilled Beverages', 'Burmester Audio']
    }
  ];

  const handleBookNow = (vehName) => {
    openBookingModal({
      serviceType: 'Airport Transfer',
      drop: terminal,
      pickup: pickupCity,
      cabType: vehName
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">Kempegowda International Airport (BLR)</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Punctual Airport Transfers
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Zero surge pricing, automated flight arrival synchronization, terminal curbside assistance, and verified chauffeurs 24/7.
          </p>
        </div>
      </section>

      {/* Terminal Protocols Info */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-gray-50">
              <span className="text-2xl font-black text-brandRed font-heading block">0%</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mt-1">Cancellation Anxiety</span>
              <p className="text-xs text-gray-600 mt-2">Vehicles guaranteed and dispatched 1 hour before scheduled time.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <span className="text-2xl font-black text-accentOrange font-heading block">T1 &amp; T2</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mt-1">Terminal Curbside</span>
              <p className="text-xs text-gray-600 mt-2">Designated pickup at Bengaluru T1 &amp; T2 arrival gates.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <span className="text-2xl font-black text-emerald-600 font-heading block">Free 45m</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mt-1">Flight Delay Buffer</span>
              <p className="text-xs text-gray-600 mt-2">Complimentary waiting time for delayed flight landings.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <span className="text-2xl font-black text-charcoal font-heading block">Fixed</span>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mt-1">Transparent Pricing</span>
              <p className="text-xs text-gray-600 mt-2">All tolls and parking itemized clearly on GST invoice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Airport Cab Packages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-red mb-3">Guaranteed Fleet</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Select Your Airport Vehicle
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Choose the perfect vehicle class based on your party size, luggage, and executive comfort requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {airportPackages.map((pkg, idx) => (
              <div key={idx} className="luxury-card overflow-hidden flex flex-col group">
                <div className="h-60 overflow-hidden bg-gray-100 relative">
                  <img
                    src={pkg.image}
                    alt={pkg.vehicle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-pill-red !bg-white/95 !border-none !text-brandRed shadow-sm">
                      Airport Express
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-charcoal">
                      {pkg.vehicle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{pkg.models}</p>

                    <div className="grid grid-cols-2 gap-2 py-3 mt-3 border-y border-gray-100 text-xs text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-accentOrange" />
                        <span>{pkg.seats}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-brandRed" />
                        <span>{pkg.luggage}</span>
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                      {pkg.perks.map((p, pidx) => (
                        <li key={pidx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Estimated Fare</span>
                      <strong className="text-base font-bold text-charcoal">{pkg.fare}</strong>
                    </div>

                    <button
                      onClick={() => handleBookNow(pkg.vehicle)}
                      className="btn-primary text-xs font-bold !py-2.5 !px-5"
                    >
                      <span>Book Airport Ride</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Immediate Helpline */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
            Boarding Soon or Landed at Terminal?
          </h2>
          <p className="text-sm text-gray-600">
            Our express curbside dispatch can deploy a chauffeur vehicle to Bengaluru Airport T1/T2 curbside in as little as 15 minutes.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+919742588995"
              className="btn-primary text-xs sm:text-sm !py-3 !px-7 shadow-glow-red"
            >
              <Phone className="w-4 h-4" />
              <span>Call Airport Hotline: +91 97425 88995</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
