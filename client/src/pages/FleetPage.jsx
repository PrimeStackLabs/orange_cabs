import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Luggage, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  X,
  Phone,
  CheckCircle2,
  Car,
  Wind,
  Fuel,
  Info
} from 'lucide-react';
import api from '../services/api';
import { useBookingModal } from '../context/BookingModalContext';
import { VEHICLE_IMAGES, VEHICLE_IMAGE_FALLBACK } from '../constants/vehicleImages';

const FILTER_TABS = [
  'All Fleet',
  'Sedans',
  'Toyota Innova',
  'SUVs',
  'Luxury VIP',
  'Tempo & Coaches'
];

const DEFAULT_FLEET = [
  {
    id: 'f-1',
    name: 'Maruti Dzire / Honda City',
    category: 'Sedans',
    model: 'Premium Sedan',
    image: VEHICLE_IMAGES.dzire,
    seatingCapacity: 4,
    luggageCapacity: 2,
    fuelType: 'CNG / Petrol',
    ac: true,
    perKmRate: 13,
    baseFare: 800,
    features: ['Plush Ergonomic Seats', 'Dual Airbags & ABS', 'Fast Mobile Charger', 'Pristine Sanitized Cabin'],
    description: 'Perfect for swift intra-city corporate travel, daily commutes, and economical outstation trips.'
  },
  {
    id: 'f-2',
    name: 'Skoda Superb / Toyota Camry',
    category: 'Sedans',
    model: 'Executive Sedan',
    image: VEHICLE_IMAGES.superb,
    seatingCapacity: 4,
    luggageCapacity: 3,
    fuelType: 'Petrol / Hybrid',
    ac: true,
    perKmRate: 18,
    baseFare: 1500,
    features: ['Rear Executive Armrest', 'Sun Blinds & Quiet Cabin', 'Bottled Spring Water', 'High Speed Wi-Fi'],
    description: 'Designed for corporate CXOs and boardroom travelers who value hushed comfort and executive poise.'
  },
  {
    id: 'f-3',
    name: 'Toyota Innova Crysta ZX',
    category: 'Toyota Innova',
    model: 'Toyota Innova Crysta',
    image: VEHICLE_IMAGES.crysta,
    seatingCapacity: 7,
    luggageCapacity: 4,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 22,
    baseFare: 1800,
    features: ['Captain Comfort Seats', 'Independent Roof AC', 'Superior Highway Ride', 'Premium Sound'],
    description: 'The indisputable king of Indian highways. Generous legroom, robust highway safety, and supreme comfort.'
  },
  {
    id: 'f-4',
    name: 'Toyota Innova Hycross Hybrid',
    category: 'Toyota Innova',
    model: 'Toyota Innova Hycross',
    image: VEHICLE_IMAGES.hycross,
    seatingCapacity: 7,
    luggageCapacity: 4,
    fuelType: 'Petrol Hybrid',
    ac: true,
    perKmRate: 24,
    baseFare: 2000,
    features: ['Ottoman Executive Lounge', 'Panoramic Glass Roof', 'Whisper Silent EV Drive', 'JBL Surround Sound'],
    description: 'Ultra-modern monocoque architecture with ottoman recliner legrests and whisper-quiet hybrid cruising.'
  },
  {
    id: 'f-5',
    name: 'Toyota Fortuner 4x4 Luxury',
    category: 'SUVs',
    model: 'Toyota Fortuner',
    image: VEHICLE_IMAGES.fortuner,
    seatingCapacity: 7,
    luggageCapacity: 4,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 28,
    baseFare: 2600,
    features: ['Commanding High View', 'All-Terrain 4x4 Ride', 'Leather Upholstery', 'Dual Climate Zones'],
    description: 'Imposing road presence and all-terrain prowess for hill stations, wildlife resorts, and delegation security convoys.'
  },
  {
    id: 'f-6',
    name: 'BMW X5 / Audi Q7 Chauffeur',
    category: 'Luxury VIP',
    model: 'Luxury SUV',
    image: VEHICLE_IMAGES.bmwX5,
    seatingCapacity: 5,
    luggageCapacity: 4,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 48,
    baseFare: 4500,
    features: ['Air Suspension Comfort', 'Panoramic Ambient Lighting', 'VIP Boardroom Standard', 'Trained Uniformed Chauffeur'],
    description: 'Unrivaled luxury and German engineering prestige for celebrity visits, VIP summits, and high-profile milestones.'
  },
  {
    id: 'f-7',
    name: 'Mercedes-Benz E-Class VIP',
    category: 'Luxury VIP',
    model: 'Mercedes-Benz',
    image: VEHICLE_IMAGES.mercedesEClass,
    seatingCapacity: 4,
    luggageCapacity: 3,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 52,
    baseFare: 5000,
    features: ['Burmester Sound System', 'Chilled Refreshments', 'White-Glove Etiquette', 'Celebrity Protocol Service'],
    description: 'The pinnacle of chauffeured luxury. Impeccable sound insulation, supple Nappa leather, and discreet service.'
  },
  {
    id: 'f-8',
    name: 'Force Urbania Executive Cruiser',
    category: 'Tempo & Coaches',
    model: 'Tempo Traveller',
    image: VEHICLE_IMAGES.urbania,
    seatingCapacity: 13,
    luggageCapacity: 12,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 28,
    baseFare: 3200,
    features: ['Individual Air Vents', 'Individual Recliners', 'High Roof Walkthrough', 'Smart TV & PA System'],
    description: 'European-standard group transport with individual reclining seats, panoramic windows, and generous boot space.'
  },
  {
    id: 'f-9',
    name: 'BharatBenz AC Tourist Coach',
    category: 'Tempo & Coaches',
    model: 'Luxury Mini Bus',
    image: VEHICLE_IMAGES.bharatbenzCoach,
    seatingCapacity: 26,
    luggageCapacity: 25,
    fuelType: 'Diesel',
    ac: true,
    perKmRate: 45,
    baseFare: 5500,
    features: ['Pneumatic Air Suspension', 'Wide Velvet Pushback Seats', 'Overhead Luggage Racks', 'First Aid & Speed Governor'],
    description: 'Comfortable air-suspended coaches tailored for corporate offsites, wedding parties, and educational delegations.'
  }
];

export default function FleetPage() {
  const { openBookingModal } = useBookingModal();
  const [activeTab, setActiveTab] = useState('All Fleet');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filteredFleet = activeTab === 'All Fleet'
    ? DEFAULT_FLEET
    : DEFAULT_FLEET.filter(v => v.category === activeTab);

  return (
    <div className="pt-24 pb-20 bg-[#F7F7F7] text-charcoal">
      
      {/* Page Header */}
      <section className="page-hero-surface relative py-20 sm:py-24 text-white overflow-hidden text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="badge-pill-orange">Automotive Excellence</span>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Our Luxury Fleet
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Every vehicle in our roster is maintained to the highest safety and sanitation standards, driven exclusively by verified professional chauffeurs.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[72px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-[#101010] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Cards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="luxury-card overflow-hidden flex flex-col group"
              >
                {/* Vehicle Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#101010]/90 text-white backdrop-blur-md">
                      {vehicle.model}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-4 px-3 py-1 rounded-xl bg-white/95 text-charcoal font-bold text-xs shadow-sm">
                    ₹{vehicle.perKmRate} / km
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-charcoal group-hover:text-brandRed transition-colors">
                      {vehicle.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {vehicle.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-gray-100 text-xs text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-accentOrange" />
                        <span>{vehicle.seatingCapacity} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Luggage className="w-3.5 h-3.5 text-brandRed" />
                        <span>{vehicle.luggageCapacity} Bags</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-sky-500" />
                        <span>Climate AC</span>
                      </div>
                    </div>

                    {/* Features preview */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {vehicle.features.map((feat, fidx) => (
                        <span key={fidx} className="text-[11px] px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Base Rate</span>
                      <strong className="text-sm font-bold text-charcoal">₹{vehicle.baseFare}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-charcoal hover:border-gray-300 transition-colors"
                        title="View Full Specifications"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openBookingModal({ cabType: vehicle.name, category: vehicle.model })}
                        className="btn-primary text-xs font-bold !py-2.5 !px-5"
                      >
                        <span>Book Ride</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="badge-pill-red">{selectedVehicle.model}</span>
                  <h3 className="font-heading font-black text-2xl text-charcoal mt-2">
                    {selectedVehicle.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {selectedVehicle.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400 block">Capacity</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.seatingCapacity} Passengers</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Luggage</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.luggageCapacity} Bags</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Fuel Engine</span>
                    <strong className="text-charcoal font-semibold">{selectedVehicle.fuelType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Per Km Rate</span>
                    <strong className="text-brandRed font-semibold">₹{selectedVehicle.perKmRate} / km</strong>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Amenities &amp; Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    {selectedVehicle.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Estimated Tariff</span>
                    <strong className="text-base font-bold text-charcoal">₹{selectedVehicle.baseFare} base</strong>
                  </div>

                  <button
                    onClick={() => {
                      const veh = selectedVehicle;
                      setSelectedVehicle(null);
                      openBookingModal({ cabType: veh.name, category: veh.model });
                    }}
                    className="btn-primary text-xs sm:text-sm !py-2.5 !px-6"
                  >
                    <span>Book This Vehicle</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
