import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Phone, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Clock3,
  ShieldCheck,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function TrackBookingPage() {
  const [searchParams] = useSearchParams();

  const [bookingId, setBookingId] = useState(searchParams.get('bookingId') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!bookingId.trim() || !phone.trim()) {
      toast.error('Please enter both Booking Reference ID and Phone number');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/bookings/track', {
        bookingId: bookingId.trim().toUpperCase(),
        phone: phone.trim()
      });

      if (data.success && data.booking) {
        setBooking(data.booking);
        toast.success('Live trip status retrieved successfully');
      }
    } catch (err) {
      console.error('Track error:', err);
      toast.error(err.response?.data?.message || 'No booking found matching these credentials. Please check details.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('bookingId') && searchParams.get('phone')) {
      handleTrack();
    }
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">Confirmed &bull; Scheduled</span>;
      case 'Assigned':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">Driver Dispatched</span>;
      case 'Completed':
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-bold uppercase">Trip Completed</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">Pending Dispatch Review</span>;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Header */}
      <section className="page-hero-surface relative py-16 sm:py-20 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="badge-pill-orange">Real-Time Dispatch Console</span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            Track My Reservation
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Check live chauffeur assignments, vehicle telematics, and confirmation status with your booking reference.
          </p>
        </div>
      </section>

      {/* Tracker Form & Result */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Lookup Card */}
          <div className="luxury-card p-6 sm:p-8 border border-gray-200">
            <h3 className="font-heading font-black text-xl text-charcoal mb-4">
              Enter Booking Credentials
            </h3>

            <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Booking ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OC-2026-00001"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none uppercase"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Registered Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                />
              </div>

              <div className="sm:col-span-3 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary !py-2.5 !px-4 text-xs font-bold shadow-glow-red disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Locating...' : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Ride</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result Card */}
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="luxury-card p-6 sm:p-8 border border-gray-200 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Reservation Reference</span>
                  <h3 className="text-2xl font-heading font-black font-mono text-brandRed">
                    {booking.bookingId}
                  </h3>
                </div>

                <div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Trip Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block font-medium">Pickup:</span>
                  <strong className="text-charcoal font-bold block truncate">{booking.pickup}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Drop:</span>
                  <strong className="text-charcoal font-bold block truncate">{booking.drop}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Date &amp; Time:</span>
                  <strong className="text-charcoal font-bold block">{booking.date} &bull; {booking.time}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Vehicle Class:</span>
                  <strong className="text-charcoal font-bold block">{booking.cabType}</strong>
                </div>
              </div>

              {/* Assigned Driver Details (if assigned) */}
              {booking.driver ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                    Assigned Chauffeur &amp; Vehicle
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Chauffeur Name:</span>
                      <strong className="text-charcoal font-bold text-sm">{booking.driver.name}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Direct Mobile:</span>
                      <a href={`tel:${booking.driver.phone}`} className="text-emerald-700 font-bold text-sm underline">
                        {booking.driver.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Assigned Reg. No:</span>
                      <strong className="text-charcoal font-bold text-sm font-mono">{booking.vehicle?.registrationNumber || 'Assigned'}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3 text-xs text-amber-800">
                  <Clock3 className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    Your reservation is verified. Chauffeur contact and vehicle registration details are dispatched via SMS &amp; WhatsApp 2 hours before your scheduled pickup time.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={`https://wa.me/919742588995?text=Hello%20Orange%20Cab,%20I%20am%20inquiring%20about%20my%20booking%20ID:%20${booking.bookingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent text-xs font-bold !py-2.5 !px-5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Dispatch on WhatsApp</span>
                </a>

                <a
                  href="tel:+919742588995"
                  className="btn-outline-dark text-xs font-bold !py-2.5 !px-5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 24/7 Helpline</span>
                </a>
              </div>
            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
}
