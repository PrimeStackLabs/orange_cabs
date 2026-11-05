import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Car,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  MessageCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useBookingModal } from '../context/BookingModalContext';
import { useContactSettings } from '../context/ContactSettingsContext';

const SERVICE_TYPES = [
  { id: 'Airport Pickup & Drop', label: 'Airport Pickup & Drop' },
  { id: 'Local Travel', label: 'Local Travel' },
  { id: 'Outstation Travel', label: 'Outstation Travel' },
  { id: 'Corporate Travel', label: 'Corporate Travel' },
  { id: 'One-Way Transportation', label: 'One-Way Transportation' },
  { id: 'Wedding & Event Transportation', label: 'Wedding & Event Transportation' },
  { id: 'One-Day Packages', label: 'One-Day Packages' },
  { id: 'Hourly Packages', label: 'Hourly Packages' }
];

const DEFAULT_VEHICLE_CATEGORIES = [
  { name: 'Hatchback', passengers: 4 },
  { name: 'Sedan', passengers: 4 },
  { name: 'SUV', passengers: 7 },
  { name: 'Luxury Cars', passengers: 4 },
  { name: 'Tempo Traveller', passengers: 13 }
];

export default function BookingModal() {
  const { isOpen, closeBookingModal, initialData } = useBookingModal();
  const { whatsappHref } = useContactSettings();

  const [step, setStep] = useState(1); // 1 = Ride Details, 2 = Passenger & Review, 3 = Confirmation
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const [vehicleCategories, setVehicleCategories] = useState(DEFAULT_VEHICLE_CATEGORIES);
  const [outstationPricing, setOutstationPricing] = useState(null);

  const [formData, setFormData] = useState({
    serviceType: 'Outstation Travel',
    pickup: '',
    drop: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    cabType: 'SUV',
    passengers: 2,
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    let active = true;

    api.get('/settings')
      .then(({ data }) => {
        if (!active || !data.success) return;
        const categories = data.settings.vehicleCategories || [];
        if (categories.length) {
          setVehicleCategories(categories);
          setFormData((current) => ({
            ...current,
            cabType: categories.some(({ name }) => name === current.cabType)
              ? current.cabType
              : categories[0].name,
            passengers: categories.find(({ name }) => name === current.cabType)?.passengers
              || current.passengers
          }));
        }
        setOutstationPricing(data.settings.outstationPricing || null);
      })
      .catch((error) => {
        console.error('Failed to load booking categories and terms:', error);
        toast.error('Current vehicle categories could not be loaded.');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        cabType: initialData.cabType || initialData.category || prev.cabType,
        pickup: initialData.pickup || prev.pickup,
        drop: initialData.drop || prev.drop,
        date: initialData.date || prev.date,
        time: initialData.time || prev.time,
        serviceType: initialData.serviceType || prev.serviceType
      }));
    }
  }, [initialData]);

  // Reset state on close
  const handleClose = () => {
    closeBookingModal();
    setTimeout(() => {
      setStep(1);
      setConfirmedBooking(null);
      setCopied(false);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Next = (e) => {
    e.preventDefault();
    if (!formData.pickup.trim()) {
      toast.error('Please enter a pickup location');
      return;
    }
    if (!formData.drop.trim()) {
      toast.error('Please enter a destination / drop location');
      return;
    }
    if (!formData.date) {
      toast.error('Please select travel date');
      return;
    }
    setStep(2);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F45B0B', '#FFB900', '#171717', '#FFFFFF']
      });
    } catch (e) {}
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${cleanPhone}@guest.orangecab.in`,
        pickup: formData.pickup.trim(),
        drop: formData.drop.trim(),
        date: formData.date,
        time: formData.time,
        cabType: formData.cabType,
        passengers: Number(formData.passengers) || 1,
        message: `${formData.serviceType ? `[${formData.serviceType}] ` : ''}${formData.message || ''}`,
        source: 'Website Luxury Modal'
      };

      const { data } = await api.post('/bookings', payload);
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setStep(3);
        toast.success(`Booking Reserved! ID: ${data.booking.bookingId}`, { duration: 5000 });
        triggerCelebration();
      } else {
        toast.error(data.message || 'Unable to confirm booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error(err.response?.data?.message || 'Server error creating booking. Please call our hotline.');
    } finally {
      setLoading(false);
    }
  };

  const copyBookingId = () => {
    if (confirmedBooking?.bookingId) {
      navigator.clipboard.writeText(confirmedBooking.bookingId);
      setCopied(true);
      toast.success('Booking ID copied to clipboard');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative flex h-[640px] max-h-[calc(100dvh-2rem)] w-full max-w-[634px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl z-10"
        >
          {/* Header Bar */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/15 bg-gradient-to-r from-[#D94308] to-[#F45B0B] px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandRed to-accentOrange flex items-center justify-center text-white font-bold shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {step === 3 ? 'Booking Confirmed' : 'Reserve Your Journey'}
                </h3>
                <p className="text-xs text-gray-400">
                  {step === 1 && 'Step 1 of 2: Trip route & vehicle selection'}
                  {step === 2 && 'Step 2 of 2: Passenger details & summary'}
                  {step === 3 && 'Instant confirmation with 24/7 chauffeur dispatch'}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          {step < 3 && (
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brandRed' : 'text-gray-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-brandRed text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </span>
                <span>Trip & Vehicle</span>
              </div>

              <div className="h-0.5 w-12 bg-gray-200" />

              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brandRed' : 'text-gray-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-brandRed text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </span>
                <span>Passenger & Review</span>
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
            
            {/* STEP 1: ROUTE & VEHICLE */}
            {step === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-5">
                
                {/* Service Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    Select Service Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SERVICE_TYPES.map(svc => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, serviceType: svc.id }))}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                          formData.serviceType === svc.id
                            ? 'bg-brandRed text-white border-brandRed shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {svc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pickup & Drop Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accentOrange" />
                      Pickup Location <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      name="pickup"
                      value={formData.pickup}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore Airport, Koramangala..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brandRed" />
                      Drop Location <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      name="drop"
                      value={formData.drop}
                      onChange={handleChange}
                      placeholder="e.g. Mysore Palace, Coorg, MG Road..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      Travel Date <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      Pickup Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      Passengers
                    </label>
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none bg-white transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 10, 13, 16, 26].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vehicle Category Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    Select Vehicle Class <span className="text-brandRed">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {vehicleCategories.map((vehicle) => {
                      const isSelected = formData.cabType === vehicle.name;
                      return (
                        <button
                          key={vehicle.name}
                          type="button"
                          onClick={() => setFormData((previous) => ({
                            ...previous,
                            cabType: vehicle.name,
                            passengers: vehicle.passengers || previous.passengers
                          }))}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-brandRed bg-brandRed/5 shadow-sm ring-1 ring-brandRed'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          } text-left`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-heading font-bold text-xs text-charcoal">{vehicle.name}</span>
                            {vehicle.passengers && (
                              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                {vehicle.passengers} Seats
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {outstationPricing && ['Outstation Travel', 'One-Way Transportation'].includes(formData.serviceType) && (
                  <div className="space-y-1.5 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-xs leading-relaxed text-gray-700">
                    <p><strong>Minimum billing distance:</strong> {outstationPricing.minimumBillingDistance} km.</p>
                    <p>{outstationPricing.tollParkingInfo}</p>
                    <p>{outstationPricing.driverAllowanceInfo}</p>
                    <p>{outstationPricing.otherChargesInfo}</p>
                    <p>{outstationPricing.paymentDueInfo}</p>
                  </div>
                )}

                {/* Continue CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Fixed Tariff &bull; No Hidden Tolls</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-sm !py-2.5 !px-6"
                  >
                    <span>Proceed to Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PASSENGER DETAILS & SUMMARY */}
            {step === 2 && (
              <form onSubmit={handleSubmitBooking} className="space-y-5">
                
                {/* Trip Summary Card */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Trip Summary</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-brandRed hover:underline"
                    >
                      Edit Route
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">From:</span>
                      <strong className="text-charcoal font-semibold">{formData.pickup}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">To:</span>
                      <strong className="text-charcoal font-semibold">{formData.drop}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Vehicle:</span>
                      <strong className="text-charcoal font-semibold">{formData.cabType}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Schedule:</span>
                      <strong className="text-charcoal font-semibold">{formData.date} &bull; {formData.time}</strong>
                    </div>
                  </div>
                </div>

                {/* Passenger Inputs */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                    Primary Passenger Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Full Name <span className="text-brandRed">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Anand Kumar"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-accentOrange" />
                        Mobile Number <span className="text-brandRed">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 98450 12345"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Email Address (for invoice copy)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. anand@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Special Requests / Flight Number / Landmarking
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="e.g. Flight 6E 452 arrival, need child car seat, extra luggage space..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Bottom CTA & Back */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-charcoal px-3 py-2 rounded-lg"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Route</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-sm !py-2.5 !px-7 shadow-glow-red disabled:opacity-60 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BOOKING CONFIRMED SUCCESS SCREEN */}
            {step === 3 && confirmedBooking && (
              <div className="text-center py-4 space-y-6">
                
                {/* Checkmark icon */}
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="badge-pill-orange mb-2">Reservation Active</span>
                  <h3 className="font-heading font-black text-2xl text-charcoal">
                    Thank You, {confirmedBooking.name}!
                  </h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                    Your ride request has been registered in the Orange Cars centralized dispatch network. Chauffeur telematics and trip details are being prepared.
                  </p>
                </div>

                {/* Reference ID Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400 block">Booking Reference ID</span>
                    <strong className="text-lg font-mono text-brandRed font-black">
                      {confirmedBooking.bookingId}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={copyBookingId}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-brandRed hover:border-brandRed transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Trip Detail Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block">Pickup:</span>
                    <strong className="text-charcoal font-semibold truncate block">{confirmedBooking.pickup}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Destination:</span>
                    <strong className="text-charcoal font-semibold truncate block">{confirmedBooking.drop}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Vehicle:</span>
                    <strong className="text-charcoal font-semibold">{confirmedBooking.cabType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Date & Time:</span>
                    <strong className="text-charcoal font-semibold">{confirmedBooking.date} &bull; {confirmedBooking.time}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Phone:</span>
                    <strong className="text-charcoal font-semibold">{confirmedBooking.phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Status:</span>
                    <span className="text-emerald-600 font-bold uppercase">{confirmedBooking.status || 'Pending'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={whatsappHref
                      ? `${whatsappHref}?text=Hello%20Orange%20Cab,%20I%20have%20confirmed%20Booking%20ID:%20${confirmedBooking.bookingId}%20for%20pickup%20at%20${encodeURIComponent(confirmedBooking.pickup)}.`
                      : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto btn-accent text-xs font-bold !py-3 !px-5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Track on WhatsApp</span>
                  </a>

                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto btn-outline-dark text-xs font-bold !py-3 !px-6"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
