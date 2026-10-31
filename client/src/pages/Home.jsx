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
  Check
} from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import { useBookingModal } from '../context/BookingModalContext';
import api from '../services/api';
import { VEHICLE_IMAGES, VEHICLE_IMAGE_FALLBACK } from '../constants/vehicleImages';

// 9 Required Fleet Vehicles
const FLEET_DATA = [
  {
    id: 'premium-sedan',
    name: 'Maruti Dzire / Honda City',
    category: 'Premium Sedan',
    image: VEHICLE_IMAGES.dzire,
    passengers: 4,
    luggage: 2,
    ac: true,
    price: '₹13 / km',
    baseFare: '₹800 base',
    features: ['Plush Ergonomic Seats', 'Dual Airbags & ABS', 'Fast USB Charger', 'Pristine Sanitized Cabin'],
    popular: false
  },
  {
    id: 'executive-sedan',
    name: 'Skoda Superb / Toyota Camry',
    category: 'Executive Sedan',
    image: VEHICLE_IMAGES.superb,
    passengers: 4,
    luggage: 3,
    ac: true,
    price: '₹18 / km',
    baseFare: '₹1,500 base',
    features: ['Rear Executive Armrest', 'Sun Blinds & Quiet Cabin', 'Bottled Spring Water', 'High Speed Wi-Fi'],
    popular: true
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta ZX',
    category: 'Toyota Innova Crysta',
    image: VEHICLE_IMAGES.crysta,
    passengers: 7,
    luggage: 4,
    ac: true,
    price: '₹22 / km',
    baseFare: '₹1,800 base',
    features: ['Captain Comfort Seats', 'Independent Roof AC', 'Superior Highway Balance', 'Premium Sound'],
    popular: true
  },
  {
    id: 'innova-hycross',
    name: 'Toyota Innova Hycross Hybrid',
    category: 'Toyota Innova Hycross',
    image: VEHICLE_IMAGES.hycross,
    passengers: 7,
    luggage: 4,
    ac: true,
    price: '₹24 / km',
    baseFare: '₹2,000 base',
    features: ['Ottoman Executive Lounge', 'Panoramic Roof View', 'Whisper Silent EV Drive', 'JBL Surround Sound'],
    popular: false
  },
  {
    id: 'toyota-fortuner',
    name: 'Toyota Fortuner 4x4 Luxury',
    category: 'Toyota Fortuner',
    image: VEHICLE_IMAGES.fortuner,
    passengers: 7,
    luggage: 4,
    ac: true,
    price: '₹28 / km',
    baseFare: '₹2,600 base',
    features: ['Commanding High View', 'All-Terrain 4x4 Ride', 'Leather Upholstery', 'Dual Climate Zones'],
    popular: false
  },
  {
    id: 'luxury-suv',
    name: 'BMW X5 / Audi Q7 Chauffeur',
    category: 'Luxury SUV',
    image: VEHICLE_IMAGES.bmwX5,
    passengers: 5,
    luggage: 4,
    ac: true,
    price: '₹48 / km',
    baseFare: '₹4,500 base',
    features: ['Air Suspension Comfort', 'Panoramic Ambient Lighting', 'VIP Boardroom Standard', 'Trained Uniformed Chauffeur'],
    popular: false
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz E-Class VIP',
    category: 'Mercedes-Benz',
    image: VEHICLE_IMAGES.mercedesEClass,
    passengers: 4,
    luggage: 3,
    ac: true,
    price: '₹52 / km',
    baseFare: '₹5,000 base',
    features: ['Burmester Sound System', 'Chilled Refreshments', 'White-Glove Etiquette', 'Celebrity Protocol Service'],
    popular: false
  },
  {
    id: 'tempo-traveller',
    name: 'Force Urbania Executive Cruiser',
    category: 'Tempo Traveller',
    image: VEHICLE_IMAGES.urbania,
    passengers: 13,
    luggage: 12,
    ac: true,
    price: '₹28 / km',
    baseFare: '₹3,200 base',
    features: ['Individual Air Vents', 'Individual Recliners', 'High Roof Walkthrough', 'Smart TV & Mic System'],
    popular: false
  },
  {
    id: 'luxury-mini-bus',
    name: 'BharatBenz AC Tourist Coach',
    category: 'Luxury Mini Bus',
    image: VEHICLE_IMAGES.bharatbenzCoach,
    passengers: 26,
    luggage: 25,
    ac: true,
    price: '₹45 / km',
    baseFare: '₹5,500 base',
    features: ['Pneumatic Air Suspension', 'Wide Velvet Pushback Seats', 'Overhead Luggage Racks', 'First Aid & Speed Governor'],
    popular: false
  }
];

// 6 Required Services
const SERVICES_DATA = [
  {
    id: 'corporate-ets',
    title: 'Corporate Employee Transportation',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    description: 'Tech-enabled safe, punctual employee commutes for IT hubs and multinationals with automated GPS tracking and 24/7 control room.',
    badge: 'Enterprise Choice',
    link: '/corporate'
  },
  {
    id: 'airport-transfer',
    title: 'Airport Pickup & Drop',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
    description: 'Guaranteed curbside meet-and-greet at Kempegowda International Airport with automatic flight tracking and zero cancellation guarantee.',
    badge: 'Zero Surge',
    link: '/airport'
  },
  {
    id: 'outstation-travel',
    title: 'Outstation Travel',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=900&q=80',
    description: 'Scenic intercity journeys across Mysore, Coorg, Ooty, Chikmagalur, and Chennai with highway-expert certified chauffeurs.',
    badge: 'Most Popular',
    link: '/outstation'
  },
  {
    id: 'one-way-drop',
    title: 'One-Way Drop',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    description: 'Pay only for one-way distance with zero return fare penalties for swift intercity travel between major business corridors.',
    badge: 'Economical',
    link: '/outstation'
  },
  {
    id: 'wedding-events',
    title: 'Wedding & Event Transportation',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    description: 'Luxury bridal Mercedes sedans, VIP guest convoys, and coordinated group shuttles for grand destination celebrations.',
    badge: 'Luxury Convoy',
    link: '/services'
  },
  {
    id: 'vip-chauffeur',
    title: 'VIP Chauffeur Services',
    image: '/images/fleet/mercedes-vip.jpg',
    description: 'White-glove executive chauffeur service for C-suite directors, high-profile delegations, and diplomats with non-disclosure protocol.',
    badge: 'White Glove',
    link: '/services'
  }
];

// Testimonials
const TESTIMONIALS = [
  {
    name: 'Karthik Subramanian',
    company: 'VP Engineering, Tech Global',
    comment: 'Orange Cabs has handled our international client delegations for 3 years. The Innova Crystas are spotlessly maintained, and chauffeurs always arrive 15 minutes ahead of schedule.',
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
    comment: 'I take early morning flights twice a week. With Orange Cabs, I never experience driver cancellations or airport surge pricing. Truly a gold standard in automotive transport.',
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
    a: 'Absolutely. Orange Cabs manages enterprise employee transportation (ETS), daily office shuttles, executive boardroom chauffeur cars, and event mobility for 100+ corporate clients with centralized billing, GST compliance, and GPS telematics.'
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

export default function Home() {
  const { openBookingModal } = useBookingModal();

  // Testimonial Carousel Index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // FAQ Accordion Active Index
  const [openFaq, setOpenFaq] = useState(0);

  // Stats Counter Animation
  const [counts, setCounts] = useState({ customers: 0, trips: 0, punctuality: 0, partners: 0 });
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const statsElem = document.getElementById('stats-section');
      if (statsElem) {
        const rect = statsElem.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          setStatsVisible(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1600;
    const frameRate = 30;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        customers: Math.round(ease * 500),
        trips: Math.round(ease * 10000),
        punctuality: (ease * 99.8).toFixed(1),
        partners: Math.round(ease * 100)
      });

      if (frame >= totalFrames) clearInterval(timer);
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [statsVisible]);

  return (
    <div className="bg-[#F7F7F7] text-[#242424] overflow-hidden">
      
      {/* ======================================================== */}
      {/* B. CINEMATIC AUTOMOTIVE HERO SECTION                     */}
      {/* ======================================================== */}
      <section className="page-hero-surface relative min-h-[95vh] lg:min-h-screen flex flex-col justify-between text-white pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Hero Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 lg:pt-16">
          <div className="max-w-2xl space-y-6">
            
            {/* Trust Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="badge-pill-orange inline-flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5 text-accentOrange" />
              <span>South India's Premier Mobility Company</span>
            </motion.div>

            {/* Left-Aligned Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white"
            >
              Every Journey <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandRed via-accentOrange to-amber-400">
                Deserves Excellence.
              </span>
            </motion.h1>

            {/* Short Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl"
            >
              Experience premium cab services with professional chauffeurs, exceptional comfort, and reliable transportation across every destination.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => openBookingModal()}
                className="btn-primary text-sm sm:text-base !py-3.5 !px-8 shadow-glow-red"
              >
                <span>Book Your Ride</span>
              </button>

              <a
                href="#fleet-section"
                className="btn-outline-white text-sm sm:text-base !py-3.5 !px-7"
              >
                <span>Explore Our Fleet</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Small Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-xs text-gray-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Chauffeurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accentOrange shrink-0" />
                <span>99.8% On-Time</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brandRed shrink-0" />
                <span>Fixed Transparent Tariff</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-sky-400 shrink-0" />
                <span>24/7 Command Support</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Luxury Hero Booking Widget */}
        <div className="relative z-20 max-w-7xl mx-auto w-full mt-10">
          <BookingWidget />
        </div>
      </section>

      {/* ======================================================== */}
      {/* C. TRUST STATISTICS SECTION                              */}
      {/* ======================================================== */}
      <section id="stats-section" className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#101010]">
                {counts.customers}+
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mt-1">
                Happy Customers
              </p>
            </motion.div>

            {/* Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-accentOrange/10 text-accentOrange flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#101010]">
                {counts.trips}+
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mt-1">
                Successful Trips
              </p>
            </motion.div>

            {/* Stat Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#101010]">
                {counts.punctuality}%
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mt-1">
                On-Time Reliability
              </p>
            </motion.div>

            {/* Stat Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#101010]">
                {counts.partners}+
              </h3>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 mt-1">
                Corporate Partners
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* D. PREMIUM FLEET SHOWCASE                                */}
      {/* ======================================================== */}
      <section id="fleet-section" className="py-20 sm:py-28 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="badge-pill-red mb-3">World-Class Automotive Roster</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Find Your Perfect Ride
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-xl">
                Travel in comfort and style with our carefully selected fleet. Real photography, transparent tariffs, and immaculate vehicle maintenance.
              </p>
            </div>

            <Link
              to="/fleet"
              className="btn-outline-dark text-xs sm:text-sm self-start md:self-end"
            >
              <span>View Full Fleet Specs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 9 Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FLEET_DATA.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="luxury-card overflow-hidden flex flex-col group"
              >
                {/* Real Vehicle Image Area */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#101010]/90 text-white backdrop-blur-md">
                      {vehicle.category}
                    </span>
                  </div>

                  {vehicle.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brandRed text-white shadow-md">
                        Executive Pick
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-4 px-3 py-1 rounded-xl bg-white/95 text-charcoal font-bold text-xs shadow-sm">
                    {vehicle.price}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-brandRed transition-colors">
                      {vehicle.name}
                    </h3>
                    
                    {/* Specifications */}
                    <div className="grid grid-cols-3 gap-2 py-3 mt-2 border-y border-gray-100 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-accentOrange" />
                        <span>{vehicle.passengers} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-brandRed" />
                        <span>{vehicle.luggage} Bags</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-sky-500" />
                        <span>Climate AC</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                      {vehicle.features.slice(0, 2).map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Starting From</span>
                      <strong className="text-sm font-bold text-charcoal">{vehicle.baseFare}</strong>
                    </div>

                    <button
                      onClick={() => openBookingModal({ cabType: vehicle.name, category: vehicle.category })}
                      className="btn-primary text-xs font-bold !py-2.5 !px-5"
                    >
                      <span>Book This Ride</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* E. SERVICES SECTION                                      */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill-orange mb-3">Comprehensive Mobility Solutions</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
              Crafted For Every Occasion
            </h2>
            <p className="mt-3 text-base text-gray-600">
              From corporate daily rosters to VIP airport delegations, Orange Cabs delivers bespoke transportation services backed by punctuality and hospitality.
            </p>
          </div>

          {/* 6 Professional Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, idx) => (
              <motion.div
                key={service.id}
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-pill-red !bg-white/90 !text-brandRed !border-none shadow-sm backdrop-blur-sm">
                      {service.badge}
                    </span>
                  </div>
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

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={service.link}
                      className="text-xs font-bold text-gray-700 hover:text-brandRed flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openBookingModal({ serviceType: service.title })}
                      className="btn-accent text-xs font-bold !py-2 !px-4"
                    >
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* F. WHY CHOOSE Orange Cabs? (Split Layout)                 */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#F7F7F7]">
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
              <span className="badge-pill-red">The Orange Cabs Difference</span>
              
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Setting The Benchmark In Premium Mobility
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
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
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
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

      {/* ======================================================== */}
      {/* G. CORPORATE TRANSPORTATION SECTION (Dark Background)   */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#101010] text-white relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brandRed/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accentOrange/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="badge-pill-orange">Enterprise Mobility Hub</span>
              
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                Your Trusted Corporate Mobility Partner
              </h2>

              <p className="text-base text-gray-300 leading-relaxed max-w-xl">
                Streamline employee transit, executive business trips, and client delegations with enterprise-grade mobility solutions built for operational scale.
              </p>

              {/* 6 Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  'Employee transportation (ETS)',
                  'Enterprise mobility management',
                  'Kempegowda Airport transfers',
                  'Monthly consolidated GST billing',
                  'Dedicated account manager',
                  'Customized travel solutions'
                ].map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accentOrange/20 text-accentOrange flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </div>
                    <span className="text-sm text-gray-200 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openCorporateProposal'))}
                  className="btn-accent text-sm sm:text-base !py-3.5 !px-8 shadow-glow-orange"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Request Corporate Proposal</span>
                </button>

                <a
                  href="tel:+919742588995"
                  className="btn-outline-white text-sm sm:text-base !py-3.5 !px-7"
                >
                  <Phone className="w-4 h-4" />
                  <span>Speak to Key Accounts</span>
                </a>
              </div>
            </div>

            {/* Corporate Fleet SLA Console */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-7 bg-[#181818] border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-bold text-accentOrange uppercase tracking-wider">Enterprise Mobility SLA</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Tier-1 Certified
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white font-bold block text-sm">20-Minute Replacement Guarantee</strong>
                    <span className="text-gray-400 mt-0.5 block">Dedicated reserve vehicles stationed on standby near major tech hubs.</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white font-bold block text-sm">100% Statutory &amp; Police Compliance</strong>
                    <span className="text-gray-400 mt-0.5 block">Background-verified chauffeurs with annual biometric and health clearance.</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white font-bold block text-sm">Centralized GST &amp; MIS Invoicing</strong>
                    <span className="text-gray-400 mt-0.5 block">Automated trip logs, route telemetry, and itemized monthly invoices.</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
                  <span>Duty Manager Hotline:</span>
                  <a href="tel:+919742588995" className="text-white font-bold hover:text-accentOrange transition-colors">
                    +91 97425 88995
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* H. ABOUT THE COMPANY / FOUNDER                           */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Executive Statement Box (No Personal Photo) */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-8 bg-[#101010] text-white shadow-2xl border border-gray-800 space-y-6 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brandRed to-accentOrange flex items-center justify-center text-white shadow-glow-red">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-accentOrange block">
                    Executive Commitment
                  </span>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    "Every guest deserves a spotless vehicle, an impeccably trained chauffeur, and absolute peace of mind."
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="font-heading font-black text-lg text-white">Vikramaditya Rao</h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Founder &amp; Chief Executive Officer
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-brandRed font-black text-lg block">10k+</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider">Completed Trips</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-accentOrange font-black text-lg block">99.8%</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider">On-Time Record</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Vision */}
            <div className="lg:col-span-7 space-y-6">
              <span className="badge-pill-orange">Leadership &amp; Vision</span>
              
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Pioneering Safety &amp; Integrity in Indian Mobility
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                Founded with a mission to eliminate surge anxiety and transport unreliability, Orange Cabs was established to provide institutional corporate fleets and discerning private travelers with chauffeur service of international caliber.
              </p>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-heading font-bold text-sm text-charcoal mb-1">Our Core Vision</h4>
                  <p className="text-xs text-gray-500">
                    To deliver frictionless, verified, and eco-conscious mobility that respects passenger time, ensures driver dignity, and fosters corporate efficiency.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-heading font-bold text-sm text-charcoal mb-1">Experience &amp; Operational Excellence</h4>
                  <p className="text-xs text-gray-500">
                    Over a decade of logistics leadership, managing 10,000+ flawless intercity journeys and maintaining a 99.8% on-time dispatch record across South India's busiest transit corridors.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/about"
                  className="btn-primary text-xs sm:text-sm !py-3 !px-6"
                >
                  <span>Read Full Company Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* I. CLIENT TESTIMONIALS (Carousel)                        */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="badge-pill-red mb-3">Verified Traveler Reviews</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#101010] tracking-tight">
                Trusted by Discerning Guests
              </h2>
              <p className="mt-3 text-base text-gray-600 max-w-xl">
                Authentic testimonials from corporate directors, frequent flyers, and family vacationers who choose Orange Cabs.
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
                className="w-11 h-11 rounded-full bg-[#101010] text-white hover:bg-black flex items-center justify-center shadow-md transition-all"
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
      {/* J. FREQUENTLY ASKED QUESTIONS (Accordion)                */}
      {/* ======================================================== */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="badge-pill-orange mb-3">Clear &amp; Transparent Answers</span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#101010] tracking-tight">
              Frequently Asked Questions
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
      {/* K. FINAL CTA BANNER                                      */}
      {/* ======================================================== */}
      <section className="relative mb-12 mx-6 sm:mx-10 lg:mx-16 rounded-2xl py-12 sm:py-14 bg-[#101010] text-white overflow-hidden">
        {/* Automotive Background */}
        <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
          <img
            src="/images/fleet/mercedes-vip.jpg"
            alt="Orange Cabs Chauffeur Experience"
            className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.1]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101010]/95 via-[#101010]/75 to-[#101010]/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <span className="badge-pill-orange text-xs">Reserve In Seconds</span>

            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Your Next Journey Starts Here.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
              Book your next ride with Orange Cabs and experience transportation without compromise.
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
              alt="Orange Cabs Premium Fleet"
              className="w-full h-[200px] rounded-xl shadow-2xl border border-white/10 object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
