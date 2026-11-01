import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  Navigation,
  Headphones,
  Users,
  User,
  Compass,
  Building2,
  Plane,
  Briefcase,
  Luggage,
  Wind,
  Phone,
  MessageCircle,
  HelpCircle,
  Calendar,
  Layers,
  HeartHandshake,
  Check,
  FileText,
  Headset,
  CarFront,
  Handshake,
  BadgeCheck,
  Quote,
  Target,
  BarChart3,
  IndianRupee,
  Route,
  BriefcaseBusiness,
  Fuel,
  Armchair,
  Crown
} from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import { useBookingModal } from '../context/BookingModalContext';
import api from '../services/api';
import { VEHICLE_IMAGES, VEHICLE_IMAGE_FALLBACK } from '../constants/vehicleImages';
import toast from 'react-hot-toast';

// Testimonials
const TESTIMONIALS = [
  {
    name: 'Karthik Subramanian',
    company: 'VP Engineering, Tech Global',
    comment: 'Orange Cars has handled our international client delegations for 3 years. The Innova Crystas are spotlessly maintained, and chauffeurs always arrive 15 minutes ahead of schedule.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Ananya Deshmukh',
    company: 'Creative Director, Studio 9',
    comment: 'Booked an outstation trip from Bangalore to Coorg for our leadership offsite. Chauffeur Anand navigated the hill curves with extreme care. Fixed pricing, no surprises, impeccable experience!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Dr. Arvind Nambiar',
    company: 'Senior Consultant Cardiologist',
    comment: 'I take early morning flights twice a week. With Orange Cars, I never experience driver cancellations or airport surge pricing. Truly a gold standard in automotive transport.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Sneha Hegde',
    company: 'Head of Operations, FinTech Solutions',
    comment: 'Their Force Urbania was outstanding for our team excursion. Comfortable reclining captain seats, dual AC, and courteous hospitality throughout.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  }
];

// Exactly 6 FAQs as required
const FAQS = [
  {
    q: 'How can I book a cab?',
    a: 'You can book a ride seamlessly using our online booking widget on the homepage, clicking "Book Your Ride" at the top of any page, or calling our 24/7 hotline at +91 97425 88995. Instant confirmation with a unique booking reference ID is sent to your screen and via WhatsApp.'
  },
  {
    q: 'Which cities do you serve?',
    a: 'We operate primary corporate, airport, and luxury fleet hubs in Bangalore, serving all Karnataka districts (Mysore, Coorg, Ooty, Chikmagalur, Hampi, Mangalore) as well as interstate highways connecting Chennai, Hyderabad, Coimbatore, and Goa.'
  },
  {
    q: 'Can I book an airport transfer?',
    a: 'Yes. We specialize in 24/7 Kempegowda International Airport (BLR) transfers for both Terminal 1 and Terminal 2. Our dispatch engine automatically tracks your flight number, adjusting pickup times for delays, with complimentary waiting time and terminal curbside assistance.'
  },
  {
    q: 'Do you provide corporate transportation?',
    a: 'Absolutely. Orange Cars manages enterprise employee transportation (ETS), daily office shuttles, executive boardroom chauffeur cars, and event mobility for 100+ corporate clients with centralized billing, GST compliance, and GPS telematics.'
  },
  {
    q: 'How can I cancel a booking?',
    a: 'Cancellations are completely hassle-free and free of charge when requested up to 2 hours prior to your scheduled pickup. You can cancel by contacting our 24/7 dispatch desk on WhatsApp or calling +91 97425 88995.'
  },
  {
    q: 'How can I contact customer support?',
    a: 'Our dispatch command center is available 24/7, 365 days a year. You can call our direct helpline at +91 97425 88995, chat with us on WhatsApp, or email us at info@orangecab.in.'
  }
];

const HERO_VEHICLES = [
  { name: 'Toyota Innova Crysta', category: 'Premium MPV', image: VEHICLE_IMAGES.crysta },
  { name: 'Maruti Dzire', category: 'Sedan', image: VEHICLE_IMAGES.dzire },
  { name: 'Maruti Ertiga', category: 'SUV / MPV', image: VEHICLE_IMAGES.ertiga },
  { name: 'Toyota Innova Hycross', category: 'Premium MPV', image: VEHICLE_IMAGES.hycross },
  { name: 'Force Urbania', category: 'Tempo Traveller', image: VEHICLE_IMAGES.urbania },
  { name: 'BharatBenz Traveller', category: 'Tourist Coach', image: VEHICLE_IMAGES.bharatbenzCoach }
];

export default function Home() {
  const { openBookingModal } = useBookingModal();

  const [activeHeroVehicle, setActiveHeroVehicle] = useState(0);
  // Testimonial Carousel Index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // FAQ Accordion Active Index
  const [openFaq, setOpenFaq] = useState(0);

  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [outstationPricing, setOutstationPricing] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroVehicle((current) => (current + 1) % HERO_VEHICLES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.get('/settings'), api.get('/services')])
      .then(([settingsResult, servicesResult]) => {
        if (!active) return;

        if (settingsResult.status === 'fulfilled' && settingsResult.value.data.success) {
          setVehicleCategories(settingsResult.value.data.settings.vehicleCategories || []);
          setOutstationPricing(settingsResult.value.data.settings.outstationPricing || null);
        } else {
          const error = settingsResult.status === 'rejected'
            ? settingsResult.reason
            : new Error(settingsResult.value.data?.message || 'Settings API returned an unsuccessful response.');
          console.error('Failed to load vehicle category pricing:', error);
          toast.error('Vehicle pricing could not be loaded.');
        }

        if (servicesResult.status === 'fulfilled' && servicesResult.value.data.success) {
          setServices(servicesResult.value.data.services || []);
        } else {
          const error = servicesResult.status === 'rejected'
            ? servicesResult.reason
            : new Error(servicesResult.value.data?.message || 'Services API returned an unsuccessful response.');
          console.error('Failed to load public services:', error);
          toast.error('Services could not be loaded.');
        }
      })
      .finally(() => {
        if (active) setContentLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#FFF9F2] text-[#171717] overflow-hidden">
      
      {/* ======================================================== */}
      {/* B. PREMIUM SPLIT-SCREEN HERO                             */}
      {/* ======================================================== */}
      <section className="homepage-hero page-hero-surface relative overflow-hidden px-4 pb-10 pt-24 text-[#242424] sm:px-6 sm:pt-28 lg:px-8 lg:pb-12">
        <div className="relative z-10 mx-auto w-full max-w-[1580px]">
          <div className="homepage-hero__composition relative">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="homepage-hero__top-swoosh absolute -right-40 -top-64 hidden h-[760px] w-[920px] rotate-[-14deg] rounded-[48%] bg-gradient-to-br from-[#FFD25D] via-[#FF9C00] to-[#F45B0B] lg:block" />
              <div className="homepage-hero__top-swoosh-inner absolute -right-24 -top-52 hidden h-[610px] w-[760px] rotate-[-14deg] rounded-[48%] bg-gradient-to-br from-[#FFB900] to-[#F45B0B] lg:block" />
              <svg
                className="homepage-hero__city absolute bottom-[-1.25rem] left-[-2rem] hidden h-36 w-[38rem] text-white/65 lg:block"
                viewBox="0 0 620 150"
                fill="currentColor"
              >
                <path d="M0 148h620v-12h-24v-34h-15v34h-13V72h-8V49h-5V28h-5v21h-6v23h-9v64h-13v-43h-10v43h-12v-29h-10v29h-17V94h-12V77h-7V54h-4V36h-4V20h-5v16h-5v18h-6v23h-9v17h-10v43h-14v-25h-12v25h-14v-40h-13v-29h-7V76h-7V58h-4V39h-5V18h-5v21h-5v19h-7v18h-7v29h-11v38h-13v-26h-12v26h-15v-41h-12V73h-7V52h-5V31h-5V14h-5v17h-5v21h-6v21h-9v27h-12v48h-13v-28h-11v28h-16v-39h-12v-26h-8V79h-7V59h-5V40h-5V22h-5v18h-5v19h-7v20h-7v26h-12v43H0z" />
              </svg>
              <svg
                className="homepage-hero__bottom-wave absolute bottom-[-1rem] left-[-5rem] hidden h-36 w-[70%] lg:block"
                viewBox="0 0 1100 150"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 51C174 94 283 137 450 126c137-9 223-57 362-48 114 8 175 49 288 55v17H0z" fill="#FFB900" opacity=".58" />
                <path d="M0 87c169 37 258 72 415 60 163-13 239-54 376-48 131 5 205 39 309 51v17H0z" fill="#F45B0B" opacity=".9" />
              </svg>
            </div>

            <div className="relative z-10 grid items-center gap-8 md:grid-cols-2 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[45fr_55fr] lg:gap-12">
            <div className="max-w-2xl py-5 md:py-10 lg:py-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex min-h-11 items-center gap-3 rounded-full border border-[#FFD68E] bg-[#FFF1D2] px-5 py-2 text-[13px] font-extrabold tracking-wide text-[#D94308] shadow-sm sm:text-sm"
              >
                <CarFront className="h-5 w-5 text-accentOrange" />
                <span>PREMIUM CAB SERVICES</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="max-w-[700px] font-heading text-[clamp(2.4rem,5vw,4.25rem)] font-black leading-[1.02] tracking-[-0.045em] text-[#171717]"
              >
                Your <span className="homepage-hero__journey relative inline-block text-accentOrange">Journey</span>,<br />
                Our Priority.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-5 max-w-xl text-[15px] font-medium leading-7 text-[#62666d] sm:text-[17px] sm:leading-8"
              >
                Experience comfortable, reliable and affordable travel with Orange Cars. Your destination, our commitment.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
                className="mt-7 flex flex-wrap items-center gap-3.5"
              >
                <button
                  onClick={() => openBookingModal()}
                  className="btn-primary min-h-[58px] text-sm !px-7 !py-3.5 shadow-[0_12px_24px_rgba(217,67,8,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(217,67,8,0.28)] sm:text-base"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Your Ride</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#fleet-section"
                  className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-full border border-[#D8D8D8] bg-white/90 px-6 py-3.5 text-sm font-bold text-[#171717] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accentOrange hover:text-accentOrange hover:shadow-lg sm:text-base"
                >
                  <CarFront className="h-5 w-5 text-accentOrange" />
                  <span>Explore Our Fleet</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="mt-8 grid grid-cols-2 gap-3 border-t border-[#e9e1d8] pt-6 text-sm font-semibold text-[#33363a] min-[850px]:grid-cols-3"
              >
                <div className="flex min-h-12 items-center gap-3 min-[850px]:border-r min-[850px]:border-[#e4ddd5] min-[850px]:pr-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0CC] text-accentOrange sm:h-12 sm:w-12"><User className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                  <span>Verified<br className="hidden min-[850px]:block" /> Chauffeurs</span>
                </div>
                <div className="flex min-h-12 items-center gap-3 min-[850px]:border-r min-[850px]:border-[#e4ddd5] min-[850px]:px-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0CC] text-accentOrange sm:h-12 sm:w-12"><Headphones className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                  <span>24/7 Customer<br className="hidden min-[850px]:block" /> Support</span>
                </div>
                <div className="flex min-h-12 items-center gap-3 min-[850px]:pl-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0CC] text-accentOrange sm:h-12 sm:w-12"><ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" /></span>
                  <span>Transparent<br className="hidden min-[850px]:block" /> Pricing</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="relative mx-auto w-full max-w-[900px] min-w-0"
            >
              <div className="absolute -inset-5 rounded-[3.5rem] bg-gradient-to-br from-orange-200/80 via-white/20 to-amber-200/80 blur-2xl" />
              <div className="relative aspect-[1.2/1] overflow-hidden rounded-[2rem] border-[5px] border-white bg-gradient-to-br from-[#fffdfa] to-[#eeeae5] shadow-[0_30px_75px_rgba(92,50,21,0.2)] sm:aspect-[1.4/1] sm:rounded-[2.75rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={HERO_VEHICLES[activeHeroVehicle].image}
                    src={HERO_VEHICLES[activeHeroVehicle].image}
                    alt={`${HERO_VEHICLES[activeHeroVehicle].name} ${HERO_VEHICLES[activeHeroVehicle].category} cab`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                    initial={{ opacity: 0, x: 18, scale: 0.985 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -18, scale: 0.985 }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#171717]/45 via-[#171717]/10 to-transparent" />

                <div className="homepage-hero__vehicle-card absolute bottom-4 left-4 z-10 flex max-w-[78%] gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_12px_30px_rgba(31,25,20,0.2)] backdrop-blur-md sm:bottom-6 sm:left-6 sm:gap-4 sm:px-5 sm:py-4">
                  <span className="w-1 shrink-0 rounded-full bg-gradient-to-b from-[#F45B0B] to-[#FFB900]" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-accentOrange sm:text-xs">
                      Orange signature fleet
                    </span>
                    <span className="mt-0.5 block truncate text-[15px] font-extrabold leading-tight text-[#171717] sm:text-xl">
                      {HERO_VEHICLES[activeHeroVehicle].name}
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-gray-600 sm:text-sm">
                      {HERO_VEHICLES[activeHeroVehicle].category}
                    </span>
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
                  <button
                    type="button"
                    aria-label="Show previous vehicle"
                    onClick={() => setActiveHeroVehicle((current) => (current - 1 + HERO_VEHICLES.length) % HERO_VEHICLES.length)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-gray-800 shadow-lg transition hover:scale-105 hover:border-accentOrange hover:bg-accentOrange hover:text-white sm:h-12 sm:w-12"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Show next vehicle"
                    onClick={() => setActiveHeroVehicle((current) => (current + 1) % HERO_VEHICLES.length)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-gray-800 shadow-lg transition hover:scale-105 hover:border-accentOrange hover:bg-accentOrange hover:text-white sm:h-12 sm:w-12"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2.5" aria-label="Choose a vehicle">
                {HERO_VEHICLES.map((vehicle, index) => (
                  <button
                    key={vehicle.name}
                    type="button"
                    aria-label={`Show ${vehicle.name}`}
                    aria-current={index === activeHeroVehicle ? 'true' : undefined}
                    onClick={() => setActiveHeroVehicle(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeHeroVehicle ? 'w-7 bg-accentOrange' : 'w-2.5 bg-gray-300 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
          </div>

          <div className="relative z-20 mt-10 w-full sm:mt-14">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* C. PREMIUM FLEET SHOWCASE                                */}
      {/* ======================================================== */}
      <section id="fleet-section" className="homepage-fleet relative isolate overflow-hidden py-12 sm:py-14 lg:py-16">
        <div className="relative z-10 mx-auto max-w-[1580px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFD68E] bg-[#FFF1D2] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#D94308]">
              <CarFront className="h-4 w-4" />
              Orange Cars Fleet
            </span>
            <h2 className="font-heading text-3xl font-black tracking-tight text-[#171717] sm:text-4xl lg:text-[44px]">
              Vehicle <span className="text-[#E84310]">Categories</span>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-6 text-[#62666d] sm:text-base">
              Find the right ride for every journey, with comfortable options and transparent starting rates for local and outstation travel.
            </p>
            <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#FFB900]" />
            <Link
              to="/fleet"
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold text-[#D94308] transition-colors hover:bg-white/70"
            >
              Explore our full fleet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {contentLoading
              ? Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-[360px] animate-pulse rounded-[24px] bg-white/90 shadow-sm" />
              ))
              : vehicleCategories.map((vehicle, idx) => (
                (() => {
                  const name = vehicle.name.toLowerCase();
                  const details = name.includes('hatch')
                    ? { points: ['Ideal for short trips', 'Fuel-efficient & economical'], icons: [BriefcaseBusiness, Fuel] }
                    : name.includes('sedan')
                      ? { points: ['Comfortable for city & outstation', 'Spacious & smooth ride'], icons: [BriefcaseBusiness, Armchair] }
                      : name.includes('suv')
                        ? { points: ['Spacious for families & groups', 'Top comfort & safety'], icons: [Users, ShieldCheck] }
                        : name.includes('luxury')
                          ? { points: ['Premium travel experience', 'Ideal for business & VIP travel'], icons: [Crown, Star] }
                          : { points: ['Perfect for group travel', 'Ideal for tours & corporate trips'], icons: [Users, BriefcaseBusiness] };
                  const VehicleIcon = name.includes('luxury') ? Crown : name.includes('suv') ? ShieldCheck : CarFront;

                  return (
                    <motion.article
                      key={`${vehicle.name}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      className={`homepage-fleet-card group relative flex min-w-0 flex-col overflow-visible rounded-[24px] border bg-white/95 p-3.5 shadow-[0_12px_30px_rgba(65,44,22,0.09)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(65,44,22,0.15)] ${
                        name.includes('suv') ? 'border-[#F45B0B] ring-1 ring-[#F45B0B]/25' : 'border-white'
                      }`}
                    >
                      {name.includes('suv') && (
                        <span className="absolute -top-3 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#FF9D00] to-[#E84310] px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                          <Crown className="h-3.5 w-3.5" />
                          Most Preferred
                        </span>
                      )}

                      <div className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[18px] bg-[radial-gradient(ellipse_at_55%_78%,#FFE2B1_0%,#FFF8EC_54%,#fff_82%)] sm:h-[164px]">
                        <span aria-hidden="true" className="absolute -bottom-8 left-1/2 h-20 w-[90%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-[#FFE9C6] via-[#FFB32C] to-[#FF8A00] opacity-90" />
                        <img
                          src={vehicle.image || VEHICLE_IMAGE_FALLBACK}
                          alt={`${vehicle.name} vehicle`}
                          loading="lazy"
                          className="relative z-10 h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                          }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col px-1 pt-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="min-w-0 font-heading text-lg font-extrabold leading-tight text-[#171717] sm:text-xl">
                            {vehicle.name}
                          </h3>
                          <div className="shrink-0 rounded-xl bg-[#FFF3DF] px-2.5 py-1.5 text-right">
                            <span className="block whitespace-nowrap text-[10px] font-semibold text-[#4c4c4c]">Starting from</span>
                            <strong className="block whitespace-nowrap text-base font-black leading-5 text-[#D94308]">
                              ₹{vehicle.minRate}{vehicle.maxRate > vehicle.minRate ? `–₹${vehicle.maxRate}` : ''}<span className="text-xs">/km</span>
                            </strong>
                          </div>
                        </div>

                        {vehicle.passengers && (
                          <div className="mt-2 flex items-center gap-2 border-b border-[#eee4d8] pb-2.5 text-sm font-semibold text-[#334155]">
                            <Users className="h-4 w-4 shrink-0 text-[#D94308]" />
                            <span>{vehicle.passengers} Passengers</span>
                          </div>
                        )}

                        <div className="my-2.5 space-y-1.5">
                          {details.points.map((point, pointIndex) => {
                            const PointIcon = details.icons[pointIndex];
                            return (
                              <p key={point} className="flex items-center gap-2 text-[12px] font-medium leading-4 text-[#334155]">
                                <PointIcon className="h-4 w-4 shrink-0 text-[#E84310]" />
                                <span>{point}</span>
                              </p>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => openBookingModal({
                            cabType: vehicle.name,
                            category: vehicle.name,
                            passengers: vehicle.passengers || 1
                          })}
                          className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-3 py-2 text-sm font-extrabold text-white shadow-[0_8px_16px_rgba(217,67,8,0.17)] transition-all hover:brightness-110"
                        >
                          Book Now
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })()
              ))}
          </div>

          {!contentLoading && vehicleCategories.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-600">Vehicle categories are temporarily unavailable. Please contact us for current options.</p>
          )}

          {outstationPricing && (
            <div className="homepage-fleet-pricing mt-6 grid overflow-hidden rounded-[22px] border border-[#F5D7B5] bg-white/95 shadow-[0_14px_36px_rgba(65,44,22,0.1)] lg:grid-cols-[minmax(260px,1.25fr)_2.75fr]">
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#FFF0D1] to-[#FFF9F0] p-5 sm:p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB900] to-[#F45B0B] text-white shadow-md">
                  <MapPin className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-heading text-xl font-black leading-tight text-[#171717] sm:text-2xl">
                    Outstation Pricing, <span className="text-[#D94308]">Clearly Explained</span>
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#555]">
                    Know how your outstation fare is calculated and what’s included.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  {
                    title: 'Minimum Billing Distance',
                    value: `${outstationPricing.minimumBillingDistance} km`,
                    icon: Route
                  },
                  { title: 'Toll & Parking Charges', value: outstationPricing.tollParkingInfo, icon: BriefcaseBusiness },
                  { title: 'Driver Allowance', value: outstationPricing.driverAllowanceInfo, icon: User },
                  { title: 'Other Applicable Charges', value: outstationPricing.otherChargesInfo, icon: FileText },
                  { title: 'Final Payment', value: outstationPricing.paymentDueInfo, icon: IndianRupee }
                ].map(({ title, value, icon: Icon }) => (
                  <div key={title} className="flex min-h-[130px] flex-col items-center justify-center border-b border-[#f1d8c0] px-3 py-4 text-center last:border-b-0 sm:border-b-0">
                    <Icon className="mb-2 h-6 w-6 text-[#E84310] sm:h-7 sm:w-7" />
                    <span className="text-xs font-bold leading-4 text-[#252525]">{title}</span>
                    <span className="mt-1 text-xs font-medium leading-4 text-[#555]">
                      {title === 'Minimum Billing Distance' ? value : value || 'As stated in confirmed quote'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* D. SERVICES SECTION                                      */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-orange mb-3">Comprehensive Mobility Solutions</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
              Crafted For <span className="text-accentOrange">Every Occasion</span>
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Choose the service that fits your plans and send us your booking details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentLoading
              ? Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-3xl bg-gray-50" />
              ))
              : services.map((service, idx) => (
              <motion.div
                key={service._id || service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="luxury-card overflow-hidden flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                  />
                  {service.badge && <div className="absolute top-4 left-4">
                    <span className="badge-pill-red !bg-white/90 !text-brandRed !border-none shadow-sm backdrop-blur-sm">
                      {service.badge}
                    </span>
                  </div>}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-brandRed transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => openBookingModal({ serviceType: service.title })}
                      className="btn-accent flex w-full items-center justify-center gap-2 text-xs font-bold !py-2.5"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
              ))}
          </div>
          {!contentLoading && services.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-600">Services are temporarily unavailable. Please contact us for assistance.</p>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* F. WHY CHOOSE Orange Cars? (Split Layout)                 */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Real Luxury Cab Photograph */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <video
                  src="/videos/hero_animation.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center max-h-[680px]"
                />
              </div>
            </motion.div>

            {/* Right: Heading, Description & 4 Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="badge-pill-red">The Orange Cars Difference</span>
              
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Setting The Benchmark In <span className="text-accentOrange">Premium Mobility</span>
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                We combine technological precision with warm executive hospitality. Whether travelling across cities or catching an early morning international flight, our fleet and chauffeurs ensure peace of mind.
              </p>

              {/* 4 Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                
                {/* 1. Professional Chauffeurs */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-brandRed/10 text-brandRed flex items-center justify-center mb-3">
                    <User className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-charcoal">1. Professional Chauffeurs</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Police-verified, commercially licensed chauffeurs trained in highway etiquette and defensive driving.
                  </p>
                </div>

                {/* 2. Safe & Secure Journeys */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accentYellow/20 text-[#D94308] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-charcoal">2. Safe & Secure Journeys</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Real-time GPS telematics, speed limit governors, and 24/7 centralized SOS control room monitoring.
                  </p>
                </div>

                {/* 3. On-Time Pickup */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accentOrange/10 text-accentOrange flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-charcoal">3. On-Time Pickup</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    99.8% proven punctuality record. Drivers arrive 15 minutes ahead of scheduled dispatch.
                  </p>
                </div>

                {/* 4. Transparent Pricing */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accentOrange/10 text-accentOrange flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-charcoal">4. Transparent Pricing</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Fixed per-km billing with zero surge pricing anxiety, clear GST invoicing, and no hidden charges.
                  </p>
                </div>

              </div>

              <div className="pt-2">
                <button
                  onClick={() => openBookingModal()}
                  className="btn-primary text-sm !py-3 !px-7 shadow-glow-red"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Experience The Difference</span>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* G. CORPORATE TRANSPORTATION */}
      <section className="relative overflow-hidden bg-[#FFF9F2] py-16 text-[#171717] sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-36 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#FFB900]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#F45B0B]/10 blur-3xl" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true" viewBox="0 0 1440 700" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 560C180 560 155 350 430 350S690 560 930 560 1190 315 1540 315" stroke="#F45B0B" strokeWidth="2" strokeDasharray="8 12" />
          <circle cx="430" cy="350" r="7" fill="#FFB900" />
          <circle cx="930" cy="560" r="7" fill="#F45B0B" />
        </svg>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F45B0B]/15 bg-[#FFF3D6] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#D94308]">
                <Building2 className="h-4 w-4" />
                Enterprise Mobility Hub
              </span>

              <h2 className="max-w-3xl font-heading !text-4xl font-extrabold leading-[1.08] tracking-tight text-[#171717] sm:!text-5xl lg:!text-[52px]">
                Your Trusted <span className="bg-gradient-to-r from-[#D94308] via-[#F45B0B] to-[#FFB900] bg-clip-text text-transparent">Corporate Mobility</span> <span className="text-accentOrange">Partner</span>
              </h2>

              <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                Streamline employee transit, executive business trips, and client delegations with enterprise-grade mobility solutions built for operational scale.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Employee Transportation (ETS)', icon: Users },
                  { label: 'Enterprise Mobility Management', icon: Layers },
                  { label: 'Kempegowda Airport Transfers', icon: Plane },
                  { label: 'Monthly Consolidated GST Billing', icon: FileText },
                  { label: 'Dedicated Account Manager', icon: Headset },
                  { label: 'Customized Travel Solutions', icon: CarFront }
                ].map(({ label, icon: BenefitIcon }) => (
                  <div key={label} className="flex min-h-[58px] items-center gap-3 rounded-xl border border-orange-100/80 bg-white/85 px-3.5 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F45B0B]/30 hover:shadow-md sm:px-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F45B0B] to-[#D94308] text-white shadow-sm">
                      <BenefitIcon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold leading-5 text-[#292929] sm:text-[15px]">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openCorporateProposal'))}
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#FFB900] px-6 py-3 text-sm font-bold text-[#171717] shadow-md shadow-orange-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:px-7 sm:text-base"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Request Corporate Proposal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="tel:+919742588995"
                  className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-[#D94308]/50 bg-white/80 px-6 py-3 text-sm font-bold text-[#D94308] transition duration-200 hover:-translate-y-0.5 hover:border-[#F45B0B] hover:bg-[#FFF3D6] sm:px-7 sm:text-base"
                >
                  <Phone className="h-5 w-5" />
                  <span>Speak to Key Accounts</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-[24px] border border-[#F45B0B]/40 bg-[#171717] p-5 text-white shadow-[0_24px_70px_rgba(23,23,23,0.2)] sm:p-7 lg:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F45B0B]/15 text-[#FF8A36]">
                    <Handshake className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-white sm:text-base">
                    Enterprise <span className="text-[#FF9A2E]">Mobility SLA</span>
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                  Tier-1 Certified
                </span>
              </div>

              <div className="mt-5 space-y-3.5">
                {[
                  { title: '20-Minute Replacement Guarantee', description: 'Dedicated reserve vehicles stationed on standby near major tech hubs.', icon: Clock },
                  { title: '100% Statutory & Police Compliance', description: 'Background-verified chauffeurs with annual biometric and health clearance.', icon: ShieldCheck },
                  { title: 'Centralized GST & MIS Invoicing', description: 'Automated trip logs, route telemetry, and itemized monthly invoices.', icon: FileText }
                ].map(({ title, description, icon: SlaIcon }) => (
                  <div key={title} className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition duration-200 hover:border-[#F45B0B]/40 hover:bg-white/[0.08] sm:p-4.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F45B0B]/15 text-[#FF9A2E] transition-colors group-hover:bg-[#F45B0B]/25">
                      <SlaIcon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-bold leading-6 text-white sm:text-[17px]">{title}</h3>
                      <p className="mt-1 text-sm leading-5 text-gray-300">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Headset className="h-5 w-5 text-[#FF9A2E]" />
                  Duty Manager Hotline
                </span>
                <a href="tel:+919742588995" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110">
                  <Phone className="h-4 w-4" />
                  +91 97425 88995
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* G. ABOUT THE COMPANY / FOUNDER                           */}
      {/* ======================================================== */}
      <section className="homepage-leadership relative isolate overflow-hidden border-b border-[#f2e4d6] bg-[#fffaf4] py-14 sm:py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="homepage-leadership__corner absolute -right-52 -top-72 hidden h-[680px] w-[760px] rotate-[-18deg] rounded-[45%] bg-gradient-to-br from-[#FFD25D] via-[#FF9C00] to-[#F45B0B] lg:block" />
          <svg className="absolute bottom-0 right-0 hidden h-48 w-[65%] opacity-60 lg:block" viewBox="0 0 1000 220" preserveAspectRatio="none">
            <path d="M0 200h1000v20H0z" fill="#F7C46B" opacity=".35" />
            <path d="M540 182v-30h12v30h10v-56h13v-23h6V84h6v19h8v23h14v56h14v-41h12v41h14v-65h12v-35h7V60h5V44h5v16h7v35h12v65h16v-25h10v25h14v-54h12v-27h6V57h5V38h5v19h7v27h11v54h14v44h15v-31h12v31h15v-64h13v-29h6V69h5V52h5v17h7v29h12v56h14v28h22v-45h14v45h14V97h11V72h6V55h5v17h7v25h12v63h15v22z" fill="#f3bd65" opacity=".58" />
            <path d="M0 220c188-43 290-13 441-26 145-12 234-80 354-71 77 6 127 49 205 35v62z" fill="#352a23" opacity=".76" />
            <path d="M0 220c188-43 290-13 441-26 145-12 234-80 354-71 77 6 127 49 205 35" fill="none" stroke="#FFB900" strokeWidth="5" opacity=".9" />
            <path d="M570 191c123-46 233-75 430-67" fill="none" stroke="#fff4d8" strokeWidth="4" strokeDasharray="22 17" opacity=".9" />
          </svg>
          <svg className="absolute bottom-0 left-0 hidden h-28 w-[42%] lg:block" viewBox="0 0 700 120" preserveAspectRatio="none">
            <path d="M0 38c145 64 254 72 373 47 102-21 211-31 327 1v34H0z" fill="#FFB900" opacity=".6" />
            <path d="M0 73c142 48 231 53 353 30 134-25 243-17 347 17H0z" fill="#F45B0B" opacity=".9" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1580px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto w-full max-w-[520px]"
          >
            <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-br from-[#FFB900] via-[#F45B0B] to-[#D94308] opacity-90 blur-[1px]" />
            <div className="relative min-h-[500px] overflow-hidden rounded-[27px] border border-white/30 bg-[#171717] p-6 text-white shadow-[0_28px_70px_rgba(47,30,18,0.3)] sm:min-h-[550px] sm:p-8">
              <img
                src={VEHICLE_IMAGES.crysta}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#080808]/90 via-[#101010]/75 to-[#171717]/70" />
              <div className="relative z-10 flex min-h-[450px] flex-col justify-between sm:min-h-[486px]">
                <div>
                  <Quote className="mb-3 h-12 w-12 fill-[#F45B0B] text-[#F45B0B]" />
                  <span className="text-sm font-extrabold uppercase tracking-wide text-[#FFB900]">
                    Executive Commitment
                  </span>
                  <p className="mt-4 max-w-md text-base font-medium italic leading-7 text-white/90 sm:text-lg sm:leading-8">
                    “Every guest deserves a spotless vehicle, an impeccably trained chauffeur, and absolute peace of mind.”
                  </p>
                  <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#FFB900]" />
                  <div className="mt-5">
                    <h3 className="font-heading text-xl font-extrabold text-white sm:text-2xl">Vikramaditya Rao</h3>
                    <p className="mt-1 text-sm font-medium text-white/70 sm:text-base">
                      Founder &amp; Chief Executive Officer
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 divide-x divide-[#F45B0B]/70 rounded-2xl border border-[#F45B0B]/40 bg-black/35 px-3 py-4 backdrop-blur-sm sm:px-5">
                  <div className="flex flex-col items-center justify-center gap-1 pr-2 text-center">
                    <div className="flex items-center gap-2 text-[#FFB900]">
                      <Car className="h-6 w-6" />
                      <strong className="font-heading text-2xl font-black sm:text-3xl">10K+</strong>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/85 sm:text-sm">Completed Trips</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 pl-2 text-center">
                    <div className="flex items-center gap-2 text-[#FFB900]">
                      <Clock className="h-6 w-6" />
                      <strong className="font-heading text-2xl font-black sm:text-3xl">99.8%</strong>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/85 sm:text-sm">On-Time Record</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative space-y-6 lg:pb-3"
          >
            <span className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#FFD68E] bg-[#FFF1D2] px-5 py-2 text-[13px] font-extrabold tracking-wide text-[#D94308] shadow-sm sm:text-sm">
              <Users className="h-5 w-5" />
              LEADERSHIP &amp; VISION
            </span>

            <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.08] tracking-[-0.04em] text-[#171717]">
              Pioneering Safety &amp; Integrity in
              <span className="homepage-leadership__highlight relative block text-[#F45B0B]">Indian Mobility</span>
            </h2>

            <p className="max-w-4xl text-[15px] font-medium leading-7 text-[#62666d] sm:text-[17px] sm:leading-8">
              Founded with a mission to eliminate surge anxiety and transport unreliability, Orange Cars was established to provide institutional corporate fleets and discerning private travelers with chauffeur service of international caliber.
            </p>

            <div className="grid gap-4 xl:grid-cols-2">
              <article className="flex gap-4 rounded-[22px] border border-[#F5DDB8] bg-white/90 p-4 shadow-[0_12px_28px_rgba(60,40,18,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-[#F4B358] hover:shadow-[0_16px_34px_rgba(60,40,18,0.1)] sm:p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0CC] text-[#F45B0B]">
                  <Target className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-extrabold leading-tight text-[#171717] sm:text-xl">Our Core Vision</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62666d] sm:text-base">
                    To deliver frictionless, verified, and eco-conscious mobility that respects passenger time, ensures driver dignity, and fosters corporate efficiency.
                  </p>
                </div>
              </article>

              <article className="flex gap-4 rounded-[22px] border border-[#F5DDB8] bg-white/90 p-4 shadow-[0_12px_28px_rgba(60,40,18,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-[#F4B358] hover:shadow-[0_16px_34px_rgba(60,40,18,0.1)] sm:p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0CC] text-[#F45B0B]">
                  <BarChart3 className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-extrabold leading-tight text-[#171717] sm:text-xl">Experience &amp; Operational Excellence</h3>
                  <p className="mt-2 text-sm leading-6 text-[#62666d] sm:text-base">
                    Over a decade of logistics leadership, managing 10,000+ flawless intercity journeys and maintaining a 99.8% on-time dispatch record across South India's busiest transit corridors.
                  </p>
                </div>
              </article>
            </div>

            <div className="pt-1">
              <Link to="/about" className="btn-primary min-h-[58px] text-sm !px-7 !py-3.5 shadow-[0_12px_24px_rgba(217,67,8,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(217,67,8,0.28)] sm:text-base">
                <span>Read Full Company Story</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* H. CLIENT TESTIMONIALS (Carousel)                        */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="badge-pill-red mb-3">Verified Traveler Reviews</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Trusted by <span className="text-accentOrange">Discerning Guests</span>
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-xl">
                Authentic testimonials from corporate directors, frequent flyers, and family vacationers who choose Orange Cars.
              </p>
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTestimonial(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 text-charcoal hover:bg-gray-100 flex items-center justify-center shadow-sm transition-all"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTestimonial(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))}
                className="w-11 h-11 rounded-full bg-accentOrange text-white hover:bg-[#D94308] flex items-center justify-center shadow-md transition-all"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              TESTIMONIALS[activeTestimonial],
              TESTIMONIALS[(activeTestimonial + 1) % TESTIMONIALS.length]
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="luxury-card p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, sidx) => (
                      <Star key={sidx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-base text-charcoal italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brandRed/20"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-base text-charcoal">{review.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{review.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* I. FREQUENTLY ASKED QUESTIONS (Accordion)                */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="badge-pill-orange mb-3">Clear &amp; Transparent Answers</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Frequently Asked <span className="text-accentOrange">Questions</span>
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Everything you need to know about our luxury booking, tariffs, fleet options, and policies.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, fidx) => {
              const isOpen = openFaq === fidx;
              return (
                <div
                  key={fidx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-brandRed bg-brandRed/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : fidx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-heading font-bold text-base text-charcoal">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-brandRed text-white rotate-180' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-6 sm:px-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* J. FINAL CTA BANNER                                      */}
      {/* ======================================================== */}
      <section className="relative mb-12 mx-4 sm:mx-8 lg:mx-12 rounded-2xl py-12 sm:py-14 bg-gradient-to-r from-[#D94308] via-[#F45B0B] to-[#FFB900] text-white overflow-hidden">
        {/* Automotive Background */}
        <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
          <img
            src="/images/fleet/mercedes-vip.jpg"
            alt="Orange Cars Chauffeur Experience"
            className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.1]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#D94308]/95 via-[#F45B0B]/80 to-[#F45B0B]/35" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <span className="badge-pill-orange text-xs">Reserve In Seconds</span>

            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Your Next <span className="text-[#FFB900]">Journey Starts Here.</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
              Book your next ride with Orange Cars and experience transportation without compromise.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => openBookingModal()}
                className="btn-primary text-xs sm:text-sm !py-2.5 !px-6 shadow-glow-red"
              >
                <span>Book Your Ride</span>
              </button>

              <Link
                to="/contact"
                className="btn-outline-white text-xs sm:text-sm !py-2.5 !px-6"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-gray-400 pt-1">
              24/7 Telephone Hotline: <a href="tel:+919742588995" className="text-white font-semibold underline underline-offset-4">+91 97425 88995</a>
            </p>
          </div>

          {/* Right: Car Image */}
          <div className="flex-shrink-0 hidden lg:block w-[300px]">
            <img
              src="/images/fleet/innova-hycross.jpg"
              alt="Orange Cars Premium Fleet"
              className="w-full h-[200px] rounded-xl shadow-2xl border border-white/10 object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
