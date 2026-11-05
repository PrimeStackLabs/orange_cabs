import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Phone,
  Mail,
  User,
  Sparkles,
  Copy,
  MessageCircle,
  Plane,
  BriefcaseBusiness,
  CarFront,
  CalendarDays,
  Clock3,
  Route,
  Layers3,
  Check
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { VEHICLE_IMAGE_FALLBACK, VEHICLE_IMAGES } from '../constants/vehicleImages';
import { useContactSettings } from '../context/ContactSettingsContext';

const SERVICE_OPTIONS = [
  { id: 'Airport Pickup & Drop', label: 'Airport Pickup & Drop', desc: 'Airport pickup or drop-off', icon: Plane },
  { id: 'Local Travel', label: 'Local Travel', desc: 'Transportation within your city', icon: MapPin },
  { id: 'Outstation Travel', label: 'Outstation Travel', desc: 'Travel between cities', icon: Route },
  { id: 'Corporate Travel', label: 'Corporate Travel', desc: 'Business and team transportation', icon: BriefcaseBusiness },
  { id: 'One-Way Transportation', label: 'One-Way Transportation', desc: 'Direct pickup and drop-off', icon: CarFront },
  { id: 'Wedding & Event Transportation', label: 'Wedding & Event Transportation', desc: 'Transportation for occasions', icon: CalendarDays },
  { id: 'One-Day Packages', label: 'One-Day Packages', desc: 'Vehicle booking for a day itinerary', icon: Layers3 },
  { id: 'Hourly Packages', label: 'Hourly Packages', desc: 'Vehicle booking for an hourly itinerary', icon: Clock3 }
];

const DEFAULT_VEHICLE_CATEGORIES = [
  { name: 'Hatchback', passengers: 4 },
  { name: 'Sedan', passengers: 4 },
  { name: 'SUV', passengers: 7 },
  { name: 'Luxury Cars', passengers: 4 },
  { name: 'Tempo Traveller', passengers: 13 }
];

const normalizeVehicleCategory = (category = '') => {
  const normalized = category.toLowerCase();
  if (normalized.includes('hatch') || normalized.includes('wagon') || normalized.includes('swift')) return 'Hatchback';
  if (normalized.includes('sedan')) return 'Sedan';
  if (normalized.includes('innova') || normalized.includes('ertiga') || normalized.includes('suv') || normalized.includes('mpv')) return 'SUV';
  if (normalized.includes('tempo') || normalized.includes('bus') || normalized.includes('coach') || normalized.includes('traveller')) return 'Tempo Traveller';
  if (normalized.includes('luxury') || normalized.includes('mercedes')) return 'Luxury Cars';
  return category;
};

const normalizeTimeInput = (time) => {
  const value = String(time || '').trim();
  const twelveHourTime = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourTime) {
    let hours = Number(twelveHourTime[1]) % 12;
    if (twelveHourTime[3].toUpperCase() === 'PM') hours += 12;
    return `${String(hours).padStart(2, '0')}:${twelveHourTime[2]}`;
  }
  return /^\d{2}:\d{2}$/.test(value) ? value : '09:00';
};

const getVehicleImage = (vehicle) => {
  const name = `${vehicle.name || ''} ${vehicle.category || ''}`.toLowerCase();
  if (name.includes('ertiga')) return VEHICLE_IMAGES.ertiga;
  if (name.includes('crysta')) return VEHICLE_IMAGES.crysta;
  if (name.includes('hycross')) return VEHICLE_IMAGES.hycross;
  if (name.includes('urbania')) return VEHICLE_IMAGES.urbania;
  if (name.includes('bharatbenz') || name.includes('bus') || name.includes('coach')) return VEHICLE_IMAGES.bharatbenzCoach;
  if (name.includes('wagonr') || name.includes('swift') || name.includes('hatchback')) return '/images/gallery_2.jpeg';
  if (name.includes('dzire') || name.includes('sedan')) return VEHICLE_IMAGES.dzire;
  return vehicle.image || VEHICLE_IMAGE_FALLBACK;
};

export default function BookCabPage() {
  const { whatsappHref } = useContactSettings();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialData = location.state || {};

  const requestedService = searchParams.get('service') || initialData.serviceType || '';
  const normalizedService = requestedService.toLowerCase();
  const serviceType = normalizedService.includes('airport')
    ? 'Airport Pickup & Drop'
    : normalizedService.includes('one-way') || normalizedService.includes('one way')
      ? 'One-Way Transportation'
      : normalizedService.includes('wedding') || normalizedService.includes('event')
        ? 'Wedding & Event Transportation'
        : normalizedService.includes('one-day') || normalizedService.includes('oneday')
          ? 'One-Day Packages'
          : normalizedService.includes('hourly')
            ? 'Hourly Packages'
            : normalizedService.includes('local')
              ? 'Local Travel'
        : normalizedService.includes('corporate') || normalizedService.includes('employee')
          ? 'Corporate Travel'
          : 'Outstation Travel';

  // Multi-step: 1 = Service & Route, 2 = Date & Vehicle, 3 = Passenger & Review, 4 = Confirmation
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    serviceType,
    pickup: searchParams.get('pickup') || initialData.pickup || 'Bangalore City',
    drop: searchParams.get('drop') || initialData.drop || 'Mysore',
    date: searchParams.get('date') || initialData.date || new Date().toISOString().split('T')[0],
    time: normalizeTimeInput(searchParams.get('time') || initialData.time || '09:00'),
    cabType: normalizeVehicleCategory(searchParams.get('vehicle') || initialData.cabType || initialData.category || 'SUV'),
    passengers: Number(searchParams.get('passengers') || initialData.passengers) || 2,
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);
  const [vehicleCategories, setVehicleCategories] = useState(DEFAULT_VEHICLE_CATEGORIES);
  const [outstationPricing, setOutstationPricing] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const bookingVehicles = availableVehicles.filter((vehicle) => (
    normalizeVehicleCategory(vehicle.category || vehicle.name) !== 'Luxury Cars'
  ));
  const selectedVehicle = bookingVehicles.find((vehicle) => vehicle._id === selectedVehicleId);
  const selectedVehicleCapacity = Number(
    selectedVehicle?.seatingCapacity || selectedVehicle?.passengers || 4
  );
  const pricingCategory = vehicleCategories.find((category) => (
    normalizeVehicleCategory(category.name) === normalizeVehicleCategory(selectedVehicle?.category || formData.cabType)
  ));
  const selectedVehicleRate = Number(selectedVehicle?.perKmRate ?? pricingCategory?.minRate);

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.get('/settings'), api.get('/vehicles?status=available')])
      .then(([settingsResult, vehiclesResult]) => {
        if (!active) return;

        if (settingsResult.status === 'fulfilled' && settingsResult.value.data.success) {
          const settings = settingsResult.value.data.settings;
          const categories = settings.vehicleCategories || [];
          if (categories.length) {
            setVehicleCategories(categories);
            setFormData((current) => ({
              ...current,
              cabType: categories.some(({ name }) => name === current.cabType)
                ? current.cabType
                : normalizeVehicleCategory(categories[0].name)
            }));
          }
          setOutstationPricing(settings.outstationPricing || null);
        } else {
          const error = settingsResult.status === 'rejected' ? settingsResult.reason : null;
          console.error('Failed to load booking categories and outstation terms:', error);
          toast.error('Current vehicle categories and pricing terms could not be loaded.');
        }

        if (vehiclesResult.status === 'fulfilled' && vehiclesResult.value.data.success) {
          const vehicles = vehiclesResult.value.data.vehicles || [];
          const bookableVehicles = vehicles.filter((vehicle) => (
            normalizeVehicleCategory(vehicle.category || vehicle.name) !== 'Luxury Cars'
          ));
          setAvailableVehicles(bookableVehicles);
          const initialVehicle = bookableVehicles.find((vehicle) => (
            normalizeVehicleCategory(vehicle.category) === normalizeVehicleCategory(formData.cabType)
          )) || bookableVehicles[0];
          if (initialVehicle) {
            setSelectedVehicleId(initialVehicle._id);
            setFormData((current) => ({
              ...current,
              cabType: normalizeVehicleCategory(initialVehicle.category)
            }));
          }
        } else {
          const error = vehiclesResult.status === 'rejected' ? vehiclesResult.reason : null;
          console.error('Failed to load available booking vehicles:', error);
          toast.error('Available vehicles could not be loaded.');
        }
      })
      .finally(() => {
        if (active) setVehiclesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F45B0B', '#FFB900', '#171717', '#FFFFFF']
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
    if (!selectedVehicleId || !selectedVehicle) {
      toast.error('Please select an available vehicle');
      return;
    }
    if (Number(formData.passengers) > selectedVehicleCapacity) {
      toast.error(`This vehicle accommodates up to ${selectedVehicleCapacity} passengers`);
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
        vehicle: selectedVehicleId,
        passengers: Number(formData.passengers) || 1,
        message: `[${formData.serviceType}] ${selectedVehicle?.name || formData.cabType}${formData.message ? ` - ${formData.message}` : ''}`,
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

  const steps = [
    { number: 1, title: 'Service & Route' },
    { number: 2, title: 'Date & Vehicle' },
    { number: 3, title: 'Passenger & Confirm' }
  ];

  return (
    <div className="booking-page min-h-screen bg-[#FFF9F2] pt-20 text-[#171717]">
      {step < 4 && (
        <section className="relative overflow-hidden bg-white">
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#FFF3D6] blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#F45B0B]/5 blur-2xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F45B0B]/15 bg-[#FFF3D6] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#D94308]">
                <span className="h-2 w-2 rounded-full bg-[#F45B0B]" />
                Centralized Online Dispatch
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-[#171717] sm:text-5xl lg:text-[56px]">
                Reserve Your <span className="text-[#F45B0B]">Journey</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
                Book certified chauffeurs, clear tariffs, and pristine vehicles with instant database confirmation.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#F45B0B]" /> Certified chauffeurs</span>
                <span className="inline-flex items-center gap-2"><Phone className="h-5 w-5 text-[#F45B0B]" /> 24/7 booking support</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-2xl lg:pl-5">
              <div className="absolute inset-x-7 bottom-2 top-7 rounded-[2rem] bg-gradient-to-br from-[#FFB900] to-[#F45B0B] sm:inset-x-10 sm:top-10" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-[#FFF3D6] p-3 shadow-[0_24px_70px_rgba(115,63,20,0.18)] sm:rounded-[2rem] sm:p-5">
                <img
                  src={VEHICLE_IMAGES.crysta}
                  alt="White Toyota Innova Crysta ready for your journey"
                  className="h-56 w-full rounded-[1.2rem] object-cover sm:h-72 lg:h-[350px]"
                />
                <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg sm:bottom-9 sm:left-9">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3D6] text-[#F45B0B]"><Car className="h-6 w-6" /></span>
                  <span><strong className="block text-sm font-bold text-[#171717]">Comfort, at every turn</strong><small className="text-xs text-gray-500">A vehicle for your kind of journey</small></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 lg:px-8">
        <div className="pointer-events-none absolute -left-20 top-56 h-60 w-60 rounded-full bg-[#FFB900]/10 blur-3xl" />

        {step < 4 && (
          <div className="relative z-10 mb-7 rounded-2xl border border-orange-100 bg-white px-4 py-5 shadow-[0_12px_36px_rgba(71,45,24,0.08)] sm:px-8">
            <div className="flex items-center justify-between">
              {steps.map((item, index) => {
                const isComplete = step > item.number;
                const isActive = step === item.number;
                return (
                  <React.Fragment key={item.number}>
                    <div className={`flex min-w-0 items-center gap-2.5 ${isActive || isComplete ? 'text-[#D94308]' : 'text-gray-400'}`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                        isActive ? 'bg-[#F45B0B] text-white shadow-md shadow-orange-200' : isComplete ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isComplete ? <Check className="h-4 w-4" /> : item.number}
                      </span>
                      <span className="hidden text-sm font-semibold sm:inline">{item.title}</span>
                      <span className="text-xs font-semibold sm:hidden">{item.number}/3</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`mx-2 h-0.5 min-w-5 flex-1 rounded-full transition-colors duration-300 sm:mx-5 ${step > item.number ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <section className="relative z-10 overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-[0_18px_60px_rgba(71,45,24,0.09)] sm:p-8 lg:p-10">
            
            {/* STEP 1: SERVICE & ROUTE */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="animate-fade-in space-y-7">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F45B0B]">Plan your ride</span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-[#171717] sm:text-3xl">
                    Step 1: Select Service &amp; Route
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">Choose your transportation category and enter pickup and drop points.</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {SERVICE_OPTIONS.map(svc => {
                    const isSelected = formData.serviceType === svc.id;
                    const ServiceIcon = svc.icon;
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, serviceType: svc.id }))}
                        aria-pressed={isSelected}
                        className={`group min-h-32 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F45B0B]/50 hover:shadow-md ${
                          isSelected
                            ? 'border-[#F45B0B] bg-[#FFF3D6] ring-1 ring-[#F45B0B]/20 shadow-sm'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isSelected ? 'bg-[#F45B0B] text-white' : 'bg-[#FFF3D6] text-[#F45B0B] group-hover:bg-[#F45B0B] group-hover:text-white'}`}>
                          <ServiceIcon className="h-5 w-5" />
                        </span>
                        <h4 className="font-heading text-sm font-bold text-[#171717] sm:text-base">{svc.label}</h4>
                        <p className="mt-1.5 text-sm leading-5 text-gray-500">{svc.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[#FFB900]/50 bg-[#FFF8E7] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#D94308] shadow-sm"><ShieldCheck className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <h4 className="font-heading text-base font-bold text-[#171717] sm:text-lg">Transparent pricing, no surprises</h4>
                      {outstationPricing ? (
                        <div className="mt-3 grid gap-x-6 gap-y-2 text-sm leading-6 text-gray-700 sm:grid-cols-2">
                          {['Outstation Travel', 'One-Way Transportation'].includes(formData.serviceType) && outstationPricing.minimumBillingDistance && (
                            <p><strong>Minimum billing distance:</strong> {outstationPricing.minimumBillingDistance} km, where applicable.</p>
                          )}
                          {outstationPricing.tollParkingInfo && <p>{outstationPricing.tollParkingInfo}</p>}
                          {outstationPricing.driverAllowanceInfo && <p>{outstationPricing.driverAllowanceInfo}</p>}
                          {outstationPricing.otherChargesInfo && <p>{outstationPricing.otherChargesInfo}</p>}
                          {outstationPricing.paymentDueInfo && <p>{outstationPricing.paymentDueInfo}</p>}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          Pricing terms are currently unavailable. Please contact dispatch to confirm applicable charges before booking.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 pt-1 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <MapPin className="h-4 w-4 text-[#F45B0B]" />
                      Pickup Location <span className="text-[#F45B0B]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={formData.pickup} onChange={(e) => setFormData({ ...formData, pickup: e.target.value })} placeholder="Enter pickup city" className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <MapPin className="h-4 w-4 text-[#F45B0B]" />
                      Drop Location <span className="text-[#F45B0B]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={formData.drop} onChange={(e) => setFormData({ ...formData, drop: e.target.value })} placeholder="Enter drop city" className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span>Secure booking · Clear quote before travel</span>
                  </div>
                  <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                    Proceed to Vehicle Selection <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DATE, TIME & VEHICLE SELECTION */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="animate-fade-in space-y-7">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F45B0B]">Make it yours</span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-[#171717] sm:text-3xl">
                    Step 2: Date &amp; Vehicle
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">Choose your pickup schedule and the right vehicle for your trip.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Calendar className="h-4 w-4 text-[#F45B0B]" /> Journey Date <span className="text-[#F45B0B]">*</span>
                    </label>
                    <input type="date" required value={formData.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Clock className="h-4 w-4 text-[#F45B0B]" /> Pickup Time <span className="text-[#F45B0B]">*</span>
                    </label>
                    <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Users className="h-4 w-4 text-[#F45B0B]" /> Passengers
                    </label>
                    <select value={formData.passengers} onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10">
                      {Array.from({ length: Math.min(26, selectedVehicleCapacity) }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <h4 className="font-heading text-lg font-bold text-[#171717]">Choose your vehicle</h4>
                      <p className="mt-1 text-sm text-gray-500">Rates are loaded from current fleet and admin pricing settings.</p>
                    </div>
                    {selectedVehicle && <span className="text-sm font-semibold text-[#D94308]">{selectedVehicle.name} selected</span>}
                  </div>

                  {vehiclesLoading ? (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">Loading available vehicles…</div>
                  ) : bookingVehicles.length === 0 ? (
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center text-sm text-gray-700">
                      No vehicles are currently available to book. Please contact dispatch for assistance.
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bookingVehicles.map((vehicle) => {
                      const isSelected = vehicle._id === selectedVehicleId;
                      const vehicleCategory = vehicleCategories.find((category) => (
                        normalizeVehicleCategory(category.name) === normalizeVehicleCategory(vehicle.category || vehicle.name)
                      ));
                      const hasVehicleRate = vehicle.perKmRate !== null && vehicle.perKmRate !== undefined && vehicle.perKmRate !== '';
                      const rate = Number(hasVehicleRate ? vehicle.perKmRate : vehicleCategory?.minRate);
                      const maxRate = hasVehicleRate ? Number.NaN : Number(vehicleCategory?.maxRate);
                      const capacity = Number(vehicle.seatingCapacity || vehicle.passengers || vehicleCategory?.passengers);
                      const hasAc = vehicle.acAvailable === true || vehicle.features?.some((feature) => /\bac\b|a\/c|air.?conditioning/i.test(feature)) || /ac/i.test(vehicle.name);
                      return (
                        <article key={vehicle._id} className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'border-[#F45B0B] ring-2 ring-[#F45B0B]/20 shadow-md' : 'border-gray-200 hover:border-orange-200'}`}>
                          <div className="relative h-40 overflow-hidden bg-[#FFF3D6]">
                            <img src={getVehicleImage(vehicle)} alt={vehicle.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = VEHICLE_IMAGE_FALLBACK; }} />
                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#D94308] shadow-sm">{normalizeVehicleCategory(vehicle.category || vehicle.name)}</span>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-heading text-base font-bold leading-5 text-[#171717]">{vehicle.name}</h5>
                              <span className="shrink-0 text-right text-sm font-extrabold text-[#D94308]">
                                {Number.isFinite(rate) ? <>₹{rate}{Number.isFinite(maxRate) && maxRate > rate ? `–₹${maxRate}` : ''}<small className="block text-xs font-medium text-gray-500">per km</small></> : <small className="font-semibold text-gray-500">Quote on request</small>}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
                              <span className="rounded-lg bg-gray-50 px-2.5 py-1.5">{capacity || '—'} seats</span>
                              <span className="rounded-lg bg-gray-50 px-2.5 py-1.5">{vehicle.luggageCapacity || '—'} bags</span>
                              <span className="rounded-lg bg-gray-50 px-2.5 py-1.5">{hasAc ? 'AC available' : 'AC on request'}</span>
                            </div>
                            <button type="button" onClick={() => {
                              setSelectedVehicleId(vehicle._id);
                              setFormData((current) => ({
                                ...current,
                                cabType: normalizeVehicleCategory(vehicle.category || vehicle.name),
                                passengers: Math.min(Number(current.passengers) || 1, capacity || Number(current.passengers) || 1)
                              }));
                            }} aria-pressed={isSelected} className={`mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${isSelected ? 'bg-[#FFF3D6] text-[#D94308]' : 'bg-[#F45B0B] text-white hover:bg-[#D94308]'}`}>
                              {isSelected ? <><Check className="h-4 w-4" /> Selected</> : 'Select Vehicle'}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:border-[#F45B0B] hover:text-[#D94308] sm:justify-start"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Route
                  </button>
                  <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                    Proceed to Passenger Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PASSENGER DETAILS & SUMMARY REVIEW */}
            {step === 3 && (
              <form onSubmit={handleSubmitBooking} className="animate-fade-in space-y-7">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F45B0B]">Almost there</span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-[#171717] sm:text-3xl">
                    Step 3: Passenger &amp; Confirm
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">Review your trip and share passenger details to request the booking.</p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-[#FFF9F2] p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Booking summary</span>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[#D94308] hover:underline">Edit trip</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ['Service', formData.serviceType],
                      ['Pickup', formData.pickup],
                      ['Drop', formData.drop],
                      ['Travel date', formData.date],
                      ['Pickup time', formData.time],
                      ['Vehicle', selectedVehicle?.name || formData.cabType],
                      ['Passengers', String(formData.passengers)],
                      ['Per-kilometre rate', Number.isFinite(selectedVehicleRate) ? `₹${selectedVehicleRate}/km` : 'To be confirmed by dispatch']
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0 rounded-xl border border-white bg-white p-3.5">
                        <span className="block text-xs font-medium text-gray-500">{label}</span>
                        <strong className="mt-1 block break-words text-sm font-bold text-[#171717]">{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <User className="h-4 w-4 text-[#F45B0B]" /> Full Name <span className="text-[#F45B0B]">*</span>
                    </label>
                    <input type="text" required autoComplete="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Phone className="h-4 w-4 text-[#F45B0B]" /> Mobile Number <span className="text-[#F45B0B]">*</span>
                    </label>
                    <input type="tel" required autoComplete="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone number" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Mail className="h-4 w-4 text-[#F45B0B]" /> Email Address
                    </label>
                    <input type="email" autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#171717]">
                      <Users className="h-4 w-4 text-[#F45B0B]" /> Number of Passengers
                    </label>
                    <select value={formData.passengers} onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10">
                      {Array.from({ length: Math.min(26, selectedVehicleCapacity) }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#171717]">Special Instructions</label>
                    <textarea rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Any accessibility needs or special requests?" className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-base outline-none transition focus:border-[#F45B0B] focus:ring-4 focus:ring-[#F45B0B]/10" />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:border-[#F45B0B] hover:text-[#D94308] sm:justify-start"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Confirming booking…</>
                    ) : (
                      <><Sparkles className="h-4 w-4" /> Confirm Booking</>
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
                    Your ride has been logged into the Orange Cars dispatch command server. A chauffeur assignment update will be transmitted to your phone.
                  </p>
                </div>

                {/* Reference ID Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs uppercase tracking-wider text-gray-500 block font-semibold">Booking Reference ID</span>
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
                    href={whatsappHref
                      ? `${whatsappHref}?text=Hello%20Orange%20Cab,%20I%20have%20confirmed%20Booking%20ID:%20${confirmedBooking.bookingId}%20for%20pickup%20at%20${encodeURIComponent(confirmedBooking.pickup)}.`
                      : undefined}
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

        </section>
      </div>
    </div>
  );
}
