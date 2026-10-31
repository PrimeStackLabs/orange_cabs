import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Plane, 
  Compass, 
  Clock, 
  HeartHandshake, 
  Bus, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Car,
  Check,
  Phone
} from 'lucide-react';
import { useBookingModal } from '../context/BookingModalContext';

const DETAILED_SERVICES = [
  {
    id: 'corporate-ets',
    title: 'Corporate Employee Transportation',
    subtitle: 'Enterprise mobility & shift rostering',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    description: 'Safe, punctual, tech-driven roster commuting for tech parks and IT enterprises with GPS telematics, seat-belt tracking, and 24/7 centralized dispatch.',
    features: [
      '100% Police Verified Drivers',
      'Real-Time Telematics & Geofencing',
      'Dedicated 24/7 Operations Command Desk',
      'Monthly Consolidated GST Billing'
    ],
    pricing: 'Customized corporate monthly contracts',
    badge: 'Enterprise Choice'
  },
  {
    id: 'airport-pickup',
    title: 'Airport Pickup & Drop',
    subtitle: 'Kempegowda Int. Airport (BLR) 24/7 transfers',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
    description: 'Terminal curbside meet-and-greet with flight delay synchronization. We track your flight live and adjust chauffeur arrival with zero cancellation anxiety.',
    features: [
      'Zero Cancellation Guarantee',
      'Automatic Flight Delay Adjustment',
      'Terminal 1 & Terminal 2 Curbside Meet & Greet',
      'Generous Luggage Space Assistance'
    ],
    pricing: 'Fixed tariffs starting from ₹999 all-inclusive',
    badge: 'Zero Surge'
  },
  {
    id: 'outstation-travel',
    title: 'Outstation Travel',
    subtitle: 'Intercity journeys across South India',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=900&q=80',
    description: 'Scenic expressway journeys to Mysore, Coorg, Ooty, Chikmagalur, Chennai, and Hyderabad with verified highway-expert chauffeurs.',
    features: [
      'Pay Only For Actual Kms Driven',
      'Experienced Ghat & Highway Chauffeurs',
      'Full Vehicle Sanitization Before Each Tour',
      'Flexible Multi-Day Itineraries'
    ],
    pricing: 'Starting from ₹13/km (Sedan) & ₹22/km (Innova)',
    badge: 'Most Popular'
  },
  {
    id: 'one-way-drop',
    title: 'One-Way Drop',
    subtitle: 'Point-to-point intercity travel',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    description: 'Pay solely for the one-way distance between major cities without paying for the vehicle’s return journey. Cost-efficient and ultra-fast.',
    features: [
      'Zero Return Distance Penalties',
      'Doorstep Pickup and Direct Drop',
      'Available On All Major Karnataka Routes',
      'Express Highway Toll Invoicing'
    ],
    pricing: 'Fixed point-to-point packages',
    badge: 'Economical'
  },
  {
    id: 'wedding-events',
    title: 'Wedding & Event Transportation',
    subtitle: 'Luxury bridal cars and guest convoys',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    description: 'Mercedes-Benz bridal sedans, coordinated Tempo Traveller guest shuttles, and decorated convoys for seamless destination wedding hospitality.',
    features: [
      'Groomed Chauffeurs in Formal Attire',
      'Customized Floral Decoration Assistance',
      'Coordinated Multi-Vehicle Convoy Dispatch',
      'On-Ground Logistics Marshall Support'
    ],
    pricing: 'Full-day wedding packages',
    badge: 'Luxury Convoy'
  },
  {
    id: 'vip-chauffeur',
    title: 'VIP Chauffeur Services',
    subtitle: 'White-glove executive chauffeur mobility',
    image: '/images/fleet/mercedes-vip.jpg',
    description: 'High-protocol chauffeur services for dignitaries, boardroom executives, and international delegates with certified confidentiality.',
    features: [
      'Mercedes-Benz E-Class & BMW Executive Fleets',
      'Chauffeurs Trained in Executive Protocol',
      'Bottled Refreshments & Wi-Fi Onboard',
      'Strict Privacy & Non-Disclosure Adherence'
    ],
    pricing: 'Hourly & Daily Chauffeur Retainers',
    badge: 'White Glove'
  }
];

export default function ServicesPage() {
  const { openBookingModal } = useBookingModal();

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">Transportation Portfolio</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Our Transportation Services
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tailored mobility solutions crafted for enterprise reliability, executive comfort, and effortless leisure journeys.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {DETAILED_SERVICES.map((service, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="luxury-card overflow-hidden p-6 sm:p-10 border border-gray-200"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Image Column */}
                  <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/fleet/innova-crysta.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="badge-pill-red !bg-white/95 !border-none !text-brandRed shadow-sm">
                          {service.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-7 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-accentOrange block">
                      {service.subtitle}
                    </span>
                    
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
                      {service.title}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {service.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">Pricing Framework</span>
                        <strong className="text-sm font-bold text-charcoal">{service.pricing}</strong>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openBookingModal({ serviceType: service.title })}
                          className="btn-primary text-xs sm:text-sm !py-2.5 !px-6 shadow-glow-red"
                        >
                          <span>Book This Service</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-charcoal">
            Need a Customized Itinerary or Corporate Fleet?
          </h2>
          <p className="text-sm text-gray-600">
            Our 24/7 travel desk can tailor bespoke packages for multi-city travel, delegate airport protocols, and event fleets.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+919742588995"
              className="btn-primary text-xs sm:text-sm !py-3 !px-6"
            >
              <Phone className="w-4 h-4" />
              <span>Call Helpline: +91 97425 88995</span>
            </a>

            <button
              onClick={() => openBookingModal()}
              className="btn-outline-dark text-xs sm:text-sm !py-3 !px-6"
            >
              <span>Instant Online Booking</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
