import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  Zap, 
  CheckCircle2, 
  Gauge, 
  Wifi, 
  Volume2
} from 'lucide-react';
import ThreeTiltCard from './ThreeTiltCard';
import { useBookingModal } from '../context/BookingModalContext';

const LUXURY_VEHICLES = [
  {
    id: 'ev-sedan',
    name: 'Electric Executive Sedan',
    model: 'Tata Tigor EV / BYD e6 Chauffeur',
    category: 'Electric Vehicle (EV)',
    badge: '100% Zero Emission',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    seats: 4,
    luggage: 3,
    perKmRate: 14,
    baseFare: 750,
    range: '315 KM Single Charge',
    features: ['Whisper Silent Ride', 'Dual Fast USB C', 'Dual Airbags + ABS', 'Live Telematics & SOS', 'Climate Control'],
    image: '/images/fleet/honda-city.png',
    description: 'Eco-conscious executive commuting with zero tailpipe emissions, hushed cabin acoustics, and high cost-efficiency.'
  },
  {
    id: 'exec-sedan',
    name: 'Executive Business Sedan',
    model: 'Maruti Suzuki Dzire / Honda Amaze',
    category: 'Executive Sedan',
    badge: 'Airport & Corporate Choice',
    badgeColor: 'bg-orange/20 text-orange border-orange/30',
    seats: 4,
    luggage: 3,
    perKmRate: 13,
    baseFare: 800,
    range: 'High Mileage CNG/Petrol',
    features: ['Spacious Boot Capacity', 'Dual Zone Cooling', 'Highway Expert Driver', 'Clean Leatherette Trim', 'Complimentary Water Bottle'],
    image: '/images/fleet/executive-sedan.jpg',
    description: 'The definitive standard for airport runs, client meetings, and smooth daily city commutes.'
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta ZX',
    model: 'Innova Crysta 2.4L Intercity King',
    category: 'Premium MPV',
    badge: 'Karnataka Highway Benchmark',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    seats: 7,
    luggage: 4,
    perKmRate: 22,
    baseFare: 1600,
    range: 'Supreme Highway Balance',
    features: ['Captain Recliner Seats', 'Dedicated Roof AC Vents', 'Rear USB Chargers', 'Bottle Chillers', 'Large High-Deck Boot'],
    image: '/images/fleet/innova-crysta.jpg',
    description: 'Legendary reliability, exceptional shock absorption, and first-rate legroom for outstation tours and corporate delegations.'
  },
  {
    id: 'innova-hycross',
    name: 'Toyota Innova Hycross Hybrid',
    model: 'Hycross Self-Charging Hybrid Electric',
    category: 'Luxury Hybrid',
    badge: 'Ottoman VIP Lounge',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    seats: 7,
    luggage: 4,
    perKmRate: 25,
    baseFare: 1900,
    range: 'Self-Charging EV Hybrid',
    features: ['Ottoman Powered Calf-Rests', 'Panoramic Dual Sunroof', 'Silent EV Mode Crawl', 'JBL Audio Acoustics', 'Ambient Glow Lights'],
    image: '/images/fleet/innova-hycross.jpg',
    description: 'Next-generation luxury hybrid MPV delivering royal business-class comfort for VIP transfers and elite corporate delegations.'
  },
  {
    id: 'urbania-cruiser',
    name: 'Force Urbania Executive Cruiser',
    model: 'Urbania 13-Seater VIP Lounge',
    category: 'Group Luxury Traveller',
    badge: 'European Engineering',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    seats: 13,
    luggage: 10,
    perKmRate: 28,
    baseFare: 2500,
    range: 'Mercedes-Derived Engine',
    features: ['Individual Air Vents & USB', 'Independent Recliners', 'Full Standing High Roof', 'Smart LED Screen & Mic', 'Massive Luggage Hold'],
    image: '/images/fleet/urbania-cruiser.jpg',
    description: 'European-standard luxury traveller engineered for company retreats, executive offsites, and destination wedding parties.'
  },
  {
    id: 'mercedes-vip',
    name: 'Mercedes-Benz E-Class VIP',
    model: 'E-Class Chauffeur Limousine',
    category: 'Ultra-Luxury VIP',
    badge: 'White-Glove Protocol',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    seats: 4,
    luggage: 3,
    perKmRate: 48,
    baseFare: 3800,
    range: 'German Precision Luxury',
    features: ['Uniformed Protocol Chauffeur', 'Burmester Surround Sound', 'Bottled Evian Water & Mints', 'High-Speed Wi-Fi Hotspot', 'Nappa Leather Interior'],
    image: '/images/fleet/mercedes-vip.jpg',
    description: 'The pinnacle of prestige and executive status for dignitary visits, boardroom summits, and high-profile celebrations.'
  }
];

export default function VehicleShowcase3D() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const { openBookingModal } = useBookingModal();
  const prefersReducedMotion = useReducedMotion();

  const vehicle = LUXURY_VEHICLES[selectedIdx];

  const handleRotate = () => {
    setIsRotating(true);
    setRotationAngle((prev) => (prev + 5) % 35);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <section className="fleet-showcase-section relative isolate overflow-hidden border-y py-20 text-[#1a1a1a] sm:py-24">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-orange/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-green/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="fleet-showcase-eyebrow mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em]"
          >
            <Sparkles className="w-4 h-4 text-orange" />
            The Orange Cars Collection
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl font-black tracking-tight text-[#131314] sm:text-4xl lg:text-5xl"
          >
            Find your <span className="fleet-showcase-title-accent">perfect ride</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#5b534d] sm:text-lg"
          >
            From everyday executive journeys to VIP travel, explore a fleet maintained for comfort, safety, and dependable arrivals.
          </motion.p>
        </div>

        {/* Vehicle Category Selector Pills */}
        <div className="fleet-selector mb-10 flex flex-wrap items-center justify-center gap-2.5 p-2 sm:mb-12">
          {LUXURY_VEHICLES.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setSelectedIdx(idx)}
              aria-pressed={selectedIdx === idx}
              className={`fleet-selector-button flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                selectedIdx === idx
                  ? 'fleet-selector-button-active'
                  : 'fleet-selector-button-idle'
              }`}
            >
              {v.id === 'ev-sedan' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
              {v.name}
            </button>
          ))}
        </div>

        {/* 3D Showcase Stage Grid */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-7">
          
          {/* Left Column: 3D Perspective Visualizer Stage */}
          <div className="lg:col-span-7">
            <ThreeTiltCard
              maxTilt={4}
              className="fleet-visual-card group relative overflow-hidden rounded-[2rem] p-4 sm:p-6 lg:p-7"
            >
              {/* Virtual Stage Pedestal Rings */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
                <div className="h-[320px] w-[320px] animate-spin rounded-full border border-orange/20 sm:h-[460px] sm:w-[460px]" style={{ animationDuration: '35s' }} />
                <div className="absolute h-[240px] w-[240px] animate-spin rounded-full border border-dashed border-orange/20 sm:h-[360px] sm:w-[360px]" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
              </div>

              {/* Status Header */}
              <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold backdrop-blur-xl sm:text-xs ${vehicle.badgeColor}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {vehicle.badge}
                </span>

                <button
                  onClick={handleRotate}
                  title="Rotate Perspective"
                  className="fleet-angle-button flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-orange ${isRotating ? 'animate-spin' : ''}`} />
                  3D Angle ({rotationAngle}°)
                </button>
              </div>

              {/* Vehicle Hero Image with 3D Depth */}
              <div className="fleet-image-stage relative z-10 my-4 flex h-64 w-full items-center justify-center overflow-hidden rounded-[1.5rem] sm:h-80 lg:h-[390px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1, rotateY: prefersReducedMotion ? 0 : rotationAngle }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: 'easeOut'
                    }}
                    style={{ transformPerspective: 1000, transformOrigin: 'center' }}
                    className="absolute inset-0 h-full w-full"
                  >
                    <motion.img
                      src={vehicle.image}
                      alt={vehicle.name}
                      animate={prefersReducedMotion ? { scale: 1 } : { scale: [1, 1.02, 1] }}
                      transition={prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 8, ease: 'easeInOut', repeat: Infinity }}
                      className="h-full w-full rounded-[1.5rem] object-cover shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Holographic Telematics Pill */}
                <div className="fleet-gps-pill absolute bottom-3 left-3 flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold sm:bottom-4 sm:left-4 sm:text-xs">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#4A775F]" />
                  Live GPS & OBD-II Active
                </div>
              </div>

              {/* Bottom Quick Spec Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-[#e5d9d2]/80 pt-4 text-center sm:gap-3">
                <div className="fleet-spec-tile fleet-spec-tile-seats relative overflow-hidden rounded-2xl p-3 sm:p-4">
                  <span aria-hidden="true" className="fleet-spec-watermark">01</span>
                  <div className="relative z-10">
                    <span className="fleet-spec-icon"><Users className="h-4 w-4 text-orange" /></span>
                    <span className="block text-xs font-bold text-[#1d1b1a] sm:text-sm">{vehicle.seats} Seater</span>
                    <span className="text-[10px] text-[#655d59] sm:text-xs">Executive Capacity</span>
                  </div>
                </div>
                <div className="fleet-spec-tile fleet-spec-tile-luggage relative overflow-hidden rounded-2xl p-3 sm:p-4">
                  <span aria-hidden="true" className="fleet-spec-watermark">02</span>
                  <div className="relative z-10">
                    <span className="fleet-spec-icon"><Briefcase className="h-4 w-4 text-orange" /></span>
                    <span className="block text-xs font-bold text-[#1d1b1a] sm:text-sm">{vehicle.luggage} Bags</span>
                    <span className="text-[10px] text-[#655d59] sm:text-xs">Full Boot Space</span>
                  </div>
                </div>
                <div className="fleet-spec-tile fleet-spec-tile-rate relative overflow-hidden rounded-2xl p-3 sm:p-4">
                  <span aria-hidden="true" className="fleet-spec-watermark">03</span>
                  <div className="relative z-10">
                    <span className="fleet-spec-icon"><Gauge className="h-4 w-4 text-[#4A775F]" /></span>
                    <span className="block text-xs font-bold text-[#1d1b1a] sm:text-sm">₹{vehicle.perKmRate}/km</span>
                    <span className="text-[10px] text-[#655d59] sm:text-xs">Base ₹{vehicle.baseFare}</span>
                  </div>
                </div>
              </div>
            </ThreeTiltCard>
          </div>

          {/* Right Column: Spec Highlights & Booking Card */}
          <div className="lg:col-span-5">
            <div className="fleet-info-card flex h-full flex-col justify-center space-y-6 rounded-[2rem] p-6 sm:p-8 lg:p-9">
              
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                  {vehicle.category}
                </span>
                <h3 className="mt-2 font-heading text-2xl font-black leading-tight text-[#171513] sm:text-3xl">
                  {vehicle.model}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#564d47] sm:text-base">
                  {vehicle.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3 border-t border-[#e5d9d2] pt-5">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6e625a]">
                  Premium Cabin Amenities:
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#2d2927] sm:text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-orange" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Booking CTA */}
              <div className="flex flex-col items-start justify-between gap-4 border-t border-[#e5d9d2] pt-5 sm:flex-row sm:items-center">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-[#72675f]">Transparent Tariff</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-[#171513] font-heading">₹{vehicle.perKmRate}</span>
                    <span className="text-xs text-[#72675f]">/ km (Zero Surge)</span>
                  </div>
                </div>

                <button
                  onClick={() => openBookingModal(vehicle)}
                  className="fleet-reserve-button group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-glow-orange transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-orange-lg active:scale-[0.98] sm:w-auto"
                >
                  Reserve This Vehicle
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Compliance Assurance */}
              <div className="fleet-compliance flex items-center gap-3 rounded-2xl p-3.5 text-xs leading-relaxed">
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-[#4A775F]" />
                <span>RTO Commercial Yellow Board • Comprehensive Commercial Insurance • Police Verified Chauffeur</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
