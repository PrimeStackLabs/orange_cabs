import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Phone,
  Mail,
  User,
  Sparkles,
  Copy,
  MessageCircle,
  FileText
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const SERVICE_OPTIONS = [
  { id: 'Outstation Travel', label: 'Outstation Intercity', desc: 'Doorstep pickup to other cities' },
  { id: 'Airport Transfer', label: 'Airport Transfer', desc: 'Guaranteed BLR terminal curbside' },
  { id: 'Local City Rental', label: 'Local City Rental', desc: 'Hourly car with dedicated driver' },
  { id: 'Corporate Travel', label: 'Corporate Mobility', desc: 'Enterprise executive transit' },
  { id: 'One-Way Drop', label: 'One-Way Drop', desc: 'Pay only for single direction distance' },
  { id: 'VIP Chauffeur', label: 'VIP Chauffeur', desc: 'Luxury Mercedes / BMW chauffeur' }
];

const VEHICLE_OPTIONS = [
  { id: 'Premium Sedan', name: 'Maruti Dzire / Honda City', seats: 4, bags: 2, rate: '₹13/km', base: '₹800' },
  { id: 'Executive Sedan', name: 'Skoda Superb / Camry', seats: 4, bags: 3, rate: '₹18/km', base: '₹1,500' },
  { id: 'Toyota Innova Crysta', name: 'Toyota Innova Crysta ZX', seats: 7, bags: 4, rate: '₹22/km', base: '₹1,800' },
  { id: 'Toyota Innova Hycross', name: 'Toyota Innova Hycross Hybrid', seats: 7, bags: 4, rate: '₹24/km', base: '₹2,000' },
  { id: 'Toyota Fortuner', name: 'Toyota Fortuner 4x4 Luxury', seats: 7, bags: 4, rate: '₹28/km', base: '₹2,600' },
  { id: 'Luxury SUV', name: 'BMW X5 / Audi Q7 Chauffeur', seats: 5, bags: 4, rate: '₹48/km', base: '₹4,500' },
  { id: 'Mercedes-Benz', name: 'Mercedes-Benz E-Class VIP', seats: 4, bags: 3, rate: '₹52/km', base: '₹5,000' },
  { id: 'Tempo Traveller', name: 'Force Urbania Cruiser', seats: 13, bags: 12, rate: '₹28/km', base: '₹3,200' },
  { id: 'Luxury Mini Bus', name: 'BharatBenz Luxury Coach', seats: 26, bags: 25, rate: '₹45/km', base: '₹5,500' }
];

export default function BookCabPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};

  const requestedService = searchParams.get('service') || initialData.serviceType || '';
  const normalizedService = requestedService.toLowerCase();
  const serviceType = normalizedService.includes('airport')
    ? 'Airport Transfer'
    : normalizedService.includes('one-way') || normalizedService.includes('one way')
      ? 'One-Way Drop'
      : normalizedService.includes('local') || normalizedService.includes('hourly')
        ? 'Local City Rental'
        : normalizedService.includes('corporate') || normalizedService.includes('employee')
          ? 'Corporate Travel'
          : normalizedService.includes('vip') || normalizedService.includes('chauffeur')
            ? 'VIP Chauffeur'
            : 'Outstation Travel';

  // Multi-step: 1 = Service & Route, 2 = Date & Vehicle, 3 = Passenger & Review, 4 = Confirmation
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    serviceType,
    pickup: searchParams.get('pickup') || initialData.pickup || 'Bangalore City',
    drop: searchParams.get('drop') || initialData.drop || 'Mysore',
    date: searchParams.get('date') || initialData.date || new Date().toISOString().split('T')[0],
    time: searchParams.get('time') || initialData.time || '09:00 AM',
    cabType: searchParams.get('vehicle') || initialData.cabType || initialData.category || 'Toyota Innova Crysta',
    passengers: Number(searchParams.get('passengers') || initialData.passengers) || 2,
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D92332', '#FF6B35', '#101010', '#FFFFFF']
      });
    } catch (e) {}
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!formData.pickup.trim() || !formData.drop.trim()) {
      toast.error('Please enter pickup and drop locations');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!formData.date) {
      toast.error('Please select travel date');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
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
        message: `[${formData.serviceType}] ${formData.message || ''}`,
        source: 'Dedicated Booking Page'
      };

      const { data } = await api.post('/bookings', payload);
      if (data.success && data.booking) {
        setConfirmedBooking(data.booking);
        setStep(4);
        toast.success(`Booking Confirmed! ID: ${data.booking.bookingId}`);
        triggerCelebration();
        window.scrollTo({ top: 200, behavior: 'smooth' });
      } else {
        toast.error(data.message || 'Unable to submit booking. Please call our hotline.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error(err.response?.data?.message || 'Server error creating booking. Please call dispatch hotline.');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Header */}
      <section className="page-hero-surface relative py-16 sm:py-20 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="badge-pill-orange">Centralized Online Dispatch</span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            Reserve Your Journey
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            Book certified chauffeurs, fixed tariffs, and pristine luxury vehicles with instant database confirmation.
          </p>
        </div>
      </section>

      {/* Main Stepper Container */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Step Progress Bar */}
          {step < 4 && (
            <div className="mb-10 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between text-xs font-bold">
                
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brandRed' : 'text-gray-400'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-brandRed text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    1
                  </span>
                  <span className="hidden sm:inline">Service &amp; Route</span>
                </div>

                <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-brandRed' : 'bg-gray-200'}`} />

                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brandRed' : 'text-gray-400'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-brandRed text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    2
                  </span>
                  <span className="hidden sm:inline">Date &amp; Vehicle</span>
                </div>

                <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-brandRed' : 'bg-gray-200'}`} />

                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brandRed' : 'text-gray-400'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-brandRed text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                    3
                  </span>
                  <span className="hidden sm:inline">Passenger &amp; Confirm</span>
                </div>

              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="luxury-card p-6 sm:p-10 border border-gray-200">
            
            {/* STEP 1: SERVICE & ROUTE */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-charcoal mb-1">
                    Step 1: Select Service &amp; Route
                  </h3>
                  <p className="text-xs text-gray-500">Choose your transportation category and enter pickup/drop points.</p>
                </div>

                {/* Service Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SERVICE_OPTIONS.map(svc => {
                    const isSelected = formData.serviceType === svc.id;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => setFormData({ ...formData, serviceType: svc.id })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brandRed bg-brandRed/5 ring-1 ring-brandRed shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-heading font-bold text-sm text-charcoal">{svc.label}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{svc.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accentOrange" />
                      Pickup Location <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pickup}
                      onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                      placeholder="e.g. Bangalore Airport, Indiranagar, Electronic City"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brandRed" />
                      Drop Location <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.drop}
                      onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
                      placeholder="e.g. Mysore, Coorg, Ooty, Whitefield"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Fixed Tariff &bull; Zero Surge</span>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary text-sm !py-3 !px-7 shadow-glow-red"
                  >
                    <span>Proceed to Vehicle Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DATE, TIME & VEHICLE SELECTION */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="space-y-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-charcoal mb-1">
                    Step 2: Choose Schedule &amp; Vehicle
                  </h3>
                  <p className="text-xs text-gray-500">Select when you wish to travel and choose from our premium fleet.</p>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Travel Date <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Pickup Time
                    </label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 09:30 AM"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      Passengers
                    </label>
                    <select
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed outline-none bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 10, 13, 16, 26].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vehicle Selection Grid */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                    Select Vehicle Class <span className="text-brandRed">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {VEHICLE_OPTIONS.map(veh => {
                      const isSelected = formData.cabType === veh.id || formData.cabType === veh.name;
                      return (
                        <div
                          key={veh.id}
                          onClick={() => setFormData({ ...formData, cabType: veh.id })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-brandRed bg-brandRed/5 ring-1 ring-brandRed shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-sm text-charcoal">{veh.id}</span>
                            <span className="text-xs font-bold text-brandRed">{veh.rate}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{veh.name}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                            <span>{veh.seats} Seats</span>
                            <span>&bull;</span>
                            <span>{veh.bags} Bags</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-charcoal"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Route</span>
                  </button>

                  <button
                    type="submit"
                    className="btn-primary text-sm !py-3 !px-7 shadow-glow-red"
                  >
                    <span>Proceed to Passenger Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PASSENGER DETAILS & SUMMARY REVIEW */}
            {step === 3 && (
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-charcoal mb-1">
                    Step 3: Passenger Details &amp; Booking Summary
                  </h3>
                  <p className="text-xs text-gray-500">Confirm your details and receive your unique dispatch reference ID.</p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Itinerary Overview</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-brandRed hover:underline"
                    >
                      Modify Route
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block font-medium">Service:</span>
                      <strong className="text-charcoal font-bold">{formData.serviceType}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Pickup &rarr; Drop:</span>
                      <strong className="text-charcoal font-bold">{formData.pickup} &rarr; {formData.drop}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Vehicle Class:</span>
                      <strong className="text-charcoal font-bold">{formData.cabType}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Date &amp; Time:</span>
                      <strong className="text-charcoal font-bold">{formData.date} &bull; {formData.time}</strong>
                    </div>
                  </div>
                </div>

                {/* Passenger Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Full Name <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-accentOrange" />
                      Mobile Number <span className="text-brandRed">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98450 12345"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email Address (for GST receipt and driver credentials)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brandRed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Special Instructions / Flight Number / Landmarking
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. Landmarking near Metro Pillar, infant passenger, need luggage carrier..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-brandRed outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-charcoal"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Vehicle</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-sm !py-3 !px-8 shadow-glow-red disabled:opacity-60 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Booking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Confirm &amp; Reserve Ride</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: CONFIRMATION SUCCESS */}
            {step === 4 && confirmedBooking && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="badge-pill-orange mb-2">Reservation Active</span>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
                    Booking Confirmed, {confirmedBooking.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1">
                    Your ride has been logged into the Orange Cabs dispatch command server. A chauffeur assignment update will be transmitted to your phone.
                  </p>
                </div>

                {/* Reference ID Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">Booking Reference ID</span>
                    <strong className="text-xl font-mono text-brandRed font-black">
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

                {/* Summary Table */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block">Pickup:</span>
                    <strong className="text-charcoal font-semibold truncate block">{confirmedBooking.pickup}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Drop:</span>
                    <strong className="text-charcoal font-semibold truncate block">{confirmedBooking.drop}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Vehicle:</span>
                    <strong className="text-charcoal font-semibold">{confirmedBooking.cabType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Date &amp; Time:</span>
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

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <a
                    href={`https://wa.me/919742588995?text=Hello%20Orange%20Cab,%20I%20have%20confirmed%20Booking%20ID:%20${confirmedBooking.bookingId}%20for%20pickup%20at%20${encodeURIComponent(confirmedBooking.pickup)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto btn-accent text-xs font-bold !py-3 !px-6"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Track on WhatsApp</span>
                  </a>

                  <Link
                    to={`/track?bookingId=${confirmedBooking.bookingId}&phone=${confirmedBooking.phone}`}
                    className="w-full sm:w-auto btn-outline-dark text-xs font-bold !py-3 !px-6"
                  >
                    <span>Track Live Status</span>
                  </Link>

                  <button
                    onClick={() => {
                      setStep(1);
                      setConfirmedBooking(null);
                    }}
                    className="w-full sm:w-auto py-3 px-5 text-xs text-gray-500 hover:text-charcoal font-semibold"
                  >
                    New Booking
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
